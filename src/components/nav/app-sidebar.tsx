'use client'

import {
  Building2,
  ChartNoAxesCombined,
  Contact,
  CreditCard,
  Heart,
  Landmark,
  LogIn,
  MapPinHouse,
  SettingsIcon,
  Tag,
  Ticket,
  User,
  VenetianMask,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'

import { NavAdvertisement } from './nav-advertisement'
import { NavCompany } from './nav-company'
import { NavDefault } from './nav-default'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

// Estrutura de itens ajustada para melhor organização da lógica
const items = {
  navDefault: [
    {
      title: 'Eventos',
      url: '/',
      icon: Ticket,
    },
    {
      title: 'Estabelecimentos',
      url: '/establishment',
      icon: Building2,
    },
    {
      title: 'Favoritos',
      url: '/favorites',
      icon: Heart,
    },
    {
      title: 'Cupons por evento',
      url: '/coupons',
      icon: Tag,
    },
  ],
  navCompanyAction: [
    {
      title: 'Para empresas', // Mostrar quando logado mas SEM empresas
      url: '/subscribe',
      icon: Building2,
      id: 'subscribe-company',
    },
    {
      title: 'Minhas empresas',
      url: '/company',
      icon: Landmark,
      id: 'my-companies',
    },
  ],
  navCompany: [
    {
      title: 'Meus eventos',
      url: '/company/:slug/events',
      icon: VenetianMask,
    },
    {
      title: 'Meus anúncios',
      url: '/company/:slug/advertisements',
      icon: ChartNoAxesCombined,
    },
    {
      title: 'Meus cupons',
      url: '/company/:slug/coupons',
      icon: Tag,
    },
    {
      title: 'Configurações',
      url: '/company/:slug/settings',
      icon: SettingsIcon,
    },
    {
      title: 'Assinatura',
      url: '/company/:slug/subscription',
      icon: CreditCard,
    },
  ],
  navNotLogged: [
    {
      title: 'Fazer login',
      url: '/auth/sign-in',
      icon: LogIn,
    },
  ],
  navSecondary: [
    {
      title: 'Meus endereços',
      url: '/address',
      icon: MapPinHouse,
    },
    {
      title: 'Meu perfil',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Fale conosco',
      url: '/contact',
      icon: Contact,
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  slug: string | null
  isAuthenticated: boolean
  hasCompanies: boolean
}

export function AppSidebar({
  isAuthenticated,
  hasCompanies,
  slug,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname()
  const isCompany =
    pathname.includes('/company/') && !pathname.includes('/company/save')

  const navDefaultItems = useMemo(() => {
    const defaultNav = items.navDefault

    if (!isAuthenticated) {
      return [defaultNav[0], defaultNav[1]]
    }

    return defaultNav
  }, [isAuthenticated])

  const navCompanyActionItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        items.navCompanyAction.find((item) => item.id === 'subscribe-company')!,
      ]
    }

    if (hasCompanies) {
      return [
        items.navCompanyAction.find((item) => item.id === 'my-companies')!,
      ]
    }

    return [
      items.navCompanyAction.find((item) => item.id === 'subscribe-company')!,
    ]
  }, [isAuthenticated, hasCompanies])

  const navCompanyWithSlug = useMemo(
    () =>
      items.navCompany.map((item) => ({
        ...item,
        url: item.url.replace(':slug', slug ?? ''),
      })),
    [slug],
  )

  const navSecondaryItems = useMemo(() => {
    if (isAuthenticated) {
      return items.navSecondary
    }

    return items.navNotLogged
  }, [isAuthenticated])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="flex justify-between">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavDefault items={navDefaultItems} />

              <NavAdvertisement items={navCompanyActionItems} />

              {isCompany && isAuthenticated && (
                <NavCompany items={navCompanyWithSlug} />
              )}

              <NavSecondary items={navSecondaryItems} className="mt-auto" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{isAuthenticated && <NavUser />}</SidebarFooter>
    </Sidebar>
  )
}
