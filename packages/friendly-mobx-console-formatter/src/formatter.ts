type ObservableObject = Record<string | number | symbol, unknown>
type ObservableArray = unknown[]
type ObservableSet = Set<unknown>
type ObservableMap = Map<string | number | symbol, unknown>
type Observable = ObservableObject | ObservableArray | ObservableSet | ObservableMap
type PrintElement = 'div' | 'span' | 'ol' | 'li' | 'table' | 'tr' | 'td'

export type MobxStub = Pick<typeof import('mobx'), 'isObservableObject' | 'isObservableArray' | 'isObservableSet' | 'isObservableMap' | 'isObservableProp' | 'isComputedProp' | 'isAction'>

type PrintableObject = readonly [
  'object',
  {
    object: unknown,
  },
]

type Printable = (
  | string
  | readonly [PrintElement, { style?: string }, ...Printable[]]
  | readonly [PrintElement, ...Printable[]]
  | PrintableObject
)

export type DevtoolsFormatter<T> = {
  header(value: T): Printable | null,
  hasBody(value: T): boolean,
  body(value: T): Printable,
}

type FormatterConfig = {
  list: { style: string },
  object: { style: string },
  array: { style: string },
  set: { style: string },
  map: { style: string },
  prototype: { style: string },
  symbol: { style: string },
  complexValue: { style: string },
  observable: { style: string },
  action: { style: string },
  computed: { style: string },
}

export type CreateDevtoolsFormatterOptions = {
  config: FormatterConfig,
}

export function createDevtoolsFormatter(mobx: MobxStub, { config }: CreateDevtoolsFormatterOptions): {
  ObservableObjectFormatter: DevtoolsFormatter<unknown>,
  ObservableArrayFormatter: DevtoolsFormatter<unknown>,
  ObservableSetFormatter: DevtoolsFormatter<unknown>,
  ObservableMapFormatter: DevtoolsFormatter<unknown>,
} {
  const reference = (value: unknown): Printable => {
    if (value === undefined) {
      return ['span', 'undefined']
    } else if (value === null) {
      return ['span', 'null']
    }

    return ['object', { object: value }]
  }

  const decorateObjectProperties = (obj: ObservableObject): Printable[] => {
    return Object.entries(obj).map<Printable>(([key, value]) => {
      const needLineBreak = typeof value === 'object' && value !== null

      const printValue: Printable = needLineBreak ? ['div', config.complexValue, reference(value)] : reference(value)

      const printMessages: Printable = mobx.isObservableProp(obj, key)
        ? [
          'div',
          ['span', config.observable, 'Observable'],
          ['span', key.toString()],
          ['span', ' : ', printValue],
        ]
        : ['span', key.toString(), ' : ', printValue]

      return ['li', config.list, printMessages]
    })
  }

  const decorateObjectSymbols = (obj: ObservableObject): Printable[] => {
    return Object.getOwnPropertySymbols(obj).map<Printable>(key => {
      const value = obj[key]

      const needLineBreak = typeof value === 'object' && value !== null

      const printValue: Printable = needLineBreak ? ['div', config.complexValue, reference(value)] : reference(value)

      const printMessages: Printable = ['span', config.symbol, key.toString(), ' : ', printValue]

      return ['li', config.list, printMessages]
    })
  }

  const filterOut = <T>(value: T): value is NonNullable<T> => value !== undefined && value !== null

  const decorateObjectGetterAndMethods = (obj: ObservableObject): Printable[] => {
    return Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))).map<Printable | null>(key => {

      const value = obj[key as keyof typeof obj]
      const printValue: Printable = reference(value)

      const printMessages: Printable | null = mobx.isComputedProp(obj, key)
        ? [
          'div',
          ['span', config.computed, 'Computed'],
          ['span', key.toString()],
          ['span', ' : ', printValue],
        ]
        : mobx.isAction(value)
          ? [
            'div',
            ['span', config.action, 'Action'],
            ['span', key.toString()],
            ['span', ' : ', printValue],
          ]
          : typeof value === 'function'
            ? ['span', config.prototype, key.toString(), ' : ', printValue]
            : null

      return printMessages ? ['li', config.list, printMessages] : null
    }).filter(filterOut)
  }

  const formatArray = (arr: ObservableArray): Printable[] => {
    return arr.map<Printable>((value, index) => {
      return ['li', config.list, index.toString(), ' : ', reference(value)]
    })
  }

  const formatSet = (set: ObservableSet): Printable[] => {
    return Array.from(set.values()).map<Printable>((value, index) => {
      return ['li', config.list, index.toString(), ' -> ', reference(value)]
    })
  }

  const formatMap = (map: ObservableMap): Printable[] => {
    return Array.from(map.entries()).map<Printable>(([key, value]) => {
      return ['li', config.list, key.toString(), ' -> ', reference(value)]
    })
  }

  const decoratePrototype = (obj: Observable): Printable[] => {
    const prototype: unknown = Object.getPrototypeOf(obj)

    return [['li', config.list, '[[prototype]]', ' : ', reference(prototype)]]
  }

  const decorateSpecificPrototype = (prototype: unknown): Printable[] => {

    return [['li', config.list, '[[prototype]]', ' : ', reference(prototype)]]
  }

  const ObservableObjectFormatter: DevtoolsFormatter<ObservableObject> = {
    header: obj => mobx.isObservableObject(obj) ? [
      'span',
      ['span', config.object, 'ObservableObject'],
      ['span', `{${Object.getOwnPropertyNames(obj).length}}`, '\n'],
    ] : null,
    hasBody: () => true,
    body: obj => ([
      'ol',
      config.list,
      ...decorateObjectProperties(obj),
      ...decorateObjectSymbols(obj),
      ...decorateObjectGetterAndMethods(obj),
      ...decoratePrototype(obj),
    ]),
  }

  const ObservableArrayFormatter: DevtoolsFormatter<ObservableArray> = {
    header: arr => mobx.isObservableArray(arr) ? [
      'span',
      ['span', config.array, 'ObservableArray'],
      ['span', `[${arr.length}]`, '\n'],
    ] : null,
    hasBody: () => true,
    body: arr => {
      return [
        'ol',
        config.list,
        ...formatArray(arr),
        ...decoratePrototype(arr),
      ]
    },
  }

  const ObservableSetFormatter: DevtoolsFormatter<ObservableSet> = {
    header: set => mobx.isObservableSet(set) ? [
      'span',
      ['span', config.set, 'ObservableSet'],
      ['span', `{${set.size}}`, '\n'],
    ] : null,
    hasBody: () => true,
    body: set => {
      return [
        'ol',
        config.list,
        ...formatSet(set),
        ...decorateSpecificPrototype(Set),
      ]
    },
  }

  const ObservableMapFormatter: DevtoolsFormatter<ObservableMap> = {
    header: map => mobx.isObservableMap(map) ? [
      'span',
      ['span', config.map, 'ObservableMap'],
      ['span', `{${map.size}}`, '\n'],
    ] : null,
    hasBody: () => true,
    body: map => {
      return [
        'ol',
        config.list,
        ...formatMap(map),
        ...decorateSpecificPrototype(Map),
      ]
    },
  }

  return {
    ObservableObjectFormatter,
    ObservableArrayFormatter,
    ObservableSetFormatter,
    ObservableMapFormatter,
  }
}
