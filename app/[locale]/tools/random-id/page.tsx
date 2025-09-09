'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RandomIdRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/tools/id-generator')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">正在重定向...</h1>
        <p className="text-muted-foreground">
          随机ID生成器已合并到ID生成器中，支持更多格式
        </p>
      </div>
    </div>
  )
}