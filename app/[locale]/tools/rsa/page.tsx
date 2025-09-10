'use client'

import { useState } from 'react'
import forge from 'node-forge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Download, Key, KeySquare } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

interface KeyPair {
  publicKey: string
  privateKey: string
  keySize: number
  format: string
}

const keySizes = [
  { value: 1024, name: '1024位', description: '低安全性（不推荐）' },
  { value: 2048, name: '2048位', description: '标准安全性（推荐）' },
  { value: 3072, name: '3072位', description: '高安全性' },
  { value: 4096, name: '4096位', description: '最高安全性（慢）' }
]

const keyFormats = [
  { value: 'pem', name: 'PEM格式', description: 'Privacy-Enhanced Mail格式' },
  { value: 'pkcs8', name: 'PKCS#8格式', description: 'Public Key Cryptography Standards #8' }
]

export default function RSAKeyGeneratorPage() {
  const [keySize, setKeySize] = useState(2048)
  const [keyFormat, setKeyFormat] = useState('pem')
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateKeyPair = async () => {
    setIsGenerating(true)
    
    try {
      // Show progress toast
      toast.info('正在生成RSA密钥对，请稍候...')
      
      // Generate key pair using Web Workers to avoid blocking UI
      // For now, we'll use a timeout to simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const keypair = forge.pki.rsa.generateKeyPair({ bits: keySize, workers: -1 })
      
      let publicKeyPem: string
      let privateKeyPem: string
      
      if (keyFormat === 'pem') {
        publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)
        privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey)
      } else {
        // PKCS#8 format
        const privateKeyInfo = forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(keypair.privateKey))
        privateKeyPem = forge.pki.privateKeyInfoToPem(privateKeyInfo)
        publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey)
      }
      
      setKeyPair({
        publicKey: publicKeyPem,
        privateKey: privateKeyPem,
        keySize: keySize,
        format: keyFormat
      })
      
      toast.success('RSA密钥对生成成功')
    } catch (error) {
      toast.error('密钥对生成失败: ' + (error as Error).message)
    } finally {
      setIsGenerating(false)
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

  const downloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${filename} 下载完成`)
  }

  const clearKeys = () => {
    setKeyPair(null)
  }

  return (
    <MainLayout>
      <ToolLayout
        title="RSA密钥对生成"
        description="生成RSA公私钥对用于非对称加密和数字签名"
        icon="KeySquare"
      >
        <div className="space-y-6">
          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">生成配置</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="key-size">密钥长度</Label>
                <Select value={keySize.toString()} onValueChange={(value) => setKeySize(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {keySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()}>
                        <div>
                          <div className="font-medium">{size.name}</div>
                          <div className="text-xs text-muted-foreground">{size.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-format">密钥格式</Label>
                <Select value={keyFormat} onValueChange={setKeyFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {keyFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.name}</div>
                          <div className="text-xs text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateKeyPair} 
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <KeySquare className="h-4 w-4" />
                {isGenerating ? '生成中...' : '生成密钥对'}
              </Button>
              {keyPair && (
                <Button variant="outline" onClick={clearKeys}>
                  清除密钥
                </Button>
              )}
            </div>
          </div>

          {/* Generated Keys */}
          {keyPair && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">生成的密钥对</h3>
                <Badge variant="secondary">{keyPair.keySize}位</Badge>
                <Badge variant="outline">{keyPair.format.toUpperCase()}</Badge>
              </div>

              <Tabs defaultValue="public" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="public" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    公钥
                  </TabsTrigger>
                  <TabsTrigger value="private" className="flex items-center gap-2">
                    <KeySquare className="h-4 w-4" />
                    私钥
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="public">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">RSA公钥</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(keyPair.publicKey)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-3 w-3" />
                            复制
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadKey(keyPair.publicKey, 'public_key.pem')}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-3 w-3" />
                            下载
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        用于加密数据和验证数字签名，可以公开分享
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={keyPair.publicKey}
                        readOnly
                        className="font-mono text-xs min-h-[200px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="private">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">RSA私钥</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(keyPair.privateKey)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-3 w-3" />
                            复制
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadKey(keyPair.privateKey, 'private_key.pem')}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-3 w-3" />
                            下载
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        用于解密数据和生成数字签名，必须保密
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={keyPair.privateKey}
                        readOnly
                        className="font-mono text-xs min-h-[300px]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">RSA密钥说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Badge>非对称加密</Badge>
                <span className="text-sm text-muted-foreground">公钥加密，私钥解密</span>
              </div>
              <div className="flex gap-3">
                <Badge>数字签名</Badge>
                <span className="text-sm text-muted-foreground">私钥签名，公钥验证</span>
              </div>
              <div className="flex gap-3">
                <Badge>密钥交换</Badge>
                <span className="text-sm text-muted-foreground">安全地交换对称密钥</span>
              </div>
              <div className="flex gap-3">
                <Badge>身份认证</Badge>
                <span className="text-sm text-muted-foreground">验证消息发送者身份</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Warning */}
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="text-lg text-red-800 dark:text-red-200">
                🔒 安全警告
              </CardTitle>
            </CardHeader>
            <CardContent className="text-red-700 dark:text-red-300 space-y-2">
              <p>• 私钥必须绝对保密，泄露后将失去所有安全保障</p>
              <p>• 建议使用2048位或更高的密钥长度</p>
              <p>• 在生产环境中使用专业的密钥管理系统</p>
              <p>• 定期更换密钥对以提高安全性</p>
              <p>• 本工具生成的密钥仅用于测试和学习目的</p>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}