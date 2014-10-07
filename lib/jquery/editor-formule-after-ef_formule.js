
/* FUNZIONI */
// gestione matrici, sistemi di equazioni
function getMatrixRowsCols() {
    var n, rc;

    n = prompt('Inserisci le dimensioni della matrice (max ' + matrix_max_dim + 'x' + matrix_max_dim + ')', 'righe x colonne');

    if (n === null) {
	return false;
    }
    rc = n.split('x', 2);

    matrix_rows = 0;
    matrix_cols = 0;

    if (rc[0]) {
	matrix_rows = parseInt(rc[0], 10);
    }

    if (rc[1]) {
	matrix_cols = parseInt(rc[1], 10);

    }

    if (isNaN(matrix_rows) || matrix_rows <= 0 || matrix_rows > matrix_max_dim) {
	return false;
    }

    if (isNaN(matrix_cols) || matrix_cols <= 0 || matrix_cols > matrix_max_dim) {
	return false;
    }

    return true;
}

function make_matrix_code(matrix_type) {
    var nr = 0, nc = 0, r, c, ldem, rdem, csep, // separatore colonne
 rsep, delimiters; // separatore righe
    if (syntax === 'asciimathml') {
	delimiters = matrix_type.split(',');

	ldem = delimiters[0];
	rdem = delimiters[1];

	csep = ',';
	rsep = '),(';

        if (matrix_rows === 1) {
          ldem = ldem.replace(/\(/, '');
          rdem = rdem.replace(/\)/, '');
          csep = ' \\ \\ ';
        }
    }
    else {

	ldem = '\\begin{' + matrix_type + '}';
	rdem = '\\end{' + matrix_type + '}';
	csep = ' &';
	rsep = '\\\\';
    }

    matrix_code = ldem;

    for (r = 1; r <= matrix_rows; r = r + 1) {
	nc = 0;
	for (c = 1; c <= matrix_cols; c = c + 1) {
	    nc = nc + 1;
	    if (nc > 1 && nc <= matrix_cols) {
		matrix_code = matrix_code + csep;
	    }
	    matrix_code = matrix_code + ' ? ';
	}
	nr = nr + 1;
	if (nr < matrix_rows) {
	    matrix_code = matrix_code + rsep;
	}
    }
    matrix_code = matrix_code + rdem;
}

function getNumberOfEquations() {
    var n = prompt('Numero di equazioni del sistema? (massimo ' + max_equations + ')', '3');

    if (isNaN(n) || (n < 1) || (n > max_equations)) {
	alert('Numero inserito non valido!');
	return 0;
    }

    return n;
}

// seleziona successivo ?
function selectNextExp(node) {
    var text, next_holder;

    text = node.val();
    next_holder = text.indexOf(exp_holder, 0);

    if ((next_holder >= 0) && (typeof(exp_holder) === 'string')) {
	node.wcaret({
	    start: next_holder,
	    end: next_holder + exp_holder_len
	});
    }
}

// inserisce la formula
function insertFormula(formula, where) {

    if (formula.length > 0) {
	var content, curpos, sel, ldem, rdem;

	ldem = ' $ ';
	rdem = ' $ ';

	if (syntax === 'latex') {
	    ldem = ' \\( ';
	    rdem = ' \\) ';
	}
	if (tags === 'true' && preview === 'true') {
	    formula = ldem + formula + rdem;
	}

	// rimuove segnaposto-espressione se inserita nel forum
	if (preview === 'true') {
	    formula = formula.replace(/\?/gi, ' ');
	}

	// ottiene contenuto textarea
	content = where.val();

	// ottiene posizione corrente cursore
	if ($.browser.opera) {
	    curpos = where.wcaret().start;
	}
	else {
	    curpos = where.caret();
	}

	// controlla se c'e' testo selezionato
	where.focus();
	sel = where.getSelection();
	if ((sel.start && sel.end) || sel.text) {
	    where.replaceSelection(formula);
	}
	else {
	    content = content.substr(0, curpos) + formula + content.substr(curpos);
	    where.val(content);
	}

       if (preview === 'false') {
	    content = where.val();
	    UpdateMath(content, syntax);
       }

	where.caret(curpos + formula.length);
    }
    selectNextExp(where);
    where.focus();
}

// gestione cookie
function setOption(option, value) {

    cookies[option].value = value;
    $.cookie(option, value, {
	expires: cookie_expires
    });
}

function getOption(option) {

    return cookies[option].value;
}

function getOptions() {
    var c, sc, report = '', localdebug = false;

    for (c in cookies) {
	sc = $.cookie(c);
	if (sc === null) {
	    // imposta un cookie con il valore di default
	    setOption(c, cookies[c].value);
	}
	else {
	    // usa il valore del cookie dell'utente
	    setOption(c, sc);
	}
	report = report + c + ': ' + cookies[c].value + '\n';
    }

    syntax = cookies.syntax.value;
    tags = cookies.tags.value;

    if (debug || localdebug) {
	alert(report);
    }

}

function invertValue(c) {
    var sc = getOption(c);

    if (sc === 'false') {
	sc = 'true';
    }
    else {
	sc = 'false';
    }

    setOption(c, sc);

}

// avvio editor
function initEditorFormule() {
    var mid, selector, target_area;

    // Preferenze
    getOptions();

    $('input[value="' + syntax + '"]').attr({
	'checked': 'checked'
    });

    target_area = $('#editor-formule-code');

    if (tags === 'true') {
	$('#editor-formule-option-tags').attr({
	    'checked': 'checked'
	});
    }
    else {
	$('#editor-formule-option-tags').attr({
	    'checked': ''
	});
    }

    $('input[name="syntax"]').click(function () {
	var new_syntax = $(this).attr('value');

	setOption('syntax', new_syntax);
	syntax = new_syntax;
    });

    $('#editor-formule-option-tags').click(function () {
	invertValue('tags');
	tags = getOption('tags');
    });

    // Top menu
    $('.lavaLampNoImage').lavaLamp({
	fx: 'backout',
	speed: 700,
	click: function (event, menuItem) {
	    return false;
	}
    });

    selector = 'istruzioni';
    $('.top-selectors').click(function () {
	var sel = $(this).attr('id');

	sel = sel.slice(sel.indexOf('-') + 1);

	if (sel !== selector) {
	    $('#' + selector).hide();
	    $('#' + sel).show();
	    $('#nav-prev-' + selector).hide();
	    $('#nav-next-' + selector).hide();
	    $('#nav-prev-' + sel).show();
	    $('#nav-next-' + sel).show();

	    selector = sel;
	}
	else {
	    $('#' + sel).toggle();
	    $('#nav-prev-' + sel).toggle();
	    $('#nav-next-' + sel).toggle();
	}
    });

    // Cancella la formula inserita
    $('#editor-formule-cancel-button').click(function () {

	$('#editor-formule-code').val('');
	UpdateMath('', syntax);
    });

    // Inserisce formula nella textarea del forum
    $('#editor-formule-insert-button').click(function () {
	if (preview === 'false') {
	    var code;

	    preview = 'true';
	    code = $.trim($('#editor-formule-code').val());
	    insertFormula(code, $('#message', top.document));
	    preview = 'false';
	}
    });

    // Mostra/nasconde opzioni
    $('#editor-formule-options-button').click(function () {
	$('#editor-formule-options').toggle();
    });

    /*
     * Gestione tasto TAB
     */
    // evento keypress per browser Opera
    $('#editor-formule-code').bind('keypress keydown', function (event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);

	if (keycode === TAB_KEYCODE) {
	    // seleziona successivo ?
	    selectNextExp($(this));
	    event.preventDefault();
	    return false;
	}
    });

    /* immagini mappa */
    $('.editor-formule-tab img').click(function () {
	var id, localcode;

	id = $(this).attr('id');
	localcode = ef_formule[id][syntax];
	if (localcode === '' && syntax === 'asciimathml') {
	    alert('Codice assente in ASCIIMathML\nProva a usare la sintassi LaTeX (per l\'intera formula)\nselezionandola nelle OPZIONI');
	}
	else {
	    insertFormula(localcode, target_area);
	}
    });

    /* gestisce diversamente sistemi di equazioni */
    $('#co01').unbind('click').click(function () {
	var matrix_type, system_code = '', number_of_equations = getNumberOfEquations();

	if (number_of_equations > 1) {
	    matrix_type = 'cases';

	    if (syntax === 'asciimathml') {
		matrix_type = '{ (,):}';
	    }

	    matrix_rows = number_of_equations;
	    matrix_cols = 1;
	    make_matrix_code(matrix_type);
	    system_code = matrix_code;

	    insertFormula(system_code, target_area);
	}
    });

    /* gestisce diversamente le matrici */
    for (mid in matrix_ids) {
	$('#' + mid).unbind('click').click(function () {
	    if (getMatrixRowsCols()) {
		make_matrix_code(matrix_ids[$(this).attr('id')][syntax]);
		insertFormula(matrix_code, target_area);
	    }
	    else {
		alert('Le dimensioni immesse non sono valide!');
	    }
	});
    }
}
