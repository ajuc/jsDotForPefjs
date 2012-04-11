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

/** Node shapes.
	The shape of a node. It is drawn by using a @ref stencil.
*/
JSDot.shapes = {

	'circle': {
	
		size: '2.5em',
		
		draw: function(n, d, g) {
			var c = JSDot.helper.cesvg('circle');
			c.setAttribute('r', this.size);
			g.appendChild(c);
			d.shape = c;
			return c;
		},
		
		setPosition: function(n, d) {
			var s = d.shape;
			s.setAttribute('cx', n.position[0]);
			s.setAttribute('cy', n.position[1]);
		},
		
		getBoundaryTo: function(n, d, p) {
			var c = n.position; // node center
			var a = Math.atan2((p[1]-c[1]), (p[0]-c[0]));
			var size = d.shape.r.baseVal.value;
			return [
				c[0] + Math.cos(a) * size,
				c[1] + Math.sin(a) * size
			];
		},
		
		getBBox: function(n, d) {
			return d.shape.getBBox();
		},
		
		setSize: function(n, d, s) {
			d.shape.setAttribute('r', Math.max(s.height,s.width)/2+6);
		}
	},
	
	'box': {
		draw: function(n, d, g) {
			var e = JSDot.helper.cesvg('rect');
			e.setAttribute('height', 30);
			e.setAttribute('width', 50);
			g.appendChild(e);
			d.shape = e;
			return e;
		},
		
		setPosition: function(n, d) {
			var s = d.shape;
			s.setAttribute('x', n.position[0] - s.width.baseVal.value / 2);
			s.setAttribute('y', n.position[1] - s.height.baseVal.value / 2);
		},
		
		getBoundaryTo: function(n, d, p) {
		
			//get rect dimensions
			var x = d.shape.x.baseVal.value; /* left */
			var y = d.shape.y.baseVal.value; /* top */
			var height = d.shape.height.baseVal.value;
			var width = d.shape.width.baseVal.value;
			
			var xl = x; /* left edge of rect */
			var xr = x + width; /* right edge of rect */
			var slope = (p[1]-(y+height/2)) / (p[0]-(x+width/2));
			/* division by 0 gives Infinity, which is fine! */
			
			if (Math.abs(p[1] - (y+height/2)) < 2) {
				/* p is on a horizontal line with the center */
				if (p[0] < xr) {
					return [xl, p[1]];
				} else {
					return [xr, p[1]];
				}
			} else if (p[1] < y+height/2) {
				/* intersection with upper part of rect */
				var iup = (y-p[1]) / slope + p[0];
				if (iup < xl) {
					/* intersection on left side */
					var il = (xl-p[0]) * slope + p[1];
					return [xl, il];
				} else if (iup > xr) {
					/* intersection on right side */
					var ir = (xr-p[0]) * slope + p[1];
					return [xr, ir];
				} else {
					/* intersection on top */
					return [iup, y];
				}
			} else {
				/* intersection with bottom part of rect */
				var ibt = (y+height-p[1]) / slope + p[0];
				if (ibt < xl) {
					/* intersection on left side */
					var il = (xl-p[0]) * slope + p[1];
					return [xl, il];
				} else if (ibt > xr) {
					/* intersection on right side */
					var ir = (xr-p[0]) * slope + p[1];
					return [xr, ir];
				} else {
					/* intersection on top */
					return [ibt, y+height];
				}
			}
		},
		
		getBBox: function(n, d) {
			return d.shape.getBBox();
		},
		
		setSize: function(n, d, s) {
			var p = d.shape;
			p.setAttribute('height', s.height+3);
			p.setAttribute('width', s.width+10);
			this.setPosition(n, d);
		}
	},
	
	'hexagon': {
	
		dw: 2,
		dh: 2,
		ew: 15,
		
		draw: function(n, d, g) {
			var e = JSDot.helper.cesvg('polygon');
			//e.setAttribute('points', '');
			g.appendChild(e);
			d.shape = e;
			return e;
		},
		
		setPosition: function(n, d) {
			d.shape.setAttribute('transform', 'translate('+n.position[0]+' '+n.position[1]+')');
		},
		
		getBoundaryTo: function(n, d, p) {
		
			//get rect dimensions
			var height = d.size.height;
			var width = d.size.width;
			var x = n.position[0] - width/2;  /* left */
			var y = n.position[1] - height/2; /* top */
			
			var xl = x; /* left edge of rect */
			var xr = x + width; /* right edge of rect */
			var slope = (p[1]-n.position[1]) / (p[0]-n.position[0]);
			/* division by 0 gives Infinity, which is fine! */
			
			if (Math.abs(p[1] - (y+height/2)) < 2) {
				/* p is on a horizontal line with the center */
				if (p[0] < xr) {
					return [xl-this.ew, p[1]];
				} else {
					return [xr+this.ew, p[1]];
				}
			} else if (p[1] < y+height/2) {
				/* intersection with upper part of rect */
				var iup = (y-p[1]) / slope + p[0];
				if (iup < xl) {
					/* intersection on left side */
					var s2 = -(height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xl - y - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xl) * s2 + y];
				} else if (iup > xr) {
					/* intersection on right side */
					var s2 = (height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xr - y - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xr) * s2 + y];
				} else {
					/* intersection on top */
					return [iup, y];
				}
			} else {
				/* intersection with bottom part of rect */
				var ibt = (y+height-p[1]) / slope + p[0];
				if (ibt < xl) {
					/* intersection on left side */
					var s2 = (height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xl - (y+height) - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xl) * s2 + y+height];
				} else if (ibt > xr) {
					/* intersection on right side */
					var s2 = -(height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xr - (y+height) - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xr) * s2 + y+height];
				} else {
					/* intersection on top */
					return [ibt, y+height];
				}
			}
		},
		
		getBBox: function(n, d) {
			var b = d.shape.getBBox();
			b.x += n.position[0];
			b.y += n.position[1];
			return b;
		},
		
		setSize: function(n, d, s) {
			var w = s.width/2 + this.dw;
			var h = s.height/2 + this.dh;
			var p = [
				-w, -h, /* top left */
				w, -h,  /* top right */
				w+this.ew, 0,/* > right */
				w, h,   /* bottom right */
				-w, h,  /* bottom left */
				-w-this.ew, 0/* < left */
			];
			d.shape.setAttribute('points', p.join(' '));
			d.size = { height: s.height + 2*this.dh, width: s.width + 2*this.dw }; /* needed by getBoundaryTo */
		}
	},
	
	'concave hexagon': {
	
		dw: 8,
		dh: 2,
		ew: 15,
		
		draw: function(n, d, g) {
			var e = JSDot.helper.cesvg('polygon');
			//e.setAttribute('points', '');
			g.appendChild(e);
			d.shape = e;
			return e;
		},
		
		setPosition: function(n, d) {
			d.shape.setAttribute('transform', 'translate('+n.position[0]+' '+n.position[1]+')');
		},
		
		getBoundaryTo: function(n, d, p) {
		
			//get rect dimensions
			var height = d.size.height;
			var width = d.size.width;
			var x = n.position[0] - width/2 - this.ew;  /* left */
			var y = n.position[1] - height/2; /* top */
			
			var xl = x; /* left edge of rect */
			var xr = x + width + 2*this.ew; /* right edge of rect */
			var slope = (p[1]-n.position[1]) / (p[0]-n.position[0]);
			/* division by 0 gives Infinity, which is fine! */
			
			if (Math.abs(p[1] - (y+height/2)) < 2) {
				/* p is on a horizontal line with the center */
				if (p[0] < xr) {
					return [xl+this.ew, p[1]];
				} else {
					return [xr-this.ew, p[1]];
				}
			} else if (p[1] < y+height/2) {
				/* intersection with upper part of rect */
				var iup = (y-p[1]) / slope + p[0];
				if (iup < xl) {
					/* intersection on left side */
					var s2 = (height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xl - y - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xl) * s2 + y];
				} else if (iup > xr) {
					/* intersection on right side */
					var s2 = -(height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xr - y - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xr) * s2 + y];
				} else {
					/* intersection on top */
					return [iup, y];
				}
			} else {
				/* intersection with bottom part of rect */
				var ibt = (y+height-p[1]) / slope + p[0];
				if (ibt < xl) {
					/* intersection on left side */
					var s2 = -(height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xl - (y+height) - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xl) * s2 + y+height];
				} else if (ibt > xr) {
					/* intersection on right side */
					var s2 = (height/2) / this.ew; /* slope of the diagonal side */
					var ix = (s2*xr - (y+height) - slope*p[0] + p[1]) / (s2 - slope);
					return [ix, (ix-xr) * s2 + y+height];
				} else {
					/* intersection on top */
					return [ibt, y+height];
				}
			}
		},
		
		getBBox: function(n, d) {
			var b = d.shape.getBBox();
			b.x += n.position[0];
			b.y += n.position[1];
			return b;
		},
		
		setSize: function(n, d, s) {
			var w = s.width/2 + this.dw;
			var h = s.height/2 + this.dh;
			var p = [
				-w-this.ew, -h, /* top left */
				w+this.ew, -h,  /* top right */
				w, 0,/* > right */
				w+this.ew, h,   /* bottom right */
				-w-this.ew, h,  /* bottom left */
				-w, 0/* < left */
			];
			d.shape.setAttribute('points', p.join(' '));
			d.size = { height: s.height + 2*this.dh, width: s.width + 2*this.dw }; /* needed by getBoundaryTo */
		}
	},
};

/** Node stencils.
	Stencils are composed by a shape and
	a style, which may be defined in css.
	
	Differenct stencils may share the same shape and apply
	different styles.
*/
JSDot.stencils = {

	'circle': JSDot.helper.makeCssStencil(),
	
	'box': JSDot.helper.makeCssStencil({
		shape: JSDot.shapes.box,
		cssClass: 'jsdot_box'
		}),
	
	'hexagon': JSDot.helper.makeCssStencil({
		shape: JSDot.shapes.hexagon,
		cssClass: 'jsdot_hexagon'
		}),
	
	'concave hexagon': JSDot.helper.makeCssStencil({
		shape: JSDot.shapes['concave hexagon'],
		cssClass: 'jsdot_concave_hexagon'
		}),
};

/** Edge shapes.
*/
JSDot.edge_shapes = {

	'line': JSDot.helper.makeEdgeShape(),

	'directed line': JSDot.helper.makeEdgeShape({
		markerEnd: 'url(#Arrow)'
		}),

	'bidi line': JSDot.helper.makeEdgeShape({
		markerStart: 'url(#ArrowS)',
		markerEnd: 'url(#Arrow)'
		}),
};

/** Edge stencils.
	Stencils used to draw edges.
*/
JSDot.edge_stencils = {

	'line': JSDot.helper.makeEdgeStencil(),

	'directed line': JSDot.helper.makeEdgeStencil({
		shape: JSDot.edge_shapes['directed line'],
		cssClass: 'jsdot_dirline_edge'
		}),

	'bidi line': JSDot.helper.makeEdgeStencil({
		shape: JSDot.edge_shapes['bidi line'],
		cssClass: 'jsdot_bidiline_edge'
		}),
};

/** Insert external SVG elements.
	@private
	This is a workaround, since url() references added from
	javascript are not loaded.
	
	@param {jsdot_View} view view of a JSDot instance to which the elements will be added
	@param {String} file SVG file to load
*/
JSDot.load_svg_shapes = function(view, file) {

	var request = new XMLHttpRequest();
	if (request.overrideMimeType) {
		request.overrideMimeType('text/xml')
	}
	request.open("GET", file, false); // synchronous
	request.send();
	
	//if (request.status != 200) return;
	
	var xml = request.responseXML;
	var defs = xml.getElementsByTagName('defs')[0];
	defs.parentNode.removeChild(defs);
	view.svgroot.appendChild(defs);

return;

/*
	var defs = $e('defs');
	view.svgroot.appendChild(defs);
	
	
	// Arrow
	var m = $e('marker');
	m.setAttrs({
		'id': 'Arrow',
		'refy': '0.0',
		'refx': '30',
		'orient': 'auto',
		'style': 'overflow:visible;'
	});
	var l = $e('path');
	l.setAttrs({
		'transform': 'scale(1.1) rotate(180) translate(1,0)',
		'd': 'M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z'
	});
	m.appendChild(l);
	defs.appendChild(m);
*/
};

/** Stencils for drawing labels.
*/
JSDot.node_label_stencils = {

	'plain': {
	
		draw: function(n, d, p) {
			var t = JSDot.helper.cesvg('text');
			t.setAttribute('class', 'jsdot_node_label');
			t.textContent = n.label.value;
			p.appendChild(t);
			d.label = t;
			return t;
		},
		
		setPosition: function(n, d) {
			var l = d.label;
			l.setAttribute('x', n.position[0]);
			l.setAttribute('y', n.position[1]);
		},
		
		getSize: function(n, d) {
			return d.label.getBBox();
			//return n.view.label.getBoundingClientRect();
		},
	},
};

/** Stencils for drawing edge labels.
*/
JSDot.edge_label_stencils = {

	'plain': {
	
		draw: function(n, d, p) {
			var t = JSDot.helper.cesvg('text');
			t.setAttribute('class', 'jsdot-edge-label');
			t.textContent = n.label.value;
			p.appendChild(t);
			d.label = t;
			return t;
		},
		
		setPosition: function(n, d) {
			var p1 = d.start;
			var p2 = d.end;
			var l = d.label;
			l.setAttribute('x', p1[0]+(p2[0]-p1[0])/2);
			l.setAttribute('y', p1[1]+(p2[1]-p1[1])/2);
		},
		
		getSize: function(n, d) {
			return d.label.getBBox();
			//return n.view.label.getBoundingClientRect();
		},
	},
};
