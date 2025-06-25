import { BASE_API_URL } from "@/server";
import { IFollowUnfollowResponse } from "@/types";
import axios, { AxiosResponse } from "axios";
import { useDispatch,useSelector } from "react-redux"
import { setAuthUser, useCurrentToken, useCurrentUser } from '@/redux/features/auth/authSlice';
import { handleAtuhRequest } from "../utils/apiRequest";
import { toast } from "sonner";


export const useFollowUnfolow = () =>{
    const dispatch = useDispatch()
    const token = useSelector(useCurrentToken);

    const handleFollowUnfollow = async (id: string) => {
        const followUnfollowReq = async (): Promise<
        AxiosResponse<IFollowUnfollowResponse>
      > => {
        const response = await axios.post<IFollowUnfollowResponse>(
          `${BASE_API_URL}/user/follow-unfollow/${id}`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        return response
      };
      const result = await handleAtuhRequest(followUnfollowReq);
        console.log("API SUCCESS save or unsave ➔", result?.data);
        if(result?.data.success){
            dispatch(setAuthUser(
                {
                  user: result?.data?.data,
                  token: token,
                }
                
              ))
          toast.success(result?.data?.message)
       
        }
        
      
      };
      return {handleFollowUnfollow}
}
