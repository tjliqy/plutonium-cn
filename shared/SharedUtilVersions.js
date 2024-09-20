export class SharedUtilVersions {
	static getVersionParts (version) {
		let [major, minor, patch] = version.split(".");

		// Split off any trailing junk, e.g. `-alpha-1`
		patch = patch.split("-")[0];

		major = Number(major);
		minor = Number(minor);
		patch = Number(patch);
		if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
			throw new Error(`Could not parse version number "${version}"!`);
		}
		return {major, minor, patch};
	}
}
