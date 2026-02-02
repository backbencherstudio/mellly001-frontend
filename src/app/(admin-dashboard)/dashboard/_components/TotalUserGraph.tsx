'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'

// Lightweight SVG Line Chart with gradient fill
export function LineChart({ selectedPeriod }: { selectedPeriod: string }) {
    const { months, dataPoints, currentMonthIndex } = useMemo(() => {
        // Set current date to September 05, 2025
        const currentDate = new Date(2025, 8, 5) // September is month 8 (0-indexed)
        const currentMonth = currentDate.getMonth() // 8 for September

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        // Mock data for each month (Oct 2024 to Sep 2025)
        const mockData = {
            'Oct': 50,   // Oct 2024
            'Nov': 80,   // Nov 2024
            'Dec': 60,   // Dec 2024
            'Jan': 180,  // Jan 2025
            'Feb': 400,  // Feb 2025
            'Mar': 280,  // Mar 2025
            'Apr': 180,  // Apr 2025
            'May': 450,  // May 2025
            'Jun': 380,  // Jun 2025
            'Jul': 390,  // Jul 2025
            'Aug': 180,  // Aug 2025
            'Sep': 280   // Sep 2025
        }

        let monthsArray = []
        let dataArray = []
        let currentMonthIndex = currentMonth

        if (selectedPeriod === 'Yearly') {
            // Create array starting from next month of previous year to current month
            for (let i = 0; i < 12; i++) {
                const monthIndex = (currentMonth + 1 + i) % 12
                const monthName = monthNames[monthIndex]
                monthsArray.push(monthName)

                // Include data for all months in the yearly view
                dataArray.push(mockData[monthName as keyof typeof mockData] || 0)
            }
        } else if (selectedPeriod === 'Monthly') {
            // Show only current month
            const currentMonthName = monthNames[currentMonth]
            monthsArray = [currentMonthName]
            dataArray = [mockData[currentMonthName as keyof typeof mockData] || 0]
            currentMonthIndex = 0
        } else if (selectedPeriod === 'Quarterly') {
            // Show last 3 months
            const startMonth = Math.max(0, currentMonth - 2)
            for (let i = startMonth; i <= currentMonth; i++) {
                const monthIndex = (currentMonth + 1 + i) % 12
                const monthName = monthNames[monthIndex]
                monthsArray.push(monthName)
                dataArray.push(mockData[monthName as keyof typeof mockData] || 0)
            }
            currentMonthIndex = monthsArray.length - 1
        }

        return {
            months: monthsArray,
            dataPoints: dataArray,
            currentMonthIndex: currentMonthIndex
        }
    }, [selectedPeriod])

    const chartWidth = 475
    const chartHeight = 224
    const maxValue = 500
    const padding = 20 // Add padding to prevent overflow

    const { pathData, areaPath } = useMemo(() => {
        // Calculate available width and height with padding
        const availableWidth = chartWidth - (padding * 2)
        const availableHeight = chartHeight - (padding * 2)

        // Show all data points for full chart
        const path = dataPoints
            .map((value, index) => {
                const x = padding + (index / (dataPoints.length - 1)) * availableWidth
                const y = padding + availableHeight - (value / maxValue) * availableHeight
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
            })
            .join(' ')

        return {
            pathData: path,
            areaPath: `${path} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`
        }
    }, [dataPoints])

    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const activeIndex = hoverIndex
    const activeMonth = activeIndex !== null ? months[activeIndex] : null
    const activeValue = activeIndex !== null ? dataPoints[activeIndex] : null

    // Calculate the year for the active month
    const currentDate = new Date(2025, 8, 5) // September 05, 2025
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const activeYear = activeIndex !== null ? (currentMonth + 1 + activeIndex >= 12 ? currentYear : currentYear - 1) : null

    return (
        <div className="relative w-full h-72 overflow-hidden">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-64 flex flex-col justify-between items-end pr-2 z-10">
                {[500, 400, 300, 200, 100, 0].map((label) => (
                    <div key={label} className="text-zinc-500 text-xs font-normal">{label}</div>
                ))}
            </div>

            {/* Chart area */}
            <div className="ml-6 relative">
                <svg
                    width={chartWidth}
                    height={chartHeight}
                    className="overflow-hidden"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#fef2f2" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    <path d={areaPath} fill="url(#chartGradient)" />
                    <path d={pathData} stroke="#dc2626" strokeWidth="2" fill="none" />

                    {dataPoints.map((value, index) => {
                        const availableWidth = chartWidth - (padding * 2)
                        const availableHeight = chartHeight - (padding * 2)
                        const x = padding + (index / (dataPoints.length - 1)) * availableWidth
                        const y = padding + availableHeight - (value / maxValue) * availableHeight
                        const isHovered = hoverIndex === index
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r={isHovered ? 8 : 6}
                                fill={isHovered ? "#dc2626" : "transparent"}
                                stroke={isHovered ? "#dc2626" : "transparent"}
                                strokeWidth={isHovered ? 2 : 0}
                                onMouseEnter={() => setHoverIndex(index)}
                                className="cursor-pointer transition-all duration-200"
                            />
                        )
                    })}
                </svg>

                {activeIndex !== null && activeMonth && activeValue !== null && activeYear && (
                    <div className="absolute top-2 right-4 bg-white rounded-lg shadow-lg p-2.5 border pointer-events-none z-20">
                        <div className="text-neutral-600 text-xs font-semibold mb-1.5">{activeMonth} {activeYear}</div>
                        <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">This Month</span>
                            <span className="text-gray-500">:</span>
                            <span className="text-neutral-600 font-medium">{activeValue}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-6 right-0 flex justify-between items-center z-10">
                {months.map((m, index) => {
                    // September is the last month in the array, so it should be highlighted
                    const isCurrentMonth = index === months.length - 1 // Last month is current month
                    return (
                        <div key={m} className={`text-xs font-normal ${isCurrentMonth ? 'text-red-600 font-medium' : 'text-zinc-500'}`}>{m}</div>
                    )
                })}
            </div>
        </div>
    )
}

type AnalyticsSectionProps = { onViewAll?: () => void }

export default function TotalUserGraph({ onViewAll }: AnalyticsSectionProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('Yearly')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const periodOptions = ['Yearly', 'Quarterly', 'Monthly']

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 max-w-full mx-auto">
            {/* New User Request Table card */}
            <div className="w-full h-96 p-4 bg-gray-50 rounded-xl shadow-[0px_4px_33px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="text-neutral-600 text-lg font-semibold">New User Request</div>
                    <button onClick={onViewAll} className="px-3.5 py-2 bg-white rounded-md border border-gray-200">
                        <span className="text-neutral-600 text-sm font-medium">View All</span>
                    </button>
                </div>

                {/* <div className="rounded overflow-hidden">
          <div className="max-h-[280px] overflow-y-auto">
            <AllUserRequestTable compact />
          </div>
        </div> */}
            </div>
        </div>
    )
}

