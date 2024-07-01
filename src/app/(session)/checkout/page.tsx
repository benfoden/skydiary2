import { Card } from "~/app/_components/Card";
import FormButton from "~/app/_components/FormButton";
import Input from "~/app/_components/Input";
import { baseURL } from "~/utils/constants";
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

            try {
              const res = await fetch(
                `${baseURL()}/api/stripe/checkout-session`,
                {
                  method: "POST",
                  body: JSON.stringify(productId),
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              const checkoutSession = await res
                .json()
                .then((value: { session: CheckoutSession }) => {
                  return value.session;
                });

              const stripe = await getStripe();
              const { error } = await stripe!.redirectToCheckout({
                sessionId: checkoutSession.id,
              });
              console.warn(error.message);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Input id="productId" name="productId" label="Product ID" />
          <FormButton>Submit</FormButton>
        </form>
      </Card>
    </div>
  );
}
