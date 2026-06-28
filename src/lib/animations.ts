'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

const isClient = () => typeof window !== 'undefined'

/** 1. Hero title entrance — lignes en cascade */
export function animateHeroTitle(lines: Element[]) {
  if (!isClient()) return
  gsap.from(lines, {
    opacity: 0,
    y: 60,
    duration: 0.9,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.3,
  })
}

/** 2. SplitText reveal au scroll — retourne un cleanup */
export function animateTextReveal(element: Element, trigger?: Element) {
  if (!isClient()) return () => {}
  const split = new SplitText(element, { type: 'words,chars' })
  const tween = gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    rotateX: -80,
    stagger: 0.015,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top 75%',
    },
  })
  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    split.revert()
  }
}

/** 3. Fade in up générique */
export function fadeInUp(element: Element, delay = 0) {
  if (!isClient()) return
  gsap.from(element, {
    opacity: 0,
    y: 40,
    duration: 0.7,
    delay,
    ease: 'power2.out',
    scrollTrigger: { trigger: element, start: 'top 80%' },
  })
}

/** 4. Stagger batch — ProductCards */
export function staggerCards(cards: Element[]) {
  if (!isClient() || cards.length === 0) return
  ScrollTrigger.batch(cards, {
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        overwrite: true,
      }),
    start: 'top 85%',
  })
}

/** 5. Parallax scroll */
export function parallaxElement(element: Element, speed = 0.5) {
  if (!isClient()) return
  gsap.to(element, {
    y: () => -ScrollTrigger.maxScroll(window) * speed * 0.1,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/** 6. Accent line slide-in */
export function accentLineSlide(element: Element) {
  if (!isClient()) return
  gsap.from(element, {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: element, start: 'top 80%' },
  })
}

/** 7. Horizontal scroll pinné — MaterialsSection */
export function initHorizontalScroll(wrapper: Element, panels: Element[]) {
  if (!isClient() || panels.length === 0) return
  const totalWidth = panels.length * window.innerWidth
  return gsap.to(panels, {
    x: () => -(totalWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  })
}

/** 8. Navbar scroll state */
export function initNavbarScroll(navbar: Element) {
  if (!isClient()) return
  ScrollTrigger.create({
    start: 80,
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  })
}
