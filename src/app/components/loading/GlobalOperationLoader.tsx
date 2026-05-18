import { useUIStore } from "@/src/store/ui";

export function GlobalOperationLoader() {
  const activeOperations = useUIStore(state => state.activeOperations);

  if (activeOperations.length === 0) {
    return null;
  }

  const latestOperation = activeOperations[activeOperations.length - 1];

  return (
    <div className="global-operation-loader pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex justify-center sm:justify-end">
      <div className="global-operation-loader-card pointer-events-auto w-full max-w-[330px] overflow-hidden rounded-[18px] border border-white/10 bg-(--color-ink) text-white shadow-[0_18px_50px_rgba(18,19,22,0.18)]">
        <div className="global-operation-loader-content flex items-center gap-3 px-4 py-3">
          <div className="global-operation-loader-logo flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white/8">
            <img src="/assets/logo-white-trans.png" alt="" width={24} height={24} />
          </div>
          <div className="global-operation-loader-copy min-w-0 flex-1">
            <p className="type-card-title truncate text-white">{latestOperation?.label || "Saving changes"}</p>
            <p className="type-muted text-white/45">Syncing with Firebase...</p>
          </div>
        </div>
        <div className="global-operation-loader-track h-1 overflow-hidden bg-white/10">
          <div className="global-operation-loader-bar h-full w-1/2 rounded-r-full bg-(--color-accent-lime)" />
        </div>
      </div>
    </div>
  );
}
