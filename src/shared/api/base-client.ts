import { Constants, Utils } from '@shared/lib'
import { AuthTokens, BaseApiResponse } from '@shared/types'
import { Mutex } from 'async-mutex'
import axios from 'axios'
import toast from 'react-hot-toast'

const instance = axios.create({
  baseURL: Constants.BASE_API_URL,
})

instance.interceptors.request.use((config) => {
  const authTokens = Utils.LocalStorage.getAuthTokens()
  if (authTokens?.accessToken) {
    config.headers.Authorization = `Bearer ${authTokens.accessToken}`
  }
  return config
})

const mutex = new Mutex()

const refreshTokens = async (refreshToken: string) => {
  const release = await mutex.acquire()
  try {
    const { data } = await instance.post<BaseApiResponse<AuthTokens>>('/auth/refresh', { refreshToken })
    return data.data
  } finally {
    release()
  }
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      try {
        const authTokens = Utils.LocalStorage.getAuthTokens()
        if (authTokens === null) {
          throw new Error('Missing auth tokens, cannot perform refresh')
        }
        const tokens = await refreshTokens(authTokens.refreshToken)
        Utils.LocalStorage.saveAuthTokens(tokens)
        instance.request({ ...error.config })
      } catch {
        Utils.LocalStorage.clear()
        toast.error('User not authorized')
        window.location.pathname = '/'
        return
      }
    }
    throw error
  },
)

export { instance as baseClient }
