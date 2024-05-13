export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-xl bg-white/30 px-8 py-2">
      <div className="flex items-center justify-between gap-2">{children}</div>
    </div>
  );
}
