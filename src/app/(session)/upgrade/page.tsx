import { redirect } from "next/navigation";
import { Card } from "~/app/_components/Card";
import FormButton from "~/app/_components/FormButton";
import { env } from "~/env";
import { api } from "~/trpc/server";

export default async function Upgrade() {
  return (
    <div>
      Checkout
      <Card variant="form">
        <form
          action={async (formData) => {
            "use server";
            const monthly: string = formData.get("monthly") as string;
            const yearly: string = formData.get("yearly") as string;

            let priceId: string;
            if (monthly) {
              priceId =
                env.PRICE_ID_BASE_MONTHLY_TEST ?? env.PRICE_ID_BASE_MONTHLY;
            } else if (yearly) {
              priceId =
                env.PRICE_ID_BASE_YEARLY_TEST ?? env.PRICE_ID_BASE_YEARLY;
            } else {
              throw new Error("Invalid product");
            }

            try {
              const { checkoutUrl } = await api.stripe.createCheckoutSession({
                priceId,
              });

              if (checkoutUrl) {
                void redirect(checkoutUrl);
              }
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <FormButton>Get monthly</FormButton>
        </form>
      </Card>
    </div>
  );
}
