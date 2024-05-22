import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";

export default async function LoadingPageBody() {
  return (
    <>
      <SessionNav>
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <NavChevronLeft targetPathname={"/home"} label={"home"} />
          </div>
          <DropDownMenu>
            <div>Loading...</div>
          </DropDownMenu>
        </div>
      </SessionNav>
      <div className="flex h-full flex-col items-center gap-12 px-4 py-32">
        <Spinner />
      </div>
    </>
  );
}
