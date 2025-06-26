'use client'
import React, { ChangeEvent, useState } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
// import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';


interface Props{
    name?:string
    label?:string;
    placeholder?:string;
    value?:string;
    onChange?:(e: ChangeEvent<HTMLInputElement>) => void;
    inputClassName?:string;
    labelClassName?:string;
    iconClassName?:string;

}

const PasswordInput = ({
    name,
    label,
    placeholder= "Enter Password",
    value,
    onChange,
    inputClassName="",
    labelClassName = "",
    iconClassName = ""
}: Props) => {
    const [showPassoword, setShowPassoword] = useState(false)
    const togglePasswordVisibility =()=>{
        setShowPassoword(!showPassoword)
    }
  return <>
  {
    label && (
        <Label 
        className={`font-semibold mb-2 block ${labelClassName}`}>
            {label}

        </Label>
    )
  }

  <div className='relative'>
        <Input
        type={showPassoword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none ${inputClassName}`}
        />
        <button type='button' onClick={togglePasswordVisibility}
        className={`absolute outline-none right-3 top-2 p-0`}>
            { showPassoword? (
                <Eye className='h-5 w-5'/>
            ) :(
                <EyeOff
                className='h-5 w-5'
                />
            )}
        </button>
       
  </div>
  </>
}

export default PasswordInput