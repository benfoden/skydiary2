export default function Spinner({ diameter = "8" }: { diameter?: string }) {
  return (
    <div
      className={`h-${diameter} w-${diameter} animate-spin rounded-full border-4 border-white/30 border-t-transparent`}
    />
  );
}
