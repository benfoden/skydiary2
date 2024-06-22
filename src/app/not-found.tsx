export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="z-20 flex h-dvh flex-col items-center justify-center gap-4">
        <div className="flex w-96 flex-col gap-4 rounded-lg bg-white/50 p-6 shadow-lg">
          <h1 className="flex w-full items-center justify-center text-xl font-light text-[#424245]">
            404
          </h1>
          <div className="text-center">
            <div className="pb-4 font-bold">404</div>
            <div className="flex flex-col items-center gap-3 text-sm">
              <p>The page you are looking for could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
