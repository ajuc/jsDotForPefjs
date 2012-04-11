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

/** @class Handler visualizing the creation of an edge.
	<br>This handler keeps track of the first clicked node,
	then draws the line to visualize the edge being created,
	and actually creates the edge when the second node is clicked.
	@constuctor
	@param {JSDot.jsdot_Impl} jsdot jsdot instance
	@param {JSDot.View} view view where we are drawing
	@param {JSDot.Editor} editor (optional) null or editor specifying the stencil
*/
JSDot.EdgeViz = function(jsdot, view, editor) {
	
	var my = this; /* closure for handlers */
	
	/** Starting node for the edge. */
	this.start = null;
	
	this.jsdot = jsdot;
	
	this.view = view;
	
	this.editor = editor;
	
	/** SVG line drawn on the view */
	this.line = null;
	
	/** The registered mousemove listener. */
	this.moveH = null;
	
	/** Registered handler for cancelling drawing (escape key). */
	this.cancelH = null;
	
	/** Handler for the JSDot click event. */
	this.click = function(obj, evt) {
	
		/* if it's not a node do nothing */
		if (!obj || !obj.isNode) return;
		
		/* selection of first node */
		if (!my.start) {
			my.start = obj;
			my.line = JSDot.helper.cesvg('line');
			my.line.setAttribute('class', 'jsdot_edgeviz_line');
			my.view.svgroot.appendChild(my.line);
			my.line.setAttribute('x1', evt.relX);
			my.line.setAttribute('y1', evt.relY);
			my.line.setAttribute('x2', evt.relX);
			my.line.setAttribute('y2', evt.relY);
			my.moveH = my.mousemove(my.view, my.line);
			my.view.svgroot.addEventListener('mousemove', my.moveH, false);
			my.cancelH = function(o) { return function(e) { if (e.keyCode == 27) o.cancel(); }; }(my);
			document.addEventListener('keydown', my.cancelH, false);
			window.focus();
			return;
		}
		
		/* selection of second node */
		
		var e = my.jsdot.graph.createEdge(my.start, obj, false);
		if (my.editor) e.setStencil(my.editor.currentEdgeStencil, false);
		my.cancel(); /* remove line and handlers */
		my.jsdot.fireEvent(my.jsdot.graph, 'created', e);
	};
	
	/** Creates the mousemove handler. */
	this.mousemove = function(view, line) {
		return function(evt) {
			view.addRelCoord(evt);
			line.setAttribute('x2', evt.relX);
			line.setAttribute('y2', evt.relY);
		};
	};
	
	/** Stop drawing. */
	this.cancel = function() {
		if (my.moveH) my.view.svgroot.removeEventListener('mousemove', my.moveH, false);
		if (my.cancelH) document.removeEventListener('keydown', my.cancelH, false);
		if (my.line) my.view.svgroot.removeChild(my.line);
		my.moveH = null;
		my.cancelH = null;
		my.line = null;
		my.start = null;
	};

};
