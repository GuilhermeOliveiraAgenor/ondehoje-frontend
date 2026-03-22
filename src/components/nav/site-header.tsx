import { Separator } from '../ui/separator'
import { SidebarTrigger } from '../ui/sidebar'

interface SiteHeaderProps {
  title: string
  children?: React.ReactNode
}

export function SiteHeader({ title, children }: SiteHeaderProps) {
  return (
    <header className="grid shrink-0 grid-cols-1 items-center gap-2 border-b p-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:grid-cols-2">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>

      {children}
    </header>
  )
}
