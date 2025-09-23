'use client'

import { VisualPacksGallery } from '@/components/theme/visual-packs-gallery'
import { useTheme } from '@/contexts/theme-context'
import { PageTransition } from '@/components/animations/micro-interactions'

export default function VisualPacksPage() {
  const { theme } = useTheme()
  return (
    <PageTransition>
      <div className={`min-h-screen ${theme.background}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className={`text-2xl font-semibold mb-6 ${theme.text}`}>Seasonal Visual Packs</h1>
          <VisualPacksGallery />
        </div>
      </div>
    </PageTransition>
  )
}


