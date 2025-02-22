"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Paragraph = ({ content }) => {
  const contentSplit = content.split(" ");
  const [IsVisible, setIsVisible] = useState(false);

  // J'incrémente mon delay à chaque span
  let time = 0;
  const paragraphRef = useRef(null);
  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (paragraph) {
      const spans = paragraph.querySelectorAll("span");
      let time = 0;
      console.log(spans);
      spans.forEach((span) => {
        // Modifier pour le délai d'apparition du texte
        time += 0.02;
        span.style.transitionDelay = `${time}s`;
      });
    }
  }, []);

  // Anim GSAP

  useEffect(() => {
    const paragraph = paragraphRef.current;

    gsap.to(paragraph, {
      scrollTrigger: {
        trigger: paragraph,
        start: "-30% 80%",
        end: "100% 80%",
        onEnter() {
          setIsVisible(true);
        },
      },
    });
  });

  return (
    <p ref={paragraphRef} className="flex flex-row flex-wrap gap-x-[4px]">
      {contentSplit.map((word, index) => (
        <span
          key={index}
          className="inline-block relative transition-transform duration-500"
          style={
            IsVisible
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
  );
};

export default Paragraph;
