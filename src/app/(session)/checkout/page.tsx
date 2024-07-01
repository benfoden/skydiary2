import { Card } from "~/app/_components/Card";
import FormButton from "~/app/_components/FormButton";
import Input from "~/app/_components/Input";
import getStripe from "~/utils/get-stripe";

export default function Checkout() {
  return (
    <div>
      Checkout
      <Card variant="form">
        <form
          action={async (formData) => {
            "use server";
            const productId: string = formData.get("productId") as string;

            const res = await fetch(`/api/stripe/checkout-session`, {
              method: "POST",
              body: JSON.stringify(productId),
              headers: {
                "Content-Type": "application/json",
              },
            });

            interface CheckoutSession {
              id: string;
            }

            const checkoutSession: CheckoutSession = await res
              .json()
              .then((value: { session: CheckoutSession }) => {
                return value.session;
              });

            const stripe = await getStripe();
            const { error } = await stripe!.redirectToCheckout({
              sessionId: checkoutSession.id,
            });
            console.warn(error.message);
          }}
        >
          <Input id="productId" name="productId" label="Product ID" />
          <FormButton>Submit</FormButton>
        </form>
      </Card>
    </div>
  );
}
