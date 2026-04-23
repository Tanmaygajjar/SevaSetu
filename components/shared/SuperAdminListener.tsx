'use client';

import { useEffect } from 'react';
import { useSuperAdminStore } from '@/stores/superAdminStore';

export function SuperAdminListener() {
  const { showLoginModal, setShowLoginModal, isActive, activate, deactivate, isImpersonating, impersonatedUser, stopImpersonation } = useSuperAdminStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        if (isActive) {
          deactivate();
        } else {
          setShowLoginModal(true);
        }
      }
      if (e.key === 'Escape' && isActive) {
        deactivate();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, deactivate, setShowLoginModal]);

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={() => setShowLoginModal(false)}>
          <div
            className="w-80 rounded-xl p-6"
            style={{ background: '#0A0A0A', border: '1px solid #222' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs mb-4" style={{ color: '#666', fontFamily: 'monospace' }}>Developer Access</p>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg text-sm mb-3"
              style={{ background: '#111', border: '1px solid #333', color: '#eee' }}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 rounded-lg text-sm mb-4"
              style={{ background: '#111', border: '1px solid #333', color: '#eee' }}
            />
            <button
              onClick={activate}
              className="w-full py-2 rounded-lg text-sm font-medium"
              style={{ background: '#DC2626', color: 'white' }}
            >
              Enter Dev Mode
            </button>
          </div>
        </div>
      )}

      {/* Active badge */}
      {isActive && (
        <div
          className="fixed bottom-4 right-4 z-[100] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
          style={{ background: '#DC2626', color: 'white', boxShadow: '0 4px 16px rgba(220,38,38,0.4)' }}
          onClick={deactivate}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          SUPER ADMIN MODE
        </div>
      )}

      {/* Impersonation banner */}
      {isImpersonating && impersonatedUser && (
        <div
          className="fixed top-0 left-0 right-0 z-[99] py-1 text-center text-xs font-medium flex items-center justify-center gap-3"
          style={{ background: '#DC2626', color: 'white' }}
        >
          <span>IMPERSONATING {impersonatedUser.name} — {impersonatedUser.role}</span>
          <button
            onClick={stopImpersonation}
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            Stop Impersonating
          </button>
        </div>
      )}
    </>
  );
}
