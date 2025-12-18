import { SharedLib } from '@shared'
import { LoaderFunction, redirect } from 'react-router'

export const appPageLoader: LoaderFunction = () => {
  const authTokens = SharedLib.Utils.LocalStorage.getAuthTokens()
  if (authTokens === null) {
    return redirect('/')
  }

  return new Response('OK', { status: 200 })
}
