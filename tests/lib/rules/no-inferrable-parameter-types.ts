import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "../../../src/rules/no-inferrable-parameter-types";

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
    {
      code: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
          removeExplicitImplicitAny: false,
        },
      ],
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
      options: [
        { ignoreAnyParameters: false, removeExplicitImplicitAny: true },
      ],
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
          removeExplicitImplicitAny: true,
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
    {
      code: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr: any, value) => arr;`,
      output: `type mapFn = (arr: any, value: string) => string[];
        const map: mapFn = (arr, value) => arr;`,
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
          removeExplicitImplicitAny: true,
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
      code: `type Request = { request: boolean; };
        type Response = { response: boolean; };
        type NextFunction = { nextFunction: boolean; };
        type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

        const test: RequestHandler = (
          req: Request,
          res: Response,
          next: NextFunction
        ) => {};`,
      output: `type Request = { request: boolean; };
        type Response = { response: boolean; };
        type NextFunction = { nextFunction: boolean; };
        type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

        const test: RequestHandler = (
          req,
          res,
          next
        ) => {};`,
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
        },
      ],
      errors: [
        {
          messageId: "test",
          line: 7,
          column: 11,
        },
        {
          messageId: "test",
          line: 8,
          column: 11,
        },
        {
          messageId: "test",
          line: 9,
          column: 11,
        },
      ],
    },
    {
      code: `import type { NextFunction, Request, Response, RequestHandler } from "express";
        
        const test: RequestHandler = (
          req: Request,
          res: Response,
          next: NextFunction
        ) => {};`,
      output: `import type { NextFunction, Request, Response, RequestHandler } from "express";
        
        const test: RequestHandler = (
          req,
          res: Response,
          next
        ) => {};`,
      options: [
        {
          ignoreAnyParameters: false,
          unsafeRemoveAny: true,
        },
      ],
      errors: [
        {
          messageId: "test",
          line: 4,
          column: 11,
        },
        // TODO: Fix response
        // {
        //   messageId: "test",
        //   line: 5,
        //   column: 11,
        // },
        {
          messageId: "test",
          line: 6,
          column: 11,
        },
      ],
    },
  ],
});
