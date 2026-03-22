'use client'

import { Calendar, CheckCircle2, Receipt, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PaymentDetails } from '@/modules/payment/types/payment-details'
import { maskCurrency, maskDate } from '@/utils/masks'

type SuccessfulPageProps = {
  payment: PaymentDetails
}

export function SuccessfulPage({ payment }: SuccessfulPageProps) {
  const isSubscription = payment.subscription !== null
  const isAdvertisement = payment.advertisement !== null

  const router = useRouter()

  function handleGoToDashboard() {
    router.replace('/company')
  }

  return (
    <div className="bg-background min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-3xl gap-4">
        <div className="animate-fade-in-up grid gap-4 text-center md:gap-6">
          <div className="grid justify-items-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 md:h-20 md:w-20 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 md:h-10 md:w-10 dark:text-emerald-400" />
            </div>
          </div>
          <div className="grid gap-2 md:gap-3">
            <h1 className="text-xl font-bold text-balance md:text-2xl lg:text-3xl">
              Pagamento Realizado com Sucesso!
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Obrigado pela sua compra. Seu pagamento foi processado.
            </p>
          </div>
        </div>

        <Card className="animate-fade-in-up p-4 delay-100 md:p-6">
          <div className="grid gap-4 border-b pb-4 md:gap-6 md:pb-6">
            <div className="grid grid-cols-[auto_1fr] items-start gap-3">
              <Receipt className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="grid gap-1">
                <h2 className="text-lg font-semibold md:text-xl">
                  Detalhes do Pagamento
                </h2>
                <p className="text-muted-foreground text-xs break-all md:text-sm">
                  ID: {payment.checkoutId}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 pt-4 md:gap-4 md:pt-6">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground text-sm md:text-base">
                Valor
              </span>
              <span className="text-right text-base font-semibold md:text-lg">
                {maskCurrency(payment.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground text-sm md:text-base">
                Gateway
              </span>
              <span className="text-right text-sm font-medium capitalize md:text-base">
                {payment.gateway}
              </span>
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <span className="text-muted-foreground text-sm md:text-base">
                Status
              </span>
              <span className="inline-flex items-center justify-end gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 md:px-3 md:text-sm dark:bg-emerald-900/30 dark:text-emerald-400">
                  {payment.status}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground text-sm md:text-base">
                Data de Confirmação
              </span>
              <span className="text-right text-sm font-medium md:text-base">
                {maskDate(payment.confirmationDate || '')}
              </span>
            </div>
          </div>
        </Card>

        {isSubscription && payment.subscription && (
          <Card className="border-primary/20 animate-fade-in-up p-4 delay-200 md:p-6">
            <div className="grid gap-4 md:gap-6">
              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <Calendar className="text-primary mt-0.5 h-5 w-5" />
                <div className="grid gap-1">
                  <h2 className="text-lg font-semibold md:text-xl">
                    Assinatura Ativada
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Sua assinatura está ativa e pronta para uso
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    ID da Assinatura
                  </span>
                  <span className="text-right font-mono text-xs break-all md:text-sm">
                    {payment.subscription.id.substring(0, 13)}...
                  </span>
                </div>

                <div className="grid grid-cols-2 items-center gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Status
                  </span>
                  <span className="inline-flex items-center justify-end">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium md:px-3 md:text-sm">
                      {payment.subscription.status}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Data de Início
                  </span>
                  <span className="text-right text-sm font-medium md:text-base">
                    {maskDate(payment.subscription.startDate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Próxima Renovação
                  </span>
                  <span className="text-right text-sm font-medium md:text-base">
                    {maskDate(payment.subscription.endDate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t pt-3 md:pt-4">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Valor Mensal
                  </span>
                  <span className="text-primary text-right text-lg font-bold md:text-xl">
                    {maskCurrency(payment.subscription.amount)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {isAdvertisement && payment.advertisement && (
          <Card className="border-primary/20 animate-fade-in-up p-4 delay-200 md:p-6">
            <div className="grid gap-4 md:gap-6">
              <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                <TrendingUp className="text-primary mt-0.5 h-5 w-5" />
                <div className="grid gap-1">
                  <h2 className="text-lg font-semibold md:text-xl">
                    Anúncio Publicado
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Seu anúncio está ativo e sendo exibido
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Empresa
                  </span>
                  <span className="text-right text-sm font-medium wrap-break-word md:text-base">
                    {payment.advertisement.company.name}
                  </span>
                </div>

                {payment.advertisement.event && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground text-sm md:text-base">
                      Evento
                    </span>
                    <span className="text-right text-sm font-medium wrap-break-word md:text-base">
                      {payment.advertisement.event.name}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Descrição
                  </span>
                  <span className="text-right text-sm font-medium wrap-break-word md:text-base">
                    {payment.advertisement.description}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Duração
                  </span>
                  <span className="text-right text-sm font-medium md:text-base">
                    {payment.advertisement.days} dias
                  </span>
                </div>

                <div className="grid grid-cols-2 items-center gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Status
                  </span>
                  <span className="inline-flex items-center justify-end">
                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium md:px-3 md:text-sm">
                      {payment.advertisement.status}
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground text-sm md:text-base">
                    Data de Expiração
                  </span>
                  <span className="text-right text-sm font-medium md:text-base">
                    {maskDate(payment.advertisement.expirationDate)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="animate-fade-in-up grid gap-3 delay-300">
          <Button className="w-full" size="lg" onClick={handleGoToDashboard}>
            Ir para o Painel
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-muted-foreground text-center text-xs md:text-sm">
          Um recibo foi enviado para o seu e-mail. Caso tenha dúvidas, entre em
          contato com nosso suporte.
        </p>
      </div>
    </div>
  )
}
