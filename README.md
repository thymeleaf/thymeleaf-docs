
Thymeleaf Docs
==============

Thymeleaf documentation in Markdown format, which is then converted to HTML, EPUB
(using [Pandoc](https://johnmacfarlane.net/pandoc/)), MOBI (using [Calibre](https://calibre-ebook.com/))
and PDF (using [wkhtmltopdf](https://wkhtmltopdf.org/))
formats using the supplied Gradle build script.

The flavour of Markdown used is pandoc's Markdown. Its specifics and extensions can be
examined here: https://pandoc.org/MANUAL.html#pandocs-markdown


Types of documents managed
--------------------------

 * Tutorials, living in `docs/tutorials`. Output: HTML, PDF, EPUB and Kindle.
   Given their length, tutorials use their own HTML style, with an index frame
   on the left side.
 * Articles, living in `docs/articles`. Output: HTML only. Articles are output
   with the same HTML style as the rest of the Thymeleaf web site.


Building the documentation
--------------------------

The docs can be generated using the ["build" workflow](https://github.com/thymeleaf/thymeleaf-docs/actions/workflows/build.yaml)
in GitHub Actions.  The artifact created contains the docs in the same structure
as used for copying to and updating the Thymeleaf website (https://github.com/thymeleaf/thymeleaf.github.io).

If you want to build the docs on your own machine, then you can follow the
instructions below.

### Dependencies / things to install

 - Java 11+
 - Pandoc 2.2.1+ for HTML docs: https://johnmacfarlane.net/pandoc/installing.html
 - wkhtmltopdf 0.12.6+ for PDF and EPUB/MOBI docs (optional): https://wkhtmltopdf.org/downloads.html
 - Calibre for EPUB/MOBI docs (optional): https://calibre-ebook.com/download

### Generating the docs

Use the Gradle wrapper build script (`./gradlew` which is included in this repo)
to generate the documentation from the Markdown sources to your desired format,
HTML, PDF, or e-books.  The following Gradle tasks perform these jobs:

 * `generateDocsHTML` - Create the HTML docs.
 * `generateDocsPDF` - Create the PDF docs (also creates the HTML docs since it
   depends on them)
 * `generateDocsEbook` - Create the e-books.
 * `generateDocs`/`build` - Create all the above.

The generated docs will end up in the `build/site/doc` directory.  The entire
`build/site` directory will be prepared for direct copy (`cp -R`) to the
Thymeleaf website repository for publishing.

### Updating the docs for a new version

To change the version number that appears in the generated docs, update the
`project.version` property in the `build.gradle` script. The `documentDate` var
should also be changed to reflect the new date the generated documents should
refer to.


How the docs are generated
--------------------------

**Pandoc** is used to convert the Markdown sources into HTML, using the
appropriate HTML template in the `templates` directory, which in turn make use
of JavaScript and CSS files copied from the `scripts` and `styles` directories.

**Pandoc** is also used to generate e-books in EPUB format.

**Calibre** is used to convert e-books to MOBI (Kindle) format.

**wkhtmltopdf** is used to create PDF versions of the HTML docs based on the
`media="print"` stylesheet instead of the `media="screen"` one you normally see
when opening it in your browser.  The PDF generation task also launches a
**Jetty** server to host the HTML files since wkhtmltopdf uses **WebKit** and
not using a server would prevent many of the JavaScript files in the HTML
documentation from running due to WebKit's same-origin policies being stricter
with the `file://` protocol.
