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

export const jump = (obj, to) => {
  if (!obj) return undefined
  if (!to) return obj
  const firstDot = to.indexOf('.')
  if (firstDot === -1) return obj[to]
  const firstKey = to.slice(0, firstDot)
  const restPath = to.slice(firstDot + 1)
  return jump(obj[firstKey], restPath)
}

export const test = (obj1, obj2) => {
  if (isPrimitive(obj1) || isPrimitive(obj2)) return obj1 === obj2
  const keys = Object.keys(obj2)
  for (const key of keys) {
    if (!test(obj1[key], obj2[key])) return false
  }
  return true
}

export const mutate = (obj, at, val) => {
  if (!obj || !at) return
  const firstDot = at.indexOf('.')
  if (firstDot === -1) {
    obj[at] = typeof val === 'function' ? val(obj[at]) : val
  } else {
    const firstKey = at.slice(0, firstDot)
    const restPath = at.slice(firstDot + 1)
    mutate(obj[firstKey], restPath, val)
  }
}

export const immutate = (obj, at, val) => {
  if (!obj || !at) return obj
  const firstDot = at.indexOf('.')
  if (firstDot === -1) {
    return {...obj, [at]: typeof val === 'function' ? val(obj[at]) : val}
  } else {
    const firstKey = at.slice(0, firstDot)
    const restPath = at.slice(firstDot + 1)
    return {...obj, [firstKey]: immutate(obj[firstKey], restPath, val)}
  }
}

export const exec = {
  on: obj => (...ops) => ops.reduce((cur, op) => op(cur), obj),
  at: (at, val) => obj => immutate(obj, at, val)
}
