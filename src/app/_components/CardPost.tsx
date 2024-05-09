export function CardPost({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xs border border-white/20 bg-white/10">
      {children}
    </div>
  );
}
