const targetMap = new WeakMap()
let activeEffect = undefined
const effectStack = []
const isObject = type => Object.prototype.toString.call(type) === '[object Object]'

function effect(fn, options: {lazy: boolean; scheduler: any} = {lazy: false, scheduler: null}) {
  const effect = createEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}
function createEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.options = options
  return effect
}

function track(target, key) {
  if (activeEffect === undefined) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  // console.log('depsMap', target, depsMap)
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
  }
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  // console.log('depsMap----', depsMap)
  if (!depsMap) {
    return
  }
  let deps = depsMap.get(key)
  if (!deps) {
    return
  }
  const run = (effect, idx) => {
    if (effect.options.scheduler !== undefined) {
      effect.options.scheduler()
    } else {
      effect()
    }
  }
  console.log('deps', deps)
  deps.forEach(run)
}

function reactive(ob) {
  return new Proxy(ob, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key)
      track(target, key)
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value)
      trigger(target, key)
      return res
    },
  })
}

class ComputedEffect {
  _dirty: boolean
  setter: any
  getter: any
  private _value: any = null
  effect: any

  constructor(opt) {
    this._dirty = true
    const getterOrOpt =
      typeof opt === 'object'
        ? { getter: opt.getter, setter: opt.setter ? opt.setter : () => {} }
        : { getter: opt, setter: () => {} }
    this.setter = getterOrOpt.setter
    this.getter = getterOrOpt.getter
    this._value = null
    this.effect = effect(this.getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          trigger(this, 'value')
        }
      },
    })
  }

  get value() {
    if (this._dirty) {
      track(this, 'value')
      this._dirty = false
      this._value = this.effect()
    }
    return this._value
  }
  set value(newVal) {
    this.setter(newVal)
  }
}

class RefEffect {
  _value: string | object
  constructor(opt) {
    this._value = isObject(opt) ? reactive(opt) : opt
  }

  get value() {
    track(this, 'value')
    return this._value
  }
  set value(newValue) {
    this._value = newValue
    trigger(this, 'value')
    console.log('newValue', newValue)
  }
}

function computed(getterOrFn) {
  return new ComputedEffect(getterOrFn)
}

function ref(opt) {
  return new RefEffect(opt)
}
