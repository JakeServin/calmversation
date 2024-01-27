"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SignUp from '@/features/auth/SignUp';
import Link from 'next/link';
import React from 'react'

const page = () => {
  return (
    <section className=''>
      <SignUp />
    </section>
  )
}

export default page