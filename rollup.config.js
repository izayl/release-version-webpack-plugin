import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: {
    dir: '.',
    exports: 'named',
    footer: 'module.exports = ReleaseVersionWebpackPlugin;',
    format: 'cjs',
  },
  external: [
    'assert',
    'html-webpack-plugin',
    'child_process',
    'date-fns',
    'util',
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: '.',
    }),
  ],
}
