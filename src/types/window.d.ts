/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/window.d.ts

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: any[]) => void
  }
}

export {}
