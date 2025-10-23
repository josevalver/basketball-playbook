import React from 'react'

export default function VideoPlayer({ src }) {
  const BASE = import.meta.env.BASE_URL || '/'
  const withBase = (s) => (typeof s === 'string' && s.startsWith('/')) ? `${BASE.replace(/\/$/, '')}${s}` : s

  const url = withBase(src)
  const isYouTube = /youtube\.com|youtu\.be/.test(url)
  if (isYouTube) {
    const u = new URL(url)
    const id = u.searchParams.get('v') || url.split('/').pop()
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden ring-1 ring-white/10">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${id}`}
          title="Play video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }
  return <video src={url} controls className="w-full rounded-2xl ring-1 ring-white/10" />
}
