"use client";
import { IPostDeleteResponse, Ipost, Iuser } from "@/types";
import React from "react";
import { useDispatch,useSelector } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFollowUnfolow } from "../hooks/use.auth";
import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/server";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { handleAtuhRequest } from "../utils/apiRequest";
import { deletePost } from "@/redux/features/post/postSlice";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface IProps {
  post: Ipost | null;
  user: Iuser | null;
}

const DotButton = ({ post, user }: IProps) => {
  const{handleFollowUnfollow}=useFollowUnfolow()
  const isOwnPost = post?.user?._id === user?._id;
  const isFollowing = post?.user?._id
    ? user?.following?.includes(post.user._id)
    : false;

  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  const handleDeletePost = async () => {
    const delePostReq = async (): Promise<
      AxiosResponse<IPostDeleteResponse>
    > => {
      const response = await axios.delete<IPostDeleteResponse>(
        `${BASE_API_URL}/post/delete-post/${post?._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response;
    };

    const result = await handleAtuhRequest(delePostReq);

    if (result?.data.success &&  post?._id) {
      dispatch(
        deletePost(post?._id)
      );
      toast.success(result.data.message);
      redirect("/")
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Ellipsis className="w-8 h-8 text-black" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto">
            {!isOwnPost && (
              <div>
                <Button
                onClick={()=>{if(post?.user?._id) handleFollowUnfollow(post?.user?._id)}}
                variant={isFollowing ? 'destructive' : 'secondary'}>
                    { isFollowing ? "Unfollow" : "Follow" }
                </Button>
              </div>
            )}
            <Link href={`/profile/${post?.user?._id}`}>
            <Button variant={"secondary"}>
                About This Account
            </Button>
          </Link>
          {
            isOwnPost && (
                <Button variant={"destructive"}
                onClick={handleDeletePost}
                >
                    Delete Post
                </Button>
            )
          }
          <DialogClose> Close </DialogClose>
          </div>
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DotButton;
