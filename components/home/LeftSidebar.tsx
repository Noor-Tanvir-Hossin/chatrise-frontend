"use client";
import { logout, useCurrentUser } from "@/redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  HomeIcon,
  Search,
  MessageCircle,
  Heart,
  SquarePlus,
  LogOutIcon,
} from "lucide-react";
import React,{useState} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CreatePostModal from "./CreatePostModal";

const LeftSidebar = () => {
  const user = useSelector(useCurrentUser);
  const router = useRouter();
  const dispatch=useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const SidebarLinks = [
    {
      icon: <HomeIcon />,
      label: "Home",
    },
    {
      icon: <Search />,
      label: "Search",
    },
    {
      icon: <MessageCircle />,
      label: "Message",
    },
    {
      icon: <Heart />,
      label: "Notification",
    },
    {
      icon: <SquarePlus />,
      label: "Create",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} className="h-full w-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
    },
    {
      icon: <LogOutIcon />,
      label: "Logout",
    },
  ];
  const handleLogout=async()=>{
    dispatch(logout())
    toast.success('Logout Successfully')
    router.push("/auth/login")
  }
  const hadnleSidebar=(label: string)=>{
    console.log(label)
    if(label==="Home")
         {router.push("/")}
    if(label ==='Logout') handleLogout()
    if(label === 'Profile') router.push(`/profile/${user?._id}`)
      if(label === 'Create') setIsDialogOpen(true)

  }
  
  return (
    <div  className="h-full">
      <CreatePostModal isOpen={isDialogOpen} 
      onClose={()=> setIsDialogOpen(false)}/>
      <div className="lg:p-6 p-3 cursor-pointer">
        <div onClick={() => router.push("/")}>
          <Image
            src="/images/Chatrise.png"
            alt="Logo"
            width={120}
            height={120}
            className="mt-[-2rem]"
          />
        </div>
        <div className="mt-6">
          {SidebarLinks.map((link) => {
            return (
              <div
                key={link.label}
                className=" p-3 rounded-lg group cursor-pointer transition-all duration-200 hover:bg-gray-100 space-x-2"
                onClick={()=>hadnleSidebar(link.label)}
              >
                <div className="flex items-center gap-2 group-hover:scale-110 transition-all duration-200 ">
                  {link.icon}
                  <p className="lg:text-lg text-base"> {link.label} </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
