import Link from "next/link";
import Button from "../_components/Button";
import { Nav } from "./(landing)/layout";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-screen items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h2 className="text-3xl font-bold">404 Not Found</h2>
          <p>Could not find the page you are looking for.</p>
          <Link href="/">
            <Button>go home</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
