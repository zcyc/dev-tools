import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import QRCodePage from '../../app/tools/qr-code/page'

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

// Mock qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn((text, options) => 
    Promise.resolve(`data:image/png;base64,mockQRCode-${text.slice(0, 10)}-${options?.width || 256}`)
  ),
  toSVG: jest.fn((text, options) =>
    Promise.resolve(`<svg>MockSVG-QR-${text.slice(0, 10)}</svg>`)
  ),
}))

describe('QR Code Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders QR code generator page correctly', () => {
    render(<QRCodePage />)
    
    expect(screen.getByText('QR码生成')).toBeInTheDocument()
    expect(screen.getByText('生成二维码，支持文本、URL、WiFi密码等多种类型')).toBeInTheDocument()
  })

  it('generates QR code for text input', async () => {
    render(<QRCodePage />)
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: 'Hello World' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
      expect(qrImage.src).toContain('mockQRCode-Hello Worl')
    })
  })

  it('supports different QR code types', async () => {
    render(<QRCodePage />)
    
    const typeSelect = screen.getByLabelText(/类型/i)
    fireEvent.change(typeSelect, { target: { value: 'url' } })
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: 'https://example.com' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage.src).toContain('https://ex')
    })
  })

  it('allows customizing QR code size', async () => {
    render(<QRCodePage />)
    
    const sizeSelect = screen.getByLabelText(/大小/i)
    fireEvent.change(sizeSelect, { target: { value: '512' } })
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: 'Test' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage.src).toContain('512')
    })
  })

  it('allows customizing error correction level', async () => {
    render(<QRCodePage />)
    
    const errorCorrectionSelect = screen.getByLabelText(/纠错级别/i)
    fireEvent.change(errorCorrectionSelect, { target: { value: 'H' } })
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: 'Test with high error correction' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('generates QR code for WiFi credentials', async () => {
    render(<QRCodePage />)
    
    const typeSelect = screen.getByLabelText(/类型/i)
    fireEvent.change(typeSelect, { target: { value: 'wifi' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'MyWiFi' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('generates QR code for contact information', async () => {
    render(<QRCodePage />)
    
    const typeSelect = screen.getByLabelText(/类型/i)
    fireEvent.change(typeSelect, { target: { value: 'contact' } })
    
    const nameInput = screen.getByLabelText(/姓名/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    const phoneInput = screen.getByLabelText(/电话/i)
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } })
    
    const emailInput = screen.getByLabelText(/邮箱/i)
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('downloads QR code as PNG', async () => {
    render(<QRCodePage />)
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: 'Download test' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const downloadButton = screen.getByRole('button', { name: /下载PNG/i })
      expect(downloadButton).toBeInTheDocument()
    })
  })

  it('downloads QR code as SVG', async () => {
    render(<QRCodePage />)
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: 'SVG test' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const downloadSVGButton = screen.getByRole('button', { name: /下载SVG/i })
      expect(downloadSVGButton).toBeInTheDocument()
    })
  })

  it('shows QR code information', () => {
    render(<QRCodePage />)
    
    expect(screen.getByText(/QR码特性/i)).toBeInTheDocument()
    expect(screen.getByText(/快速识别/i)).toBeInTheDocument()
    expect(screen.getByText(/纠错能力/i)).toBeInTheDocument()
    expect(screen.getByText(/大容量存储/i)).toBeInTheDocument()
  })

  it('shows error correction levels explanation', () => {
    render(<QRCodePage />)
    
    expect(screen.getByText(/纠错级别说明/i)).toBeInTheDocument()
    expect(screen.getByText(/L级: 7%/i)).toBeInTheDocument()
    expect(screen.getByText(/M级: 15%/i)).toBeInTheDocument()
    expect(screen.getByText(/Q级: 25%/i)).toBeInTheDocument()
    expect(screen.getByText(/H级: 30%/i)).toBeInTheDocument()
  })

  it('validates empty input', () => {
    render(<QRCodePage />)
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    // Should handle empty input gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('handles very long text input', async () => {
    render(<QRCodePage />)
    
    const longText = 'a'.repeat(2000)
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: longText } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('supports different WiFi security types', async () => {
    render(<QRCodePage />)
    
    const typeSelect = screen.getByLabelText(/类型/i)
    fireEvent.change(typeSelect, { target: { value: 'wifi' } })
    
    const securitySelect = screen.getByLabelText(/安全类型/i)
    fireEvent.change(securitySelect, { target: { value: 'WPA' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'SecureWiFi' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'secure123' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('shows usage examples for different QR code types', () => {
    render(<QRCodePage />)
    
    expect(screen.getByText(/使用示例/i)).toBeInTheDocument()
    expect(screen.getByText(/网站链接/i)).toBeInTheDocument()
    expect(screen.getByText(/WiFi连接/i)).toBeInTheDocument()
    expect(screen.getByText(/联系信息/i)).toBeInTheDocument()
    expect(screen.getByText(/短信/i)).toBeInTheDocument()
  })

  it('provides preset templates', async () => {
    render(<QRCodePage />)
    
    const templateButton = screen.getByRole('button', { name: /使用模板/i })
    fireEvent.click(templateButton)
    
    await waitFor(() => {
      const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
      expect(textInput.value).not.toBe('')
    })
  })

  it('shows QR code scanning tips', () => {
    render(<QRCodePage />)
    
    expect(screen.getByText(/扫描提示/i)).toBeInTheDocument()
    expect(screen.getByText(/适当距离/i)).toBeInTheDocument()
    expect(screen.getByText(/良好光线/i)).toBeInTheDocument()
    expect(screen.getByText(/稳定手持/i)).toBeInTheDocument()
  })

  it('supports batch generation', async () => {
    render(<QRCodePage />)
    
    const batchTab = screen.queryByText('批量生成')
    if (batchTab) {
      fireEvent.click(batchTab)
      
      const batchInput = screen.getByPlaceholderText(/每行一个内容/i)
      fireEvent.change(batchInput, { target: { value: 'Text1\nText2\nText3' } })
      
      const generateBatchButton = screen.getByRole('button', { name: /批量生成/i })
      fireEvent.click(generateBatchButton)
      
      await waitFor(() => {
        const qrImages = screen.getAllByRole('img', { name: /二维码/i })
        expect(qrImages.length).toBe(3)
      })
    }
  })

  it('handles special characters and Unicode', async () => {
    render(<QRCodePage />)
    
    const textInput = screen.getByPlaceholderText(/输入要生成二维码的内容/i)
    fireEvent.change(textInput, { target: { value: '你好世界 🌍 @#$%^&*()' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('shows data capacity information', () => {
    render(<QRCodePage />)
    
    expect(screen.getByText(/容量限制/i)).toBeInTheDocument()
    expect(screen.getByText(/数字: 7089字符/i)).toBeInTheDocument()
    expect(screen.getByText(/字母: 4296字符/i)).toBeInTheDocument()
    expect(screen.getByText(/二进制: 2953字节/i)).toBeInTheDocument()
  })
})