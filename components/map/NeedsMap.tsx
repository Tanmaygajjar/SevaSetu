'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Need, CATEGORY_COLORS, SUPPORTED_LANGUAGES } from '@/types';
import { Search, Filter, Layers, Navigation, Sparkles, CheckCircle2, Heart, Shield, MessageSquare, X, MapPin, Mic, Camera } from 'lucide-react';
import { timeAgo, getUrgencyClass } from '@/lib/utils';
import { NeedCard } from '../shared/NeedCard';
import toast from 'react-hot-toast';

function FlyToPoint({ lat, lng, zoom }: { lat: number, lng: number, zoom: number }) {
  const map = useMap();
  map.flyTo([lat, lng], zoom, { duration: 1.5 });
  return null;
}

const createCustomPin = (score: number, category: string) => {
  const color = score >= 8 ? '#DC2626' : score >= 6 ? '#EA580C' : score >= 4 ? '#D97706' : '#16A34A';
  const pulseClass = score >= 8 ? 'critical-pulse' : '';
  
  const html = `<div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${pulseClass}" style="background: ${color}; border: 2px solid white;">
    <div class="w-3 h-3 rounded-full bg-white"></div>
  </div>`;
  
  return new L.DivIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function NeedsMap() {
  const searchParams = useSearchParams();
  const { isAuthenticated, loginAsDemo } = useAuthStore();
  const { currentLanguage, getSarvamLanguage } = useUIStore();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [searchParams]);

  const [needs, setNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const needsRef = collection(db, 'needs');
    let q = query(needsRef, where('status', 'not-in', ['closed', 'completed']));
    
    if (selectedCity) {
      q = query(q, where('city', '==', selectedCity));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const needsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Need[];
      if (needsData.length > 0) {
        setNeeds(needsData);
      } else {
        // Fallback demo data if collection is empty
        setNeeds([
          {
            id: 'm-1', title: 'Need 5 volunteers for Medical Camp', category: 'medical', urgency_score: 8.5, 
            city: 'Rajkot', district: 'Rajkot', ward: 'Central', location_lat: 22.3039, location_lng: 70.8022, 
            severity_rating: 8, population_count: 200, created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'm-2', title: 'Food distribution drive', category: 'food', urgency_score: 9.2, 
            city: 'Rajkot', district: 'Rajkot', ward: 'Mavdi', location_lat: 22.28, location_lng: 70.78, 
            severity_rating: 9, population_count: 500, created_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 'm-3', title: 'Flood relief materials', category: 'disaster_relief', urgency_score: 9.8, 
            city: 'Ahmedabad', district: 'Ahmedabad', ward: 'Riverfront', location_lat: 23.0225, location_lng: 72.5714, 
            severity_rating: 10, population_count: 1000, created_at: new Date(Date.now() - 10800000).toISOString()
          }
        ] as any[]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Real-time sync error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [selectedCity]);

  const filteredNeeds = useMemo(() => {
    if (!needs) return [];
    return needs.filter(n => {
      const hasCoords = typeof n.location_lat === 'number' && typeof n.location_lng === 'number';
      if (!hasCoords) return false;
      
      if (!searchQuery) return true;
      
      return n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             n.ward?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             n.city.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [needs, searchQuery]);

  const handleResolve = () => {
    setIsResolving(true);
    toast.success('Analyzing your location and profile for deployment...', { icon: '⚡' });
  };

  const [isAiSearching, setIsAiSearching] = useState(false);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          categories: ['food', 'medical', 'water_sanitation', 'disaster_relief'] 
        })
      });
      
      const filter = await res.json();
      if (filter.category) {
        toast.success(`AI Filter: Showing ${filter.category} in ${filter.city || 'all cities'}`, { icon: '🤖' });
        // You would apply these filters to your local state here
      }
    } catch (error) {
      console.error('AI Search failed', error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const [isRadarLoading, setIsRadarLoading] = useState(false);
  const [radarInsights, setRadarInsights] = useState<any | null>(null);

  const handleRadar = async () => {
    if (filteredNeeds.length === 0) {
      toast.error('No needs detected on map to scan.');
      return;
    }
    setIsRadarLoading(true);
    const toastId = toast.loading('AI Radar scanning regional needs...', { icon: '📡' });
    
    try {
      const res = await fetch('/api/ai/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ needs: filteredNeeds })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setRadarInsights(data);
      toast.success('AI Radar scan complete. Strategic insights generated.', { id: toastId });
    } catch (error) {
      console.error('Radar failed', error);
      toast.error('AI Radar scan failed.', { id: toastId });
    } finally {
      setIsRadarLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full relative overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-full md:w-[340px] shrink-0 h-1/2 md:h-full bg-white border-r border-[var(--border)] flex flex-col z-[10] shadow-lg relative">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" size={18} />
            <input 
              type="text" 
              placeholder="Search location, ward..." 
              className="w-full pl-10 pr-12 py-2 bg-[var(--surface-2)] rounded-lg text-sm border-none focus:ring-2 focus:ring-[var(--saffron)] transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
            <button 
              onClick={handleAiSearch}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${isAiSearching ? 'bg-[var(--saffron)] text-white animate-pulse' : 'text-[var(--saffron)] hover:bg-[var(--saffron-light)]'}`}
            >
              <Sparkles size={16} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 px-3 bg-[var(--surface-2)] rounded-md text-xs font-medium flex items-center justify-center gap-1 hover:bg-[var(--surface-3)]">
              <Filter size={14} /> Filter
            </button>
            <button 
              onClick={handleRadar}
              disabled={isRadarLoading}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-all ${isRadarLoading ? 'bg-indigo-600 text-white animate-pulse' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <Sparkles size={14} /> {isRadarLoading ? 'Scanning...' : 'AI Radar'}
            </button>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] flex justify-between items-center text-[10px] text-[var(--ink-muted)] font-bold uppercase tracking-widest">
          <span>{filteredNeeds.length} Urgent Needs Detected</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {filteredNeeds.map(need => (
            <div 
              key={need.id} 
              onClick={() => setSelectedNeed(need)}
              className={`cursor-pointer transition-all ${selectedNeed?.id === need.id ? 'ring-2 ring-[var(--saffron)] scale-[1.02]' : ''}`}
            >
              <NeedCard need={need} compact />
            </div>
          ))}
          {filteredNeeds.length === 0 && (
            <div className="text-center py-12 text-[var(--ink-muted)] text-sm">
              <MapPin className="mx-auto mb-2 opacity-20" size={48} />
              No needs match your search.
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-1/2 md:h-full z-0">
        <MapContainer 
          center={[22.5, 80.0]} 
          zoom={5} 
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {selectedNeed && (
            <FlyToPoint lat={selectedNeed.location_lat} lng={selectedNeed.location_lng} zoom={15} />
          )}

          {filteredNeeds.map(need => (
            <Marker 
              key={need.id} 
              position={[need.location_lat, need.location_lng]}
              icon={createCustomPin(need.urgency_score, need.category)}
              eventHandlers={{
                click: () => setSelectedNeed(need),
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <p className="font-bold text-[var(--ink)] mb-1">{need.title}</p>
                  <p className="text-xs text-[var(--ink-muted)] mb-3 flex items-center gap-1"><Navigation size={10} />{need.ward || need.city}</p>
                  <button 
                    onClick={() => setSelectedNeed(need)} 
                    className="w-full py-2 bg-[var(--saffron)] text-white text-[10px] font-bold uppercase rounded-lg shadow-md hover:bg-orange-600 transition-colors"
                  >
                    Review Critical Need
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
           <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] p-1.5 flex flex-col gap-1">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 text-[var(--ink)]"><Layers size={20} /></button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 text-[var(--ink)]"><Navigation size={20} /></button>
           </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedNeed && (
        <div className="absolute top-0 right-0 w-full md:w-[420px] h-full bg-white shadow-2xl z-[500] border-l border-[var(--border)] flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]">
            <div>
              <h3 className="font-bold font-mukta text-lg">Crisis Inspection</h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">Need ID: #{selectedNeed.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={async () => {
                  const toastId = toast.loading('Synthesizing voice...');
                  try {
                    const res = await fetch('/api/ai/tts', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        text: `${selectedNeed.title}. ${selectedNeed.description}`,
                        language_code: 'hi-IN'
                      })
                    });
                    const data = await res.json();
                    if (data.audio) {
                      const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
                      audio.play();
                      toast.success('Playing report audio...', { id: toastId });
                    }
                  } catch (e) {
                    toast.error('Voice synthesis failed.', { id: toastId });
                  }
                }}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-[var(--saffron)] hover:border-[var(--saffron)] transition-all"
                title="Listen to Report"
              >
                <Mic size={18} />
              </button>
              <button onClick={() => setSelectedNeed(null)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-3xl font-light">&times;</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Gallery */}
            {selectedNeed.image_urls && selectedNeed.image_urls.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <Camera size={14} /> Incident Documentation
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedNeed.image_urls.map((url, i) => (
                    <div key={i} className={`rounded-[24px] overflow-hidden border border-slate-100 shadow-sm ${i === 0 && selectedNeed.image_urls.length === 1 ? 'col-span-2' : ''}`}>
                      <img src={url} alt="Incident" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <NeedCard need={selectedNeed} />
            
            <div className="bg-orange-50 border-2 border-orange-100 rounded-[24px] p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 opacity-20 -rotate-12 translate-x-10 -translate-y-10 rounded-full" />
               <h4 className="flex justify-between text-xs font-bold text-orange-700 mb-4 relative z-10">
                  <span className="flex items-center gap-1.5 uppercase tracking-widest"><Sparkles size={14} /> AI Intel</span>
                  <button 
                    onClick={async () => {
                      const sarvamCode = getSarvamLanguage();
                      const langName = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.name || 'Local Language';
                      const toastId = toast.loading(`Translating to ${langName}...`);
                      try {
                        const res = await fetch('/api/ai/translate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            text: selectedNeed.description,
                            source_language: 'en-IN',
                            target_language: sarvamCode
                          })
                        });
                        const data = await res.json();
                        if (data.translatedText) {
                          toast.success('Translated!', { id: toastId });
                          const descElem = document.getElementById('need-desc');
                          if (descElem) descElem.innerText = data.translatedText;
                        }
                      } catch (e) {
                        toast.error('Translation failed.', { id: toastId });
                      }
                    }}
                    className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded text-[9px] uppercase font-black hover:bg-orange-300 transition-colors"
                  >
                    Translate to {currentLanguage.toUpperCase()}
                  </button>
                  <span>Safety Score: {selectedNeed.urgency_score.toFixed(1)}/10</span>
               </h4>
               <p className="text-sm text-orange-800 leading-relaxed relative z-10">
                 Priority classification based on **{selectedNeed.population_count}** affected individuals and a verified severity rating of **{selectedNeed.severity_rating}/10**. 
               </p>
               <div className="mt-4 pt-4 border-t border-orange-100 flex gap-4">
                  <div className="flex-1"><p className="text-[10px] font-bold text-orange-400 uppercase">Response SLA</p><p className="text-sm font-bold text-orange-800">45 Minutes</p></div>
                  <div className="flex-1"><p className="text-[10px] font-bold text-orange-400 uppercase">Trust Level</p><p className="text-sm font-bold text-orange-800">High-Verified</p></div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest">Required Resources</h4>
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[var(--saffron)] shadow-sm"><CheckCircle2 size={16} /></div>
                     <p className="text-xs font-bold">First Aid Kits</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm"><Navigation size={16} /></div>
                     <p className="text-xs font-bold">Field Tents</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-6 border-t bg-white shadow-[0_-10px_50px_rgba(0,0,0,0.05)]">
             <button 
                onClick={handleResolve}
                className="btn-primary w-full py-5 text-lg font-bold shadow-2xl shadow-[var(--saffron-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
             >
               <Shield size={22} fill="white" /> Help Resolve This
             </button>
          </div>
        </div>
      )}

      {/* RESOLUTION FLOW MODAL */}
      {isResolving && selectedNeed && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[var(--ink)]/60 backdrop-blur-md" onClick={() => setIsResolving(false)} />
           <div className="relative bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl p-10 flex flex-col items-center text-center animate-in zoom-in slide-in-from-bottom-12 duration-500">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mb-8"><CheckCircle2 size={56} strokeWidth={1.5} /></div>
              <h2 className="text-3xl font-bold font-mukta text-[var(--ink)] mb-4">Step Into Service</h2>
              <p className="text-[var(--ink-muted)] mb-10 leading-relaxed">
                 You are initializing a **Voluntary Intervention** for: <br/>
                 <span className="text-[var(--ink)] font-bold">"{selectedNeed.title}"</span>
              </p>
              
              <div className="w-full space-y-4 mb-10">
                 <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:border-green-200 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600"><Heart size={20} /></div>
                    <div><p className="text-xs font-bold">Karma Accrual</p><p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">+500 Points Potential</p></div>
                 </div>
                 <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600"><MessageSquare size={20} /></div>
                    <div><p className="text-xs font-bold">Deployment Hub</p><p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Connect with HQ via SevaSetu Chat</p></div>
                 </div>
              </div>

              <div className="flex gap-3 w-full">
                 <button onClick={() => setIsResolving(false)} className="flex-1 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest hover:bg-gray-100 rounded-2xl transition-all">Cancel</button>
                 <button 
                    onClick={() => {
                       // Auto-login as demo volunteer if not authenticated
                       if (!isAuthenticated) {
                          loginAsDemo('volunteer');
                       }
                       setIsResolving(false);
                       setSelectedNeed(null);
                       toast.success('Assigned to mission hub. Proceed to Dashboard!', { duration: 4000 });
                       
                       // Small delay to ensure store update before redirect
                       setTimeout(() => {
                         window.location.href = '/volunteer/dashboard';
                       }, 100);
                    }}
                    className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                 >
                    Confirm Deployment
                 </button>
              </div>
              
              <button 
                onClick={() => setIsResolving(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-2xl text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
           </div>
        </div>
      )}

      {/* AI RADAR INSIGHTS OVERLAY */}
      {radarInsights && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] z-[1000] animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-slate-900 text-white rounded-[32px] shadow-2xl border border-white/10 p-8 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600 opacity-20 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600 opacity-20 blur-3xl rounded-full" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                    <h3 className="text-xl font-bold font-mukta flex items-center gap-2">
                       <Sparkles className="text-indigo-400" size={20} /> AI Strategic Radar
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time predictive intelligence</p>
                 </div>
                 <button onClick={() => setRadarInsights(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">&times;</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
                 <div className="space-y-4">
                    <div>
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[2px] mb-2">Primary Hotspot</h4>
                       <p className="text-sm font-bold">{radarInsights.hotspot}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[2px] mb-2">Emerging Patterns</h4>
                       <ul className="space-y-1.5">
                          {radarInsights.patterns?.map((p: string, i: number) => (
                             <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" /> {p}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-green-400 uppercase tracking-[2px] mb-2">Positive Signal</h4>
                       <p className="text-xs text-slate-300 italic">"{radarInsights.positiveSignal}"</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[2px] mb-2">Cascading Risks</h4>
                       <ul className="space-y-1.5">
                          {radarInsights.risks?.map((r: string, i: number) => (
                             <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" /> {r}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-[2px] mb-3 flex items-center gap-1.5">
                          <Shield size={12} className="text-indigo-400" /> Strategic Action
                       </h4>
                       <ul className="space-y-2">
                          {radarInsights.recommendations?.map((r: string, i: number) => (
                             <li key={i} className="text-[11px] font-medium leading-relaxed text-slate-200">
                                <span className="text-indigo-400 font-bold">#{i+1}</span> {r}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 relative z-10">
                 <button 
                    onClick={() => {
                       toast.success('Strategy dispatched to district command center');
                       setRadarInsights(null);
                    }}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/20"
                 >
                    Dispatch Recommendations
                 </button>
                 <button 
                    onClick={() => setRadarInsights(null)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                 >
                    Dismiss
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
