import dayjs from 'dayjs'

export function maskPhone(value: string) {
  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')

  return value
}

export function maskCNPJ(value: string) {
  value = value.replace(/\D/g, '') // remove tudo que não é número
  value = value.replace(/^(\d{2})(\d)/, '$1.$2')
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
  value = value.replace(/(\d{4})(\d)/, '$1-$2')

  return value
}

export function maskCep(value: string) {
  value = value.replace(/\D/g, '') // 54564555
  value = value.replace(/^(\d{5})(\d)/, '$1-$2')

  return value
}

export function maskDate(value: string) {
  const date = dayjs(value)

  if (!date.isValid()) return ''

  return date.format('DD/MM/YYYY HH:mm')
}

export function maskCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
