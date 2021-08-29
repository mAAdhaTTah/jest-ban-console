import { afterEach, beforeEach, jest } from "@jest/globals";
import AggregateError from "aggregate-error";

const _console = globalThis.console;

let mockConsole = {};

const proxyConsole = new Proxy(_console, {
  get(target, property) {
    const result =
      Reflect.get(mockConsole, property) ?? Reflect.get(target, property);

    if (jest.isMockFunction(result) || typeof result !== "function") {
      return result;
    }

    const spy = jest.fn(result);
    Reflect.set(mockConsole, property, spy);
    return spy;
  },
});

export const installConsoleProxy = () => {
  if (globalThis.console !== proxyConsole) {
    globalThis.console = proxyConsole;
  }
  clearConsoleProxy();
};

export const clearConsoleProxy = () => {
  mockConsole = {};
};

export const expectConsoleBan = () => {
  const errors = [];

  for (const key in mockConsole) {
    const callCount = mockConsole[key].mock.calls.length;
    if (callCount > 0) {
      errors.push(
        new Error(`Console#${key} called ${callCount} times during test run.`)
      );
    }
  }

  if (errors.length) {
    throw new AggregateError(
      errors,
      `Console is banned, but:

* ${errors.map((error) => error.message).join("\n* ")}`
    );
  }
};

export const resetConsole = () => {
  globalThis.console = _console;
};

export const jestBanConsole = () => {
  beforeEach(() => {
    installConsoleProxy();
  });

  afterEach(() => {
    expectConsoleBan();
    resetConsole();
  });
};
