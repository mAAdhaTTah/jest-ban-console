const AggregateError = require("aggregate-error");
const {
  jestBanConsole,
  installConsoleProxy,
  clearConsoleProxy,
  expectConsoleBan,
  resetConsole,
} = require("./index.js");

// Skip writing to console in tests.
console.log = () => {};

describe("jest-ban-console", () => {
  describe("jestBanConsole", () => {
    jestBanConsole();

    it("should install proxy automatically", () => {
      expect(jest.isMockFunction(globalThis.console.log)).toBe(true);
    });
  });

  describe("clearConsoleProxy, expectConsoleBan, installConsoleProxy, & resetConsole,", () => {
    afterEach(() => {
      resetConsole();
    });

    it("should install the console proxy & restore it back to the base console", () => {
      const baseConsole = globalThis.console;

      expect(jest.isMockFunction(globalThis.console.log)).toBe(false);
      expect(jest.isMockFunction(baseConsole.log)).toBe(false);

      installConsoleProxy();

      expect(baseConsole).not.toBe(globalThis.console);
      expect(jest.isMockFunction(globalThis.console.log)).toBe(true);
      expect(jest.isMockFunction(baseConsole.log)).toBe(false);

      resetConsole();

      expect(baseConsole).toBe(globalThis.console);
    });

    it("should return the same mock twice", () => {
      installConsoleProxy();

      expect(globalThis.console.log).toEqual(globalThis.console.log);
    });

    it("should track the number of calls", () => {
      installConsoleProxy();

      console.log("hello");

      expect(globalThis.console.log).toHaveBeenCalledTimes(1);
    });

    it("should clear the calls on the proxy", () => {
      installConsoleProxy();

      console.log("hello");
      clearConsoleProxy();

      expect(globalThis.console.log).toHaveBeenCalledTimes(0);
    });

    it("should clear the calls on reinstallation", () => {
      installConsoleProxy();

      console.log("hello");
      installConsoleProxy();

      expect(globalThis.console.log).toHaveBeenCalledTimes(0);
    });

    it("should throw if console is banned", () => {
      installConsoleProxy();

      console.log("hello");

      expect(expectConsoleBan).toThrowError(AggregateError);
    });
  });
});
