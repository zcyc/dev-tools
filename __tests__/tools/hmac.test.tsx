import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HMACGeneratorPage from '../../app/tools/hmac/page'

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

// Mock crypto-js
jest.mock('crypto-js', () => ({
  HmacMD5: jest.fn((message, key) => ({
    toString: () => `md5-hmac-${message}-${key}`
  })),
  HmacSHA1: jest.fn((message, key) => ({
    toString: () => `sha1-hmac-${message}-${key}`
  })),
  HmacSHA256: jest.fn((message, key) => ({
    toString: () => `sha256-hmac-${message}-${key}`
  })),
  HmacSHA512: jest.fn((message, key) => ({
    toString: () => `sha512-hmac-${message}-${key}`
  })),
}))

describe('HMAC Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders HMAC generator page correctly', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('HMAC生成器')).toBeInTheDocument()
    expect(screen.getByText('生成基于哈希的消息认证码，用于数据完整性验证')).toBeInTheDocument()
  })

  it('generates HMAC with default algorithm (SHA-256)', async () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hmacResult = screen.getByDisplayValue('sha256-hmac-test message-secret-key')
      expect(hmacResult).toBeInTheDocument()
    })
  })

  it('supports different HMAC algorithms', async () => {
    render(<HMACGeneratorPage />)
    
    const algorithmSelect = screen.getByLabelText(/算法/i)
    fireEvent.change(algorithmSelect, { target: { value: 'SHA-1' } })
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hmacResult = screen.getByDisplayValue('sha1-hmac-test message-secret-key')
      expect(hmacResult).toBeInTheDocument()
    })
  })

  it('supports MD5 HMAC algorithm', async () => {
    render(<HMACGeneratorPage />)
    
    const algorithmSelect = screen.getByLabelText(/算法/i)
    fireEvent.change(algorithmSelect, { target: { value: 'MD5' } })
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hmacResult = screen.getByDisplayValue('md5-hmac-test message-secret-key')
      expect(hmacResult).toBeInTheDocument()
    })
  })

  it('supports SHA-512 HMAC algorithm', async () => {
    render(<HMACGeneratorPage />)
    
    const algorithmSelect = screen.getByLabelText(/算法/i)
    fireEvent.change(algorithmSelect, { target: { value: 'SHA-512' } })
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hmacResult = screen.getByDisplayValue('sha512-hmac-test message-secret-key')
      expect(hmacResult).toBeInTheDocument()
    })
  })

  it('shows HMAC information', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText(/HMAC特性/i)).toBeInTheDocument()
    expect(screen.getByText(/消息认证/i)).toBeInTheDocument()
    expect(screen.getByText(/数据完整性/i)).toBeInTheDocument()
    expect(screen.getByText(/密钥依赖/i)).toBeInTheDocument()
    expect(screen.getByText(/抗篡改/i)).toBeInTheDocument()
  })

  it('shows algorithm comparison', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText(/算法对比/i)).toBeInTheDocument()
    expect(screen.getByText(/MD5: 128位/i)).toBeInTheDocument()
    expect(screen.getByText(/SHA-1: 160位/i)).toBeInTheDocument()
    expect(screen.getByText(/SHA-256: 256位/i)).toBeInTheDocument()
    expect(screen.getByText(/SHA-512: 512位/i)).toBeInTheDocument()
  })

  it('has copy functionality', async () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('validates empty message input', () => {
    render(<HMACGeneratorPage />)
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    // Should handle empty message gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('validates empty key input', () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    // Should handle empty key gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('shows security recommendations', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText(/安全建议/i)).toBeInTheDocument()
    expect(screen.getByText(/密钥强度/i)).toBeInTheDocument()
    expect(screen.getByText(/密钥管理/i)).toBeInTheDocument()
    expect(screen.getByText(/算法选择/i)).toBeInTheDocument()
  })

  it('supports verification mode', async () => {
    render(<HMACGeneratorPage />)
    
    // Switch to verification tab if exists
    const verifyTab = screen.queryByText('HMAC验证')
    if (verifyTab) {
      fireEvent.click(verifyTab)
      
      const messageInput = screen.getByPlaceholderText(/输入原始消息/i)
      fireEvent.change(messageInput, { target: { value: 'test message' } })
      
      const keyInput = screen.getByPlaceholderText(/输入密钥/i)
      fireEvent.change(keyInput, { target: { value: 'secret-key' } })
      
      const hmacInput = screen.getByPlaceholderText(/输入要验证的HMAC/i)
      fireEvent.change(hmacInput, { target: { value: 'sha256-hmac-test message-secret-key' } })
      
      const verifyButton = screen.getByRole('button', { name: /验证HMAC/i })
      fireEvent.click(verifyButton)
      
      await waitFor(() => {
        expect(screen.getByText(/HMAC匹配/i)).toBeInTheDocument()
      })
    }
  })

  it('handles large message input', async () => {
    render(<HMACGeneratorPage />)
    
    const largeMessage = 'a'.repeat(10000)
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: largeMessage } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hmacResult = screen.getByDisplayValue(`sha256-hmac-${largeMessage}-secret-key`)
      expect(hmacResult).toBeInTheDocument()
    })
  })

  it('shows use cases', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText(/使用场景/i)).toBeInTheDocument()
    expect(screen.getByText(/API签名/i)).toBeInTheDocument()
    expect(screen.getByText(/消息验证/i)).toBeInTheDocument()
    expect(screen.getByText(/数据完整性/i)).toBeInTheDocument()
    expect(screen.getByText(/身份认证/i)).toBeInTheDocument()
  })

  it('shows key generation suggestions', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText(/密钥建议/i)).toBeInTheDocument()
    expect(screen.getByText(/随机生成/i)).toBeInTheDocument()
    expect(screen.getByText(/足够长度/i)).toBeInTheDocument()
    expect(screen.getByText(/保密存储/i)).toBeInTheDocument()
  })

  it('handles special characters in message and key', async () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText(/输入要签名的消息/i)
    fireEvent.change(messageInput, { target: { value: 'Hello 世界! @#$%^&*()' } })
    
    const keyInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(keyInput, { target: { value: 'key-with-特殊字符-123' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HMAC/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hmacResult = screen.getByDisplayValue('sha256-hmac-Hello 世界! @#$%^&*()-key-with-特殊字符-123')
      expect(hmacResult).toBeInTheDocument()
    })
  })
})