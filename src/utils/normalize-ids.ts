export function normalizeIds(ids: any): string[] {
  if (!Array.isArray(ids)) return []

  return ids.flatMap((id) => {
    // Se for string e parecer um JSON de array '["id"]', faz o parse
    if (typeof id === 'string' && (id.startsWith('[') || id.includes('"'))) {
      try {
        // Tenta limpar as aspas extras e colchetes residuais
        const cleaned = id.replace(/[\[\]"]/g, '')
        return cleaned ? [cleaned] : []
      } catch {
        return []
      }
    }
    return id
  })
}
