/**
 * [buttonHandler 改变 button 元素样式：包括去除 border和 box-shadow, 背景色和文字颜色统一]
 */
import { addStyle } from './styleCache'
import { CLASS_NAME_PREFEX } from '../config'
// button块的处理相对比较简单，去除边框和阴影，设定好统一的背景色和文字，按钮块就处理完成了
function buttonHandler(ele, { color, excludes }) {
  if (excludes.indexOf(ele) > -1) return false
  const classname = CLASS_NAME_PREFEX + 'button'
  const rule = `{
    color: ${color} !important;
    background: ${color} !important;
    border: none !important;
    box-shadow: none !important;
  }`
  addStyle(`.${classname}`, rule)
  ele.classList.add(classname)
}

export default buttonHandler
