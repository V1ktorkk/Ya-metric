import { QueryClient } from '@tanstack/react-query'

const halfHourInMs = 30 * 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: halfHourInMs,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})
