'use client'

import { AlertTriangle, RefreshCcw, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PaymentErrorPage() {
  const router = useRouter()

  function handleGoToDashboard() {
    router.replace('/company')
  }

  return (
    <div className="bg-background min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="animate-fade-in-up grid gap-4 text-center md:gap-6">
          <div className="grid justify-items-center">
            <div className="bg-destructive/10 dark:bg-destructive/20 inline-flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20">
              <XCircle className="text-destructive h-8 w-8 md:h-10 md:w-10" />
            </div>
          </div>

          <div className="grid gap-2 md:gap-3">
            <h1 className="text-2xl font-bold text-balance md:text-3xl lg:text-4xl">
              Erro no Pagamento
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Infelizmente não foi possível processar seu pagamento.
            </p>
          </div>
        </div>

        <Card className="border-destructive/20 animate-fade-in-up mt-6 p-4 delay-100 md:mt-8 md:p-6">
          <div className="grid grid-cols-[auto_1fr] items-start gap-3">
            <AlertTriangle className="text-destructive mt-0.5 h-5 w-5" />
            <div className="grid gap-1">
              <h2 className="text-lg font-semibold md:text-xl">Erro</h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                Ocorreu um erro inesperado ao processar seu pagamento. Por
                favor, tente novamente. Retorne a página de pagamento do anúncio
                ou assinatura para refazer o processo.
              </p>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up mt-4 p-4 delay-200 md:mt-6 md:p-6">
          <div className="grid gap-4">
            <h3 className="text-base font-semibold md:text-lg">
              O que fazer agora?
            </h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <div className="bg-primary/10 text-primary grid h-6 w-6 place-items-center rounded-full text-xs font-bold">
                  1
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium md:text-base">
                    Verifique seus dados
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Confirme se as informações de pagamento estão corretas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <div className="bg-primary/10 text-primary grid h-6 w-6 place-items-center rounded-full text-xs font-bold">
                  2
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium md:text-base">
                    Verifique o saldo
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Certifique-se de que há saldo suficiente disponível
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <div className="bg-primary/10 text-primary grid h-6 w-6 place-items-center rounded-full text-xs font-bold">
                  3
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium md:text-base">
                    Tente novamente
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Aguarde alguns minutos e tente realizar o pagamento
                    novamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="animate-fade-in-up mt-6 grid gap-3 delay-300">
          <Button className="w-full" size="lg" onClick={handleGoToDashboard}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs md:mt-8 md:text-sm">
          Se o problema persistir, entre em contato com nosso suporte para obter
          assistência.
        </p>
      </div>
    </div>
  )
}
