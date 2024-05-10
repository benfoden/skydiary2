export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xs rounded-xl bg-white/30 px-8 py-2">
      <div className="flex w-[256px] items-center justify-between gap-2">
        {children}
      </div>
    </div>
  );
}
