'use client'
import { setAuthUser, useCurrentToken, useCurrentUser } from '@/redux/features/auth/authSlice';
import { addComment, likeOrDislike, setPost, useAllPosts } from '@/redux/features/post/postSlice';
import { BASE_API_URL } from '@/server';
import { ICommentResponse, IGetAllPostResponse, ILikeOrDislikeResponse, ISaveOrUnsaveResponse } from '@/types';
import axios, { AxiosResponse } from 'axios';
import React,{useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleAtuhRequest } from '../utils/apiRequest';
import { toast } from 'sonner';
import { Loader,HeartIcon, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import DotButton from '../helper/DotButton';
import Image from 'next/image';
import Comment from '../helper/Comment';

const Feed = () => {
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  console.log(token)
  const user = useSelector(useCurrentUser);
  const posts = useSelector(useAllPosts);
  console.log(posts)
  const [comment , setComment] =useState('')
  const [isLoading, setIsLoading] =useState(false)

  useEffect(()=>{
    const getAllPost = async() =>{
      const getAllPostReq = async (): Promise<
      AxiosResponse<IGetAllPostResponse>
    > => {
      const response = await axios.get<IGetAllPostResponse>(
        `${BASE_API_URL}/post`
      );
      return response;
    };

    const result = await handleAtuhRequest(getAllPostReq, setIsLoading);

    if (result) {
      dispatch(
        setPost(result.data.data.posts)
      );
    }
    };
    getAllPost() 
  },[dispatch])

  const handleLikeDisLike =async(id:string)=>{
    const getLikeOrDislikeReq = async (): Promise<
        AxiosResponse<ILikeOrDislikeResponse>
      > => {
        const response = await axios.post<ILikeOrDislikeResponse>(
          `${BASE_API_URL}/post/like-dislike-post/${id}`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("API SUCCESS ➔", response.data);
        if(response?.data.success){
          if(user?._id){
            dispatch(likeOrDislike({
              postId: id,
              userId: user?._id
            }))
          }
          toast.success(response?.data?.message)
        }
        return response
      };
      await getLikeOrDislikeReq()      
  }
  const handleSaveUnsave =async(id:string)=>{
    const getSaveOrUnsaveReq = async (): Promise<
    AxiosResponse<ISaveOrUnsaveResponse>
  > => {
    const response = await axios.post<ISaveOrUnsaveResponse>(
      `${BASE_API_URL}/post/save-unsave/${id}`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log("API SUCCESS save or unsave ➔", response.data);
    if(response?.data.success){
      dispatch(setAuthUser(
        {
          user: response.data.data.user,
          token: token,
        }
        
      ))
      toast.success(response?.data?.message)
    }
    return response
  };
  await getSaveOrUnsaveReq() 
  }
  const handleComment =async(id:string)=>{
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
    console.log("API SUCCESS save or unsave ➔", response.data);
    if(response?.data.success){
      dispatch(addComment({
        postId:id,
        comment:response?.data?.data
      }))
      toast.success(response?.data?.message)
      setComment('')
    }
    return response
  };
  await addCommentReq() 
  }
  if(isLoading){
    return(
      <div className='w-full h-screen flex items-center justify-center flex-col'>
        <Loader className='animate-spin'/>
      </div>
    )
  }
  if(posts.length<1){
    return(
      <div className='text-3xl m-8 text-center capitalize font-bold'>
        No Post To Show
      </div>
    )
  }

  

  return (
    <div className='my-20 w-[70%] mx-auto'>
      {
        posts?.map((post)=>{
          return (
          <div key={post._id} className='mt-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Avatar className='w-9 h-9'>
                  <AvatarImage
                  src={post.user?.profilePicture}
                  className='h-full w-full'
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1> {post.user?.name} </h1>
              </div>
              <DotButton post={post} user={user}/>
            </div>

            <div className='mt-2'>
              <Image
              src={`${post.image?.url}`}
              alt='Post Image'
              width={400}
              height={400}
              className='w-full'
              />
            </div>
            <div className='mt-3 flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <HeartIcon
                onClick={()=>{
                  handleLikeDisLike(post?._id)
                }}
                className={`cursor-pointer ${user?._id && post?.likes?.includes(user?._id) ? "text-red-500" : ''}`}/>
                <MessageCircle className='cursor-pointer'/>
                <Send className='cursor-pointer'/>
              </div>
                <Bookmark 
                onClick={()=>{handleSaveUnsave(post._id)}}
                className= {`cursor-pointer ${
                  (
                    user?.savePosts as string[])?.some(
                      (savedPostId:string)=> savedPostId === post._id
                    ) ? "text-red-500" : ''
                }`}/>
            </div>
            <h1 className='mt-2 text-sm font-semibold'>
              {
                post.likes.length
              } likes
            </h1>
            <p className='mt-2 font-medium'>
             {post.caption}
            </p>
            <Comment post={post} user={user}/>
            <div className='mt-2 flex items-center'>
              <input 
              type="text" 
              placeholder="Add a comment..."
              className="flex-1 placeholer"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              />
              <p 
              onClick={()=>{handleComment(post._id)}}
              role="button"
              className='text-sm font-semibold text-blue-700 cursor-pointer'>
                Post
              </p>
            </div>
            <div>
              
            </div>

          </div>
          )
          
        })
      }

    </div>
  )
}

export default Feed