import fs from 'fs'
import path from 'path'
import { ReleaseVersionWebpackPlugin } from '../../src'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const OUTPUT_PATH = path.resolve(__dirname, './dist')

const compilation = async () =>
  new Promise<webpack.Stats>((resolve, reject) =>
    webpack(
      {
        entry: './tests/__mocks__/index.js',
        output: {
          path: OUTPUT_PATH,
        },
        plugins: [new HtmlWebpackPlugin(), new ReleaseVersionWebpackPlugin()],
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (err, stats) => (err ? reject(err) : resolve(stats!))
    )
  )

describe('ReleaseVersionWebpackPlugin at webpack@3 & html-webpack-plugin@3', () => {
  it('should exist', async () => {
    const result = await compilation()

    const plugin = (result.compilation.compiler.options.plugins || []).find(
      p => p instanceof ReleaseVersionWebpackPlugin
    )
    expect(plugin).toBeDefined()
  })
  it('should log at .html', async () => {
    await compilation()
    const htmlContent = fs
      .readFileSync(path.join(OUTPUT_PATH, 'index.html'), { encoding: 'utf-8' })
      .toString()
    const reg = /Release: [a-zA-Z0-9]{8}@\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
    expect(reg.test(htmlContent)).toBeTruthy()
    if (!reg.test(htmlContent)) console.log(htmlContent)
  })
})
