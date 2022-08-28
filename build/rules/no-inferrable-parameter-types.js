"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("@typescript-eslint/utils");
const ts = __importStar(require("typescript"));
const tsutils = __importStar(require("tsutils"));
const isTypeAny = (type) => tsutils.isTypeFlagSet(type, ts.TypeFlags.Any);
exports.rule = utils_1.ESLintUtils.RuleCreator.withoutDocs({
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
        var _a, _b, _c, _d;
        // TODO: Why isn't defaultOptions applied?
        const options = {
            ignoreAnyParameters: (_b = (_a = context.options[0]) === null || _a === void 0 ? void 0 : _a.ignoreAnyParameters) !== null && _b !== void 0 ? _b : true,
            unsafeRemoveAny: (_d = (_c = context.options[0]) === null || _c === void 0 ? void 0 : _c.unsafeRemoveAny) !== null && _d !== void 0 ? _d : false,
        };
        const parserServices = utils_1.ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();
        const typesAreEqual = (a, b) => {
            const formatFlags = ts.TypeFormatFlags.None;
            return (a === b ||
                checker.typeToString(a, undefined, formatFlags) ===
                    checker.typeToString(b, undefined, formatFlags));
        };
        return {
            VariableDeclarator(node) {
                var _a;
                const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                if (!tsNode.type ||
                    ((_a = tsNode.initializer) === null || _a === void 0 ? void 0 : _a.kind) !== ts.SyntaxKind.ArrowFunction) {
                    return;
                }
                const parentType = checker.getTypeAtLocation(tsNode);
                const parentSignature = checker.getSignaturesOfType(parentType, ts.SignatureKind.Call)[0];
                const arg = tsNode.initializer;
                arg.parameters.forEach((param, paramIdx) => {
                    if (!param.type) {
                        return;
                    }
                    const paramType = checker.getTypeFromTypeNode(param.type);
                    if (options.ignoreAnyParameters && isTypeAny(paramType)) {
                        return;
                    }
                    if (parentSignature.parameters[paramIdx]) {
                        const parentParam = parentSignature.parameters[paramIdx];
                        const calleeType = checker.getTypeOfSymbolAtLocation(parentParam, tsNode);
                        if (typesAreEqual(calleeType, paramType) ||
                            (options.unsafeRemoveAny && isTypeAny(paramType))) {
                            const paramNode = parserServices.tsNodeToESTreeNodeMap.get(param);
                            context.report({
                                node: paramNode,
                                messageId: "test",
                                fix: (fixer) => {
                                    return fixer.remove(paramNode.typeAnnotation);
                                },
                            });
                        }
                    }
                });
            },
            CallExpression(node) {
                const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                const calleeTsNode = parserServices.esTreeNodeToTSNodeMap.get(node.callee);
                const calleeType = checker.getTypeAtLocation(calleeTsNode);
                const calleeSignature = checker.getSignaturesOfType(calleeType, ts.SignatureKind.Call)[0];
                tsNode.arguments.forEach((argument, argumentIdx) => {
                    if (argument.kind === ts.SyntaxKind.ArrowFunction) {
                        const arg = argument;
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
                                const calleeType = checker.getTypeOfSymbolAtLocation(calleeParam, calleeTsNode);
                                const paramTypeFromCallee = checker.getTypeOfSymbolAtLocation(calleeType.getCallSignatures()[0].parameters[paramIdx], calleeTsNode);
                                if (paramTypeFromCallee === paramType ||
                                    (options.unsafeRemoveAny && isTypeAny(paramType))) {
                                    const paramNode = parserServices.tsNodeToESTreeNodeMap.get(param);
                                    context.report({
                                        node: paramNode,
                                        messageId: "test",
                                        fix: (fixer) => {
                                            return fixer.remove(paramNode.typeAnnotation);
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
