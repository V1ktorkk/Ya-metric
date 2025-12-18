import { SharedApi, SharedLib } from '@shared'
import { useMutation } from '@tanstack/react-query'
import { signIn } from '@units/auth/api'

export const useSignIn = () =>
  useMutation({
    mutationFn: signIn,
    onSuccess: (result) => {
      SharedLib.Utils.LocalStorage.saveAuthTokens(result)
      SharedApi.queryClient.invalidateQueries()
    },
  })
