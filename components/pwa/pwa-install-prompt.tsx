"use client";

import * as React from "react";
import { Download, X, Laptop, Smartphone, CheckCircle2, Share2, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [showIosGuide, setShowIosGuide] = React.useState(false);
  const [installSuccess, setInstallSuccess] = React.useState(false);

  React.useEffect(() => {
    // 1. Register service worker for offline capability and PWA compliance
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("[InterviewX PWA] Service worker registration error:", err);
      });
    }

    // 2. Check if already installed or running in standalone app window
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - iOS Safari legacy standalone flag
      window.navigator.standalone === true;

    const storedInstalled = localStorage.getItem("ivx_pwa_installed") === "true";

    if (isStandalone || storedInstalled) {
      setIsInstalled(true);
      return; // Do not show banner if already installed!
    }

    // 3. Detect iOS devices (Safari doesn't fire beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Check if user recently dismissed the banner (within 3 days)
    const dismissedAt = localStorage.getItem("ivx_pwa_dismissed");
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) {
        return; // Don't annoy the user repeatedly
      }
    }

    // 5. Capture beforeinstallprompt event (Chrome, Edge, Android, Opera, Brave)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay prompt appearance by 2.5 seconds so user first sees the landing page
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    };

    // 6. Capture appinstalled event (fired when installation completes)
    const handleAppInstalled = () => {
      localStorage.setItem("ivx_pwa_installed", "true");
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const handleCustomOpen = () => {
      setShowBanner(true);
      if (!deferredPrompt) {
        setShowIosGuide(true);
      }
    };
    window.addEventListener("ivx-open-pwa-install", handleCustomOpen);

    // If on iOS or browsers where prompt event doesn't fire, show install banner after delay
    let fallbackTimer: NodeJS.Timeout | null = null;
    if (isIosDevice && !storedInstalled && !isStandalone) {
      fallbackTimer = setTimeout(() => {
        setShowBanner(true);
      }, 3500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("ivx-open-pwa-install", handleCustomOpen);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    // If iOS Safari, display the 2-step home screen guide
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    // Standard native PWA installation prompt
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          localStorage.setItem("ivx_pwa_installed", "true");
          setIsInstalled(true);
          setShowBanner(false);
          setDeferredPrompt(null);
          setInstallSuccess(true);
          setTimeout(() => setInstallSuccess(false), 5000);
        } else {
          // User cancelled the prompt dialog
          localStorage.setItem("ivx_pwa_dismissed", Date.now().toString());
          setShowBanner(false);
        }
      } catch (err) {
        console.error("[InterviewX PWA] Install prompt failed:", err);
      }
    } else {
      // Browser didn't expose prompt, trigger manual guide
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("ivx_pwa_dismissed", Date.now().toString());
    setShowBanner(false);
    setShowIosGuide(false);
  };

  if (isInstalled && !installSuccess) {
    return null;
  }

  return (
    <>
      {/* Success Notification after install */}
      {installSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-card/95 backdrop-blur-md shadow-2xl text-xs text-foreground animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-foreground">InterviewX App Installed!</p>
            <p className="text-muted-foreground text-[11px]">
              You can now launch InterviewX directly from your desktop or home screen.
            </p>
          </div>
        </div>
      )}

      {/* Main Install Prompt Banner */}
      {showBanner && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-md w-auto animate-in slide-in-from-bottom-6 duration-300">
          <div className="p-4 sm:p-5 rounded-2xl border border-brand-500/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-brand-950/50 flex flex-col gap-3 relative">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss install prompt"
              className="absolute top-3.5 right-3.5 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Header */}
            <div className="flex items-start gap-3 pr-6">
              <div className="relative shrink-0 mt-0.5">
                <img
                  src="/icon.svg"
                  alt="InterviewX App Icon"
                  className="w-10 h-10 rounded-xl p-1 bg-brand-950/60 border border-brand-500/40 shadow-sm"
                />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20">
                    App Available
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <Laptop className="w-3 h-3" /> / <Smartphone className="w-3 h-3" />
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  Install InterviewX to Device
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Download InterviewX as a native app for faster loading, isolated code execution, and fullscreen assessment mode.
                </p>
              </div>
            </div>

            {/* iOS Specific Instructions if triggered */}
            {showIosGuide && (
              <div className="p-3 rounded-xl bg-muted/60 border border-border text-[11px] text-muted-foreground space-y-1.5 animate-in fade-in duration-200">
                <p className="font-semibold text-foreground flex items-center gap-1">
                  How to install on iOS Safari:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Tap the <Share2 className="w-3 h-3 inline text-brand-400" /> <strong>Share</strong> button in Safari's toolbar.
                  </li>
                  <li>
                    Scroll down and tap <PlusSquare className="w-3 h-3 inline text-brand-400" /> <strong>Add to Home Screen</strong>.
                  </li>
                </ol>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-medium text-xs shadow-lg shadow-brand-500/25 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / Install App</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl border border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
