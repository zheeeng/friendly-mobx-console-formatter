import * as mobx from 'mobx'

const noDescSymbol = Symbol()
const hasDescSymbol = Symbol('foo')

class Store {
  // Observable properties
  stringValue = 'Hello World' // String
  numberValue = 42 // Number
  booleanValue = true // Boolean
  objectValue = { key: 'value' } // Object
  arrayValue = [1, 2, 3] // Array
  mapValue = new Map([['22', '333']]) // Map
  setValue = new Set([1, 2, 3, mobx.observable({ aa: 333, b: mobx.observable({ ttt: 555 }) })]) // Set (注意 Set 不是响应式的)

  // Non-observable property
  nonObservable = 'I do not react';
  [noDescSymbol] = 'I am a symbol';
  [hasDescSymbol] = 'I am a symbol with a description'

  // Computed property
  get reversedString () {
    // This is a computed value that will be derived from the observable `stringValue`
    return this.stringValue.split('').reverse().join('')
  }

  constructor () {
    mobx.makeAutoObservable(this, {
      nonObservable: false, // Exclude `nonObservable` from being made observable
      reversedString: mobx.computed, // Include `reversedString` as a computed value
      updateNonObservable: false,
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
}

const myStore = new Store()

const myStore2 = mobx.observable([
  1, 2, 4,
  {
    foo: 'bar',
    set: new Set([111]),
    map: new Map([[111, 3333]]),
    [noDescSymbol]: 'I am a symbol',
    [hasDescSymbol]: 'I am a symbol with a description',
  }
])

export const setupConsoleLog = (element: HTMLElement) => {
  element.addEventListener('click', () => {
    console.log('mobx observable', myStore)
    console.log('mobx observable 2', myStore2)
  })
}

export const setupDebugger = (element: HTMLElement) => {
  element.addEventListener('click', () => {
    // inspect closure variable `myStore` and `myStore2`
    // eslint-disable-next-line no-debugger
    debugger
  })
}