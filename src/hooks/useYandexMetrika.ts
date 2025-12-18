/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Hook для интеграции с Яндекс.Метрика и Вариокубом
 * Позволяет отслеживать события A/B теста
 */
export function useYandexMetrika() {
  /**
   * Отправляет событие в Яндекс.Метрику
   * @param category - Категория события (например: 'form_variant1')
   * @param action - Действие (например: 'submit', 'field_filled')
   * @param label - Метка события (опционально)
   * @param visitCount - Номер посещения (опционально)
   */
  const trackEvent = (category: string, action: string, label?: string, visitCount?: number) => {
    if (typeof window === 'undefined' || !(window as any).ym) {
      console.warn('⚠️ Яндекс.Метрика не инициализирована')
      return
    }

    const counterId = 105915496

    ;(window as any).ym(counterId, 'reachGoal', `${category}_${action}`, {
      label: label || '',
      visitCount: visitCount || 0,
      timestamp: Date.now(),
    })

    console.log(`📊 Event [Счетчик #${counterId}]: ${category} > ${action} ${label ? `> ${label}` : ''}`)
  }

  /**
   * Получает ID варианта из Вариокуба
   * @returns ID варианта из URL параметра или глобального объекта
   */
  const getVariantFromVarioqub = (): string | null => {
    const params = new URLSearchParams(window.location.search)
    const variantParam = params.get('_ymab_params')

    if (variantParam) {
      console.log(`✅ Вариант из Вариокуба (URL): ${variantParam}`)
      return variantParam
    }

    if ((window as any)._ymab_params) {
      console.log(`✅ Вариант из глобального объекта: ${(window as any)._ymab_params}`)
      return (window as any)._ymab_params
    }

    console.warn('⚠️ Вариант из Вариокуба не найден')
    return null
  }

  /**
   * Получает информацию о текущем A/B тесте
   * @returns Объект с информацией о тесте
   */
  const getVarioqubInfo = () => {
    const variantId = getVariantFromVarioqub()

    return {
      variantId,
      isVarioqubActive: !!variantId,
      variantName: variantId ? (parseInt(variantId) % 2 === 0 ? 'variant1' : 'variant2') : null,
    }
  }

  return { trackEvent, getVariantFromVarioqub, getVarioqubInfo }
}
