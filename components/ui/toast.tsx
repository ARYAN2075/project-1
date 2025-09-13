"use client"

import * as React from "react"
import { toast as showToast } from "sonner@2.0.3"
import { X } from "lucide-react"

import { cn } from "./utils"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

const Toaster = () => {
  return (
    <div
      className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    />
  )
}

const toast = {
  success: (message: string) => {
    showToast.success(message, {
      className: "bg-green-500/10 border-green-500/20 text-green-400",
    })
  },
  error: (message: string) => {
    showToast.error(message, {
      className: "bg-red-500/10 border-red-500/20 text-red-400",
    })
  },
  info: (message: string) => {
    showToast.info(message, {
      className: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    })
  },
  warning: (message: string) => {
    showToast.warning(message, {
      className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    })
  },
}

export { ToastProvider, Toaster, toast }