import '@testing-library/jest-dom'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace) => (key) => {
    // Mock translations for testing - use Chinese by default for compatibility with existing tests
    const translations = {
      'tools.base64': {
        title: 'Base64编码/解码',
        description: 'Base64格式编码和解码工具，支持文本和文件',
        encode: '编码',
        decode: '解码',
        encodeTitle: 'Base64编码',
        decodeTitle: 'Base64解码',
        originalText: '原始文本',
        encodedResult: '编码结果',
        base64Text: 'Base64文本',
        decodedResult: '解码结果',
        inputPlaceholder: '输入要编码的文本...',
        base64Placeholder: '输入Base64文本...',
        encodeButton: '编码为Base64',
        decodeButton: '解码Base64',
        clearAll: '清除全部',
        copy: '复制',
        fileUpload: '或上传文件 (最大1MB)',
        sampleText: '示例文本',
        infoTitle: 'Base64说明',
        infoDescription: '将二进制数据转换为ASCII字符',
        errorEmptyInput: '请输入要编码的文本',
        errorEmptyBase64: '请输入要解码的Base64文本',
        errorInvalidBase64: '无效的Base64格式',
        errorFileSize: '文件大小不能超过1MB',
        errorFileRead: '文件读取失败',
        successEncode: 'Base64编码成功',
        successDecode: 'Base64解码成功',
        successFileEncode: '文件编码完成',
        successCopy: '已复制到剪贴板',
        errorCopy: '复制失败',
        errorEncode: '编码失败',
        errorDecode: '解码失败'
      }
    }
    return translations[namespace]?.[key] || key
  },
  useLocale: () => 'zh'
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})