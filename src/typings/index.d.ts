import HtmlWebpackPlugin from 'html-webpack-plugin'

declare module 'webpack' {
  namespace compilation {
    interface CompilationHooks {
      htmlWebpackPluginAlterAssetTags: HtmlWebpackPlugin.Hooks['htmlWebpackPluginAlterAssetTags']
    }
  }
}
