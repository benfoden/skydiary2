/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Card } from "~/app/_components/Card";
import { prompts } from "~/utils/prompts";

export default async function Secret() {
  return (
    <>
      <div className="flex w-full flex-col items-center gap-4">
        <h2>Prompts</h2>
        <Card isButton={false}>
          <div className="flex w-full flex-col items-start gap-4">
            {Object.entries(prompts).map(([key, value]) => (
              <div key={key}>
                <p className="font-bold">{key}</p>
                {typeof value !== "function"
                  ? value
                  : value(
                      "!PLACEHOLDER HERE!" as any,
                      "ENTRY HERE",
                      "USERPERSONA HERE" as any,
                    )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
