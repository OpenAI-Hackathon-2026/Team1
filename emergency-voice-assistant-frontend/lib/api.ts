export interface Organization {
  id: string
  name: string
  services: string[]
  location: string
  phone?: string
  reason: string
}

export interface TranscribeResponse {
  text: string
}

export interface RouteResponse {
  organization: Organization
  reason?: string
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

// TODO: Keep this endpoint as the abstraction around embeddings, search, and routing.
export function findOrganization(text: string): Promise<RouteResponse> {
  return request<RouteResponse>('/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

// TODO: Replace with the TTS service response contract when your backend is ready.
export async function speakText(text: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.blob()
}

// TODO: The backend can use this organization ID to initiate a phone/API connection.
export function connectToOrganization(organizationId: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organizationId }),
  })
}

export function getUserFacingError(error: unknown, fallback: string): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'Microphone access was denied. Please allow microphone access and try again.'
  }
  if (error instanceof Error && error.message === 'NO_SPEECH') return 'We didn’t hear anything. Please try again.'
  return fallback
}

export { API_BASE_URL }

