"use client";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import { ThemeToggle } from "~/app/_components/ToggleTheme";

export default function Sandbox() {
  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center gap-12 px-4 py-16">
        <ThemeToggle />

        <div className="flex flex-col items-start gap-4 p-4">
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-xl">buttons</h2>
            <Button>default</Button>
            <Button variant="text">text</Button>
            <Button variant="menuElement">menuElement</Button>
            <Button variant="cta">cta</Button>
            <Button variant="chip">chip</Button>
            <Button variant="submit">submit</Button>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-xl">cards</h2>
            <Card>default</Card>
            <Card isButton={false}>default, not a button</Card>
            <Card isButton variant="narrow">
              narrow
            </Card>
            <Card isButton={false} variant="narrow">
              narrow, not a button
            </Card>
            <Card variant="wide">wide</Card>
            <Card isButton={false} variant="wide">
              wide, not a button
            </Card>
            <Card variant="form">form</Card>
          </div>
        </div>
      </div>
    </>
  );
}
