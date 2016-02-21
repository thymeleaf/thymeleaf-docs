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
 * Common JavaScript for the Thymeleaf tutorial documentation.
 * 
 * @author Emanuel Rabina
 */
(function() {
	'use strict';

	var $ = DumbQuerySelector.$;
	var $$ = DumbQuerySelector.$$;

	// Add class names to the various table-of-contents levels so they're easier to style
	$$('#toc > ul').forEach(function(el) {
		el.classList.add('level1');
	});
	$$('#toc > ul > li > ul').forEach(function(el) {
		el.classList.add('level2');
	});
	$$('#toc > ul > li > ul > li > ul').forEach(function(el) {
		el.classList.add('level3');
	});
	$$('#toc > ul > li > ul > li > ul > li > ul').forEach(function(el) {
		el.classList.add('level4');
	});

	// Languages used for syntax highlight
	var languages = ['html', 'java', 'javascript', 'xml', 'css', 'text'];

	// Normalize Pandoc 1.11 and 1.12 outputs
	languages.forEach(function(language) {
		$$('pre.' + language).forEach(function(el) {
			el.classList.add('sourceCode');
		});
		$$('pre.' + language + ' > code').forEach(function(el) {
			el.classList.add('sourceCode');
			el.classList.add(language);
		});
	});

	// Remove the markup added by Pandoc for code highlighting so that we can
	// use a different code highlighter - this is not needed in Pandoc 1.12 as
	// the '--no-highlight' option was fixed.
	$$('code.sourceCode').forEach(function(el) {

		// We can't shortcut these 2 lines otherwise the JS engine optimizes away
		// the text processing, making this a no-op.
		var text = el.textContent; 
		el.textContent = text; 
		el.classList.remove('sourceCode');
	});

	// Prep for Prettify
	languages.forEach(function(language) {
		$$('code.' + language).forEach(function(el) {
			el.classList.remove(language);
			el.classList.add('language-' + language);
		});
		$$('pre.' + language).forEach(function(el) {
			el.classList.remove(language);
			el.classList.add('prettyprint');
		});
	});
	prettyPrint();

	// Toggle between show/hide menu actions
	var menu = $('#menu');
	var tocWrapper = $('#toc-wrapper');
	$('#menu-link').addEventListener('click', function(event) {
		var shown = getComputedStyle(tocWrapper).display === 'none';
		tocWrapper.style.display = shown ? 'block' : 'none';
	});

	// Hide the menu when an item is clicked (for smaller screens that show the menu)
	tocWrapper.addEventListener('click', function(event) {
		if (getComputedStyle(menu).display !== 'none' && event.target.tagName.toLowerCase() === 'a') {
			tocWrapper.style.display = 'none';
		}
	});

})();
