import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './storage'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8001').replace(/\/$/, '')

// Ping the backend every 9 minutes to prevent Render free tier cold starts
setInterval(() => {
  fetch(`${API_URL}/health`).catch(() => {})
}, 9 * 60 * 1000)

async function readError(response) {
  try {
    const data = await response.json()
    return data.detail || data.message || 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    clearTokens()
    return null
  }

  const response = await fetch(`${API_URL}/auth/v1/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!response.ok) {
    clearTokens()
    return null
  }

  const tokens = await response.json()
  saveTokens(tokens)
  return tokens.access_token
}

function buildHeaders(options = {}, token = getAccessToken()) {
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

async function fetchWithAuth(path, options = {}) {
  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  })

  if (response.status !== 401) {
    return response
  }

  const newAccessToken = await refreshAccessToken()

  if (!newAccessToken) {
    return response
  }

  response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: buildHeaders(options, newAccessToken),
  })

  return response
}

async function request(path, options = {}) {
  const response = await fetchWithAuth(path, options)

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

export function updateChatTitle(chatId, title) {
  return request(`/chat/${chatId}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
  })
}

export function deleteChat(chatId) {
  return request(`/chat/${chatId}`, { method: 'DELETE' })
}

export function getChatMessages(chatId) {
  return request(`/chat/${chatId}/messages`)
}

export async function sendChatMessage(chatId, content, onChunk) {
  const response = await fetchWithAuth(`/chat/${chatId}/message`, {
    method: 'POST',
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
