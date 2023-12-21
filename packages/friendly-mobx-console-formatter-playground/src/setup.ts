import * as mobx from 'mobx'

const noDescSymbol = Symbol()
const hasDescSymbol = Symbol('foo')

class Store {
  // Observable properties
  stringValue = 'Hello World'
  numberValue = 42
  booleanValue = true
  objectValue = { key: 'value' }
  arrayValue = [1, 2, 3]
  mapValue = new Map([['22', '333']])
  setValue = new Set([1, 2, 3, mobx.observable({ aa: 333, b: mobx.observable({ ttt: 555 }) })])
  dateValue = new Date() // 日期
  // Non-observable property
  nonObservable = 'I do not react'
  ;[noDescSymbol] = 'I am a symbol'
  ;[hasDescSymbol] = 'I am a symbol with a description'

  // Computed properties
  get reversedString () {
    return this.stringValue.split('').reverse().join('')
  }
  get arrayLength () {
    return this.arrayValue.length
  }
  // Observable reference
  anotherObject = mobx.observable({ nested: 'Nested Value' })

  constructor () {
    mobx.makeAutoObservable(this, {
      nonObservable: false,
      reversedString: mobx.computed,
      updateNonObservable: false,
      // Explicitly define `anotherObject` as a shallow observable reference
      anotherObject: mobx.observable.shallow,
    })
  }

  // Action method to modify observables
  updateStringValue (newValue: string) {
    this.stringValue = newValue
  }
  // Action method to modify non-observable
  updateNonObservable (newValue: string) {
    this.nonObservable = newValue
  }
  // Action method to modify observable reference
  updateAnotherObject (newValue: string) {
    this.anotherObject.nested = newValue
  }
}
const myStore = new Store()

const raw = [
  1, 2, 4,
  {
    foo: 'bar',
    set: new Set([111]),
    map: new Map([[111, 3333]]),
    date: new Date(),
    observableObject: mobx.observable({ nested: 'Nested Value' }),
    [noDescSymbol]: 'I am a symbol',
    [hasDescSymbol]: 'I am a symbol with a description',
    // Computed properties within the observable object
    get stringLength () {
      return this.foo.length
    }
  }
]

const myStore2 = mobx.observable(raw)

export const setupConsoleLog = (element: HTMLElement) => {
  element.addEventListener('click', () => {
    console.log('myStore\n', myStore)
    console.log('myStore2\n', myStore2)
  })
}

export const setupDebugger = (element: HTMLElement) => {
  element.addEventListener('click', () => {
    // inspect closure variable `myStore` and `myStore2`
    // eslint-disable-next-line no-debugger
    debugger
  })
}