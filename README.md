### Installation

- Copy the directory containing this README to `%appdata%/../Local/FoundryVTT/Data/modules`
- Restart Foundry
- In Foundry, go to the "Settings" ("?") tab, click "Manage Modules," and enable "Plutonium." Be sure to save the changes by clicking "Update Modules."

### Rivet

A companion browser extension, "Rivet," is available on the [Chrome](https://chrome.google.com/webstore/detail/rivet/igmilfmbmkmpkjjgoabaagaoohhhbjde) and [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/rivet/) web stores. With Rivet, you can one-click import content (notably creatures as a GM, or spells as a player) when browsing 5etools.

### Server-Side Modding

_**Note: Local/dedicated installs only!** You cannot use this with hosting services, such as Forge. Turn back now._

⚠️ Modifying server-side code can/will introduce security vulnerabilities, making your game more susceptible to attack. Some known vulnerabilities are highlighted below, but this is not a complete list. ⚠️

Plutonium comes with a server-side mod to enable mass-downloading via the built-in Art Browser. To install this:

- Find Foundry's `main.mjs` file in:
   - If you installed "for current user only" on Windows: `%appdata%/../Local/Programs/FoundryVTT/resources/app`
   - If you installed "for all users" on Windows: `Program Files/FoundryVTT/resources/app`
- Edit the file, changing this:
```js
init.default({
	args: process.argv,
	root: root,
	messages: startupMessages,
	debug: isDebug
})
```

to

```js
await init.default({
	args: process.argv,
	root: root,
	messages: startupMessages,
	debug: isDebug
});
(await import("./plutonium-backend.mjs")).Plutonium.init();
```
- Copy the `plutonium-backend.mjs` file from `server/<foundry version>/` to the directory containing `main.mjs`
- Launch Foundry, and pray that nothing explodes. If everything is working, the in-game Foundry logo (in the top-left of the screen) will show the running Plutonium backend version.

#### Custom Setup Screen Addon

This addon allows custom CSS and JavaScript to be loaded when viewing the setup screen, allowing additional styling/functionality to be applied.

⚠️ Enabling this addon allows any user with upload permissions to create potentially-malicious scripts and styles which will automatically be executed when a client visits the setup page. ⚠️

Installation: copy the `plutonium-backend-addon-custom-setup.mjs` file to the same directory as `plutonium-backend.mjs`.

Usage: create a `setup.css` and/or a `setup.js` in your Foundry data folder (alongside the `modules`, `systems`, and `worlds` directories). These files will then be loaded, if they exist, when a client visits the setup screen (`/setup`).

Examples can be found in the `server/<foundry version>/custom-setup-samples` directory.

#### Custom World Login Screen Addon

This addon allows custom CSS and JavaScript to be loaded when viewing a world's login screen, allowing additional styling/functionality to be applied on a per-world basis.

⚠️ Enabling this addon allows any user with upload permissions to create potentially-malicious scripts and styles which will automatically be executed when a client visits the login page. ⚠️

Installation: copy the `plutonium-backend-addon-custom-login.mjs` file to the same directory as `plutonium-backend.mjs`.

Usage: create a `login.css` and/or a `login.js` in a world's directory. These files will then be loaded, if they exist, when a client visits the login screen (`/join`) for a world.

For example, filling `worlds/my-world/login.css` with the CSS found in [this Reddit post](https://www.reddit.com/r/FoundryVTT/comments/nkg6z2) will have the same effect as modifying Foundry's `style.css` (as per the post), but the changes will only be applied to the login page for `my-world`. Aside from allowing per-world customization, this circumvents the need to re-apply the CSS changes after each Foundry update (assuming the Plutonium backend mod is re-applied instead!).

Further examples can be found in the `server/<foundry version>/custom-login-samples` directory.

#### Electron Addon

An additional file, `plutonium-backend-addon-electron.js`, can be installed in order to enable additional functionality when running Foundry as a "native" (Electron) app.

Installation: copy the `plutonium-backend-addon-electron.js` file to the same directory as `plutonium-backend.mjs`.

This addon allows the Foundry app to open popup windows, enabling Plutonium's "Pop Out" feature (among possible others, depending on your installed modules).

#### Package Operations

_Note that this addon is unused by Plutonium, and installation is therefore not recommended._

An additional file, `plutonium-backend-addon-package-operations.mjs`, can be installed in order to allow access to package lookup/installation while a game is running. This _theoretically_ allows Plutonium to install e.g. adventure worlds from within the Importer, but in practice, this feature is not currently used.

⚠️ Enabling this addon allows **any web client** to check the status of/install modules and worlds. ⚠️

Installation: copy the `plutonium-backend-addon-package-operations.mjs` file to the same directory as `plutonium-backend.mjs`.
