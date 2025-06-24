'use client'
import React,{useState, useEffect} from 'react'
import LeftSidebar from './LeftSidebar'
import Feed from './Feed'
import RighSidebar from './RighSidebar'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Loader, MenuIcon } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, useCurrentToken, useCurrentUser } from "@/redux/features/auth/authSlice";
import { Iuser } from "@/types";
import axios, { AxiosResponse } from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAtuhRequest } from '../utils/apiRequest'
import { redirect } from 'next/navigation'

interface IUserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Iuser;
}

const Home = () => {

  const dispatch = useDispatch()
  const user = useSelector(useCurrentUser);
  const token = useSelector(useCurrentToken);

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    
    const getAuthUser = async () => {
      const getAuthUserReq = async (): Promise<
        AxiosResponse<IUserProfileResponse>
      > => {
        const response = await axios.get<IUserProfileResponse>(
          `${BASE_API_URL}/user/me`,
          {
            withCredentials: true,
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        return response;
      };

      const result = await handleAtuhRequest(getAuthUserReq, setIsLoading);

      if (result) {
        dispatch(setAuthUser(
          {
            user: result.data.data,
            token: token,
          }
          
        ))
      }
    };
    getAuthUser();
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return redirect("/auth/login");
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }
  
  return (
    <div className='flex'>
      <div className='w-[20%] hidden md:block border-r-2 h-screen fixed'>
        <LeftSidebar/>
        </div>      
        <div className='flex-1 md:ml-[20%] overflow-y-auto'>
          <div className='md:hidden'>
              <Sheet>
                <SheetTrigger>
                  <MenuIcon/>
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle></SheetTitle>
                  <SheetDescription>
                  </SheetDescription>
                  <LeftSidebar/>
                </SheetContent>
              </Sheet>
          </div>
            <Feed/>
        </div>
        <div className='w-[30%] pt-8 px-6 lg:block hidden'>
          <RighSidebar/>
        </div>
    </div>
  )
}

export default Home