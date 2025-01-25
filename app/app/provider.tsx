"use client"

import { PolkadotProvider } from "@/app/wallet/context"
import React, { ReactNode } from "react"
import { ToastContainer } from "react-toastify"
// console.log(process.env.NEXT_PUBLIC_COMMUNE_API)
const Providers = ({ children }: { children: ReactNode }) => {
  return (
    
    <PolkadotProvider wsEndpoint={String(process.env.NEXT_PUBLIC_COMMUNE_API)}>
      {children} <ToastContainer />
    </PolkadotProvider>
  )
}

export default Providers
