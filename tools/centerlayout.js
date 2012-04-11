/*
This file is part of the JSDot library

http://code.google.com/p/jsdot/

Copyright (c) 2010 Carlo Vanini

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

JSDot.ViewTools.Layout.Center = function() {
};

JSDot.ViewTools.Layout.Center.prototype = {

	init: function(params) {
		this.view = params.view;
		this.graph = params.graph;
		return true;
	},
	
	doLayout: function() {
		
		var nd = this.graph.nodes;
		var xmin = 0, ymin = 0, xmax = 0, ymax = 0;
		for(var i in nd) {
			var p = nd[i].position;
			xmin = xmax = p[0];
			ymin = ymax = p[1];
			break;
		}
		
		for (var i in nd) {
			var p = nd[i].position;
			var bb = this.view.getBBox(nd[i]);
			xmin = Math.min(xmin, bb.x);
			xmax = Math.max(xmax, bb.x+bb.width);
			ymin = Math.min(ymin, bb.y);
			ymax = Math.max(ymax, bb.y+bb.height);
		}
		
		var svgbb = this.view.svgroot.parentNode.getBoundingClientRect();
		//var svgbb = this.view.svgroot.getBoundingClientRect();
		var rx = Math.min(1, svgbb.width / (xmax - xmin));
		var ry = Math.min(1, svgbb.height / (ymax - ymin));
		var dx = 0;
		var dy = 0;
		if (rx != 1) {
			dx = -xmin;
		} else {
			/* we didn't resize, it means the drawing is not bigger than the available space */
			/* we move only if there is something outside the visible region */
			if (xmin < 0) dx = -xmin;
			else if (xmax > svgbb.width) dx = svgbb.width - xmax;
			/* use the line below to always center */
			//dx = -xmin + (svgbb.width - (xmax-xmin)) / 2;
		}
		if (ry != 1) {
			dy = -ymin;
		} else {
			if (ymin < 0) dy = -ymin;
			else if (ymax > svgbb.height) dy = svgbb.height - ymax;
			//dy = -ymin + (svgbb.height - (ymax-ymin)) / 2;
		}
		
		for (var i in nd) {
			var p = nd[i].position;
			nd[i].setPosition( [(p[0]+dx)*rx, (p[1]+dy)*ry] );
		}
	},

};
