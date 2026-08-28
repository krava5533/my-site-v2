import { Lead } from "@/types";
import { MOCK_MODE, siteConfig } from "@/lib/config";
import { getSettings } from "@/lib/settings";

/**
 * EMAIL PROVIDER ABSTRACTION
 * ----------------------------------------------------------------
 * Supports Resend or SMTP (via nodemailer) through EMAIL_PROVIDER.
 * In MOCK_MODE, emails are logged to the console instead of sent —
 * the app works out of the box with zero credentials configured.
 * ----------------------------------------------------------------
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendViaResend(payload: EmailPayload) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || `LuxeStone Interiors <no-reply@luxestone.example>`,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}

async function sendViaSmtp(payload: EmailPayload) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `LuxeStone Interiors <no-reply@luxestone.example>`,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (MOCK_MODE) {
    console.log(`[MOCK EMAIL] To: ${payload.to} | Subject: ${payload.subject}`);
    return;
  }
  const provider = process.env.EMAIL_PROVIDER || "resend";
  if (provider === "smtp") {
    await sendViaSmtp(payload);
  } else {
    await sendViaResend(payload);
  }
}

export async function sendLeadNotificationEmail(lead: Lead): Promise<void> {
  const settings = await getSettings();
  const adminEmail = settings.email;
  if (!adminEmail) return; // no real address configured yet
  await sendEmail({
    to: adminEmail,
    subject: `New ${lead.type} — ${lead.name}`,
    html: `
      <h2>New ${lead.type}</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || "—"}</p>
      <p><strong>Company:</strong> ${lead.company || "—"}</p>
      <p><strong>Project:</strong> ${lead.project || "—"}</p>
      <p><strong>Location:</strong> ${lead.location || "—"}</p>
      <p><strong>Source:</strong> ${lead.source}</p>
      <p><strong>Message:</strong><br/>${lead.message || "—"}</p>
    `,
  });
}

export async function sendCustomerConfirmationEmail(lead: Lead): Promise<void> {
  await sendEmail({
    to: lead.email,
    subject: `Thank you for contacting ${siteConfig.name}`,
    html: `
      <p>Hi ${lead.name.split(" ")[0]},</p>
      <p>Thank you for contacting ${siteConfig.name}. Our team has received your ${lead.type.toLowerCase()} and will be in touch shortly.</p>
      <p>— The ${siteConfig.name} Team</p>
    `,
  });
}
