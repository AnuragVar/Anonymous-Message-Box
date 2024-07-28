import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
}:{children:React.ReactNode}) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}