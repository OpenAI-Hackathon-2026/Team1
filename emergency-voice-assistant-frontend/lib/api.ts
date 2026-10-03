export interface TranscribeResponse {
  text: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

// TODO: Replace the endpoint with your local Whisper transcription service.
export function transcribeAudio(audioBlob: Blob): Promise<TranscribeResponse> {
  const formData = new FormData()
  formData.append('audio', audioBlob, `recording.${audioBlob.type.includes('wav') ? 'wav' : 'webm'}`)
  return request<TranscribeResponse>('/api/transcribe', { method: 'POST', body: formData })
}

export function getUserFacingError(error: unknown, fallback: string): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'Microphone access was denied. Please allow microphone access and try again.'
  }
  if (error instanceof Error && error.message === 'NO_SPEECH') return 'We didn’t hear anything. Please try again.'
  return fallback
}

export { API_BASE_URL }
