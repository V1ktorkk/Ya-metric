import { useState } from 'react'
import { useExperimentsContext } from 'yandex-metrica-ab-react'
import { useYandexMetrika } from '../hooks/useYandexMetrika'

interface FormData {
  name: string
  email: string
  company: string
  contactMethod: 'telegram' | 'whatsapp' | 'phone' | 'linkedin'
  contactHandle: string
  message: string
}

interface FieldFills {
  name?: number
  email?: number
  company?: number
  contactMethod?: number
  contactHandle?: number
  message?: number
}

interface VariantStats {
  submissions: number
  fieldFills: FieldFills
}

interface Stats {
  'big-form': VariantStats
  'small-form': VariantStats
}

type Variant = 'big-form' | 'small-form'

const CONTACT_METHODS = [
  { id: 'telegram', label: 'Telegram', icon: '✈️' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'phone', label: 'Phone', icon: '☎️' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
] as const

const CONTACT_PLACEHOLDERS = {
  telegram: '@your_username',
  whatsapp: '+7 (999) 123-45-67',
  phone: '+7 (999) 123-45-67',
  linkedin: 'linkedin.com/in/username',
}

export function ResumeContact() {
  const { trackEvent } = useYandexMetrika()

  const { flags, ready, experiments } = useExperimentsContext()
  console.log('flags', flags[0])
  console.log('ready', ready)
  console.log('exp', experiments)

  const formType = flags['form_type']?.[0] as Variant | undefined

  const variant: Variant = ready && formType ? formType : 'big-form'

  console.log('var', variant)

  const [stats, setStats] = useState<Stats>({
    'big-form': {
      submissions: 0,
      fieldFills: {
        name: 0,
        email: 0,
        company: 0,
        contactMethod: 0,
        contactHandle: 0,
        message: 0,
      },
    },
    'small-form': {
      submissions: 0,
      fieldFills: { email: 0, message: 0 },
    },
  })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    contactMethod: 'telegram',
    contactHandle: '',
    message: '',
  })

  const [filledFields, setFilledFields] = useState<Set<string>>(new Set())

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFieldBlur = async (fieldName: string) => {
    const fieldValue = formData[fieldName as keyof FormData]
    if (fieldValue && fieldValue.toString().trim()) {
      if (!filledFields.has(fieldName) && variant) {
        setFilledFields((prev) => new Set(prev).add(fieldName))

        setStats((prev) => ({
          ...prev,
          [variant]: {
            ...prev[variant],
            fieldFills: {
              ...prev[variant].fieldFills,
              [fieldName]: (prev[variant].fieldFills[fieldName as keyof FieldFills] || 0) + 1,
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
      variant === 'big-form'
        ? formData.name.trim() &&
          formData.email.trim() &&
          formData.company.trim() &&
          formData.contactHandle.trim() &&
          formData.message.trim()
        : formData.email.trim() && formData.message.trim()

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

      if (variant === 'big-form') {
        trackEvent(
          `form_${variant}`,
          'submit',
          `${formData.name} | ${formData.contactMethod}: ${formData.contactHandle}`,
        )
      } else {
        trackEvent(`form_${variant}`, 'submit', `email: ${formData.email}`)
      }

      alert(`✅ Спасибо! Ваше сообщение отправлено.\n\n`)

      setFormData({
        name: '',
        email: '',
        company: '',
        contactMethod: 'telegram',
        contactHandle: '',
        message: '',
      })
      setFilledFields(new Set())
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Ошибка при отправке')
    }
  }

  if (!ready) {
    return (
      <section
        id="contact"
        className="min-h-screen w-full border-t border-slate-700 px-3 py-8 sm:px-4 sm:py-12 md:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-full">
          <p className="text-center text-sm text-slate-400 sm:text-base">⏳ Загрузка формы...</p>
        </div>
      </section>
    )
  }

  if (variant === 'big-form') {
    return (
      <section
        id="contact"
        className="min-h-screen w-full border-t border-slate-700 px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-16 lg:py-20"
      >
        <div className="form-enter animate-fadeIn mx-auto w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-800/80 p-4 sm:p-6 md:p-8">
          <h3 className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">Начнём сотрудничество</h3>
          <p className="mb-6 text-xs text-slate-400 sm:text-sm md:mb-8">
            Расскажите о себе и своем проекте. Я ответу в течение 24 часов
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm">
                👤 Ваше имя
              </label>
              <input
                type="text"
                name="name"
                placeholder="Иван Петров"
                value={formData.name}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('name')}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm">📧 Email</label>
              <input
                type="email"
                name="email"
                placeholder="ivan@example.com"
                value={formData.email}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('email')}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm">
                🏢 Компания/Проект
              </label>
              <input
                type="text"
                name="company"
                placeholder="Название компании или проекта"
                value={formData.company}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('company')}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
              />
            </div>

            {/* Contact Method Tabs */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300 sm:mb-3 sm:text-sm">
                💬 Способ связи
              </label>
              <div className="mb-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2 md:mb-4">
                {CONTACT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, contactMethod: method.id }))}
                    className={`transform rounded-lg px-2.5 py-1.5 text-xs transition sm:px-3 sm:py-2 sm:text-sm ${
                      formData.contactMethod === method.id
                        ? 'border-teal-400 bg-teal-500/20 text-teal-300'
                        : 'border border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-600'
                    }`}
                  >
                    <span className="mr-1 inline-block sm:mr-2">{method.icon}</span>
                    <span className="hidden sm:inline">{method.label}</span>
                    <span className="inline sm:hidden">{method.label.slice(0, 4)}</span>
                  </button>
                ))}
              </div>

              {/* Contact Handle Input */}
              <input
                type="text"
                name="contactHandle"
                placeholder={CONTACT_PLACEHOLDERS[formData.contactMethod]}
                value={formData.contactHandle}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('contactHandle')}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm">
                📝 Расскажите о вашей идее
              </label>
              <textarea
                name="message"
                placeholder="Что вас интересует? Какие задачи нужно решить?..."
                rows={4}
                value={formData.message}
                onChange={handleFieldChange}
                onBlur={() => handleFieldBlur('message')}
                className="md:rows-6 w-full resize-none rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95 sm:py-3 sm:text-base md:px-6 md:py-3"
            >
              Отправить
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section
      id="contact"
      className="min-h-screen w-full border-t border-slate-700 px-3 py-6 sm:px-4 sm:py-10 md:px-6 md:py-16 lg:py-20"
    >
      <div className="form-enter animate-fadeIn mx-auto w-full max-w-2xl rounded-lg border border-blue-500/50 bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-4 sm:p-6 md:p-8">
        <h3 className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">Свяжитесь со мной</h3>
        <p className="mb-5 text-xs text-slate-300 sm:mb-6 sm:text-sm md:mb-8">
          Поделитесь своей идеей, и я свяжусь с вами в течение 24 часов
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm">📧 Email</label>
            <input
              type="email"
              name="email"
              placeholder="ivan@example.com"
              value={formData.email}
              onChange={handleFieldChange}
              onBlur={() => handleFieldBlur('email')}
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300 sm:text-sm">
              💬 О чем вы хотите поговорить?
            </label>
            <textarea
              name="message"
              placeholder="Например: Фриланс проект, Job offer, сотрудничество..."
              rows={4}
              value={formData.message}
              onChange={handleFieldChange}
              onBlur={() => handleFieldBlur('message')}
              className="md:rows-5 w-full resize-none rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none sm:px-4 sm:py-2.5 md:py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-105 active:scale-95 sm:py-3 sm:text-base md:px-6 md:py-3"
          >
            Отправить
          </button>
        </form>
      </div>
    </section>
  )
}
