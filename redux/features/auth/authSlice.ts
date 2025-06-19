import { RootState } from '@/redux/store'
import { Iuser } from '@/types'
import { createSlice,PayloadAction } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
import { initialize } from 'next/dist/server/lib/render-server'

interface IAuthPayload {
    user: Iuser | null
    token: null | string
}

const initialState:IAuthPayload ={
    user:null,
    token:null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuthUser:(state, action:  PayloadAction<IAuthPayload>)=>{
            
            state.user= action.payload.user,
            state.token=action.payload.token
        }
    }
})

export const{setAuthUser}=authSlice.actions
export default authSlice.reducer

export const useCurrentToken = (state : RootState)  => state.auth.token
export const useCurrentUser = (state : RootState)  => state.auth.user