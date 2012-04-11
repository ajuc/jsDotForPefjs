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

/**
	@fileOverview This file exists only for documentation purposes!
	It doesn't contain any application code.
*/

/**
	@class Node internal representation.
	<br>This class exists only for documentation purposes!
	It doesn't contain any application code.<br>

	Describes how a node is represented inside JSDot.
*/
doc_Node = function() {};

/** Name of the node.
	The name must be unique inside a graph.
	@type String
*/
doc_Node.name = '';

/** Node label.
	This represents the label drawn inside the node.
	@type doc_Node.Label
*/
doc_Node.label = {};

/** Position of the node.
	Array of two components [x,y].
	@type Array
*/
doc_Node.position = Array(2);

/** Stencil which must be used to draw the node.
	This is directly a reference to a {@link doc_Stencil}, not just the name.
	@type doc_Stencil
	@see jsdot_stencils
*/
doc_Node.stencil = jsdot_stencils['box'];



/** @class Label of a node. */
doc_Node.Label = function() {};

/** Type of the label
	This selects inside {@link jsdot_node_label_stencils} the functions
	used to draw the label.
	@type String
*/
doc_Node.Label.prototype.type = 'plain';

/** Actual value of the label. */
doc_Node.Label.prototype.value = '';
