'use client'

import { Search, Ticket, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useMemo, useState } from 'react'

import { SiteHeader } from '@/components/nav/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardUserCoupon } from '@/modules/user-coupon/components/card-user-coupons'
import type { UserCoupon } from '@/modules/user-coupon/types/user-coupon'

type UserCouponsListProps = {
  isAuthenticated: boolean
  userCoupons: UserCoupon[]
}

export function UserCouponsList({
  isAuthenticated,
  userCoupons = [],
}: UserCouponsListProps) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredCoupons = useMemo(() => {
    if (!searchQuery) {
      return userCoupons
    }

    return userCoupons.filter(
      (userCoupon) =>
        userCoupon.coupon.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        userCoupon.coupon.event.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        userCoupon.coupon.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    )
  }, [userCoupons, searchQuery])

  // Separar cupons usados e não usados
  const availableCoupons = filteredCoupons.filter((uc) => !uc.usedAt)
  const usedCoupons = filteredCoupons.filter((uc) => uc.usedAt)

  function handleLogin() {
    router.push('/auth/sign-in')
  }

  function handleRegister() {
    router.push('/auth/sign-in')
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <Fragment>
        <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
          <SiteHeader title="Meus cupons" />

          <section className="px-4 py-4 sm:px-6 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
                <div className="bg-muted/50 mb-6 rounded-full p-5 sm:p-8">
                  <UserPlus className="text-muted-foreground h-12 w-12 sm:h-20 sm:w-20" />
                </div>
                <h2 className="mb-3 text-xl font-bold sm:text-2xl">
                  Autenticação Necessária
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed sm:text-base">
                  Para visualizar e gerenciar seus cupons salvos, você precisa
                  estar autenticado. Crie uma conta ou faça login para
                  continuar.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="min-w-40" onClick={handleLogin}>
                    Fazer Login
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-40 bg-transparent"
                    onClick={handleRegister}
                  >
                    Criar Conta
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <SiteHeader title="Meus cupons" />
      <div className="grid w-full grid-cols-1 gap-4 px-4 md:px-6 lg:px-10">
        <Input
          type="text"
          placeholder="Buscar cupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredCoupons.length === 0 && userCoupons.length === 0 ? (
          <section className="py-4 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-muted/30 flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
                <div className="bg-muted/50 mb-6 rounded-full p-8">
                  <Ticket className="text-muted-foreground h-20 w-20" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">Nenhum cupom salvo</h2>
                <p className="text-muted-foreground max-w-md text-base">
                  Você ainda não possui cupons salvos. Explore os eventos e
                  estabelecimentos para encontrar ofertas incríveis!
                </p>
              </div>
            </div>
          </section>
        ) : filteredCoupons.length === 0 ? (
          <section className="py-4 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="bg-muted/30 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
                <div className="bg-muted/50 mb-6 rounded-full p-8">
                  <Search className="text-muted-foreground h-16 w-16" />
                </div>
                <h2 className="mb-3 text-2xl font-bold">
                  Nenhum cupom encontrado
                </h2>
                <p className="text-muted-foreground max-w-md text-base">
                  Não encontramos cupons que correspondam à sua busca. Tente
                  outros termos.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            {availableCoupons.length > 0 && (
              <section className="py-4 lg:py-8">
                <div className="mx-auto max-w-7xl">
                  <div className="mb-8 flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Cupons Disponíveis
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {availableCoupons.length}{' '}
                        {availableCoupons.length === 1
                          ? 'cupom disponível'
                          : 'cupons disponíveis'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {availableCoupons.map((userCoupon) => (
                      <CardUserCoupon
                        key={userCoupon.hash}
                        userCoupon={userCoupon}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {usedCoupons.length > 0 && (
              <section className="pb-12 lg:pb-16">
                <div className="mx-auto max-w-7xl">
                  <div className="mb-8 flex items-end justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Cupons Utilizados
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {usedCoupons.length}{' '}
                        {usedCoupons.length === 1
                          ? 'cupom utilizado'
                          : 'cupons utilizados'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {usedCoupons.map((userCoupon) => (
                      <CardUserCoupon
                        key={userCoupon.hash}
                        userCoupon={userCoupon}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Fragment>
  )
}
