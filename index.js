'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var assert = require('assert');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var util = require('util');
var child_process = require('child_process');
var dateFns = require('date-fns');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var HtmlWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(HtmlWebpackPlugin);

const getReleaseVersion = async () => {
    const cwd = process.cwd();
    return Promise.all([
        await util.promisify(child_process.exec)('git rev-parse --short=8 HEAD', { cwd }),
    ]).then(([commit]) => {
        console.log('commit', commit);
        return `${commit.stdout.trimEnd()}@${dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`;
    });
};
class ReleaseVersionWebpackPlugin {
    constructor(options) {
        this.pluginName = 'ReleaseVersionWebpackPlugin';
        console.log('pluginDidMount', 'ReleaseVersionWebpackPlugin', options);
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(this.pluginName, compilation => {
            const [requiredPlugin] = compilation.options.plugins.filter(plugin => plugin instanceof HtmlWebpackPlugin__default['default']);
            assert__default['default'](requiredPlugin, 'Cannot find HTMLWebpackPlugin in compiler options');
            const hook = HtmlWebpackPlugin__default['default'].getHooks(compilation)
                .afterTemplateExecution;
            hook.tapPromise(this.pluginName, async (htmlPluginData) => {
                const info = await getReleaseVersion();
                const inject = HtmlWebpackPlugin__default['default'].createHtmlTagObject('script', undefined, `console.log("Release: ${info}");`);
                htmlPluginData.headTags.push(inject);
                return htmlPluginData;
            });
        });
    }
}

exports.ReleaseVersionWebpackPlugin = ReleaseVersionWebpackPlugin;
module.exports = ReleaseVersionWebpackPlugin;
