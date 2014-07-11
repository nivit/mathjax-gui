CSSFILES= editor-formule-before.css editor-formule-img.css editor-formule-after.css
SVNROOT=	${HOME}/prog/xp-dev.com/matematicamente
VERSION=$$(cat version.txt)
GENERATORDIR=	"${SVNROOT}/formulator-images-generator/branches/formulator-images-sprite-generator-ng"
FIND=	/usr/bin/find
FILES= index-before-panels.html index-panels.html index-after-panels.html
HTMLCOMPRESSOR=	/usr/local/bin/htmlcompressor
JSFILES= editor-formule-before-ef_formule.js editor-formule-ef_matrix.js editor-formule-ef_formule.js editor-formule-after-ef_formule.js
YUICOMPRESSOR=	/usr/local/bin/yuicompressor

all: index-panels.html .SILENT
	cat ${FILES} > index.html
	cat ${CSSFILES} > editor-formule-master.css
	(cd ${.CURDIR}/lib/jquery && cat ${JSFILES} > editor-formule.js)
.if exists(${HTMLCOMPRESSOR})
	(cd ${.CURDIR} && \
	${HTMLCOMPRESSOR} --preserve-semi -o index-htmlcompressor.html index.html && \
	mv index-htmlcompressor.html index.html)
.endif
.if exists(${YUICOMPRESSOR})
	${YUICOMPRESSOR} --type css -o editor-formule.css editor-formule-master.css
	(cd ${.CURDIR}/lib/jquery && \
	${YUICOMPRESSOR} --type js --preserve-semi -o editor-formule-yuicompressor.js editor-formule.js && \
	mv editor-formule-yuicompressor.js editor-formule.js && \
	cat jquery.plugins.min.js editor-formule.js > editor-formule.min.js)
.endif
.if defined(OUTPUTDIR)
	cp index.html ${OUTPUTDIR} && \
	cp editor-formule.css ${OUTPUTDIR} && \
	cp -r assets ${OUTPUTDIR} && \
	cp -r lib/jquery/editor-formule.min.js ${OUTPUTDIR}/lib/jquery/editor-formule.min.js
.endif

index-panels.html:: .SILENT
	(cd ${GENERATORDIR} && make)
	cp ${GENERATORDIR}/index-panels.html ${.CURDIR}/index-panels.html
	cp ${GENERATORDIR}/editor-formule-ef_formule.js ${.CURDIR}/lib/jquery/
	cp ${GENERATORDIR}/editor-formule-ef_matrix.js ${.CURDIR}/lib/jquery/
	cp -r ${GENERATORDIR}/assets/images/* ${.CURDIR}/assets/images/
	cp -r ${GENERATORDIR}/assets/images/* ${.CURDIR}/assets/images/
	cp ${GENERATORDIR}/editor-formule-img.css ${.CURDIR}/editor-formule-img.css

clean:
.if defined(CLEAN_IMAGES)
	(cd ${GENERATORDIR} && make clean)
.endif
	rm -f index-panels.html index.html editor-formule.css editor-formule-img.css editor-formule-master.css
	rm -f ${.CURDIR}/lib/jquery/editor-formule.js \
	    ${.CURDIR}/lib/jquery/editor-formule-ef_formule.js \
	    ${.CURDIR}/lib/jquery/editor-formule-ef_matrix.js \
	    ${.CURDIR}/lib/jquery/editor-formule-yuicompressor.js \
	    ${.CURDIR}/lib/jquery/editor-formule.js \
	    ${.CURDIR}/lib/jquery/editor-formule.min.js
.for d in assets/images
	${FIND} ${.CURDIR}/${d} -type f -mindepth 2 -name "*.png" -delete
	${FIND} ${.CURDIR}/${d} -type d -mindepth 1 -name "*" -delete
.endfor
