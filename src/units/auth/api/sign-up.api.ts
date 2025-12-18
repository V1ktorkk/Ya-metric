import { SharedApi, SharedTypes } from '@shared'

type Payload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

type Response = SharedTypes.BaseApiResponse<SharedTypes.AuthTokens>

export const signUp = async (payload: Payload) => {
  const { data } = await SharedApi.baseClient.post<Response>('/auth/sign-up', payload)
  return data.data
}
