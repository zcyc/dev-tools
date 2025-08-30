'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator as CalcIcon } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="计算器"
        description="基础数学计算工具"
        icon="Calculator"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalcIcon className="h-5 w-5" />
                计算器
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display */}
              <div className="bg-gray-900 text-white p-4 rounded text-right text-2xl font-mono min-h-[60px] flex items-center justify-end">
                {display}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <Button variant="outline" onClick={clear} className="col-span-2">
                  Clear
                </Button>
                <Button variant="outline" onClick={() => setDisplay(display.slice(0, -1) || '0')}>
                  ⌫
                </Button>
                <Button variant="outline" onClick={() => inputOperation('÷')}>
                  ÷
                </Button>

                {/* Row 2 */}
                <Button variant="outline" onClick={() => inputNumber('7')}>7</Button>
                <Button variant="outline" onClick={() => inputNumber('8')}>8</Button>
                <Button variant="outline" onClick={() => inputNumber('9')}>9</Button>
                <Button variant="outline" onClick={() => inputOperation('×')}>×</Button>

                {/* Row 3 */}
                <Button variant="outline" onClick={() => inputNumber('4')}>4</Button>
                <Button variant="outline" onClick={() => inputNumber('5')}>5</Button>
                <Button variant="outline" onClick={() => inputNumber('6')}>6</Button>
                <Button variant="outline" onClick={() => inputOperation('-')}>-</Button>

                {/* Row 4 */}
                <Button variant="outline" onClick={() => inputNumber('1')}>1</Button>
                <Button variant="outline" onClick={() => inputNumber('2')}>2</Button>
                <Button variant="outline" onClick={() => inputNumber('3')}>3</Button>
                <Button variant="outline" onClick={() => inputOperation('+')} className="row-span-2">
                  +
                </Button>

                {/* Row 5 */}
                <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2">
                  0
                </Button>
                <Button variant="outline" onClick={inputDecimal}>.</Button>
                
                {/* Equals button (overlapping with +) */}
                <Button onClick={performCalculation} className="bg-blue-600 hover:bg-blue-700">
                  =
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}