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
$(document).ready(function() {

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


    // Make the necessary modifications to activate the SyntaxHighlight plugin
    // (note articles use this, used in other parts of the website, instead of
    // prettify, which is used in the tutorials).
    for (var i = 0; i < languages.length; i++) {
        var language = languages[i];
        var codeNodes = $('pre.' + language);
        codeNodes.each(function() {
            var text = $(this).children('code').text();
            $(this).text(text);
            $(this).removeClass('sourceCode').removeClass(language);
            $(this).addClass('brush:' + language + ';gutter:false');
        });
    }

    var articleTitleNode = $('#breadcrumb > .current');
    var articleTitle = articleTitleNode.text();
    articleTitleNode.text(articleTitle.toLowerCase());

});
