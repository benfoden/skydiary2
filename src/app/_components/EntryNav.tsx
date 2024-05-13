"use client";
import { type Post } from "@prisma/client";
import Button from "./Button";
import DropDownMenu from "./DropDown";
import { NavChevronLeft } from "./NavChevronLeft";
import { SessionNav } from "./SessionNav";

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
        {/* <div>Sentiment - {analyzeSentiment(post?.content ?? "")?.score}</div> */}
      </div>
      <div>
        <DropDownMenu>
          <Button
            variant="menuElement"
            onClick={async () => {
              await navigator.clipboard.writeText(post?.content ?? "");
            }}
          >
            Copy text
          </Button>
          {children}
        </DropDownMenu>
      </div>
    </SessionNav>
  );
};

export default EntryNav;
