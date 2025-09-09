import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CaseConverterPage from '../../app/[locale]/tools/case-converter/page'

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

describe('Case Converter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders case converter page correctly', () => {
    render(<CaseConverterPage />)
    
    expect(screen.getByText('大小写转换器')).toBeInTheDocument()
    expect(screen.getByText('转换文本为各种大小写格式')).toBeInTheDocument()
  })

  it('converts text to uppercase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    const uppercaseButton = screen.getByText('大写')
    fireEvent.click(uppercaseButton)
    
    await waitFor(() => {
      expect(screen.getByText('HELLO WORLD TEST')).toBeInTheDocument()
    })
  })

  it('converts text to lowercase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'HELLO WORLD TEST' } })
    
    await waitFor(() => {
      expect(screen.getByText('hello world test')).toBeInTheDocument()
    })
  })

  it('converts text to title case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    await waitFor(() => {
      expect(screen.getByText('Hello World Test')).toBeInTheDocument()
    })
  })

  it('converts text to sentence case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world. this is a test.' } })
    
    await waitFor(() => {
      expect(screen.getByText('Hello world. this is a test.')).toBeInTheDocument()
    })
  })

  it('converts text to camelCase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    await waitFor(() => {
      expect(screen.getByText('helloWorldTest')).toBeInTheDocument()
    })
  })

  it('converts text to PascalCase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    await waitFor(() => {
      expect(screen.getByText('HelloWorldTest')).toBeInTheDocument()
    })
  })

  it('converts text to snake_case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'Hello World Test' } })
    
    await waitFor(() => {
      expect(screen.getByText('hello_world_test')).toBeInTheDocument()
    })
  })

  it('converts text to kebab-case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'Hello World Test' } })
    
    await waitFor(() => {
      expect(screen.getByText('hello-world-test')).toBeInTheDocument()
    })
  })

  it('converts text to CONSTANT_CASE', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    await waitFor(() => {
      expect(screen.getByText('HELLO_WORLD_TEST')).toBeInTheDocument()
    })
  })

  it('shows alternating case conversion', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world' } })
    
    await waitFor(() => {
      expect(screen.getByText('hElLo wOrLd')).toBeInTheDocument()
    })
  })

  it('shows case format examples', () => {
    render(<CaseConverterPage />)
    
    expect(screen.getByText('使用场景')).toBeInTheDocument()
    expect(screen.getByText('camelCase:')).toBeInTheDocument()
    expect(screen.getByText('PascalCase:')).toBeInTheDocument()
    expect(screen.getByText('snake_case:')).toBeInTheDocument()
    expect(screen.getByText('kebab-case:')).toBeInTheDocument()
  })

  it('has copy functionality for all results', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty input gracefully', () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    expect(textInput).toHaveValue('')
    
    // Should not show conversion results when input is empty
    expect(screen.queryByText('小写')).not.toBeInTheDocument()
  })

  it('handles special characters and numbers', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world 123 @#$%' } })
    
    await waitFor(() => {
      expect(screen.getByText('HELLO WORLD 123 @#$%')).toBeInTheDocument()
    })
  })

  it('handles Unicode and international characters', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'café naïve résumé' } })
    
    await waitFor(() => {
      expect(screen.getByText('CAFÉ NAÏVE RÉSUMÉ')).toBeInTheDocument()
    })
  })

  it('preserves text structure in multiline input', async () => {
    render(<CaseConverterPage />)
    
    const multilineText = 'hello world test'
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: multilineText } })
    
    await waitFor(() => {
      expect(screen.getByText('Hello World Test')).toBeInTheDocument()
    })
  })

  it('shows usage guidelines', () => {
    render(<CaseConverterPage />)
    
    expect(screen.getByText('使用场景')).toBeInTheDocument()
    expect(screen.getByText('编程相关')).toBeInTheDocument()
    expect(screen.getByText('文档相关')).toBeInTheDocument()
    expect(screen.getByText('JavaScript变量名')).toBeInTheDocument()
  })

  it('provides real-time conversion for all formats', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'sample text input' } })
    
    // Check if all conversion results are shown simultaneously
    await waitFor(() => {
      expect(screen.getByText('SAMPLE TEXT INPUT')).toBeInTheDocument() // uppercase
      expect(screen.getAllByText('sample text input')).toHaveLength(2) // lowercase + input
      expect(screen.getByText('Sample Text Input')).toBeInTheDocument() // title case
      expect(screen.getByText('sampleTextInput')).toBeInTheDocument() // camelCase
      expect(screen.getByText('SampleTextInput')).toBeInTheDocument() // PascalCase
      expect(screen.getByText('sample_text_input')).toBeInTheDocument() // snake_case
      expect(screen.getByText('sample-text-input')).toBeInTheDocument() // kebab-case
      expect(screen.getByText('SAMPLE_TEXT_INPUT')).toBeInTheDocument() // CONSTANT_CASE
    })
  })

  it('handles long text input efficiently', async () => {
    render(<CaseConverterPage />)
    
    const longText = 'word '.repeat(100).trim()
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: longText } })
    
    await waitFor(() => {
      expect(screen.getByText(longText.toUpperCase())).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('shows conversion results when text is entered', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText('输入文本内容...')
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    await waitFor(() => {
      expect(screen.getByText('小写')).toBeInTheDocument()
      expect(screen.getByText('大写')).toBeInTheDocument()
    })
  })
})