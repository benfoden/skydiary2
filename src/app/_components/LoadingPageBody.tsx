import DropDownMenu from "~/app/_components/DropDown";
import { NavChevronLeft } from "~/app/_components/NavChevronLeft";
import { SessionNav } from "~/app/_components/SessionNav";
import Spinner from "~/app/_components/Spinner";

export default async function LoadingPageBody() {
  return (
    <>
      <SessionNav>
        <div className="flex items-center gap-2">
          <NavChevronLeft targetPathname={"/home"} label={"home"} />
        </div>
        <h1 className="font-light">loading...</h1>
        <DropDownMenu>
          <div>Loading...</div>
        </DropDownMenu>
      </SessionNav>
      <div className="flex h-full flex-col items-center gap-12 px-4 py-32 font-light">
        <Spinner />
      </div>
    </>
  );
}
