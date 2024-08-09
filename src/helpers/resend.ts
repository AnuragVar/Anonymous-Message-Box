import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification Emails has been sent" };
  } catch (error) {
    console.log("Something wrong happens while mailing", error);
    return { success: false, message: "Verification Emails has not been sent" };
  }
}
