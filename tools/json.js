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

JSDot.GraphTools.json = function() {
};

JSDot.GraphTools.json.prototype = {

	init: function(params) {
		if (!params || !params.graph) return null;
		this.graph = params.graph;
		return this;
	},

	importGraph: function(str) {
		var g = this.graph;
		var map = {};
		
		var obj = str;
		if (typeof str === 'string') {
			try { obj = JSON.parse(str); }
			catch (e) { return 1; }
		}
		if (!obj) return 1;
		
		g.setDefaultStencils(obj.defaultNodeStencil, obj.defaultEdgeStencil);
		if (typeof obj.nodes != "object" || typeof obj.edges != "object") {
			return 1; // obj is malformed
		}
		
		for (var i in obj.nodes) {
			var t = obj.nodes[i];
			if (map[t.name]) return 2; // duplicate name in obj
			var c = g.createNode(t.name, false);
			if (!c) {
				c = g.createNode(null, false);
			}
			map[t.name] = c;
			if (t.label) c.setLabel(t.label.value, false);
			if (t.position) c.setPosition(t.position, false);
			if (typeof t.stencil == "string") c.setStencil(t.stencil, false);
			if (t.userData && t.userData["data"]) c.setData("data", t.userData["data"]);
		}
		
		for (var i in obj.edges) {
			var t = obj.edges[i];
			if (!map[t.src] || !map[t.dst]) return 3; // edge links inexistent node
			var c = g.createEdge(map[t.src], map[t.dst], false);
			if (t.label) c.setLabel(t.label.value, false);
			if (typeof t.stencil == "string") c.setStencil(t.stencil, false);
			if (t.userData && t.userData["data"]) c.setData("data", t.userData["data"]);
		}
		
		this.graph.fireGraphEvent('newgraph');
		return 0;
	},
	
	exportGraph: function() {
		var res = {
			nodes: [],
			edges: [],
			defaultNodeStencil: this.graph.defaultNodeStencil,
			defaultEdgeStencil: this.graph.defaultEdgeStencil,
		};
		var l = this.graph.nodes;
		for (var i in l) {
			var n = l[i];
			res.nodes.push({
				name: n.name,
				label: n.label,
				position: n.position,
				stencil: n.stencil,
				userData: n.userData
			});
		}
		l = this.graph.edges;
		for (var i in l) {
			var n = l[i];
			res.edges.push({
				src: n.src.name,
				dst: n.dst.name,
				label: n.label,
				stencil: n.stencil,
				userData: n.userData
			});
		}
		return JSON.stringify(res);
	},
	
};
