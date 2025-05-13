"use client"

import { useEffect, useState } from "react"

export function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<{
    url: boolean
    key: boolean
  }>({ url: false, key: false })

  useEffect(() => {
    setEnvStatus({
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  return (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md mb-4">
      <h3 className="font-bold">Environment Variables Status:</h3>
      <ul className="list-disc pl-5 mt-2">
        <li>NEXT_PUBLIC_SUPABASE_URL: {envStatus.url ? "Available ✅" : "Missing ❌"}</li>
        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envStatus.key ? "Available ✅" : "Missing ❌"}</li>
      </ul>
    </div>
  )
}
