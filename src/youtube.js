import fetch from 'node-fetch'

const { YOUTUBE_API_KEY } = process.env

export const getLatestYoutubeVideos = async (channelId, maxResults) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`
  )
  const videos = await response.json()
  return videos.items
}

export const generateYoutubeHTML = ({ title, videoId }) => `
<a href='https://youtu.be/${videoId}' target='_blank'>
  <img width='30%' src='https://img.youtube.com/vi/${videoId}/mqdefault.jpg' alt='${title}' />
</a>`
