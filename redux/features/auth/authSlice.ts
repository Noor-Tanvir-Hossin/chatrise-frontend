import { RootState } from '@/redux/store'
import { Iuser } from '@/types'
import { createSlice,PayloadAction } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
import { initialize } from 'next/dist/server/lib/render-server'

interface IAuthPayload {
    user: Iuser | null
    token?: null | string
}

const initialState:IAuthPayload ={
    user:null,
    token:null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuthUser: (state, action: PayloadAction<Partial<IAuthPayload>>) => {
            if (action.payload.user) {
              state.user = action.payload.user;
            }
            if (action.payload.token) {
              state.token = action.payload.token;
            }
          },
        logout : (state) =>{
            state.user = null, 
            state.token = null
        }
    }
})

export const{setAuthUser,logout}=authSlice.actions
export default authSlice.reducer

export const useCurrentToken = (state : RootState)  => state.auth.token
export const useCurrentUser = (state : RootState)  => state.auth.user