"use client"

import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ParagraphProps {
  content: string
}

const Paragraph = ({ content }: ParagraphProps) => {
  const contentSplit = content.split(" ")
  const [isVisible, setIsVisible] = useState(false)
  const paragraphRef = useRef(null)

  // Effet pour les délais de transition
  useEffect(() => {
    const paragraph = paragraphRef.current

    if (paragraph) {
      const spans = paragraph.querySelectorAll("span")
      let time = 0
      spans.forEach((span) => {
        time += 0.004
        span.style.transitionDelay = `${time}s`
      })
    }
  }, [])

  // Effet pour déclencher l'animation
  useEffect(() => {
    // Forcer un délai pour que l'animation se déclenche après le montage
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <p ref={paragraphRef} className="flex flex-row flex-wrap gap-x-[4px] text-sm mt-2.5">
      {contentSplit.map((word, index) => (
        <span
          key={index}
          className="inline-block relative transition-transform duration-500"
          style={
            isVisible
              ? {
                  transition:
                    "clip-path .5s cubic-bezier(0.215, 0.61, 0.355, 1), transform .5s cubic-bezier(0.215, 0.61, 0.355, 1)",
                  transform: "rotate(0deg) translate3d(0, 0, 0)",
                  clipPath: "polygon(0% 10%, 100% 10%, 100% 110%, 0% 110%)",
                }
              : {
                  transition:
                    "clip-path .5s cubic-bezier(0.215, 0.61, 0.355, 1), transform .5s cubic-bezier(0.215, 0.61, 0.355, 1)",
                  transform: "rotate(-5deg) translate3d(0, -100%, 0)",
                  clipPath: "polygon(0% 110%, 100% 110%, 100% 210%, 0% 210%)",
                }
          }
        >
          {word}
        </span>
      ))}
    </p>
  )
}

export default Paragraph

