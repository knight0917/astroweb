"use client";

import React, { useEffect, useState } from "react";

export default function PwaRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Only register in browser and production / supported environments
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Listen for new service worker installation
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // A new update is ready!
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Check if there is already a waiting worker
          if (reg.waiting && navigator.serviceWorker.controller) {
            setWaitingWorker(reg.waiting);
            setUpdateAvailable(true);
          }

          // Check for updates on page visibility change
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              reg.update().catch(() => {});
            }
          });
        })
        .catch((err) => {
          console.warn("PWA Service Worker registration failed:", err);
        });

      // Reload page once new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // Capture PWA Install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install prompt toast once if not already installed
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {/* 🚀 New Update Notification Banner */}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-[999999] max-w-sm w-full bg-slate-900/95 border-2 border-amber-400 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2.5">
            <span className="text-xl animate-bounce">🚀</span>
            <div>
              <h4 className="font-extrabold text-xs text-slate-100">
                New Update Available!
              </h4>
              <p className="text-[10px] text-slate-400">
                A newer version of Vedic Sky is ready.
              </p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            Update Now
          </button>
        </div>
      )}

      {/* 📲 PWA Install Prompt Banner (Shown on initial visit) */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 z-[999999] max-w-sm w-full bg-slate-900/95 border border-slate-700 p-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">📲</span>
            <div>
              <h4 className="font-bold text-xs text-slate-100">
                Install Vedic Sky App
              </h4>
              <p className="text-[10px] text-slate-400">
                Add to Home Screen for fast offline access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInstall}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="w-6 h-6 rounded-full text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}