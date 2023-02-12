'use strict'

const merge = require('lodash/merge')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const optionsSchema = require('./config/optionsSchema.json')
const Server = require('./server')
const { addScriptTag, outputSkeletonScreen, snakeToCamel } = require('./util')
const { defaultOptions, staticPath } = require('./config/config')
const OptionsValidationError = require('./config/optionsValidationError')

const EVENT_LIST = process.env.NODE_ENV === 'production' ? ['watch-close', 'failed', 'done'] : ['watch-close', 'failed']

const PLUGIN_NAME = 'pageSkeletonWebpackPlugin'

function SkeletonPlugin(options = {}) {
  const validationErrors = webpack.validateSchema(optionsSchema, options)
  if (validationErrors.length) {
    throw new OptionsValidationError(validationErrors)
  }
  // https://www.lodashjs.com/docs/lodash.merge
  this.options = merge({ staticPath }, defaultOptions, options)
  this.server = null
  this.originalHtml = ''
}

SkeletonPlugin.prototype.createServer = function () {
  // eslint-disable-line func-names
  // const server = this.server = new Server(this.options) // eslint-disable-line no-multi-assign
  // server.listen().catch(err => server.log.warn(err))

  if (!this.server) {
    const server = (this.server = new Server(this.options)) // eslint-disable-line no-multi-assign
    server.listen().catch((err) => server.log.warn(err))
  }

  // 作者：昭光
  // 链接：https://juejin.cn/post/6844904177936629774
  // 来源：稀土掘金
  // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
}

SkeletonPlugin.prototype.insertScriptToClient = function (htmlPluginData) {
  // eslint-disable-line func-names
  // at develop phase, insert the interface code
  if (process.env.NODE_ENV !== 'production') {
    const { port } = this.options
    const clientEntry = `http://localhost:${port}/${staticPath}/index.bundle.js`
    const oldHtml = htmlPluginData.html
    htmlPluginData.html = addScriptTag(oldHtml, clientEntry, port)
  }
}

SkeletonPlugin.prototype.outputSkeletonScreen = async function () {
  // eslint-disable-line func-names
  try {
    // 根据配置和originalHtml路径和配置信息将骨架屏写入到shell位置
    await outputSkeletonScreen(this.originalHtml, this.options, this.server.log.info)
  } catch (err) {
    this.server.log.warn(err.toString())
  }
}

SkeletonPlugin.prototype.apply = function (compiler) {
  // eslint-disable-line func-names
  // 高版本
  if (compiler.hooks) {
    // 在 webpack 选项中的 entry 被处理过之后调用。
    compiler.hooks.entryOption.tap(PLUGIN_NAME, () => {
      this.createServer()
    })
    // compilation 创建之后执行。
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // htmlWebpackPluginBefore
      const htmlWebpackPluginBeforeHtmlProcessing =
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing || htmlWebpackPlugin.getHooks(compilation).afterTemplateExecution

      htmlWebpackPluginBeforeHtmlProcessing.tapAsync(PLUGIN_NAME, (htmlPluginData, callback) => {
        this.insertScriptToClient(htmlPluginData)
        callback(null, htmlPluginData)
      })

      // htmlWebpackPluginAfter
      const htmlWebpackPluginAfterHtmlProcessing = compilation.hooks.htmlWebpackPluginAfterHtmlProcessing || htmlWebpackPlugin.getHooks(compilation).beforeEmit

      htmlWebpackPluginAfterHtmlProcessing.tapAsync(PLUGIN_NAME, (htmlPluginData, callback) => {
        this.originalHtml = htmlPluginData.html
        callback(null, htmlPluginData)
      })
    })
    // 输出 asset 到 output 目录之后执行。这个钩子 不会 被复制到子编译器
    compiler.hooks.afterEmit.tap(PLUGIN_NAME, async () => {
      await this.outputSkeletonScreen()
    })
    // watch-close 在一个观察中的 compilation 停止时执行
    // fail 在 compilation 失败时调用
    // done 在 compilation 完成时执行
    EVENT_LIST.forEach((event) => {
      compiler.hooks[snakeToCamel(event)].tap(PLUGIN_NAME, () => {
        if (this.server) {
          this.server.close()
        }
      })
    })
    // 低版本
  } else {
    compiler.plugin('entry-option', () => {
      this.createServer()
    })

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
        this.insertScriptToClient(htmlPluginData)
        callback(null, htmlPluginData)
      })
      compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
        this.originalHtml = htmlPluginData.html
        callback(null, htmlPluginData)
      })
    })

    compiler.plugin('after-emit', async (compilation, done) => {
      await this.outputSkeletonScreen()
      done()
    })

    EVENT_LIST.forEach((event) => {
      compiler.plugin(event, () => {
        if (this.server) {
          this.server.close()
        }
      })
    })
  }
}

module.exports = SkeletonPlugin
