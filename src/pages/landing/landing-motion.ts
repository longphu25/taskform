type GsapTarget = string | Element | Element[]

type Gsap = {
  from: (targets: GsapTarget, vars: Record<string, unknown>) => unknown
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

  gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
    const delay = Number.parseFloat(el.dataset.delay || '0')
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    })
  })

  document.documentElement.classList.remove('motion-enabled')
}

document.documentElement.classList.add('motion-enabled')

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLandingMotion, { once: true })
} else {
  void initLandingMotion()
}
