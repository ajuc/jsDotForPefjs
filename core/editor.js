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

/**
	Construct a JSDot Editor.
	@class JSDot editor.
	@constructor
*/
JSDot.Editor = function(jsdot, view, sel) {

	/** Associated JSDot instance. */
	this.jsdot = jsdot;
	
	/** Associated view. */
	this.view = view;
	
	/** Selection on the view. */
	this.selection = sel;

	/** Toolbar container.
		Div element containig the toolbar elements.
		@type {DOM Element}
	*/
	this.tbContainer = null;

	/** Current node stencil name.
		The stencil that will be given to the new noded created by this editor.<br>
		Note that this is the name of a stencil in {@link JSDot.stencils} and not
		the stencil itself.
		@type String
	*/
	this.currentNodeStencil = null;
	
	/** Current edge stencil name.
		The stencil that will be given to the new edges created by this editor.<br>
		Note that this is the name of a stencil in {@link JSDot.edge_stencils} and not
		the stencil itself.
		@type String
	*/
	this.currentEdgeStencil = null;
	
	/** Instance of the dialog.
		Instance of {@link JSDot.Editor.EditDialog} created by
		{@link JSDot.Editor} constructor.
	*/
	this.editDialog = null;
	
	/** The nested bar currently shown */
	this.activeNested = null;
	
	/** List of registered nested bars. */
	this.nestedBars = {};
	
	
	/* create toolbar container */
	var tb = document.createElement('div');
	tb.setAttribute('class', 'ui-widget-header ui-corner-all jsdot-toolbar');
	document.body.appendChild(tb);
	this.tbContainer = tb;
	
	/* set toolbar's initial position */
	var offset = view.getOffset(view.container);
	if (offset[1] > 25) offset[1] -= 25;
	tb.style.top = offset[1] + 'px';
	tb.style.left = offset[0] + 'px';
	
	for (var i in JSDot.stencils) { this.currentNodeStencil = i; break; };
	for (var i in JSDot.edge_stencils) { this.currentEdgeStencil = i; break; };
	new JSDot.Editor.MainBar(this, tb);
	this.editDialog = new JSDot.Editor.EditDialog(this);
};

JSDot.Editor.prototype = {

	/** Set selected button.
		Change tool icon highlighting to show which button is selected
		inside a given toolbar. If another one was already selected,
		it will be deselected.<br>
		If a function 'onDeselect' is defined on the button being deselected,
		it will be called.
		@param {Object} tb the toolbar
		@param {Object} b the button
	*/
	setSelected: function(tb, b) {
		if (tb.selected) {
			if (tb.selected.onDeselect) tb.selected.onDeselect();
			$(tb.selected).removeClass('jsdot-tb-selected');
		}
		$(b).addClass('jsdot-tb-selected');
		tb.selected = b;
	},

	/** Register a new nested bar. */
	addNestedBar: function(bar) {
		this.nestedBars[bar.name] = bar;
		$(bar.container).addClass('ui-widget ui-corner-all jsdot-tb-nested jsdot-tb-hiddentb');
		this.tbContainer.appendChild(bar.container);
	},
	
	/** Show a registered nested bar. */
	showNestedBar: function(name) {
		this.hideNestedBar();
		if (this.nestedBars[name]) $(this.nestedBars[name].container).removeClass('jsdot-tb-hiddentb');
		this.activeNested = this.nestedBars[name];
	},
	
	/** Hides the currently active nested bar. */
	hideNestedBar: function() {
		if (this.activeNested) $(this.activeNested.container).addClass('jsdot-tb-hiddentb');
		this.activeNested = null;
	},
	
	/** Return an instance of a tool for the current editor.
		If 'params' exists, a reference to the graph, view and editor will be added to it.
		@param {String} tool name of the tool
		@param {Object} params parameters passed to the tool's init function, if it exists
		@return {Object} the requested tool or null
	*/
	getTool: function(tool, params) {
		if (params) {
			params.graph = this.jsdot.graph;
			params.view = this.view;
			params.editor = this;
		}
		return this.jsdot.getToolI('EditTools', tool, params);
	},
};

/** @class Main toolbar.
	@creator
	Create the toolbar iside the editor.
	@param {jsdot_Editor} editor
	@param {Object} p parent DOM element where to insert button elements
*/
JSDot.Editor.MainBar = function(editor, p) {
	var tb = this; // no need for closure actually, but use as shorthand
	
	/** Attached editor.
		Editor to which this toolbar is attached.
		@type JSDot.Editor
	*/
	this.editor = editor;
	
	/** Handler for drag&drop.
		@type JSDot.Drag
	*/
	this.dragH = new JSDot.Drag(editor.jsdot, editor.view, editor.selection);
	
	/** Handler for creating nodes.
		@type function
		@see createNodeH_T
	*/
	this.createNodeH = this.createNodeH_T(editor.jsdot);
	
	/** Handler for creating edges.
		@type JSDot.EdgeViz
	*/
	this.createEdgeH = new JSDot.EdgeViz(editor.jsdot, editor.view, editor);
	
	/** Handler for removing nodes and edges
		@type function
		@see removeH_T
	*/
	this.removeH = this.removeH_T(editor.jsdot);
	
	/** Nested bar for layout operations.
		@type JSDot.Editor.LayoutBar
	*/
	this.layoutBar = new JSDot.Editor.LayoutBar(editor);
	
	/** Nested bar for creating nodes.
		@type JSDot.Editor.CreateNodeBar
	*/
	this.createNodeBar = new JSDot.Editor.CreateNodeBar(editor);
	
	/** Nested bar for creating edges.
		@type JSDot.Editor.CreateEdgeBar
	*/
	this.createEdgeBar = new JSDot.Editor.CreateEdgeBar(editor);

	/** Selected tool.
		This is used to keep track of which tool icon is highlighted.
		@see JSDot.Editor.setSelected
	*/
	this.selected = null;
	
	
	/****************************************************************
		Now create the UI part of the toolbar.
	****************************************************************/
	
	var spc = document.createElement('div');
	spc.setAttribute('class', 'jsdot-tb-handleL');
	p.appendChild(spc);
	spc = document.createElement('div');
	spc.setAttribute('class', 'jsdot-tb-handleR');
	p.appendChild(spc);
	$(p).draggable({ handle: '.jsdot-tb-handle' });
	
	var main = document.createElement('div');
	main.setAttribute('class', 'jsdot-tb-main');
	p.appendChild(main);
	
	var btnSel = document.createElement('button');
	btnSel.innerHTML = 'Select';
	main.appendChild(btnSel);
	$(btnSel).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-cursor' }
	})
	.click(function() {
		editor.setSelected(tb, btnSel);
		editor.jsdot.addEventHandler(editor.view, tb.dragH);
		var s = editor.selection;
		s.allowNodes = true;
		s.allowEdges = true;
		s.allowMultiple = true;
		s.allowDrag = true;
		editor.showNestedBar('layout');
	});
	btnSel.onDeselect = function() {
		editor.jsdot.removeEventHandler(editor.view, tb.dragH);
		editor.hideNestedBar('layout');
	};
	
	var btnAddN = document.createElement('button');
	btnAddN.innerHTML = 'Add node';
	main.appendChild(btnAddN);
	$(btnAddN).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-addnode' }
	})
	.click(function() {
		editor.setSelected(tb, btnAddN);
		var s = editor.selection;
		s.allowNodes = false;
		s.allowEdges = false;
		s.allowMultiple = false;
		s.allowDrag = false;
		s.deselectAll();
		editor.jsdot.addEventHandler(editor.view, 'click', tb.createNodeH);
		editor.showNestedBar('createnode');
		editor.view.addClass('jsdot-cursor-addnode');
	});
	btnAddN.onDeselect = function() {
		editor.jsdot.removeEventHandler(editor.view, 'click', tb.createNodeH);
		editor.hideNestedBar('createnode');
		editor.view.removeClass('jsdot-cursor-addnode');
	};
	
	var btnAddE = document.createElement('button');
	btnAddE.innerHTML = 'Add edge';
	main.appendChild(btnAddE);
	$(btnAddE).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-addedge' }
	})
	.click(function() {
		editor.setSelected(tb, btnAddE);
		var s = editor.selection;
		s.allowNodes = false;
		s.allowEdges = false;
		s.allowMultiple = false;
		s.allowDrag = false;
		s.deselectAll();
		editor.jsdot.addEventHandler(editor.view, tb.createEdgeH);
		editor.showNestedBar('createedge');
		editor.view.addClass('jsdot-cursor-addedge');
	});
	btnAddE.onDeselect = function() {
		editor.jsdot.removeEventHandler(editor.view, tb.createEdgeH);
		tb.createEdgeH.cancel(); /* stop if you were drawing */
		editor.hideNestedBar('createedge');
		editor.view.removeClass('jsdot-cursor-addedge');
	};
	
	var btnRm = document.createElement('button');
	btnRm.innerHTML = 'Remove node';
	main.appendChild(btnRm);
	$(btnRm).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-removenode' }
	})
	.click(function() {
		var s = editor.selection;
		if (s.selection.length > 0) {
			/* something is selected, then delete selection */
			/* we need a copy of the selection, since it will change while
			   we iterate on it */
			var l = [];
			s.forNodes(function(n) { l.push(n); });
			for (var i in l) { editor.jsdot.graph.removeNode(l[i]); };
			l = [];
			s.forEdges(function(e) { l.push(e); });
			for (var i in l) { editor.jsdot.graph.removeEdge(l[i]); };
		} else {
			/* noting selected, then switch to delete tool */
			editor.setSelected(tb, btnRm);
			s.allowNodes = false;
			s.allowEdges = false;
			s.allowMultiple = false;
			s.allowDrag = false;
			editor.jsdot.addEventHandler(editor.view, 'click', tb.removeH);
			editor.view.addClass('jsdot-cursor-removenode');
		}
	});
	btnRm.onDeselect = function() {
		editor.jsdot.removeEventHandler(editor.view, 'click', tb.removeH);
		editor.view.removeClass('jsdot-cursor-removenode');
	};
	
	var btnED = document.createElement('button');
	btnED.innerHTML = 'Edit properties';
	main.appendChild(btnED);
	$(btnED).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-editdialog' }
	})
	.click(function() {
		editor.editDialog.toggleOpen();
	});
	
	editor.addNestedBar(this.layoutBar);
	editor.addNestedBar(this.createNodeBar);
	editor.addNestedBar(this.createEdgeBar);
	btnSel.click(); // selection tool is enabled on startup
};

JSDot.Editor.MainBar.prototype = {

	/** Construct handler for creating nodes.
		@param {JSDot.jsdot_Impl} jsdot jsdot instance
		@return {function} handler
	*/
	createNodeH_T: function(jsdot) {
		var editor = this.editor;
		return function(obj, evt) {
				var n = jsdot.graph.createNode(null, false);
				n.setPosition([evt.relX, evt.relY], false);
				if (editor.currentNodeStencil) n.setStencil(editor.currentNodeStencil, false);
				jsdot.fireEvent(jsdot.graph, 'created', n);
			};
	},
	
	/** Construct handler for removing nodes and edges.
		@param {jsdot_Impl} jsdot jsdot instance
		@return {function} handler
	*/
	removeH_T: function(jsdot) {
		return function(obj, evt) {
				if (obj && obj.isNode) { /* node */
					jsdot.graph.removeNode(obj);
				} else if (obj && obj.isEdge) { /* edge */
					jsdot.graph.removeEdge(obj);
				}
			};
	},

};

/** @class Layout toolbar.
	@constructor
	@param {jsdot_Editor} editor
	@param {Object} p parent DOM element where to insert button elements
*/
JSDot.Editor.LayoutBar = function(editor) {
	var d = document.createElement('div');
	
	// mandatory fields for nested bars
	this.name = 'layout';
	this.container = d;
	
	var btnL = document.createElement('button');
	btnL.innerHTML = 'Align left';
	d.appendChild(btnL);
	$(btnL).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignleft' }
	})
	.click(this.leftH(editor));
	
	var btnC = document.createElement('button');
	btnC.innerHTML = 'Center';
	d.appendChild(btnC);
	$(btnC).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-aligncenter' }
	})
	.click(this.centerH(editor));
	
	var btnR = document.createElement('button');
	btnR.innerHTML = 'Align right';
	d.appendChild(btnR);
	$(btnR).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignright' }
	})
	.click(this.rightH(editor));
	
	var btnT = document.createElement('button');
	btnT.innerHTML = 'Align top';
	d.appendChild(btnT);
	$(btnT).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-aligntop' }
	})
	.click(this.topH(editor));
	
	var btnVC = document.createElement('button');
	btnVC.innerHTML = 'Center vertically';
	d.appendChild(btnVC);
	$(btnVC).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignvcenter' }
	})
	.click(this.vcenterH(editor));
	
	var btnB = document.createElement('button');
	btnB.innerHTML = 'Align bottom';
	d.appendChild(btnB);
	$(btnB).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignbottom' }
	})
	.click(this.bottomH(editor));
};

JSDot.Editor.LayoutBar.prototype = {

	leftH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize l */
			var n = s.firstNode();
			if (!n) return;
			var l = v.getBBox(n).x;
			
			/* find leftmost node */
			s.forNodes(function(n) {
				var p = v.getBBox(n).x;
				if (p < l) l = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ l + v.getBBox(n).width/2, n.position[1] ]);
			});
		};
	},

	centerH: function(editor) {
		return function() {
			var s = editor.selection;
			/* find first node and initialize l and r */
			var n = s.firstNode();
			if (!n) return;
			var l = n.position[0];
			var r = l;
			
			/* find the middle */
			s.forNodes(function(n) {
				if (n.position[0] < l) l = n.position[0];
				if (n.position[0] > r) r = n.position[0];
			});
			l = l + (r-l)/2;
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ l, n.position[1] ]);
			});
		};
	},

	rightH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize r */
			var n = s.firstNode();
			if (!n) return;
			var p = v.getBBox(n);
			var r = p.x + p.width;
			
			/* find rightmost node */
			s.forNodes(function(n) {
				p = v.getBBox(n);
				p = p.x + p.width;
				if (p > r) r = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ r - v.getBBox(n).width/2, n.position[1] ]);
			});
		};
	},

	topH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize y */
			var n = s.firstNode();
			if (!n) return;
			var y = v.getBBox(n).y;
			
			/* find topmost node */
			s.forNodes(function(n) {
				var p = v.getBBox(n).y;
				if (p < y) y = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ n.position[0], y + v.getBBox(n).height/2 ]);
			});
		};
	},

	vcenterH: function(editor) {
		return function() {
			var s = editor.selection;
			/* find first node and initialize top and btm */
			var n = s.firstNode();
			if (!n) return;
			var top = n.position[1];
			var btm = top;
			
			/* find center */
			s.forNodes(function(n) {
				if (n.position[1] < top) top = n.position[1];
				if (n.position[1] > btm) btm = n.position[1];
			});
			top += (btm-top)/2;
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ n.position[0], top ]);
			});
		};
	},

	bottomH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize y */
			var n = s.firstNode();
			if (!n) return;
			var p = v.getBBox(n);
			var y = p.y + p.height;
			
			/* find bottom node */
			s.forNodes(function(n) {
				p = v.getBBox(n);
				p = p.y + p.height;
				if (p > y) y = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ n.position[0], y - v.getBBox(n).height/2 ]);
			});
		};
	},
};

/** @class Node creation toolbar.
	Allows to select a stencil for the new nodes that will be created.
	@constructor
	@param {jsdot_Editor} editor
*/
JSDot.Editor.CreateNodeBar = function(editor) {
	var d = document.createElement('div');
	
	// mandatory fields for nested bars
	this.name = 'createnode';
	this.container = d;
	
	var stc = document.createElement('select');
	for (var i in JSDot.stencils) {
		stc.add(new Option(i, i, i == editor.currentNodeStencil), null);
	}
	d.appendChild(stc);
	
	stc.addEventListener('change', function() {
		editor.currentNodeStencil = this.value;
		}, false);

};

/** @class Edge creation toolbar.
	Allows to select a stencil for the new edge that will be created.
	@constructor
	@param {jsdot_Editor} editor
*/
JSDot.Editor.CreateEdgeBar = function(editor) {
	var d = document.createElement('div');
	
	// mandatory fields for nested bars
	this.name = 'createedge';
	this.container = d;
	
	var stc = document.createElement('select');
	for (var i in JSDot.edge_stencils) {
		stc.add(new Option(i, i, i == editor.currentEdgeStencil), null);
	}
	d.appendChild(stc);
	
	stc.addEventListener('change', function() {
		editor.currentEdgeStencil = this.value;
		}, false);

};

/** @class Editing dialog.
	This dialog allows to view and change properties like label text and stencil
	of existing elements.
	@constructor
	@param {jsdot_Editor} editor
*/
JSDot.Editor.EditDialog = function(editor) {

	/* insert html part of the dialog */
	var dialog = document.createElement('div');
	editor.view.container.appendChild(dialog);
	$(dialog).dialog({ autoOpen: false, closeOnEscape: false,
			position: 'right', dialogClass: 'jsdot-editdialog' });
			
	var accordion = document.createElement('div');
	accordion.setAttribute('class',
		'ui-accordion ui-widget ui-helper-reset ui-accordion-icons');
	accordion.setAttribute('role', 'tablist');
	dialog.appendChild(accordion);
			
	/** Add a new section to the edit dialog. */
	function addSection(name, options) {
		var header = document.createElement('h3');
		header.appendChild(document.createTextNode(name));
		header.setAttribute('class',
			'ui-accordion-header ui-helper-reset ui-state-default ui-corner-all');
		header.setAttribute('role', 'tab');
		accordion.appendChild(header);
		var content = document.createElement('div');
		content.setAttribute('class',
			'ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom');
		content.setAttribute('role', 'tabpanel');
		accordion.appendChild(content);
		$(header).click(function () {
				$(content).toggleClass('ui-accordion-content-active');
				$(header).toggleClass('ui-corner-all ui-corner-top');
				//$(content).toggle('normal');
			});
			
		if (options && options.expanded) {
			$(header).click();
		}
		
		return {
			'name': name,
			'header': header,
			'content': content
		};
	};
	
	/*********************/
	/* Selection section */
	/*********************/
	var selection = addSection('Selection', {'expanded': true}).content;
	
	var msg = document.createElement('p');
	msg.innerHTML = 'edit dialog';
	selection.appendChild(msg);
	
	var nodeForm = document.createElement('div');
	selection.appendChild(nodeForm);
	var nodeFStcl = document.createElement('select');
	nodeForm.appendChild(nodeFStcl);
	nodeFStcl.addEventListener('change', function() {
			var n = editor.selection.selection[0];
			n.setStencil(this.value);
			}, false);
	var nodeFLabel = document.createElement('input');
	nodeForm.appendChild(nodeFLabel);
	nodeFLabel.addEventListener('keypress', function(evt) {
			switch(evt.keyCode) {
				case 27: /* escape */
					handler.selectionchg(); /* reload values in dialog */
					break;
				case 13: /* enter */
					var n = editor.selection.selection[0];
					n.setLabel(this.value);
					break;
			} }, false);

	var nodeFAttribsJSON = document.createElement('textarea');
	nodeForm.appendChild(nodeFAttribsJSON);
	nodeFAttribsJSON.addEventListener('keypress', function(evt) {
			switch(evt.keyCode) {
				case 27: /* escape */
					handler.selectionchg(); /* reload values in dialog */
					break;
				case 13: /* enter */
					//alert(this.value);
					var n = editor.selection.selection[0];
					n.setData("data", this.value);
					break;
			} }, false);


	
	
	var edgeForm = document.createElement('div');
	selection.appendChild(edgeForm);
	var edgeFStcl = document.createElement('select');
	edgeForm.appendChild(edgeFStcl);
	edgeFStcl.addEventListener('change', function() {
			var n = editor.selection.selection[0];
			n.setStencil(this.value);
			}, false);
	var edgeFLabel = document.createElement('input');
	edgeForm.appendChild(edgeFLabel);
	edgeFLabel.addEventListener('keypress', function(evt) {
			switch(evt.keyCode) {
				case 27: /* escape */
					handler.selectionchg(); /* reload values in dialog */
					break;
				case 13: /* enter */
					var n = editor.selection.selection[0];
					n.setLabel(this.value);
					break;
			} }, false);

	var edgeFAttribsCondition = document.createElement('textarea');
	edgeForm.appendChild(edgeFAttribsCondition);
	edgeFAttribsCondition.addEventListener('keypress', function(evt) {
			switch(evt.keyCode) {
				case 27: /* escape */
					handler.selectionchg(); /* reload values in dialog */
					break;
				case 13: /* enter */
					//alert(this.value);
					var n = editor.selection.selection[0];
					n.setData("data", this.value);
					break;
			} }, false);


	/******************/
	/* Layout section */
	/******************/
	var layout = addSection('Layout', {'expanded': false}).content;
	var layoutSelect = document.createElement('select');
	for (var i in JSDot.ViewTools.Layout) {
		layoutSelect.add(new Option(i), null);
	}
	layout.appendChild(layoutSelect);
	var layoutBtnApply = document.createElement('button');
	//layoutBtnApply.innerHTML = 'Apply';
	layout.appendChild(layoutBtnApply);
	$(layoutBtnApply).button({
		//'text': false,
		'icons': {'primary': 'ui-icon-check'},
		'label': 'Apply',
		}).click(function() {
			var tool = editor.view.getTool('Layout.'+layoutSelect.value, {});
			if (tool) tool.doLayout();
			$(this).blur();
		});


	/***********************/
	/* Extra tools section */
	/***********************/
	var extra = addSection('Tools', {'expanded': false}).content;
	
	var jsonBtn = document.createElement('button');
	jsonBtn.appendChild(document.createTextNode('Edit JSON'));
	extra.appendChild(jsonBtn);
	$(jsonBtn).button().click(function () {
			var jsonTool = editor.getTool('jsonDialog', {});
			if (jsonTool) jsonTool.show(editor.jsdot);
			});
	
	
	/** Toggle dialog.
		If it's closed open it, if it's open close it.
	*/
	this.toggleOpen = function() {
		if ($(dialog).dialog('isOpen')) {
			$(dialog).dialog('close');
		} else {
			$(dialog).dialog('open');
			handler.selectionchg();
		}
	};
	
	var handler = {
		selectionchg: function(/*n, s*/) {
		
			/* if closed then do not update */
			if (!$(dialog).dialog('isOpen')) return;
			
			var nnodes = 0, nedges = 0;
			editor.selection.forNodes(function(){ ++nnodes; });
			editor.selection.forEdges(function(){ ++nedges; });
			if (nnodes + nedges == 0) {
				msg.innerHTML = 'Nothing selected.';
				$(nodeForm).hide();
				$(edgeForm).hide();
			} else if (nnodes + nedges > 1) {
				/* multiple selection */
				$(nodeForm).hide();
				$(edgeForm).hide();
				msg.innerHTML = (nnodes ? nnodes+' node'+(nnodes>1 ? 's' : '')+(nedges ? ' and ' : '') : '')
						+ (nedges ? nedges+' edge'+(nedges>1 ? 's' : '') : '')
						+ ' selected.';
			} else {
				/* single selection, show properties */
				var e = editor.selection.selection[0];
				if (e.isNode) {
					/* selected node */
					msg.innerHTML = 'Node "'+e.name+'".';
					
					nodeFStcl.innerHTML = ''; /* remove options */
					for (var i in JSDot.stencils) {
						nodeFStcl.add(new Option(i, i, i == e.stencil), null);
					}
					
					$(nodeFLabel).blur(); /* if it has focus the value doesn't change */
					nodeFLabel.value = e.label.value;
					nodeFAttribsJSON.value = e.getData("data");
					
					$(edgeForm).hide();
					$(nodeForm).show();
					
				} else if (e.isEdge) {
					/* selected edge */
					msg.innerHTML = 'Edge "'+e.id+'".';
					
					edgeFStcl.innerHTML = '';
					for (var i in JSDot.edge_stencils) {
						edgeFStcl.add(new Option(i, i, i == e.stencil), null);
					}
					
					$(edgeFLabel).blur(); /* if it has focus the value doesn't change */
					edgeFLabel.value = (e.label ? e.label.value : '');
					edgeFAttribsCondition.value = e.getData("data");


					$(nodeForm).hide();
					$(edgeForm).show();
				}
			}
		},
		
		changed: function(w) {
			if (w == editor.selection.selection[0]) {
				/* the style of the selected node has changed */
				handler.selectionchg(); /* update form content */
			}
		},
	};
	
	var removeH = function() {
		handler.selectionchg();
	};
	
	editor.jsdot.addEventHandler(editor.view, handler);
	editor.jsdot.addEventHandler(editor.graph, 'removed', removeH);
	editor.jsdot.addEventHandler(editor.graph, 'newgraph', removeH); /* reuse handler */
	this.toggleOpen(); // closed on startup
};
