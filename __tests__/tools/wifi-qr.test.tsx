import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WiFiQRPage from '../../app/tools/wifi-qr/page'

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
    Promise.resolve(`data:image/png;base64,mockWiFiQR-${text.split(':')[2]}-${options?.width || 256}`)
  ),
}))

describe('WiFi QR Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders WiFi QR generator page correctly', () => {
    render(<WiFiQRPage />)
    
    expect(screen.getByText('WiFi二维码生成')).toBeInTheDocument()
    expect(screen.getByText('生成WiFi连接二维码，扫描即可自动连接网络')).toBeInTheDocument()
  })

  it('generates WiFi QR code with basic settings', async () => {
    render(<WiFiQRPage />)
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'TestWiFi' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
      expect(qrImage.src).toContain('TestWiFi')
    })
  })

  it('supports different security types', async () => {
    render(<WiFiQRPage />)
    
    const securitySelect = screen.getByLabelText(/安全类型/i)
    fireEvent.change(securitySelect, { target: { value: 'WPA' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'SecureWiFi' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'securepass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('handles open network (no password)', async () => {
    render(<WiFiQRPage />)
    
    const securitySelect = screen.getByLabelText(/安全类型/i)
    fireEvent.change(securitySelect, { target: { value: 'nopass' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'OpenWiFi' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('supports WEP security', async () => {
    render(<WiFiQRPage />)
    
    const securitySelect = screen.getByLabelText(/安全类型/i)
    fireEvent.change(securitySelect, { target: { value: 'WEP' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'WEPNetwork' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'wepkey123' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('allows marking network as hidden', async () => {
    render(<WiFiQRPage />)
    
    const hiddenCheckbox = screen.getByLabelText(/隐藏网络/i)
    fireEvent.click(hiddenCheckbox)
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'HiddenNetwork' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'hiddenpass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('shows WiFi connection string format', async () => {
    render(<WiFiQRPage />)
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'TestNetwork' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/连接字符串/i)).toBeInTheDocument()
      expect(screen.getByText(/WIFI:/)).toBeInTheDocument()
    })
  })

  it('downloads WiFi QR code', async () => {
    render(<WiFiQRPage />)
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'DownloadTest' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'downloadpass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const downloadButton = screen.getByRole('button', { name: /下载/i })
      expect(downloadButton).toBeInTheDocument()
    })
  })

  it('shows security type explanations', () => {
    render(<WiFiQRPage />)
    
    expect(screen.getByText(/安全类型说明/i)).toBeInTheDocument()
    expect(screen.getByText(/WPA\/WPA2: 推荐/i)).toBeInTheDocument()
    expect(screen.getByText(/WEP: 不安全/i)).toBeInTheDocument()
    expect(screen.getByText(/无密码: 开放网络/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<WiFiQRPage />)
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/请输入网络名称/i)).toBeInTheDocument()
    })
  })

  it('validates password for secured networks', async () => {
    render(<WiFiQRPage />)
    
    const securitySelect = screen.getByLabelText(/安全类型/i)
    fireEvent.change(securitySelect, { target: { value: 'WPA' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'SecureNetwork' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/请输入密码/i)).toBeInTheDocument()
    })
  })

  it('handles special characters in SSID and password', async () => {
    render(<WiFiQRPage />)
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'WiFi "Special" & Chars' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'pass@#$%^&*()' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('allows customizing QR code size', async () => {
    render(<WiFiQRPage />)
    
    const sizeSelect = screen.getByLabelText(/二维码大小/i)
    fireEvent.change(sizeSelect, { target: { value: '512' } })
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'SizeTest' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'sizepass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage.src).toContain('512')
    })
  })

  it('provides connection instructions', () => {
    render(<WiFiQRPage />)
    
    expect(screen.getByText(/连接说明/i)).toBeInTheDocument()
    expect(screen.getByText(/扫描二维码/i)).toBeInTheDocument()
    expect(screen.getByText(/自动连接/i)).toBeInTheDocument()
    expect(screen.getByText(/支持的设备/i)).toBeInTheDocument()
  })

  it('shows compatibility information', () => {
    render(<WiFiQRPage />)
    
    expect(screen.getByText(/设备兼容性/i)).toBeInTheDocument()
    expect(screen.getByText(/iOS 11+/i)).toBeInTheDocument()
    expect(screen.getByText(/Android 10+/i)).toBeInTheDocument()
  })

  it('has copy functionality for connection string', async () => {
    render(<WiFiQRPage />)
    
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: 'CopyTest' } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'copypass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('provides security tips', () => {
    render(<WiFiQRPage />)
    
    expect(screen.getByText(/安全提示/i)).toBeInTheDocument()
    expect(screen.getByText(/强密码/i)).toBeInTheDocument()
    expect(screen.getByText(/定期更改/i)).toBeInTheDocument()
    expect(screen.getByText(/访客网络/i)).toBeInTheDocument()
  })

  it('handles very long SSID names', async () => {
    render(<WiFiQRPage />)
    
    const longSSID = 'A'.repeat(32) // Maximum SSID length
    const ssidInput = screen.getByLabelText(/网络名称/i)
    fireEvent.change(ssidInput, { target: { value: longSSID } })
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'longpass' } })
    
    const generateButton = screen.getByRole('button', { name: /生成二维码/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const qrImage = screen.getByRole('img', { name: /WiFi二维码/i })
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('shows alternative connection methods', () => {
    render(<WiFiQRPage />)
    
    expect(screen.getByText(/其他连接方式/i)).toBeInTheDocument()
    expect(screen.getByText(/手动输入/i)).toBeInTheDocument()
    expect(screen.getByText(/WPS连接/i)).toBeInTheDocument()
  })
})