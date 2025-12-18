import { SharedApi } from '@shared'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={SharedApi.queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
