"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface FlashCardProps {
  tutorialStep?: number
}

export default function FlashCard({ tutorialStep }: FlashCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const shouldAnimate = isHovered || tutorialStep === 2

  const cardVariants = {
    initial: (i: number) => ({
      rotate: i === 0 ? -10 : i === 2 ? 10 : 0,
      x: 100,
      y: 50,
    }),
    hovered: (i: number) => ({
      rotate: i === 1 ? 20 : i === 2 ? -20 : 0,
      x: i === 0 ? -50 : i === 1 ? 250 : 100,
      y: i === 2 ? 0 : 50,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    }),
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-150 -50 800 521.24"
      height="42"
      width="42"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <defs>
        <style>{`.cls-1 { fill: #f2f2f2; stroke: #1d1d1b; stroke-miterlimit: 10; stroke-width: 25px; }`}</style>
      </defs>
      <motion.g variants={cardVariants} initial="initial" animate={shouldAnimate ? "hovered" : "initial"} custom={0}>
        <rect
          className="cls-1"
          x="60.16"
          y="34.86"
          width="225.76"
          height="351.52"
          rx="20.06"
          ry="20.06"
          transform="translate(-61.6 71.88) rotate(-20)"
        />
        <path d="M158.11,170.85c.73-.44,1.53-.39,2.27,0,1.29.67,3.33,3.11,4.58,4.2,8.81,7.62,18.48,13.94,29.06,18.8,2.8,1.59,7.24,2.37,9.88,3.85,1.01.57,1.47,1.38,1.17,2.54-.36,1.38-2.38,4.21-3.14,5.69-6.99,13.49-11.49,28.12-13.03,43.27-.41,1.37-1.96,1.93-3.17,1.15-1.76-1.14-4.34-4.03-6.13-5.54-8.45-7.09-18.18-13.35-28.27-17.81-2.37-1.05-7.67-2.53-9.45-3.76-1.02-.7-1.16-1.57-.74-2.69.58-1.53,2.33-3.90,3.17-5.52,6.04-11.64,10.01-23.91,12.1-36.85.24-1.5.34-5.48.99-6.54.13-.22.51-.63.72-.76Z" />
      </motion.g>
      <motion.g variants={cardVariants} initial="initial" animate={shouldAnimate ? "hovered" : "initial"} custom={1}>
        <rect className="cls-1" x="60.16" y="34.86" width="225.76" height="351.52" rx="20.06" ry="20.06" />
        <path d="M215.57,212.76v3.16c-.26,1.14-.34,2.31-.61,3.46-1.59,6.85-7.04,12.73-13.59,15.15-8.52,3.15-17.76.94-24.18-5.32,2.81,10.05,10.26,17.8,20.11,21.18.47.16,1.46.16,1.5.67l-.34,2.08h-50.51l-.33-2.32c10.79-2.5,19.98-10.26,22.09-21.44-7.55,8.31-19.95,10.22-29.46,3.96s-12.59-18.46-6.96-28.33c3.58-6.26,9.82-10.11,16.91-11.18-2.87-15.82,11.29-28.56,26.82-25.18,9.41,2.05,16.64,10.44,17.12,20.1.07,1.32-.15,2.61-.1,3.92l4.08.57c7.77,1.65,14.32,7.52,16.57,15.17l.88,4.36Z" />
      </motion.g>
      <motion.g variants={cardVariants} initial="initial" animate={shouldAnimate ? "hovered" : "initial"} custom={2}>
        <rect
          className="cls-1"
          x="60.16"
          y="34.86"
          width="225.76"
          height="351.52"
          rx="20.06"
          ry="20.06"
          transform="translate(82.47 -46.48) rotate(20)"
        />
        <path d="M147.24,234.4c1.71-.27,3.43-.32,5.13-.7,5.87-1.29,11.24-5.11,15.24-9.51-4.72,2.68-10.25,3.99-15.65,2.79-13.13-2.92-19.81-18.7-12.59-30.07,5.05-7.96,20.25-12.6,28.73-16.38,7.95-3.54,15.8-7.47,22.78-12.7.31.03.85,2.92,1,3.43,2.03,7.15,5.09,14.12,8.34,20.79,4.07,8.35,12.82,21.89,11.58,31.22-1.21,9.07-9.37,16.44-18.41,17.07-9.72.67-17.6-5.4-20.77-14.32.18,5.71,1.75,11.7,5.06,16.41,1.19,1.69,2.6,2.99,3.98,4.51l-1.45,3.99-34.41-12.53,1.45-3.99Z" />
      </motion.g>
    </motion.svg>
  )
}
