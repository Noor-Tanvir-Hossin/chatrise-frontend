"use client";
import Image from "next/image";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "./PasswordInput";
import { Loader2 } from "lucide-react";
import { BASE_API_URL } from "@/server";
import axios, { AxiosResponse } from "axios";
import { handleAtuhRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const passwordValidationRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{6,}$"
);

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter your email",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 character ",
    }),
  // .regex(
  //     passwordValidationRegex,{
  //         message:"Password must be containt 6 character, 1 Uppercase, 1 Lowercase, 1 number and 1 special character."
  //     }
  // )
});

interface ILoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  token: string;
  data: {
    name: string;
    email: string;
    password: string;
    bio: string;
    followers: string[];
    following: string[];
    posts: string[];
    savePosts: string[];
    isVarified: boolean;
    otp: string;
    otpExpires: string;
    resetPasswordOtp: string | null;
    resetPasswordOtpExpires: string | null;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoding, setIsLoding] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const loginReq = async (): Promise<AxiosResponse<ILoginResponse>> => {
      const response = await axios.post<ILoginResponse>(
        `${BASE_API_URL}/auth/login`,
        values,
        { withCredentials: true }
      );
      return response;
    };

    const result = await handleAtuhRequest(loginReq, setIsLoding);

    if (result) {
      dispatch(
        setAuthUser({
          user: result.data.data,
          token: result.data.token,
        })
      );
      console.log(result);
      toast.success(result.data.message);
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* banner */}
        <div className=" hidden lg:block lg:col-span-4 h-screen ">
          <Image
            src="/images/austin-distel-744oGeqpxPQ-unsplash.jpg"
            alt="signup"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
            Login with <span className="text-rose-600">Chatrise</span>
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%] space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel htmlFor="email" className="font-semibold mb-2">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="px-4 py-3 bg-gray-200 rounded-lg w-full block "
                        placeholder="Enter your email please"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <PasswordInput
                        label="Password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-end">
                <Link
                  href="/auth/forget-password"
                  className="text-red-600 font-semibold text-sm sm:text-base"
                >
                  Forget Password?
                </Link>
              </div>

              <Button type="submit" disabled={isLoding} className="w-full ">
                {isLoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
            <h1 className="mt-4 text-lg text-gray-800">
              Don't have an account?{" "}
              <Link href="/auth/signup">
                <span className="text-blue-800 underline cursor-pointer font-medium">
                  Signup Here
                </span>
              </Link>
            </h1>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
