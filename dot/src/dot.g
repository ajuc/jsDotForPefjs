grammar dot;

// Copyright 2009 Carlo Vanini

// Convert a dot file to a JSON representation.
// dot grammar reference: http://www.graphviz.org/doc/info/lang.html

options {
  language = JavaScript;
//  backtrack = true;
  k = 1;
}

graph : STRICT? (GRAPH | DIGRAPH) id? '{' stmt_list '}' ;

stmt_list : (stmt ';'? stmt_list)? ;

//stmt	: id '=' id | node_stmt | edge_stmt_or_subgraph | attr_stmt ;
stmt	: id ( '=' id | port? (attr_list? | edgeRHS attr_list?) )
	| edge_stmt_2_or_subgraph
	| attr_stmt ;

attr_stmt : (GRAPH | NODE | EDGE) attr_list ;

// attr_list    :   '[' [ a_list ] ']' [ attr_list ]
attr_list : '[' a_list? ']' attr_list? ;

//a_list    :   ID [ '=' ID ] [ ',' ] [ a_list ]
a_list  : id ('=' id)? ','? a_list? ;

//edge_stmt   :   (node_id | subgraph) edgeRHS [ attr_list ]
//edge_stmt : (node_id | subgraph) edgeRHS attr_list? ;
edge_stmt_or_subgraph	: edge_stmt_1 | edge_stmt_2_or_subgraph ;
edge_stmt_1	: node_id edgeRHS attr_list? ;
edge_stmt_2_or_subgraph	: subgraph (edgeRHS attr_list?)? ;

//edgeRHS   :   edgeop (node_id | subgraph) [ edgeRHS ]
//edgeRHS : edgeop (node_id | subgraph) edgeRHS? ;
edgeRHS : ( edgeop (id port? | subgraph) )+ ;

//node_stmt   :   node_id [ attr_list ]
node_stmt : node_id attr_list? ;

//node_id   :   ID [ port ]
node_id : id port? ;

//port  :   ':' ID [ ':' compass_pt ]
//  |   ':' compass_pt
port  : ':' ( id (':' COMPASS_PT)? | COMPASS_PT ) ;

//subgraph  :   [ subgraph [ ID ] ] '{' stmt_list '}'
subgraph  : (SUBGRAPH id?)? '{' stmt_list '}' ;

//compass_pt  :   (n | ne | e | se | s | sw | w | nw | c | _)
fragment COMPASS_PT  : (('n'|'N' | 's'|'S')('e'|'E' | 'w'|'W')?
            | 'e' | 'E'
            | 'w' | 'W'
            | 'c' | 'C'
            | '_')
            ;


id  : (ID_STRING | NUMBER | DOUBLE_QUOTED | ID_HTML) ;
edgeop : '--' | '->' ;


// keywords //
NODE  : ('n'|'N')('o'|'O')('d'|'D')('e'|'E') ;
EDGE  : ('e'|'E')('d'|'D')('g'|'G')('e'|'E') ;
GRAPH : ('g'|'G')('r'|'R')('a'|'A')('p'|'P')('h'|'H') ;
DIGRAPH : ('d'|'D')('i'|'I')('g'|'G')('r'|'R')('a'|'A')('p'|'P')('h'|'H') ;
SUBGRAPH  : ('s'|'S')('u'|'U')('b'|'B')('g'|'G')('r'|'R')('a'|'A')('p'|'P')('h'|'H') ;
STRICT  : ('s'|'S')('t'|'T')('r'|'R')('i'|'I')('c'|'C')('t'|'T') ;

// FIXME: include \200..\377
ID_STRING  : ('a'..'z'|'A'..'Z'|'\u00C8'..'\u0179'|'_') ('a'..'z'|'A'..'Z'|'\u00C8'..'\u0179'|'_'|'0'..'9')* ;
NUMBER    : '-'? ('.' ('0'..'9')+ | ('0'..'9')+ ('.' ('0'..'9')*)? ) ;
DOUBLE_QUOTED : '"' ( options {greedy=false;} : . )* ~'\\' '"' ;
fragment NO_TAGS  : ~('<'|'>') ;
ID_HTML : '<' ( NO_TAGS | '<' NO_TAGS* '>' )+ '>' ;

COMMENT : '/*' ( options {greedy=false;} : . )* '*/'     {$channel=HIDDEN;} ;
SL_COMMENT	:   '//' (options {greedy=false;} : . )* NL {$channel=HIDDEN;} ;
CPP_LINE	: {this.startPos==0}?=> '#' ( options {greedy = false;} : . )* NL {$channel=HIDDEN;} ;
NL  : '\r'? '\n' | '\u000C' {$channel = HIDDEN;} ;
WS  : (' '|'\t')+ {$channel = HIDDEN;} ;
