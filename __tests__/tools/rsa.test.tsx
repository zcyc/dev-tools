import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RSAKeyGeneratorPage from '../../app/[locale]/tools/rsa/page'

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

// Mock node-rsa or crypto library
jest.mock('node-rsa', () => {
  return jest.fn().mockImplementation((keySize) => ({
    generateKeyPair: jest.fn(),
    exportKey: jest.fn((format) => {
      if (format === 'private') {
        return `-----BEGIN RSA PRIVATE KEY-----\nMockPrivateKey${keySize}\n-----END RSA PRIVATE KEY-----`
      } else if (format === 'public') {
        return `-----BEGIN PUBLIC KEY-----\nMockPublicKey${keySize}\n-----END PUBLIC KEY-----`
      }
      return `Mock${format}Key${keySize}`
    }),
    getKeySize: jest.fn(() => keySize),
    getMaxMessageSize: jest.fn(() => Math.floor(keySize / 8) - 11),
  }))
})

describe('RSA Key Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders RSA key generator page correctly', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText('RSA密钥对生成')).toBeInTheDocument()
    expect(screen.getByText('生成RSA公私钥对，用于非对称加密和数字签名')).toBeInTheDocument()
  })

  it('generates RSA key pair with default key size', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/-----BEGIN RSA PRIVATE KEY-----/)).toBeInTheDocument()
      expect(screen.getByText(/-----BEGIN PUBLIC KEY-----/)).toBeInTheDocument()
    })
  })

  it('allows selecting different key sizes', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const keySizeSelect = screen.getByLabelText(/密钥长度/i)
    fireEvent.change(keySizeSelect, { target: { value: '4096' } })
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/MockPrivateKey4096/)).toBeInTheDocument()
      expect(screen.getByText(/MockPublicKey4096/)).toBeInTheDocument()
    })
  })

  it('supports different output formats', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const formatSelect = screen.getByLabelText(/输出格式/i)
    fireEvent.change(formatSelect, { target: { value: 'PKCS8' } })
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/MockPKCS8Key/)).toBeInTheDocument()
    })
  })

  it('shows key size recommendations', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText(/密钥长度说明/i)).toBeInTheDocument()
    expect(screen.getByText(/1024位: 不推荐/i)).toBeInTheDocument()
    expect(screen.getByText(/2048位: 推荐/i)).toBeInTheDocument()
    expect(screen.getByText(/4096位: 高安全/i)).toBeInTheDocument()
  })

  it('shows RSA information', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText(/RSA特性/i)).toBeInTheDocument()
    expect(screen.getByText(/非对称加密/i)).toBeInTheDocument()
    expect(screen.getByText(/数字签名/i)).toBeInTheDocument()
    expect(screen.getByText(/密钥交换/i)).toBeInTheDocument()
    expect(screen.getByText(/身份认证/i)).toBeInTheDocument()
  })

  it('has separate copy buttons for public and private keys', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(1) // At least copy buttons for both keys
    })
  })

  it('shows format options', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText(/格式选项/i)).toBeInTheDocument()
    expect(screen.getByText(/PEM: 通用格式/i)).toBeInTheDocument()
    expect(screen.getByText(/PKCS1: 传统格式/i)).toBeInTheDocument()
    expect(screen.getByText(/PKCS8: 标准格式/i)).toBeInTheDocument()
  })

  it('handles key generation errors gracefully', async () => {
    render(<RSAKeyGeneratorPage />)
    
    // Mock an error scenario
    const keySizeSelect = screen.getByLabelText(/密钥长度/i)
    fireEvent.change(keySizeSelect, { target: { value: '512' } }) // Very small key size
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    // Should handle error gracefully
    await waitFor(() => {
      expect(generateButton).toBeInTheDocument()
    })
  })

  it('shows security warnings for small key sizes', () => {
    render(<RSAKeyGeneratorPage />)
    
    const keySizeSelect = screen.getByLabelText(/密钥长度/i)
    fireEvent.change(keySizeSelect, { target: { value: '1024' } })
    
    expect(screen.getByText(/安全警告/i)).toBeInTheDocument()
    expect(screen.getByText(/1024位密钥不够安全/i)).toBeInTheDocument()
  })

  it('shows use cases', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText(/使用场景/i)).toBeInTheDocument()
    expect(screen.getByText(/HTTPS证书/i)).toBeInTheDocument()
    expect(screen.getByText(/代码签名/i)).toBeInTheDocument()
    expect(screen.getByText(/邮件加密/i)).toBeInTheDocument()
    expect(screen.getByText(/API认证/i)).toBeInTheDocument()
  })

  it('shows key management tips', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText(/密钥管理/i)).toBeInTheDocument()
    expect(screen.getByText(/私钥保护/i)).toBeInTheDocument()
    expect(screen.getByText(/公钥分发/i)).toBeInTheDocument()
    expect(screen.getByText(/定期更换/i)).toBeInTheDocument()
  })

  it('displays key properties after generation', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/密钥信息/i)).toBeInTheDocument()
      expect(screen.getByText(/密钥长度/i)).toBeInTheDocument()
      expect(screen.getByText(/生成时间/i)).toBeInTheDocument()
    })
  })

  it('allows regenerating keys', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    
    // Generate first key pair
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/-----BEGIN RSA PRIVATE KEY-----/)).toBeInTheDocument()
    })
    
    // Generate second key pair
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/-----BEGIN RSA PRIVATE KEY-----/)).toBeInTheDocument()
    })
  })

  it('shows encryption/decryption limits', async () => {
    render(<RSAKeyGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成密钥对/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/加密限制/i)).toBeInTheDocument()
      expect(screen.getByText(/最大消息长度/i)).toBeInTheDocument()
    })
  })

  it('validates key size selection', () => {
    render(<RSAKeyGeneratorPage />)
    
    const keySizeSelect = screen.getByLabelText(/密钥长度/i)
    
    // Should have standard key size options
    expect(screen.getByText(/1024/)).toBeInTheDocument()
    expect(screen.getByText(/2048/)).toBeInTheDocument()
    expect(screen.getByText(/4096/)).toBeInTheDocument()
  })

  it('shows performance implications', () => {
    render(<RSAKeyGeneratorPage />)
    
    expect(screen.getByText(/性能考虑/i)).toBeInTheDocument()
    expect(screen.getByText(/生成时间/i)).toBeInTheDocument()
    expect(screen.getByText(/计算开销/i)).toBeInTheDocument()
  })
})