// import { initiateSTKPush } from "@/lib/mpesa";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { phone, amount, orderId } = await req.json();

//     console.log("--- 🚀 STK Push Attempt ---");
//     console.log("Order:", orderId, "Phone:", phone);

//     const result = await initiateSTKPush(phone, amount, orderId);

//     // This log is the most important one:
//     console.log("--- 📡 Safaricom Response ---", result);

//     if (result.ResponseCode === "0") {
//       return NextResponse.json({
//         success: true,
//         checkoutRequestID: result.CheckoutRequestID,
//       });
//     } else {
//       // Return the actual error message from Safaricom to the frontend
//       return NextResponse.json({
//         success: false,
//         error:
//           result.errorMessage ||
//           result.CustomerMessage ||
//           "Safaricom rejected the request",
//       });
//     }
//   } catch (error: any) {
//     console.error("--- ❌ Server Crash ---", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || "Internal Server Error",
//       },
//       { status: 500 },
//     );
//   }
// }

import { initiateSTKPush } from "@/lib/mpesa";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone, amount, orderId } = await req.json();

    console.log("--- 🚀 STK Push Attempt ---");
    console.log("Order:", orderId, "Phone:", phone);

    const result = await initiateSTKPush(phone, amount, orderId);

    console.log("--- 📡 Safaricom Response ---", result);

    if (result.ResponseCode === "0") {
      // ✅ CRITICAL: Save the CheckoutRequestID to the order immediately
      // This ensures the callback finds the RIGHT order later.
      await prisma.order.update({
        where: { id: orderId },
        data: {
          checkoutRequestId: result.CheckoutRequestID,
        },
      });

      return NextResponse.json({
        success: true,
        checkoutRequestID: result.CheckoutRequestID,
      });
    } else {
      return NextResponse.json({
        success: false,
        error:
          result.errorMessage ||
          result.CustomerMessage ||
          "Safaricom rejected the request",
      });
    }
  } catch (error: any) {
    console.error("--- ❌ Server Crash ---", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
