function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object'
          ? child
          : createTextElement(child)
      ),
    }
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(element, container) {
  // const dom = document.createElement(element.type)
  // 兼容 TEXT_ELEMENT 类元素
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type)

  // assign dom props
  const isProperty = key => key !== 'children'
  Object.keys(element.props).filter(isProperty).forEach(key => {
    dom[key] = element.props[key]
  })

  // 遍历处理子元素
  element.props.children.forEach(child =>
    render(child, dom)
  )

  container.appendChild(dom)
}


const Didact = {
  createElement,
  render
}

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
const container = document.getElementById("root")
Didact.render(element, container)
