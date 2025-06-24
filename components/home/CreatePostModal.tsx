"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useCurrentToken,
    useCurrentUser,
  } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { ImageIcon, Loader } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosResponse } from "axios";
import { ICreatePostResponse } from "@/types";
import { BASE_API_URL } from "@/server";
import { handleAtuhRequest } from "../utils/apiRequest";
import { addPost } from "@/redux/features/post/postSlice";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(useCurrentToken);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setPreviewImage(null);
      setCaption("");
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    if(fileInputRef.current){
        fileInputRef.current.click()
    }
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files[0]){
        const file= event.target.files[0]
        if(!file.type.startsWith("image/")){
            toast.error('Please select a valid image')
        }

        if(file.size > 10*1024*1024){
            toast.error('File size should not exceed 10MB')
        }
        const imageUrl= URL.createObjectURL(file)
        setSelectedImage(file)
        setPreviewImage(imageUrl)
    }
  };
  const handleCreatePost = async () => {
    if(!selectedImage){
        toast.error('Please select an image to create a post!')
    }
    const formData = new FormData()
    formData.append('caption', caption)
    if(selectedImage){
        formData.append('image',selectedImage)
    }

    // create-post request

    const createPostReq = async (): Promise<
      AxiosResponse<ICreatePostResponse>
    > => {
      const response = await axios.post<ICreatePostResponse>(
        `${BASE_API_URL}/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `${token}`,
            "Content-Type":"multipart/form-data"
          },
        }
      );
      return response;
    };

    const result = await handleAtuhRequest(createPostReq, setIsLoading);

    if (result) {
      dispatch(
        addPost(result.data.data)
      );
      toast.success(result.data.message);
      setSelectedImage(null);
      setPreviewImage(null);
      setCaption("");
      onClose()
      router.push("/")
      router.refresh()

      
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
          {previewImage ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="mt-4">
                <Image
                  src={previewImage}
                  alt="Image"
                  width={400}
                  height={400}
                  className="overflow-auto max-h-96 rounded-md object-contain w-full"
                />
              </div>
              <input type="text" value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Write a caption ..."
              className="mt-4 p-2 border rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex space-x-4 mt-4">
              <Button
                  onClick={handleCreatePost}
                  type="submit"
                  disabled={isLoading}
                  className="w-40 bg-gray-600 text-white hover:bg-blue-700"
                >
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin " />
                  )}
                  Create Post
                </Button>
                <Button className="bg-gray-500 text-white hover:bg-gray-600" 
                onClick={()=>{
                    setPreviewImage(null)
                    setSelectedImage(null)
                    setCaption('')
                    onClose()
                }}
                >
                    Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
            <DialogHeader>
            <DialogTitle className="text-center my-3">Upload Photo</DialogTitle>            
            </DialogHeader>
            <div className='flex flex-col items-center justify-center text-center space-y-4'>
                <div className="flex space-x-2 text-gray-600">
                    <ImageIcon size={40}/>
                </div>
                <p className="text-gray-600 mt-4">Select a photo from your computer</p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleButtonClick}
                >
                    Select from computer
                </Button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
            </>
          )}
        
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
