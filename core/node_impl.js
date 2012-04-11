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

/** @class Node internal representation.
	@constructor
	Creates a new node.
	@param {JSDot.Graph_impl} graph graph to which the new node belongs
	@param {String} name name of the new node
*/
JSDot.Node_impl = function(graph, name) {

	/** Graph containing the node.
		@type JSDot.Graph_impl
	*/
	this.graph = graph;
	
	/** Name identifying the node inside the graph. */
	this.name = name;
	
	/** Label of the node.
		@see setLabel
	*/
	this.label = {'type': 'plain', 'value': name};
	
	/** Position of the node.
		Array [x,y].
		@see setPosition
	*/
	this.position = [0,0];
	
	/** Name of the stencil to be used to represent the node.
		@type String
		@see setStencil
	*/
	this.stencil = graph.defaultNodeStencil;
	
	/** List of edges connected to this node.
		Elements are {@link JSDot.Edge_impl} instances indexed by their id.
	*/
	this.edges = {};
	
	/** This can be arbitrary data attached to the node.
		@see setData
		@see getData
	*/
	this.userData = {};
	
	/** Distiguishes between nodes and edges. */
	this.isNode = true;
};

JSDot.Node_impl.prototype = {

	/** Set node's label.
		Fires a {@link doc_Handler.changed} event.
		@param {String} l new label
		@param {Boolean} fire whether to fire the event or not, default is true
	*/
	setLabel: function(l, fire) {
		if (this.label) {
			this.label.value = l;
		} else {
			this.label = {'type': 'plain', 'value': l};
		}
		if (fire == undefined || fire) this.graph.jsdot.fireEvent(this.graph, 'changed', this);
	},
	
	/** Set node's position.
		Fires a {@link doc_Handler.moved} event.
		@param {Array} p new position in the form [x, y]
		@param {Boolean} fire whether to fire the event or not, default is true
	*/
	setPosition: function(p, fire) {
		this.position = p;
		if (fire == undefined || fire) this.graph.jsdot.fireEvent(this.graph, 'moved', this);
	},

	/** Set node stencil.
		Set which stencil should be used to draw the node.
		<br>If the choosen stencil doesn't exist, the default one is set.
		<br>Fires a {@link doc_Handler.changed} event.
		@param {String} name name of the stencil
		@param {Boolean} fire whether to fire the event or not, default is true
	*/
	setStencil: function(name, fire) {
		this.stencil = name;
		if (fire == undefined || fire) this.graph.jsdot.fireEvent(this.graph, 'changed', this);
	},
	
	/** Attach data to the node.
		You will have to use {@link getData}(key) to retrieve it
		at a later time.
		@param {String} key index identifying data
		@param {Object} value the value to store
	*/
	setData: function(key, value) {
		this.userData[key] = value;
	},
	
	/** Retrive data attached to the node.
		Retrieve data which has been set using {@link setData}.
		@param {String} key index identifying data
		@return {Object} attached data identified by key
	*/
	getData: function(key) {
		return this.userData[key];
	},

};
