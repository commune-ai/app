'use client'
import ModulePage from '@/app/module/ModulePage'
export default function Page({ params }: { params: { module: string } }) {
  return <ModulePage params={params} />
}
