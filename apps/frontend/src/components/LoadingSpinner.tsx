const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-bg-background">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-8 py-7">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-white/30 border-b-white/10 border-l-white/30 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-white/10 blur-sm" />
        </div>

        <div className="text-center">
          <p className="text-base font-medium tracking-wide text-white">
            Loading
          </p>
          <p className="mt-1 text-sm text-white/60">Please wait a moment…</p>
        </div>

        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
