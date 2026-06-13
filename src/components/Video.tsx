import type { CSSProperties, VideoHTMLAttributes } from 'react'

interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  /** Single source URL, or an array of sources with MIME types for multi-format fallback. */
  src: string | { src: string; type?: string }[]
  /** Poster image shown before playback. */
  poster?: string
}

const videoStyle: CSSProperties = {
  width: '100%',
  height: 'auto',
  borderRadius: 6,
  margin: '1.5rem 0',
  background: '#000'
}

export function Video({
  src,
  poster,
  controls = true,
  preload = 'metadata',
  playsInline = true,
  style,
  ...rest
}: VideoProps) {
  const sources = Array.isArray(src) ? src : [{ src }]

  return (
    <video
      controls={controls}
      preload={preload}
      playsInline={playsInline}
      poster={poster}
      style={{ ...videoStyle, ...style }}
      {...rest}
    >
      {sources.map((s, i) => (
        <source key={i} src={s.src} type={s.type} />
      ))}
    </video>
  )
}
