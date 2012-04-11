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
 * This file is intended to be included in html for development,
 * it will throw in all the pieces of JSDOT.
 * for production you should use the single-file release.
 */
var f = function() {

	var files_view = [
//		"../lib/json_sans_eval.js",

/* jsdot */
		"jsdot.js",
		"helpers.js",
		"impl.js",

/* graph model */
		"node_impl.js",
		"node.js",
		"edge_impl.js",
		"edge.js",
		"graph_impl.js",
		"graph.js",

/* view */
		"shapes.js",
		"view.js",
		"selection.js",
		"drag.js",

/* tools */
		"../tools/json.js",
		"../tools/centerlayout.js",
		"../tools/springlayout.js",
	];


	var files_editor = [

/* editor */
		"edgeviz.js",
		"editor.js",

/* tools */
		"../tools/jsondialog.js",
	];


	var files_extra = [
		"../lib/jquery-1.4.2.js",
		"../lib/jquery-ui-1.8.2.custom.min.js",
	];

	var styles = [
//		"main.css",
		"shapes.css",
		"editor.css",
		"ui-lightness/jquery-ui-1.8.2.custom.css",
	];

	/* path prefixes */
	var ip = "../core/";
	var cssPrefix = "../style/";
	var h = document.getElementsByTagName("head").item(0);

	/* add style sheets */
	for (i in styles) {
		var e = document.createElement("link");
		e.setAttribute("type", "text/css");
		e.setAttribute("rel", "stylesheet");
		e.setAttribute("href", cssPrefix + styles[i]);
		h.appendChild(e);
	}

	/* add scritps */
	files = files_view.concat(files_editor, files_extra);
	for (var i = 0; i < files.length; i++) {
		var e = document.createElement("script");
		e.setAttribute("type", "text/javascript");
		e.setAttribute("src", ip+files[i]);
		h.appendChild(e);
	}

}();
