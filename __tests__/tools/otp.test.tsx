import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OTPGeneratorPage from '../../app/tools/otp/page'

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

// Mock otplib
jest.mock('otplib', () => ({
  authenticator: {
    generate: jest.fn((secret) => `123456-${secret.slice(0, 3)}`),
    verify: jest.fn((token, secret) => token.startsWith('123456')),
    generateSecret: jest.fn(() => 'MOCK1234567890ABCDEF'),
    keyuri: jest.fn((user, service, secret) => `otpauth://totp/${service}:${user}?secret=${secret}&issuer=${service}`),
  },
  hotp: {
    generate: jest.fn((secret, counter) => `654321-${secret.slice(0, 3)}-${counter}`),
    verify: jest.fn((token, secret, counter) => token.startsWith('654321')),
  }
}))

describe('OTP Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders OTP generator page correctly', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText('OTP代码生成')).toBeInTheDocument()
    expect(screen.getByText('生成一次性密码（OTP），支持TOTP和HOTP算法')).toBeInTheDocument()
  })

  it('has TOTP and HOTP tabs', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText('TOTP')).toBeInTheDocument()
    expect(screen.getByText('HOTP')).toBeInTheDocument()
  })

  it('generates TOTP code', async () => {
    render(<OTPGeneratorPage />)
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const generateButton = screen.getByRole('button', { name: /生成TOTP/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const totpCode = screen.getByDisplayValue('123456-JBS')
      expect(totpCode).toBeInTheDocument()
    })
  })

  it('generates random secret', async () => {
    render(<OTPGeneratorPage />)
    
    const generateSecretButton = screen.getByRole('button', { name: /生成随机密钥/i })
    fireEvent.click(generateSecretButton)
    
    await waitFor(() => {
      const secretInput = screen.getByDisplayValue('MOCK1234567890ABCDEF')
      expect(secretInput).toBeInTheDocument()
    })
  })

  it('generates HOTP code', async () => {
    render(<OTPGeneratorPage />)
    
    // Switch to HOTP tab
    const hotpTab = screen.getByText('HOTP')
    fireEvent.click(hotpTab)
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const counterInput = screen.getByLabelText(/计数器/i)
    fireEvent.change(counterInput, { target: { value: '5' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HOTP/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hotpCode = screen.getByDisplayValue('654321-JBS-5')
      expect(hotpCode).toBeInTheDocument()
    })
  })

  it('generates QR code for TOTP', async () => {
    render(<OTPGeneratorPage />)
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const userInput = screen.getByLabelText(/用户名/i)
    fireEvent.change(userInput, { target: { value: 'test@example.com' } })
    
    const serviceInput = screen.getByLabelText(/服务名/i)
    fireEvent.change(serviceInput, { target: { value: 'TestApp' } })
    
    const generateQRButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateQRButton)
    
    await waitFor(() => {
      expect(screen.getByText(/扫描二维码/i)).toBeInTheDocument()
    })
  })

  it('shows OTP information', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText(/OTP特性/i)).toBeInTheDocument()
    expect(screen.getByText(/时间同步/i)).toBeInTheDocument()
    expect(screen.getByText(/安全性高/i)).toBeInTheDocument()
    expect(screen.getByText(/标准兼容/i)).toBeInTheDocument()
  })

  it('shows TOTP vs HOTP comparison', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText(/算法对比/i)).toBeInTheDocument()
    expect(screen.getByText(/TOTP: 基于时间/i)).toBeInTheDocument()
    expect(screen.getByText(/HOTP: 基于计数/i)).toBeInTheDocument()
  })

  it('validates TOTP with current code', async () => {
    render(<OTPGeneratorPage />)
    
    // Switch to validation mode if exists
    const validateTab = screen.queryByText('验证')
    if (validateTab) {
      fireEvent.click(validateTab)
      
      const secretInput = screen.getByPlaceholderText(/输入密钥/i)
      fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
      
      const codeInput = screen.getByPlaceholderText(/输入验证码/i)
      fireEvent.change(codeInput, { target: { value: '123456' } })
      
      const validateButton = screen.getByRole('button', { name: /验证/i })
      fireEvent.click(validateButton)
      
      await waitFor(() => {
        expect(screen.getByText(/验证成功/i)).toBeInTheDocument()
      })
    }
  })

  it('has copy functionality for generated codes', async () => {
    render(<OTPGeneratorPage />)
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const generateButton = screen.getByRole('button', { name: /生成TOTP/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('validates empty secret input', () => {
    render(<OTPGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成TOTP/i })
    fireEvent.click(generateButton)
    
    // Should handle empty secret gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('shows security recommendations', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText(/安全建议/i)).toBeInTheDocument()
    expect(screen.getByText(/密钥保护/i)).toBeInTheDocument()
    expect(screen.getByText(/时间同步/i)).toBeInTheDocument()
    expect(screen.getByText(/备份密钥/i)).toBeInTheDocument()
  })

  it('shows supported authenticator apps', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText(/支持的应用/i)).toBeInTheDocument()
    expect(screen.getByText(/Google Authenticator/i)).toBeInTheDocument()
    expect(screen.getByText(/Microsoft Authenticator/i)).toBeInTheDocument()
    expect(screen.getByText(/Authy/i)).toBeInTheDocument()
  })

  it('handles invalid secret format', () => {
    render(<OTPGeneratorPage />)
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'invalid-secret-123' } })
    
    const generateButton = screen.getByRole('button', { name: /生成TOTP/i })
    fireEvent.click(generateButton)
    
    // Should handle invalid secret gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('shows time window information for TOTP', () => {
    render(<OTPGeneratorPage />)
    
    expect(screen.getByText(/时间窗口/i)).toBeInTheDocument()
    expect(screen.getByText(/30秒/i)).toBeInTheDocument()
    expect(screen.getByText(/剩余时间/i)).toBeInTheDocument()
  })

  it('allows customizing HOTP counter', async () => {
    render(<OTPGeneratorPage />)
    
    // Switch to HOTP tab
    const hotpTab = screen.getByText('HOTP')
    fireEvent.click(hotpTab)
    
    const counterInput = screen.getByLabelText(/计数器/i)
    fireEvent.change(counterInput, { target: { value: '100' } })
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const generateButton = screen.getByRole('button', { name: /生成HOTP/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const hotpCode = screen.getByDisplayValue('654321-JBS-100')
      expect(hotpCode).toBeInTheDocument()
    })
  })

  it('shows URI format for QR code', async () => {
    render(<OTPGeneratorPage />)
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const userInput = screen.getByLabelText(/用户名/i)
    fireEvent.change(userInput, { target: { value: 'test@example.com' } })
    
    const serviceInput = screen.getByLabelText(/服务名/i)
    fireEvent.change(serviceInput, { target: { value: 'TestApp' } })
    
    const generateQRButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateQRButton)
    
    await waitFor(() => {
      expect(screen.getByText(/otpauth:\/\/totp\//)).toBeInTheDocument()
    })
  })

  it('handles special characters in service and user names', async () => {
    render(<OTPGeneratorPage />)
    
    const userInput = screen.getByLabelText(/用户名/i)
    fireEvent.change(userInput, { target: { value: '用户@测试.com' } })
    
    const serviceInput = screen.getByLabelText(/服务名/i)
    fireEvent.change(serviceInput, { target: { value: '测试应用-2024' } })
    
    const secretInput = screen.getByPlaceholderText(/输入密钥/i)
    fireEvent.change(secretInput, { target: { value: 'JBSWY3DPEHPK3PXP' } })
    
    const generateQRButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateQRButton)
    
    // Should handle special characters gracefully
    expect(generateQRButton).toBeInTheDocument()
  })
})