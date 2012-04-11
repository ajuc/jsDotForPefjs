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

JSDot.ViewTools.Layout.SpringEmbedder = function() {

	this.options = {
		nodesep: 20,
		iterations: 20,
	};

};

JSDot.ViewTools.Layout.SpringEmbedder.prototype = {

	init: function(params) {
		this.view = params.view;
		this.graph = params.graph;
		return true;
	},
	
	doLayout: function() {
	
		/* where we keep our information about nodes */
		this.nodes = {};
		
		/* info about edges */
		this.edges = {};
		
		/* get bounding box for every node */
		var nd = this.graph.nodes;
		for (var i in nd) {
			var p = nd[i].position;
			this.nodes[i] = {
				bb: this.view.getBBox(nd[i]),
				x: p[0],
				y: p[1],
				accelx: 0,
				accely: 0,
				node: nd[i]
				};
		}
		
		var ed = this.graph.edges;
		for (var i in ed) {
			var sbb = this.nodes[ed[i].src.name].bb;
			var dbb = this.nodes[ed[i].dst.name].bb;
			this.edges[i] = {
				edgelen: Math.max(sbb.width, sbb.height) +
					Math.max(dbb.width, dbb.height) + this.options.nodesep,
				src: this.nodes[ed[i].src.name],
				dst: this.nodes[ed[i].dst.name]
			};
		}
		
		for (var i = this.options.iterations; i > 0; i--) {
			this.springEmbedder(); /* do one step */
		}
		
		this.updateRealNodes();
		
		delete this.nodes;
		delete this.edges;
		
		/* not connected nodes tend to fly off, so we scale and center */
		this.view.getTool('Layout.Center', {}).doLayout();
	
	},
	
	updateRealNodes: function() {
		var nd = this.nodes;
		for (var i in nd) {
			var n = nd[i];
			n.node.setPosition( [n.x, n.y] );
		}
	},
	
	springEmbedder: function() {
	
		/* calculate springs forces */
		var ed = this.edges;
		for (var i in ed) {
			var vx = ed[i].dst.x - ed[i].src.x;
			var vy = ed[i].dst.y - ed[i].src.y;
			var len = Math.sqrt(vx*vx + vy*vy);
			if (len == 0) len = this.options.nodesep;
			var f = (ed[i].edgelen - len) / (len * 3);
			var dx = f * vx;
			var dy = f * vy;
			
			ed[i].src.accelx -= dx;
			ed[i].src.accely -= dy;
			ed[i].dst.accelx += dx;
			ed[i].dst.accely += dy;
		}
		
		/* calculate node repulsion forces */
		var nd = this.nodes;
		for (var i in nd) {
			var n1 = nd[i];
			var dx = 0;
			var dy = 0;
			
			for (var j in nd) {
				if (i != j) { /* skip same node */
					var n2 = nd[j];
					var vx = n1.x - n2.x;
					var vy = n1.y - n2.y;
					var len = Math.sqrt(vx*vx + vy*vy);
					//var len = vx*vx + vy*vy;
					if (len == 0) {
						dx += Math.random();
						dy += Math.random();
					} else {
						dx += vx / len;
						dy += vy / len;
					}
				}
			}
			
			var dlen = dx*dx + dy*dy;
			if (dlen > 0) { /* might be 0... wath's wrong? */
				dlen = Math.sqrt(dlen)/2;
				n1.accelx += dx * dlen;
				n1.accely += dy * dlen;
			}
		}
		
		/* calculate new positions */
		for (var i in nd) {
			var n1 = nd[i];
			n1.x += n1.accelx * 0.1;
			n1.y += n1.accely * 0.1;
			n1.accelx = n1.accelx / 2;
			n1.accely = n1.accely / 2;
		}
		
	},

};
