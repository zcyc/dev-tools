/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import RandomIdRedirectPage from '../../app/[locale]/tools/random-id/page'

// Mock useRouter
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe('Random ID Redirect Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders redirect message', () => {
    render(<RandomIdRedirectPage />)
    
    expect(screen.getByText('正在重定向...')).toBeInTheDocument()
    expect(screen.getByText('随机ID生成器已合并到ID生成器中，支持更多格式')).toBeInTheDocument()
  })

  it('redirects to advanced ID generator', () => {
    render(<RandomIdRedirectPage />)
    
    expect(mockReplace).toHaveBeenCalledWith('/tools/id-generator')
  })
})