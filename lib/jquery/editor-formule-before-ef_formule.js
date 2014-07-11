/*
 * @copyright@
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer
 *     in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Version: @version@
 */
/*
 $Revision: 1179 $
 $Author: mordigante $
 $URL: http://xp-dev.com/svn/matematicamente/formulator/branches/formulator-with-mathjax-w-images/lib/jquery/editor-formule.js $
 */
/* VARIABILI GLOBALI */
var debug = false, exp_holder = '?', exp_holder_len = exp_holder.length, TAB_KEYCODE = 0x09,
// gestione cookie
cookies = {
    syntax: {
	value: 'asciimathml' /* asciimathml | 'latex' */
    },
    tags: {
	value: 'true' /* true | false */
    }
}, cookie_expires = new Date(2050, 0, 1), /* Scade 01/01/2050 */ syntax,
preview = 'false', // 'true' (inserimento nel post del forum) | 'false'
tags,
// matrici e sistemi di equazioni
matrix_rows = 0, matrix_cols = 0, matrix_max_dim = 7, matrix_code = '', max_equations = 5, // ID elementi <area>
