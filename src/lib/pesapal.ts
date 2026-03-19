const BASE_URL = process.env.PESAPAL_BASE_URL;

export async function getPesapalToken() {
  const response = await fetch(`${BASE_URL}/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });
  const data = await response.json();
  return data.token;
}

// You only need to run this ONCE to get an IPN_ID, then save it in your .env
export async function registerIPN(token: string) {
  const response = await fetch(`${BASE_URL}/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
      ipn_notification_type: "POST",
    }),
  });
  return await response.json(); // Returns { "ipn_id": "xxx-xxx" }
}
