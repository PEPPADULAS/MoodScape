'use client'

import { useEffect, useState } from 'react'

export default function TestReminders() {
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        console.log('Fetching reminders...')
        const response = await fetch('/api/calendar/reminders/due')
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Reminders data:', data)
          setReminders(data)
        } else {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          setError(`HTTP ${response.status}: ${errorText}`)
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError(`Network error: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchReminders()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Reminders API</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {reminders.length > 0 && (
        <div>
          <h2>Reminders:</h2>
          <pre>{JSON.stringify(reminders, null, 2)}</pre>
        </div>
      )}
      {reminders.length === 0 && !loading && !error && (
        <p>No reminders found</p>
      )}
    </div>
  )
}