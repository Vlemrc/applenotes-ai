import { DM_Sans } from "next/font/google";
import "../styles/normalize.css";
import "../styles/variables.css"
import "../styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300","400", "500", "600", "700", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "Apple Notes",
  description: "Apple notes with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
