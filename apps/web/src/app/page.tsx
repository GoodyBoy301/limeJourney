import { Lenis } from "@/components/lenis"
import Hero from "@/components/hero"
import Nav from "@/components/nav"
import "./landing-page.css"
import { Scrollbar } from "@/components/scrollbar"

export default function LandingPage() {
  return (
    <main className="landing-page bg-[#F5F5F5] w-[100vw] overflow-x-hidden">
      <Lenis root options={{ lerp: 0.125 }} />
      <Scrollbar />
      <Nav />
      <Hero />
    </main>
  )
}
