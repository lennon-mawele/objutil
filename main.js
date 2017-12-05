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

export const setin = (obj, at, val) => {
  if (!obj || !at) return
  const firstDot = at.indexOf('.')
  if (firstDot === -1) {
    obj[at] = typeof val === 'function' ? val(obj[at]) : val
  } else {
    const firstKey = at.slice(0, firstDot)
    const restPath = at.slice(firstDot + 1)
    setin(obj[firstKey], restPath, val)
  }
  return obj
}

export const set = (obj, at, val) => {
  if (!obj || !at) return obj
  const firstDot = at.indexOf('.')
  if (firstDot === -1) {
    return {...obj, [at]: typeof val === 'function' ? val(obj[at]) : val}
  } else {
    const firstKey = at.slice(0, firstDot)
    const restPath = at.slice(firstDot + 1)
    return {...obj, [firstKey]: set(obj[firstKey], restPath, val)}
  }
}

export const exec = {
  on: obj => (...ops) => ops.reduce((cur, op) => op(cur), obj),
  set: (at, val) => obj => set(obj, at, val),
  setin: (at, val) => obj => setin(obj, at, val)
}
