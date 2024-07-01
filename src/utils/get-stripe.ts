import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { env } from "~/env";

let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      env.STRIPE_PUBLISHABLE_KEY_TEST ?? env.STRIPE_PUBLISHABLE_KEY,
    );
  }
  return stripePromise;
};

export default getStripe;
