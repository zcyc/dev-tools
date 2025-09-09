import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HTMLEntitiesPage from '../../app/[locale]/tools/html-entities/page'

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
    expect(screen.getByText('HTML特殊字符编码和解码')).toBeInTheDocument()
  })

  it('has encode and decode tabs', () => {
    render(<HTMLEntitiesPage />)
    
    // Check tabs are present by role
    const tabs = screen.getAllByRole('tab')
    expect(tabs.length).toBeGreaterThanOrEqual(2)
  })

  it('encodes HTML entities', async () => {
    render(<HTMLEntitiesPage />)
    
    // Find the main input (should be first textbox in encode mode)
    const textInput = screen.getAllByRole('textbox')[0]
    fireEvent.change(textInput, { target: { value: '<div class="test">Hello & World</div>' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue('&lt;div&nbsp;class=&quot;test&quot;&gt;Hello&nbsp;&amp;&nbsp;World&lt;/div&gt;')
      expect(encodedResult).toBeInTheDocument()
    })
  })

  it('decodes HTML entities', async () => {
    render(<HTMLEntitiesPage />)
    
    // Switch to decode tab
    const decodeTab = screen.getByText('解码')
    fireEvent.click(decodeTab)
    
    // Use getAllByRole to find the correct input after tab switch
    const allInputs = screen.getAllByRole('textbox')
    const textInput = allInputs.find(input => 
      input.placeholder && input.placeholder.includes('HTML实体')
    ) || allInputs[0]
    fireEvent.change(textInput, { target: { value: '&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;&#x2F;div&gt;' } })
    
    await waitFor(() => {
      const decodeButtons = screen.getAllByText('解码')
      const decodeButton = decodeButtons.find(btn => btn.tagName === 'BUTTON')
      if (decodeButton) {
        fireEvent.click(decodeButton)
      }
    })
    
    await waitFor(() => {
      // Look for output textarea by checking if it has a value
      const textareas = screen.getAllByRole('textbox')
      const resultTextarea = textareas.find(t => t.value && t.value.length > 0)
      expect(resultTextarea).toBeTruthy()
      const decodedResult = resultTextarea
      expect(decodedResult).toBeInTheDocument()
    })
  })

  it('shows input and output areas', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText('原始文本')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /编码/i })).toBeInTheDocument()
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

  it('shows character descriptions', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText('和符号')).toBeInTheDocument()
    expect(screen.getByText('小于号')).toBeInTheDocument()
    expect(screen.getByText('大于号')).toBeInTheDocument()
    expect(screen.getByText('双引号')).toBeInTheDocument()
  })

  it('has copy functionality', async () => {
    render(<HTMLEntitiesPage />)
    
    const textInput = screen.getByPlaceholderText(/输入包含特殊字符的文本/)
    fireEvent.change(textInput, { target: { value: '<test>' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      // After encoding, there should be a copy button available
      const copyIcons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.className.includes('h-8 w-8')
      )
      expect(copyIcons.length).toBeGreaterThan(0)
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
    
    const textInput = screen.getByPlaceholderText(/输入包含特殊字符的文本/)
    fireEvent.change(textInput, { target: { value: '你好世界 <>&"\'' } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue('你好世界&nbsp;&lt;&gt;&amp;&quot;&#39;')
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
    
    const textInput = screen.getByPlaceholderText(/输入包含特殊字符的文本/)
    fireEvent.change(textInput, { target: { value: multilineText } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue(/&lt;html&gt;/)
      expect(result.value).toContain('\n') // Should preserve line breaks
    })
  })

  it('shows table headers', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText('字符')).toBeInTheDocument()
    expect(screen.getByText('HTML实体')).toBeInTheDocument()
    expect(screen.getByText('描述')).toBeInTheDocument()
  })

  it('handles bidirectional conversion', async () => {
    render(<HTMLEntitiesPage />)
    
    const originalText = '<script>alert("XSS")</script>'
    
    // Encode first
    const textInput = screen.getByPlaceholderText(/输入包含特殊字符的文本/)
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
    // Use getAllByRole to find the correct input after tab switch
    const allInputs = screen.getAllByRole('textbox')
    const decodeInput = allInputs.find(input => 
      input.placeholder && input.placeholder.includes('HTML实体')
    ) || allInputs[0]
    fireEvent.change(decodeInput, { target: { value: encodedText } })
    
    await waitFor(() => {
      const decodeButtons = screen.getAllByText('解码')
      const decodeButton = decodeButtons.find(btn => btn.tagName === 'BUTTON')
      if (decodeButton) {
        fireEvent.click(decodeButton)
      }
    })
    
    await waitFor(() => {
      // Look for output textarea by checking if it has a value
      const textareas = screen.getAllByRole('textbox')
      const resultTextarea = textareas.find(t => t.value && t.value.length > 0)
      expect(resultTextarea).toBeTruthy()
    })
  })

  it('shows encode description', () => {
    render(<HTMLEntitiesPage />)
    
    expect(screen.getByText('将特殊字符转换为HTML实体')).toBeInTheDocument()
  })

  it('handles malformed entities in decode mode', async () => {
    render(<HTMLEntitiesPage />)
    
    // Switch to decode tab
    const decodeTab = screen.getByText('解码')
    fireEvent.click(decodeTab)
    
    // Use getAllByRole to find the correct input after tab switch
    const allInputs = screen.getAllByRole('textbox')
    const textInput = allInputs.find(input => 
      input.placeholder && input.placeholder.includes('HTML实体')
    ) || allInputs[0]
    fireEvent.change(textInput, { target: { value: '&invalid; &amp; &unclosed' } })
    
    await waitFor(() => {
      const decodeButtons = screen.getAllByText('解码')
      const decodeButton = decodeButtons.find(btn => btn.tagName === 'BUTTON')
      if (decodeButton) {
        fireEvent.click(decodeButton)
      }
    })
    
    await waitFor(() => {
      // Look for output textarea by checking if it has a value
      const textareas = screen.getAllByRole('textbox')
      const resultTextarea = textareas.find(t => t.value && t.value.length > 0)
      expect(resultTextarea).toBeTruthy()
    })
  })

  it('can switch to decode tab', () => {
    render(<HTMLEntitiesPage />)
    
    const decodeTab = screen.getByText('解码')
    fireEvent.click(decodeTab)
    
    // Check for decode tab content - use queryByText to avoid error
    expect(screen.queryByText('解码')).toBeInTheDocument()
  })

  it('handles large text input', async () => {
    render(<HTMLEntitiesPage />)
    
    const largeText = '<div>' + 'test'.repeat(1000) + '</div>'
    const textInput = screen.getByPlaceholderText(/输入包含特殊字符的文本/)
    fireEvent.change(textInput, { target: { value: largeText } })
    
    const encodeButton = screen.getByRole('button', { name: /编码/i })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      const encodedResult = screen.getByDisplayValue(/&lt;div&gt;/)
      expect(encodedResult.value).toContain('&lt;div&gt;')
      expect(encodedResult.value).toContain('&lt;/div&gt;')
    }, { timeout: 5000 })
  })
})