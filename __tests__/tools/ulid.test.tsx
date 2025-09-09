/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import ULIDRedirectPage from '../../app/[locale]/tools/ulid/page'

// Mock useRouter
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe('ULID Redirect Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders redirect message', () => {
    render(<ULIDRedirectPage />)
    
    expect(screen.getByText('正在重定向...')).toBeInTheDocument()
    expect(screen.getByText('ULID生成器已合并到ID生成器中，支持更多格式')).toBeInTheDocument()
  })

  it('redirects to advanced ID generator', () => {
    render(<ULIDRedirectPage />)
    
    expect(mockReplace).toHaveBeenCalledWith('/tools/id-generator')
  })
})