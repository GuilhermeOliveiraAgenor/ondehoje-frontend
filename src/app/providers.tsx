import { Toaster } from 'sonner'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster richColors />
      {children}
    </>
  )
}
