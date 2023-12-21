<h1 align="center">Friendly MobX Console Formatter</h1>

<div align="center">

[![Maintainability][maintainability-image]][maintainability-url]
[![Known Vulnerabilities][known-vulnerabilities-image]][known-vulnerabilities-url]
[![Language][language-image]][language-url]
[![License][license-image]][license-url]
![Publish workflow][publish-workflow-image]
[![NPM version][npm-version-image]][npm-version-url]
[![NPM bundle size (minified + gzip)][npm-bundle-size-image]][npm-bundle-size-url]

[maintainability-image]: https://api.codeclimate.com/v1/badges/c27db824b79350f886b0/maintainability
[maintainability-url]: https://codeclimate.com/github/zheeeng/friendly-mobx-console-formatter/maintainability

[known-vulnerabilities-image]: https://snyk.io/test/github/zheeeng/friendly-mobx-console-formatter/badge.svg
[known-vulnerabilities-url]: https://snyk.io/test/github/zheeeng/friendly-mobx-console-formatter

[language-image]: https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg
[language-url]: http://typescriptlang.org/

[license-image]: https://img.shields.io/github/license/mashape/apistatus.svg
[license-url]: https://github.com/zheeeng/friendly-mobx-console-formatter/blob/main/LICENSE

[publish-workflow-image]: https://github.com/zheeeng/friendly-mobx-console-formatter/actions/workflows/publish.yml/badge.svg

[npm-version-image]: https://img.shields.io/npm/v/friendly-mobx-console-formatter.svg
[npm-version-url]: https://www.npmjs.com/package/friendly-mobx-console-formatter

[npm-bundle-size-image]: https://img.shields.io/bundlephobia/minzip/friendly-mobx-console-formatter.svg
[npm-bundle-size-url]: https://unpkg.com/friendly-mobx-console-formatter/dist/index.js
</div>

# Introduction

Welcome to the Friendly MobX Console Formatter, a tool designed to enhance your debugging experience when working with MobX observable objects. Our project leverages Chrome DevTools Custom Object Formatters to provide an intuitive and readable representation of observables in your browser console.

## Features

This custom formatter is particularly valuable when working with MobX libraries, as MobX's observable objects can be complex and nested, making them challenging to interpret in their raw form. With Friendly MobX Console Formatter, you can:

* Quickly understand the structure of your observables.
* Effortlessly inspect the observable/computed/action fields within your MobX stores.
* Save time and reduce frustration when diagnosing issues in your application.

## Browsers support

Before you can take advantage of the Friendly MobX Console Formatter, you need to enable the Custom Object Formatters feature in your browser's developer tools. After enabling this setting, it takes effect the next time you open the DevTools.

| Browser support | Enabling Custom Object Formatters | Screen Shots |
| --------- | --------- | --------- |
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | <ol><li>Open DevTools by pressing F12 or Ctrl+Shift+I (Cmd+Option+I on Mac).</li><li>Click on the gear icon to open the Settings or pressing F1.</li><li>Under the "Console" section, check the "Enable custom formatters" option.</li></ol> | ![image](https://github.com/zheeeng/friendly-mobx-console-formatter/assets/1303154/82951daf-a8e1-4fa9-803d-893ce9df7bb7) |
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> Edge | <ol><li>Open DevTools by pressing F12 or Ctrl+Shift+I (Cmd+Option+I on Mac).</li><li>Click on the gear icon to open the Settings or pressing F1.</li><li>Under the "Console" section, check the "Enable custom formatters" option.</li></ol> | ![image](https://github.com/zheeeng/friendly-mobx-console-formatter/assets/1303154/7a0000dc-7a52-4738-8f46-5682925023a0)
| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | <ol><li>Open DevTools by pressing F12 or Ctrl+Shift+I (Cmd+Option+I on Mac).</li><li>Click on the ellipsis icon to open the Settings or pressing F1.</li><li>Under the "Advanced settings" section, check the "Enable custom formatters" option.</li></ol> | ![image](https://github.com/zheeeng/friendly-mobx-console-formatter/assets/1303154/a2d34864-dc83-4b46-844b-e28459559ec4) |

## Usage

### Prerequisites

First, ensure that you have installed [MobX](https://mobx.js.org/README.html) in your project. It is a peer dependency of Friendly MobX Console Formatter.

### Installation

We recommend using the Friendly MobX Console Formatter in development environment. So you can install it as a dev dependency:

```sh
npm install --save-dev friendly-mobx-console-formatter
```

```sh
yarn add --dev friendly-mobx-console-formatter
```

```sh
pnpm install --save-dev friendly-mobx-console-formatter
```

If you want to use it in production environment, you can install it as a dependency.

### API Usage

For optimal use in development environments, conditionally import and register the formatter with common bundlers:

```ts
// Conditionally import and register the formatter in development environment. The bundler will remove the if statement in production environment.
if (process.env.NODE_ENV === 'development') {
  Promise.all([
    import('mobx'),
    import('friendly-mobx-console-formatter'),
  ]).then(([
    mobx,
    { register },
  ]) => register(mobx));
}
```

If you doesn't matter enable this formatter in production environment, you can import and register it directly:

```ts
import * as mobx from 'mobx';
import { register } from 'friendly-mobx-console-formatter';

register(mobx);
```

```ts

### Options

The `register` function accepts an optional second argument, which is an object of options:

e.g.

```ts
register(mobx, {
  styles: {
    observable: 'color: red;',
  },
});
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `styles` | `FormatterStyles` | See the following section | Custom styles for the formatter. |

**`FormatterStyles`**:

A map of CSS styles to apply to the formatter. The keys are the names of the different types of values that can be formatted, and the values are the CSS styles to apply to those values. If a value is a function, it will be called with the value being formatted as the CSS styles.

<details>
<summary>Expand to review the type definition of `FormatterStyles`:</summary>

```ts
// Function type styles is designed to support dynamic styles, such as day/night theme switching.
type FormatterStyles = {
  // Styles for iterable fields.
  list?: string | (() => string);
  object?: string | (() => string);
  array?: string | (() => string);
  set?: string | (() => string);
  map?: string | (() => string);
  prototype?: string | (() => string);
  symbol?: string | (() => string);
  // Styles for non-primitive fields.
  complexValue?: string | (() => string);
  // Badge styles for observable fields.
  observable?: string | (() => string);
  // Badge styles for action fields.
  action?: string | (() => string);
  // Badge styles for computed fields.
  computed?: string | (() => string);
};
```

</details>

<details>
<summary>Expand to review the default set of styles:</summary>

```ts
const defaultFormatterStyles = {
  list: 'color: chocolate; padding-left: 0.25em; margin-bottom: 0.25em; list-style-type: none;',
  object: 'color: red;',
  array: 'color: brown;',
  set: 'color: lightblue;',
  map: 'color: orange;',
  prototype: 'opacity: 0.4;',
  symbol: 'color: orange;',
  complexValue: 'margin-top: 0.25em; padding-left: 1em; border-left: dashed 1px;',
  observable: 'user-select: none; background: #28a745; color: white; padding: 0.25em; margin-right: 0.4em; border-radius: 0.2em; font-weight: light; font-size: 0.75em; line-height: 1em',
  action: 'user-select: none; background: #1e90ff; color: white; padding: 0.25em; margin-right: 0.4em; border-radius: 0.2em; font-weight: light; font-size: 0.75em; line-height: 1em',
  computed: 'user-select: none; background: #dc3545; color: white; padding: 0.25em; margin-right: 0.4em; border-radius: 0.2em; font-weight: light; font-size: 0.75em; line-height: 1em',
};
```

</details>

## Contributing

We welcome contributions to the Friendly MobX Console Formatter project. If you'd like to contribute, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

We'd like to thank all the contributors who have helped shape the Friendly MobX Console Formatter into what it is today. Your efforts and insights are deeply appreciated.

If you encounter any issues or have suggestions for improvement, please open an issue on our GitHub repository. Happy debugging!
