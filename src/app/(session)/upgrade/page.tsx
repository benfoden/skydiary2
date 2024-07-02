"use client";
import { useRouter } from "next/navigation";
import Button from "~/app/_components/Button";
import { Card } from "~/app/_components/Card";
import { api } from "~/trpc/react";

export default function Upgrade() {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const router = useRouter();

  return (
    <div>
      Checkout
      <Card variant="form">
        <form
          onSubmit={async (event) => {
            event.preventDefault(); // Prevent the default form submission

            console.log(event.target);
            try {
              let period: "monthly" | "yearly" | undefined;
              const target = event.nativeEvent as SubmitEvent;
              const submitter = target.submitter as HTMLButtonElement;
              if (submitter?.id === "monthly") {
                period = "monthly";
              } else if (submitter?.id === "yearly") {
                period = "yearly";
              }
              if (!period) {
                console.error("Payment period is not defined");
                throw new Error("Payment period is not defined");
              }

              const { checkoutUrl } = await createCheckoutSession({
                period,
              });

              console.log(checkoutUrl);

              if (checkoutUrl) {
                void router.push(checkoutUrl);
              }
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Button type="submit" id="monthly">
            Get monthly
          </Button>
          <Button type="submit" id="yearly">
            Get yearly
          </Button>
        </form>
      </Card>
    </div>
  );
}
