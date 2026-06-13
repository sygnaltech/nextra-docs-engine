import type { CSSProperties } from 'react'

interface YouTubeProps {
  /** Video ID — the `v=` query param, or the path segment in youtu.be/<id> URLs. */
  id: string
  /** Optional accessible title for the iframe. */
  title?: string
  /** Start playback at this many seconds. */
  start?: number
  /** Width:height ratio. Defaults to 16/9. Pass a tuple like [4, 3] to override. */
  aspectRatio?: [number, number]
}

const wrapperBase: CSSProperties = {
  position: 'relative',
  height: 0,
  overflow: 'hidden',
  margin: '1.5rem 0',
  borderRadius: 6,
  background: '#000'
}

const iframeStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 0
}

export function YouTube({ id, title, start, aspectRatio = [16, 9] }: YouTubeProps) {
  const [w, h] = aspectRatio
  const params = new URLSearchParams({ rel: '0' })
  if (start) params.set('start', String(start))
  const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`

  return (
    <div style={{ ...wrapperBase, paddingBottom: `${(h / w) * 100}%` }}>
      <iframe
        src={src}
        title={title ?? 'YouTube video'}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={iframeStyle}
      />
    </div>
  )
}
