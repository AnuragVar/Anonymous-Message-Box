import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

// In nextjs data connection happens with call
//shadcn introduction introduces some utils that will come in lib folder
