import fs from "fs";
import path from "path";
import View from "./dist/server/views/view.mjs";
import {getRoute} from "./common/utils/helpers.mjs";

const _FILENAME_CSS = "login.css";
const _FILENAME_JS = "login.js";

export default () => {
	const {logger} = global;

	const boundGetStaticContent = View._getStaticContent.bind(View);
	View._getStaticContent = (...args) => {
		const out = boundGetStaticContent(...args);

		if (!global.game?.world?.id || !args[0]?.setup) return out;

		if (fs.existsSync(path.join(global.game.world?.path, _FILENAME_CSS))) {
			logger.debug(`Found "${_FILENAME_CSS}" additional login style file for world "${global.game.world.id}"; serving...`);
			out.styles.push({
				src: getRoute(`worlds/${global.game.world.id}/${_FILENAME_CSS}`, {prefix: global.config.options.routePrefix}),
				type: "style",
				priority: 1,
				isModule: false,
			});
		}

		if (fs.existsSync(path.join(global.game.world?.path, _FILENAME_JS))) {
			logger.debug(`Found "${_FILENAME_JS}" additional login script file for world "${global.game.world.id}"; serving...`);
			out.scripts.push({
				src: getRoute(`worlds/${global.game.world.id}/${_FILENAME_JS}`, {prefix: global.config.options.routePrefix}),
				type: "script",
				priority: 2,
				isModule: false,
			});
		}

		return out;
	};
};
