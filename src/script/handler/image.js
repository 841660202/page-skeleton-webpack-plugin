import { SMALLEST_BASE64 as src, CLASS_NAME_PREFEX } from '../config'
import { getOppositeShape, setAttributes, addClassName } from '../util'
import { addStyle, shapeStyle } from './styleCache'
// 设置元素宽高、1*1像素透明gif图的base64编码值填充图片
// 设置背景色、形状
// 去除无用属性（alt）
function imgHandler(ele, { color, shape, shapeOpposite }) {
  const { width, height } = ele.getBoundingClientRect()
  const attrs = {
    width,
    height,
    src, // 1*1像素透明gif图
  }

  const finalShape = shapeOpposite.indexOf(ele) > -1 ? getOppositeShape(shape) : shape

  setAttributes(ele, attrs)

  const className = CLASS_NAME_PREFEX + 'image'
  const shapeName = CLASS_NAME_PREFEX + finalShape
  const rule = `{
    background: ${color} !important;
  }`
  addStyle(`.${className}`, rule)
  shapeStyle(finalShape)

  addClassName(ele, [className, shapeName])

  if (ele.hasAttribute('alt')) {
    ele.removeAttribute('alt')
  }
}

export default imgHandler
