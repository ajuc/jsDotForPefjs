
YUI=yuicompressor-2.4.2
YUI_BIN=lib/$(YUI).jar


all: demo


$(YUI_BIN):
	wget -O lib/$(YUI).zip http://yui.zenfs.com/releases/yuicompressor/$(YUI).zip
	unzip -j -d lib/ lib/$(YUI).zip $(YUI)/build/$(YUI).jar

demo/jsdot.min.js: $(YUI_BIN) core/*.js
	echo "" > $@.tmp
	((cd core; cat `cat jsdot-dev.js | awk '/var files_view = \[/,/\];/{if(/^[ \t\n\f\r]*\/\*/ || /^[ \t\n\f\r]*\/\//){next}else{match($$1,/^[ \t\n\f\r]*"(.*)",?[ \t\n\f\r]*$$/,a);printf "%s ",a[1]}}'`)) >> $@.tmp
	((cd core; cat `cat jsdot-dev.js | awk '/var files_editor = \[/,/\];/{if(/^[ \t\n\f\r]*\/\*/ || /^[ \t\n\f\r]*\/\//){next}else{match($$1,/^[ \t\n\f\r]*"(.*)",?[ \t\n\f\r]*$$/,a);printf "%s ",a[1]}}'`)) >> $@.tmp
	java -jar $(YUI_BIN) --type js -v -o $@ $@.tmp

demo: demo/jsdot.min.js

doc: core/*.js
	if [ ! -d doc ] ; then mkdir doc ; fi
	rm -f doc/doc.log
	JSDOC_PATH=~/local/share/jsdoc-toolkit ; \
	java -jar $$JSDOC_PATH/jsrun.jar $$JSDOC_PATH/app/run.js -a -p -t=$$JSDOC_PATH/templates/jsdoc -d=doc -o=doc/doc.log core/
