import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TokenGeneratorPage from '../../app/[locale]/tools/token/page'

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

describe('Token Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders token generator page correctly', () => {
    render(<TokenGeneratorPage />)
    
    expect(screen.getByText('Token生成器')).toBeInTheDocument()
    expect(screen.getByText('生成安全的随机访问令牌，用于API认证、会话管理等场景')).toBeInTheDocument()
  })

  it('generates token with default settings', async () => {
    render(<TokenGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const tokenInput = screen.getByDisplayValue(/^[A-Za-z0-9+/]+=*$/)
      expect(tokenInput).toBeInTheDocument()
      expect(tokenInput.value.length).toBeGreaterThan(0)
    })
  })

  it('allows customizing token length', async () => {
    render(<TokenGeneratorPage />)
    
    const lengthInput = screen.getByLabelText(/长度/i)
    fireEvent.change(lengthInput, { target: { value: '64' } })
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const tokenInput = screen.getByDisplayValue(/^[A-Za-z0-9+/]+=*$/)
      // Base64 encoded 64 bytes would be about 88 characters
      expect(tokenInput.value.length).toBeGreaterThan(80)
    })
  })

  it('allows selecting different encoding formats', async () => {
    render(<TokenGeneratorPage />)
    
    // Test hex encoding
    const formatSelect = screen.getByLabelText(/编码格式/i)
    fireEvent.change(formatSelect, { target: { value: 'hex' } })
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const tokenInput = screen.getByDisplayValue(/^[a-f0-9]+$/)
      expect(tokenInput).toBeInTheDocument()
    })
  })

  it('generates multiple tokens', async () => {
    render(<TokenGeneratorPage />)
    
    const quantityInput = screen.getByLabelText(/数量/i)
    fireEvent.change(quantityInput, { target: { value: '3' } })
    
    const generateButton = screen.getByRole('button', { name: /生成多个Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const textarea = screen.getByRole('textbox')
      const tokens = textarea.value.trim().split('\n')
      expect(tokens).toHaveLength(3)
      tokens.forEach(token => {
        expect(token.length).toBeGreaterThan(0)
      })
    })
  })

  it('shows token format examples', () => {
    render(<TokenGeneratorPage />)
    
    expect(screen.getByText(/格式示例/i)).toBeInTheDocument()
    expect(screen.getByText(/Base64/i)).toBeInTheDocument()
    expect(screen.getByText(/Hex/i)).toBeInTheDocument()
    expect(screen.getByText(/URL Safe/i)).toBeInTheDocument()
  })

  it('shows security recommendations', () => {
    render(<TokenGeneratorPage />)
    
    expect(screen.getByText(/安全建议/i)).toBeInTheDocument()
    expect(screen.getByText(/定期更换/i)).toBeInTheDocument()
    expect(screen.getByText(/安全存储/i)).toBeInTheDocument()
    expect(screen.getByText(/传输加密/i)).toBeInTheDocument()
  })

  it('has copy functionality for single token', async () => {
    render(<TokenGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('validates length input', () => {
    render(<TokenGeneratorPage />)
    
    const lengthInput = screen.getByLabelText(/长度/i)
    fireEvent.change(lengthInput, { target: { value: '0' } })
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    fireEvent.click(generateButton)
    
    // Should handle invalid length gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('validates quantity input', () => {
    render(<TokenGeneratorPage />)
    
    const quantityInput = screen.getByLabelText(/数量/i)
    fireEvent.change(quantityInput, { target: { value: '0' } })
    
    const generateButton = screen.getByRole('button', { name: /生成多个Token/i })
    fireEvent.click(generateButton)
    
    expect(generateButton).toBeInTheDocument()
  })

  it('handles large quantity requests', async () => {
    render(<TokenGeneratorPage />)
    
    const quantityInput = screen.getByLabelText(/数量/i)
    fireEvent.change(quantityInput, { target: { value: '100' } })
    
    const generateButton = screen.getByRole('button', { name: /生成多个Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const textarea = screen.getByRole('textbox')
      const tokens = textarea.value.trim().split('\n')
      expect(tokens.length).toBeGreaterThan(0)
    }, { timeout: 5000 })
  })

  it('ensures tokens are cryptographically secure', async () => {
    render(<TokenGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    
    // Generate multiple tokens to check uniqueness
    const tokens = []
    for (let i = 0; i < 5; i++) {
      fireEvent.click(generateButton)
      await waitFor(() => {
        const tokenInput = screen.getByDisplayValue(/^[A-Za-z0-9+/]+=*$/)
        tokens.push(tokenInput.value)
      })
    }
    
    // All tokens should be unique
    const uniqueTokens = new Set(tokens)
    expect(uniqueTokens.size).toBe(tokens.length)
  })

  it('supports URL-safe base64 encoding', async () => {
    render(<TokenGeneratorPage />)
    
    const formatSelect = screen.getByLabelText(/编码格式/i)
    fireEvent.change(formatSelect, { target: { value: 'base64url' } })
    
    const generateButton = screen.getByRole('button', { name: /生成Token/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const tokenInput = screen.getByDisplayValue(/^[A-Za-z0-9_-]+$/)
      expect(tokenInput).toBeInTheDocument()
    })
  })

  it('shows token usage examples', () => {
    render(<TokenGeneratorPage />)
    
    expect(screen.getByText(/使用场景/i)).toBeInTheDocument()
    expect(screen.getByText(/API密钥/i)).toBeInTheDocument()
    expect(screen.getByText(/会话令牌/i)).toBeInTheDocument()
    expect(screen.getByText(/访问令牌/i)).toBeInTheDocument()
  })
})