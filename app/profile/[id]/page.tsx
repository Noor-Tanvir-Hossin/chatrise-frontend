import Profile from '@/components/profile/Profile'
import React from 'react'

const Profilepage = async({params}:{params:{id:string}}) => {
    const id=(await params).id
    console.log(id)
  return <>
  <Profile id={id}/>
  </>
}

export default Profilepage