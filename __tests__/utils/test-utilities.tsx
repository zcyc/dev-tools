import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock translations for testing
export const mockTranslations = {
  zh: {
    common: {
      search: '搜索工具...',
      noResults: '未找到相关工具',
      toggleTheme: '切换主题',
      openMenu: '打开菜单',
      copy: '复制',
      copied: '已复制',
      clear: '清空',
      generate: '生成',
      parse: '解析',
      export: '导出',
      import: '导入',
      download: '下载',
      upload: '上传',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      view: '查看',
      close: '关闭',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息'
    },
    tools: {
      idGenerator: {
        name: 'ID 生成器',
        description: '支持 30+ 种 ID 格式生成与解析，包括 UUID、ULID、KSUID 等',
        pageTitle: 'ID 生成器',
        pageDescription: '支持 30+ 种 ID 格式的生成与解析，包括 UUID、ULID、KSUID 等现代标识符',
        generation: '生成 ID',
        parsing: '解析 ID',
        generateConfig: 'ID生成配置',
        generateConfigDesc: '选择ID类型和生成参数',
        idType: 'ID类型',
        selectIdType: '选择ID类型',
        generateCount: '生成数量',
        generateButton: '生成ID',
        formatInfo: '格式信息',
        example: '示例',
        features: '特征',
        generatedResults: '生成结果',
        exportIds: '导出ID',
        clearAll: '清空全部',
        copyId: '复制ID',
        idParser: 'ID解析器',
        parserDescription: '输入任意ID进行格式识别和信息提取',
        idString: 'ID字符串',
        parserPlaceholder: '输入要解析的ID...',
        detectedType: '检测类型',
        inputContent: '输入内容',
        properties: '属性信息',
        copied: '已复制到剪贴板',
        exportSuccess: '导出成功',
        invalidId: '无效的ID格式'
      },
      base64: {
        name: 'Base64编码/解码',
        description: 'Base64格式编码和解码工具，支持文本和文件'
      }
    }
  },
  en: {
    common: {
      search: 'Search tools...',
      noResults: 'No tools found',
      toggleTheme: 'Toggle theme',
      openMenu: 'Open menu',
      copy: 'Copy',
      copied: 'Copied',
      clear: 'Clear',
      generate: 'Generate',
      parse: 'Parse',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info'
    },
    tools: {
      idGenerator: {
        name: 'ID Generator',
        description: 'Supports 30+ ID format generation and parsing, including UUID, ULID, KSUID, etc.',
        pageTitle: 'ID Generator',
        pageDescription: 'Supports generation and parsing of 30+ ID formats including UUID, ULID, KSUID and other modern identifiers',
        generation: 'Generate ID',
        parsing: 'Parse ID',
        generateConfig: 'ID Generation Config',
        generateConfigDesc: 'Select ID type and generation parameters',
        idType: 'ID Type',
        selectIdType: 'Select ID Type',
        generateCount: 'Generate Count',
        generateButton: 'Generate ID',
        formatInfo: 'Format Info',
        example: 'Example',
        features: 'Features',
        generatedResults: 'Generated Results',
        exportIds: 'Export IDs',
        clearAll: 'Clear All',
        copyId: 'Copy ID',
        idParser: 'ID Parser',
        parserDescription: 'Enter any ID for format recognition and information extraction',
        idString: 'ID String',
        parserPlaceholder: 'Enter ID to parse...',
        detectedType: 'Detected Type',
        inputContent: 'Input Content',
        properties: 'Properties',
        copied: 'Copied to clipboard',
        exportSuccess: 'Export successful',
        invalidId: 'Invalid ID format'
      },
      base64: {
        name: 'Base64 Encoder/Decoder',
        description: 'Base64 format encoding and decoding tool, supports text and files'
      }
    }
  }
}

// Mock usePathname hook
export const mockUsePathname = (locale: 'zh' | 'en' = 'zh') => {
  return jest.fn(() => `/${locale}/tools/test`)
}

// Mock next/navigation
export const mockNextNavigation = (locale: 'zh' | 'en' = 'zh') => {
  jest.mock('next/navigation', () => ({
    usePathname: mockUsePathname(locale),
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
  }))
}

// Helper function to get translation text for both languages
export const getTranslationText = (key: string, locale: 'zh' | 'en' = 'zh'): string => {
  const keys = key.split('.')
  let current: any = mockTranslations[locale]
  
  for (const k of keys) {
    current = current?.[k]
  }
  
  return current || key
}

// Custom render function that provides multi-language context
interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  locale?: 'zh' | 'en'
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { locale = 'zh', ...renderOptions } = options || {}
  
  // Set up the mock for the current test
  mockNextNavigation(locale)
  
  return render(ui, renderOptions)
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Tests for test utilities
describe('Test Utilities', () => {
  it('exports mock translations', () => {
    expect(mockTranslations).toBeDefined()
    expect(mockTranslations.zh).toBeDefined()
    expect(mockTranslations.en).toBeDefined()
  })

  it('exports custom render function', () => {
    expect(customRender).toBeDefined()
    expect(typeof customRender).toBe('function')
  })
})