/* eslint-disable @typescript-eslint/no-explicit-any */
import { useExperimentsContext } from 'yandex-metrica-ab-react'

/**
 * Hook для интеграции с Яндекс.Метрика и Вариокубом
 * Использует официальный пакет yandex-metrica-ab-react
 */
export function useYandexMetrika() {
  const counterId = 105915496

  /**
   * Отправляет событие в Яндекс.Метрику
   */
  const trackEvent = (category: string, action: string, label?: string) => {
    if (typeof window === 'undefined' || !(window as any).ym) {
      console.warn('⚠️ Яндекс.Метрика не инициализирована')
      return
    }

    ;(window as any).ym(counterId, 'reachGoal', `${category}_${action}`, {
      label: label || '',
      timestamp: Date.now(),
    })

    console.log(`📊 Event [${counterId}]: ${category} > ${action} ${label ? `> ${label}` : ''}`)
  }

  /**
   * Получает текущий вариант из Вариокуба
   * Возвращает контекст с флагами экспериментов
   */
  const getExperimentFlags = () => {
    const context = useExperimentsContext()
    return context
  }

  return { trackEvent, getExperimentFlags }
}
