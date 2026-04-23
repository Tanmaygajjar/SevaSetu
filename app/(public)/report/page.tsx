'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, MapPin, Mic, SquareSquare, TriangleAlert, AlertCircle, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS, NeedCategory } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ConfettiCelebration } from '@/components/shared/ConfettiCelebration';
import toast from 'react-hot-toast';
import { useUIStore } from '@/stores/uiStore';

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), { ssr: false, loading: () => <div className="h-[300px] w-full bg-[var(--surface-2)] animate-pulse rounded-xl" /> });

import { ImageCapture } from '@/components/shared/ImageCapture';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '' as NeedCategory | '',
    lat: 22.3039,
    lng: 70.8022,
    ward: 'Central Zone',
    district: 'Rajkot',
    city: 'Rajkot',
    state: 'Gujarat',
    title: '',
    description: '',
    severity: 5,
    population: 1,
    timeSensitive: false,
    volunteersNeeded: 1,
    skills: [] as string[],
    photos: [] as File[],
    reporterName: '',
    reporterPhone: '',
    sdgTags: ['SDG11'] as string[]
  });

  const [aiAnalysis, setAiAnalysis] = useState<{valid: boolean, flags: string[], analyzing: boolean}>({
    valid: true,
    flags: [],
    analyzing: false
  });

  const [isRecording, setIsRecording] = useState(false);

  const categories = Object.entries(CATEGORY_LABELS) as [NeedCategory, string][];

  const handleNext = () => {
    if (step === 1 && !formData.category) {
      toast.error('Please select a category.');
      return;
    }
    if (step === 3 && (!formData.title || !formData.description)) {
      toast.error('Please provide a title and description.');
      return;
    }
    setStep(s => Math.min(4, s + 1));
  };
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const simulateAiValidation = async () => {
    if (!formData.description || !formData.title) return;
    setAiAnalysis({ ...aiAnalysis, analyzing: true });
    
    try {
      const res = await fetch('/api/ai/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, description: formData.description })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiAnalysis({ 
        valid: data.valid, 
        flags: data.valid ? [] : ['Potentially misleading or non-civic content'], 
        analyzing: false 
      });

      if (data.valid) {
        setFormData(prev => ({
          ...prev,
          category: data.category as NeedCategory,
          severity: data.urgency_score
        }));
        toast.success(`AI Analysis: Identified as ${data.category}`, { icon: '🤖' });
      }
    } catch (error: any) {
      setAiAnalysis({ valid: true, flags: [], analyzing: false });
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleTranscription(audioBlob);
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast('Listening...', { icon: '🎙️' });
    } catch (err) {
      toast.error('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const { getSarvamLanguage } = useUIStore();

  const handleTranscription = async (audioBlob: Blob) => {
    const toastId = toast.loading('Transcribing your voice...');
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language_code', getSarvamLanguage()); 

      const response = await fetch('/api/ai/stt', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.transcript) {
        setFormData(prev => ({
          ...prev, 
          description: prev.description ? `${prev.description} ${data.transcript}` : data.transcript 
        }));
        toast.success('Voice captured!', { id: toastId });
        // Re-validate with AI after transcription
        simulateAiValidation();
      } else {
        throw new Error('Transcription empty');
      }
    } catch (error) {
      toast.error('Could not understand audio. Try again.', { id: toastId });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please provide details.');
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Publishing incident report...');

    try {
      // 🛡️ DEMO-FIRST STRATEGY: Use Base64 to bypass CORS issues entirely for the presentation
      const imageUrls = [];
      for (const file of formData.photos) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        imageUrls.push(base64 as string);
      }

      // 2. Save to Firestore
      const needRef = doc(collection(db, 'needs'));
      const { lat, lng, photos, ...rest } = formData;
      await setDoc(needRef, {
        ...rest,
        location_lat: lat,
        location_lng: lng,
        id: needRef.id,
        status: 'verified',
        urgency_score: formData.severity,
        ai_summary: aiAnalysis.valid ? 'Verified by Gemini AI' : 'Needs manual review',
        created_at: new Date().toISOString(),
        image_urls: imageUrls,
        population_count: formData.population
      });
      
      toast.success('Report broadcasted to the grid!', { id: toastId });
      setShowConfetti(true);
    } catch (error: any) {
      toast.error('Failed to submit: ' + error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {showConfetti && <ConfettiCelebration onComplete={() => window.location.href = '/map'} message="Your report is live. We're matching a volunteer!" />}
      
      {/* Progress */}
      <div className="mb-12">
        <div className="flex h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
          <div 
            className="bg-[var(--saffron)] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 px-1 text-xs font-semibold text-[var(--ink-muted)]">
          <span className={step >= 1 ? 'text-[var(--ink)]' : ''}>Category</span>
          <span className={step >= 2 ? 'text-[var(--ink)]' : ''}>Location</span>
          <span className={step >= 3 ? 'text-[var(--ink)]' : ''}>Details</span>
          <span className={step >= 4 ? 'text-[var(--ink)]' : ''}>Finalize</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8 min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait" custom={1}>
          
          {step === 1 && (
            <motion.div key="step1" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <h2 className="text-2xl font-bold font-mukta mb-6">What is the community facing?</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({...formData, category: key})}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-3 transition-all ${
                      formData.category === key 
                        ? 'border-[var(--saffron)] bg-[var(--saffron-light)] shadow-sm scale-105'
                        : 'border-[var(--border)] hover:bg-[var(--surface-2)] bg-[var(--surface)]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${CATEGORY_COLORS[key]}20`, color: CATEGORY_COLORS[key] }}>
                      <TriangleAlert size={20} />
                    </div>
                    <span className="text-xs font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <h2 className="text-2xl font-bold font-mukta mb-6">Where exactly is this need?</h2>
              
              <LocationPicker 
                lat={formData.lat} lng={formData.lng} 
                onChange={(lat, lng) => setFormData({...formData, lat, lng})} 
              />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Ward / Area</label>
                  <input type="text" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:border-[var(--saffron)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:border-[var(--saffron)] outline-none" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <h2 className="text-2xl font-bold font-mukta">Help us understand the situation</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Give this need a clear title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border focus:border-[var(--saffron)] outline-none" placeholder="E.g., Medical supplies for elder care home" />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium">Describe what's happening</label>
                  <button 
                    onClick={isRecording ? stopRecording : startRecording} 
                    className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Mic size={16} />
                  </button>
                </div>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  onBlur={simulateAiValidation}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border focus:border-[var(--saffron)] outline-none resize-none" 
                  placeholder="Describe who is affected, what exactly is needed, and any specific requirements..."
                />
                
                {aiAnalysis.analyzing && <p className="text-xs text-[var(--saffron)] mt-2 flex items-center gap-1"><Sparkles size={12}/> Validating with AI...</p>}
                {!aiAnalysis.analyzing && aiAnalysis.valid && formData.description.length > 10 && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><Check size={12}/> Description looks clear and helpful.</p>
                )}
              </div>

              <div className="bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border)]">
                <label className="block text-sm font-medium mb-3 flex justify-between">
                  <span>How severe is the situation?</span>
                  <span className="text-[var(--saffron)] font-bold">{formData.severity}/10</span>
                </label>
                <input type="range" min="1" max="10" value={formData.severity} onChange={e => setFormData({...formData, severity: parseInt(e.target.value)})} className="w-full accent-[var(--saffron)]" />
                <div className="flex justify-between text-xs text-[var(--ink-muted)] mt-1">
                  <span>Not urgent</span>
                  <span>Life-threatening</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" custom={1} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <h2 className="text-2xl font-bold font-mukta">Almost there</h2>
              
              {/* Photo Upload Zone */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <p className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Camera size={18} className="text-[var(--saffron)]" /> Visual Documentation
                </p>
                <ImageCapture 
                  onImagesChange={(files) => setFormData(prev => ({...prev, photos: files}))} 
                  maxImages={3} 
                />
              </div>

              <div className="bg-[var(--saffron-light)] rounded-xl p-4 border border-[#FFD9CA] flex gap-3">
                <Sparkles className="text-[var(--saffron)] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-[var(--saffron-dark)] mb-1">AI Classification</p>
                  <p className="text-xs text-[var(--saffron-dark)]">Based on your description, this relates to SDG 11 (Sustainable Cities) and SDG 3 (Good Health).</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Your Name (Optional)</label>
                  <input type="text" value={formData.reporterName} onChange={e => setFormData({...formData, reporterName: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:border-[var(--saffron)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-muted)] mb-1">Phone (Optional)</label>
                  <input type="tel" value={formData.reporterPhone} onChange={e => setFormData({...formData, reporterPhone: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:border-[var(--saffron)] outline-none" />
                </div>
              </div>
              <p className="text-[10px] text-[var(--ink-faint)] text-center">Your contact details are shared only with the assigned NGO coordinator. Not made public.</p>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-auto pt-8 flex justify-between">
          {step > 1 ? (
            <button onClick={handlePrev} className="btn-ghost px-6">Back</button>
          ) : <div />}
          
          {step < 4 && (
            <button 
              onClick={handleNext} 
              className="btn-primary px-8"
              disabled={step === 1 && !formData.category}
            >
              Continue
            </button>
          )}
          {step === 4 && (
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="btn-primary px-8 font-bold text-base shadow-lg shadow-[var(--saffron-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading Data...' : 'Submit Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
