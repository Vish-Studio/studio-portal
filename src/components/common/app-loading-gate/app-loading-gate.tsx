import { useEffect, useState } from "react";
import { AppLoader } from "../app-loader/app-loader";

interface AppLoadingGateProps {
  children: React.ReactNode;
}

const LOGO_SRC = "/assets/logo-white-trans.png";

function waitForLogo() {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = LOGO_SRC;
  });
}

function waitForFonts() {
  if (!("fonts" in document)) {
    return Promise.resolve();
  }

  return Promise.race([
    document.fonts.ready.then(() => undefined).catch(() => undefined),
    new Promise<void>(resolve => window.setTimeout(resolve, 2500)),
  ]);
}

export function AppLoadingGate({ children }: AppLoadingGateProps) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      setProgress(28);
      await waitForLogo();
      if (!isMounted) return;

      setProgress(62);
      await waitForFonts();
      if (!isMounted) return;

      setProgress(100);
      window.setTimeout(() => {
        if (isMounted) setReady(true);
      }, 180);
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <AppLoader
        title="Loading interface"
        description="Preparing icons, logo, and typography..."
        eyebrow="App assets"
        progress={progress}
      />
    );
  }

  return <>{children}</>;
}
