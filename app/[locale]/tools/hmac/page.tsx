'use client'

import { useState } from 'react'
import CryptoJS from 'crypto-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Fingerprint, Shield, CheckCircle, XCircle } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

const hmacAlgorithms = [
  { value: 'SHA1', name: 'HMAC-SHA1', description: '160位哈希值' },
  { value: 'SHA256', name: 'HMAC-SHA256', description: '256位哈希值（推荐）' },
  { value: 'SHA512', name: 'HMAC-SHA512', description: '512位哈希值' },
  { value: 'SHA3', name: 'HMAC-SHA3', description: 'SHA-3哈希值' },
  { value: 'MD5', name: 'HMAC-MD5', description: '128位哈希值（不推荐）' }
]

export default function HMACGeneratorPage() {
  const [algorithm, setAlgorithm] = useState('SHA256')
  
  // Generate HMAC state
  const [message, setMessage] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [hmacResult, setHmacResult] = useState('')
  
  // Verify HMAC state
  const [verifyMessage, setVerifyMessage] = useState('')
  const [verifyKey, setVerifyKey] = useState('')
  const [verifyHmac, setVerifyHmac] = useState('')
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  const generateHMAC = () => {
    if (!message.trim()) {
      toast.error('请输入要签名的消息')
      return
    }
    if (!secretKey.trim()) {
      toast.error('请输入密钥')
      return
    }

    try {
      let hmac: string
      
      switch (algorithm) {
        case 'SHA1':
          hmac = CryptoJS.HmacSHA1(message, secretKey).toString()
          break
        case 'SHA256':
          hmac = CryptoJS.HmacSHA256(message, secretKey).toString()
          break
        case 'SHA512':
          hmac = CryptoJS.HmacSHA512(message, secretKey).toString()
          break
        case 'SHA3':
          hmac = CryptoJS.HmacSHA3(message, secretKey).toString()
          break
        case 'MD5':
          hmac = CryptoJS.HmacMD5(message, secretKey).toString()
          break
        default:
          hmac = CryptoJS.HmacSHA256(message, secretKey).toString()
      }
      
      setHmacResult(hmac)
      toast.success('HMAC生成成功')
    } catch (error) {
      toast.error('HMAC生成失败: ' + (error as Error).message)
    }
  }

  const verifyHMAC = () => {
    if (!verifyMessage.trim()) {
      toast.error('请输入要验证的消息')
      return
    }
    if (!verifyKey.trim()) {
      toast.error('请输入密钥')
      return
    }
    if (!verifyHmac.trim()) {
      toast.error('请输入要验证的HMAC值')
      return
    }

    try {
      let computedHmac: string
      
      switch (algorithm) {
        case 'SHA1':
          computedHmac = CryptoJS.HmacSHA1(verifyMessage, verifyKey).toString()
          break
        case 'SHA256':
          computedHmac = CryptoJS.HmacSHA256(verifyMessage, verifyKey).toString()
          break
        case 'SHA512':
          computedHmac = CryptoJS.HmacSHA512(verifyMessage, verifyKey).toString()
          break
        case 'SHA3':
          computedHmac = CryptoJS.HmacSHA3(verifyMessage, verifyKey).toString()
          break
        case 'MD5':
          computedHmac = CryptoJS.HmacMD5(verifyMessage, verifyKey).toString()
          break
        default:
          computedHmac = CryptoJS.HmacSHA256(verifyMessage, verifyKey).toString()
      }
      
      const isValid = computedHmac.toLowerCase() === verifyHmac.toLowerCase()
      setVerificationResult(isValid)
      toast.success(isValid ? 'HMAC验证成功' : 'HMAC验证失败')
    } catch (error) {
      toast.error('HMAC验证失败: ' + (error as Error).message)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const generateRandomKey = (length: number = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const clearResults = () => {
    setHmacResult('')
    setVerificationResult(null)
  }

  return (
    <MainLayout>
      <ToolLayout
        title="HMAC生成器"
        description="生成和验证基于哈希的消息认证码（HMAC）"
        icon="Fingerprint"
      >
        <div className="space-y-6">
          {/* Algorithm Selection */}
          <div>
            <Label htmlFor="algorithm">HMAC算法</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="w-64 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hmacAlgorithms.map((alg) => (
                  <SelectItem key={alg.value} value={alg.value}>
                    <div>
                      <div className="font-medium">{alg.name}</div>
                      <div className="text-xs text-muted-foreground">{alg.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                生成HMAC
              </TabsTrigger>
              <TabsTrigger value="verify" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                验证HMAC
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <h3 className="text-lg font-semibold">生成HMAC签名</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">消息内容</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="输入要签名的消息内容..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="secret-key">密钥</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSecretKey(generateRandomKey())}
                    >
                      生成随机密钥
                    </Button>
                  </div>
                  <Input
                    id="secret-key"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="输入HMAC密钥"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateHMAC} className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    生成HMAC
                  </Button>
                  {hmacResult && (
                    <Button variant="outline" onClick={clearResults}>
                      清除结果
                    </Button>
                  )}
                </div>

                {hmacResult && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">HMAC结果</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(hmacResult)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                          {hmacResult}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">算法: {algorithm}</Badge>
                          <Badge variant="outline">长度: {hmacResult.length}</Badge>
                          <Badge variant="outline">编码: 十六进制</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="verify" className="space-y-4">
              <h3 className="text-lg font-semibold">验证HMAC签名</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-message">消息内容</Label>
                  <Textarea
                    id="verify-message"
                    value={verifyMessage}
                    onChange={(e) => setVerifyMessage(e.target.value)}
                    placeholder="输入要验证的消息内容..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-key">密钥</Label>
                  <Input
                    id="verify-key"
                    type="password"
                    value={verifyKey}
                    onChange={(e) => setVerifyKey(e.target.value)}
                    placeholder="输入HMAC密钥"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verify-hmac">HMAC值</Label>
                  <Input
                    id="verify-hmac"
                    value={verifyHmac}
                    onChange={(e) => setVerifyHmac(e.target.value)}
                    placeholder="输入要验证的HMAC值"
                    className="font-mono"
                  />
                </div>

                <Button onClick={verifyHMAC} className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  验证HMAC
                </Button>

                {verificationResult !== null && (
                  <Card>
                    <CardContent className="p-6">
                      <div className={`flex items-center gap-3 ${
                        verificationResult ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verificationResult ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <XCircle className="h-6 w-6" />
                        )}
                        <div>
                          <div className="font-semibold text-lg">
                            {verificationResult ? '验证成功' : '验证失败'}
                          </div>
                          <div className="text-sm opacity-80">
                            {verificationResult 
                              ? '提供的HMAC值与计算结果匹配' 
                              : '提供的HMAC值与计算结果不匹配'
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">HMAC说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Badge>消息认证</Badge>
                <span className="text-sm text-muted-foreground">验证消息的完整性和真实性</span>
              </div>
              <div className="flex gap-3">
                <Badge>密钥保护</Badge>
                <span className="text-sm text-muted-foreground">需要密钥才能生成和验证HMAC</span>
              </div>
              <div className="flex gap-3">
                <Badge>抗篡改</Badge>
                <span className="text-sm text-muted-foreground">任何消息或密钥的改变都会导致HMAC不匹配</span>
              </div>
              <div className="flex gap-3">
                <Badge>API安全</Badge>
                <span className="text-sm text-muted-foreground">广泛用于API签名和身份验证</span>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <div className="font-medium mb-1">常见应用场景:</div>
                  <div className="text-xs space-y-1">
                    <div>• API请求签名验证</div>
                    <div>• Webhook消息验证</div>
                    <div>• 数据完整性校验</div>
                    <div>• JWT令牌签名</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}