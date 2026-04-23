'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import toast from 'react-hot-toast';

export function GlobalTranslator() {
  const pathname = usePathname();
  const { currentLanguage } = useUIStore();
  const lastPathRef = useRef(pathname);
  const isTranslatingRef = useRef(false);

  useEffect(() => {
    // If language is English, do nothing
    if (currentLanguage === 'en') return;

    const translatePage = async () => {
      if (isTranslatingRef.current) return;
      isTranslatingRef.current = true;

      const toastId = toast.loading(`Auto-translating to ${currentLanguage.toUpperCase()}...`);
      
      try {
        // Find all visible text elements
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, button, label');
        
        // We'll process them in batches to avoid overwhelming the API
        const batchSize = 5;
        const arrayElements = Array.from(elements).filter(el => {
          const text = (el as HTMLElement).innerText?.trim();
          return text && text.length > 3 && !el.querySelector('svg');
        });

        for (let i = 0; i < arrayElements.length; i += batchSize) {
          const batch = arrayElements.slice(i, i + batchSize);
          await Promise.all(batch.map(async (el) => {
            try {
              const res = await fetch('/api/ai/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  text: (el as HTMLElement).innerText,
                  source_language: 'en-IN',
                  target_language: currentLanguage + '-IN'
                })
              });
              const data = await res.json();
              if (data.translatedText) (el as HTMLElement).innerText = data.translatedText;
            } catch (err) {
              console.error('Translation error for element:', err);
            }
          }));
        }
        toast.success('Page translated!', { id: toastId });
      } catch (error) {
        console.error('Global translation error:', error);
        toast.error('Translation sync failed.', { id: toastId });
      } finally {
        isTranslatingRef.current = false;
      }
    };

    // Run translation on mount or when pathname changes
    const timer = setTimeout(translatePage, 1000); // Small delay to let page render
    return () => clearTimeout(timer);
  }, [pathname, currentLanguage]);

  return null;
}
