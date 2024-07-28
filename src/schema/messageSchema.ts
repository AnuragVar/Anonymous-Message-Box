import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(10,{message:"Content must be of at least 10 characters"}).max(300,{message:"Content must be of at max 300 characters"}),
});
