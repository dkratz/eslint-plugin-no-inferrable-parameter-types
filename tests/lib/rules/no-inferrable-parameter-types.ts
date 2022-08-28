import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "../../../lib/rules/no-inferrable-parameter-types";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
});
ruleTester.run("no-inferrable-parameter-types", rule, {
  valid: [
    // Calls
    `const arr: string[] = [];
        arr.map((value) => '');`,
    `const arr: string[] = [];
        arr.map((value, index) => '');`,
    {
      code: `const arr: any[] = [];
        arr.map((value: any, index) => '');`,
      options: [{ ignoreAnyParameters: true }],
    },
    {
      code: `const arr: string[] = [];
        arr.map((value: any, index) => '');`,
      options: [{ ignoreAnyParameters: false, unsafeRemoveAny: false }],
    },

    // Declarations
    `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: any, value: any) => arr;`,
    `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
  ],
  invalid: [
    // Calls
    {
      code: `const arr: string[] = [];
        arr.map((value: string, index: number) => '');`,
      output: `const arr: string[] = [];
        arr.map((value, index) => '');`,
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 18,
        },
        {
          messageId: "test",
          line: 2,
          column: 33,
        },
      ],
    },
    {
      code: `const arr: string[] = [];
        arr.map((value: string | number, index: number) => '');`,
      output: `const arr: string[] = [];
        arr.map((value: string | number, index) => '');`,
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 42,
        },
      ],
    },
    {
      code: `const arr: any[] = [];
        arr.map((value: any, index) => '');`,
      output: `const arr: any[] = [];
        arr.map((value, index) => '');`,
      options: [{ ignoreAnyParameters: false }],
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 18,
        },
      ],
    },
    {
      code: `const arr: string[] = [];
        arr.map((value: any, index) => '');`,
      output: `const arr: string[] = [];
        arr.map((value, index) => '');`,
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
        },
      ],
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 18,
        },
      ],
    },
    // Declarations
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: string[], value: string) => arr;`,
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 29,
        },
        {
          messageId: "test",
          line: 2,
          column: 44,
        },
      ],
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: string[], value) => arr;`,
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 29,
        },
      ],
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value: string) => arr;`,
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 34,
        },
      ],
    },
    {
      code: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
      output: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
      options: [
        {
          ignoreAnyParameters: false,
        },
      ],
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 29,
        },
      ],
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
        },
      ],
      errors: [
        {
          messageId: "test",
          line: 2,
          column: 29,
        },
      ],
    },
  ],
});
