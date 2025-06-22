
import { Inter } from "next/font/google";
import "./global.css";
import Chakra from "@/theme/chakra";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-Inter",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Chakra>{children}</Chakra>
      </body>
    </html>
  );
}
