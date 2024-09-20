
// Log as soon as the file is loaded, so we can see whether or not it loaded
console.log("Hello world from custom login JS!");

// Enable hook debugging if you wish to see which hooks are run
/* CONFIG.debug.hooks = true */

// Hook on rendering the login form
Hooks.on(
	"renderJoinGameForm",
	(
		app /* JoinGameForm */,
		$element /* form#join-game */,
		{
			isAdmin,
			passwordString,
			users,
			usersCurrent,
			usersMax,
			world,
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

		/* --- */

		// Add "Enable/Disable Canvas" buttons to the login screen
		//   (This allows mobile users to disable the canvas *before* logging in)

		const setNoCanvas = (val) => {
			window.localStorage.setItem("core.noCanvas", JSON.stringify(val));
			ui.notifications.info(`Canvas ${val ? "disabled" : "enabled"}!`);
		};

		$(`<div class="form-group current-players">
            <label><i class="fas fa-palette"></i> Canvas</label>
            <div class="form-fields"></div>
        </div>`)
			.insertBefore($element.find(`button[name="join"]`))
			.find(`.form-fields`)
			.append(
				$(`<button class="" type="button">Enable</button>`)
					.click(() => setNoCanvas(false)),
				$(`<button class="" type="button">Disable</button>`)
					.click(() => setNoCanvas(true)),
			);

		/* --- */

		// Add an autoplaying background video to the login screen

		$(`<video muted autoplay loop style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; width: 100vw; height: 100vh; object-fit: cover; z-index: var(--z-index-background);">
          <source src="path/to/my/background.mp4" type="video/mp4">
       </video>`)
			.appendTo(document.body);

		/* --- */
	});
