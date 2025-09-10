'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

interface JWTPayload {
  header: Record<string, unknown> | null
  payload: Record<string, unknown> | null
  signature: string
  valid: boolean
  error?: string
}

export default function JWTParserPage() {
  const [jwtInput, setJwtInput] = useState('')
  const [parsedJWT, setParsedJWT] = useState<JWTPayload | null>(null)
  const [showDecoded, setShowDecoded] = useState(true)

  const parseJWT = () => {
    if (!jwtInput.trim()) {
      toast.error('请输入JWT token')
      return
    }

    try {
      const parts = jwtInput.split('.')
      if (parts.length !== 3) {
        throw new Error('无效的JWT格式')
      }

      // 解码header
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
      
      // 解码payload
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      
      // 获取signature
      const signature = parts[2]

      setParsedJWT({
        header,
        payload,
        signature,
        valid: true
      })

      toast.success('JWT解析成功')
    } catch (error) {
      setParsedJWT({
        header: null,
        payload: null,
        signature: '',
        valid: false,
        error: error instanceof Error ? error.message : '解析失败'
      })
      toast.error('JWT解析失败')
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
      toast.success(`${label}已复制到剪贴板`)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const isExpired = (exp?: number) => {
    if (!exp) return false
    return Date.now() / 1000 > exp
  }

  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzU2ODkwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  return (
    <MainLayout>
      <ToolLayout
        title="JWT解析器"
        description="解析和验证JSON Web Token (JWT)"
        icon="Shield"
      >
        <div className="space-y-6">
          {/* JWT Input */}
          <Card>
            <CardHeader>
              <CardTitle>JWT Token输入</CardTitle>
              <CardDescription>输入需要解析的JWT token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jwt-input">JWT Token</Label>
                <Textarea
                  id="jwt-input"
                  placeholder="输入JWT token (eyJ...)"
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={parseJWT}>
                  解析JWT
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setJwtInput(sampleJWT)}
                >
                  使用示例
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setJwtInput('')
                    setParsedJWT(null)
                  }}
                >
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parsed Results */}
          {parsedJWT && (
            <div className="space-y-4">
              {parsedJWT.valid ? (
                <>
                  {/* Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Header</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(JSON.stringify(parsedJWT.header, null, 2), 'Header')}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>JWT头部信息</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(parsedJWT.header, null, 2)}
                      </pre>
                      <div className="mt-3 flex gap-2">
                        <Badge variant="outline">
                          算法: {String(parsedJWT.header?.alg || 'N/A')}
                        </Badge>
                        <Badge variant="outline">
                          类型: {String(parsedJWT.header?.typ || 'N/A')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payload */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Payload</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDecoded(!showDecoded)}
                            className="h-8 w-8"
                          >
                            {showDecoded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(JSON.stringify(parsedJWT.payload, null, 2), 'Payload')}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>JWT载荷数据</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showDecoded && (
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-4">
                          {JSON.stringify(parsedJWT.payload, null, 2)}
                        </pre>
                      )}
                      
                      {/* Standard Claims */}
                      <div className="space-y-2">
                        <h4 className="font-medium">标准声明</h4>
                        <div className="grid gap-2 text-sm">
                          {parsedJWT.payload && 'sub' in parsedJWT.payload && (
                            <div><strong>Subject (sub):</strong> {String(parsedJWT.payload.sub)}</div>
                          )}
                          {parsedJWT.payload && 'iss' in parsedJWT.payload && (
                            <div><strong>Issuer (iss):</strong> {String(parsedJWT.payload.iss)}</div>
                          )}
                          {parsedJWT.payload && 'aud' in parsedJWT.payload && (
                            <div><strong>Audience (aud):</strong> {String(parsedJWT.payload.aud)}</div>
                          )}
                          {parsedJWT.payload && typeof parsedJWT.payload.exp === 'number' && (
                            <div className="flex items-center gap-2">
                              <strong>Expires (exp):</strong> 
                              {formatTimestamp(parsedJWT.payload.exp as number)}
                              {isExpired(parsedJWT.payload.exp as number) && (
                                <Badge variant="destructive">已过期</Badge>
                              )}
                            </div>
                          )}
                          {parsedJWT.payload && typeof parsedJWT.payload.nbf === 'number' && (
                            <div><strong>Not Before (nbf):</strong> {formatTimestamp(parsedJWT.payload.nbf as number)}</div>
                          )}
                          {parsedJWT.payload && typeof parsedJWT.payload.iat === 'number' && (
                            <div><strong>Issued At (iat):</strong> {formatTimestamp(parsedJWT.payload.iat as number)}</div>
                          )}
                          {parsedJWT.payload && 'jti' in parsedJWT.payload && (
                            <div><strong>JWT ID (jti):</strong> {String(parsedJWT.payload.jti)}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Signature */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Signature</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(parsedJWT.signature, 'Signature')}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>JWT签名信息</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded text-sm font-mono break-all">
                        {parsedJWT.signature}
                      </div>
                      <div className="mt-3">
                        <Badge variant="outline">
                          需要密钥验证签名有效性
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>解析失败</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-destructive">
                      {parsedJWT.error}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>JWT说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                JSON Web Token (JWT) 是一种开放标准 (RFC 7519)，用于在各方之间安全地传输信息。
              </p>
              <div className="space-y-2">
                <div><strong>JWT结构：</strong></div>
                <div className="text-sm space-y-1">
                  <div><strong>Header:</strong> 包含token类型和签名算法</div>
                  <div><strong>Payload:</strong> 包含声明(claims)信息</div>
                  <div><strong>Signature:</strong> 用于验证token完整性</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded text-sm">
                <strong>注意:</strong> 本工具仅解析JWT内容，不验证签名。生产环境中请使用适当的密钥验证JWT签名。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}