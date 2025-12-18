const API_BASE = import.meta.env.DEV ? 'http://localhost:5000' : ''

export interface VisitorResponse {
  variant: 'variant1' | 'variant2'
  visitNumber: number
  totalVisitors: number
}

export interface StatsResponse {
  totalVisitors: number
  variant1: {
    visitors: number
    submissions: number
    fieldFills: { name: number; message: number }
    conversionRate: string
  }
  variant2: {
    visitors: number
    submissions: number
    fieldFills: { name: number; email: number; message: number }
    conversionRate: string
  }
}

export async function getVisitorVariant(): Promise<VisitorResponse> {
  const response = await fetch(`${API_BASE}/api/visitor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Failed to get visitor variant')
  }

  return response.json()
}

export async function trackFieldFill(variant: 'variant1' | 'variant2', fieldName: string): Promise<void> {
  await fetch(`${API_BASE}/api/track-field-fill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant, fieldName }),
  })
}

export async function trackSubmission(variant: 'variant1' | 'variant2'): Promise<void> {
  await fetch(`${API_BASE}/api/track-submission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant }),
  })
}

export async function getStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE}/api/stats`)

  if (!response.ok) {
    throw new Error('Failed to get stats')
  }

  return response.json()
}

export async function resetStats(): Promise<void> {
  await fetch(`${API_BASE}/api/stats/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}
