import webpack, { Compiler } from 'webpack'
import assert from 'assert'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { promisify } from 'util'
import { exec } from 'child_process'
import { format } from 'date-fns'

export class ReleaseVersionWebpackPlugin {
  pluginName = 'ReleaseVersionWebpackPlugin'

  // constructor(options?: unknown) {
  // console.log('pluginDidMount', 'ReleaseVersionWebpackPlugin', options)
  // }

  init(compilation: webpack.compilation.Compilation): void {
    const stats = compilation.getStats()
    if (stats.hasErrors()) {
      return
    }

    const [requiredPlugin] = (
      compilation.compiler.options.plugins || []
    ).filter(plugin => plugin instanceof HtmlWebpackPlugin)
    assert(requiredPlugin, 'Cannot find HTMLWebpackPlugin in compiler options')
  }

  async getReleaseVersion(): Promise<string> {
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

  apply(compiler: Compiler): void {
    const hooks = compiler.hooks
    if (hooks) {
      // webpack@^4.0.0
      hooks.compilation.tap(this.pluginName, compilation => {
        this.init(compilation)

        // html-webpack-plugin@^3.0.0
        if (compilation.hooks.htmlWebpackPluginAlterAssetTags) {
          compilation.hooks.htmlWebpackPluginAlterAssetTags.tapPromise(
            this.pluginName,
            async htmlPluginData => {
              const info = await this.getReleaseVersion()
              const injectTagObj = {
                tagName: 'script',
                attributes: {
                  type: 'text/javascript',
                },
                voidTag: false,
                innerHTML: `console.log("Release: ${info}");`,
              }
              htmlPluginData.head.push(injectTagObj)
              return htmlPluginData
            }
          )
        }

        // @TODO: Support html-webpack-plugin@>4
        // if (HtmlWebpackPlugin.getHooks) {
        //   afterTemplateExecutionHook = HtmlWebpackPlugin.getHooks(compilation)
        // }
      })
    } else {
      // TODO: Support webpack@^3.0.0
      // compilation.plugin(
      //   'html-webpack-plugin-alter-asset-tags',
      //   async (
      //     data: HtmlWebpackData,
      //     cb: (err: Error | null, data: HtmlWebpackData) => void
      //   ) => {
      //     const info = await this.getReleaseVersion()
      //     // @ts-ignore
      //     const inject = data.plugin.createHtmlTag({
      //       tagName: 'script',
      //       attributes: {
      //         type: 'text/javascript',
      //       },
      //       innerHTML: `console.log("Release: ${info}");`,
      //     })
      //     data.head.push(inject)
      //     cb(null, data)
      //   }
      // )
    }
  }
}
