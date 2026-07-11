import { clearTokens, getAccessToken, saveTokens } from './storage'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8001').replace(/\/$/, '')

async function readError(response) {
  try {
    const data = await response.json()
    return data.detail || data.message || 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearTokens()
    }

    throw new Error(await readError(response))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function signupUser({ username, email, password }) {
  return request('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export async function loginUser({ email, password }) {
  const form = new URLSearchParams()
  form.set('username', email)
  form.set('password', password)

  const tokens = await request('/auth/v1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })

  saveTokens(tokens)
  return tokens
}

export function getCurrentUser() {
  return request('/auth/v1/me')
}

export function getChats() {
  return request('/chat/all')
}

export function createChat() {
  return request('/chat/new', { method: 'POST' })
}

export async function sendChatMessage(chatId, content, onChunk) {
  const token = getAccessToken()
  const response = await fetch(`${API_URL}/chat/${chatId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  if (!response.body) {
    return ''
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    fullText += chunk
    onChunk?.(chunk, fullText)
  }

  return fullText
}
