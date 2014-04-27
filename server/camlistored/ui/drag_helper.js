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

goog.provide('cam.DragHelper');

// Helper to detect file drags over a React component. This takes special care with a difficult case where a file is dragged off the window and we never get a dragout event.
cam.DragHelper = function(component, timers) {
	this.component_ = component;
	this.timers_ = timers;
	this.timerId_ = 0;
	this.handleDragStart_ = this.handleDragStart_.bind(this);
	this.handleDragStop_ = this.handleDragStop_.bind(this);
};

cam.DragHelper.prototype.onDragOver = function(e) {};
cam.DragHelper.prototype.onDragOut = function() {};

cam.DragHelper.prototype.setProps = function(props) {
	props.onDragEnter = this.handleDragStart_;
	props.onDragOver = this.handleDragStart_;
}

cam.DragHelper.prototype.handleDragStart_ = function(e) {
	this.clearDragTimer_();
	e.preventDefault();
	this.timerId_ = this.timers_.setTimeout(this.handleDragStop_, 2000);
	this.onDragOver(e);
};

cam.DragHelper.prototype.handleDragStop_ = function() {
	this.clearDragTimer_();
	this.onDragOut();
};

cam.DragHelper.prototype.clearDragTimer_ = function() {
	if (this.timerId_) {
		this.timers_.clearTimeout(this.timerId_);
		this.timerId_ = 0;
	}
};
