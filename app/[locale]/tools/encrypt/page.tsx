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
import { Copy, ShieldCheck, Unlock, Lock } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

const algorithms = [
  { value: 'AES', name: 'AES', description: '高级加密标准（推荐）' },
  { value: 'DES', name: 'DES', description: '数据加密标准（已过时）' },
  { value: 'TripleDES', name: '3DES', description: '三重数据加密标准' },
  { value: 'RC4', name: 'RC4', description: '流密码算法' },
  { value: 'Rabbit', name: 'Rabbit', description: '高速流密码' }
]

export default function EncryptDecryptPage() {
  const [algorithm, setAlgorithm] = useState('AES')
  
  // Encrypt state
  const [plaintext, setPlaintext] = useState('')
  const [encryptKey, setEncryptKey] = useState('')
  const [encryptedText, setEncryptedText] = useState('')
  
  // Decrypt state
  const [ciphertext, setCiphertext] = useState('')
  const [decryptKey, setDecryptKey] = useState('')
  const [decryptedText, setDecryptedText] = useState('')

  const encryptText = () => {
    if (!plaintext.trim()) {
      toast.error('请输入要加密的文本')
      return
    }
    if (!encryptKey.trim()) {
      toast.error('请输入加密密钥')
      return
    }

    try {
      let encrypted: string
      
      switch (algorithm) {
        case 'AES':
          encrypted = CryptoJS.AES.encrypt(plaintext, encryptKey).toString()
          break
        case 'DES':
          encrypted = CryptoJS.DES.encrypt(plaintext, encryptKey).toString()
          break
        case 'TripleDES':
          encrypted = CryptoJS.TripleDES.encrypt(plaintext, encryptKey).toString()
          break
        case 'RC4':
          encrypted = CryptoJS.RC4.encrypt(plaintext, encryptKey).toString()
          break
        case 'Rabbit':
          encrypted = CryptoJS.Rabbit.encrypt(plaintext, encryptKey).toString()
          break
        default:
          encrypted = CryptoJS.AES.encrypt(plaintext, encryptKey).toString()
      }
      
      setEncryptedText(encrypted)
      toast.success('文本加密成功')
    } catch (error) {
      toast.error('加密失败: ' + (error as Error).message)
    }
  }

  const decryptText = () => {
    if (!ciphertext.trim()) {
      toast.error('请输入要解密的密文')
      return
    }
    if (!decryptKey.trim()) {
      toast.error('请输入解密密钥')
      return
    }

    try {
      let decrypted: CryptoJS.lib.WordArray
      
      switch (algorithm) {
        case 'AES':
          decrypted = CryptoJS.AES.decrypt(ciphertext, decryptKey)
          break
        case 'DES':
          decrypted = CryptoJS.DES.decrypt(ciphertext, decryptKey)
          break
        case 'TripleDES':
          decrypted = CryptoJS.TripleDES.decrypt(ciphertext, decryptKey)
          break
        case 'RC4':
          decrypted = CryptoJS.RC4.decrypt(ciphertext, decryptKey)
          break
        case 'Rabbit':
          decrypted = CryptoJS.Rabbit.decrypt(ciphertext, decryptKey)
          break
        default:
          decrypted = CryptoJS.AES.decrypt(ciphertext, decryptKey)
      }
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedString) {
        toast.error('解密失败，请检查密文和密钥是否正确')
        return
      }
      
      setDecryptedText(decryptedString)
      toast.success('文本解密成功')
    } catch (error) {
      toast.error('解密失败: ' + (error as Error).message)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  const generateRandomKey = (length: number = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const clearResults = () => {
    setEncryptedText('')
    setDecryptedText('')
  }

  return (
    <MainLayout>
      <ToolLayout
        title="文本加密/解密"
        description="使用AES、DES等对称加密算法加密和解密文本"
        icon="ShieldCheck"
      >
        <div className="space-y-6">
          {/* Algorithm Selection */}
          <div>
            <Label htmlFor="algorithm">加密算法</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="w-64 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {algorithms.map((alg) => (
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

          <Tabs defaultValue="encrypt" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encrypt" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                加密
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="flex items-center gap-2">
                <Unlock className="h-4 w-4" />
                解密
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encrypt" className="space-y-4">
              <h3 className="text-lg font-semibold">文本加密</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plaintext">明文</Label>
                  <Textarea
                    id="plaintext"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="输入要加密的文本..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encrypt-key">加密密钥</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEncryptKey(generateRandomKey())}
                    >
                      生成随机密钥
                    </Button>
                  </div>
                  <Input
                    id="encrypt-key"
                    type="password"
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                    placeholder="输入加密密钥"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={encryptText} className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    加密文本
                  </Button>
                  {encryptedText && (
                    <Button variant="outline" onClick={clearResults}>
                      清除结果
                    </Button>
                  )}
                </div>

                {encryptedText && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">加密结果</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(encryptedText)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Textarea
                          value={encryptedText}
                          readOnly
                          className="font-mono text-sm min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Badge variant="outline">算法: {algorithm}</Badge>
                          <Badge variant="outline">长度: {encryptedText.length}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="decrypt" className="space-y-4">
              <h3 className="text-lg font-semibold">文本解密</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ciphertext">密文</Label>
                  <Textarea
                    id="ciphertext"
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    placeholder="输入要解密的密文..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decrypt-key">解密密钥</Label>
                  <Input
                    id="decrypt-key"
                    type="password"
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                    placeholder="输入解密密钥"
                  />
                </div>

                <Button onClick={decryptText} className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  解密文本
                </Button>

                {decryptedText && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">解密结果</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(decryptedText)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Textarea
                          value={decryptedText}
                          readOnly
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Badge variant="outline">算法: {algorithm}</Badge>
                          <Badge variant="outline">长度: {decryptedText.length}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Security Warning */}
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800 dark:text-yellow-200">
                ⚠️ 安全提醒
              </CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>• 请妥善保管您的加密密钥，丢失密钥将无法解密数据</p>
              <p>• 不要在不安全的环境中使用敏感密钥</p>
              <p>• 推荐使用AES算法，避免使用已过时的DES算法</p>
              <p>• 本工具仅用于学习和测试，生产环境请使用专业加密服务</p>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}