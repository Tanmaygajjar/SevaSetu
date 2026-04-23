'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import toast from 'react-hot-toast';

const TRANSLATABLE_SELECTORS = 'h1, h2, h3, h4, h5, h6, p, span, button, label, li, a, td, th, option';
const MAX_BATCH_SIZE = 10; 
const MAX_CHAR_LIMIT = 1500; 

export function GlobalTranslator() {
  const pathname = usePathname();
  const { currentLanguage, getSarvamLanguage } = useUIStore();
  const isTranslatingRef = useRef(false);
  const pendingElementsRef = useRef<Set<HTMLElement>>(new Set());
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const translateBatch = useCallback(async () => {
    if (pendingElementsRef.current.size === 0 || isTranslatingRef.current) return;
    
    isTranslatingRef.current = true;
    const allElements = Array.from(pendingElementsRef.current);
    pendingElementsRef.current.clear();

    console.log(`[GlobalTranslator] Scheduling ${allElements.length} elements for translation.`);

    let currentBatch: HTMLElement[] = [];
    let currentCharCount = 0;

    const processBatch = async (batch: HTMLElement[]) => {
      if (batch.length === 0) return;
      
      const textsToTranslate = batch.map(el => {
        const original = el.getAttribute('data-original-text') || el.innerText.trim();
        if (!el.getAttribute('data-original-text')) el.setAttribute('data-original-text', original);
        return original;
      });

      try {
        const res = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: textsToTranslate,
            source_language: 'en-IN',
            target_language: getSarvamLanguage()
          })
        });
        
        const data = await res.json();
        if (data.translatedTexts && data.translatedTexts.length === batch.length) {
          batch.forEach((el, index) => {
            if (data.translatedTexts[index]) {
              // Safety: ONLY update if the element is still in the DOM and hasn't been replaced
              if (el.isConnected) {
                el.innerText = data.translatedTexts[index];
                el.setAttribute('data-translated-to', currentLanguage);
              }
            }
          });
        }
      } catch (err) {
        console.error('[GlobalTranslator] API error:', err);
      }
    };

    for (const el of allElements) {
      const text = (el.getAttribute('data-original-text') || el.innerText).trim();
      
      if (currentBatch.length >= MAX_BATCH_SIZE || (currentCharCount + text.length) > MAX_CHAR_LIMIT) {
        await processBatch(currentBatch);
        currentBatch = [];
        currentCharCount = 0;
      }
      
      currentBatch.push(el);
      currentCharCount += text.length;
    }

    if (currentBatch.length > 0) {
      await processBatch(currentBatch);
    }

    isTranslatingRef.current = false;
    if (pendingElementsRef.current.size > 0) {
      translationTimeoutRef.current = setTimeout(translateBatch, 200);
    }
  }, [currentLanguage, getSarvamLanguage]);

  const scheduleTranslation = useCallback((el: HTMLElement) => {
    // 🛑 SAFETY CHECKS
    // 1. Skip if specifically excluded
    if (el.hasAttribute('data-no-translate') || el.closest('[data-no-translate]')) return;
    
    // 2. Skip if already translated or too short
    if (el.getAttribute('data-translated-to') === currentLanguage) return;
    const text = el.innerText.trim();
    if (text.length < 2) return;

    // 3. Skip if it has complex children (React components/SVG)
    // Only translate if it's a simple text-carrying element
    if (el.querySelector('svg, img, canvas, .leaflet-container')) return;

    pendingElementsRef.current.add(el);
    
    if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
    translationTimeoutRef.current = setTimeout(translateBatch, 400);
  }, [currentLanguage, translateBatch]);

  useEffect(() => {
    if (currentLanguage === 'en') {
      const elements = document.querySelectorAll('[data-original-text]');
      elements.forEach(el => {
        const original = el.getAttribute('data-original-text');
        if (original) (el as HTMLElement).innerText = original;
        el.removeAttribute('data-translated-to');
      });
      return;
    }

    const initialElements = document.querySelectorAll(TRANSLATABLE_SELECTORS);
    initialElements.forEach(el => scheduleTranslation(el as HTMLElement));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const el = node as HTMLElement;
            if (el.matches(TRANSLATABLE_SELECTORS)) scheduleTranslation(el);
            el.querySelectorAll(TRANSLATABLE_SELECTORS).forEach(child => {
              scheduleTranslation(child as HTMLElement);
            });
          }
        });
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          const target = mutation.target.parentElement;
          if (target && target.matches(TRANSLATABLE_SELECTORS)) {
            scheduleTranslation(target);
          }
        }
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });

    return () => {
      observer.disconnect();
      if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
    };
  }, [currentLanguage, pathname, scheduleTranslation]);

  return null;
}
