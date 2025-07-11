"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface RoadmapProps {
  tutorialStep?: number
}

export default function Component({ tutorialStep }: RoadmapProps) {
  const [isHovered, setIsHovered] = useState(false)

  const shouldAnimate = isHovered || tutorialStep === 3

  return (
    <div className="flex items-center justify-center p-2.5">
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 157.22 190.75"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer"
      >
        {/* Le chemin original - statique */}
        <path
          d="M135.44,46.71L45.97,22.56l-1.6-.43s0,.04,0,.06c0,4.05-1.09,7.85-2.99,11.12l1.7.45,84.31,22.2c9.56,2.17,16.77,9.88,18.38,19.67,1.6,9.77-2.62,19.01-11.01,24.1-3.99,2.42-7.73,3.55-11.78,3.55-3.53,0-6.93-.83-10.86-1.8l-.9-.22c-11.58-2.82-23.24-6.09-34.51-9.24-11.15-3.12-22.68-6.35-34.09-9.14-2.35-.39-4.68-.59-6.91-.59-18.8,0-29.74,13.67-32.24,27.21-2.3,12.47,1.92,29.67,21.35,37.17l83.7,22.68.47.13.4.27c.09.06.15.12.23.18-.03-.45-.05-.91-.05-1.37,0-3.62.87-7.04,2.41-10.06l-.18-.05c-11.46-3.23-23.2-6.32-34.55-9.3-16.7-4.39-33.97-8.93-50.76-14.04l-.24-.07-.23-.11c-7.82-3.91-12.37-11.88-11.87-20.79.49-8.84,5.88-16.2,14.05-19.2,2.65-.97,4.97-1.43,7.29-1.43,2.58,0,4.92.54,7.87,1.22l.52.12c12.19,2.8,24.42,6.29,36.24,9.67,11.64,3.33,23.68,6.77,35.61,9.52,2.28.36,4.53.55,6.72.55,19.46,0,31.1-14.19,34.01-28.25,2.67-12.9-1.26-30.98-21.03-39.63Z"
          fill="#000"
        />

        {/* Premier cercle - animé le long du chemin */}
        <motion.circle
          r="22.19"
          fill="#000"
          initial={{
            cx: 22.19,
            cy: 22.19,
          }}
          animate={
            shouldAnimate
              ? {
                  cx: [22.19, 145, 145, 15, 15, 131.76],
                  cy: [22.19, 50, 110, 80, 140, 168.56],
                }
              : {
                  cx: 22.19,
                  cy: 22.19,
                }
          }
          transition={{
            duration: 2,
            repeat: shouldAnimate ? Number.POSITIVE_INFINITY : 0,
            ease: "linear",
          }}
        />

        {/* Deuxième cercle - animé en sens inverse (reverse) */}
        <motion.circle
          r="22.19"
          fill="#000"
          initial={{
            cx: 131.76,
            cy: 168.56,
          }}
          animate={
            shouldAnimate
              ? {
                  cx: [131.76, 15, 15, 145, 145, 22.19],
                  cy: [168.56, 140, 80, 110, 50, 22.19],
                }
              : {
                  cx: 131.76,
                  cy: 168.56,
                }
          }
          transition={{
            duration: 2,
            repeat: shouldAnimate ? Number.POSITIVE_INFINITY : 0,
            ease: "linear",
          }}
        />
      </motion.svg>
    </div>
  )
}
