import AppProviders from '@/shared/contexts/AppProviders'
import AppRouter from '@/routes/AppRouter'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App

