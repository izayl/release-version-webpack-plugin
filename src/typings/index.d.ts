import HtmlWebpackPlugin from 'html-webpack-plugin'

declare module 'webpack' {
  namespace compilation {
    interface CompilationHooks {
      htmlWebpackPluginAlterAssetTags: HtmlWebpackPlugin.Hooks['htmlWebpackPluginAlterAssetTags']
    }
  }
}

interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo'}`
   */
  attributes: {
    [attributeName: string]: string | boolean
  }
  /**
   * Wether this html must not contain innerHTML
   * @see https://www.w3.org/TR/html5/syntax.html#void-elements
   */
  voidTag: boolean
  /**
   * The tag name e.g. `'div'`
   */
  tagName: string
  /**
   * Inner HTML The
   */
  innerHTML?: string
}

interface htmlWebpackData {
  AlterAssetTags: {
    head: HtmlTagObject[]
    body: HtmlTagObject[]
    outputName: string
    plugin: HtmlWebpackPlugin
  }
}
