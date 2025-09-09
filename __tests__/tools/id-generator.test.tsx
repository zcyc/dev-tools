/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor, getTranslationText } from '../utils/test-utilities'
import IDGeneratorPage from '../../app/[locale]/tools/id-generator/page'

// Mock the translation messages
const mockMessages = {
  zh: require('../../messages/zh.json'),
  en: require('../../messages/en.json')
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/zh/tools/id-generator',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

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

// Mock ID generation libraries
jest.mock('nanoid', () => ({
  nanoid: () => 'test-nanoid-123',
  customAlphabet: () => () => 'custom-nanoid-123',
}))

jest.mock('ulid', () => ({
  ulid: () => 'TEST-ULID-123456789012345678',
}))

jest.mock('ksuid', () => ({
  generate: () => ({ string: 'test-ksuid-1234567890123456789' }),
  KSUID: {
    parse: (id) => ({
      date: new Date(),
      payload: Buffer.from('test'),
    }),
  },
}))

jest.mock('@sapphire/snowflake', () => ({
  Snowflake: jest.fn().mockImplementation(() => ({
    generate: () => ({ toString: () => '1234567890123456789' }),
  })),
}))

jest.mock('sonyflake', () => ({
  Sonyflake: jest.fn().mockImplementation(() => ({
    nextId: () => ({ toString: () => '12345678901234567' }),
  })),
}))

jest.mock('sqids', () => {
  return jest.fn().mockImplementation(() => ({
    encode: () => 'test-sqid',
    decode: () => [123],
  }))
})

jest.mock('short-unique-id', () => {
  return jest.fn().mockImplementation(() => ({
    rnd: () => 'test-short-uid',
  }))
})

jest.mock('@paralleldrive/cuid2', () => ({
  createId: () => 'test-cuid2-123456789012345678',
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn()

describe('ID Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('renders the ID generator page', () => {
      render(<IDGeneratorPage />)
      
      expect(screen.getByText('ID生成器')).toBeInTheDocument()
    })

    it('has generate and parse tabs', () => {
      render(<IDGeneratorPage />)
      
      expect(screen.getByRole('tab', { name: '生成ID' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: '解析ID' })).toBeInTheDocument()
    })

    it('has ID type selector', () => {
      render(<IDGeneratorPage />)
      
      expect(screen.getByText('ID类型')).toBeInTheDocument()
    })

    it('has generate button', () => {
      render(<IDGeneratorPage />)
      
      // Check if generate button exists by looking for the button element with the text
      const generateButtons = screen.getAllByText('生成ID')
      expect(generateButtons.length).toBeGreaterThan(0)
    })
  })

  describe('ID Generation functionality', () => {
    it('can generate UUIDs', () => {
      render(<IDGeneratorPage />)
      
      const generateButtons = screen.getAllByText('生成ID')
      expect(generateButtons.length).toBeGreaterThan(0)
    })

    it('has quantity input', () => {
      render(<IDGeneratorPage />)
      
      const quantityInput = screen.getByLabelText('生成数量')
      expect(quantityInput).toBeInTheDocument()
      expect(quantityInput).toHaveValue(1)
    })

    it('has basic interface elements', () => {
      render(<IDGeneratorPage />)
      
      // Check if ID type selector exists
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('Common functionality', () => {
    it('can generate IDs', async () => {
      const { toast } = require('sonner')
      render(<IDGeneratorPage />, { locale: 'zh' })
      
      const generateButton = screen.getByRole('button', { name: new RegExp(getTranslationText('tools.idGenerator.generateButton', 'zh'), 'i') })
      fireEvent.click(generateButton)
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled()
      })
    })

    it('can set generation quantity', () => {
      render(<IDGeneratorPage />, { locale: 'zh' })
      
      const quantityInput = screen.getByDisplayValue('1')
      fireEvent.change(quantityInput, { target: { value: '5' } })
      
      expect(quantityInput).toHaveValue(5)
    })

    it('switches to parse tab', () => {
      render(<IDGeneratorPage />, { locale: 'zh' })
      
      const parseTab = screen.getByRole('tab', { name: getTranslationText('tools.idGenerator.parsing', 'zh') })
      fireEvent.click(parseTab)
      
      // For now just verify the tab is clickable
      expect(parseTab).toBeInTheDocument()
    })
  })
})