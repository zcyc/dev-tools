/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import UUIDRedirectPage from '../../app/tools/uuid/page'

// Mock useRouter
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe('UUID Redirect Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders redirect message', () => {
    render(<UUIDRedirectPage />)
    
    expect(screen.getByText('正在重定向...')).toBeInTheDocument()
    expect(screen.getByText('UUID生成器已升级为ID生成器，支持更多格式')).toBeInTheDocument()
  })

  it('redirects to advanced ID generator', () => {
    render(<UUIDRedirectPage />)
    
    expect(mockReplace).toHaveBeenCalledWith('/tools/id-generator')
  })
})