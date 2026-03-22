import { getCurrentCompany, isAuthenticated } from '@/auth/auth'
import { AppSidebar } from '@/components/nav/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { fetchCompaniesForUser } from '@/modules/company/services/fetch-company-for-user'
import { fetchMyCompanies } from '@/modules/company/services/fetch-my-companies'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let hasCompanies: boolean = false

  const authenticated = await isAuthenticated()

  if (authenticated) {
    const companiesData = await fetchMyCompanies()
    hasCompanies = companiesData.companies.length > 0
  }

  const currentCompany = await getCurrentCompany()

  return (
    <SidebarProvider>
      <AppSidebar
        isAuthenticated={authenticated}
        slug={currentCompany}
        hasCompanies={hasCompanies}
      />
      <main className="h-screen w-full">
        <SidebarInset className="grid gap-4">{children}</SidebarInset>
      </main>
    </SidebarProvider>
  )
}
