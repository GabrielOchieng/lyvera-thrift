import { NextResponse } from "next/server";
import { getPesapalToken } from "@/lib/pesapal";

export async function POST(req: Request) {
  try {
    const { amount, phone, email, name } = await req.json();
    const token = await getPesapalToken();

    const orderData = {
      id: `LYV-${Date.now()}`, // Unique Merchant Reference
      currency: "KES",
      amount: amount,
      description: "Payment for Lyvera Store Order",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      notification_id: "YOUR_SAVED_IPN_ID", // From Step 2
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: name,
      },
    };

    const response = await fetch(
      `${process.env.PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      },
    );

    const result = await response.json();
    // Result contains the 'redirect_url'
    return NextResponse.json({ url: result.redirect_url });
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

// // TEMPORARY DEMO MODE for the meeting
// export async function POST(req: Request) {
//   // Instead of calling Pesapal, we return a success URL immediately
//   // This allows you to show the "Success" UI you built
//   return NextResponse.json({
//     url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
//   });
// }
