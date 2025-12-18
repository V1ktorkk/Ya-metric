import express, { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

interface ABTestState {
  totalVisitors: number
  variant1: {
    visitors: number
    submissions: number
    fieldFills: {
      name: number
      message: number
    }
  }
  variant2: {
    visitors: number
    submissions: number
    fieldFills: {
      name: number
      email: number
      message: number
    }
  }
}

const abTestState: ABTestState = {
  totalVisitors: 0,
  variant1: {
    visitors: 0,
    submissions: 0,
    fieldFills: {
      name: 0,
      message: 0,
    },
  },
  variant2: {
    visitors: 0,
    submissions: 0,
    fieldFills: {
      name: 0,
      email: 0,
      message: 0,
    },
  },
}

// Получить вариант для нового посетителя
app.post('/api/visitor', (req: Request, res: Response) => {
  abTestState.totalVisitors++
  const visitNumber = abTestState.totalVisitors
  const variant = visitNumber % 2 === 1 ? 'variant1' : 'variant2'

  abTestState[variant].visitors++

  console.log(
    `👤 Посещение #${visitNumber}: ${variant} (v1=${abTestState.variant1.visitors}, v2=${abTestState.variant2.visitors})`,
  )

  res.json({
    variant,
    visitNumber,
    totalVisitors: abTestState.totalVisitors,
  })
})

// Отследить заполнение поля
app.post('/api/track-field-fill', (req: Request, res: Response) => {
  const { variant, fieldName } = req.body

  if (!variant || !fieldName) {
    res.status(400).json({ error: 'Missing variant or fieldName' })
    return
  }

  if (
    (variant === 'variant1' && (fieldName === 'name' || fieldName === 'message')) ||
    (variant === 'variant2' && (fieldName === 'name' || fieldName === 'email' || fieldName === 'message'))
  ) {
    abTestState[variant].fieldFills[fieldName]++
    console.log(`📝 ${variant}: field "${fieldName}" filled`)
  }

  res.json({ success: true })
})

// Отследить отправку формы
app.post('/api/track-submission', (req: Request, res: Response) => {
  const { variant } = req.body

  if (!variant) {
    res.status(400).json({ error: 'Missing variant' })
    return
  }

  abTestState[variant].submissions++
  console.log(`✅ ${variant}: submission (total: ${abTestState[variant].submissions})`)

  res.json({ success: true })
})

// Получить статистику
app.get('/api/stats', (req: Request, res: Response) => {
  const conversionRate1 =
    abTestState.variant1.visitors > 0
      ? ((abTestState.variant1.submissions / abTestState.variant1.visitors) * 100).toFixed(2)
      : 0

  const conversionRate2 =
    abTestState.variant2.visitors > 0
      ? ((abTestState.variant2.submissions / abTestState.variant2.visitors) * 100).toFixed(2)
      : 0

  res.json({
    totalVisitors: abTestState.totalVisitors,
    variant1: {
      ...abTestState.variant1,
      conversionRate: `${conversionRate1}%`,
    },
    variant2: {
      ...abTestState.variant2,
      conversionRate: `${conversionRate2}%`,
    },
  })
})

app.post('/api/stats/reset', (req: Request, res: Response) => {
  abTestState.totalVisitors = 0
  abTestState.variant1 = { visitors: 0, submissions: 0, fieldFills: { name: 0, message: 0 } }
  abTestState.variant2 = { visitors: 0, submissions: 0, fieldFills: { name: 0, email: 0, message: 0 } }

  console.log('🔄 Statistics reset')
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`🚀 A/B Testing Server running on http://localhost:${PORT}`)
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`)
})

export default app
