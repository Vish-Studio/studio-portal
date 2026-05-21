import { useCallback, useEffect, useState } from 'react';
import { useUIStore } from '@/src/app/stores/uiStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => isStandalone());
  const showToast = useUIStore(state => state.showToast);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (installed) return;

    if (!installPrompt) {
      const message = isIOS()
        ? 'To install on iPhone or iPad, open Safari, tap Share, then choose Add to Home Screen.'
        : 'Install is not available yet. Open this app from a supported browser menu and choose Install app.';
      showToast({
        status: 'info',
        title: 'Install unavailable',
        message,
      });
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }, [installPrompt, installed, showToast]);

  return {
    canInstall: Boolean(installPrompt) && !installed,
    installed,
    installApp,
  };
}
