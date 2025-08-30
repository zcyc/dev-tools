import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoremIpsumPage from '../../app/tools/lorem-ipsum/page'

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
    
    expect(screen.getByText('Lorem Ipsum生成')).toBeInTheDocument()
    expect(screen.getByText('生成占位文本，用于网页设计和印刷排版')).toBeInTheDocument()
  })

  it('generates lorem ipsum text by paragraphs', async () => {
    render(<LoremIpsumPage />)
    
    const typeSelect = screen.getByLabelText(/生成类型/i)
    fireEvent.change(typeSelect, { target: { value: 'paragraphs' } })
    
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '3' } })
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value).toContain('Lorem ipsum')
      expect(result.value.split('\n\n')).toHaveLength(3)
    })
  })

  it('generates lorem ipsum text by words', async () => {
    render(<LoremIpsumPage />)
    
    const typeSelect = screen.getByLabelText(/生成类型/i)
    fireEvent.change(typeSelect, { target: { value: 'words' } })
    
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '50' } })
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      const words = result.value.trim().split(/\s+/)
      expect(words).toHaveLength(50)
    })
  })

  it('generates lorem ipsum text by sentences', async () => {
    render(<LoremIpsumPage />)
    
    const typeSelect = screen.getByLabelText(/生成类型/i)
    fireEvent.change(typeSelect, { target: { value: 'sentences' } })
    
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '5' } })
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      const sentences = result.value.split(/[.!?]+\s*/).filter(s => s.trim())
      expect(sentences.length).toBeGreaterThanOrEqual(5)
    })
  })

  it('allows starting with "Lorem ipsum"', async () => {
    render(<LoremIpsumPage />)
    
    const startWithLoremCheckbox = screen.getByLabelText(/以"Lorem ipsum"开始/i)
    fireEvent.click(startWithLoremCheckbox)
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value).toMatch(/^Lorem ipsum/)
    })
  })

  it('has copy functionality', async () => {
    render(<LoremIpsumPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows lorem ipsum history and usage', () => {
    render(<LoremIpsumPage />)
    
    expect(screen.getByText(/Lorem Ipsum历史/i)).toBeInTheDocument()
    expect(screen.getByText(/16世纪/i)).toBeInTheDocument()
    expect(screen.getByText(/印刷行业/i)).toBeInTheDocument()
    expect(screen.getByText(/占位文本/i)).toBeInTheDocument()
  })

  it('validates input range', () => {
    render(<LoremIpsumPage />)
    
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '0' } })
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    // Should handle invalid input gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('handles large quantity requests', async () => {
    render(<LoremIpsumPage />)
    
    const typeSelect = screen.getByLabelText(/生成类型/i)
    fireEvent.change(typeSelect, { target: { value: 'words' } })
    
    const countInput = screen.getByLabelText(/数量/i)
    fireEvent.change(countInput, { target: { value: '1000' } })
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const result = screen.getByRole('textbox')
      expect(result.value.length).toBeGreaterThan(100)
    }, { timeout: 5000 })
  })

  it('shows word count and character count', async () => {
    render(<LoremIpsumPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/字符数/i)).toBeInTheDocument()
      expect(screen.getByText(/单词数/i)).toBeInTheDocument()
    })
  })

  it('provides different language variants', () => {
    render(<LoremIpsumPage />)
    
    expect(screen.getByText(/语言变体/i)).toBeInTheDocument()
    expect(screen.getByText(/经典Latin/i)).toBeInTheDocument()
    expect(screen.getByText(/现代变体/i)).toBeInTheDocument()
  })
})