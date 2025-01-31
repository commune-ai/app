import { Suspense } from 'react'
import { Footer, Loading} from './components'
import ModulePage from './modules/ModulePage'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ModulePage />
      <Footer />
    </Suspense>
  )
}
