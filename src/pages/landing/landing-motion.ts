/**
 * Floema-style scroll animations using GSAP ScrollTrigger.
 * Each section fades/slides in on scroll. Hero image parallaxes.
 */

type GsapTarget = string | Element | Element[]

type GsapTimeline = {
  to: (
    targets: GsapTarget,
    vars: Record<string, unknown>,
    position?: number | string,
  ) => GsapTimeline
  from: (
    targets: GsapTarget,
    vars: Record<string, unknown>,
    position?: number | string,
  ) => GsapTimeline
  fromTo: (
    targets: GsapTarget,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
    position?: number | string,
  ) => GsapTimeline
}

type Gsap = {
  set: (targets: GsapTarget, vars: Record<string, unknown>) => void
  to: (targets: GsapTarget, vars: Record<string, unknown>) => unknown
  from: (targets: GsapTarget, vars: Record<string, unknown>) => unknown
  timeline: (vars?: Record<string, unknown>) => GsapTimeline
  registerPlugin: (...plugins: unknown[]) => void
  utils: {
    toArray: <T extends Element>(selector: string) => T[]
  }
}

declare global {
  interface Window {
    gsap?: Gsap
    ScrollTrigger?: unknown
  }
}

function waitForGsap(): Promise<{ gsap: Gsap; scrollTrigger: unknown } | null> {
  return new Promise((resolve) => {
    if (window.gsap && window.ScrollTrigger) {
      resolve({ gsap: window.gsap, scrollTrigger: window.ScrollTrigger })
      return
    }

    let attempts = 0
    const timer = window.setInterval(() => {
      attempts += 1
      if (window.gsap && window.ScrollTrigger) {
        window.clearInterval(timer)
        resolve({ gsap: window.gsap, scrollTrigger: window.ScrollTrigger })
      }
      if (attempts > 100) {
        window.clearInterval(timer)
        resolve(null)
      }
    }, 25)
  })
}

async function initLandingMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('motion-enabled')
    return
  }

  const motion = await waitForGsap()
  if (!motion) {
    document.documentElement.classList.remove('motion-enabled')
    return
  }

  const { gsap, scrollTrigger } = motion
  gsap.registerPlugin(scrollTrigger)

  // Fade-up elements on scroll
  const fadeEls = gsap.utils.toArray<HTMLElement>('.reveal-up')
  fadeEls.forEach((el) => {
    // Skip if it's inside bento-section because we handle that with a timeline
    if (el.closest('.bento-section')) return

    const delay = parseFloat(el.dataset.delay || '0')
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
  })

  // Hero Mockup Parallax
  const mockup = document.querySelector<HTMLElement>('.hero-mockup')
  if (mockup) {
    gsap.to(mockup, {
      rotateX: 0,
      scale: 1,
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  // Pin features section in the center
  const bentoSection = document.querySelector('.bento-section')
  const bentoHeader = document.querySelector('.section-header')
  const bentoCards = gsap.utils.toArray<HTMLElement>('.bento-card')

  if (bentoSection && bentoHeader && bentoCards.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bentoSection,
        start: 'center center',
        end: '+=150%',
        pin: true,
        scrub: 1,
      },
    })

    tl.from(bentoHeader, {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: 'power2.out',
    })
    .from(bentoCards, {
      opacity: 0,
      y: 100,
      stagger: 0.5,
      duration: 2,
      ease: 'power3.out',
    })
  }

  // Nav fade in
  gsap.from('.premium-nav', {
    y: -30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out',
  })

  document.documentElement.classList.remove('motion-enabled')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingMotion, { once: true })
} else {
  void initLandingMotion()
}
