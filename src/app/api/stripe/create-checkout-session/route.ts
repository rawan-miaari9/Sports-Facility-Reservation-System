import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = req.nextUrl.origin;

    if (!body.price || Number(body.price) <= 0) {
      return NextResponse.json({ error: "Invalid reservation price" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        reservationType: "sports-facility-booking",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sports Facility Reservation",
            },
            unit_amount: Math.round(Number(body.price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/facilities`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      paid: session.payment_status === "paid",
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe session verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify checkout session" },
      { status: 500 }
    );
  }
}
