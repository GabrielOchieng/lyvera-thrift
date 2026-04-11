// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import prisma from "../../lib/prisma";

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, { provider: "postgresql" }),
//   baseURL: process.env.NEXT_PUBLIC_APP_URL,
//   emailAndPassword: { enabled: true },
//   forgetPassword: {
//     enabled: true,
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "user",
//       },
//     },
//   },
// });

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import prisma from "../../lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async (data, request) => {
      // data.url contains the full reset link, data.token is the raw token
      const { user, url } = data;

      try {
        const result = await resend.emails.send({
          from: "Lyvera Store <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your Lyvera password",
          html: `
        <h1>Password Reset</h1>
        <p>Hello ${user.name},</p>
        <p>Someone requested a password reset for your account. If this was you, click the link below:</p>
        <a href="${url}" style="padding: 10px 20px; background: #881337; color: white; border-radius: 5px; text-decoration: none;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
        });
        console.log("Resend email response:", result); // Look for this in your terminal
      } catch (error) {
        console.error("Resend error:", error); // Check for API key or domain errors here
      }
    },
  },

  forgetPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
});
