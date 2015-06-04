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
 * Common JavaScript for the Thymeleaf documentation.
 * 
 * @author Emanuel Rabina
 */
$(document).ready(function() {

	// Add class names to the various table-of-contents levels so they're easier
	// to style
	$('#toc > ul').addClass('level1');
	$('#toc > ul > li > ul').addClass('level2');
	$('#toc > ul > li > ul > li > ul').addClass('level3');
	$('#toc > ul > li > ul > li > ul > li > ul').addClass('level4');

    // Languages used for syntax highlight
	var languages = ['html', 'java', 'javascript', 'xml'];

	// Normalize Pandoc 1.11 and 1.12 outputs
	for (var i = 0; i < languages.length; i++) {
		var language = languages[i];
		$('pre.' + language).addClass('sourceCode');
		$('pre.' + language + ' > code').addClass('sourceCode').addClass(language);
	}

	// Remove the markup added by Pandoc for code highlighting so that we can
	// use a different code highlighter - this is not needed in Pandoc 1.12 as
    // the '--no-highlight' option was fixed.
	$('code.sourceCode').each(function() {
		var text = $(this).text();
		$(this).text(text);
	});

	// Prep for Prettify
	$('code.sourceCode').removeClass('sourceCode');
	for (var i = 0; i < languages.length; i++) {
		var language = languages[i];
		$('code.' + language).removeClass(language).addClass('language-' + language);
		$('pre.' + language).removeClass(language).addClass('prettyprint');
	}
	prettyPrint();

	// Toggle between show/hide menu actions
	var menu = $('#menu');
	var menuLink = $('#menu-link');
	var tocWrapper = $('#toc-wrapper');
	menuLink.click(function() {
		var shown = tocWrapper.css('display') === 'none';
		tocWrapper.css('display', shown ? 'block' : 'none');
	});

	// Hide the menu when an item is clicked (for smaller screens that show the menu)
	tocWrapper.click(function(event) {
		if (menu.css('display') !== 'none' && event.target.tagName.toLowerCase() === 'a') {
			tocWrapper.css('display', 'none');
		}
	});
});
