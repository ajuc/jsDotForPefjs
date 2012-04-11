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

/** @class Edge API
	API to modify an edge.
	@constructor
	@private
	Create an object that can be used to modify an edge.
	@param {Edge_impl} impl internal representation of the edge that will be modified
*/
JSDot.Edge = function(jsdot, impl) {

	/** Set edge stencil.
		Set which stencil should be used to draw the edge.
		<br>If the choosen stencil doesn't exist, the default one is set.
		@param {String} name name of the stencil
	*/
	this.setStencil = function(name) {
		impl.setStencil(name);
	};

	/** Set edge's label.
		Fires a {@link doc_Handler.changed} event.
		@param {String} l new label
	*/
	this.setLabel = function(l) {
		impl.setLabel(l);
	};

};
