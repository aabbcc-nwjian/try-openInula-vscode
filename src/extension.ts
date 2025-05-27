import * as vscode from 'vscode';
import { parse } from '@babel/parser';
const traverse = require('@babel/traverse').default;

function detectOpenInulaComponents(document: vscode.TextDocument) {
    const text = document.getText();
    try {
        const ast = parse(text, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });

        const inulaComponents = new Set<string>();

        traverse(ast, {
            JSXOpeningElement(path: { node: { name: any; }; }) {
                const elementName = path.node.name;
                if (elementName.type === 'JSXIdentifier') {
                    const name = elementName.name;
                    const inulaSpecificComponents = [
                        'InulaRouter', 'InulaRoute', 'InulaLink',
                        'InulaRequest', 'InulaTable', 'InulaForm'
                    ];
                    
                    if (inulaSpecificComponents.includes(name)) {
                        inulaComponents.add(name);
                    }
                }
            }
        });

        return Array.from(inulaComponents);
    } catch (error) {
        console.error('解析错误:', error);
        return [];
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.detectInulaComponents', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const components = detectOpenInulaComponents(editor.document);
            if (components.length > 0) {
                vscode.window.showInformationMessage(
                    `检测到OpenInula特有组件: ${components.join(', ')}`
                );
            } else {
                vscode.window.showInformationMessage('未检测到OpenInula特有组件');
            }
        }
    });

    context.subscriptions.push(disposable);

    vscode.workspace.onDidOpenTextDocument(document => {
        if (['javascript', 'typescript', 'javascriptreact', 'typescriptreact']
            .includes(document.languageId)) {
            const components = detectOpenInulaComponents(document);
            if (components.length > 0) {
                vscode.window.showInformationMessage(
                    `检测到OpenInula特有组件: ${components.join(', ')}`
                );
            }
        }
    });
}