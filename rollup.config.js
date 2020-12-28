import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  output: {
    dir: '.',
    exports: 'named',
    footer: 'module.exports = ReleaseVersionWebpackPlugin;',
    format: 'cjs',
  },
  // external,
  plugins: [
    typescript({
      declaration: true,
      declarationDir: '.',
    }),
  ],
}
