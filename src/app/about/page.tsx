'use client'

import { HeroSection, TeamSection, ValuesSection, MissionSection } from './sections'

// ================== PAGE ==================
export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <TeamSection />
      <ValuesSection />
      <MissionSection />
    </main>
  )
}
