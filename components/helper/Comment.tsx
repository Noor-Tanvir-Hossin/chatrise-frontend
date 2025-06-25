"use client";
import React, { useState } from "react";
import { ICommentResponse, Ipost, Iuser } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DotButton from "./DotButton";
import { Button } from "../ui/button";
import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/server";
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { toast } from 'sonner';
import { handleAtuhRequest } from "../utils/apiRequest";
import { addComment } from '@/redux/features/post/postSlice';

interface IProps {
  post: Ipost | null;
  user: Iuser | null;
}

const Comment = ({ post, user }: IProps) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);

  const handleaddComment = async (id: string) => {
    if(!comment) return
    const addCommentReq = async (): Promise<
    AxiosResponse<ICommentResponse>
  > => {
    const response = await axios.post<ICommentResponse>(
      `${BASE_API_URL}/post/comment/${id}`,
      {comment:comment},
      {
        withCredentials: true,
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response
  };
  const result = await handleAtuhRequest(addCommentReq);
    console.log("API SUCCESS save or unsave ➔", result?.data);
    if(result?.data.success){
      dispatch(addComment({
        postId:id,
        comment:result?.data?.data
      }))
      toast.success(result?.data?.message)
      setComment('')
    }
    
  
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <p>View All {post?.comments.length} Comment </p>
        </DialogTrigger>
        <DialogContent className="max-w-5xl p-0 gap-0 flex flex-col">
          <DialogTitle></DialogTitle>
          <div className="flex flex-1">
            <div className="sm:w-1/2 hidden max-h-[80vh]  sm:block">
              <Image
                src={`${post?.image?.url}`}
                alt="Post Image"
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-l-lg "
              />
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between mt-4 p-4">
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src={post?.user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm"> {post?.user?.name} </p>
                  </div>
                </div>
                <DotButton user={user} post={post} />
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {post?.comments.map((comment) => {
                  return <div 
                  key={comment._id}
                  className='flex mb-4 gap-3 items-center'
                  >
                    <Avatar>
                        <AvatarImage 
                        src={comment?.user?.profilePicture}
                        />
                    <AvatarFallback>CN</AvatarFallback>                      
                    </Avatar>
                    <div className='flex items-center space-x-2'>
                        <p className="text-sm font-bold"> {comment?.user?.name} </p>
                        <p className="text-sm font-normal"> {comment?.text} </p>
                    </div>

                  </div>;
                })}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                    <input type="text"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full outline-none border text-sm border-e-gray-300 p-2 rounded"
                    />
                    <Button 
                    onClick={()=>{
                      if(post?._id) handleaddComment(post._id)
                    }}
                    variant={"outline"}>
                        Send
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comment;
