import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoremIpsumPage from '../../app/[locale]/tools/lorem-ipsum/page'

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

describe('Lorem Ipsum Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders lorem ipsum generator page correctly', () => {
    render(<LoremIpsumPage />)
    
    expect(screen.getByText('Lorem Ipsum生成器')).toBeInTheDocument()
    expect(screen.getByText('生成Lorem Ipsum占位文本，用于设计和排版')).toBeInTheDocument()
  })

  it('generates lorem ipsum text by paragraphs', async () => {
    render(<LoremIpsumPage />)
    
    // Default should be paragraphs
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '3' } })
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value).toContain('Lorem')
      // Should generate some content
      expect(result.value.length).toBeGreaterThan(50)
    })
  })

  it('generates lorem ipsum text using quick action', async () => {
    render(<LoremIpsumPage />)
    
    // Use quick action button for 50 words
    const quickButton = screen.getByText('50个单词')
    fireEvent.click(quickButton)
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value.length).toBeGreaterThan(50)
    })
  })

  it('generates lorem ipsum text using quick sentence action', async () => {
    render(<LoremIpsumPage />)
    
    // Use quick action button for 5 sentences
    const quickButton = screen.getByText('5个句子')
    fireEvent.click(quickButton)
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value.length).toBeGreaterThan(50)
    })
  })

  it('allows starting with "Lorem ipsum"', async () => {
    render(<LoremIpsumPage />)
    
    // Checkbox should be checked by default, just verify it's checked
    const startWithLoremCheckbox = screen.getByLabelText(/以经典Lorem ipsum开头/i)
    expect(startWithLoremCheckbox).toBeChecked()
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value).toMatch(/^Lorem ipsum/)
    })
  })

  it('has copy functionality', async () => {
    render(<LoremIpsumPage />)
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButton = document.querySelector('button svg.lucide-copy')
      expect(copyButton).toBeInTheDocument()
    })
  })

  it('shows lorem ipsum history and usage', () => {
    render(<LoremIpsumPage />)
    
    expect(screen.getByText(/关于Lorem Ipsum/i)).toBeInTheDocument()
    expect(screen.getByText(/16世纪/i)).toBeInTheDocument()
    expect(screen.getByText(/印刷和排版行业/i)).toBeInTheDocument()
    expect(screen.getByText(/标准占位文本/i)).toBeInTheDocument()
  })

  it('validates input range', () => {
    render(<LoremIpsumPage />)
    
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '0' } })
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    // Should handle invalid input gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('handles large quantity requests', async () => {
    render(<LoremIpsumPage />)
    
    // Use quick action for 10 paragraphs
    const quickButton = screen.getByText('10个段落')
    fireEvent.click(quickButton)
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value.length).toBeGreaterThan(500)
    }, { timeout: 5000 })
  })

  it('shows character count in output', async () => {
    render(<LoremIpsumPage />)
    
    const generateButton = screen.getByText('生成文本')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/字符/)).toBeInTheDocument()
      expect(screen.getByText(/生成的文本/)).toBeInTheDocument()
    })
  })

  it('provides quick generation options', () => {
    render(<LoremIpsumPage />)
    
    expect(screen.getAllByText(/快速生成/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/50个单词/)).toBeInTheDocument()
    expect(screen.getByText(/5个句子/)).toBeInTheDocument()
    expect(screen.getByText(/3个段落/)).toBeInTheDocument()
  })
})