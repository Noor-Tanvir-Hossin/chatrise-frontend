import { Iuser } from '@/types';
import React from 'react'

interface props {
    userProfile: Iuser | undefined;
};

const Post = ({userProfile}:props) => {
  return (
    <div>Post</div>
  )
}

export default Post