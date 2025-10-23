import React from 'react'


export default function VideoPlayer({ src }) {
const isYouTube = /youtube\.com|youtu\.be/.test(src)
if (isYouTube) {
const url = new URL(src)
const id = url.searchParams.get('v') || src.split('/').pop()
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
return (
<video src={src} controls className="w-full rounded-2xl ring-1 ring-white/10" />
)
}