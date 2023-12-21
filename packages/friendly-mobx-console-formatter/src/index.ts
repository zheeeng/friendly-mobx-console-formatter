import { createDevtoolsFormatter, type DevtoolsFormatter } from './formatter'

declare global {
  interface Window {
    devtoolsFormatters?: DevtoolsFormatter<unknown>[],
  }
}

export const defaultFormatterStyles = {
  list: 'color: chocolate; padding-left: 0.25em; margin-bottom: 0.25em; list-style-type: none;',
  object: 'color: red;',
  array: 'color: brown;',
  set: 'color: lightblue;',
  map: 'color: orange;',
  prototype: 'opacity: 0.5;',
  symbol: 'color: orange;',
  complexValue: 'margin-top: 0.25em; padding-left: 1em; border-left: dashed 1px;',
  observable: 'user-select: none; background: #28a745; color: white; padding: 0.25em; margin-right: 0.4em; border-radius: 0.2em; font-weight: light; font-size: 0.75em; line-height: 1em',
  action: 'user-select: none; background: #1e90ff; color: white; padding: 0.25em; margin-right: 0.4em; border-radius: 0.2em; font-weight: light; font-size: 0.75em; line-height: 1em',
  computed: 'user-select: none; background: #dc3545; color: white; padding: 0.25em; margin-right: 0.4em; border-radius: 0.2em; font-weight: light; font-size: 0.75em; line-height: 1em',
} as const

type FormatterStyleKeys = keyof typeof defaultFormatterStyles

export type FormatterStyles = Partial<Record<FormatterStyleKeys, string | (() => string)>>
export type RegisterDevtoolsFormatterOptions = {
  styles?: FormatterStyles,
}

function callIfThunk<T>(value: T | (() => T)): T {
  return typeof value === 'function' ? (value as () => T)() : value
}

export function register (mobx: typeof import('mobx'), options: RegisterDevtoolsFormatterOptions = {}) {
  if (typeof window === 'undefined') {
    throw new Error('registerDevtoolsFormatter can only be called in browser environment')
  }

  const getListStyle = () => options.styles?.list ? callIfThunk(options.styles.list) : defaultFormatterStyles.list
  const getObjectStyle = () => options.styles?.object ? callIfThunk(options.styles.object) : defaultFormatterStyles.object
  const getArrayStyle = () => options.styles?.array ? callIfThunk(options.styles.array) : defaultFormatterStyles.array
  const getSetStyle = () => options.styles?.set ? callIfThunk(options.styles.set) : defaultFormatterStyles.set
  const getMapStyle = () => options.styles?.map ? callIfThunk(options.styles.map) : defaultFormatterStyles.map
  const getPrototypeStyle = () => options.styles?.prototype ? callIfThunk(options.styles.prototype) : defaultFormatterStyles.prototype
  const getSymbolStyle = () => options.styles?.symbol ? callIfThunk(options.styles.symbol) : defaultFormatterStyles.symbol
  const getComplexValueStyle = () => options.styles?.complexValue ? callIfThunk(options.styles.complexValue) : defaultFormatterStyles.complexValue
  const getObservableStyle = () => options.styles?.observable ? callIfThunk(options.styles.observable) : defaultFormatterStyles.observable
  const getActionStyle = () => options.styles?.action ? callIfThunk(options.styles.action) : defaultFormatterStyles.action
  const getComputedStyle = () => options.styles?.computed ? callIfThunk(options.styles.computed) : defaultFormatterStyles.computed

  const { ObservableObjectFormatter, ObservableArrayFormatter, ObservableSetFormatter, ObservableMapFormatter  } = createDevtoolsFormatter(mobx, {
    config: {
      list: {
        get style () {
          return getListStyle()
        }
      },
      object: {
        get style () {
          return getObjectStyle()
        }
      },
      array: {
        get style () {
          return getArrayStyle()
        }
      },
      set: {
        get style () {
          return getSetStyle()
        }
      },
      map: {
        get style () {
          return getMapStyle()
        }
      },
      prototype: {
        get style () {
          return getPrototypeStyle()
        }
      },
      symbol: {
        get style () {
          return getSymbolStyle()
        }
      },
      complexValue: {
        get style () {
          return getComplexValueStyle()
        }
      },
      observable: {
        get style () {
          return getObservableStyle()
        }
      },
      action: {
        get style () {
          return getActionStyle()
        }
      },
      computed: {
        get style () {
          return getComputedStyle()
        }
      },
    }
  })

  window.devtoolsFormatters = (window.devtoolsFormatters ?? []).concat([ObservableObjectFormatter, ObservableArrayFormatter, ObservableSetFormatter, ObservableMapFormatter])
}
