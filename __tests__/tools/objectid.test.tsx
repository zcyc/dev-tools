/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import ObjectIdRedirectPage from '../../app/[locale]/tools/objectid/page'

// Mock useRouter
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe('ObjectId Redirect Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders redirect message', () => {
    render(<ObjectIdRedirectPage />)
    
    expect(screen.getByText('正在重定向...')).toBeInTheDocument()
    expect(screen.getByText('ObjectId生成器已合并到ID生成器中，支持更多格式')).toBeInTheDocument()
  })

  it('redirects to advanced ID generator', () => {
    render(<ObjectIdRedirectPage />)
    
    expect(mockReplace).toHaveBeenCalledWith('/tools/id-generator')
  })
})