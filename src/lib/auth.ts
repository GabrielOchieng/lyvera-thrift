import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import prisma from "../../lib/prisma";

// Ensure the API key is stripped of any accidental whitespace/quotes
const resend = new Resend(process.env.RESEND_API_KEY?.trim());

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      const { user, url } = data;
      const currentYear = new Date().getFullYear();

      const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`;

      console.log(
        `[Lyvera Security] Dispatching recovery protocol for: ${user.email}`,
      );

      try {
        const { data: resendData, error: resendError } =
          await resend.emails.send({
            from: "Lyvera Store <onboarding@resend.dev>",
            to: user.email,
            subject: "Security Update: Reset Your Lyvera Password",
            html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 8px; overflow: hidden; color: #1e293b;">
        
        <div style="background-color: #800000; padding: 30px 20px; text-align: center;">
          <img 
            src="${logoUrl}" 
            alt="Lyvera Thrifts Logo" 
            style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; border: 2px solid #EAB308; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"
          />
          <h1 style="color: #ffffff; font-size: 18px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0;">Lyvera Thrifts</h1>
  
        </div>

              <div style="padding:5px 40px; background-color: #ffffff;">
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 14px; color: #1e293b;">Hello ${user.name || "Visionary"},</p>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 18px; color: #475569;">
                  We received a request to access your Lyvera account. To ensure your digital vault remains secure, please use the button below to reset your credentials.
                </p>

                <div style="text-align: center; margin: 20px 0;">
                  <a href="${url}" style="display: inline-block; padding: 16px 40px; background-color: #800000; color: #ffffff; border: 2px solid #EAB308; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 15px rgba(128, 0, 0, 0.2);">
                    Secure Your Account
                  </a>
                </div>

                <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; text-align: center; font-style: italic;">
                  This link is temporary and for security purposes will expire shortly. If you did not initiate this, your account security remains intact.
                </p>

                <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="font-size: 11px; color: #cbd5e1; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
                    Premium Quality &bull; Fast Logistics &bull; Secure Vault
                  </p>
                  <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; tracking-widest;">
                    &copy; ${currentYear} Lyvera Thrift &bull; Curating iconic looks
                  </p>
                </div>
              </div>
            </div>
          `,
          });

        if (resendError) {
          // This catches API-level errors (invalid key, unverified domain)
          console.error("[Resend API Error]:", resendError);
          throw new Error(`Email delivery failed: ${resendError.message}`);
        }

        console.log(
          `[Lyvera Security] Recovery email successfully dispatched: ${resendData?.id}`,
        );
      } catch (err: any) {
        // This catches network-level errors (DNS, Timeout, No Connection)
        console.error(
          "[Network Error] Failed to reach Resend services:",
          err.message,
        );
        throw new Error(
          "The security mail server is currently unreachable. Please try again.",
        );
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
