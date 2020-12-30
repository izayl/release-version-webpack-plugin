# ReleaseVersionWebpackPlugin

![CI](https://github.com/izayl/release-version-webpack-plugin/workflows/CI/badge.svg)
![npm](https://img.shields.io/npm/v/release-version-webpack-plugin)
![npm](https://img.shields.io/npm/dm/release-version-webpack-plugin)

A webpack plugin for automatic log current release commit hash and version from package.json.

-----

## Installation

```shell
# use npm
npm i release-version-webpack-plugin

# use yarn
yarn add release-version-webpack-plugin
```

## Usage

```js
import ReleaseVersionWebpackPlugin from 'release-version-webpack-plugin'

config.plugins.push(new ReleaseVersionWebpackPlugin())
```

By default, ReleaseVersionWebpackPlugin will inject a script to your entry html like this:

```js
<script>
console.log("env: PRODUCT", "dfae3d@2020-12-28 18:02:43")
<script>
```

the default format is `env: ${NODE_ENV} ${latest commit hash}@${latest build time}`.

<!-- ## Configuration

```ts
interface ReleaseVersionWebpackPluginOptions {

}
``` -->
