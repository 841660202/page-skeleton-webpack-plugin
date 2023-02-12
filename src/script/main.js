import { $$, $, getComputedStyle, checkHasPseudoEle, inViewPort, checkHasBorder, isBase64Img, transparent, checkHasTextDecoration, removeElement, setOpacity } from './util'
import { DISPLAY_NONE, Node, EXT_REG, TRANSPARENT, GRADIENT_REG, PRE_REMOVE_TAGS, MOCK_TEXT_ID, AFTER_REMOVE_TAGS, CONSOLE_SELECTOR } from './config'
import * as handler from './handler/index.js'
import { addSpin, addShine, addBlick } from './animation/index.js'
import styleCache from './handler/styleCache'

function traverse(options) {
  const { remove, excludes, text, image, button, svg, grayBlock, pseudo, cssUnit, decimal } = options
  const excludesEle = excludes.length ? Array.from($$(excludes.join(','))) : []
  const grayEle = grayBlock.length ? Array.from($$(grayBlock.join(','))) : []
  const rootElement = document.documentElement

  const texts = []
  const buttons = []
  const hasImageBackEles = []
  let toRemove = []
  const imgs = []
  const svgs = []
  const pseudos = []
  const gradientBackEles = []
  const grayBlocks = []

  if (Array.isArray(remove)) {
    remove.push(CONSOLE_SELECTOR, ...PRE_REMOVE_TAGS)
    toRemove.push(...$$(remove.join(',')))
  }

  if (button && button.excludes.length) {
    // translate selector to element
    button.excludes = Array.from($$(button.excludes.join(',')))
  }

  ;[svg, pseudo, image].forEach((type) => {
    if (type.shapeOpposite.length) {
      type.shapeOpposite = Array.from($$(type.shapeOpposite.join(',')))
    }
  })
  // 递归遍历DOM树，将DOM分类成文本块、按钮块、图片块、SVG块、伪类元素块等。
  // ele 为 document.documentElement; 递归遍历DOM树
  ;(function preTraverse(ele) {
    // styles为元素中所有可用的css属性列表
    const styles = getComputedStyle(ele)
    // 检查元素是否有伪元素
    const hasPseudoEle = checkHasPseudoEle(ele)
    // 判断元素是否在可视区域内（是否是首屏元素），非首屏元素将要移除
    if (!inViewPort(ele) || DISPLAY_NONE.test(ele.getAttribute('style'))) {
      return toRemove.push(ele)
    }
    // 自定义要处理为色块的元素
    if (~grayEle.indexOf(ele)) {
      // eslint-disable-line no-bitwise
      return grayBlocks.push(ele)
    }
    if (~excludesEle.indexOf(ele)) return false // eslint-disable-line no-bitwise

    if (hasPseudoEle) {
      pseudos.push(hasPseudoEle)
    }

    if (checkHasBorder(styles)) {
      ele.style.border = 'none'
    }
    // 列表元素统一处理为默认样式
    if (ele.children.length > 0 && /UL|OL/.test(ele.tagName)) {
      handler.list(ele)
    }
    // 有子节点遍历处理
    if (ele.children && ele.children.length > 0) {
      Array.from(ele.children).forEach((child) => preTraverse(child))
    }

    // 将所有拥有 textChildNode 子元素的元素的文字颜色设置成背景色，这样就不会在显示文字了。
    if (ele.childNodes && Array.from(ele.childNodes).some((n) => n.nodeType === Node.TEXT_NODE)) {
      transparent(ele)
    }
    // 统一文本下划线的颜色
    if (checkHasTextDecoration(styles)) {
      ele.style.textDecorationColor = TRANSPARENT
    }
    // 隐藏所有 svg 元素
    if (ele.tagName === 'svg') {
      return svgs.push(ele)
    }
    // 有背景色或背景图的元素
    if (EXT_REG.test(styles.background) || EXT_REG.test(styles.backgroundImage)) {
      return hasImageBackEles.push(ele)
    }
    // 背景渐变元素
    if (GRADIENT_REG.test(styles.background) || GRADIENT_REG.test(styles.backgroundImage)) {
      return gradientBackEles.push(ele)
    }
    if (ele.tagName === 'IMG' || isBase64Img(ele)) {
      return imgs.push(ele)
    }
    if (ele.nodeType === Node.ELEMENT_NODE && (ele.tagName === 'BUTTON' || (ele.tagName === 'A' && ele.getAttribute('role') === 'button'))) {
      return buttons.push(ele)
    }
    if (ele.childNodes && ele.childNodes.length === 1 && ele.childNodes[0].nodeType === Node.TEXT_NODE && /\S/.test(ele.childNodes[0].textContent)) {
      return texts.push(ele)
    }
  })(rootElement)
  // 将分类好的文本块、图片块等处理生成骨架结构代码
  svgs.forEach((e) => handler.svg(e, svg, cssUnit, decimal))
  texts.forEach((e) => handler.text(e, text, cssUnit, decimal))
  buttons.forEach((e) => handler.button(e, button))
  hasImageBackEles.forEach((e) => handler.background(e, image))
  imgs.forEach((e) => handler.image(e, image))
  pseudos.forEach((e) => handler.pseudos(e, pseudo))
  gradientBackEles.forEach((e) => handler.background(e, image))
  grayBlocks.forEach((e) => handler.grayBlock(e, button))

  // remove mock text wrapper
  const offScreenParagraph = $(`#${MOCK_TEXT_ID}`)
  if (offScreenParagraph && offScreenParagraph.parentNode) {
    toRemove.push(offScreenParagraph.parentNode)
  }
  toRemove.forEach((e) => removeElement(e))
}

function genSkeleton(options) {
  const { remove, hide, loading = 'spin' } = options
  /**
   * before walk
   */
  // 将 `hide` 队列中的元素通过调节透明度为 0 来进行隐藏
  if (hide.length) {
    const hideEle = $$(hide.join(','))
    Array.from(hideEle).forEach((ele) => setOpacity(ele))
  }
  /**
   * walk in process
   */

  traverse(options)
  /**
   * add `<style>`
   */
  let rules = ''

  for (const [selector, rule] of styleCache) {
    rules += `${selector} ${rule}\n`
  }

  const styleEle = document.createElement('style')

  if (!window.createPopup) {
    // For Safari
    styleEle.appendChild(document.createTextNode(''))
  }
  styleEle.innerHTML = rules
  if (document.head) {
    document.head.appendChild(styleEle)
  } else {
    document.body.appendChild(styleEle)
  }
  /**
   * add animation of skeleton page when loading
   */
  switch (loading) {
    case 'chiaroscuro':
      addBlick()
      break
    case 'spin':
      addSpin()
      break
    case 'shine':
      addShine()
      break
    default:
      addSpin()
      break
  }
}

function getHtmlAndStyle() {
  const root = document.documentElement
  const rawHtml = root.outerHTML
  const styles = Array.from($$('style')).map((style) => style.innerHTML || style.innerText)
  Array.from($$(AFTER_REMOVE_TAGS.join(','))).forEach((ele) => removeElement(ele))
  // fix html parser can not handle `<div ubt-click=3659 ubt-data="{&quot;restaurant_id&quot;:1236835}" >`
  // need replace `&quot;` into `'`
  // 解析替换
  const cleanedHtml = document.body.innerHTML.replace(/&quot;/g, "'")
  return {
    rawHtml,
    styles,
    cleanedHtml,
  }
}

export { genSkeleton, getHtmlAndStyle }
