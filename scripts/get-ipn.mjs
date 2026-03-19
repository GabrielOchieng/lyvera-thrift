// scripts/get-ipn.mjs
const CONSUMER_KEY = "yqkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
const CONSUMER_SECRET = "osGQ364R49cXKeOYSpaOnT++rHs=";
const BASE_URL = "https://cybqa.pesapal.com/pesapalv3/api"; // Sandbox URL
const MY_URL = "https://lyvera-thrift-ihvf.vercel.app/api/payments/callback"; // Your live or ngrok URL

async function register() {
  // 1. Get Token
  const authRes = await fetch(`${BASE_URL}/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    }),
  });
  const { token } = await authRes.json();

  // 2. Register IPN
  const ipnRes = await fetch(`${BASE_URL}/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: MY_URL,
      ipn_notification_type: "POST",
    }),
  });

  const final = await ipnRes.json();
  console.log("YOUR IPN ID IS:", final.ipn_id);
}

register();
