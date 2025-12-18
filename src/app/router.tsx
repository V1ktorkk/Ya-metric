import { AppPage, appPageLoader } from '@pages/app'
import { HomePage } from '@pages/home'
import { NotFoundPage } from '@pages/not-found'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/app',
    loader: appPageLoader,
    element: <AppPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
