import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CaseConverterPage from '../../app/tools/case-converter/page'

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
    
    expect(screen.getByText('大小写转换')).toBeInTheDocument()
    expect(screen.getByText('转换文本的大小写格式，支持多种转换模式')).toBeInTheDocument()
  })

  it('converts text to uppercase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    const uppercaseButton = screen.getByRole('button', { name: /大写/i })
    fireEvent.click(uppercaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('HELLO WORLD TEST')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to lowercase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'HELLO WORLD TEST' } })
    
    const lowercaseButton = screen.getByRole('button', { name: /小写/i })
    fireEvent.click(lowercaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('hello world test')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to title case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    const titleCaseButton = screen.getByRole('button', { name: /标题格式/i })
    fireEvent.click(titleCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('Hello World Test')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to sentence case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world. this is a test.' } })
    
    const sentenceCaseButton = screen.getByRole('button', { name: /句子格式/i })
    fireEvent.click(sentenceCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('Hello world. This is a test.')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to camelCase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    const camelCaseButton = screen.getByRole('button', { name: /驼峰格式/i })
    fireEvent.click(camelCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('helloWorldTest')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to PascalCase', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    const pascalCaseButton = screen.getByRole('button', { name: /帕斯卡格式/i })
    fireEvent.click(pascalCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('HelloWorldTest')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to snake_case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'Hello World Test' } })
    
    const snakeCaseButton = screen.getByRole('button', { name: /蛇形格式/i })
    fireEvent.click(snakeCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('hello_world_test')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to kebab-case', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'Hello World Test' } })
    
    const kebabCaseButton = screen.getByRole('button', { name: /烤串格式/i })
    fireEvent.click(kebabCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('hello-world-test')
      expect(result).toBeInTheDocument()
    })
  })

  it('converts text to CONSTANT_CASE', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    const constantCaseButton = screen.getByRole('button', { name: /常量格式/i })
    fireEvent.click(constantCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('HELLO_WORLD_TEST')
      expect(result).toBeInTheDocument()
    })
  })

  it('toggles case (inverts current case)', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'Hello WORLD test' } })
    
    const toggleCaseButton = screen.getByRole('button', { name: /切换大小写/i })
    fireEvent.click(toggleCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('hELLO world TEST')
      expect(result).toBeInTheDocument()
    })
  })

  it('shows case format examples', () => {
    render(<CaseConverterPage />)
    
    expect(screen.getByText(/格式示例/i)).toBeInTheDocument()
    expect(screen.getByText(/camelCase/i)).toBeInTheDocument()
    expect(screen.getByText(/PascalCase/i)).toBeInTheDocument()
    expect(screen.getByText(/snake_case/i)).toBeInTheDocument()
    expect(screen.getByText(/kebab-case/i)).toBeInTheDocument()
  })

  it('has copy functionality for all results', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    const uppercaseButton = screen.getByRole('button', { name: /大写/i })
    fireEvent.click(uppercaseButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty input gracefully', () => {
    render(<CaseConverterPage />)
    
    const uppercaseButton = screen.getByRole('button', { name: /大写/i })
    fireEvent.click(uppercaseButton)
    
    // Should handle empty input gracefully
    expect(uppercaseButton).toBeInTheDocument()
  })

  it('handles special characters and numbers', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world 123 @#$%' } })
    
    const uppercaseButton = screen.getByRole('button', { name: /大写/i })
    fireEvent.click(uppercaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('HELLO WORLD 123 @#$%')
      expect(result).toBeInTheDocument()
    })
  })

  it('handles Unicode and international characters', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'café naïve résumé' } })
    
    const uppercaseButton = screen.getByRole('button', { name: /大写/i })
    fireEvent.click(uppercaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue('CAFÉ NAÏVE RÉSUMÉ')
      expect(result).toBeInTheDocument()
    })
  })

  it('preserves line breaks in multiline text', async () => {
    render(<CaseConverterPage />)
    
    const multilineText = `hello world
    this is a test
    multiple lines`
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: multilineText } })
    
    const titleCaseButton = screen.getByRole('button', { name: /标题格式/i })
    fireEvent.click(titleCaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue(/Hello World\s+This Is A Test\s+Multiple Lines/s)
      expect(result).toBeInTheDocument()
    })
  })

  it('shows usage guidelines', () => {
    render(<CaseConverterPage />)
    
    expect(screen.getByText(/使用指南/i)).toBeInTheDocument()
    expect(screen.getByText(/编程变量/i)).toBeInTheDocument()
    expect(screen.getByText(/文件命名/i)).toBeInTheDocument()
    expect(screen.getByText(/URL路径/i)).toBeInTheDocument()
  })

  it('provides real-time conversion for all formats', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'sample text input' } })
    
    // Check if all conversion results are shown simultaneously
    await waitFor(() => {
      expect(screen.getByText('SAMPLE TEXT INPUT')).toBeInTheDocument() // uppercase
      expect(screen.getByText('sample text input')).toBeInTheDocument() // lowercase
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
    
    const longText = 'word '.repeat(1000).trim()
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: longText } })
    
    const uppercaseButton = screen.getByRole('button', { name: /大写/i })
    fireEvent.click(uppercaseButton)
    
    await waitFor(() => {
      const result = screen.getByDisplayValue(/^WORD( WORD)*$/)
      expect(result).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('shows character and word count', async () => {
    render(<CaseConverterPage />)
    
    const textInput = screen.getByPlaceholderText(/输入要转换的文本/i)
    fireEvent.change(textInput, { target: { value: 'hello world test' } })
    
    await waitFor(() => {
      expect(screen.getByText(/字符数/i)).toBeInTheDocument()
      expect(screen.getByText(/单词数/i)).toBeInTheDocument()
    })
  })
})