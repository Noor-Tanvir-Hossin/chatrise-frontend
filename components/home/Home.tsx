'use client'
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const user = useSelector((state:RootState)=>state.auth.user)
  // const user = useCurrentUser()
  console.log(user)
  return (
    <div>Home</div>
  )
}

export default Home