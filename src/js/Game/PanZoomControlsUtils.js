

/**
    * Dimensions used in containment and focal point zooming
*/
function getDimensions(elem) {
    const parent = elem.parentNode;
    const style = window.getComputedStyle(elem)
    const parentStyle = window.getComputedStyle(parent)
    const rectElem = elem.getBoundingClientRect()
    const rectParent = parent.getBoundingClientRect()
    
    return {
        elem: {
            style,
            width: rectElem.width,
            height: rectElem.height,
            top: rectElem.top,
            bottom: rectElem.bottom,
            left: rectElem.left,
            right: rectElem.right,
            margin: getBoxStyle(elem, 'margin', style),
            border: getBoxStyle(elem, 'border', style)
        },
        parent: {
            style: parentStyle,
            width: rectParent.width,
            height: rectParent.height,
            top: rectParent.top,
            bottom: rectParent.bottom,
            left: rectParent.left,
            right: rectParent.right,
            padding: getBoxStyle(parent, 'padding', parentStyle),
            border: getBoxStyle(parent, 'border', parentStyle)
        }
    }
}

const prefixes = ['webkit', 'moz', 'ms'];
const prefixCache = {};
let divStyle
function getBoxStyle(elem, name, style) {
  if(!style) style = window.getComputedStyle(elem);
  // Support: FF 68+
  // Firefox requires specificity for border
  const suffix = name === 'border' ? 'Width' : ''
  return {
    left: getCSSNum(`${name}Left${suffix}`, style),
    right: getCSSNum(`${name}Right${suffix}`, style),
    top: getCSSNum(`${name}Top${suffix}`, style),
    bottom: getCSSNum(`${name}Bottom${suffix}`, style)
  }
}

function getCSSNum(name, style) {
  return parseFloat(style[getPrefixedName(name)]) || 0
}

function getPrefixedName(name) {
  if (prefixCache[name]) {
    return prefixCache[name]
  }
  const divStyle = createStyle()
  if (name in divStyle) {
    return (prefixCache[name] = name)
  }
  const capName = name[0].toUpperCase() + name.slice(1)
  let i = prefixes.length
  while (i--) {
    const prefixedName = `${prefixes[i]}${capName}`
    if (prefixedName in divStyle) {
      return (prefixCache[name] = prefixedName)
    }
  }
}
function createStyle() {
  if (divStyle) {
    return divStyle
  }
  return (divStyle = document.createElement('div').style)
}

