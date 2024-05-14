import { SessionNav } from "./SessionNav";
import Spinner from "./Spinner";

export default function LoadingPage() {
  return (
    <>
      <SessionNav> </SessionNav>
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-start justify-center">
          <Spinner diameter="32" />
        </div>
      </main>
    </>
  );
}
