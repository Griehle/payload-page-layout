/**
 * Turns a Vimeo URL into an embeddable player URL, or null if it isn't one.
 * Handles vimeo.com/ID, player.vimeo.com/video/ID, and unlisted links
 * (vimeo.com/ID/HASH or ?h=HASH).
 */
export const getEmbedUrl = (input?: string | null): string | null => {
  if (!input) return null
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '')
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null

  const match = url.pathname.match(/(?:\/video)?\/(\d+)(?:\/([0-9a-f]+))?/i)
  if (!match) return null

  const [, id, pathHash] = match
  const hash = pathHash || url.searchParams.get('h')
  return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`
}
