
// Log as soon as the file is loaded, so we can see whether or not it loaded
console.log("Hello world from custom setup JS!");

// Enable hook debugging if you wish to see which hooks are run
/* CONFIG.debug.hooks = true */

// Hook on rendering the setup menu form
Hooks.on(
	"renderSetupMenu",
	(
		app /* SetupMenu */,
		$element /* nav#setup-menu */,
		{
			canLogOut,
			pips,
		},
	) => {
		// Your code here, e.g., ...

		/* --- */

		// Play audio on the login screen:
		AudioHelper.play({
			src: "https://upload.wikimedia.org/wikipedia/commons/0/04/Vivaldi_Winter_mvt_1_Allegro_non_molto_-_The_USAF_Concert.ogg",
			volume: 0.4,
			loop: true,
		});
	});

/* --- */

// Add a button to the setup screen, which allows installing modules from a debug dump, e.g. text of the form:
// ```
// ...
// module1==v1.2.3
// module2==v1.2.3
// module3==v1.2.3
// ...
// ```
Hooks.on(
	"renderSetupPackages",
	(
		app /* SetupPackages */,
		$element /* section#setup-packages */,
		{
			modules,
			systems,
			viewModes,
			worlds,
		},
	) => {
		const $btnInstallModules = $(`<button type="button" class="icon" style="flex: 0 0 var(--control-height);" title="Install Modules from Debug Info">
			 <i class="fa-solid fa-code"></i>
		</button>`)
			.on("click", async evt => {
				evt.stopPropagation();

				// Open a dialogue
				const text = await (class extends Dialog {
					static get defaultOptions () {
						return foundry.utils.mergeObject(super.defaultOptions, {
							height: 640,
							resizable: true,
						});
					}

					async _renderInner (...args) {
						const $out = await super._renderInner(...args);
						$out.filter(".dialog-content").css({
							"display": "flex",
							"flex-direction": "column",
							height: "100%",
							width: "100%",
							minHeight: "0",
						});
						return $out;
					}

					async _renderOuter (...args) {
						const $out = await super._renderOuter(...args);
						$out.find(".window-content").css({
							height: "100%",
							minHeight: "0",
						});
						return $out;
					}
				}).wait({
					title: "Test Dialog",
					content: `<p>Paste a debug dump and click Install.</p>
						<textarea style="font-family: monospace; width: 100%; height: 100%; resize: none;"></textarea>`,
					buttons: {
						install: {
							icon: "<i class=\"fas fa-check\"></i>",
							label: "Install",
							callback: async $html => $html.find("textarea").val().trim(),
						},
					},
				});

				if (!text?.trim()) return;

				const packageIds = [];
				text.replace(/^(?<id>[-_a-zA-Z0-9]+)==/gm, (...m) => `${packageIds.push(m.at(-1).id)}`);
				if (!packageIds.length) return ui.notifications.warn("No modules found!");

				const packageIdsToInstall = packageIds
					.filter(id => !game.modules.get(id));
				if (!packageIdsToInstall.length) return ui.notifications.info("All modules already installed!");

				ui.notifications.info(`Found ${packageIds.length} module${packageIds.length === 1 ? "" : "s"}, ${packageIdsToInstall.length} of which ${packageIdsToInstall.length === 1 ? "is" : "are"} not installed!`);

				let cntInstalled = 0;

				const packageList = await (await fetch("setup", {
					method: "post",
					body: JSON.stringify({"action": "getPackages", type: "module"}),
					headers: {
						accept: "application/json",
						"content-type": "application/json",
					},
				})).json();

				for (const packageId of packageIdsToInstall) {
					const meta = packageList.packages.find(meta => meta.id === packageId);
					if (!meta) {
						ui.notifications.warn(`Could not find package for module ID "${packageId}"`);
						continue;
					}

					await fetch("setup", {
						method: "post",
						body: JSON.stringify({"action": "installPackage", type: "module", manifest: meta.manifest}),
						headers: {
							accept: "application/json",
							"content-type": "application/json",
						},
					});
					cntInstalled++;
				}

				ui.notifications.info("Finished installing modules.");

				if (cntInstalled) window.location.reload();
			})
			.insertBefore($element.find(`#moduleCreate`));
	});
