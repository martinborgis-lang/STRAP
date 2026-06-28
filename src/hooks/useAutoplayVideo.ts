'use client'

import { useEffect, useRef } from 'react'

/**
 * Force le démarrage d'une vidéo autoplay, y compris sur iOS Safari
 * où `autoplay muted` ne suffit pas toujours. Si le `play()` initial est
 * bloqué, on réessaie à la première interaction utilisateur.
 *
 * Usage : `const videoRef = useAutoplayVideo()` puis `ref={videoRef}` sur <video>.
 */
export function useAutoplayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true

    let cleanup = () => {}

    const playVideo = async () => {
      try {
        await video.play()
      } catch {
        // Autoplay bloqué : on attend une interaction utilisateur.
        const handleInteraction = async () => {
          try {
            await video.play()
          } catch {
            /* toujours bloqué, on ignore */
          }
          document.removeEventListener('touchstart', handleInteraction)
          document.removeEventListener('click', handleInteraction)
        }
        document.addEventListener('touchstart', handleInteraction, {
          passive: true,
        })
        document.addEventListener('click', handleInteraction)
        cleanup = () => {
          document.removeEventListener('touchstart', handleInteraction)
          document.removeEventListener('click', handleInteraction)
        }
      }
    }

    playVideo()

    return () => cleanup()
  }, [])

  return videoRef
}
