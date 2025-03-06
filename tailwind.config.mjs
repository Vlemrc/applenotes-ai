/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			grayLight: 'var(--gray-light)',
  			gray: 'var(--gray)',
  			grayLightDark: 'var(--gray-light-dark)',
  			grayOpacity: 'var(--gray-opacity)',
  			grayDark: 'var(--gray-dark)',
  			text: 'var(--text)',
  			yellow: 'var(--yellow)',
  			yellowDark: 'var(--yellow-dark)',
  			yellowLight: 'var(--yellow-light)',
  			yellowGradient: 'var(--yellow-gradient)',
			alert: 'var(--alert)',
  		},
		backgroundImage: {
			'yellow-gradient': 'linear-gradient(0deg, rgba(255, 195, 0, 1) 0%, rgba(255, 212, 73, 1) 100%)',
		},
  		fontFamily: {
  			dmSans: [
  				'var(--font-dm-sans)',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
