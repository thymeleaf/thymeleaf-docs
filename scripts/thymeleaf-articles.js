/*
 * Copyright 2013, The Thymeleaf Project (http://www.thymeleaf.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * JavaScript for performing post-pandoc modifications on the
 * thymeleaf-docs articles in order to apply the website standard styles.
 * 
 * @author Daniel Fernandez
 */
(function() {
	'use strict';

	// The following is a copy of the code from https://github.com/ultraq/dumb-query-selector
	var $ = (function() {
		var ID_SELECTOR_REGEX = /^#[a-zA-Z][\w-]*$/;
		return function(query, scope) {
			return ID_SELECTOR_REGEX.test(query) ?
				document.getElementById(query.substring(1)) :
				Array.prototype.slice.call((scope || document).querySelectorAll(query));
		}
	})();


	// Languages used for syntax highlight
	var languages = ['html', 'java', 'javascript', 'xml'];

	// Normalize Pandoc 1.11 and 1.12 outputs
	languages.forEach(function(language) {
		$('pre.' + language).forEach(function(el) {
			el.classList.add('sourceCode');
		});
		$('pre.' + language + ' > code').forEach(function(el) {
			el.classList.add('sourceCode');
			el.classList.add(language);
		});
	});

	// Remove the markup added by Pandoc for code highlighting so that we can
	// use a different code highlighter - this is not needed in Pandoc 1.12 as
	// the '--no-highlight' option was fixed.
	$('code.sourceCode').forEach(function(el) {

		// We can't shortcut these 2 lines otherwise the JS engine optimizes away
		// the text processing, making this a no-op.
		var text = el.textContent;
		el.textContent = text;
	});

	// Make the necessary modifications to activate the SyntaxHighlight plugin
	// (note articles use this, used in other parts of the website, instead of
	// prettify, which is used in the tutorials).
	languages.forEach(function(language) {
		$('pre.' + language).forEach(function(el) {
			var text = el.querySelector('code').textContent;
			el.textContent = text;
			el.classList.remove('sourceCode');
			el.classList.remove(language);
			el.classList.add('brush:' + language + ';gutter:false');
		});
	});

	// Use <kbd> for inlined code samples
	$('code').forEach(function(el) {
		var kbdEl = document.createElement('kbd');
		kbdEl.innerHTML = el.innerHTML;
		el.parentElement.insertBefore(kbdEl, el);
		el.parentElement.removeChild(el);
	});

	// Convert the name of the current article at the breadcrumb into lower case
	var articleTitle = $('#breadcrumb > .current')[0];
	articleTitle.textContent = articleTitle.textContent.toLowerCase();

})();
