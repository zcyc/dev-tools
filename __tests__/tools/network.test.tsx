import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NetworkToolsPage from '../../app/[locale]/tools/network/page'

// Mock window.open
const mockWindowOpen = jest.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
})

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
})

describe('Network Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset sessionStorage mock
    mockSessionStorage.getItem.mockReturnValue(null)
    mockSessionStorage.setItem.mockClear()
  })

  it('renders network tools page correctly', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('网络工具')).toBeInTheDocument()
    expect(screen.getByText('专业的IP查询和网络诊断工具')).toBeInTheDocument()
  })

  it('shows redirect message and features', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('网络诊断工具')).toBeInTheDocument()
    expect(screen.getByText('正在为您跳转到专业的网络诊断平台...')).toBeInTheDocument()
    expect(screen.getByText('🌐 正在跳转到专业网络工具')).toBeInTheDocument()
    expect(screen.getByText('我们将为您打开 ip.skk.moe，这是一个功能完善的网络诊断平台')).toBeInTheDocument()
  })



  it('automatically redirects to ip.skk.moe on page load', () => {
    render(<NetworkToolsPage />)
    
    // Should automatically call window.open with the correct URL
    expect(mockWindowOpen).toHaveBeenCalledWith('https://ip.skk.moe/', '_blank')
    // Should set sessionStorage to prevent duplicate redirects
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('network-tool-redirected', 'true')
  })

  it('does not redirect if already redirected in session', () => {
    // Mock that redirect has already happened
    mockSessionStorage.getItem.mockReturnValue('true')
    
    render(<NetworkToolsPage />)
    
    // Should not call window.open again
    expect(mockWindowOpen).not.toHaveBeenCalled()
    // Should not set sessionStorage again
    expect(mockSessionStorage.setItem).not.toHaveBeenCalled()
  })



  it('shows helpful instruction text', () => {
    render(<NetworkToolsPage />)
    
    expect(screen.getByText('页面已自动为您打开网络诊断工具')).toBeInTheDocument()
  })
})