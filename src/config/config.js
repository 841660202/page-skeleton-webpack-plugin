'use strict'

const staticPath = '__webpack_page_skeleton__'

const defaultOptions = {
  port: '8989',
  // ['spin', 'chiaroscuro', 'shine'],
  loading: 'spin',
  // 该配置对象可以配置一个 color 字段，用于决定骨架页面中文字块的的颜色，颜色值支持16进制、RGB等。
  text: {
    color: '#EEEEEE',
  },
  // 该配置接受 3 个字段，color、shape、shapeOpposite。color 和 shape 用于确定骨架页面中图片块的颜色和形状，
  // 颜色值支持16 进制和 RGB等，形状支持两个枚举值，circle （矩形）和 rect（圆形）。
  // shapeOpposite 字段接受一个数组，数组中每个元素是一个 DOM 选择器，用于选择 DOM 元素，
  // 被选择 DOM 的形状将和配置的 shape 形状相反，例如，配置的是 rect那么，
  // shapeOpposite 中的图片块将在骨架页面中显示成 circle 形状（圆形），具体怎么配置可以参考该部分末尾的默认配置。
  image: {
    // `rect` | `circle`
    shape: 'rect',
    color: '#EFEFEF',
    shapeOpposite: [],
  },
  // 该配置接受两个字段，color 和 excludes。color 用来确定骨架页面中被视为按钮块的颜色，
  // excludes 接受一个数组，数组中元素是 DOM 选择器，用来选择元素，该数组中的元素将不被视为按钮块
  button: {
    color: '#EFEFEF',
    excludes: [],
  },
  // 该配置接受 3 个字段，color、shape、shapeOpposite。color 和 shape 用于确定骨架页面中 svg 块的颜色和形状，
  // 颜色值支持16 进制和 RGB等，同时也支持 transparent 枚举值，设置为 transparent 后，
  // svg 块将是透明块。形状支持两个枚举值，circle （矩形）和 rect（圆形）。
  // shapeOpposite 字段接受一个数组，数组中每个元素是一个 DOM 选择器，用于选择 DOM 元素，
  // 被选择 DOM 的形状将和配置的 shape 形状相反，例如，配置的是 rect那么，
  // shapeOpposite 中的 svg 块将在骨架页面中显示成 circle 形状（圆形），具体怎么配置可以参考该部分末尾的默认配置。
  svg: {
    // or transparent
    color: '#EFEFEF',
    // circle | rect
    shape: 'circle',
    shapeOpposite: [],
  },
  // 该配置接受两个字段，color 和 shape。color 用来确定骨架页面中被视为伪元素块的颜色，
  // shape 用来设置伪元素块的形状，接受两个枚举值：circle 和 rect。
  pseudo: {
    // or transparent
    color: '#EFEFEF',
    // circle | rect
    shape: 'circle',
    shapeOpposite: [],
  },
  device: 'iPhone 6 Plus',
  debug: false,
  minify: {
    minifyCSS: { level: 2 },
    removeComments: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: false,
  },
  defer: 5000,
  // 如果你有不需要进行骨架处理的元素，那么将该元素的 CSS 选择器写入该数组
  excludes: [],
  // 不需要生成页面骨架，且需要从 DOM 中移除的元素，配置值为移除元素的 CSS 选择器
  remove: [],
  // 不需要移除，但是通过设置其透明度为 0，来隐藏该元素，配置值为隐藏元素的 CSS 选择器。
  hide: [],
  // 该数组中元素是 CSS 选择器，被选择的元素将被被插件处理成一个色块，色块的颜色和按钮块颜色一致。内部元素将不再做特殊处理，文字将隐藏。
  grayBlock: [],
  cookies: [],
  headless: true,
  h5Only: false,
  // or 'vw|vh|vmin|vmax'
  // 其接受的枚举值rem, vw, vh, vmin, vmax。
  cssUnit: 'rem',
  // 生成骨架页面（shell.html）中 css 值保留的小数位数，默认值是 4。
  decimal: 4,
  logLevel: 'info',
  quiet: false,
  noInfo: false,
  logTime: true,
}

const htmlBeautifyConfig = {
  indent_size: 2,
  html: {
    end_with_newline: true,
    js: {
      indent_size: 2,
    },
    css: {
      indent_size: 2,
    },
  },
  css: {
    indent_size: 1,
  },
  js: {
    'preserve-newlines': true,
  },
}

module.exports = {
  htmlBeautifyConfig,
  defaultOptions,
  staticPath,
}
