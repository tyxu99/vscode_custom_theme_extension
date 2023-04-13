// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "custom-code-style" is now active!');
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('custom-code-style.helloWorld', () => {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user
  // vscode.window.showInformationMessage('Hello World from custom-code-style!');
  // });
  // context.subscriptions.push(disposable);

	console.log("custom-code-style activate");
	
	// const config = vscode.workspace.getConfiguration("custom-code-style");

  const openingColor = "#ffd700";
  const closingColor = "#da70d6";

  const openingBracketDecorationType = vscode.window.createTextEditorDecorationType({
    color: openingColor,
  });
  const closingBracketDecorationType = vscode.window.createTextEditorDecorationType({
    color: closingColor,
  });
  const constWordDecorationType = vscode.window.createTextEditorDecorationType({
    fontStyle: "italic",
    fontWeight: "600",
    color: "#ffd700",
    borderWidth: "0 0 2px 0",
    borderColor: "#da70d6",
  });

  const findCharIndexOfStr = (str: string, char: string) => {
    const arr = [];
    let index = -1;
    while ((index = str.indexOf(char, index + 1)) !== -1) {
      arr.push(index);
    }
    return arr;
  };

  const customLeftBracket = (text: string) => {
    const activeEditor = vscode.window.activeTextEditor;
    const document = activeEditor!.document;

    const openingBrackets = ["(", "[", "{", "<"];
    const closingBrackets = [")", "]", "}", ">"];

    const constIndexArr = findCharIndexOfStr(text, " const ");

    const decorations = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if ([...openingBrackets, ...closingBrackets].includes(char)) {
        const d = {
          range: new vscode.Range(document.positionAt(i), document.positionAt(i + 1)),
        };
        decorations.push({
          ...d,
          color: openingBrackets.includes(char) ? openingColor : closingColor,
        });
      }
    }

    constIndexArr.forEach((d) =>
      decorations.push({
        range: new vscode.Range(document.positionAt(d + 1), document.positionAt(d + 6)),
        color: "red",
      })
    );

    activeEditor!.setDecorations(
      openingBracketDecorationType,
      decorations.filter((d) => d.color === openingColor)
    );
    activeEditor!.setDecorations(
      closingBracketDecorationType,
      decorations.filter((d) => d.color === closingColor)
    );
    activeEditor!.setDecorations(
      constWordDecorationType,
      decorations.filter((d) => d.color === "red")
    );
  };

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const text = activeEditor.document.getText();
    customLeftBracket(text);
  }

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      const text = editor.document.getText();
      customLeftBracket(text);
    }
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (activeEditor && event.document === activeEditor.document) {
      const text = activeEditor.document.getText();
      customLeftBracket(text);
    }
  });

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("code-style=config") && activeEditor) {
      const text = activeEditor?.document.getText();
      customLeftBracket(text);
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
