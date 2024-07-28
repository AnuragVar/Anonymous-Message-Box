import {z} from "zod";

const verifySchema = z. string().length(6,{message:"Verification code must be of 6 characters"});

// In nextjs data connection happens with call
//shadcn introduction introduces some utils that will come in lib folder