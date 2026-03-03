'use client'

import { useEffect } from 'react'
import AOS from 'aos'

export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-quart',
      offset: 60,
    })
  }, [])

  return null
}
