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

/** @class Graph API
	API to populate and modify a graph.
	@constructor
	@private
	Create an object that can be used to modify a graph.
	@param {jsdot_Impl} jsdot jsdot instance
	@param {Graph_impl} graph internal representation of the graph that will be modified
*/
JSDot.Graph = function(jsdot, graph) {

	/** Creates a new node.
		Fires a {@link doc_Handler.created} event.<br>
		If a name is provided, and a node with the same name already exists
		returns null.
		@param {String} name (optional) name of the node
		@return {JSDot.Node} the new node
	*/
	this.createNode = function(name) {
		var n = graph.createNode(name);
		if (n) {
			return new JSDot.Node(jsdot, n);
		} else {
			return null;
		}
	};

	/** Create an edge between two nodes.
		@param {JSDot.Node} src starting {@link JSDot.Node} or its name
		@param {JSDot.Node} dst ending {@link JSDot.Node} or its name
		@return {JSDot.Edge} the new edge
	*/
	this.createEdge = function(src, dst) {
		if (typeof src != 'string') src = src.getName();
		if (typeof dst != 'string') dst = dst.getName();
		var e = graph.createEdge(graph.nodes[src], graph.nodes[dst]);
		return new JSDot.Edge(jsdot, e);
	};
	
	/** Clear graph.
		Removes all content of the graph.
	*/
	this.clear = function() {
		graph.clear();
	};

};
