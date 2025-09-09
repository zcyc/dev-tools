# Multi-language Test Updates Summary

## Completed Updates

### 1. Test Utilities Created
- `__tests__/utils/test-utils.tsx`: Common utilities for multi-language testing
- Mock translation functions
- Locale-specific rendering helpers
- Support for both Chinese (`zh`) and English (`en`) locales

### 2. ID Generator Test Updated
- `__tests__/tools/id-generator.test.tsx`: Updated for multi-language support
- Fixed import paths for new `[locale]` structure
- Added locale-specific test scenarios
- Implemented dynamic translation text expectations

## Status

✅ **Infrastructure Complete**: Test utilities and framework ready
✅ **Sample Implementation**: ID generator test updated as template
🔄 **In Progress**: Other tool tests need similar updates

## Required Updates for Remaining Tests

All test files in `__tests__/tools/` need the following updates:

### 1. Import Path Changes
```typescript
// OLD:
import ToolPage from '../../app/tools/[tool-name]/page'

// NEW:
import ToolPage from '../../app/[locale]/tools/[tool-name]/page'
```

### 2. Add Multi-language Test Structure
```typescript
import { render, screen, getTranslationText } from '../utils/test-utils'

describe('Tool Name', () => {
  describe('Chinese locale', () => {
    it('renders in Chinese', () => {
      render(<ToolPage />, { locale: 'zh' })
      // Test Chinese-specific content
    })
  })
  
  describe('English locale', () => {
    it('renders in English', () => {
      render(<ToolPage />, { locale: 'en' })
      // Test English-specific content
    })
  })
})
```

### 3. Mock Setup
```typescript
// Mock next/navigation for locale detection
jest.mock('next/navigation', () => ({
  usePathname: () => '/zh/tools/[tool-name]',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))
```

### 4. Dynamic Text Expectations
```typescript
// OLD:
expect(screen.getByText('硬编码中文')).toBeInTheDocument()

// NEW:
expect(screen.getByText(getTranslationText('tools.toolName.key', 'zh'))).toBeInTheDocument()
```

## Tools Requiring Updates

- [ ] base64.test.tsx
- [ ] bcrypt.test.tsx  
- [ ] calculator.test.tsx
- [ ] case-converter.test.tsx
- [ ] color.test.tsx
- [ ] crontab.test.tsx
- [ ] datetime.test.tsx
- [ ] encrypt.test.tsx
- [ ] format.test.tsx
- [ ] git-cheatsheet.test.tsx
- [ ] hash.test.tsx
- [ ] hmac.test.tsx
- [ ] html-entities.test.tsx
- [ ] json-formatter.test.tsx
- [ ] jwt.test.tsx
- [ ] lorem-ipsum.test.tsx
- [ ] network.test.tsx
- [ ] number-base.test.tsx
- [ ] objectid.test.tsx
- [ ] otp.test.tsx
- [ ] qr-code.test.tsx
- [ ] random-id.test.tsx
- [ ] regex.test.tsx
- [ ] rsa.test.tsx
- [ ] sql-formatter.test.tsx
- [ ] text-diff.test.tsx
- [ ] text-stats.test.tsx
- [ ] token.test.tsx
- [ ] ulid.test.tsx
- [ ] url.test.tsx
- [ ] user-agent.test.tsx
- [ ] uuid.test.tsx
- [ ] wifi-qr.test.tsx

## Implementation Priority

1. **High Priority**: Core functionality tests (id-generator ✅, base64, hash, encrypt)
2. **Medium Priority**: Converter tools (datetime, number-base, color, format)  
3. **Low Priority**: Utility tools (calculator, network, qr-code)

## Testing Commands

```bash
# Test specific tool
npm test -- __tests__/tools/[tool-name].test.tsx

# Test all tools
npm test -- __tests__/tools/

# Test all with coverage
npm test -- __tests__/tools/ --coverage
```

## Notes

- Manual translation system is working in production
- Test framework ready for multi-language scenarios
- Template established with ID generator test
- Remaining tests need individual attention for tool-specific translations
- Consider batch updating using sed/awk scripts for repetitive changes