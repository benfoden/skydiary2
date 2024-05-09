import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import { formattedDate } from "~/utils/text";

export default async function Today() {
  return (
    <>
      <SessionNav>
        <NavChevronLeft targetPathname={"/home"} label="home" />
        <div>{formattedDate}</div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60">
            1
          </button>
          <button className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60">
            2
          </button>
          <button className="rounded-full border border-white/40 bg-white/30 px-4 py-2 no-underline transition hover:bg-white/60">
            3
          </button>
        </div>
      </SessionNav>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          yo post goes here
        </div>
      </main>
    </>
  );
}
