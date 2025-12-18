import type { AuthTokens } from '@shared/types'

enum LocalStorageKey {
  AuthTokens = 'AuthTokens',
}

const getByKey = (key: LocalStorageKey) => localStorage.getItem(key)

const saveByKey = (key: LocalStorageKey, value: string) => {
  localStorage.setItem(key, value)
}

export const getAuthTokens = () => {
  try {
    const authTokensJson = getByKey(LocalStorageKey.AuthTokens)
    if (!authTokensJson) {
      return null
    }
    return JSON.parse(authTokensJson) as AuthTokens
  } catch (error) {
    console.error('get auth tokens error:', error)
    return null
  }
}

export const saveAuthTokens = (authTokens: AuthTokens) => {
  try {
    const authTokensJson = JSON.stringify(authTokens)
    saveByKey(LocalStorageKey.AuthTokens, authTokensJson)
  } catch (error) {
    console.error('save auth tokens error:', error)
  }
}

export const clear = () => {
  localStorage.removeItem(LocalStorageKey.AuthTokens)
}
