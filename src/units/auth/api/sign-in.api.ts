import { SharedApi, SharedTypes } from '@shared'

type Payload = {
  email: string
  password: string
}

type Response = SharedTypes.BaseApiResponse<SharedTypes.AuthTokens>

export const signIn = async (payload: Payload) => {
  const { data } = await SharedApi.baseClient.post<Response>('/auth/sign-in', payload)
  return data.data
}
