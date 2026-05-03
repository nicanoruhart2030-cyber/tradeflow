import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

export async function createPaymentLink(
  invoiceId: string,
  amount: number,
  customerName: string,
  invoiceNumber: string,
  appUrl: string
): Promise<string> {
  const stripe = getStripe();
  const product = await stripe.products.create({
    name: `Invoice ${invoiceNumber} — ${customerName}`,
    metadata: { invoice_id: invoiceId },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: "cad",
  });

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    metadata: { invoice_id: invoiceId },
    payment_intent_data: {
      metadata: { invoice_id: invoiceId },
    },
    after_completion: {
      type: "redirect",
      redirect: { url: `${appUrl}/pay/${invoiceId}?paid=true` },
    },
  });

  return paymentLink.url;
}
