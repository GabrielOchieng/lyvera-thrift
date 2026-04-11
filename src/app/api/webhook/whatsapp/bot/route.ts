import { handleCustomerChat } from "@/lib/whatsapp/customer-logic";

export async function GET(req: Request) {
  // Add your Meta verification logic here (same as admin/route.ts)
  const { searchParams } = new URL(req.url);
  if (
    searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(searchParams.get("hub.challenge"), { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message?.text) {
    // This is the dedicated hook for customer interactions
    await handleCustomerChat(message);
  }

  return new Response("OK", { status: 200 });
}
