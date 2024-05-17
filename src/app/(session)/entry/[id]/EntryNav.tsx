"use client";
import { type Post } from "@prisma/client";
import { copyTextToClipboard } from "~/utils/text";
import Button from "../../../_components/Button";
import DropDownMenu from "../../../_components/DropDown";
import { NavChevronLeft } from "../../../_components/NavChevronLeft";
import { SessionNav } from "../../../_components/SessionNav";
const handleCopyText = async (text: string) => {
  try {
    await copyTextToClipboard(text);
  } catch (error) {
    console.error(error);
  }
};

const EntryNav = ({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <SessionNav>
      <NavChevronLeft targetPathname={"/home"} label="home" />
      <div className="flex items-center gap-2">
        {post?.createdAt.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <div>
        <DropDownMenu>
          <Button
            variant="menuElement"
            onClick={() => handleCopyText(post?.content ?? "")}
          >
            Copy all text
          </Button>
          {children}
        </DropDownMenu>
      </div>
    </SessionNav>
  );
};

export default EntryNav;
