/**
 * Cron Expression Parser and Descriptor
 * Converts cron expressions to human-readable descriptions
 */

export interface CronExpression {
  minute: string
  hour: string
  day: string
  month: string
  weekday: string
}

export interface CronDescription {
  text: string
  type: 'everyMinute' | 'everyHour' | 'everyDay' | 'everyWeek' | 'everyMonth' | 'custom'
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const WEEKDAYS_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const MONTHS_ZH = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/**
 * Parse a cron expression string into individual components
 */
export function parseCronExpression(expression: string): CronExpression {
  const parts = expression.trim().split(/\s+/)
  
  if (parts.length !== 5) {
    throw new Error('Invalid cron expression format')
  }

  return {
    minute: parts[0],
    hour: parts[1],
    day: parts[2],
    month: parts[3],
    weekday: parts[4]
  }
}

/**
 * Generate human-readable description from cron expression
 */
export function describeCronExpression(expression: string, locale: 'en' | 'zh' = 'en'): CronDescription {
  try {
    const cron = parseCronExpression(expression)
    return generateDescription(cron, locale)
  } catch {
    return {
      text: locale === 'zh' ? '无效的 Cron 表达式' : 'Invalid cron expression',
      type: 'custom'
    }
  }
}

/**
 * Generate description from parsed cron components
 */
function generateDescription(cron: CronExpression, locale: 'en' | 'zh'): CronDescription {
  const { minute, hour, day, month, weekday } = cron

  // Every minute
  if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return {
      text: locale === 'zh' ? '每分钟' : 'Every minute',
      type: 'everyMinute'
    }
  }

  // Every hour at minute 0
  if (minute === '0' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return {
      text: locale === 'zh' ? '每小时' : 'Every hour',
      type: 'everyHour'
    }
  }

  // Every day at midnight
  if (minute === '0' && hour === '0' && day === '*' && month === '*' && weekday === '*') {
    return {
      text: locale === 'zh' ? '每天午夜 (00:00)' : 'Every day at midnight (00:00)',
      type: 'everyDay'
    }
  }

  // Every Sunday at midnight
  if (minute === '0' && hour === '0' && day === '*' && month === '*' && weekday === '0') {
    return {
      text: locale === 'zh' ? '每周日午夜 (00:00)' : 'Every Sunday at midnight (00:00)',
      type: 'everyWeek'
    }
  }

  // First day of every month at midnight
  if (minute === '0' && hour === '0' && day === '1' && month === '*' && weekday === '*') {
    return {
      text: locale === 'zh' ? '每月1日午夜 (00:00)' : 'Every 1st day of the month at midnight (00:00)',
      type: 'everyMonth'
    }
  }

  // Build custom description
  return {
    text: buildCustomDescription(cron, locale),
    type: 'custom'
  }
}

/**
 * Build a custom description for complex cron expressions
 */
function buildCustomDescription(cron: CronExpression, locale: 'en' | 'zh'): string {
  const { minute, hour, day, month, weekday } = cron
  const parts: string[] = []

  // Time part (hour:minute)
  const timeStr = buildTimeDescription(minute, hour, locale)
  
  // Day/weekday part
  const dayStr = buildDayDescription(day, weekday, locale)
  
  // Month part
  const monthStr = buildMonthDescription(month, locale)

  if (locale === 'zh') {
    if (monthStr) parts.push(monthStr)
    if (dayStr) parts.push(dayStr)
    parts.push(timeStr)
    return parts.join('')
  } else {
    parts.push('At')
    parts.push(timeStr)
    if (dayStr) parts.push(`on ${dayStr}`)
    if (monthStr) parts.push(`in ${monthStr}`)
    return parts.join(' ')
  }
}

/**
 * Build time description (hour:minute)
 */
function buildTimeDescription(minute: string, hour: string, locale: 'en' | 'zh'): string {
  if (minute === '*' && hour === '*') {
    return locale === 'zh' ? '每分钟' : 'every minute'
  }

  if (minute === '0' && hour === '*') {
    return locale === 'zh' ? '每小时' : 'minute 0 of every hour'
  }

  if (hour === '*') {
    if (minute === '*') {
      return locale === 'zh' ? '每分钟' : 'every minute'
    }
    if (minute.includes('/')) {
      const interval = minute.split('/')[1]
      return locale === 'zh' ? `每${interval}分钟` : `every ${interval} minutes`
    }
    return locale === 'zh' ? `每小时的第${minute}分钟` : `minute ${minute} of every hour`
  }

  if (minute === '*') {
    if (hour.includes('/')) {
      const interval = hour.split('/')[1]
      return locale === 'zh' ? `每${interval}小时` : `every ${interval} hours`
    }
    return locale === 'zh' ? `${hour}:00-${hour}:59` : `every minute of hour ${hour}`
  }

  // Specific time
  const hourNum = parseInt(hour)
  const minuteNum = parseInt(minute)
  
  if (!isNaN(hourNum) && !isNaN(minuteNum)) {
    const timeFormat = `${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`
    return locale === 'zh' ? timeFormat : timeFormat
  }

  return locale === 'zh' ? `${hour}:${minute}` : `${hour}:${minute}`
}

/**
 * Build day description
 */
function buildDayDescription(day: string, weekday: string, locale: 'en' | 'zh'): string {
  if (weekday !== '*') {
    return buildWeekdayDescription(weekday, locale)
  }

  if (day === '*') {
    return ''
  }

  if (day === '1') {
    return locale === 'zh' ? '每月1日' : '1st day of the month'
  }

  if (day.includes('/')) {
    const interval = day.split('/')[1]
    return locale === 'zh' ? `每${interval}天` : `every ${interval} days`
  }

  if (day.includes('-')) {
    const [start, end] = day.split('-')
    return locale === 'zh' ? `每月${start}-${end}日` : `day ${start} to ${end} of the month`
  }

  return locale === 'zh' ? `每月${day}日` : `day ${day} of the month`
}

/**
 * Build weekday description
 */
function buildWeekdayDescription(weekday: string, locale: 'en' | 'zh'): string {
  if (weekday === '*') {
    return ''
  }

  const weekdays = locale === 'zh' ? WEEKDAYS_ZH : WEEKDAYS
  
  if (weekday === '1-5') {
    return locale === 'zh' ? '工作日' : 'weekdays (Monday to Friday)'
  }

  if (weekday === '6,0' || weekday === '0,6') {
    return locale === 'zh' ? '周末' : 'weekends'
  }

  if (weekday.includes(',')) {
    const days = weekday.split(',').map(d => {
      const dayNum = parseInt(d)
      return weekdays[dayNum] || d
    })
    return locale === 'zh' ? days.join('、') : days.join(', ')
  }

  if (weekday.includes('-')) {
    const [start, end] = weekday.split('-')
    const startDay = weekdays[parseInt(start)] || start
    const endDay = weekdays[parseInt(end)] || end
    return locale === 'zh' ? `${startDay}到${endDay}` : `${startDay} to ${endDay}`
  }

  const dayNum = parseInt(weekday)
  return weekdays[dayNum] || weekday
}

/**
 * Build month description
 */
function buildMonthDescription(month: string, locale: 'en' | 'zh'): string {
  if (month === '*') {
    return ''
  }

  const months = locale === 'zh' ? MONTHS_ZH : MONTHS

  if (month.includes(',')) {
    const monthList = month.split(',').map(m => {
      const monthNum = parseInt(m)
      return months[monthNum - 1] || m
    })
    return locale === 'zh' ? monthList.join('、') : monthList.join(', ')
  }

  if (month.includes('-')) {
    const [start, end] = month.split('-')
    const startMonth = months[parseInt(start) - 1] || start
    const endMonth = months[parseInt(end) - 1] || end
    return locale === 'zh' ? `${startMonth}到${endMonth}` : `${startMonth} to ${endMonth}`
  }

  const monthNum = parseInt(month)
  return months[monthNum - 1] || month
}

/**
 * Predefined cron presets
 */
export const CRON_PRESETS = {
  everyMinute: '* * * * *',
  everyHour: '0 * * * *',
  everyDay: '0 0 * * *',
  everyWeek: '0 0 * * 0',
  everyMonth: '0 0 1 * *',
  everyYear: '0 0 1 1 *',
  workdaysAt9: '0 9 * * 1-5',
  every6Hours: '0 */6 * * *',
  twiceDaily: '0 6,18 * * *',
  weeklyBackup: '0 2 * * 0'
}

/**
 * Validate cron expression components
 */
export function validateCronComponent(value: string, type: 'minute' | 'hour' | 'day' | 'month' | 'weekday'): boolean {
  if (value === '*') return true
  
  const ranges = {
    minute: [0, 59],
    hour: [0, 23],
    day: [1, 31],
    month: [1, 12],
    weekday: [0, 7]
  }
  
  const [min, max] = ranges[type]
  
  // Handle simple numbers
  const num = parseInt(value)
  if (!isNaN(num)) {
    return num >= min && num <= max
  }
  
  // Handle ranges (e.g., "1-5")
  if (value.includes('-')) {
    const [start, end] = value.split('-').map(v => parseInt(v))
    return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end
  }
  
  // Handle intervals (e.g., "*/5")
  if (value.includes('/')) {
    const [base, interval] = value.split('/')
    if (base === '*') return !isNaN(parseInt(interval))
    const baseNum = parseInt(base)
    const intervalNum = parseInt(interval)
    return !isNaN(baseNum) && !isNaN(intervalNum) && baseNum >= min && baseNum <= max
  }
  
  // Handle lists (e.g., "1,3,5")
  if (value.includes(',')) {
    const items = value.split(',').map(v => parseInt(v.trim()))
    return items.every(item => !isNaN(item) && item >= min && item <= max)
  }
  
  return false
}