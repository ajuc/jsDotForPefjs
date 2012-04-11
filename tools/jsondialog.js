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

/*
JSDot.EditTools.jsonDialog = function() {
};
//*/

JSDot.EditTools.jsonDialog = {

	show: function(jsdot) {
		var jsonTool = jsdot.getTool('json', {});
		var g = jsonTool.exportGraph();
		//var dialog = document.createElement('div');
		var text = document.createElement('textarea');
		text.value = g;
		var container = document.createElement('div');
		container.appendChild(text);
		
		function importGraph(clear) {
			if (clear) jsdot.graph.clear();
			var msg = null;
			switch (jsonTool.importGraph(text.value)) {
				case 0: /* ok */
					break;
				case 1:
					msg = "The input is not a well-formed representation of a graph.";
					break;
				case 2:
					msg = "The input contains nodes with duplicate names.";
					break;
				case 3:
					msg = "An edge link to an inexistent node.";
					break;
				default:
					msg = "Unknown error encountered.";
					break;
			}
			if (msg) {
				var div = document.createElement('div');
				div.appendChild(document.createTextNode(msg));
				$(div).dialog({
						modal: true,
						close: function() {
							$(div).dialog('destroy');
							div.parentNode.removeChild(div);
							},
						buttons: {
							Ok: function() {
								$(this).dialog('close');
							} }
						});
			} else {
				$(container).dialog('close');
			}

		};
		
		$(container).dialog({
				//'modal': true,
				'dialogClass': 'jsdot-editjson',
				'modal': true, /* options order matters! */
				'width': 600,
				'height': 400,
				'close': function() {
					$(container).dialog('destroy');
					container.parentNode.removeChild(container);
					},
				'buttons': {
					'Cancel': function () { $(container).dialog('close'); },
					'Import': function () { importGraph(false); },
					'Load': function () { importGraph(true); },
					},
				});
	},
};
