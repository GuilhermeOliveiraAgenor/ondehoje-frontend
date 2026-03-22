interface AdvertisementParameters {
  baseDailyPrice: number
  discountThresholdDays: number
  discountPercentage: number
}

/**
 * Calcula o custo total do anúncio baseado nos dias de expiração
 * @param days - Número de dias que o anúncio ficará ativo
 * @param params - Parâmetros de configuração do anúncio
 * @returns Objeto com cálculo detalhado
 */
export function calculateAdvertisementCost(
  days: number,
  params: AdvertisementParameters,
) {
  const { baseDailyPrice, discountThresholdDays, discountPercentage } = params

  let calculatedAmount = baseDailyPrice * days
  let discountAmount = 0

  if (days >= discountThresholdDays) {
    discountAmount = (calculatedAmount * discountPercentage) / 100
    calculatedAmount -= discountAmount
  }

  return {
    baseDailyPrice,
    days,
    subtotal: baseDailyPrice * days,
    discountApplied: days >= discountThresholdDays,
    discountPercentage,
    discountAmount,
    total: calculatedAmount,
    totalInCents: Math.round(calculatedAmount * 100),
  }
}

/**
 * Calcula os dias entre hoje e uma data futura
 */
export function calculateDaysDifference(expirationDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiration = new Date(expirationDate)
  expiration.setHours(0, 0, 0, 0)

  const timeDiff = expiration.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

  return Math.max(daysDiff, 1) // Mínimo de 1 dia
}
