export async function SessionNav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex w-full items-center justify-between bg-transparent px-4 py-4  sm:px-32 sm:py-4">
      {children}
    </nav>
  );
}
