import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getServerAuthSession } from "~/server/auth";
import { baseUrl } from "~/utils/constants";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { productId: string };
  console.log("the stripe checkout post body", body);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json(
      {
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      },
      { status: 401 },
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: session.user.stripeCustomerId,
    line_items: [
      {
        // temporarily hard coded price (subscription)
        price: "PRICE_ID_HERE_TODO",
        quantity: 1,
      },
    ],
    success_url: baseUrl + `?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: baseUrl,
    subscription_data: {
      metadata: {
        // so that we can manually check in Stripe for whether a customer has an active subscription later, or if our webhook integration breaks.
        payingUserId: session.user.id,
      },
    },
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      {
        error: {
          code: "stripe-error",
          message: "Could not create checkout session",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ session: checkoutSession }, { status: 200 });
}
