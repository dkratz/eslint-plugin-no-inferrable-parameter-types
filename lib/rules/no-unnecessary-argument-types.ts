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
    return {
      CallExpression(node) {
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
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
              if (param.type) {
                const paramType = checker.getTypeFromTypeNode(param.type);

                if (options.ignoreAnyParameters && isTypeAny(paramType)) {
                  return;
                }

                console.log(
                  " ",
                  param.name.getText(),
                  checker.typeToString(paramType)
                );

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

                  console.log(
                    "   ",
                    "calleeParam",
                    checker.typeToString(paramTypeFromCallee),
                    paramTypeFromCallee === paramType
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
              } else {
                console.log(" ", param.name.getText(), "noType");
              }
            });
          }
        });
      },
    };
  },
});
