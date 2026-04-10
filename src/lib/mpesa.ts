const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

// 1. Generate Access Token
export async function getMpesaToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: `Basic ${auth}` },
    },
  );

  const data = await response.json();
  return data.access_token;
}

// 2. Initiate STK Push
export async function initiateSTKPush(
  phone: string,
  amount: number,
  orderId: string,
) {
  const token = await getMpesaToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`,
  ).toString("base64");

  // Format phone to 2547XXXXXXXX
  const formattedPhone = phone.startsWith("0")
    ? `254${phone.substring(1)}`
    : phone;

  //   const body = {
  //     BusinessShortCode: process.env.MPESA_SHORTCODE,
  //     Password: password,
  //     Timestamp: timestamp,
  //     TransactionType: "CustomerBuyGoodsOnline", // Use this for Tills
  //     Amount: Math.round(amount),
  //     PartyA: formattedPhone,
  //     PartyB: process.env.MPESA_SHORTCODE,
  //     PhoneNumber: formattedPhone,
  //     CallBackURL: process.env.MPESA_CALLBACK_URL,
  //     AccountReference: orderId,
  //     TransactionDesc: `Payment for Order ${orderId}`,
  //   };

  // inside your initiateSTKPush function

  const body = {
    BusinessShortCode: process.env.MPESA_SHORTCODE, // Ensure this is 174379 in .env
    Password: password,
    Timestamp: timestamp,

    // 1. CHANGE THIS: Even for Tills, the Sandbox (174379) requires Paybill type
    TransactionType: "CustomerPayBillOnline",

    Amount: Math.round(amount),
    PartyA: formattedPhone,

    // 2. CHANGE THIS: In Paybill mode, PartyB MUST be the BusinessShortCode
    PartyB: process.env.MPESA_SHORTCODE,

    PhoneNumber: formattedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,

    // 3. IMPORTANT: AccountReference must be short (max 12 chars usually)
    // or alphanumeric. Your orderId might be too long for some M-Pesa versions.
    AccountReference: "LyveraStore",

    TransactionDesc: `Order ${orderId.substring(0, 5)}`,
  };

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  return await response.json();
}
