// https://github.com/electron/electron/issues/21457#issuecomment-815770296
const electron = require("electron");

module.exports = () => {
	global.config.app.window.webContents.setWindowOpenHandler(({url} = {}) => {
		if (/^about:blank\b/.test(url)) return {action: "allow"};

		if (/https?:\/\//.test(url)) setImmediate(() => electron.shell.openExternal(url));

		return {action: "deny"};
	});
};
