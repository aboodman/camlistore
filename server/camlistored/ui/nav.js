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

goog.provide('cam.Nav');
goog.provide('cam.Nav.Item');
goog.provide('cam.Nav.LinkItem');
goog.provide('cam.Nav.SearchItem');

goog.require('goog.events.KeyCodes');

goog.require('cam.object');
goog.require('cam.reactUtil');
goog.require('cam.style');

// new nav plan
// ====================

// three parts:
// - top bar
// - drop-down menu from top bar
// - contextual slide out from right

// top bar:
// - menu button
// - search box
// - things that affect the display of the current view:
//   - view type (future) (icons, list, columns)
//   - sort (mod, create)
//   - size

// menu
// - New Permanode
// - Upload
// - Importers (maybe future this is 'Apps')
// - anything else that is non-contextual

// contextual - displayed when one or more items are selected
// - add to set...
// - tags
// - location
// - people
// - clear selection
// - delete
cam.Nav = React.createClass({
	displayName: 'Nav',

	propTypes: {
		onOpen: React.PropTypes.func.isRequired,
		onClose: React.PropTypes.func.isRequired,
		open: React.PropTypes.bool.isRequired,
		timer: React.PropTypes.shape({setTimeout: React.PropTypes.func.isRequired, clearTimeout: React.PropTypes.func.isRequired,}).isRequired,
	},

	componentWillMount: function() {
		this.expandTimer_ = 0;
	},

	render: function() {
		return React.DOM.div({
				className: React.addons.classSet({
					'cam-nav': true,
					'cam-nav-collapsed': !this.props.open,
				}),
				onMouseEnter: this.handleMouseEnter_,
				onMouseLeave: this.handleMouseLeave_,
				onKeyUp: this.handleKeyUp_,
			},
			React.DOM.img({className:'cam-nav-close', src:'close.svg', onClick: this.handleCloseClick_}),
			this.props.children
		);
	},

	open: function() {
		this.clearExpandTimer_();
		this.props.onOpen();
	},

	close: function() {
		this.clearExpandTimer_();
		this.props.onClose();
	},

	handleMouseEnter_: function(e) {
		this.clearExpandTimer_();
		this.expandTimer_ = this.props.timer.setTimeout(this.open, 250);
	},

	clearExpandTimer_: function() {
		if (this.expandTimer_) {
			this.props.timer.clearTimeout(this.expandTimer_);
			this.expandTimer_ = 0;
		}
	},

	handleMouseLeave_: this.clearExpandTimer_,

	handleKeyUp_: function(e) {
		if (e.keyCode == goog.events.KeyCodes.ESC) {
			e.preventDefault();
			this.close();
		}
	},

	handleCloseClick_: function(e) {
		e.stopPropagation();
		this.close();
	},
});

cam.Nav.ItemBase = {
	propTypes: {
		iconSrc: React.PropTypes.string.isRequired,
	},

	getRootProps_: function(opt_extraClassName) {
		var className = 'cam-nav-item';
		if (opt_extraClassName) {
			className += ' ' + opt_extraClassName;
		}
		return {
			className: className,
			style: {backgroundImage:cam.style.getURLValue(this.props.iconSrc)},
		};
	},
};

cam.Nav.Item = React.createClass(cam.reactUtil.extend(cam.Nav.ItemBase, {
	propTypes: {
		onClick: React.PropTypes.func,
	},

	render: function() {
		return React.DOM.button(cam.object.extend(this.getRootProps_(), {
				onClick: this.props.onClick
			}), this.props.children);
	},
}));


cam.Nav.SearchItem = React.createClass(cam.reactUtil.extend(cam.Nav.ItemBase, {
	propTypes: {
		value: React.PropTypes.string,
		onSearch: React.PropTypes.func.isRequired,
	},

	getDefaultProps: function() {
		return {
			value: '',
		}
	},

	render: function() {
		if (!goog.isString(this.props.children)) {
			throw new Error('Children of cam.Nav.SearchItem must be a single string.');
		}

		return React.DOM.div(this.getRootProps_('cam-nav-searchitem'),
			React.DOM.form({onClick:this.focus, onSubmit:this.handleSubmit_},
				React.DOM.input({
					ref:'input',
					placeholder:this.props.children,
					defaultValue: this.props.value,
					onChange: this.handleChange_,
					onMouseEnter: this.focus,
				})
			)
		);
	},

	focus: function() {
		this.getInputNode_().focus();
	},

	blur: function() {
		this.getInputNode_().blur();
	},

	clear: function() {
		this.getInputNode_().value = '';
	},

	handleSubmit_: function(e) {
		this.props.onSearch(this.getInputNode_().value);
		e.preventDefault();
	},

	getInputNode_: function() {
		return this.refs.input.getDOMNode();
	}
}));


cam.Nav.LinkItem = React.createClass(cam.reactUtil.extend(cam.Nav.ItemBase, {
	propTypes: {
		extraClassName: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
	},

	getDefaultProps: function() {
		return {
			extraClassName: '',
		};
	},

	render: function() {
		var extraClassName = 'cam-nav-linkitem';
		if (this.props.extraClassName != '') {
			extraClassName += ' ' + this.props.extraClassName;
		}
		return React.DOM.a(
			cam.object.extend(this.getRootProps_(extraClassName), {href:this.props.href}),
			this.props.children
		);
	},
}));
