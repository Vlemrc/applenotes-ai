"use client"

import { motion } from "framer-motion"

export default function Trash({color, height, width}) {
  return (
    <div>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 15 18"
        width={width}
        height={height}
        initial="initial"
        whileHover="hover"
      >
        <motion.g
          variants={{
            initial: { rotate: 0, y: 0 },
            hover: { rotate: -10, y: -1 },
          }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <motion.line 
            x1=".5" 
            y1="2.68" 
            x2="10.65" 
            y2="2.68"
            fill="none"
            stroke={color || "#1d1d1b"}
            strokeLinecap="round"
            strokeMiterlimit="10"
          />
          <motion.path
            d="M4.37.5h2.39c.57,0,1.03.46,1.03,1.03v1.14H3.35v-1.16c0-.56.46-1.02,1.02-1.02Z"
            fill="none"
            stroke={color || "#1d1d1b"}
            strokeMiterlimit="10"
          />
        </motion.g>
        <motion.g
          variants={{
            initial: { scaleY: 1 },
            hover: { scaleY: 1.02 },
          }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <motion.path
            d="M9.6,2.72l-.39,8.25c-.12,1.21-.59,2.01-2.01,2.01h-3.21c-1.71,0-1.88-1.04-2.03-2.03l-.4-8.23"
            fill="none"
            stroke={color || "#1d1d1b"}
            strokeMiterlimit="10"
          />
          <motion.line
            x1="3.62"
            y1="4.04"
            x2="3.62"
            y2="11.24"
            fill="none"
            stroke={color || "#1d1d1b"}
            strokeWidth="0.75"
            strokeMiterlimit="10"
            variants={{
              initial: { pathLength: 1 },
              hover: { pathLength: 0 },
            }}
            transition={{ delay: 0.1, duration: 0.5 }}
          />
          <motion.line
            x1="5.6"
            y1="4.04"
            x2="5.6"
            y2="11.24"
            fill="none"
            stroke={color || "#1d1d1b"}
            strokeWidth="0.75"
            strokeMiterlimit="10"
            variants={{
              initial: { pathLength: 1 },
              hover: { pathLength: 0 },
            }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.line
            x1="7.57"
            y1="4.04"
            x2="7.57"
            y2="11.24"
            fill="none"
            stroke={color || "#1d1d1b"}
            strokeWidth="0.75"
            strokeMiterlimit="10"
            variants={{
              initial: { pathLength: 1 },
              hover: { pathLength: 0 },
            }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.g>
      </motion.svg>
    </div>
  )
}