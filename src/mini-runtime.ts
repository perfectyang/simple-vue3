// const appConfig = {
//   render() {
//     return <div>111</div>
//   },
// }

// const app = createApp(appConfig, { state: '1' })
// app.mount('#app')

const nodeOps = {
  setText: (el, txt) => (el.setText = txt),
}

let render
function ensureRenderer() {
  return render || (render = createRenderer(nodeOps))
}

function createApp(...args) {
  return ensureRenderer().createApp(...args)
}
const isString = (type) =>
  Object.prototype.toString.call(type) === '[object String]'

const ShapeFlags = {
  ELEMENT: 1,
  STATE_COMPONENT: 1 << 3,
}

function createVNode(type, props) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATE_COMPONENT
  return {
    _is_vnode: true,
    type,
    children: null,
    props,
    shapeFlag,
  }
}

function createAppApI(render) {
  return function createApp(rootComponent, rootProps) {
    const app = {
      mount(rootContainer) {
        const vnode = createVNode(rootComponent, rootProps)
        render(vnode, rootContainer)
      },
    }
    return app
  }
}

function createRenderer(nodeOps) {
  const render = (vnode, container) => {}
  return {
    createApp: createAppApI(render),
  }
}
