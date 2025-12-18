import { useEffect, useState } from 'react'
import { useYandexMetrika } from '../hooks/useYandexMetrika'

interface FormData {
  name: string
  email: string
  message: string
}

interface FieldFills {
  name: number
  message: number
  email?: number
}

interface VariantStats {
  submissions: number
  fieldFills: FieldFills
}

interface Stats {
  variant1: VariantStats
  variant2: VariantStats
}

type Variant = 'variant1' | 'variant2'

export function ResumeContact() {
  const { trackEvent } = useYandexMetrika()

  const [variant, setVariant] = useState<Variant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [stats, setStats] = useState<Stats>({
    variant1: {
      submissions: 0,
      fieldFills: { name: 0, message: 0 },
    },
    variant2: {
      submissions: 0,
      fieldFills: { name: 0, email: 0, message: 0 },
    },
  })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })

  const [filledFields, setFilledFields] = useState<Set<string>>(new Set())

  useEffect(() => {
    const initializeVariant = async () => {
      try {
        setIsLoading(true)

        const params = new URLSearchParams(window.location.search)
        let variantId = params.get('_ymab_params')

        if (!variantId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variantId = (window as any)._ymab_params
        }

        if (!variantId) {
          console.warn('⚠️ Вариокуб не инициализирован, используется резервный вариант')
          const fallbackVariant = Math.random() > 0.5 ? 'variant1' : 'variant2'
          setVariant(fallbackVariant)
          setIsLoading(false)
          return
        }

        const variantNumber = parseInt(variantId as string) || variantId.charCodeAt(0)
        const assignedVariant = variantNumber % 2 === 0 ? 'variant1' : 'variant2'

        setVariant(assignedVariant)

        trackEvent(`form_${assignedVariant}`, 'variant_shown', assignedVariant)
        console.log(`👤 Вариант показан: ${assignedVariant} (ID: ${variantId})`)
      } catch (err) {
        console.error('❌ Error инициализации:', err)
        const fallbackVariant = Math.random() > 0.5 ? 'variant1' : 'variant2'
        setVariant(fallbackVariant)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(initializeVariant, 150)
    return () => clearTimeout(timer)
  }, [])

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFieldBlur = async (fieldName: keyof FormData) => {
    if (formData[fieldName] && formData[fieldName].toString().trim()) {
      if (!filledFields.has(fieldName) && variant) {
        setFilledFields((prev) => new Set(prev).add(fieldName))

        setStats((prev) => ({
          ...prev,
          [variant]: {
            ...prev[variant],
            fieldFills: {
              ...prev[variant].fieldFills,
              [fieldName]: (prev[variant].fieldFills[fieldName] || 0) + 1,
            },
          },
        }))

        try {
          trackEvent(`form_${variant}`, 'field_filled', fieldName)
          console.log(`📝 Field filled: ${fieldName}`)
        } catch (err) {
          console.error('Error tracking field:', err)
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!variant) {
      alert('❌ Ошибка: вариант не загружен')
      return
    }

    const isValid =
      variant === 'variant1'
        ? formData.name.trim() && formData.message.trim()
        : formData.name.trim() && formData.email.trim() && formData.message.trim()

    if (!isValid) {
      alert('⚠️ Пожалуйста, заполните все поля')
      return
    }

    try {
      const newSubmissionCount = stats[variant].submissions + 1
      setStats((prev) => ({
        ...prev,
        [variant]: {
          ...prev[variant],
          submissions: newSubmissionCount,
        },
      }))

      if (variant === 'variant1') {
        trackEvent(`form_${variant}`, 'submit', `name: ${formData.name}`)
      } else {
        trackEvent(`form_${variant}`, 'submit', `email: ${formData.email}`)
      }

      alert(`✅ Спасибо! Ваше сообщение отправлено.\n\n`)

      setFormData({ name: '', email: '', message: '' })
      setFilledFields(new Set())
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Ошибка при отправке')
    }
  }

  if (isLoading) {
    return (
      <section id="contact" className="mx-auto max-w-6xl border-t border-slate-700 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-slate-400">⏳ Загрузка формы...</p>
        </div>
      </section>
    )
  }

  if (variant === 'variant1') {
    return (
      <section id="contact" className="mx-auto max-w-6xl border-t border-slate-700 px-4 py-16">
        <div className="form-enter animate-fadeIn mx-auto max-w-2xl rounded-lg border border-slate-700 bg-slate-800/80 p-8">
          <h3 className="mb-2 text-2xl font-bold text-white">Заинтересованы в сотрудничестве?</h3>
          <p className="mb-6 text-slate-400">Напишите мне, и я отвечу как можно скорее</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Ваше имя</label>
              <input
                type="text"
                name="name"
                placeholder="Иван Петров"
                value={formData.name}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('name')}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Ваше сообщение</label>
              <textarea
                name="message"
                placeholder="Расскажите о вашей идее..."
                rows={5}
                value={formData.message}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('message')}
                className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 font-semibold text-white transition hover:scale-105 active:scale-95"
            >
              Отправить
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl border-t border-slate-700 px-4 py-16">
      <div className="form-enter animate-fadeIn mx-auto max-w-2xl rounded-lg border border-blue-500/50 bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8">
        <h3 className="mb-2 text-2xl font-bold text-white">Давайте создадим что-то классное вместе</h3>
        <p className="mb-6 text-slate-300">Поделитесь своей идеей, и я свяжусь с вами в течение 24 часов</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">👤 Ваше имя</label>
            <input
              type="text"
              name="name"
              placeholder="Иван Петров"
              value={formData.name}
              onChange={handleFieldChange}
              onBlur={() => handleFieldBlur('name')}
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">📧 Ваш email</label>
            <input
              type="email"
              name="email"
              placeholder="ivan@example.com"
              value={formData.email}
              onChange={handleFieldChange}
              onBlur={() => handleFieldBlur('email')}
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              О чем вы хотите поговорить?
            </label>
            <textarea
              name="message"
              placeholder="Например: Фриланс проект, Job offer..."
              rows={5}
              value={formData.message}
              onChange={handleFieldChange}
              onBlur={() => handleFieldBlur('message')}
              className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition hover:scale-105 active:scale-95"
          >
            Отправить
          </button>
        </form>
      </div>
    </section>
  )
}
