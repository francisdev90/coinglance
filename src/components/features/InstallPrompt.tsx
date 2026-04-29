"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "cg_pwa_dismissed";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios/i.test(ua);
    if (ios) {
      setIsIOS(true);
      // Show iOS prompt after a short delay on mobile
      setTimeout(() => setIsVisible(true), 3000);
      return;
    }

    // Listen for the Chrome/Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    dismiss();
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-accent-gold/30 bg-bg-card-dark shadow-2xl shadow-black/50 p-4">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1 rounded-md text-text-secondary-dark hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center flex-shrink-0">
            {isIOS
              ? <Share className="w-5 h-5 text-accent-gold" />
              : <Download className="w-5 h-5 text-accent-gold" />
            }
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-0.5">Install CoinGlance</p>
            {isIOS ? (
              <p className="text-xs text-text-secondary-dark leading-relaxed">
                Tap{" "}
                <span className="inline-flex items-center gap-0.5 font-semibold text-accent-gold">
                  <Share className="w-3 h-3" /> Share
                </span>
                {" "}then{" "}
                <span className="font-semibold text-white">Add to Home Screen</span>
                {" "}for offline access & faster loading.
              </p>
            ) : (
              <p className="text-xs text-text-secondary-dark leading-relaxed">
                Install for offline access, faster loading, and a native app experience.
              </p>
            )}
          </div>
        </div>

        {!isIOS && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-border-dark">
            <button
              onClick={dismiss}
              className="flex-1 py-2 rounded-lg text-xs font-semibold text-text-secondary-dark hover:text-white border border-border-dark hover:border-border-dark/80 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2 rounded-lg text-xs font-bold bg-accent-gold text-bg-dark hover:bg-accent-gold/90 transition-colors"
            >
              Install
            </button>
          </div>
        )}

        {isIOS && (
          <button
            onClick={dismiss}
            className="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-text-secondary-dark hover:text-white border border-border-dark transition-colors"
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}
