import { Inter, Poppins, Merriweather, Playfair_Display, Dancing_Script, Pacifico, Caveat, Special_Elite, Roboto_Mono } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
export const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-poppins', display: 'swap' })
export const merriweather = Merriweather({ subsets: ['latin'], weight: ['300','400','700'], variable: '--font-merriweather', display: 'swap' })
export const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-playfair', display: 'swap' })
export const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-dancing-script', display: 'swap' })
export const pacifico = Pacifico({ subsets: ['latin'], weight: '400', variable: '--font-pacifico', display: 'swap' })
export const caveat = Caveat({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-caveat', display: 'swap' })
export const specialElite = Special_Elite({ subsets: ['latin'], weight: '400', variable: '--font-special-elite', display: 'swap' })
export const robotoMono = Roboto_Mono({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-roboto-mono', display: 'swap' })

export function getFontClass(fontKey?: string): string | undefined {
  switch (fontKey) {
    case 'inter': return inter.className
    case 'poppins': return poppins.className
    case 'merriweather': return merriweather.className
    case 'playfair': return playfair.className
    case 'dancing-script': return dancingScript.className
    case 'pacifico': return pacifico.className
    case 'caveat': return caveat.className
    case 'special-elite': return specialElite.className
    case 'roboto-mono': return robotoMono.className
    default: return undefined
  }
}

export const allFontVariables = [
  inter.variable,
  poppins.variable,
  merriweather.variable,
  playfair.variable,
  dancingScript.variable,
  pacifico.variable,
  caveat.variable,
  specialElite.variable,
  robotoMono.variable,
].join(' ')


