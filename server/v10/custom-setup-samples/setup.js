
// Log as soon as the file is loaded, so we can see whether or not it loaded
console.log("Hello world from custom setup JS!");

// Enable hook debugging if you wish to see which hooks are run
/* CONFIG.debug.hooks = true */

// Hook on rendering the setup menu form
Hooks.on(
	"renderSetupConfigurationForm",
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
