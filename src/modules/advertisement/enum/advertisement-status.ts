enum AdvertisementStatus {
  ACTIVE = 'active', // Assinatura ativa e válida
  INACTIVE = 'inactive', // Criada mas ainda não ativada
  PENDING = 'pending', // Aguardando pagamento
  WAITING_AUTHORIZATION = 'waiting_authorization', // Aguardando autorização do administrador
  AUTHORIZED = 'authorized', // Autorizada pelo administrador
  NOT_AUTHORIZED = 'not_authorized', // Não autorizada pelo administrador
  CANCELED = 'canceled', // Cancelada
  EXPIRED = 'expired', // Expirada
}

export { AdvertisementStatus }
