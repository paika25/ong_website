export interface CheckoutResult {
  url: string
}

export interface ConfirmResult {
  recorded: boolean
  paymentStatus?: string
  alreadyExisted?: boolean
}

export async function createCheckout(
  ongId: string,
  ongName: string,
  amountEuros: number
): Promise<CheckoutResult> {
  return $fetch<CheckoutResult>('/api/donations/create-checkout', {
    method: 'POST',
    body: { ongId, ongName, amountEuros },
  })
}

export async function confirmSession(sessionId: string): Promise<ConfirmResult> {
  return $fetch<ConfirmResult>('/api/donations/confirm-session', {
    method: 'POST',
    body: { sessionId },
  })
}
