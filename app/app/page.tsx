import { Suspense } from 'react'
import {
  GenericSection,
  HeroSection,
  CallToActionSection,
  FrequentQuestions,
  Footer,
} from './components'
import Loading from './components/Loading'
import { sections } from './components/Mock'
import ModulePage from './modules/ModulePage'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ModulePage />
      <div className='flex flex-col items-center'>
        <HeroSection />
        <CallToActionSection />
        {sections.map((section, index) => {
          return (
            <GenericSection
              key={index}
              sectionName={section.sectionName}
              title={section.title}
              subtitle={section.subtitle}
              color={section.color}
              features={section.features}
              gradientColor={section.gradientColor}
              image={section.image}
            />
          )
        })}
        <FrequentQuestions />
      </div>
      <Footer />
    </Suspense>
  )
}
