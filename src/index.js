import { promises as fs } from 'fs'
import { getLatestYoutubeVideos, generateYoutubeHTML } from './youtube.js'
import {
  PLACEHOLDERS,
  YOUTUBE_WOTANCODE_CHANNEL_ID,
  NUMBER_OF
} from './constants.js';

// Generate ReadmeFile
(async () => {
  const [template, youtubeVideosResponse] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getLatestYoutubeVideos(YOUTUBE_WOTANCODE_CHANNEL_ID, NUMBER_OF)
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
