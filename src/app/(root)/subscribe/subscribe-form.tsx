import {
  Building2,
  LogIn,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'

type SubscribeFormProps = {
  authenticated: boolean
}

export default function SubscribeForm({ authenticated }: SubscribeFormProps) {
  return (
    <div className="from-background relative min-h-screen overflow-hidden bg-linear-to-br">
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/20 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/20 absolute -top-40 -left-40 h-200 w-200 rounded-full blur-3xl" />
        <div className="bg-primary/20 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/20 absolute -right-40 -bottom-40 h-200 w-200 rounded-full blur-3xl" />

        <div className="bg-primary/20 absolute top-10/12 right-7/12 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/20 absolute top-9/12 right-5/12 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/20 absolute top-2/12 right-2/12 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <main className="w-full max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl" />
              <div className="bg-primary/10 relative rounded-full p-6 backdrop-blur-sm">
                <Megaphone className="text-primary h-16 w-16 md:h-20 md:w-20" />
              </div>
            </div>
          </div>

          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Quer anunciar seus{' '}
            <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
              eventos?
            </span>
          </h1>

          <p className="text mb-8 text-lg text-pretty md:text-xl">
            Explore agora nossas assinaturas e alcance milhares de pessoas
            interessadas nos seus eventos!
          </p>

          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="bg-card/50 flex flex-col items-center gap-2 rounded-lg p-4 backdrop-blur-sm">
              <TrendingUp className="text-primary h-8 w-8" />
              <p className="text-foreground text-sm font-medium">
                Expanda Seu Público
              </p>
            </div>
            <div className="bg-card/50 flex flex-col items-center gap-2 rounded-lg p-4 backdrop-blur-sm">
              <Users className="text-primary h-8 w-8" />
              <p className="text-foreground text-sm font-medium">
                Descoberta Rápida
              </p>
            </div>
            <div className="bg-card/50 flex flex-col items-center gap-2 rounded-lg p-4 backdrop-blur-sm">
              <Sparkles className="text-primary h-8 w-8" />
              <p className="text-foreground text-sm font-medium">
                Atração Imediata
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {authenticated ? (
              <Link href="/company/save" className="bg-primary rounded-md p-2">
                <span className="text-card relative z-10 flex items-center gap-2 text-sm">
                  <Building2 className="h-5 w-5" />
                  Criar nova empresa
                </span>
              </Link>
            ) : (
              <Link href="/auth/sign-in" className="bg-primary rounded-md p-2">
                <span className="text-card relative z-10 flex items-center gap-2 text-sm">
                  <LogIn className="h-5 w-5" />
                  Fazer Login ou Criar Conta
                </span>
              </Link>
            )}
          </div>

          <p className="text-muted-foreground mt-6 text-sm">
            É rápido, fácil e você pode começar em minutos!
          </p>
        </main>
      </div>
    </div>
  )
}
