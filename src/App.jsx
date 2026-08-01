import AppProviders from '@/shared/contexts/AppProviders'
import AppRouter from '@/routes/AppRouter'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster position="top-right" />
    </AppProviders>
  )
}

export default App
