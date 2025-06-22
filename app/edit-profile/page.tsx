"use client";
import {
  setAuthUser,
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Loader, MenuIcon } from "lucide-react";
import LeftSidebar from "@/components/home/LeftSidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PasswordInput from "./../../components/auth/PasswordInput";
import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/server";
import { handleAtuhRequest } from "@/components/utils/apiRequest";
import { toast } from "sonner";
import { Iuser } from "@/types";

interface IUpdateUserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Iuser;
}
interface IUpdatePasswordResponse extends IUpdateUserProfileResponse{
 token:string
}

const EditProfilepage = () => {
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  const user = useSelector(useCurrentUser);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.profilePicture || null
  );
  const [bio, setBio] = useState(user?.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleUpdateUserProfile = async () => {
    // console.log(bio);
    const formData = new FormData();
    formData.append("bio", bio);
    if (fileInputRef.current?.files?.[0]) {
      formData.append("profilePicture", fileInputRef.current?.files?.[0]);
    }
    const updateUserProfileReq = async (): Promise<
      AxiosResponse<IUpdateUserProfileResponse>
    > => {
      const response = await axios.post<IUpdateUserProfileResponse>(
        `${BASE_API_URL}/user/edit-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response;
    };

    const result = await handleAtuhRequest(updateUserProfileReq, setIsLoading);

    if (result) {
      dispatch(
        setAuthUser({
          user: result.data.data,
          token: token,
        })
      );

      toast.success(result.data.message);

      setBio("");
    }
  };


  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const data={
        currentPass: currentPassword,  
        newPass: newPassword
    }
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    setConfirmError("");

    const updateUserPasswordReq = async (): Promise<
      AxiosResponse<IUpdatePasswordResponse>
    > => {
      const response = await axios.post<IUpdatePasswordResponse>(
        `${BASE_API_URL}/auth/changePassword`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response;
    };

    const result = await handleAtuhRequest(updateUserPasswordReq, setIsLoading);

    if (result) {
      dispatch(
        setAuthUser({
          user: result.data.data,
          token: result.data.token,
        })
      );

      toast.success(result.data.message);
      setCurrentPassword(""); 
      setNewPassword("");
      setConfirmPassword("")
    }


  };

  return (
    <div className="flex">
      <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
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
        <div className="w-[80%] mx-auto">
          <div className="mt-16 pb-16 border-b-2">
            <div
              onClick={handleAvatarClick}
              className="flex items-center justify-center cursor-pointer"
            >
              <Avatar className="w-[10rem] h-[10rem]">
                <AvatarImage
                  src={selectedImage || ""}
                  className="h-full w-full rounded-full"
                />

                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="flex items-center justify-center">
              <Button
                onClick={handleUpdateUserProfile}
                type="submit"
                disabled={isLoading}
                className="w-40 mt-6 bg-blue-800"
              >
                {isLoading && (
                  <Loader className="mr-2 h-4 w-4 animate-spin  " />
                )}
                Change Photo
              </Button>
            </div>
          </div>
          <div className="mt-10 border-b-2 pb-10">
            <label htmlFor="bio" className="block text-lg font-bold mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-[7rem] bg-gray-200 outline-none p-6 rounded-md"
            ></textarea>
            <Button
              onClick={handleUpdateUserProfile}
              type="submit"
              disabled={isLoading}
              className="w-40 mt-6 "
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin " />}
              Change Bio
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mt-6">
              Change Password
            </h1>
            <form className="my-8" onSubmit={handlePasswordChange}>
              <div className="w-[90%] md:w-[80%] lg:w-[60%]">
                <PasswordInput
                  name="currentpassword"
                  value={currentPassword}
                  label="Current Password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="w-[90%] md:w-[80%] lg:w-[60%] my-4">
                <PasswordInput
                  name="newpassword"
                  value={newPassword}
                  label="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="w-[90%] md:w-[80%] lg:w-[60%] my-4">
                <PasswordInput
                  name="confirmPassword"
                  value={confirmPassword}
                  label="Confirm Password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmError("");
                  }}
                />
                {confirmError && (
                  <p className="text-red-500 text-sm mt-1">{confirmError}</p>
                )}
              </div>
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-40 bg-red-700"
                >
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin " />
                  )}
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilepage;
