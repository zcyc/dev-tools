'use client'

import { useState } from 'react'
// import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Binary, FileText, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function Base64Page() {
  // const t = useTranslations('tools.base64')
  // Temporary fallback translations
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Base64编码/解码',
      'description': 'Base64格式编码和解码工具，支持文本和文件',
      'encode': '编码',
      'decode': '解码',
      'encodeTitle': 'Base64编码',
      'decodeTitle': 'Base64解码',
      'originalText': '原始文本',
      'encodedResult': '编码结果',
      'base64Text': 'Base64文本',
      'decodedResult': '解码结果',
      'inputPlaceholder': '输入要编码的文本...',
      'base64Placeholder': '输入Base64文本...',
      'encodeButton': '编码为Base64',
      'decodeButton': '解码Base64',
      'clearAll': '清除全部',
      'copy': '复制',
      'fileUpload': '或上传文件 (最大1MB)',
      'sampleText': '示例文本',
      'infoTitle': 'Base64说明',
      'infoDescription': '将二进制数据转换为ASCII字符',
      'errorEmptyInput': '请输入要编码的文本',
      'errorEmptyBase64': '请输入要解码的Base64文本',
      'errorInvalidBase64': '无效的Base64格式',
      'errorFileSize': '文件大小不能超过1MB',
      'errorFileRead': '文件读取失败',
      'successEncode': 'Base64编码成功',
      'successDecode': 'Base64解码成功',
      'successFileEncode': '文件编码完成',
      'successCopy': '已复制到剪贴板',
      'errorCopy': '复制失败',
      'errorEncode': '编码失败',
      'errorDecode': '解码失败'
    }
    return translations[key] || key
  }
  
  // Encode state
  const [plainText, setPlainText] = useState('')
  const [encodedText, setEncodedText] = useState('')
  
  // Decode state
  const [base64Text, setBase64Text] = useState('')
  const [decodedText, setDecodedText] = useState('')

  const encodeToBase64 = () => {
    if (!plainText.trim()) {
      toast.error(t('errorEmptyInput'))
      return
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(plainText)))
      setEncodedText(encoded)
      toast.success(t('successEncode'))
    } catch (error) {
      toast.error(t('errorEncode') + ': ' + (error as Error).message)
    }
  }

  const decodeFromBase64 = () => {
    if (!base64Text.trim()) {
      toast.error(t('errorEmptyBase64'))
      return
    }

    try {
      // Validate Base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Text.replace(/\\s/g, ''))) {
        throw new Error(t('errorInvalidBase64'))
      }

      const decoded = decodeURIComponent(escape(atob(base64Text.replace(/\\s/g, ''))))
      setDecodedText(decoded)
      toast.success(t('successDecode'))
    } catch (error) {
      toast.error(t('errorDecode') + ': ' + (error as Error).message)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('successCopy'))
    } catch (err) {
      toast.error(t('errorCopy'))
    }
  }

  const clearAll = () => {
    setPlainText('')
    setEncodedText('')
    setBase64Text('')
    setDecodedText('')
  }

  const swapEncodeDecode = () => {
    if (encodedText && !base64Text) {
      setBase64Text(encodedText)
      setEncodedText('')
    }
  }

  // Handle file input for encoding
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) { // 1MB limit
      toast.error(t('errorFileSize'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        const base64 = result.split(',')[1] // Remove data URL prefix
        setEncodedText(base64)
        toast.success(t('successFileEncode'))
      }
    }
    reader.onerror = () => {
      toast.error(t('errorFileRead'))
    }
    reader.readAsDataURL(file)
  }

  // Sample data for testing
  const sampleTexts = [
    'Hello, World!',
    '你好，世界！',
    'The quick brown fox jumps over the lazy dog.',
    '{"name": "John", "age": 30, "city": "New York"}'
  ]

  const loadSample = (text: string) => {
    setPlainText(text)
  }

  return (
    <MainLayout>
      <ToolLayout
        title={t('title')}
        description={t('description')}
        icon="Binary"
      >
        <Tabs defaultValue="encode" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode" className="flex items-center gap-2">
              <Binary className="h-4 w-4" />
              {t('encode')}
            </TabsTrigger>
            <TabsTrigger value="decode" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('decode')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode" className="space-y-6">
            {/* Encode Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('encodeTitle')}</h3>
                <Button variant="outline" onClick={clearAll} size="sm">
                  {t('clearAll')}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plain-text">{t('originalText')}</Label>
                  <Textarea
                    id="plain-text"
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    placeholder={t('inputPlaceholder')}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Sample texts */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">{t('sampleText')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {sampleTexts.map((text, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadSample(text)}
                        className="text-xs"
                      >
                        {text.length > 20 ? text.substring(0, 20) + '...' : text}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* File input */}
                <div className="space-y-2">
                  <Label htmlFor="file-input">{t('fileUpload')}</Label>
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileInput}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={encodeToBase64} className="flex items-center gap-2">
                    <Binary className="h-4 w-4" />
                    {t('encodeButton')}
                  </Button>
                  {encodedText && (
                    <Button variant="outline" onClick={swapEncodeDecode} className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      转到解码
                    </Button>
                  )}
                </div>

                {encodedText && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{t('encodedResult')}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(encodedText)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Textarea
                          value={encodedText}
                          readOnly
                          className="font-mono text-sm min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Badge variant="outline">Base64</Badge>
                          <Badge variant="outline">长度: {encodedText.length}</Badge>
                          <Badge variant="outline">原文: {plainText.length} 字符</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="decode" className="space-y-6">
            {/* Decode Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('decodeTitle')}</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base64-text">{t('base64Text')}</Label>
                  <Textarea
                    id="base64-text"
                    value={base64Text}
                    onChange={(e) => setBase64Text(e.target.value)}
                    placeholder={t('base64Placeholder')}
                    className="font-mono text-sm min-h-[120px]"
                  />
                </div>

                <Button onClick={decodeFromBase64} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('decodeButton')}
                </Button>

                {decodedText && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{t('decodedResult')}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(decodedText)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Textarea
                          value={decodedText}
                          readOnly
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Badge variant="outline">UTF-8</Badge>
                          <Badge variant="outline">长度: {decodedText.length}</Badge>
                          <Badge variant="outline">Base64: {base64Text.length} 字符</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('infoTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Badge>文本安全</Badge>
              <span className="text-sm text-muted-foreground">{t('infoDescription')}</span>
            </div>
            <div className="flex gap-3">
              <Badge>URL安全</Badge>
              <span className="text-sm text-muted-foreground">不包含URL特殊字符，适合网络传输</span>
            </div>
            <div className="flex gap-3">
              <Badge>数据嵌入</Badge>
              <span className="text-sm text-muted-foreground">常用于HTML、CSS、JSON中嵌入图片等数据</span>
            </div>
            <div className="flex gap-3">
              <Badge>可逆编码</Badge>
              <span className="text-sm text-muted-foreground">可以完全还原原始数据</span>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <div className="font-medium mb-1">常见应用:</div>
                <div className="text-xs space-y-1">
                  <div>• 邮件附件编码</div>
                  <div>• 图片数据URL</div>
                  <div>• API数据传输</div>
                  <div>• 基础认证头</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ToolLayout>
    </MainLayout>
  )
}