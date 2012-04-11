/*
 This file is part of the JSDot library
 
 http://code.google.com/p/jsdot/
 
 Copyright (c) 2010 Carlo Vanini
 Copyright (c) 2009 Lucia Blondel, Nicos Giuliani, Carlo Vanini
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/** Construct a selection handler.
	@class Selection handler.
	Handles selection and dragging of nodes and edges in a view.

	@constructor
	@param {JSDot.jsdot_Impl} jsdot JSDot instance
	@param {JSDot.View} view JSDot view
*/
JSDot.Selection = function(jsdot, view) {

	/** Associated JSDot instance. */
	this.jsdot = jsdot;
	
	/** View on which the selection is represented. */
	this.view = view;
	
	/** Allow nodes to be selected.
		@note Be sure to call {@link deselectAll} when changing this to false.
	*/
	this.allowNodes = true;
	
	/** Allow edges to be selected.
		@note Be sure to call {@link deselectAll} when changing this to false.
	*/
	this.allowEdges = true;
	
	/** Allow multiple elements to be selected */
	this.allowMultiple = true;
	
	/** Allow dragging */
	this.allowDrag = true;
	
	/** Selected elements.
		Array of selected nodes and edges.
		@see select
		@see deselect
		@see deselectAll
	*/
	this.selection = [];
	
	/** True when dragging something
		@private
		@see svgMousemove_impl
	*/
	this.moving = false;
	
	/** Event which started a move.
		@private
	*/
	this.moveStart = null;
	
	/** Target object of an event.
		@private
		@see setEvtTarget
	*/
	this.evtTarget = null;
	
	/** Type of an event's target.
		@private
		@see setEvtTarget
	*/
	this.evtTargetType = '';


	/****************************************************************
		Register event listeners.
	****************************************************************/

	view.svgroot.addEventListener('mousedown',
			function(obj) {
				return function() {
					return obj.svgMousedown.apply(obj, arguments);
				};
			}(this), false);
	
	/** Handler for mousemove event on the SVG.
		Does dragging when it is enabled.
		
		We need to keep a reference to the handler in order to remove
		it when it is not needed anymore.
		
		The actual implementation is in {@link svgMousemove_impl},
		this is a closure.
		@see svgMousemove_impl
	*/
	this.svgMousemove =
			function(obj) {
				return function() {
					return obj.svgMousemove_impl.apply(obj, arguments);
				};
			}(this);
				
	view.svgroot.addEventListener('mouseup',
			function(obj) {
				return function() {
					return obj.svgMouseup.apply(obj, arguments);
				};
			}(this), false);
			
	jsdot.addEventHandler(jsdot.graph, 'removed',
			function(obj) {
				return function() {
					return obj.removedH.apply(obj, arguments);
				};
			}(this) );
			
	jsdot.addEventHandler(jsdot.graph, 'newgraph',
			function(obj) {
				return function() {
					return obj.newgraphH.apply(obj, arguments);
				};
			}(this) );
};

JSDot.Selection.prototype = {

	/** Handler for mousedown event on the SVG.
		Handles mousedown events.
		
		@private
	*/
	svgMousedown: function(evt) {

		/* prevent Firefox own drag & drop of the image */
		evt.preventDefault();

		this.moving = false;
		this.moveStart = evt;
		this.setEvtTarget(evt);
		if (this.allowDrag) {
			/* if dragging is enabled, register for mousemove */
			this.view.svgroot.addEventListener('mousemove', this.svgMousemove, false);
		};
		/* no matter whether it is a click or a drag, it will be handled in svgMouseup */
	},
	
	/** Find the target JSDot  element of an event.
		As a result {@link evtTarget} and {@link evtTargetType} are changed.
		@private
		@param {Object} evt event
	*/
	setEvtTarget: function(evt) {
		if (evt.target.tagName.toLowerCase() == 'svg') {
			/* background */
			this.evtTarget = null;
			this.evtTargetType = 's';
		} else {
			/* something contained in a group */
			var n = evt.target.parentNode.jsdot_node;
			if (n) {
				/* node */
				this.evtTarget = n;
				this.evtTargetType = 'n';
			} else if (n = evt.target.parentNode.jsdot_edge) {
				/* edge */
				this.evtTarget = n;
				this.evtTargetType = 'e';
			};
		};
	},
	
	/** Handle a click.
		When selection is enabled and it changes, the event
		'selectionchg' is fired. If selection is disabled
		then then a 'click' event is fired.<br>
		When only one of allowEdges and allowNodes
		is true, clicking on edge resp. node fires 'selectionchg'
		but clicking on the other one does nothing (no 'click').
		
		@note {@link setEvtTarget} must have been called before calling this!
		
		@private
		@param {Object} evt event
	*/
	handleClick: function(evt) {
		if (!this.allowEdges && !this.allowNodes) {
			/* If selection is disabled the event is 'click' */
			this.view.addRelCoord(evt);
			this.view.fireViewEvent('click', this.evtTarget, evt);
		} else {
			/* if selection is enabled we handle it */
			switch (this.evtTargetType) {
				case 's':
					/* click on background */
					this.deselectAll();
					break;
				case 'n':
				case 'e':
					/* node or edge */
					/* selection is allowed, so we (de)select */
					if (this.isSelected(this.evtTarget)) {
						if (evt.ctrlKey) {
							this.deselect(this.evtTarget);
						} else {
							this.deselectAll();
							this.select(this.evtTarget);
						}
					} else {
						if (!evt.ctrlKey) this.deselectAll();
						this.select(this.evtTarget);
					};
					break;
				default:
					/* ignore */
			};
		};
	},
	
	/** Implementation of the mousemove event handler.
		Does dragging when it is enabled.
		
		Use {@link svgMousemove} for add/remove listener.
		@private
	*/
	svgMousemove_impl: function(evt) {
		var dx = evt.pageX - this.moveStart.pageX;
		var dy = evt.pageY - this.moveStart.pageY;
		if (!this.moving) {
			/* We are not dragging yet. Check if the mouse moved more than
			   a given threshold, otherwise a mouseup would still be a click
			   instead of a drop.
			*/
			if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
				/* start moving */
				this.moving = true;
				this.view.fireViewEvent('pick', this.evtTarget);
			};
		};
		
		if (this.moving) {
			evt.dx = dx;
			evt.dy = dy;
			this.view.fireViewEvent('drag', this.evtTarget, evt);
		};
	},
	
	/** Handler for mouseup event on the SVG.
		@private
	*/
	svgMouseup: function(evt) {
		this.view.svgroot.removeEventListener('mousemove', this.svgMousemove, false);
		if (!this.moving) {
			this.handleClick(this.moveStart);
		} else {
			evt.dx = evt.pageX - this.moveStart.pageX;
			evt.dy = evt.pageY - this.moveStart.pageY;
			this.view.fireViewEvent('drop', this.evtTarget, evt);
		};
		this.moving = false;
		this.moveStart = null;
	},
	
	/** Handler for JSDot 'removed' event.
		When a node or an edge gets removed from the graph and it was
		selected, then it must be removed from the selection in order
		to keep it consistent.
		
		If an element is being removed it is implied that it won't be
		selected anymore, therefore no 'selectionchg' event is fired.
		@see doc_Handler.removed
	*/
	removedH: function(w) {
		if (w.isNode) {
			/* even if the node itself is not selected one of its edges
			   might be selected and must be removed */
			for (var e in w.edges) {
				this.deselect(w.edges[e], false);
				/* if it's not selected this doesn't do anything */
			}
		}
		this.deselect(w, false);
	},
	
	/** Handler for the {@link doc_Handler.newgraph} event.
		Clears the selection without firing any event.
	*/
	newgraphH: function() {
		this.selection.length = 0;
	},
	
	/** Adds an element to the selection.
		If the given element cannot be added to the
		selection it will be ignored.
		
		Fires a 'selectionchg' event.
		
		If the element is already selected does nothing.
		
		If the selection is not multiple, already selected
		elements will be deselected (firing the relative events).
		@param {Object} n @ref Node or @ref Edge to add
		@see allowNodes
		@see allowEdges
		@see allowMultiple
	*/
	select: function(n) {
		if (this.isSelected(n)) return;
		if (n.isEdge && this.allowEdges ||
				n.isNode && this.allowNodes) {
			/* it is an edge and we are allowed to select them,
			   or it is a node and they are allowed. */
			if (!this.allowMultiple) this.deselectAll();
			this.selection.push(n);
			this.view.fireViewEvent('selectionchg', n, true);
		};
	},
	
	/** Remove an element from selection.
		If the element is not selected this doesn't do anything.
		Fires a 'selectionchg' event.
		@param {Object} n the element (node/edge) to remove from selection
		@param {boolean} fire whether to fire the event or not, default is yes
		@see doc_Handler.selectionchg
	*/
	deselect: function(n, fire) {
		if (this.isSelected(n)) {
			this.selection.splice(this.selection.indexOf(n), 1);
			if (fire !== false) this.view.fireViewEvent('selectionchg', n, false);
		};
	},
	
	/** Deselect all nodes and edges.
		Fires a 'selectionchg' event for each node and edge.
	*/
	deselectAll: function() {
		var e;
		while (e = this.selection.pop()) {
			this.view.fireViewEvent('selectionchg', e, false);
			e = undefined;
		};
	},
	
	/** Check whether an element is selected.
		@param {Object} v Node or Edge to check
		@return {Boolean} True if v is selected, false otherwise
	*/
	isSelected: function (v) {
		return (this.selection.indexOf(v) >= 0);
	},
	
	/** First node in selection.
		Returns the first node in the selection, usually it is
		the first that has been selected.<br>
		Returns null if there isn't any selected node.
		@return {Node_impl} first selected node or null
	*/
	firstNode: function() {
		for (var i in this.selection) {
			if (this.selection[i].isNode) return this.selection[i];
		}
		return null;
	},
	
	/** Apply a function to selected node.
		For each selected node f(n) is called.
		f() must not change the selection!
	*/
	forNodes: function(f) {
		for (var i in this.selection) {
			if (this.selection[i].isNode) {
				f(this.selection[i]);
			}
		}
	},
	
	/** Apply a function to selected edges.
		For each selected edge f(n) is called.
		f() must not change the selection!
	*/
	forEdges: function(f) {
		for (var i in this.selection) {
			if (this.selection[i].isEdge) {
				f(this.selection[i]);
			}
		}
	},

};
