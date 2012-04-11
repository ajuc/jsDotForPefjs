
var cases = function(){
	var res = {};
	
	var node1 = {
		name: "node1",
		attributes: {
			label: "a",
			color: "blue",
			pos: "200,100"
		}
	};
	var node2 = {
		name: "node2",
		attributes: {
			label: "b",
			color: "red",
			pos: "500,100"
		}
	};
	var node3 = {
		name: "node3",
		attributes: {
			label: "c",
			color: "yellow",
			pos: "200,500"
		}
	};
	var node4 = {
		name: "node4",
		attributes: {
			label: "d",
			color: "green",
			pos: "500,500"
		}
	};
	
	var edge1 = {
		src: "node1",
		dst: "node2",
		attributes: {
			label: "edge1",
			style: "dotted"
		}
	};
	var edge5 = {
		src: "node1",
		dst: "node2",
		attributes: {
			label: "edge5",
			style: "solid"
		}
	};
	
	var edge2 = {
		src: "node2",
		dst: "node3",
		attributes: {
			label: "edge2",
			style: "dotted"
		}
	};
	var edge3 = {
		src: "node3",
		dst: "node4",
		attributes: {
			label: "edge3",
			style: "dotted"
		}
	};
	var edge4 = {
		src: "node4",
		dst: "node1",
		attributes: {
			label: "edge4",
			style: "dotted"
		}
	};
	
	
	// o 	graph1
	res.graph1 = '{ \
		"name": "graph1", \
		"directed": false, \
		"nodes": ["node1"], \
		"edges": [], \
		"attributes": { \
			"label": "graph with a single node" \
		} \
	}';
	res.graph1_ref = {
			name: "graph1",
			directed: false,
			nodes: {
				"node1": {name: "node1", attributes: {}}
			},
			edges: {},
			attributes: {label: "graph with a single node"}
	};
	
	// o 	graph1b
	res.graph1b = '{ \
		"name": "graph1", \
		"directed": false, \
		"nodes": [\
			{"name": "node1"}\
			], \
		"edges": [], \
		"attributes": { \
			"label": "graph with a single node" \
		} \
	}';
	
	
	// o - o 	graph2
	res.graph2 = '{\
		"name": "graph2",\
		"directed": false,\
		"nodes": [\
		          {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
		          {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}}\
		         ],\
		"edges": [{"src": "node1", "dst": "node2", "attributes": {"label": "edge1", "style": "dotted"}}],\
		"attributes": {\
			"label": "undirected graph with two nodes and one edge"\
		}\
	}';
	{
		var g = JSON.parse(res.graph2);
		g.nodes = {
				"node1": {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},
				"node2": {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}}
		};
		g.edges = { "5:5-node1-node2": {
			src: node1,
			dst: node2,
			attributes: {
				label: "edge1",
				style: "dotted"
			}
		}};
		res.graph2_ref = g;
	}
	
	
	// o -> o 	graph3
	res.graph3 = '{\
		"name": "graph3",\
		"directed": true,\
		"nodes": [\
				  {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
		          {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}}\
				  ],\
		"edges": [\
				  {"src": "node1", "dst": "node2", "attributes": {"label": "edge5", "style": "solid"}}\
				  ],\
		"attributes": {\
			"label": "directed graph with two nodes and one edge"\
		}\
	}';
	{
		var g = JSON.parse(res.graph3);
		g.nodes = {
				"node1": {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},
				"node2": {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}}
		};
		g.edges = { "5:5-node1-node2": {
			src: node1,
			dst: node2,
			attributes: {
				label: "edge5",
				style: "solid"
			}
		}};
		res.graph3_ref = g;
	}
	
	
	// o - o
	// |   | 	graph4
	// o - o
	res.graph4 = '{\
		"name": "graph4",\
		"directed": false,\
		"nodes": [\
				  {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
		          {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},\
				  {"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},\
				  {"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}\
				  ],\
		"edges": [\
				  {"src": "node1", "dst": "node2", "attributes": {"label": "edge1", "style": "solid"}},\
				  {"src": "node2", "dst": "node3", "attributes": {"label": "edge2", "style": "solid"}},\
				  {"src": "node3", "dst": "node4", "attributes": {"label": "edge3", "style": "solid"}},\
				  {"src": "node4", "dst": "node1", "attributes": {"label": "edge4", "style": "solid"}}\
				  ],\
		"attributes": {\
			"label": "unddirected graph with four nodes and four edges"\
		}\
	}';
	{
		var g = JSON.parse(res.graph4);
		g.nodes = {
				"node1": {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},
				"node2": {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},
				"node3": {"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},
				"node4": {"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}
		};
		g.edges = { "5:5-node1-node2": {
			src: node1,
			dst: node2,
			attributes: {
				label: "edge1",
				style: "solid"
			}
		},
		"5:5-node2-node3": {
			src: node2,
			dst: node3,
			attributes: {
				label: "edge2",
				style: "solid"
			}
		},
		"5:5-node3-node4": {
			src: node3,
			dst: node4,
			attributes: {
				label: "edge3",
				style: "solid"
			}
		},
		"5:5-node4-node1": {
			src: node4,
			dst: node1,
			attributes: {
				label: "edge4",
				style: "solid"
			}
		}};
		res.graph4_ref = g;
	}
	
	// o - o
	//     |	graph5
	// o - o
	res.graph5 = '{\
		"name": "graph5",\
		"directed": false,\
		"nodes": [\
				  {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
		          {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},\
				  {"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},\
				  {"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}\
				  ],\
		"edges": [\
				  {"src": "node1", "dst": "node2", "attributes": {"label": "edge1", "style": "solid"}},\
				  {"src": "node2", "dst": "node3", "attributes": {"label": "edge2", "style": "solid"}},\
				  {"src": "node3", "dst": "node4", "attributes": {"label": "edge3", "style": "solid"}}\
				  ],\
		"attributes": {\
			"label": "unddirected graph with four nodes and three edges (connected)"\
		}\
	}';
	{
		var g = JSON.parse(res.graph5);
		g.nodes = {
				"node1": {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},
				"node2": {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},
				"node3": {"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},
				"node4": {"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}
		};
		g.edges = { "5:5-node1-node2": {
			src: node1,
			dst: node2,
			attributes: {
				label: "edge1",
				style: "solid"
			}
		},
		"5:5-node2-node3": {
			src: node2,
			dst: node3,
			attributes: {
				label: "edge2",
				style: "solid"
			}
		},
		"5:5-node3-node4": {
			src: node3,
			dst: node4,
			attributes: {
				label: "edge3",
				style: "solid"
			}
		}};
		res.graph5_ref = g;
	}
	
	
	// o - o 
	//			graph6
	// o - o
	res.graph6 = '{\
		"name": "graph6",\
		"directed": false,\
		"nodes": [\
				  {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
		          {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},\
				  {"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},\
				  {"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}\
				  ],\
		"edges": [\
				  {"src": "node1", "dst": "node2", "attributes": {"label": "edge1", "style": "solid"}},\
				  {"src": "node3", "dst": "node4", "attributes": {"label": "edge3", "style": "solid"}}\
				  ],\
		"attributes": {\
			"label": "unddirected graph with four nodes and two edges (disconnected)"\
		}\
	}';
	{
		var g = JSON.parse(res.graph6);
		g.nodes = {
				"node1": {"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},
				"node2": {"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},
				"node3": {"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},
				"node4": {"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}
		};
		g.edges = { "5:5-node1-node2": {
			src: node1,
			dst: node2,
			attributes: {
				label: "edge1",
				style: "solid"
			}
		},
		"5:5-node3-node4": {
			src: node3,
			dst: node4,
			attributes: {
				label: "edge3",
				style: "solid"
			}
		}};
		res.graph6_ref = g;
	}
	
	res.duplicateNode = '{ \
			"name": "duplicate", \
			"directed": false, \
			"nodes": ["node1", "node2", "node1", "node3"], \
			"edges": [], \
			"attributes": { \
				"label": "graph with a duplicate node" \
			} \
		}';
			
	res.duplicateNode_ref = {
			'name': 'duplicate',
			'directed': false,
			'nodes': {
				'node1': {'name': 'node1', 'attributes': {}},
				'node2': {'name': 'node2', 'attributes': {}},
				'node3': {'name': 'node3', 'attributes': {}}
			},
			'edges': {},
			"attributes": {"label": "graph with a duplicate node"}
	};
	
	return res;
} (); // create reference graphs


var ops = {

		countAttr: function(attr) {
			var count = 0;
			for (var a in attr) {
				count++;
			}
			return count;
		},
		
		compareAttributes: function(attr1, attr2) {
			if(this.countAttr(attr1) != this.countAttr(attr2)) return false;
			
			for (var attr in attr1) {
				if (attr1[attr] != attr2[attr]) return false;
			} 
			
			return true;
		},
		
		compareTwoNodes: function(node1, node2) {
			//if (!node1 || !node2) return node1 == node2;
			if(node1.name != node2.name) return false;
			else if(! this.compareAttributes(node1.attributes, node2.attributes)) return false;
			else return true;
		},
		
		compareArrayOfNodes: function(arrayOfNode1, arrayOfNode2) {
			if(this.countAttr(arrayOfNode1) != this.countAttr(arrayOfNode2)) return false;
			else {
				for(var i in arrayOfNode1) {
					if(! this.compareTwoNodes(arrayOfNode1[i], arrayOfNode2[i])) return false;
				}
				return true;
			}
		},
		
		compareTwoEdges: function(edge1, edge2) {
			//if (!edge1 || !edge2) return edge1 == edge2;
			if(! this.compareTwoNodes(edge1.src, edge2.src)) return false;
			else if(! this.compareTwoNodes(edge1.dst, edge2.dst)) return false;
			else if(! this.compareAttributes(edge1.attributes, edge2.attributes)) return false;
			else return true;
		},
		
		compareArrayOfEdges: function(arrayOfEdges1, arrayOfEdges2) {
			if(this.countAttr(arrayOfEdges1) != this.countAttr(arrayOfEdges2)) return false;
			else {
				for(var i in arrayOfEdges1) {
					if(! this.compareTwoEdges(arrayOfEdges1[i], arrayOfEdges2[i])) return false;
				}
				return true;
			}
		},
		
		compareGraphs: function(graph1, graph2) {
			if(graph1.name != graph2.name) return false;
			else if(graph1.directed != graph2.directed) return false;
			else if(! this.compareAttributes(graph1.attributes, graph2.attributes)) return false;
			else if(! this.compareArrayOfNodes(graph1.nodes, graph2.nodes)) return false;
			else if(! this.compareArrayOfEdges(graph1.edges, graph2.edges)) return false;
			else return true;	
		},

};
