// import { NextResponse } from "next/server";
// import prisma from "../../../../../../lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     // Safaricom sends the data inside Body.stkCallback
//     const callbackData = body.Body.stkCallback;
//     const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } =
//       callbackData;

//     console.log("--- 🔔 M-PESA CALLBACK RECEIVED ---");
//     console.log("CheckoutID:", CheckoutRequestID);
//     console.log("Result:", ResultDesc);

//     if (ResultCode === 0) {
//       // 1. Extract the Receipt Number (e.g., UCJCY9YH3E)
//       const mpesaReceipt = CallbackMetadata.Item.find(
//         (item: any) => item.Name === "MpesaReceiptNumber",
//       )?.Value;

//       // 2. Find the order first.
//       // We use findFirst as a fallback in case the unique index is still refreshing
//       const order = await prisma.order.findFirst({
//         where: {
//           OR: [
//             { checkoutRequestId: CheckoutRequestID },
//             { mpesaCode: { startsWith: "PENDING" } }, // Extra safety net
//           ],
//         },
//       });

//       if (!order) {
//         console.error(
//           `❌ Order not found for CheckoutID: ${CheckoutRequestID}`,
//         );
//         return NextResponse.json({
//           ResultCode: 1,
//           ResultDesc: "Order not found",
//         });
//       }

//       // 3. Update using the Internal ID (This will ALWAYS work if the order exists)
//       await prisma.order.update({
//         where: { id: order.id },
//         data: {
//           status: "PAID",
//           mpesaCode: mpesaReceipt,
//         },
//       });

//       console.log(
//         `✅ Order ${order.id} marked as PAID with Receipt: ${mpesaReceipt}`,
//       );
//     } else {
//       // User cancelled or insufficient funds
//       console.log(`❌ Payment Failed/Cancelled: ${ResultDesc}`);

//       // Optional: Mark as CANCELLED so the items can be put back in stock
//       await prisma.order.updateMany({
//         where: { checkoutRequestId: CheckoutRequestID },
//         data: { status: "CANCELLED" },
//       });
//     }

//     // Safaricom expects this specific response format
//     return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
//   } catch (error: any) {
//     console.error("--- ❌ Callback Processing Error ---", error);
//     return NextResponse.json({
//       ResultCode: 1,
//       ResultDesc: "Internal Server Error",
//     });
//   }
// }

import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const callbackData = body.Body.stkCallback;
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } =
      callbackData;

    console.log("--- 🔔 M-PESA CALLBACK RECEIVED ---");
    console.log("CheckoutID:", CheckoutRequestID);

    if (ResultCode === 0) {
      const mpesaReceipt = CallbackMetadata.Item.find(
        (item: any) => item.Name === "MpesaReceiptNumber",
      )?.Value;

      // ✅ 1. Search ONLY by the unique CheckoutRequestID
      const order = await prisma.order.findUnique({
        where: { checkoutRequestId: CheckoutRequestID },
      });

      if (!order) {
        console.error(
          `❌ Order not found for CheckoutID: ${CheckoutRequestID}`,
        );
        return NextResponse.json({
          ResultCode: 1,
          ResultDesc: "Order not found",
        });
      }

      // ✅ 2. Update status to "VERIFIED" to match your OrderListClient check
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "VERIFIED",
          mpesaCode: mpesaReceipt,
        },
      });

      console.log(
        `✅ Order ${order.id} verified with Receipt: ${mpesaReceipt}`,
      );
    } else {
      console.log(`❌ Payment Failed/Cancelled: ${ResultDesc}`);

      // Update the specific order to CANCELLED
      await prisma.order.updateMany({
        where: { checkoutRequestId: CheckoutRequestID },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error: any) {
    console.error("--- ❌ Callback Processing Error ---", error);
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: "Internal Server Error",
    });
  }
}
