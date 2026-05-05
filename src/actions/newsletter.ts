"use server";

import nodemailer from "nodemailer";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address." };
  }

  const currentYear = new Date().getFullYear();
  const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Lyvera Thrifts" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to the Inner Circle | Lyvera Thrifts 🥂",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 8px; overflow: hidden; color: #1e293b;">
          
          <div style="background-color: #8B1A4F; padding: 10px 20px; text-align: center;">
            <img 
              src="${logoUrl}" 
              alt="Lyvera Thrifts Logo" 
              style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 2px solid #F3C623; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"
            />
            <h1 style="color: #F3C623; font-size: 20px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin: 0;">Welcome to the Club</h1>
            
          </div>

          <div style="padding:10px 40px; background-color: #ffffff; text-align: center;">
            <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1e293b;">You're officially an Insider.</p>
            
            <p style="font-size: 15px; line-height: 1.7; margin-bottom: 10px; color: #475569;">
              Thank you for joining <strong>Lyvera Thrifts</strong>. You'll now be the first to receive notifications for our weekly drops, exclusive vintage finds, and members-only style guides.
            </p>

            <div style="text-align: center; margin: 15px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="display: inline-block; padding: 15px 40px; background-color: #8B1A4F; color: #ffffff; border: 2px solid #F3C623; border-radius: 2px; text-decoration: none; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 15px rgba(139, 26, 79, 0.2);">
                Explore Latest Drops
              </a>
            </div>

            <p style="font-size: 12px; line-height: 1.6; color: #94a3b8; font-style: italic;">
              Every piece in our collection is hand-picked for the modern visionary. Get ready to elevate your wardrobe.
            </p>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="font-size: 10px; color: #cbd5e1; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; font-weight: bold;">
                Premium Quality &bull; Hand-Picked &bull; Iconic Style
              </p>
              <p style="font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                &copy; ${currentYear} Lyvera Thrifts &bull; Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // 2. Send the Admin Notification to YOU
    await transporter.sendMail({
      from: `"System | Lyvera Thrifts" <${process.env.SMTP_USER}>`,
      to: "ogingagabriel@gmail.com",
      subject: "✨ New Lead Captured | Lyvera Thrifts",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #8B1A4F; padding: 20px; text-align: center; border-bottom: 4px solid #F3C623;">
             <h1 style="color: #ffffff; font-size: 14px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; margin: 0;">New Subscriber Alert</h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #1e293b; margin-bottom: 25px;">
              Great news, <strong>Gabriel</strong>! Your community just grew. A new lead has been captured from the website.
            </p>

            <!-- Lead Card -->
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
              <div style="margin-bottom: 15px;">
                <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin: 0 0 5px 0;">Customer Email</p>
                <p style="font-size: 18px; font-weight: bold; color: #8B1A4F; margin: 0;">${email}</p>
              </div>
              
              <div>
                <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin: 0 0 5px 0;">Signup Date & Time</p>
                <p style="font-size: 14px; font-weight: 600; color: #475569; margin: 0;">${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "full", timeStyle: "short" })}</p>
              </div>
            </div>

            <!-- Footer Action -->
            <div style="text-align: center;">
              <p style="font-size: 13px; color: #64748b; font-style: italic; margin-bottom: 20px;">
                Keep building that financial freedom. 🚀
              </p>
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 25px; background-color: #ffffff; color: #8B1A4F; border: 2px solid #8B1A4F; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Contact Subscriber
              </a>
            </div>
          </div>

          <!-- Bottom Branding -->
          <div style="padding: 20px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="font-size: 10px; color: #cbd5e1; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
              Internal Notification System &bull; Lyvera Thrifts
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("[Newsletter SMTP Error]:", error.message);
    return { error: "Our mail server is a bit busy. Please try again later." };
  }
}
