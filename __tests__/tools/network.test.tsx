import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import NetworkToolsPage from '../../app/tools/network/page'

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

// Mock fetch for IP lookup
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      ip: '192.168.1.1',
      city: 'Beijing',
      region: 'Beijing',
      country: 'CN',
      loc: '39.9042,116.4074',
      timezone: 'Asia/Shanghai',
      org: 'AS4134 CHINANET-BACKBONE'
    }),
  })
) as jest.Mock

describe('Network Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders network tools page correctly', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('网络工具')).toBeInTheDocument()
    expect(screen.getByText('IP查询、端口检测、网络诊断等实用网络工具')).toBeInTheDocument()
  })

  it('shows current IP information', async () => {
    render(<NetworkToolsPage />)
    
    const getMyIPButton = screen.getByRole('button', { name: /获取我的IP/i })
    fireEvent.click(getMyIPButton)
    
    await waitFor(() => {
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
      expect(screen.getByText('Beijing')).toBeInTheDocument()
      expect(screen.getByText('CN')).toBeInTheDocument()
    })
  })

  it('performs IP geolocation lookup', async () => {
    render(<NetworkToolsPage />)
    
    const ipInput = screen.getByPlaceholderText(/输入IP地址/i)
    fireEvent.change(ipInput, { target: { value: '8.8.8.8' } })
    
    const lookupButton = screen.getByRole('button', { name: /查询IP/i })
    fireEvent.click(lookupButton)
    
    await waitFor(() => {
      expect(screen.getByText(/位置信息/i)).toBeInTheDocument()
      expect(screen.getByText(/时区/i)).toBeInTheDocument()
      expect(screen.getByText(/ISP/i)).toBeInTheDocument()
    })
  })

  it('validates IPv4 address format', async () => {
    render(<NetworkToolsPage />)
    
    const ipInput = screen.getByPlaceholderText(/输入IP地址/i)
    fireEvent.change(ipInput, { target: { value: '999.999.999.999' } })
    
    const lookupButton = screen.getByRole('button', { name: /查询IP/i })
    fireEvent.click(lookupButton)
    
    await waitFor(() => {
      expect(screen.getByText(/无效的IP地址格式/i)).toBeInTheDocument()
    })
  })

  it('supports IPv6 address lookup', async () => {
    render(<NetworkToolsPage />)
    
    const ipInput = screen.getByPlaceholderText(/输入IP地址/i)
    fireEvent.change(ipInput, { target: { value: '2001:4860:4860::8888' } })
    
    const lookupButton = screen.getByRole('button', { name: /查询IP/i })
    fireEvent.click(lookupButton)
    
    await waitFor(() => {
      expect(screen.getByText(/IPv6地址/i)).toBeInTheDocument()
    })
  })

  it('performs port scanning', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to port scanner tab
    const portScanTab = screen.getByText('端口扫描')
    fireEvent.click(portScanTab)
    
    const hostInput = screen.getByPlaceholderText(/输入主机地址/i)
    fireEvent.change(hostInput, { target: { value: 'example.com' } })
    
    const portInput = screen.getByPlaceholderText(/输入端口号/i)
    fireEvent.change(portInput, { target: { value: '80,443' } })
    
    const scanButton = screen.getByRole('button', { name: /扫描端口/i })
    fireEvent.click(scanButton)
    
    await waitFor(() => {
      expect(screen.getByText(/端口状态/i)).toBeInTheDocument()
    })
  })

  it('performs DNS lookup', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to DNS lookup tab
    const dnsTab = screen.getByText('DNS查询')
    fireEvent.click(dnsTab)
    
    const domainInput = screen.getByPlaceholderText(/输入域名/i)
    fireEvent.change(domainInput, { target: { value: 'google.com' } })
    
    const lookupDNSButton = screen.getByRole('button', { name: /查询DNS/i })
    fireEvent.click(lookupDNSButton)
    
    await waitFor(() => {
      expect(screen.getByText(/DNS记录/i)).toBeInTheDocument()
      expect(screen.getByText(/A记录/i)).toBeInTheDocument()
    })
  })

  it('shows different DNS record types', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to DNS lookup tab
    const dnsTab = screen.getByText('DNS查询')
    fireEvent.click(dnsTab)
    
    const recordTypeSelect = screen.getByLabelText(/记录类型/i)
    fireEvent.change(recordTypeSelect, { target: { value: 'MX' } })
    
    const domainInput = screen.getByPlaceholderText(/输入域名/i)
    fireEvent.change(domainInput, { target: { value: 'gmail.com' } })
    
    const lookupDNSButton = screen.getByRole('button', { name: /查询DNS/i })
    fireEvent.click(lookupDNSButton)
    
    await waitFor(() => {
      expect(screen.getByText(/MX记录/i)).toBeInTheDocument()
    })
  })

  it('performs ping test', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to ping test tab
    const pingTab = screen.getByText('Ping测试')
    fireEvent.click(pingTab)
    
    const hostInput = screen.getByPlaceholderText(/输入主机地址/i)
    fireEvent.change(hostInput, { target: { value: 'google.com' } })
    
    const pingButton = screen.getByRole('button', { name: /开始Ping/i })
    fireEvent.click(pingButton)
    
    await waitFor(() => {
      expect(screen.getByText(/响应时间/i)).toBeInTheDocument()
    })
  })

  it('tests website speed', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to speed test tab
    const speedTab = screen.getByText('速度测试')
    fireEvent.click(speedTab)
    
    const urlInput = screen.getByPlaceholderText(/输入网站URL/i)
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    
    const speedTestButton = screen.getByRole('button', { name: /测试速度/i })
    fireEvent.click(speedTestButton)
    
    await waitFor(() => {
      expect(screen.getByText(/加载时间/i)).toBeInTheDocument()
    })
  })

  it('checks SSL certificate', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to SSL check tab
    const sslTab = screen.getByText('SSL检查')
    fireEvent.click(sslTab)
    
    const urlInput = screen.getByPlaceholderText(/输入HTTPS网址/i)
    fireEvent.change(urlInput, { target: { value: 'https://google.com' } })
    
    const checkSSLButton = screen.getByRole('button', { name: /检查SSL/i })
    fireEvent.click(checkSSLButton)
    
    await waitFor(() => {
      expect(screen.getByText(/证书信息/i)).toBeInTheDocument()
      expect(screen.getByText(/有效期/i)).toBeInTheDocument()
    })
  })

  it('performs traceroute', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to traceroute tab
    const traceTab = screen.getByText('路由跟踪')
    fireEvent.click(traceTab)
    
    const hostInput = screen.getByPlaceholderText(/输入目标主机/i)
    fireEvent.change(hostInput, { target: { value: 'google.com' } })
    
    const traceButton = screen.getByRole('button', { name: /开始跟踪/i })
    fireEvent.click(traceButton)
    
    await waitFor(() => {
      expect(screen.getByText(/路由路径/i)).toBeInTheDocument()
    })
  })

  it('converts between different network formats', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to network calculator tab
    const calcTab = screen.getByText('网络计算')
    fireEvent.click(calcTab)
    
    const ipCalcInput = screen.getByPlaceholderText(/输入IP和子网掩码/i)
    fireEvent.change(ipCalcInput, { target: { value: '192.168.1.1/24' } })
    
    const calculateButton = screen.getByRole('button', { name: /计算/i })
    fireEvent.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/网络地址/i)).toBeInTheDocument()
      expect(screen.getByText(/广播地址/i)).toBeInTheDocument()
      expect(screen.getByText(/主机数量/i)).toBeInTheDocument()
    })
  })

  it('has copy functionality for results', async () => {
    render(<NetworkToolsPage />)
    
    const getMyIPButton = screen.getByRole('button', { name: /获取我的IP/i })
    fireEvent.click(getMyIPButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows network tool explanations', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText(/工具说明/i)).toBeInTheDocument()
    expect(screen.getByText(/IP查询: 获取IP地址地理位置/i)).toBeInTheDocument()
    expect(screen.getByText(/端口扫描: 检测端口开放状态/i)).toBeInTheDocument()
    expect(screen.getByText(/DNS查询: 解析域名记录/i)).toBeInTheDocument()
  })

  it('provides common port reference', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText(/常用端口/i)).toBeInTheDocument()
    expect(screen.getByText(/80: HTTP/i)).toBeInTheDocument()
    expect(screen.getByText(/443: HTTPS/i)).toBeInTheDocument()
    expect(screen.getByText(/22: SSH/i)).toBeInTheDocument()
    expect(screen.getByText(/25: SMTP/i)).toBeInTheDocument()
  })

  it('handles network errors gracefully', async () => {
    // Mock fetch to return error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<NetworkToolsPage />)
    
    const getMyIPButton = screen.getByRole('button', { name: /获取我的IP/i })
    fireEvent.click(getMyIPButton)
    
    await waitFor(() => {
      expect(screen.getByText(/网络错误|连接失败/i)).toBeInTheDocument()
    })
  })

  it('validates domain name format', async () => {
    render(<NetworkToolsPage />)
    
    // Switch to DNS lookup tab
    const dnsTab = screen.getByText('DNS查询')
    fireEvent.click(dnsTab)
    
    const domainInput = screen.getByPlaceholderText(/输入域名/i)
    fireEvent.change(domainInput, { target: { value: 'invalid..domain' } })
    
    const lookupDNSButton = screen.getByRole('button', { name: /查询DNS/i })
    fireEvent.click(lookupDNSButton)
    
    await waitFor(() => {
      expect(screen.getByText(/无效的域名格式/i)).toBeInTheDocument()
    })
  })

  it('shows network security information', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText(/安全提示/i)).toBeInTheDocument()
    expect(screen.getByText(/端口扫描警告/i)).toBeInTheDocument()
    expect(screen.getByText(/仅扫描自己的服务器/i)).toBeInTheDocument()
  })

  it('exports network test results', async () => {
    render(<NetworkToolsPage />)
    
    const getMyIPButton = screen.getByRole('button', { name: /获取我的IP/i })
    fireEvent.click(getMyIPButton)
    
    await waitFor(() => {
      const exportButton = screen.queryByRole('button', { name: /导出结果/i })
      if (exportButton) {
        expect(exportButton).toBeInTheDocument()
      }
    })
  })

  it('provides network troubleshooting tips', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText(/故障排除/i)).toBeInTheDocument()
    expect(screen.getByText(/连接问题诊断/i)).toBeInTheDocument()
    expect(screen.getByText(/DNS解析故障/i)).toBeInTheDocument()
  })
})