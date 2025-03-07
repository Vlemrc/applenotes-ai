"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const Dices = () => {
  const [isHovered, setIsHovered] = useState(false)

  const diceVariants = {
    idle: {
      rotate: 0,
      y: 0,
    },
    hovered: {
      rotate: [0, 100, 230, 540, 720],
      y: [0, 240, 0],
      transition: {
        rotate: { repeat: Number.POSITIVE_INFINITY, duration: 1.2, ease: "easeInOut" },
        y: { repeat: Number.POSITIVE_INFINITY, duration: 0.8, ease: "easeOut" },
      },
    },
  }

  const dice2Variants = {
    idle: {
      rotate: 0,
      y: 0,
    },
    hovered: {
      rotate: [0, 100, 230, 540, 720],
      y: [0, -150, 0],
      transition: {
        rotate: { repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" },
        y: { repeat: Number.POSITIVE_INFINITY, duration: 0.7, ease: "easeOut" },
      },
    },
  }

  return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-200 -200 800 800"
        height="44"
        width="44"
        className="translate-y-0.5 translate-x-0.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Dé 1 */}
        <motion.g variants={diceVariants} animate={isHovered ? "hovered" : "idle"}>
          <rect
            x="12.5"
            y="12.5"
            width="198.43"
            height="198.43"
            rx="18.64"
            ry="18.64"
            fill="#f2f2f2"
            stroke="#000"
            strokeWidth="25"
          />
          <circle cx="156.44" cy="66.98" r="19.48" fill="#000" />
          <circle cx="66.98" cy="156.44" r="19.48" fill="#000" />
        </motion.g>

        {/* Dé 2 */}
        <motion.g variants={dice2Variants} animate={isHovered ? "hovered" : "idle"}>
          <rect
            x="168.88"
            y="156.47"
            width="198.43"
            height="198.43"
            rx="18.64"
            ry="18.64"
            transform="translate(163.76 -99.79) rotate(30)"
            fill="#f2f2f2"
            stroke="#000"
            strokeWidth="25"
          />
          <circle cx="329.19" cy="239.31" r="19.48" fill="#000" />
          <circle cx="206.99" cy="272.06" r="19.48" fill="#000" />
          <circle cx="251.72" cy="194.58" r="19.48" fill="#000" />
          <circle cx="284.46" cy="316.79" r="19.48" fill="#000" />
        </motion.g>
      </motion.svg>
  )
}

export default Dices

