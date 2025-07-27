'use client';

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HoverEffectProps {
  items: Array<{
    title: string
    description: string
    link: string
    icon: React.ComponentType<{ className?: string }>
  }>
  className?: string
}

export const HoverEffect: React.FC<HoverEffectProps> = ({ items, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="relative group block p-6 h-full w-full bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors duration-200"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 