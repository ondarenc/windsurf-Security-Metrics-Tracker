import React from 'react'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import clsx from 'clsx'

const MetricCard = ({ title, value, change, trend, unit = '', icon: Icon }) => {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'
  const isNeutral = trend === 'stable'

  const changeColor = clsx({
    'text-green-600': isPositive,
    'text-red-600': isNegative,
    'text-gray-600': isNeutral
  })

  const changeIcon = clsx({
    'text-green-600': isPositive,
    'text-red-600': isNegative,
    'text-gray-600': isNeutral
  })

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>
      
      <div className="flex items-baseline">
        <div className="metric-value">
          {value}
          {unit && <span className="text-lg font-normal text-gray-600 ml-1">{unit}</span>}
        </div>
      </div>
      
      <div className={clsx('metric-change flex items-center gap-1', changeColor)}>
        {isPositive && <ArrowUp className="w-4 h-4" />}
        {isNegative && <ArrowDown className="w-4 h-4" />}
        {isNeutral && <Minus className="w-4 h-4" />}
        <span>{Math.abs(change)}% from last period</span>
      </div>
    </div>
  )
}

export default MetricCard
