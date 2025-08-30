'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UUIDRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/tools/id-generator')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在重定向...</h1>
        <p className="text-muted-foreground">
          UUID生成器已升级为ID生成器，支持更多格式
        </p>
      </div>
    </div>
  )
}