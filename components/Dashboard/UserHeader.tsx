"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const UserHeader = () => {
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={64} height={64} className="h-10 w-24 sm:h-14 sm:w-36" priority />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <h1 className="text-xl font-bold">Welcome back, Alex</h1>
            <p className="text-gray-500 text-sm">Your portfolio is growing steadily</p>
          </div>
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&w=48&h=48&facepad=2" alt="User" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}