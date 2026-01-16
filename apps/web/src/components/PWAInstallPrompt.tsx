"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install button
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);

    console.log(`User response to the install prompt: ${outcome}`);
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Install TrickTrack</p>
        <p className="text-xs text-gray-300">
          Install our app for the best experience - works offline!
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => void handleInstallClick()}
            className="flex-1 min-h-[44px] px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 font-semibold"
          >
            Install
          </button>
          <button
            onClick={() => setShowInstallButton(false)}
            className="flex-1 min-h-[44px] px-4 py-2 border border-white rounded-md hover:bg-gray-900 font-semibold"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
