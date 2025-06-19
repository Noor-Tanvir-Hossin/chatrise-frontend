"use client";
import { KeySquareIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/server";
import { handleAtuhRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IForgetPassword {
  success: boolean;
  message: string;
  statusCode: number;
  data: null;
}

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter()

  const handleSubmit = async () => {
    const forgetPasswordReq = async (): Promise<
      AxiosResponse<IForgetPassword>
    > => {
      const response = await axios.post<IForgetPassword>(
        `${BASE_API_URL}/auth/forgetPassword`,
        { email },
        { withCredentials: true }
      );
      return response;
    };

    const result = await handleAtuhRequest(forgetPasswordReq, setIsLoading);

    if (result) {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
      toast.success(result.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full h-screen">
      <KeySquareIcon className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        Forget your Password?
      </h1>
      <p className="mb-6 text-sm sm:text-base text-center text-gray-600 font-medium">
        Enter Your email and we will help you to reset your password
      </p>
      <input
        type="email"
        placeholder="Enter your email"
        className="px-6 py-3.5 rounded-lg outline-none bg-gray-200 block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]
        mx-auto"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      <Button onClick={handleSubmit} type="submit" disabled={isLoading} className="w-52 mt-4 ">
        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Continue
      </Button>
    </div>
  );
};

export default ForgetPassword;
