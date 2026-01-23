
Documentación Thymeleaf
=======================

[![construcción](https://github.com/thymeleaf/thymeleaf-docs/actions/workflows/build.yaml/badge.svg)](https://github.com/thymeleaf/thymeleaf-docs/actions/workflows/build.yaml)

La documentación de Thymeleaf está en formato Markdown, la cual es después 
convertida a los formatos HTML, EPUB
(usando [Pandoc](https://johnmacfarlane.net/pandoc/)), 
MOBI (usando [Calibre](https://calibre-ebook.com/))
y PDF (usando [wkhtmltopdf](https://wkhtmltopdf.org/)) usando el script de construcción de Gradle 
proporcionado.

El estilo de Markdown utilizado es el Markdown de Pandoc. Sus particularidades y 
extensiones pueden examinarse aquí.: 
https://pandoc.org/MANUAL.html#pandocs-markdown


Tipos de documentos gestionados
-------------------------------

 * Tutoriales, que se encuentran en `docs/tutorials`. Salidas: HTML, PDF, EPUB y 
   Kindle. Dados sus tamaños, los tutoriales usan sus propios estilos HTML, con 
   un marco de índice en el lado izquierdo.
 * Artículos, que se encuentran en `docs\articles. Salidas: Solo HTML. Los 
   artículos son salidas con el mismo estilo de HTML que el resto dei sitio web 
   de Thymeleaf.


Construyendo la documentación
-----------------------------

Los documentos pueden ser generados usando el 
[flujo de trabajo "build"](https://github.com/thymeleaf/thymeleaf-docs/actions/workflows/build.yaml)
en las Acciones de GitHub.  El artefacto creado contiene los documentos en 
la misma estructura que se usa para copiar y actualizar el sitio web de 
Thymeleaf (https://github.com/thymeleaf/thymeleaf.github.io).

Si quiere construir los documentos en su propia máquina, entonces puede seguir 
las instrucciones de debajo.

### Dependencias / cosas a instalar

 - Java 11+
 - Pandoc 2.2.1+ para los documentos HTML: https://johnmacfarlane.net/pandoc/installing.html
 - wkhtmltopdf 0.12.6+ para los documentos PDF y EPUB/MOBI (opcional): https://wkhtmltopdf.org/downloads.html
 - Calibre para los documentos EPUB/MOBI (opcional): https://calibre-ebook.com/download

### Generando los documentos

Utilize la envoltura del script de construcción de Gradle (`./gradlew` que está 
incluído en este repositorio) para generar la documentación desde los fuentes 
de Markdown a su formato deseado, HTML, PDF o libros electrónicos. Las 
siguientes tareas de Gradle realizan estos trabajos:

 * `generateDocsHTML` - Crea los documentos HTML.
 * `generateDocsPDF` - Crea los documentos PDF (también crea los documentos HTML
    ya que depende de ellos)
 * `generateDocsEbook` - Crea los libros electrónicos.
 * `generateDocs`/`build` - Crea todo lo anterior.

Los documentos generados terminarán en el directorio `build/site/doc`. El 
directorio entero `build/site` se preparará para copia directa (`cp -R`) 
al repositorio del sitio web de Thymeleaf para su publicación.

### Actualizando los documentos para una versión nueva

Para cambiar el número de versión que aparece en los documentos generados, 
actualize el objeto `documentMetadata` en el script `build.gradle` para la fecha 
y la versión de los documentos que necesitan actualizarse.


Cómo se generan los documentos
------------------------------

Se usa **Pandoc** para convertir los fuentes de Markdown en HTML, usando la 
plantilla apropiada de HTML en el directorio `templates`, que a su vez utiliza 
archivos JavaScript y CSS copiados de los directorios `scripts` y `styles`.

También se usa **Pandoc** para generar los libros electrónicos en formato EPUB.

Se usa **Calibre** para convertir los libros electrónicos al formato MOBI 
(Kindle)

Se usa **wkhtmltopdf** para crear las versiones PDF de los documentos HTML 
basados en la hoja de estilos `media="print"` en lugar de la `media="screen"` 
que normalmente se ve al abrirlos en el navegador. La tarea de generación de PDF 
también lanza un servidor **Jetty** para hospedar los ficheros HTML ya que 
wkhtmltopdf usa **WebKit** y no usar un servidor evitaría que muchos de los 
archivos JavaScript en la documentación HTML se ejecuten debido a que las 
políticas del mismo origen de WebKit son más estrictas con el protocolo 
`file://`.
