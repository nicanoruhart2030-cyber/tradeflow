import twilio from "twilio";

let _client: ReturnType<typeof twilio> | null = null;

function getTwilio() {
  if (!_client) {
    _client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }
  return _client;
}

export async function sendInvoiceSMS(
  to: string,
  businessName: string,
  invoiceNumber: string,
  total: string,
  paymentLink: string
): Promise<void> {
  await getTwilio().messages.create({
    body: `Hi! ${businessName} has sent you Invoice ${invoiceNumber} for ${total}. Pay securely here: ${paymentLink}`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`,
  });
}
