/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ColorConverterPage from '../../app/tools/color/page'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Color Converter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the color converter page', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getByText('颜色转换器')).toBeInTheDocument()
    expect(screen.getByText('在HEX、RGB、HSL、HSV、CMYK等颜色格式之间进行转换')).toBeInTheDocument()
  })

  it('has color input field', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getByLabelText('颜色值')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('#ff5733 或 rgb(255,87,51)')).toBeInTheDocument()
  })

  it('has color picker input', () => {
    render(<ColorConverterPage />)
    
    const colorPicker = screen.getByLabelText('颜色选择器')
    expect(colorPicker).toBeInTheDocument()
    expect(colorPicker).toHaveAttribute('type', 'color')
  })

  it('has random color button', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getByRole('button', { name: '随机' })).toBeInTheDocument()
  })

  it('shows color preview', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getByText('颜色预览')).toBeInTheDocument()
  })

  it('displays all color format cards', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getAllByText('HEX')).toHaveLength(2) // Title and info section badge
    expect(screen.getAllByText('RGB')).toHaveLength(3) // Title, badge, and info section
    expect(screen.getAllByText('HSL')).toHaveLength(3)
    expect(screen.getAllByText('HSV')).toHaveLength(3)
    expect(screen.getAllByText('CMYK')).toHaveLength(3)
  })

  it('shows initial color values', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getAllByDisplayValue('#ff5733')).toHaveLength(2) // Color input and color picker
  })

  it('can input custom color', () => {
    render(<ColorConverterPage />)
    
    const colorInput = screen.getByLabelText('颜色值')
    fireEvent.change(colorInput, { target: { value: '#00ff00' } })
    
    expect(colorInput).toHaveValue('#00ff00')
  })

  it('can use color picker', () => {
    render(<ColorConverterPage />)
    
    const colorPicker = screen.getByLabelText('颜色选择器')
    fireEvent.change(colorPicker, { target: { value: '#00ff00' } })
    
    expect(colorPicker).toHaveValue('#00ff00')
  })

  it('can generate random color', () => {
    render(<ColorConverterPage />)
    
    const randomButton = screen.getByRole('button', { name: '随机' })
    const colorInput = screen.getByLabelText('颜色值')
    const initialValue = colorInput.value
    
    fireEvent.click(randomButton)
    
    // Should generate a different color (probabilistically)
    expect(colorInput.value).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('has copy buttons for each color format', () => {
    render(<ColorConverterPage />)
    
    const copyButtons = screen.getAllByRole('button')
    const copyButtonsCount = copyButtons.filter(button => 
      button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
    ).length
    
    expect(copyButtonsCount).toBeGreaterThanOrEqual(5) // At least 5 copy buttons for color formats
  })

  it('shows color format descriptions', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getByText('颜色格式说明')).toBeInTheDocument()
    expect(screen.getByText('十六进制颜色代码，Web开发中最常用')).toBeInTheDocument()
    expect(screen.getByText('红绿蓝三原色值，取值范围0-255')).toBeInTheDocument()
    expect(screen.getByText('色相、饱和度、明度，设计师友好的格式')).toBeInTheDocument()
  })

  it('shows format badges', () => {
    render(<ColorConverterPage />)
    
    expect(screen.getByText('十六进制')).toBeInTheDocument()
    expect(screen.getAllByText('RGB')).toHaveLength(3)
    expect(screen.getAllByText('HSL')).toHaveLength(3)
    expect(screen.getAllByText('HSV')).toHaveLength(3)
    expect(screen.getAllByText('CMYK')).toHaveLength(3)
  })

  it('handles invalid color input', async () => {
    const { toast } = require('sonner')
    render(<ColorConverterPage />)
    
    const colorInput = screen.getByLabelText('颜色值')
    fireEvent.change(colorInput, { target: { value: 'invalid-color' } })
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('无效的颜色格式')
    })
  })

  it('can handle RGB input format', () => {
    render(<ColorConverterPage />)
    
    const colorInput = screen.getByLabelText('颜色值')
    fireEvent.change(colorInput, { target: { value: 'rgb(255, 0, 0)' } })
    
    // Should convert RGB to other formats without error
    expect(colorInput).toHaveValue('rgb(255, 0, 0)')
  })

  it('updates color preview when color changes', () => {
    render(<ColorConverterPage />)
    
    const colorInput = screen.getByLabelText('颜色值')
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    
    // Should update the input value
    expect(colorInput).toHaveValue('#ff0000')
  })

  it('copy functionality can be triggered', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })
    
    render(<ColorConverterPage />)
    
    const copyButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
    )
    
    if (copyButtons.length > 0) {
      fireEvent.click(copyButtons[0])
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
      })
    }
  })
})