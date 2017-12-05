/* global test, describe, expect */

import {get, walk, test as _test, setin, set, exec} from './main'

test('walk', () => {
  const nodepaths = []
  const obj = {
    a: {b: {c: 1}},
    x: {y: {z: 2}}
  }
  walk(obj, (node, path) => {
    nodepaths.push({node, path})
  })
  expect(nodepaths).toEqual([
    {node: {b: {c: 1}}, path: 'a'},
    {node: {c: 1}, path: 'a.b'},
    {node: 1, path: 'a.b.c'},
    {node: {y: {z: 2}}, path: 'x'},
    {node: {z: 2}, path: 'x.y'},
    {node: 2, path: 'x.y.z'}
  ])
})

test('test', () => {
  const obj1 = {
    a: {b: {c: 1}},
    x: {y: {z: 2}}
  }
  const obj2 = {
    a: {b: {c: 1}}
  }
  const obj3 = {
    x: {y: {z: 1}}
  }
  expect(_test(obj1, obj2)).toEqual(true)
  expect(_test(obj1, obj3)).toEqual(false)
})

test('get', () => {
  const obj = {
    a: {b: {c: 1}},
    x: {y: {z: 2}}
  }
  expect(get(obj, 'a.b.c')).toEqual(1)
  expect(get(obj, 'a.b')).toEqual({c: 1})
  expect(get(obj, 'x.y.z')).toEqual(2)
  expect(get(obj, 'x.y')).toEqual({z: 2})
  expect(get(obj, 'x.a')).toEqual(undefined)
})

describe('setin', () => {
  test('should change the value at the given path', () => {
    const obj = {
      a: {b: {c: 'old'}},
      x: {y: {z: 'old'}}
    }
    setin(obj, 'a.b.c', 'new')
    expect(obj).toEqual({
      a: {b: {c: 'new'}},
      x: {y: {z: 'old'}}
    })
    setin(obj, 'x.y', {z: 'new'})
    expect(obj).toEqual({
      a: {b: {c: 'new'}},
      x: {y: {z: 'new'}}
    })
  })

  test('should apply the updater at the given path', () => {
    const obj = {
      a: {b: {c: 'old'}},
      x: {y: {z: 'old'}}
    }
    setin(obj, 'a.b.c', c => c + 'new')
    expect(obj).toEqual({
      a: {b: {c: 'oldnew'}},
      x: {y: {z: 'old'}}
    })
    setin(obj, 'x.y', y => ({z: y.z + 'new'}))
    expect(obj).toEqual({
      a: {b: {c: 'oldnew'}},
      x: {y: {z: 'oldnew'}}
    })
  })
})

describe('set', () => {
  test('should update the value at the given path immutably', () => {
    const obj1 = {
      a: {b: {c: 'old', d: {e: 'old'}}},
      x: {y: {z: 'old'}}
    }
    const {a} = obj1
    const {b} = a
    const {c, d} = b
    const {e} = d
    const {x} = obj1
    const {y} = x
    const {z} = y

    const obj2 = set(obj1, 'a.b.c', 'new')
    expect(obj2 !== obj1).toEqual(true)
    expect(obj2.a !== a).toEqual(true)
    expect(obj2.a.b !== b).toEqual(true)
    expect(obj2.a.b.c === 'new').toEqual(true)
    expect(obj2.a.b.d === d).toEqual(true)
    expect(obj2.a.b.d.e === e).toEqual(true)
    expect(obj2.x === x).toEqual(true)
    expect(obj2.x.y === y).toEqual(true)
    expect(obj2.x.y.z === z).toEqual(true)

    const obj3 = set(obj1, 'a.b.d.e', 'new')
    expect(obj3 !== obj1).toEqual(true)
    expect(obj3.a !== a).toEqual(true)
    expect(obj3.a.b !== b).toEqual(true)
    expect(obj3.a.b.c === c).toEqual(true)
    expect(obj3.a.b.d !== d).toEqual(true)
    expect(obj3.a.b.d.e === 'new').toEqual(true)
    expect(obj3.x === x).toEqual(true)
    expect(obj3.x.y === y).toEqual(true)
    expect(obj3.x.y.z === z).toEqual(true)

    expect(obj1.a === a).toEqual(true)
    expect(obj1.a.b === b).toEqual(true)
    expect(obj1.a.b.c === c).toEqual(true)
    expect(obj1.a.b.d === d).toEqual(true)
    expect(obj1.a.b.d.e === e).toEqual(true)
    expect(obj1.x === x).toEqual(true)
    expect(obj1.x.y === y).toEqual(true)
    expect(obj1.x.y.z === z).toEqual(true)
  })

  test('should apply the updater at the given path immutably', () => {
    const obj1 = {
      a: {b: {c: 'old', d: {e: 'old'}}},
      x: {y: {z: 'old'}}
    }
    const {a} = obj1
    const {b} = a
    const {c, d} = b
    const {e} = d
    const {x} = obj1
    const {y} = x
    const {z} = y

    const obj2 = set(obj1, 'a.b.c', c => c + 'new')
    expect(obj2 !== obj1).toEqual(true)
    expect(obj2.a !== a).toEqual(true)
    expect(obj2.a.b !== b).toEqual(true)
    expect(obj2.a.b.c === 'oldnew').toEqual(true)
    expect(obj2.a.b.d === d).toEqual(true)
    expect(obj2.a.b.d.e === e).toEqual(true)
    expect(obj2.x === x).toEqual(true)
    expect(obj2.x.y === y).toEqual(true)
    expect(obj2.x.y.z === z).toEqual(true)

    const obj3 = set(obj1, 'a.b.d.e', e => e + 'new')
    expect(obj3 !== obj1).toEqual(true)
    expect(obj3.a !== a).toEqual(true)
    expect(obj3.a.b !== b).toEqual(true)
    expect(obj3.a.b.c === c).toEqual(true)
    expect(obj3.a.b.d !== d).toEqual(true)
    expect(obj3.a.b.d.e === 'oldnew').toEqual(true)
    expect(obj3.x === x).toEqual(true)
    expect(obj3.x.y === y).toEqual(true)
    expect(obj3.x.y.z === z).toEqual(true)

    expect(obj1.a === a).toEqual(true)
    expect(obj1.a.b === b).toEqual(true)
    expect(obj1.a.b.c === c).toEqual(true)
    expect(obj1.a.b.d === d).toEqual(true)
    expect(obj1.a.b.d.e === e).toEqual(true)
    expect(obj1.x === x).toEqual(true)
    expect(obj1.x.y === y).toEqual(true)
    expect(obj1.x.y.z === z).toEqual(true)
  })
})

test('exec', () => {
  const obj1 = {
    a: {b: {c: 'old'}},
    x: {y: {z: 'old'}},
    i: {j: {k: 'old'}}
  }
  const {a} = obj1
  const {b} = a
  const {c} = b
  const {x} = obj1
  const {y} = x
  const {z} = y
  const {i} = obj1
  const {j} = i
  const {k} = j

  const obj2 = exec.on(obj1)(
    exec.set('a.b.d', d => d || {}),
    exec.set('a.b.d.e', e => 'new'),
    exec.set('a.b.c', 'new'),
    exec.set('x.y.z', 'new')
  )
  expect(obj2).toEqual({
    a: {b: {c: 'new', d: {e: 'new'}}},
    x: {y: {z: 'new'}},
    i: {j: {k: 'old'}}
  })
  expect(obj2 !== obj1).toEqual(true)
  expect(obj2.a !== a).toEqual(true)
  expect(obj2.a.b !== b).toEqual(true)
  expect(obj2.a.b.c === 'new').toEqual(true)
  expect(obj2.a.b.d).toEqual({e: 'new'})
  expect(obj2.x !== x).toEqual(true)
  expect(obj2.x.y !== y).toEqual(true)
  expect(obj2.x.y.z === 'new').toEqual(true)
  expect(obj2.i === i).toEqual(true)
  expect(obj2.i.j === j).toEqual(true)
  expect(obj2.i.j.k === k).toEqual(true)

  expect(obj1.a === a).toEqual(true)
  expect(obj1.a.b === b).toEqual(true)
  expect(obj1.a.b.c === c).toEqual(true)
  expect(obj1.a.b.d === undefined).toEqual(true)
  expect(obj1.x === x).toEqual(true)
  expect(obj1.x.y === y).toEqual(true)
  expect(obj1.x.y.z === z).toEqual(true)
  expect(obj1.i === i).toEqual(true)
  expect(obj1.i.j === j).toEqual(true)
  expect(obj1.i.j.k === k).toEqual(true)
})
