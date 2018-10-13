
Thymeleaf Docs
==============

Thymeleaf documentation in Markdown format, which is then converted to HTML, EPUB
(using [Pandoc](http://johnmacfarlane.net/pandoc/)), MOBI (using [Calibre](http://calibre-ebook.com/))
and PDF (using [wkhtmltopdf](http://wkhtmltopdf.org/))
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


Setup
-----

Java 8+ required.  The build process is often run on machines with Java 11.

1. Download and install **Gradle**: http://www.gradle.org/install
2. Download and install **Pandoc**: http://johnmacfarlane.net/pandoc/installing.html
   (PDF output is not done using Pandoc, so you don't need to get LaTeX.). You
   will need version 2.2.1 or newer.
3. Optional: download and install **wkhtmltopdf**: http://wkhtmltopdf.org/downloads.html.
   wkhtmltopdf is used for rendering PDF files from pandoc's HTML output.
4. Optional: download and install **Calibre**: http://calibre-ebook.com/download.
   Calibre is used for conversion of pandoc's `.epub` output (e-book) into
   `.mobi` files (Kindle format).

Additionally, if you want to be able to import this project into Eclipse or run
the Gradle tasks from Eclipse, then install the Groovy-Eclipse and Gradle IDE
components from the [Spring Tool Suite](http://www.springsource.org/sts).
IntelliJ IDEA has support for Gradle tasks through its built-in Gradle plugin.


Generating the documentation
----------------------------

Use the Gradle build script to generate the documentation from the Markdown
sources to HTML, e-books and PDF. The following Gradle tasks perform these jobs:

 * `generateDocsHTML` - Create the HTML docs.
 * `generateDocsPDF` - Create the PDF docs (also creates the HTML docs since it
   depends on them)
 * `generateDocsEbook` - Create the e-books.
 * `generateDocs` - Creates all docs

The generated docs will end up in the `build/site/doc` directory. The entire
`build/site` directory will be prepared for direct copy (`cp -R`) to the
Thymeleaf website repository (`thymeleaf.github.com`) for publishing.

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
