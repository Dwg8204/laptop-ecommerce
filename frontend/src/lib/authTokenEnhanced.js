const TOKEN_COOKIE_NAME = "auth_token"

const isBrowser = typeof document !== "undefined"

const parseCookies = () => {
  if (!isBrowser) return {}

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const separatorIndex = pair.indexOf("=")
      const key = separatorIndex >= 0 ? pair.slice(0, separatorIndex) : pair
      const value = separatorIndex >= 0 ? pair.slice(separatorIndex + 1) : ""
      acc[key] = decodeURIComponent(value)
      return acc
    }, {})
}

export const getAuthToken = () => {
  const cookies = parseCookies()
  return cookies[TOKEN_COOKIE_NAME] || ""
}

export const setAuthToken = (token) => {
  if (!isBrowser || !token) return

  const maxAge = 60 * 60 * 24 * 7
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

export const clearAuthToken = () => {
  if (!isBrowser) return
  document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`
}
