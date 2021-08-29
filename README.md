# jest-ban-console

Ban console from being called in Jest tests.

## How to use

First, install into your project:

```bash
$ npm install --save-dev jest-ban-console || yarn add --dev jest-ban-console
```

Then, ban console from individual tests:

```js
import { jestBanConsole } from "jest-ban-console";

describe("your module", () => {
  jestBanConsole();
});
```

If you want to enforce this across all of your tests, run it in your `setupTests.js` or similar:

```js
import { jestBanConsole } from "jest-ban-console";

jestBanConsole();
```

## API

### `installConsoleProxy: () => void`

Installs the proxy console for intercepting calls to the console. Also clears any mock calls on the proxy.

### `clearConsole: () => void`

Clears any mock calls on the console.

### `expectConsoleBan: () => void`

Checks all of the console methods to see if any of them have been called. If so, throws an `AggregateError` with an array of errors for each console method called.

### `resetConsole: () => void`

Resets the global console back to the real console implementation.
