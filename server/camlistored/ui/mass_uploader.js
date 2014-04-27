/*
Copyright 2014 The Camlistore Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

goog.provide('cam.MassUploader');

goog.require('goog.labs.Promise');

// @param {cam.ServerConnection} sc
// @param {FileList} files
// @param {?string=} opt_parent The parent permanode to make the files members of.
cam.MassUploader.upload = function(sc, files, opt_parent) {
	// TODO(aa): Directories!

	var numComplete = 0;

	console.log('Uploading %d files...', files.length);
	goog.labs.Promise.all(Array.prototype.map.call(files, function(file) {
		var upload = new goog.labs.Promise(sc.uploadFile.bind(sc, file));
		var createPermanode = new goog.labs.Promise(sc.createPermanode.bind(sc));
		return goog.labs.Promise.all([upload, createPermanode]).then(function(results) {
			// TODO(aa): Icky manual destructuring of results. Seems like there must be a better way?
			var fileRef = results[0];
			var permanodeRef = results[1];
			var setCamliContent = new goog.labs.Promise(sc.newSetAttributeClaim.bind(sc, permanodeRef, 'camliContent', fileRef));
			if (!opt_parent) {
				return setCamliContent;
			}
			var setMember = new goog.labs.Promise(sc.newSetAttributeClaim.bind(sc, opt_parent, 'camliPath:' + file.name, permanodeRef));
			return goog.labs.Promise.all([setCamliContent, setMember]);
		}).thenCatch(function(e) {
			console.error('File upload fall down go boom. file: %s, error: %s', file.name, e);
		}).then(function() {
			console.log('%d of %d files complete.', ++numComplete, files.length);
		});
	})).then(function() {
		console.log('All complete');
	});
};
