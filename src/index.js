import { promises as fs } from 'fs'
import fetch from 'node-fetch'

import {
  PLACEHOLDERS,
  YOUTUBE_PEDROELHUMANO_CHANNEL_ID,
  NUMBER_OF
} from './constants.js'

const { YOUTUBE_API_KEY } = process.env

// Get Youtube Videos
const getLatestYoutubeVideos = (
  { channelId } = { channelId: YOUTUBE_PEDROELHUMANO_CHANNEL_ID }
) =>
  fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${NUMBER_OF.YOUTUBE_VIDEOS}`
  )
    .then((res) => res.json())
    .then((videos) => videos.items)

const generateYoutubeHTML = ({ title, videoId }) => `
<a href='https://youtu.be/${videoId}' target='_blank'>
  <img width='30%' src='https://img.youtube.com/vi/${videoId}/mqdefault.jpg' alt='${title}' />
</a>`;

// Generate ReadmeFile
(async () => {
  const [template, youtubeVideosResponse] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getLatestYoutubeVideos()
  ])

  const latestYoutubeVideos = youtubeVideosResponse
    .map(({ id, snippet }) => {
      const { title } = snippet
      const { videoId } = id
      return generateYoutubeHTML({ videoId, title })
    })
    .join('')
  const newMarkdown = template.replace(
    PLACEHOLDERS.LATEST_YOUTUBE,
    latestYoutubeVideos
  )
  await fs.writeFile('README.md', newMarkdown)
})()
