// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		const panel = vscode.window.createWebviewPanel(
			'redditviewer', // Identifies the type of the webview. Used internally
			'Reddit', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				// Enable scripts in the webview
				enableScripts: true
			} // Webview options. More on these later.
		);
		// Get path to resource on disk
		const onDiskPath = vscode.Uri.file(
			path.join(context.extensionPath, 'dist', 'index.html')
		);

		// Open the HTML file
		vscode.workspace.openTextDocument(onDiskPath).then((document) => {
			let html = document.getText(); // Get the HTML string
			let re = /href=\/js\/([^\s]+)/g; // Match all JavaScript imports
			let match = re.exec(html);
			let hrefjs = [];
			while (match != null) {
				hrefjs.push(match[1]); // Add match group to array
				match = re.exec(html);
			}

			hrefjs = UniqueArray(hrefjs); // Remove possible duplicates to avoid multiple replaces
			for (let i = 0; i < hrefjs.length; i++) {
				// Get the vscode extension path of the JavaScript file
				const onDiskPath = vscode.Uri.file(
					path.join(context.extensionPath, 'dist', 'js', hrefjs[i])
				).with({ scheme: "vscode-resource" });
				re = new RegExp("\/js\/" + hrefjs[i], "g");
				html = html.replace(re, onDiskPath); // Replace old path with new path
			}

			re = /href=\/css\/([^\s]+)/g; // Match all CSS imports
			match = re.exec(html);
			let hrefcss = [];
			while (match != null) {
				hrefcss.push(match[1]); // Add match group to array
				match = re.exec(html);
			}

			hrefcss = UniqueArray(hrefcss); // Remove possible duplicates to avoid multiple replaces
			for (let i = 0; i < hrefcss.length; i++) {
				// Get the vscode extension path of the JavaScript file
				const onDiskPath = vscode.Uri.file(
					path.join(context.extensionPath, 'dist', 'css', hrefcss[i])
				).with({ scheme: "vscode-resource" });
				re = new RegExp("\/css\/" + hrefcss[i], "g");
				html = html.replace(re, onDiskPath); // Replace old path with new path
			}

			panel.webview.html = html; // Load modified HTML into webview
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

/*
* remove duplicates from an array
* @param Array a
*/
function UniqueArray(a) {
	var temp = {};
	for (var i = 0; i < a.length; i++)
		temp[a[i]] = true;
	var r = [];
	for (var k in temp)
		r.push(k);
	return r;
}