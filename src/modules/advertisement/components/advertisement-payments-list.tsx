import { useEffect, useState } from 'react'

import { DataTable } from '@/components/table/data-table'
import { Label } from '@/components/ui/label'
import { paymentColumns } from '@/modules/payment/constants/columns'
import { Payment } from '@/modules/payment/types/payment'

import { getAdvertisementPaymentsAction } from './actions'

export function AdvertisementPaymentList({
  advertisementId,
}: {
  advertisementId: string
}) {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdvertisementPaymentsAction(advertisementId)

        if (response.success && Array.isArray(response.data)) {
          setPayments(response.data)
        }
      } catch (error) {
        console.error('Erro ao buscar pagamentos', error)
      }
    }

    fetchData()
  }, [advertisementId])

  return (
    <div className="grid space-y-4">
      <Label className="lg:text-base">Lista de Pagamentos</Label>

      <DataTable
        columns={paymentColumns}
        data={payments}
        lineActions={[]}
        showPagination={false}
      />
    </div>
  )
}
