import { Suspense } from 'react'
import { Loading } from './components'
import { Modules } from './components/module'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Modules />
    </Suspense>
  )
}
