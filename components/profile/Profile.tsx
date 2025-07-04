"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { Iuser } from "@/types";
import axios, { AxiosResponse } from "axios";
import { Grid, Loader, MenuIcon,Bookmark } from "lucide-react";
import { BASE_API_URL } from "@/server";
import { handleAtuhRequest } from "../utils/apiRequest";
import LeftSidebar from "../home/LeftSidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Post from './Post';
import Save from "./Save";
import { useFollowUnfolow } from "../hooks/use.auth";

interface IProps {
  id: string;
}

interface IUserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Iuser;
}

const Profile = ({ id }: IProps) => {
  const {handleFollowUnfollow} = useFollowUnfolow()
  const user = useSelector(useCurrentUser);
  const router = useRouter();
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<Iuser>();

  const isOwnProfile = user?._id === id;
  const isFollowing = user?.following?.includes(id);
  console.log("user", userProfile);

  useEffect(() => {
    if (!user) {
      return router.push("/auth/login");
    }
    const getUser = async () => {
      const getUserReq = async (): Promise<
        AxiosResponse<IUserProfileResponse>
      > => {
        const response = await axios.get<IUserProfileResponse>(
          `${BASE_API_URL}/user/profile/${id}`
        );
        return response;
      };

      const result = await handleAtuhRequest(getUserReq, setIsLoading);

      if (result) {
        setUserProfile(result?.data?.data);
      }
    };
    getUser();
  }, [user, router, id]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex mb-20">
      <div className="w-[20%] hidden md:block border-r-2  h-screen fixed">
        <LeftSidebar />
      </div>
      <div className="flex-1 md:ml-[20%] overflow-y-auto">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <LeftSidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="w-[90%] sm:w-[80%] mx-auto">
          {/* top profile */}
          <div className="mt-16 flex md:flex-row flex-col md:items-center pb-16 border-b-2 md:space-x-20">
            <Avatar className="w-[10rem] h-[10rem] mb-8 md:mb-0">
              <AvatarImage
                src={userProfile?.profilePicture}
                className="h-full w-full rounded-full"
              />

              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold">{userProfile?.name}</h1>
                {isOwnProfile && (
                  <Link href="/edit-profile">
                    <Button variant={"secondary"}>Edit Profile</Button>
                  </Link>
                )}
                {!isOwnProfile && (
                  <Button 
                  onClick={()=>{handleFollowUnfollow(id)}}
                  variant={isFollowing ? "destructive" : "secondary"}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-8 mt-6 mb-6">
                <div>
                  <span className="font-bold">
                    {" "}
                    {userProfile?.posts?.length}{" "}
                  </span>
                  <span>Posts</span>
                </div>
                <div>
                  <span className="font-bold">
                    {" "}
                    {userProfile?.followers?.length}{" "}
                  </span>
                  <span>Follwers</span>
                </div>
                <div>
                  <span className="font-bold">
                    {" "}
                    {userProfile?.following?.length}{" "}
                  </span>
                  <span>Following</span>
                </div>
              </div>
              <p> {userProfile?.bio || "My Profile Bio Here"} </p>
            </div>
          </div>
          {/* Bottom post and save */}
          <div className="mt-20">
            <div className="flex items-center justify-center space-x-14 ">
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "POST" && "text-blue-500"
                )}
                onClick={() => setPostOrSave("POST")}
              >
                <Grid />
                <span className="font-semibold"> Post </span>
              </div>
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "SAVE" && "text-blue-500"
                )}
                onClick={() => setPostOrSave("SAVE")}
              >
                <Bookmark />
                <span className="font-semibold"> Save </span>
              </div>
            </div>
            {postOrSave === 'POST' && <Post userProfile={userProfile}/>}
            {postOrSave === 'SAVE' && <Save userProfile={userProfile}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
