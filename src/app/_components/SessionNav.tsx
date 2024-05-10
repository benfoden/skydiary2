export async function SessionNav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex w-full items-center justify-between bg-transparent p-4 text-[#424245]">
      {children}
    </nav>
  );
}
