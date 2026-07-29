interface AppLoaderProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  progress?: number;
  fullScreen?: boolean;
}

export function AppLoader({
  title = "Preparing workspace",
  description = "Loading the interface...",
  eyebrow = "Studio portal",
  progress,
  fullScreen = true,
}: AppLoaderProps) {
  const isIndeterminate = typeof progress !== "number";
  const progressWidth = `${Math.max(0, Math.min(progress ?? 68, 100))}%`;

  const content = (
    <div className="app-loader-card w-full max-w-[390px] rounded-[28px] bg-(--color-sidebar-bg) p-5 text-white shadow-[0_24px_80px_rgba(18,19,22,0.12)]">
      <div className="app-loader-header flex items-center gap-3">
        <div className="app-loader-logo flex h-12 w-12 items-center justify-center rounded-[18px] border border-(--color-sidebar-border-dark) bg-white/5">
          <img src="/assets/logo-white-trans.png" alt="Studio Portal logo" width={32} height={32} />
        </div>
        <div className="app-loader-brand min-w-0">
          <p className="brand-wordmark type-card-title text-white">
            studio <span className="brand-wordmark-light text-white/60">portal</span>
          </p>
          <p className="type-muted mt-0.5 text-white/35">{eyebrow}</p>
        </div>
      </div>

      <div className="app-loader-body mt-8 rounded-[18px] border border-white/8 bg-white/[0.04] p-4">
        <div className="app-loader-row flex items-center justify-between gap-4">
          <div>
            <p className="type-label text-white/45">{eyebrow}</p>
            <p className="type-card-title mt-1 text-white">{title}</p>
          </div>
          <span className="app-loader-dot h-2.5 w-2.5 rounded-full bg-(--color-accent-lime)" />
        </div>

        <div className="app-loader-track mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="app-loader-progress h-full rounded-full bg-(--color-accent-lime)"
            data-indeterminate={isIndeterminate ? "true" : "false"}
            style={{ width: isIndeterminate ? "44%" : progressWidth }}
          />
        </div>
        <p className="type-muted mt-3 text-white/35">{description}</p>
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="app-loader flex items-center justify-center">{content}</div>;
  }

  return (
    <main className="app-loader flex min-h-screen items-center justify-center bg-white p-4">
      {content}
    </main>
  );
}
