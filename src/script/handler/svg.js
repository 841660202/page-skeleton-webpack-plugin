import { emptyElement, removeElement, getOppositeShape, px2relativeUtil, setOpacity, addClassName } from '../util'
import { TRANSPARENT, CLASS_NAME_PREFEX } from '../config'
import { addStyle, shapeStyle } from './styleCache'
// 判断svg元素是否不可见，不可见则直接删除元素
function svgHandler(ele, { color, shape, shapeOpposite }, cssUnit, decimal) {
  const { width, height } = ele.getBoundingClientRect()

  if (width === 0 || height === 0 || ele.getAttribute('aria-hidden') === 'true') {
    return removeElement(ele)
  }
  // 非隐藏的元素，会把 svg 元素内部所有元素删除，减少最终生成的骨架页面体积，其次，设置svg 元素的宽、高和形状等。
  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape
  // 清空元素的内部结构  innerHTML = ''
  emptyElement(ele)

  const shapeClassName = CLASS_NAME_PREFEX + shape
  // 根据rect or cirle设置border-radius属性，同时set到styleCache
  shapeStyle(shape)

  Object.assign(ele.style, {
    width: px2relativeUtil(width, cssUnit, decimal),
    height: px2relativeUtil(height, cssUnit, decimal),
  })

  addClassName(ele, [shapeClassName])
  // color是自定义svg配置中的color属性,可设置16进制设置及transparent枚举值
  if (color === TRANSPARENT) {
    // 设置为透明块
    setOpacity(ele)
  } else {
    // 设置背景色
    const className = CLASS_NAME_PREFEX + 'svg'
    const rule = `{
      background: ${color} !important;
    }`
    addStyle(`.${className}`, rule)
    ele.classList.add(className)
  }
}

export default svgHandler
