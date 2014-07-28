/*
Copyright 2014 The Camlistore Authors.

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

goog.provide('cam.Sidebar');
goog.provide('cam.Sidebar.Item');

goog.require('goog.events.KeyCodes');

goog.require('cam.object');
goog.require('cam.reactUtil');
goog.require('cam.style');

cam.Sidebar = React.createClass({
	displayName: 'Sidebar',

	propTypes: {
		height: React.PropTypes.number.isRequired,
		open: React.PropTypes.bool.isRequired,
		timer: React.PropTypes.shape({setTimeout: React.PropTypes.func.isRequired, clearTimeout: React.PropTypes.func.isRequired,}).isRequired,
	},

	componentWillMount: function() {
		this.expandTimer_ = 0;
	},

	render: function() {
		return React.DOM.div({
				className: React.addons.classSet({
					'cam-sidebar': true,
					'cam-sidebar-open': this.props.open,
				}),
				style: {
					height: this.props.height,
				},
			},
			this.props.children
		);
	},
});

cam.Sidebar.ItemBase = {
	propTypes: {
		iconSrc: React.PropTypes.string.isRequired,
	},

	getRootProps_: function(opt_extraClassName) {
		var className = 'cam-sidebar-item';
		if (opt_extraClassName) {
			className += ' ' + opt_extraClassName;
		}
		return {
			className: className,
			style: {backgroundImage:cam.style.getURLValue(this.props.iconSrc)},
		};
	},
};

cam.Sidebar.Item = React.createClass(cam.reactUtil.extend(cam.Sidebar.ItemBase, {
	propTypes: {
		onClick: React.PropTypes.func,
	},

	render: function() {
		return React.DOM.button(cam.object.extend(this.getRootProps_(), {
				onClick: this.props.onClick
			}), this.props.children);
	},
}));
