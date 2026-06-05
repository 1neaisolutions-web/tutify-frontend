import path from 'path'
import { Config } from '@remotion/cli/config'

const srcRoot = path.resolve(process.cwd(), 'src')

Config.setEntryPoint('./src/remotion/index.ts')
Config.setVideoImageFormat('jpeg')
Config.setCodec('h264')
Config.setAudioCodec('aac')
Config.setPixelFormat('yuv420p')
Config.setConcurrency(4)

Config.overrideWebpackConfig((config) => {
  const existingAlias = config.resolve?.alias
  const alias =
    typeof existingAlias === 'object' && existingAlias !== null && !Array.isArray(existingAlias)
      ? existingAlias
      : {}

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...alias,
        '@': srcRoot,
      },
    },
  }
})
