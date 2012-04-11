
ANTLR=lib/antlr-3.2.jar

all: $(ANTLR) build/dotParser.js
parser: build/dotParser.js

$(ANTLR):
	curl http://www.antlr.org/download/antlr-3.2.jar -o $(ANTLR)

build/dotParser.js: build/dotLexer.js

build/dotLexer.js: src/dot.g
	java -jar $(ANTLR) -fo build $< || true
