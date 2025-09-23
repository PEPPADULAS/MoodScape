"use client"

import { useEffect, useState } from 'react'
import { ThemedSelect } from '@/components/ui/themed-input'
import { useTheme } from '@/contexts/theme-context'
import { getFontStack } from '@/lib/utils'
import { getFontClass } from '@/lib/fonts'

export default function SettingsPage() {
  const { theme } = useTheme()
  const [defaultFont, setDefaultFont] = useState<string>('')
  const [defaultLanguage, setDefaultLanguage] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/user/settings')
        if (res.ok) {
          const s = await res.json()
          if (s?.defaultFont) setDefaultFont(s.defaultFont)
          if (s?.defaultLanguage) setDefaultLanguage(s.defaultLanguage)
        }
      } catch {}
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultFont: defaultFont || null, defaultLanguage: defaultLanguage || null })
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`max-w-2xl mx-auto p-6 ${theme.text}`}>
      <h1 className="text-2xl font-semibold mb-6">Preferences</h1>

      <div className={`${theme.card} rounded-xl p-6 mb-6`}>
        <h2 className="text-lg font-medium mb-4">Default Writing Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Font</label>
            <ThemedSelect value={defaultFont} onChange={(e) => setDefaultFont(e.target.value)} className={getFontClass(defaultFont)}>
              <option value="">System Default</option>
              <option value="inter" className={getFontClass('inter')}>Inter</option>
              <option value="poppins" className={getFontClass('poppins')}>Poppins</option>
              <option value="merriweather" className={getFontClass('merriweather')}>Merriweather</option>
              <option value="playfair" className={getFontClass('playfair')}>Playfair Display</option>
              <option value="dancing-script" className={getFontClass('dancing-script')}>Dancing Script</option>
              <option value="pacifico" className={getFontClass('pacifico')}>Pacifico</option>
              <option value="caveat" className={getFontClass('caveat')}>Caveat</option>
              <option value="special-elite" className={getFontClass('special-elite')}>Special Elite</option>
              <option value="roboto-mono" className={getFontClass('roboto-mono')}>Roboto Mono</option>
            </ThemedSelect>
            <div className={`mt-2 text-sm ${getFontClass(defaultFont) || ''}`} style={{ fontFamily: defaultFont ? getFontStack(defaultFont) : undefined }}>
              Preview: The quick brown fox jumps over the lazy dog.
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Language</label>
            <ThemedSelect value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)}>
              <option value="">Follow System</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
            </ThemedSelect>
            <div className="mt-2 text-sm" lang={defaultLanguage || undefined}>
              Preview: नमस्ते • নমস্কার • Hello
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={saving} className={`px-5 py-2 rounded-lg text-white ${theme.button} disabled:opacity-50`}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}
