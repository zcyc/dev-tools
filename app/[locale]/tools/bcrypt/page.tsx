'use client'

import { useState } from 'react'
import bcrypt from 'bcryptjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Shield, CheckCircle, XCircle, KeyRound } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function BcryptPage() {
  // Hash generation state
  const [password, setPassword] = useState('')
  const [saltRounds, setSaltRounds] = useState(10)
  const [hashedPassword, setHashedPassword] = useState('')
  const [isHashing, setIsHashing] = useState(false)

  // Hash verification state
  const [verifyPassword, setVerifyPassword] = useState('')
  const [verifyHash, setVerifyHash] = useState('')
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const generateHash = async () => {
    if (!password.trim()) {
      toast.error('请输入要加密的密码')
      return
    }

    setIsHashing(true)
    try {
      const hash = await bcrypt.hash(password, saltRounds)
      setHashedPassword(hash)
      toast.success('密码哈希生成成功')
    } catch (error) {
      toast.error('密码哈希生成失败: ' + (error as Error).message)
    } finally {
      setIsHashing(false)
    }
  }

  const verifyPasswordHash = async () => {
    if (!verifyPassword.trim() || !verifyHash.trim()) {
      toast.error('请输入密码和哈希值')
      return
    }

    setIsVerifying(true)
    try {
      const isValid = await bcrypt.compare(verifyPassword, verifyHash)
      setVerificationResult(isValid)
      toast.success(isValid ? '密码验证成功' : '密码验证失败')
    } catch (error) {
      toast.error('密码验证失败: ' + (error as Error).message)
      setVerificationResult(null)
    } finally {
      setIsVerifying(false)
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

  const clearResults = () => {
    setHashedPassword('')
    setVerificationResult(null)
  }

  return (
    <MainLayout>
      <ToolLayout
        title="Bcrypt加密"
        description="Bcrypt密码哈希和验证工具"
        icon="KeyRound"
      >
        <Tabs defaultValue="hash" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hash" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              密码加密
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              密码验证
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hash" className="space-y-6">
            {/* Hash Generation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">生成密码哈希</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入要加密的密码"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salt-rounds">盐轮数（Salt Rounds）</Label>
                  <Select value={saltRounds.toString()} onValueChange={(value) => setSaltRounds(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 - 快速（测试用）</SelectItem>
                      <SelectItem value="8">8 - 较快</SelectItem>
                      <SelectItem value="10">10 - 推荐</SelectItem>
                      <SelectItem value="12">12 - 更安全</SelectItem>
                      <SelectItem value="14">14 - 高安全</SelectItem>
                      <SelectItem value="16">16 - 最高安全</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateHash} 
                  disabled={isHashing}
                  className="flex items-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  {isHashing ? '加密中...' : '生成哈希'}
                </Button>
                {hashedPassword && (
                  <Button variant="outline" onClick={clearResults}>
                    清除结果
                  </Button>
                )}
              </div>

              {hashedPassword && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">加密结果</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(hashedPassword)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                        {hashedPassword}
                      </div>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">长度: {hashedPassword.length}</Badge>
                        <Badge variant="outline">盐轮数: {saltRounds}</Badge>
                        <Badge variant="outline">算法: bcrypt</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            {/* Hash Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">验证密码哈希</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-password">密码</Label>
                  <Input
                    id="verify-password"
                    type="password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    placeholder="输入要验证的密码"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verify-hash">Bcrypt哈希值</Label>
                  <Textarea
                    id="verify-hash"
                    value={verifyHash}
                    onChange={(e) => setVerifyHash(e.target.value)}
                    placeholder="输入要验证的bcrypt哈希值"
                    className="min-h-[80px] font-mono text-sm"
                  />
                </div>
              </div>

              <Button 
                onClick={verifyPasswordHash} 
                disabled={isVerifying}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isVerifying ? '验证中...' : '验证密码'}
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
                            ? '提供的密码与哈希值匹配' 
                            : '提供的密码与哈希值不匹配'
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
            <CardTitle className="text-lg">Bcrypt说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Badge>自适应哈希</Badge>
              <span className="text-sm text-muted-foreground">随着硬件性能提升，可调整计算复杂度</span>
            </div>
            <div className="flex gap-3">
              <Badge>盐值内置</Badge>
              <span className="text-sm text-muted-foreground">每次生成的哈希都包含随机盐值</span>
            </div>
            <div className="flex gap-3">
              <Badge>彩虹表抗性</Badge>
              <span className="text-sm text-muted-foreground">有效防止彩虹表攻击</span>
            </div>
            <div className="flex gap-3">
              <Badge>行业标准</Badge>
              <span className="text-sm text-muted-foreground">广泛用于密码存储的安全标准</span>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <div className="font-medium mb-1">盐轮数建议:</div>
                <div className="text-xs space-y-1">
                  <div>• 10轮: 一般应用推荐</div>
                  <div>• 12轮: 高安全要求</div>
                  <div>• 14轮+: 极高安全要求（计算较慢）</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </MainLayout>
  )
}