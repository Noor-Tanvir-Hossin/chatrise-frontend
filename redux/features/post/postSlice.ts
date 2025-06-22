
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComment, Ipost } from './../../../types.d';
import { RootState } from '@/redux/store';

interface IPostState{
    posts: Ipost[]
}

const initialState: IPostState ={
    posts:[]
}

const postSlice = createSlice({
    name:'post',
    initialState,
    reducers:{
        setPost:(state, action: PayloadAction<Ipost[]>) =>{
            state.posts=action.payload
        },
        addPost:(state,action:PayloadAction<Ipost>)=>{
            state.posts.unshift(action.payload)
        },
        deletePost:(state, action:PayloadAction<string>)=>{
            state.posts.filter((post)=>post._id !== action.payload)
        },
        likeOrDislike:(state, action:PayloadAction<{userId:string; postId:string}>)=>{
            const post=state.posts.find((post)=>post._id === action.payload.postId)
            if(post){
                if(post.likes.includes(action.payload.userId)){
                    post.likes= post.likes.filter((id)=>id !== action.payload.userId)
                }else{
                    post.likes.push(action.payload.userId)
                }
            }
        },
        addComment:(state,action:PayloadAction<{postId:string, comment:IComment}>)=>{
             const post = state.posts.find((post)=>post._id === action.payload.postId)
             if(post){
                post.comments.push(action.payload.comment)
             }
        }
    }
})

export const{setPost,addPost,deletePost, likeOrDislike, addComment}=postSlice.actions

export default postSlice.reducer

export const useAllPosts = (state : RootState)  => state.posts.posts
