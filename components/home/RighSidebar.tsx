"use client";
import {
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Iuser } from "@/types";
import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/server";
import { handleAtuhRequest } from "../utils/apiRequest";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ISuggestedUserResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Iuser[];
}

const RighSidebar = () => {
  const user = useSelector(useCurrentUser);
  console.log(user);
  const token = useSelector(useCurrentToken);
  const router = useRouter();
  const [suggestedUser, setSuggestedUser] = useState<Iuser[]>([]);
  console.log(suggestedUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getSuggestedUser = async (): Promise<any> => {
      const suggestedUserReq = async (): Promise<
        AxiosResponse<ISuggestedUserResponse>
      > => {
        const response = await axios.get<ISuggestedUserResponse>(
          `${BASE_API_URL}/user/suggested-user`,

          {
            withCredentials: true,
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        return response;
      };

      const result = await handleAtuhRequest(suggestedUserReq, setIsLoading);

      if (result) {
        setSuggestedUser(result.data.data);
      }
    };
    getSuggestedUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className=" animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex flex-1 items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              className="h-full w-full rounded-full"
            />

            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold">{user?.name}</h1>
            <p className="text-gray-700">
              {user?.bio || "My Profile Bio Here"}
            </p>
          </div>
        </div>
        <h1 className="font-medium text-blue-700 cursor-pointer">Switch</h1>
      </div>
      <div className="flex items-center justify-center mt-8">
        <h1 className="flex-1  font-semibold">Suggested User</h1>
        <h1 className="font-medium cursor-pointer">See all</h1>
      </div>
      {suggestedUser?.slice(0, 5).map((s_user) => {
        return (
          <div onClick={()=>router.push(`/profile/${s_user?._id}`)} key={s_user?._id} className="mt-6 cursor-pointer">
            <div className="flex items-start justify-start">
              <div className="flex items-center space-x-4 cursor-pointer">
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    src={s_user?.profilePicture}
                    className="h-full w-full rounded-full"
                  />

                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div >
                  <h1 className="font-bold"> {s_user?.name} </h1>
                  <p className="text-gray-700"> {s_user?.bio || 'My Profile Bio Here'} </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RighSidebar;
