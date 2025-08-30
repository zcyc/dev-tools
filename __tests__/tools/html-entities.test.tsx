import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HTMLEntitiesPage from '../../app/tools/html-entities/page'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock he library
jest.mock('he', () => ({
  encode: jest.fn((text, options) => {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '©': '&copy;',
      '®': '&reg;',
      ' ': options?.useNamedReferences ? '&nbsp;' : '&#x20;'
    }
    return text.replace(/[&<>"'\/©® ]/g, (match) => entityMap[match] || match)
  }),
  decode: jest.fn((text) => {
    const entityMap = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
      '&copy;': '©',
      '&reg;': '®',
      '&nbsp;': ' ',
      '&#x20;': ' '
    }
    return text.replace(/&[a-zA-Z0-9#x]+;/g, (match) => entityMap[match] || match)
  })
}))

describe('HTML Entities Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders HTML entities page correctly', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText('HTML实体转义')).toBeInTheDocument()
    expect(screen.getByText('HTML特殊字符编码和解码工具')).toBeInTheDocument()
  })

  it('has encode and decode tabs', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText('编码')).toBeInTheDocument()
    expect(screen.getByText('解码')).toBeInTheDocument()
  })

  it('encodes HTML entities', async () => {
    render(<HTMLEntitiesPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: '<div class="test">Hello & World</div>' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue('&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;&#x2F;div&gt;')
      expect(encodedResult).toBeInTheDocument()
    })
  })

  it('decodes HTML entities', async () => {
    render(<HTMLEntitiesPage />)
    
    // Switch to decode tab
    const decodeTab = screen.getByText('解码')
    fireEvent.click(decodeTab)
    
    const textInput = screen.getByPlaceholderText(/输入要解码的HTML实体/i)
    fireEvent.change(textInput, { target: { value: '&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;&#x2F;div&gt;' } })
    
    const decodeButton = screen.getByRole('button', { name: /解码/i })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      const decodedResult = screen.getByDisplayValue('<div class="test">Hello & World</div>')
      expect(decodedResult).toBeInTheDocument()
    })
  })

  it('supports different encoding options', async () => {
    render(<HTMLEntitiesPage />)
    
    const optionsSelect = screen.getByLabelText(/编码选项/i)
    fireEvent.change(optionsSelect, { target: { value: 'named' } })
    
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: '© ® ' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue('&copy;&nbsp;&reg;&nbsp;&nbsp;')
      expect(encodedResult).toBeInTheDocument()
    })
  })

  it('shows common HTML entities reference', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText(/常用HTML实体/i)).toBeInTheDocument()
    expect(screen.getByText(/&amp;/)).toBeInTheDocument()
    expect(screen.getByText(/&lt;/)).toBeInTheDocument()
    expect(screen.getByText(/&gt;/)).toBeInTheDocument()
    expect(screen.getByText(/&quot;/)).toBeInTheDocument()
    expect(screen.getByText(/&nbsp;/)).toBeInTheDocument()
  })

  it('shows special characters reference', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText(/特殊符号/i)).toBeInTheDocument()
    expect(screen.getByText(/&copy;/)).toBeInTheDocument()
    expect(screen.getByText(/&reg;/)).toBeInTheDocument()
    expect(screen.getByText(/&trade;/)).toBeInTheDocument()
  })

  it('has copy functionality', async () => {
    render(<HTMLEntitiesPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: '<test>' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty input gracefully', () => {
    render(<HTMLEntitiesPage />)
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    expect(encodeButton).toBeInTheDocument()
  })

  it('handles Unicode characters', async () => {
    render(<HTMLEntitiesPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: '你好世界 © ® ™' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue('你好世界&nbsp;&copy;&nbsp;&reg;&nbsp;™')
      expect(encodedResult).toBeInTheDocument()
    })
  })

  it('preserves formatting in textarea', async () => {
    render(<HTMLEntitiesPage />)
    
    const multilineText = `<html>
  <body>
    <div class="container">
      <p>Hello & welcome!</p>
    </div>
  </body>
</html>`
    
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: multilineText } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue(/&lt;html&gt;/)
      expect(result.value).toContain('\n') // Should preserve line breaks
    })
  })

  it('shows encoding format examples', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText(/编码格式/i)).toBeInTheDocument()
    expect(screen.getByText(/命名实体/i)).toBeInTheDocument()
    expect(screen.getByText(/数字实体/i)).toBeInTheDocument()
    expect(screen.getByText(/十六进制实体/i)).toBeInTheDocument()
  })

  it('handles bidirectional conversion', async () => {
    render(<HTMLEntitiesPage />)
    
    const originalText = '<script>alert("XSS")</script>'
    
    // Encode first
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: originalText } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    let encodedText
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue(/&lt;script&gt;/)
      encodedText = encodedResult.value
      expect(encodedText).toContain('&lt;script&gt;')
    })
    
    // Switch to decode tab
    const decodeTab = screen.getByText('解码')
    fireEvent.click(decodeTab)
    
    // Decode the encoded text
    const decodeInput = screen.getByPlaceholderText(/输入要解码的HTML实体/i)
    fireEvent.change(decodeInput, { target: { value: encodedText } })
    
    const decodeButton = screen.getByRole('button', { name: /解码/i })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      const decodedResult = screen.getByDisplayValue(originalText)
      expect(decodedResult).toBeInTheDocument()
    })
  })

  it('shows security implications', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText(/安全提示/i)).toBeInTheDocument()
    expect(screen.getByText(/XSS防护/i)).toBeInTheDocument()
    expect(screen.getByText(/输出编码/i)).toBeInTheDocument()
    expect(screen.getByText(/上下文敏感/i)).toBeInTheDocument()
  })

  it('handles malformed entities in decode mode', async () => {
    render(<HTMLEntitiesPage />)
    
    // Switch to decode tab
    const decodeTab = screen.getByText('解码')
    fireEvent.click(decodeTab)
    
    const textInput = screen.getByPlaceholderText(/输入要解码的HTML实体/i)
    fireEvent.change(textInput, { target: { value: '&invalid; &amp; &unclosed' } })
    
    const decodeButton = screen.getByRole('button', { name: /解码/i })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      const decodedResult = screen.getByDisplayValue('&invalid; & &unclosed')
      expect(decodedResult).toBeInTheDocument()
    })
  })

  it('shows use cases', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText(/使用场景/i)).toBeInTheDocument()
    expect(screen.getByText(/网页显示/i)).toBeInTheDocument()
    expect(screen.getByText(/XML处理/i)).toBeInTheDocument()
    expect(screen.getByText(/数据存储/i)).toBeInTheDocument()
    expect(screen.getByText(/API传输/i)).toBeInTheDocument()
  })

  it('handles large text input', async () => {
    render(<HTMLEntitiesPage />)
    
    const largeText = '<div>' + 'test'.repeat(1000) + '</div>'
    const textInput = screen.getByPlaceholderText(/输入要编码的文本/i)
    fireEvent.change(textInput, { target: { value: largeText } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue(/&lt;div&gt;/)
      expect(encodedResult.value).toContain('&lt;div&gt;')
      expect(encodedResult.value).toContain('&lt;&#x2F;div&gt;')
    }, { timeout: 5000 })
  })
})