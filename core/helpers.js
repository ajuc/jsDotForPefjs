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

/** @class Helpers for JSDot
	Sort of globally available functions and properties.
*/
JSDot.helper = {

	svgns: "http://www.w3.org/2000/svg",
	xlinkns: "http://www.w3.org/1999/xlink",
	xmlns: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink",

	/** Create element in the SVG namespace. */
	cesvg: function(i){ return document.createElementNS(JSDot.helper.svgns, i); },

	/** Create a new stencil with a css class.
		@param {Object} options options collection
		@param {Object, String} options.shape shape to draw, must be in {@link JSDot.shapes}
		@param {String} options.cssClass css class of the node
		@param {String} options.cssHl css class for highlighting
		@param {Function} options.draw function for drawing
		@param {Function} options.setPosition function for setting position
		@param {Function} options.setSize function for updating size
		@param {Function} options.getBoundaryTo function calculating intersection between the shape and a line
		@param {Function} options.getBBox function calculating the bounding box of the shape
		@param {Function} options.highlight function called when the shape must be highlit
		@return {Object} stencil
	*/
	makeCssStencil: function(options){
		var res = {};
		options = options || {};
		if (typeof options.shape == "string") {
			res.shape = JSDot.shapes[options.shape] || JSDot.shapes.circle;
		} else {
			res.shape = options.shape || JSDot.shapes.circle;
		}
		
		res.cssClass = options.cssClass || 'jsdot_circle';
		res.cssHl = 'jsdot_def_hl';
		
		res.draw = options.draw || function(n, d, g) {
			this.shape.draw(n, d, g);
			g.setAttribute('class', this.cssClass);
		};
		
		res.setPosition = options.setPosition || function(n, d) {
			this.shape.setPosition(n, d);
		};
		
		res.setSize = options.setSize || function(n, d, s) {
			this.shape.setSize(n, d, s);
		};
		
		res.getBoundaryTo = options.getBoundaryTo || function(n, d, p) {
			return this.shape.getBoundaryTo(n, d, p);
		};
		
		res.getBBox = options.getBBox || function(n, d) {
			return this.shape.getBBox(n, d);
		};
		
		res.highlight = options.highlight || function(n, d, y) {
			if (y) {
				d.group.setAttribute('class', this.cssClass+' '+this.cssHl);
			} else {
				d.group.setAttribute('class', this.cssClass);
			};
		};
		
		return res;
	},
	
	/** Create a shape for edges.
		@param {Object} options options collection
		@param {String} options.markerStart link to arrow marker
		@param {String} options.markerEnd link to arrow marker
		@param {Function} options.draw function drawing the shape
		@param {Function} options.setPosition function updating edge position
		@return {Object} edge shape
	*/
	makeEdgeShape: function(options) {
		var res = {};
		options = options || {};
		
		res.markerStart = options.markerStart;
		res.markerEnd = options.markerEnd;
		
		res.draw = options.draw || function(e, d, p) {
			var l = JSDot.helper.cesvg('path');
			d.line = l;
			if (this.markerStart) l.setAttribute('marker-start', this.markerStart);
			if (this.markerEnd) l.setAttribute('marker-end', this.markerEnd);
			p.appendChild(l);
			l = JSDot.helper.cesvg('path');
			d.handle = l;
			l.setAttribute('class', 'jsdot-edge-handle');
			p.appendChild(l);
			return l;
		};
		
		res.setPosition = options.setPosition || function(e, d) {
			var p1 = d.start;
			var p2 = d.end;
			d.line.setAttribute(
				'd', 'M'+p1[0]+','+p1[1]+'L'+p2[0]+','+p2[1]
			);
			d.handle.setAttribute(
				'd', 'M'+p1[0]+','+p1[1]+'L'+p2[0]+','+p2[1]
			);
		};
		
		return res;
	},
	
	/** Create an edge stencil.
		@param {Object} options options collection
		@param {Object, String} options.shape shape to draw, must be in {@link JSDot.edge_shapes}
		@param {String} options.cssClass css class of the edge
		@param {String} options.cssHl css class for highlighting
		@param {Function} options.draw function for drawing
		@param {Function} options.setPosition function for setting position
		@param {Function} options.highlight function called when the shape must be highlit
		@return {Object} stencil
	*/
	makeEdgeStencil: function(options) {
		var res = {};
		options = options || {};
		
		if (typeof options.shape == 'string') {
			res.shape = JSDot.edge_shapes[options.shape] || JSDot.edge_shapes.line;
		} else {
			res.shape = options.shape || JSDot.edge_shapes.line;
		}
		
		res.cssClass = options.cssClass || 'jsdot_line_edge';
		res.cssHl = options.cssHl || 'jsdot_def_hl';
		
		res.draw = options.draw || function(e, d, p) {
			this.shape.draw(e, d, p);
			p.setAttribute('class', this.cssClass);
		};
		
		res.setPosition = options.setPosition || function(e, d) {
			this.shape.setPosition(e, d);
		};
		
		res.highlight = options.highlight || function(e, d, y) {
			if (y) {
				d.group.setAttribute('class', this.cssClass+' '+this.cssHl);
			} else {
				d.group.setAttribute('class', this.cssClass);
			};
		};
		
		return res;
	}
};
