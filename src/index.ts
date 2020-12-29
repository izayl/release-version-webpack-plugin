import { Compiler } from 'webpack'
import assert from 'assert'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { promisify } from 'util'
import { exec } from 'child_process'
import { format } from 'date-fns'

const getReleaseVersion = async () => {
  const cwd = process.cwd()
  return Promise.all([
    await promisify(exec)('git rev-parse --short=8 HEAD', { cwd }),
    // await exec('git tag') // get tag info
  ]).then(([commit]) => {
    return `${commit.stdout.trimEnd()}@${format(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    )}`
  })
}
export class ReleaseVersionWebpackPlugin {
  pluginName = 'ReleaseVersionWebpackPlugin'

  // constructor(options?: unknown) {
  // console.log('pluginDidMount', 'ReleaseVersionWebpackPlugin', options)
  // }

  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap(this.pluginName, compilation => {
      const [requiredPlugin] = compilation.options.plugins.filter(
        plugin => plugin instanceof HtmlWebpackPlugin
      )
      assert(
        requiredPlugin,
        'Cannot find HTMLWebpackPlugin in compiler options'
      )

      const hook = HtmlWebpackPlugin.getHooks(compilation)
        .afterTemplateExecution

      hook.tapPromise(this.pluginName, async htmlPluginData => {
        const info = await getReleaseVersion()
        const inject = HtmlWebpackPlugin.createHtmlTagObject(
          'script',
          undefined,
          `console.log("Release: ${info}");`
        )
        htmlPluginData.headTags.push(inject)
        return htmlPluginData
      })
    })
  }
}
