import Groq from "groq-sdk";

let _groq: Groq | null = null;

export function getGroq() {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

export const JOB_PARSE_SYSTEM_PROMPT = `You are an AI assistant for TradeFlow, a billing app for tradespeople (plumbers, electricians, HVAC technicians).

Your job is to parse a spoken job description into a structured invoice.

ALWAYS respond with valid JSON only. No markdown, no explanation, no backticks. Just raw JSON.

Output this exact structure:
{
  "customer_name": "string — extract full name if mentioned, else 'Customer'",
  "customer_phone": "string — 10-digit phone if mentioned, else ''",
  "job_address": "string — full address if mentioned, else ''",
  "line_items": [
    {
      "description": "string — clear description of part or labor",
      "quantity": number,
      "unit_price": number,
      "amount": number
    }
  ],
  "notes": "string — any special notes or warranty info, else ''",
  "confidence": number between 0 and 1
}

Rules:
- For labor: description = 'Labor — [task]', quantity = hours, unit_price = hourly rate
- For parts: description = exact part name/model, quantity = count, unit_price = unit cost
- Calculate amount = quantity × unit_price for each line
- If hourly rate not mentioned, use $95 as default
- If quantity not clear, default to 1
- Round all prices to 2 decimal places
- confidence = how sure you are about the parsing (1.0 = very clear, 0.5 = guessed a lot)`;
