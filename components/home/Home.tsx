'use client'
import { useCurrentUser,useCurrentToken } from '@/redux/features/auth/authSlice'
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const user =  useSelector(useCurrentUser);
  const token =  useSelector(useCurrentToken);
  console.log(token)
  return (
    <div>Home</div>
  )
}

export default Home