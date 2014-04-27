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

goog.provide('cam.ContainerDetail');

goog.require('goog.object');
goog.require('goog.string');

goog.require('cam.BlobItemContainerReact');
goog.require('cam.functions');

cam.ContainerDetail.getAspect = function(params, blobref, searchSession) {
	var m = searchSession.getMeta(blobref);
	if (m.camliType != 'permanode') {
		return null;
	}

	// TODO(aa): Also handle directories and static sets.
	if (!goog.object.some(m.permanode.attr, function(v, k) { return k == 'camliMember' || goog.string.startsWith(k, 'camliPath:'); })) {
		return null;
	}

	return new cam.ContainerDetail.Aspect(params, blobref);
};

cam.ContainerDetail.Aspect = function(params, blobref) {
	this.params_ = params;
	this.blobref_ = blobref;
};

cam.ContainerDetail.Aspect.prototype.getTitle = function() {
	return 'Container';
};

cam.ContainerDetail.Aspect.prototype.createContent = function(size) {
	return cam.BlobItemContainerReact({
		detailURL: this.params_.getDetailURL,
		handlers: this.params_.handlers,
		history: this.params_.history,
		// TODO(aa): For directories and static sets, this will be NULL.
		onFileDrop: this.handleFileDrop_.bind(this),
		searchSession: this.getSearchSession_(),
		// TODO(aa): Support selection.
		selection: {},
		style: {
			height: size.height,
			left: 0,
			overflowX: 'hidden',
			overflowY: 'scroll',
			position: 'absolute',
			top: 0,
			width: size.width,
		},
		thumbnailSize: this.params_.thumbnailSize,
		timers: this.params_.timers,
	});
};

cam.ContainerDetail.Aspect.prototype.getSearchSession_ = cam.functions.cached(function() {
	return this.params_.getSearchSession(this.blobref_);
});

cam.ContainerDetail.Aspect.prototype.handleFileDrop_ = function(files) {
	this.params_.onFileDrop(files, this.blobref_);
};
