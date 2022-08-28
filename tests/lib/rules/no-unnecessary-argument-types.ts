import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "../../../lib/rules/no-unnecessary-argument-types";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
});
ruleTester.run("no-unnecessary-argument-types", rule, {
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
