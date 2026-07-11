const ACCESS_TOKEN_KEY = 'ironchat_access_token'
const REFRESH_TOKEN_KEY = 'ironchat_refresh_token'
const ACTIVE_CHAT_KEY = 'ironchat_active_chat_id'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function saveTokens(tokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  clearActiveChatId()
}

export function getActiveChatId() {
  return localStorage.getItem(ACTIVE_CHAT_KEY)
}

export function saveActiveChatId(chatId) {
  localStorage.setItem(ACTIVE_CHAT_KEY, chatId)
}

export function clearActiveChatId() {
  localStorage.removeItem(ACTIVE_CHAT_KEY)
}

export function hasSession() {
  return Boolean(getAccessToken())
}
