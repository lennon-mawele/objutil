const PrimitiveTypes = ['number', 'string', 'boolean', 'undefined']
const isPrimitive = val => {
  return PrimitiveTypes.includes(typeof val) || val === null
}

export const walk = (obj, fn, path = '') => {
  if (!obj) return
  Object.keys(obj).forEach(key => {
    const nextNode = obj[key]
    const nextPath = path ? `${path}.${key}` : key
    fn(nextNode, nextPath)
    walk(nextNode, fn, nextPath)
  })
}

export const test = (obj1, obj2) => {
  if (isPrimitive(obj1) || isPrimitive(obj2)) return obj1 === obj2
  const keys = Object.keys(obj2)
  for (const key of keys) {
    if (!test(obj1[key], obj2[key])) return false
  }
  return true
}

export const get = (obj, at) => {
  if (!obj) return undefined
  if (!at) return obj
  const firstDot = at.indexOf('.')
  if (firstDot === -1) return obj[at]
  const firstKey = at.slice(0, firstDot)
  const restPath = at.slice(firstDot + 1)
  return get(obj[firstKey], restPath)
}

export const finset = (obj, at, fn) => {
  if (!obj || !at) return
  const firstDot = at.indexOf('.')
  if (firstDot === -1) {
    obj[at] = fn(obj[at])
  } else {
    const firstKey = at.slice(0, firstDot)
    const restPath = at.slice(firstDot + 1)
    finset(obj[firstKey], restPath, fn)
  }
  return obj
}

export const inset = (obj, at, val) => {
  return finset(obj, at, () => val)
}

export const fset = (obj, at, fn) => {
  if (!obj || !at) return obj
  const firstDot = at.indexOf('.')
  if (firstDot === -1) {
    return {...obj, [at]: fn(obj[at])}
  } else {
    const firstKey = at.slice(0, firstDot)
    const restPath = at.slice(firstDot + 1)
    return {...obj, [firstKey]: fset(obj[firstKey], restPath, fn)}
  }
}

export const set = (obj, at, val) => {
  return fset(obj, at, () => val)
}

export const exec = {
  on: obj => (...ops) => ops.reduce((cur, op) => op(cur), obj),
  set: (at, val) => obj => set(obj, at, val),
  fset: (at, fn) => obj => fset(obj, at, fn),
  inset: (at, val) => obj => inset(obj, at, val),
  finset: (at, fn) => obj => finset(obj, at, fn)
}

export const obtain = get
