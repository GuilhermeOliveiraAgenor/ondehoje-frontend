export function CompanyCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border p-4 shadow-sm">
      <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200" />
      <div className="mt-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
    </div>
  )
}

export default function Loading() {
  return (
    <div>
      <header className="bg-primary grid px-1 py-2">
        <div className="grid shrink-0 items-center gap-2 p-2">
          {/* Simulando o header para não dar "pulo" na tela */}
          <div className="h-8 w-8 animate-pulse rounded bg-white/20" />
        </div>
        <div className="text-card grid gap-2 text-center">
          <div className="mx-auto h-10 w-48 animate-pulse rounded bg-white/20" />
          <div className="mx-auto h-4 w-32 animate-pulse rounded bg-white/20" />
        </div>
      </header>

      {/* Simulando a barra de pesquisa */}
      <div className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="h-12 w-full animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>

      {/* Simulando as Categorias */}
      <div className="grid border-b px-4">
        <div className="flex gap-8 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="my-4 h-6 w-20 animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>
      </div>

      {/* Simulando os Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
