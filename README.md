Thymeleaf Docs
==============

Thymeleaf documentation in Markdown format, which is then converted to HTML, EPUB
(using [Pandoc](http://johnmacfarlane.net/pandoc/)), MOBI (using [Calibre](http://calibre-ebook.com/))
and PDF (using [wkhtmltopdf](http://code.google.com/p/wkhtmltopdf/))
formats using the supplied Gradle build script.


Types of documents managed
--------------------------

* Tutorials, living in `docs/tutorials`. Output: HTML, PDF, EPUB and Kindle. Given their length,
  tutorials use their own HTML style, with an index frame on the left side.
* Articles, living in `docs/articles`. Output: HTML only. Articles are output with the same
  HTML style as the rest of the Thymeleaf web site.


Setup
-----

(I'm going to assume you've got a working Java 6+ environment.)

1. Download and install **Gradle**: http://www.gradle.org/downloads
2. Download and install **Pandoc** for your environment: http://johnmacfarlane.net/pandoc/installing.html
   (PDF output is not done using Pandoc, so you don't need to get LaTeX.). You will need version 1.12 or 
   newer of pandoc, as it fixes some important bugs.
3. Download and install **wkhtmltopdf** for your environment: http://wkhtmltopdf.org/downloads.html.
   wkhtmltopdf is used for rendering PDF files from pandoc's HTML output, so you might not need it if you
   are not interested on PDF output.
4. Download and install **Calibre** for your environment: http://calibre-ebook.com/download. Calibre is used
   for conversion of pandoc's `.epub` output (e-book) into `.mobi` files (Kindle format), so you might not need it if you
   are not interested on e-book output.

Optional: If you want to be able to import this project into Eclipse or run the
Gradle job from Eclipse, then install the Groovy-Eclipse and Gradle IDE
components from the [Spring Tool Suite](http://www.springsource.org/sts).


Generating the documentation
----------------------------

Use the Gradle build script to generate the documentation from the Markdown
sources to HTML, e-books and PDF. The following Gradle tasks perform these jobs:

 * `generateDocsHTML` - Create the HTML docs.
 * `generateDocsPDF` - Create the PDF docs (also creates the HTML docs since it
   depends on them)
 * `generateDocsEbook` - Create the e-books.
 * `generateDocs` - Creates all docs

The generated docs will end up in the `build/site/doc` directory. The entire `build/site`
directory will be prepared for direct copy (`cp -R`) to the Thymeleaf website repository
(`thymeleaf.github.com`) for publishing, and it will also contain several `.html` files
in the `build/site` and `build/site/doc/html` directories acting as *redirects* from old
locations of documentation files to the new ones (GitHub pages does not support any other kind
of redirects).

### Updating the docs for a new version

To change the version number that appears in the generated docs, update the
`project.version` property in the `build.gradle` script. The `project.documentDate`
property should also be changed to reflect the new date the generated documents should
refer to.


How the docs are generated
--------------------------

**Pandoc** is used to convert the Markdown sources into HTML, using the appropriate
HTML template in the `templates` directory, which in turn also makes use of JavaScript and CSS
files copied from the `scripts` and `styles` directories.

**Pandoc** is also used to generate e-books in EPUB format.

**Calibre** is used to convert e-books to MOBI (Kindle) format.

**wkhtmltopdf** is used to then create PDF versions of the HTML docs based on the
`media="print"` stylesheet instead of the `media="screen"` one you normally see when opening it in
your browser.  This task performs a workaround of launching a **Jetty** server to
temporarily host the HTML files since wkhtmltopdf uses **WebKit** and not using a server would prevent many of the JavaScript files in the HTML documentation from running due
to WebKit's same-origin policies being stricter with the `file://` protocol.


