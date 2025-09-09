/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import CalculatorPage from '../../app/[locale]/tools/calculator/page'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

describe('Calculator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator page', () => {
    render(<CalculatorPage />)
    
    expect(screen.getAllByText('计算器')).toHaveLength(2) // Title appears twice
    expect(screen.getByText('基础数学计算工具')).toBeInTheDocument()
  })

  it('shows initial display of 0', () => {
    render(<CalculatorPage />)
    
    // Use a more specific selector for the display
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('0')
  })

  it('has all number buttons', () => {
    render(<CalculatorPage />)
    
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument()
    }
  })

  it('has all operation buttons', () => {
    render(<CalculatorPage />)
    
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
  })

  it('has utility buttons', () => {
    render(<CalculatorPage />)
    
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '⌫' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '.' })).toBeInTheDocument()
  })

  it('can input numbers', () => {
    render(<CalculatorPage />)
    
    const button5 = screen.getByRole('button', { name: '5' })
    fireEvent.click(button5)
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('5')
  })

  it('can perform addition', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('5')
  })

  it('can perform subtraction', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: '-' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('5')
  })

  it('can perform multiplication', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: '×' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('12')
  })

  it('can perform division', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: '÷' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '=' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('4')
  })

  it('can clear the display', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('5')
    
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(display).toHaveTextContent('0')
  })

  it('can handle decimal points', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: '.' }))
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('3.14')
  })

  it('can backspace single digits', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('123')
    
    fireEvent.click(screen.getByRole('button', { name: '⌫' }))
    expect(display).toHaveTextContent('12')
  })

  it('handles multiple number input correctly', () => {
    render(<CalculatorPage />)
    
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('100')
  })

  it('replaces 0 with first number input', () => {
    render(<CalculatorPage />)
    
    const display = document.querySelector('.bg-gray-900.text-white')
    expect(display).toHaveTextContent('0')
    
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    expect(display).toHaveTextContent('7')
    expect(display).not.toHaveTextContent('07')
  })
})