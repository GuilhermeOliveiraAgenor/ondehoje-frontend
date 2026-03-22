'use client'

import { CalendarSync, CheckCircle2 } from 'lucide-react'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTable } from '@/components/table/data-table'
import type { Lineaction } from '@/components/table/types/lineaction'
import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import type { Parameter } from '@/modules/parameter/types/parameter'
import { paymentColumns } from '@/modules/payment/constants/columns'
import { Payment } from '@/modules/payment/types/payment'
import { RenewSubscriptionSheet } from '@/modules/subscription/components/renew-subscription-sheet'
import { subscriptionColumns } from '@/modules/subscription/constants/columns'
import { Subscription } from '@/modules/subscription/types/subscription'

type SubscriptionFormProps = {
  subscription: Subscription
  price: Parameter
  payments: Payment[]
}

export function SubscriptionForm({
  subscription,
  price,
  payments,
}: SubscriptionFormProps) {
  const plans = [
    {
      name: 'Free',
      price: 'R$ 0',
      period: '/mês',
      popular: false,
      features: ['Acesso a plataforma'],
    },
    {
      name: 'Premium',
      price: `R$ ${price.value}`,
      period: '/mês',
      popular: true,
      features: [
        'Eventos ilimitados',
        'Atrações ilimitadas',
        'Anúncios com descontos exclusivos',
      ],
    },
  ]

  const now = new Date()
  const shouldShowRenewOption = new Date(subscription.endDate) <= now

  const lineactions: Lineaction[] = []

  if (shouldShowRenewOption) {
    lineactions.push({
      label: 'Renovar assinatura',
      icon: CalendarSync,
      component: RenewSubscriptionSheet,
      componentProps: {
        price,
      },
    })
  }

  return (
    <>
      <SiteHeader title="Assinatura" />

      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <h1 className="text-base font-medium md:text-xl">Planos Individuais</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`grid gap-2 rounded-xl border p-6 shadow-sm transition-all duration-300 ${
                plan.popular ? 'ring-primary/50 ring-2' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-bold">{plan.name}</CardTitle>
                {plan.popular && (
                  <Badge className="bg-primary font-semibold">Popular</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">{plan.price}</span>
                <span className="text-card-foreground text-lg">
                  {plan.period}
                </span>
              </div>

              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                  <span className="text-card-foreground text-sm leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <DataTable
          columns={subscriptionColumns}
          data={[subscription]}
          lineActions={lineactions}
          showPagination={false}
        />

        <h3 className="text-base font-medium">Extrato de pagamentos</h3>

        <DataTable columns={paymentColumns} data={payments} lineActions={[]} />
      </div>
    </>
  )
}
