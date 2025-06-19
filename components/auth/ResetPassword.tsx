'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import PasswordInput from './PasswordInput'
import { Button } from '../ui/button'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import axios, { AxiosResponse } from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAtuhRequest } from '../utils/apiRequest'
import { setAuthUser } from '@/redux/features/auth/authSlice'
import { toast } from 'sonner'

interface IResetPasswordResponse {
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
      isVarified: boolean ;
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

const ResetPassword = () => {
    const searchParams= useSearchParams()
    const email= searchParams.get("email")
    console.log(email)
    const[otp,setOtp]=useState("")
    const[password,setPassword]=useState("")
    const[isLoading,setIsLoading]=useState(false)
    const dispatch= useDispatch()
    const router = useRouter()

    const handleSubmit=async()=>{
        if(!otp|| !password){
            return
        }
        const data={email,otp,password}

        const resetPasswordReq = async (): Promise<AxiosResponse<IResetPasswordResponse>> => {
            const response = await axios.post<IResetPasswordResponse>(
              `${BASE_API_URL}/auth/resetPassword`,
              data,
              { withCredentials: true }
            );
            return response;
          };
      
          const result = await handleAtuhRequest(resetPasswordReq, setIsLoading);
      
          if (result) {
            dispatch(
              setAuthUser({
                user: result.data.data,
                token: result.data.token,
              })
            );
            console.log(result);
            toast.success(result.data.message);
            router.push("/auth/login");
          }

    }

    
  return (
    <div className='flex items-center justify-center flex-col h-screen'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-3'>
            Reset your password
        </h1>
        <p className='mb-6 text-sm sm:text-base text-center text-gray-600 font-medium'>
            Enter Your Otp and new password to reset your password
        </p>
        <input type="number" placeholder='Enter Otp' 
        className=" block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]
        mx-auto px-6 py-3 rounded-lg outline-none no-spinner bg-gray-200"
        value={otp}
        onChange={(e)=>setOtp(e.target.value)}
        />

        <div className='mb-4 mt-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]'>
            <PasswordInput 
            name="password"
            placeholder='Enter the new password'
            inputClassName='px-6 py-3 bg-gray-300 rounded-lg outline-none'
            value={password}
        onChange={(e)=>setPassword(e.target.value)}
            />
        </div>

        <div className='flex justify-center items-center space-x-4 mt-6'>
        <Button onClick={handleSubmit} type="submit" disabled={isLoading} className="w-52  ">
        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Change Password
      </Button>
      <Button variant={'ghost'}>
        <Link href="/auth/forget-password">
            Go Back
        </Link>
      </Button>
        </div>

    </div>
  )
}

export default ResetPassword