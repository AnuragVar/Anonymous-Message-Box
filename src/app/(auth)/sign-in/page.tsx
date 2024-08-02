"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schema/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

function page() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(response);
    
    if (response?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect Username or password",
        variant: "destructive",
      });
    }
    if(response?.url){
        router.replace('dashboard');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1A3636] text-[#1A3636]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-center ">
            Join SecretSpeak
          </h1>
          <p className="text-center">
            Sign In to start your secret social adventure today
          </p>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 my-4 flex flex-col "
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-[#1A3636]">
                Sign-In
              </Button>
            </form>
          </FormProvider>
          <div className="flex justify-center">
            <span>Create a new account:</span>
            <Link
              className="text-blue-500 hover:text-blue-700"
              href={"/sign-up"}
              // onClick={() => {
              //   router.replace("/sign-in");
              // }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
