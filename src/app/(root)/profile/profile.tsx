import { Calendar, Mail, User } from 'lucide-react'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import type { User as UserType } from '@/modules/user/types/user'

interface ProfileProps {
  user: UserType
}

export function Profile({ user }: ProfileProps) {
  const formatedBirthDate = new Date(user.birthDate).toLocaleDateString('pt-BR')

  return (
    <main className="bg-background relative min-h-screen overflow-hidden px-4 py-12 lg:px-10">
      {/* Background Gradient Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/20 absolute -top-40 left-1/4 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="bg-primary/10 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="relative px-4 lg:px-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize suas informações pessoais
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-border/20 bg-card backdrop-blur- overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {/* Avatar Section */}
            <div className="px-6 pt-8 pb-16 sm:px-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <div className="bg-primary/10 absolute -inset-1 rounded-full blur-md" />
                  <Image
                    src={user.image || '/placeholder.svg'}
                    alt="Foto de perfil"
                    width={120}
                    height={120}
                    className="border-background relative rounded-full border-4 object-cover shadow-lg"
                  />
                </div>
                <div className="text-center sm:mb-2 sm:text-left">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {user.name}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Membro desde {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="divide-border/50 divide-y px-6 py-6 sm:px-8">
              {/* Name Field */}
              <div className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <User className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Nome completo
                  </p>
                  <p className="text-base font-medium">{user.name}</p>
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Mail className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    E-mail
                  </p>
                  <p className="text-base font-medium break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Birth Date Field */}
              <div className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Calendar className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Data de Nascimento
                  </p>
                  <p className="text-base font-medium">{formatedBirthDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
