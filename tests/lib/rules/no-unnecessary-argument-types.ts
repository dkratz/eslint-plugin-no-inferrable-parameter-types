import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "../../../lib/rules/no-unnecessary-argument-types";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
});
ruleTester.run("no-unnecessary-argument-types call", rule, {
  valid: [
    {
      code: `const arr: string[] = [];
        arr.map((value) => '');`,
    },
    {
      code: `const arr: string[] = [];
        arr.map((value, index) => '');`,
    },
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
  ],
  invalid: [
    {
      code: `const arr: string[] = [];
        arr.map((value: string, index: number) => '');`,
      errors: [
        {
          messageId: "test",
        },
        {
          messageId: "test",
        },
      ],
      output: `const arr: string[] = [];
        arr.map((value, index) => '');`,
    },
    {
      code: `const arr: string[] = [];
        arr.map((value: string | number, index: number) => '');`,
      errors: [
        {
          messageId: "test",
        },
      ],
      output: `const arr: string[] = [];
        arr.map((value: string | number, index) => '');`,
    },
    {
      code: `const arr: any[] = [];
        arr.map((value: any, index) => '');`,
      errors: [
        {
          messageId: "test",
        },
      ],
      output: `const arr: any[] = [];
        arr.map((value, index) => '');`,
      options: [{ ignoreAnyParameters: false }],
    },
    {
      code: `const arr: string[] = [];
        arr.map((value: any, index) => '');`,
      errors: [
        {
          messageId: "test",
        },
      ],
      output: `const arr: string[] = [];
        arr.map((value, index) => '');`,
      options: [{ ignoreAnyParameters: false, unsafeRemoveAny: true }],
    },
  ],
});

ruleTester.run("no-unnecessary-argument-types variable declaration", rule, {
  valid: [
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: any, value: any) => arr;`,
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
    },
  ],
  invalid: [
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: string[], value: string) => arr;`,
      errors: [
        {
          messageId: "test",
        },
        {
          messageId: "test",
        },
      ],
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: string[], value) => arr;`,
      errors: [
        {
          messageId: "test",
        },
      ],
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value: string) => arr;`,
      errors: [
        {
          messageId: "test",
        },
      ],
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    },
    {
      code: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
      errors: [
        {
          messageId: "test",
        },
      ],
      options: [
        {
          ignoreAnyParameters: false,
        },
      ],
      output: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    },
    {
      code: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
      errors: [
        {
          messageId: "test",
        },
      ],
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
        },
      ],
      output: `type mapFn = (arr: string[], value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
    },
  ],
});
