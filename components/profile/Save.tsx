import React from 'react'
import { Iuser } from '@/types';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';

interface props {
    userProfile: Iuser | undefined;
};


const Save = ({userProfile}:props) => {
  return (
    <div className='mt-10 grid gridcol1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
      {
        userProfile ?.savePosts?.map((post)=>{
          if(typeof post === 'string') return null

          return(
            <div key={post._id}
            className='relative group overflow-hidden '
            >
              <div className="relative w-full aspect-square">

              <Image
              src={`${post?.image?.url}`}
              alt='Post Image'
              fill
              className='object-cover'
              />
               </div>
              <div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out'>
              <div className='flex space-x-6'>
                <button className='p-2 rounded-full text-white space-x-2 flex items-center font-bold'>
                  <Heart className='w-7 h-7'/>
                  <span>
                    {post?.likes.length}
                  </span>
                </button>
                <button className='p-2 rounded-full text-white space-x-2 flex items-center font-bold'>
                  <MessageCircle className='w-7 h-7'/>
                  <span>
                    {post?.comments.length}
                  </span>
                </button>
              </div>
              </div>

            </div>
          )
        })
      }      
    </div>
  )
}

export default Save