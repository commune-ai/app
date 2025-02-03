import { Suspense } from 'react'
import { Loading } from './components'
import Modules from './module/Modules'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Modules />
    </Suspense>
  )
}
