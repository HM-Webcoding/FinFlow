import "./globals.css"
import { AppProvider } from "@/context/AppContext"

export const metadata = {
  title: "FinFlow — Finance Dashboard",
  description: "Personal finance tracker with insights, transactions, and role-based access",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
