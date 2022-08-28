import { ESLintUtils } from "@typescript-eslint/utils";
import * as ts from "typescript";
import * as tsutils from "tsutils";

type MessageIds = "test";
type Options = [
  {
    ignoreAnyParameters?: boolean;
    unsafeRemoveAny?: boolean;
  }
];

const isTypeAny = (type: ts.Type) =>
  tsutils.isTypeFlagSet(type, ts.TypeFlags.Any);

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options, MessageIds>({
  meta: {
    type: "suggestion",
    docs: {
      description: "test",
      recommended: false,
      url: undefined, // URL to the documentation page for this rule
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          ignoreAnyParameters: {
            type: "boolean",
          },
          unsafeRemoveAny: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      test: "asdf",
    },
  },
  defaultOptions: [
    {
      ignoreAnyParameters: true,
      unsafeRemoveAny: false,
    },
  ],
  create(context) {
    // TODO: Why isn't defaultOptions applied?
    const options = {
      ignoreAnyParameters: context.options[0]?.ignoreAnyParameters ?? true,
      unsafeRemoveAny: context.options[0]?.unsafeRemoveAny ?? false,
    };

    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      VariableDeclarator(node) {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        if (
          !tsNode.type ||
          tsNode.initializer?.kind !== ts.SyntaxKind.ArrowFunction
        ) {
          return;
        }

        const parentType = checker.getTypeAtLocation(tsNode);
        const parentSignature = checker.getSignaturesOfType(
          parentType,
          ts.SignatureKind.Call
        )[0];

        const arg = tsNode.initializer;
        (arg as ts.ArrowFunction).parameters.forEach((param, paramIdx) => {
          if (!param.type) {
            return;
          }

          const paramType = checker.getTypeFromTypeNode(param.type);

          if (options.ignoreAnyParameters && isTypeAny(paramType)) {
            return;
          }

          if (parentSignature.parameters[paramIdx]) {
            const parentParam = parentSignature.parameters[paramIdx];
            const calleeType = checker.getTypeOfSymbolAtLocation(
              parentParam,
              tsNode
            );

            if (
              calleeType === paramType ||
              (options.unsafeRemoveAny && isTypeAny(paramType))
            ) {
              const paramNode = parserServices.tsNodeToESTreeNodeMap.get(param);
              context.report({
                node: paramNode,
                messageId: "test",
                fix: (fixer) => {
                  return fixer.remove((paramNode as any).typeAnnotation);
                },
              });
            }
          }
        });
      },
      CallExpression(node) {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const calleeTsNode = parserServices.esTreeNodeToTSNodeMap.get(
          node.callee
        );
        const calleeType = checker.getTypeAtLocation(calleeTsNode);
        const calleeSignature = checker.getSignaturesOfType(
          calleeType,
          ts.SignatureKind.Call
        )[0];

        tsNode.arguments.forEach((argument, argumentIdx) => {
          if (argument.kind === ts.SyntaxKind.ArrowFunction) {
            const arg = argument as ts.ArrowFunction;
            arg.parameters.forEach((param, paramIdx) => {
              if (!param.type) {
                return;
              }

              const paramType = checker.getTypeFromTypeNode(param.type);

              if (options.ignoreAnyParameters && isTypeAny(paramType)) {
                return;
              }

              if (calleeSignature.parameters[argumentIdx]) {
                const calleeParam = calleeSignature.parameters[argumentIdx];
                const calleeType = checker.getTypeOfSymbolAtLocation(
                  calleeParam,
                  calleeTsNode
                );
                const paramTypeFromCallee = checker.getTypeOfSymbolAtLocation(
                  calleeType.getCallSignatures()[0].parameters[paramIdx],
                  calleeTsNode
                );

                if (
                  paramTypeFromCallee === paramType ||
                  (options.unsafeRemoveAny && isTypeAny(paramType))
                ) {
                  const paramNode =
                    parserServices.tsNodeToESTreeNodeMap.get(param);
                  context.report({
                    node: paramNode,
                    messageId: "test",
                    fix: (fixer) => {
                      return fixer.remove((paramNode as any).typeAnnotation);
                    },
                  });
                }
              }
            });
          }
        });
      },
    };
  },
});
