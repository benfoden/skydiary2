import Spinner from "./Spinner";

export default function LoadingPage() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center">
        <Spinner diameter="32" />
      </main>
    </>
  );
}
