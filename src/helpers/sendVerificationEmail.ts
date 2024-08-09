import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components";
import VerificationEmail from "../../emails/VerificationEmail";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: "thesecretspeak@gmail.com",
    pass: process.env.PASS_KEY,
  },
});

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render the React component to an HTML string within the function
    const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

    const res = await transporter.sendMail({
      from: "thesecretspeak@gmail.com",
      to: email,
      subject: "Mystry message | Verification Code",
      html: emailHtml,
    });

    return {
      success: true,
      message: `Verification Email has been sent. ID: ${res.messageId}`,
    };
  } catch (error) {
    console.log("Something went wrong while sending the email", error);
    return { success: false, message: "Verification Email has not been sent" };
  }
}
