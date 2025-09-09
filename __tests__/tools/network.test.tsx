import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import NetworkToolsPage from '../../app/[locale]/tools/network/page'

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
    info: jest.fn(),
  },
}))

// Mock navigator properties
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
})

Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US'
})

Object.defineProperty(navigator, 'platform', {
  writable: true,
  value: 'Win32'
})

Object.defineProperty(navigator, 'cookieEnabled', {
  writable: true,
  value: true
})

Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
})

describe('Network Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders network tools page correctly', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('网络工具')).toBeInTheDocument()
    expect(screen.getByText('IP查询、连接测试等网络诊断工具')).toBeInTheDocument()
  })

  it('shows current network information', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('当前网络信息')).toBeInTheDocument()
    expect(screen.getByText('本机IP地址')).toBeInTheDocument()
    expect(screen.getByText('连接状态')).toBeInTheDocument()
    expect(screen.getByText('在线')).toBeInTheDocument()
  })

  it('displays IP address information', () => {
    render(<NetworkToolsPage />)
    
    // Should show the mock IP address
    expect(screen.getByText('192.168.1.100')).toBeInTheDocument()
  })

  it('shows browser and system information', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('浏览器')).toBeInTheDocument()
    expect(screen.getByText('语言设置')).toBeInTheDocument()
    expect(screen.getByText('en-US')).toBeInTheDocument()
  })

  it('has connection test functionality', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('连接测试')).toBeInTheDocument()
    expect(screen.getByText('测试到指定主机的连接')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入IP地址或域名，如: google.com')).toBeInTheDocument()
    expect(screen.getByText('测试连接')).toBeInTheDocument()
  })

  it('performs connection test', async () => {
    render(<NetworkToolsPage />)
    
    const input = screen.getByPlaceholderText('输入IP地址或域名，如: google.com')
    const testButton = screen.getByText('测试连接')
    
    fireEvent.change(input, { target: { value: 'google.com' } })
    fireEvent.click(testButton)
    
    expect(screen.getByText('正在测试连接...')).toBeInTheDocument()
    
    // Wait for the simulated ping result
    await waitFor(() => {
      expect(screen.getByText(/google.com 的连接测试:/)).toBeInTheDocument()
      expect(screen.getByText(/响应时间:/)).toBeInTheDocument()
      expect(screen.getByText(/状态: 连接正常/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows error when testing connection without input', () => {
    const { toast } = require('sonner')
    render(<NetworkToolsPage />)
    
    const testButton = screen.getByText('测试连接')
    fireEvent.click(testButton)
    
    expect(toast.error).toHaveBeenCalledWith('请输入要测试的IP或域名')
  })

  it('provides quick test options', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('快速测试')).toBeInTheDocument()
    expect(screen.getByText('常用网络连接测试')).toBeInTheDocument()
    expect(screen.getByText('Google DNS')).toBeInTheDocument()
    expect(screen.getByText('Cloudflare DNS')).toBeInTheDocument()
    expect(screen.getByText('百度')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('executes quick test for Google DNS', async () => {
    render(<NetworkToolsPage />)
    
    const googleDnsButton = screen.getByText('Google DNS')
    fireEvent.click(googleDnsButton)
    
    // Verify the input field is populated correctly
    await waitFor(() => {
      const input = screen.getByPlaceholderText('输入IP地址或域名，如: google.com')
      expect(input).toHaveValue('8.8.8.8')
    })
  })

  it('executes quick test for Cloudflare DNS', async () => {
    render(<NetworkToolsPage />)
    
    const cloudflareButton = screen.getByText('Cloudflare DNS')
    fireEvent.click(cloudflareButton)
    
    // Verify input is populated correctly
    await waitFor(() => {
      const input = screen.getByPlaceholderText('输入IP地址或域名，如: google.com')
      expect(input).toHaveValue('1.1.1.1')
    })
  })

  it('executes quick test for Baidu', async () => {
    render(<NetworkToolsPage />)
    
    const baiduButton = screen.getByText('百度')
    fireEvent.click(baiduButton)
    
    // Verify input is populated correctly
    await waitFor(() => {
      const input = screen.getByPlaceholderText('输入IP地址或域名，如: google.com')
      expect(input).toHaveValue('baidu.com')
    })
  })

  it('executes quick test for GitHub', async () => {
    render(<NetworkToolsPage />)
    
    const githubButton = screen.getByText('GitHub')
    fireEvent.click(githubButton)
    
    // Verify input is populated correctly
    await waitFor(() => {
      const input = screen.getByPlaceholderText('输入IP地址或域名，如: google.com')
      expect(input).toHaveValue('github.com')
    })
  })

  it('shows usage instructions', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('使用说明')).toBeInTheDocument()
    expect(screen.getByText(/由于浏览器安全限制/)).toBeInTheDocument()
    expect(screen.getByText(/显示的结果为模拟数据/)).toBeInTheDocument()
  })

  it('lists available features', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('可用功能:')).toBeInTheDocument()
    expect(screen.getByText(/查看当前网络连接状态/)).toBeInTheDocument()
    expect(screen.getByText(/显示基本设备信息/)).toBeInTheDocument()
    expect(screen.getByText(/模拟连接测试/)).toBeInTheDocument()
    expect(screen.getByText(/网络类型检测/)).toBeInTheDocument()
  })

  it('handles network connection information', () => {
    // Mock network connection API
    Object.defineProperty(navigator, 'connection', {
      writable: true,
      value: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50
      }
    })

    render(<NetworkToolsPage />)
    
    expect(screen.getByText('网络类型')).toBeInTheDocument()
    expect(screen.getByText('连接速度')).toBeInTheDocument()
  })

  it('shows online status correctly', () => {
    render(<NetworkToolsPage />)
    
    const statusBadge = screen.getByText('在线')
    expect(statusBadge).toBeInTheDocument()
    expect(statusBadge.closest('[class*="bg-"]')).toHaveClass('bg-primary')
  })

  it('handles offline status', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    })

    render(<NetworkToolsPage />)
    
    const statusBadge = screen.getByText('离线')
    expect(statusBadge).toBeInTheDocument()
  })

  it('updates input field correctly', () => {
    render(<NetworkToolsPage />)
    
    const input = screen.getByPlaceholderText('输入IP地址或域名，如: google.com')
    fireEvent.change(input, { target: { value: 'example.com' } })
    
    expect(input).toHaveValue('example.com')
  })

  it('shows browser information correctly', () => {
    render(<NetworkToolsPage />)
    
    // Should show the first part of user agent
    expect(screen.getByText('Mozilla/5.0')).toBeInTheDocument()
  })
})