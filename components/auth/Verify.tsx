"use client";
import { Loader, Loader2, MailCheck } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/server";
import { handleAtuhRequest } from "../utils/apiRequest";
import { useRouter } from "next/navigation";
import { setAuthUser, useCurrentToken, useCurrentUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { RootState } from "@/redux/store";

interface IVerifyResponse {
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
interface IResendOtp{
    success: boolean;
    message: string;
    statusCode: number;
}

const Verify = () => {
  const dispatch = useDispatch(); 
  const user =  useSelector(useCurrentUser);
  const token =  useSelector(useCurrentToken);

  
  const router = useRouter();
  const [isLoding, setIsLoding] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  console.log(otp);
  const[isPageLoading, setIsPageLoading]=useState(true)

  useEffect(()=>{
    if(!user){
        router.replace("/auth/login")
    }else if(user && user.isVarified){
        router.replace("/")
    }else{
        setIsPageLoading(false)
    }
  },[user, router])

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    if (value.length === 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      event.key === "Backspace" &&
      !inputRefs.current[index]?.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    console.log(otpValue);
    
    const VerifyReq = async (): Promise<AxiosResponse<IVerifyResponse>> => {
        const response = await axios.post<IVerifyResponse>(
          `${BASE_API_URL}/auth/verifyAccount`,
          {otp: otpValue},
          { withCredentials: true,
            headers: {
                Authorization: `${token}`,
              }
           }
        );
        return response;
      };
      const result = await handleAtuhRequest(VerifyReq, setIsLoding);
      
      if (result) {
        dispatch(setAuthUser({
          user:result.data.data,
          token:result.data.token,
        }))
        console.log(result);
        toast.success(result.data.message);
        router.push("/")
      }
  };

  const handleResendOtp = async()=>{
    const resendOtpReq = async (): Promise<AxiosResponse<IResendOtp>> => {
        const response = await axios.post<IVerifyResponse>(
          `${BASE_API_URL}/auth/resendOtp`,
          null,
          { withCredentials: true,
            headers: {
                Authorization: `${token}`,
              },
           },
          
        );
        return response;
      };
      const result = await handleAtuhRequest(resendOtpReq, setIsLoding);
      
      if (result) {
        console.log(result);
        toast.success(result.data.message);
      }
  }
  if(isPageLoading){
    return(
        <div className="h-screen flex justify-center items-center">
            <Loader className="w-20 h-20 animate-spin"/>
        </div>
    )
  }

  return (
    <div className="h-screen flex items-center flex-col justify-center">
      <MailCheck className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">OTP Verification</h1>
      <p className="mb-6 text-sm sm:text-base text-gray-600 font-medium">
        We have sent you a code to {user?.email}
      </p>
      <div className="flex space-x-4">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          return (
            <input
              type="number"
              key={index}
              maxLength={1}
              className="sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-gray-200 text-lg sm:text-3xl font-bold outline-gray-500 text-center no-spinner"
              value={otp[index] || ""}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onChange={(e) => handleChange(index, e)}
            />
          );
        })}
      </div>
      <div className="flex items-center my-4 space-x-2">
        <h1>Didn't get the otp code ? {""} </h1>
        <button onClick={handleResendOtp} className="text-sm sm:text-lg font-medium text-blue-900 underline">
          Resend Code
        </button>
      </div>
      <Button onClick={handleSubmit} type="submit" disabled={isLoding} className="w-52 ">
        {isLoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify
      </Button>
    </div>
  );
};

export default Verify;
