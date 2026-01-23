---
title: De HTML a HTML (vía HTML)
---


Conocer los fundamentos de la familia de estándares web HTML es fundamental al 
utilizar software como Thymeleaf. Al menos si se quiere comprender lo que se 
está haciendo.

El problema es que mucha gente conoce las tecnologías que utiliza para crear 
sitios web, pero desconoce su origen. Ha transcurrido un largo camino desde la 
creación de las primeras interfaces web, y desde entonces, cada nueva tecnología 
ha cambiado la forma en que desarrollamos para la web, desvalorizando gran parte 
de nuestro trabajo y, sobre todo, nuestros conocimientos.

Y ahora, con la llegada de HTML5, las cosas se han complicado aún más. 
*¿Qué es?* *¿Por qué es HTML en lugar de XHTML?* *¿No se consideraba perjudicial 
la sopa de etiquetas HTML?*

Así que demos un paso atrás y veamos cómo llegamos a donde estamos ahora y por 
qué.


En los años 90, existía el HTML...
----------------------------------

...y HTML era un estándar (o más correctamente, una *recomendación*) mantenido 
por el *Consorcio World Wide Web* (también conocido como W3C). A partir de un 
lenguaje llamado SGML, HTML definió un lenguaje de marcado basado en etiquetas 
para escribir documentos de hipertexto enriquecidos, altamente acoplado al 
protocolo utilizado para servirlos y sus recursos relacionados a través de la 
red: el *Protocolo de Transferencia de Hipertexto* (HTTP).

HTTP utilizaba *encabezados* de texto para definir qué se servía a los clientes 
y cómo. Uno de ellos era extremadamente importante: el encabezado 
`Content-Type`. Este encabezado explicaba a los navegadores el tipo de contenido 
que se les servía en un lenguaje llamado *MIME (Extensiones Multipropósito de 
Correo de Internet)*. El tipo MIME utilizado para servir documentos HTML era 
`text/html`:

```html
    Content-Type: text/html
```

HTML también definió una forma de comprobar si un documento era *válido*. Ser 
válido significaba básicamente que el documento se había escrito según las 
reglas HTML que dictaban qué atributos podía tener una etiqueta, dónde podía 
aparecer en el documento, etc.

Estas reglas de validez se especificaron mediante un lenguaje para definir la 
estructura de los documentos SGML llamado *Definición de Tipo de Documento* o 
DTD. Se creó una DTD estándar para cada versión de HTML, y los documentos HTML 
debían declarar la DTD (y, por lo tanto, la versión de HTML) a la que se 
ajustaban mediante una cláusula que debía aparecer en su primera línea: la 
*Declaración de Tipo de Documento* o cláusula `DOCTYPE`:

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```


El modelo de objetos de documento y la sopa de etiquetas
--------------------------------------------------------

HTML se diseñó para mostrar documentos en navegadores, y a finales de los 90, 
estos navegadores eran desarrollados por empresas que competían ferozmente y que 
buscaban ofrecer el máximo número de funciones interesantes a sus usuarios. Dado 
que HTML solo definía reglas para el formato de documentos, muchas otras 
funciones quedaron a la imaginación de los desarrolladores de navegadores.

Una de las ideas más interesantes que surgieron en los navegadores fue la 
*interactividad del lado del cliente*. Esta interactividad se logró ejecutando 
*scripts*, en lenguajes como JavaScript, dentro del propio navegador, y dándoles 
la capacidad de manejar, modificar e incluso ejecutar eventos en partes del 
documento mostrado. Para ello, los navegadores tuvieron que modelar los 
documentos HTML como árboles de objetos en memoria, cada uno con su estado y 
eventos, y así nació el *Modelo de Objetos del Documento* (DOM).

El problema residía en que las reglas HTML para la correcta formación eran 
bastante laxas, mientras que los árboles DOM eran estructuras estrictamente 
jerárquicas. Esto implicaba que las diferentes interpretaciones de las 
posiciones y secuencias de las etiquetas HTML podían generar distintos árboles 
de objetos DOM en distintos navegadores. Si a esto le sumamos que estos 
distintos navegadores modelaban la API de los nodos DOM de distintas maneras 
(con distintos nombres, eventos, etc.), empezaremos a hacernos una idea de lo 
difícil que era crear interactividad entre navegadores en aquel entonces.

Es más: mientras todo esto sucedía, los navegadores se habían vuelto bastante 
indulgentes con los autores de HTML, permitiéndoles escribir documentos HTML mal 
formados (*sopa de etiquetas*) corrigiendo automáticamente sus errores. Esto 
llevó a los autores de HTML a crear documentos aún peor formados, y luego a los 
navegadores a permitir aún más errores de formato, lo que contribuyó a un ciclo 
bastante destructivo. Y adivina qué: cada navegador corregía todos estos errores 
de forma diferente. ¡Genial!

El W3C finalmente estandarizó la API DOM y un lenguaje para scripting en 
navegadores web: JavaScript (aunque por razones complejas insistieron en 
llamarlo ECMAScript). Sin embargo, el daño causado por el mundo de las sopas 
de etiquetas, sumado a la lenta adopción total de estos estándares por parte de 
los desarrolladores de navegadores —en muchos casos por temor a que perjudicaran 
la compatibilidad con versiones anteriores—, tuvo consecuencias que aún influyen 
en la forma en que creamos aplicaciones web hoy en día.


Introducción de XML
-------------------

Algún tiempo después de que HTML se convirtiera en un lenguaje ampliamente 
difundido, el W3C desarrolló una nueva especificación llamada XML 
(*eXtensible Markup Language*), destinada a la representación de datos de 
propósito general (no sólo web) en forma de texto marcado jerárquico.

XML era extensible, ya que permitía la definición de lenguajes específicos 
(etiquetas y sus atributos) para adaptarse a las necesidades de escenarios 
específicos. Sin embargo, los documentos HTML no estaban bien estructurados 
desde la perspectiva XML; de hecho, XML y HTML seguían siendo lenguajes 
incompatibles. No era posible expresar HTML como una *aplicación* XML.

Al ser estrictamente jerárquicos y eliminar las ambigüedades estructurales 
del HTML, los documentos XML se traducían más directamente a árboles DOM 
estandarizados (un proceso conocido como *Análisis de XML*). Además, dado 
que XML era un lenguaje basado en texto y que el texto es un formato 
independiente de la tecnología (a diferencia del binario), XML se volvió 
especialmente adecuado para el intercambio de datos entre plataformas a 
través de internet. De hecho, condujo al nacimiento de las ahora 
omnipresentes tecnologías de *Servicios Web*.


HTML + XML = XHTML
------------------

En algún momento, impulsado por la evidente utilidad de XML y su capacidad 
para hacer que los documentos web fueran más extensibles e interoperables 
(como, por ejemplo, la producción de DOM más predecibles en distintos 
navegadores), el W3C decidió reformular HTML como un dialecto XML (o 
*aplicación*) en lugar de SGML, y así nació XHTML.

XHTML requería que los autores web escribieran sus documentos como XML bien 
formado, lo que introdujo algunas reglas de formato que no existían antes 
en HTML: las etiquetas siempre debían estar cerradas, los atributos siempre 
debían escaparse y estar entre comillas, etc.

La introducción de XHTML y la transformación de los documentos web en XML 
bien formado se percibió generalmente como un avance, ya que permitiría una 
mayor estandarización en todos los navegadores, menos margen para errores de 
autor que debían corregirse de forma específica para cada navegador, y un 
análisis y procesamiento automatizado más sencillos de las páginas web.

Como parte de esto, XHTML introdujo un concepto controvertido, derivado 
directamente de XML y conocido como *Manejo Draconiano de Errores*. Este 
concepto implicaba que cualquier intérprete de XML, incluyendo ahora un 
navegador, debería fallar inmediatamente si se detectaba cualquier error de 
formato en el documento XML procesado. En la práctica, esto implicaba que los 
autores de XHTML tendrían que crear documentos perfectamente bien formados o 
aceptar que los navegadores nunca podrían (de hecho, no se les permitiría) 
mostrarlos.

Para la validación, la especificación XHTML 1.0 definió un conjunto de DTD que 
podían usarse en cláusulas DOCTYPE: XHTML 1.0 Strict, XHTML 1.0 Transitional y 
XHTML 1.0 Frameset. El primero estaba destinado a documentos XHTML *puros* que 
no utilizaban etiquetas obsoletas de HTML; el segundo, a documentos 
transicionales que aún utilizaban etiquetas y atributos obsoletos; y el 
tercero, a páginas con conjuntos de marcos. 

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

Pero uno de los aspectos más importantes de XHTML fue que también introdujo un 
nuevo tipo MIME, el que todos los servidores web debían usar para servir XHTML, 
de modo que los navegadores supieran que debían usar su analizador y motor 
XHTML en lugar de sus equivalentes HTML. Este era `application/xhtml+xml`:


```html
    Content-Type: application/xhtml+xml
```


Cayendo ante la realidad (de XHTML)
-----------------------------------

Justo después de su introducción, todo pintaba bien para XHTML. Los 
desarrolladores solo teníamos que esperar a que los navegadores lo 
implementaran por completo y el mundo del desarrollo web se vería mucho más 
feliz...

El problema es que eso nunca ocurrió.

Lo que ocurrió fue que un navegador en particular simplemente denegó la 
compatibilidad con el tipo de contenido `application/xhtml+xml`. Adivina 
cuál. Sí, exactamente ese: Internet Explorer.

Las versiones de IE anteriores a la 11 mostraban un cuadro de diálogo de 
descarga al intentar acceder a un documento con el tipo de contenido propio 
de XHTML, lo que, por supuesto, significaba que no se podía usar ese tipo de 
contenido si se quería mostrar el sitio web a los usuarios de IE. Para cuando 
esto se corrigió, ya era demasiado tarde.

Por suerte, o quizás por desgracia, la especificación XHTML 1.0 incluía un 
apéndice que indicaba que el contenido XHTML 1.0 también podía mostrarse con 
el antiguo tipo de contenido `text/html` de la época de HTML, para facilitar 
la transición. Y eso es exactamente lo que la mayoría de nosotros hemos estado 
haciendo en los últimos años: crear contenido XHTML 1.0 y luego servirlo como 
`text/html`. Dado que la especificación XHTML 1.0 se publicó en el año 2000, 
la *transición* ha sido larga.

Pero lo cierto es que al servir contenido como HTML en lugar de XHTML, los 
navegadores utilizan sus motores HTML, y no los específicos para XHTML. Y 
aunque sus motores HTML son compatibles con XHTML, aún deben ofrecer 
compatibilidad con versiones anteriores del código HTML 4 antiguo, lo que los 
convierte en programas muy complejos. Y, lo que es más importante, carecen de 
algunas de las características más propias de XML de XHTML, empezando por... 
la gestión de errores drástica.

Y si no tienes un Manejo de Errores Draconiano, tienes un motor indulgente que 
te permitirá mostrar documentos con formato incorrecto, corrigiendo 
automáticamente los errores. Y si sabes que el navegador corregirá tus errores 
(de forma específica para cada navegador), probablemente nunca corregirás tus 
documentos... y así la historia de terror del HTML continúa.

Sabiendo esto, piensa que probablemente nunca has creado un sitio web 
verdaderamente XHTML. Lo que has hecho es mostrar documentos XHTML 
(probablemente mal formados) como HTML simple. ¿Qué te parece?

Pero la cosa empeoró, porque en 2002, «XHTML 1.1» eliminó la posibilidad de usar 
el tipo de contenido HTML, permitiendo solo «application/xhtml+xml». El problema 
fue que, en lugar de obligar a Internet Explorer a admitir 
`application/xhtml+xml`, lo cual no ocurrió, esta restricción simplemente 
convirtió a XHTML 1.1 en una criatura tan mitológica como Nessie. Casi nadie lo 
usó.

En 2009, el W3C permitió de nuevo el uso de `text/html` con XHTML 1.1, pero, una 
vez más, ya era demasiado tarde.


Hacia HTML5: Una historia de divorcio
-------------------------------------

En algún momento (concretamente en 2004), algunos desarrolladores de navegadores 
se dieron cuenta de que las especificaciones XHTML existentes evolucionaban con 
demasiada lentitud para satisfacer las crecientes demandas de la web (vídeo, 
audio, interfaces de aplicaciones más completas, etc.), y que el W3C los 
impulsaba cada vez más a crear interpretaciones más estrictas de los documentos 
que podrían acabar inutilizando grandes cantidades de código existente (mal 
formado).

Querían mejorar las aplicaciones web con funciones como vídeo, audio, 
almacenamiento local o procesamiento avanzado de formularios, y de hecho podían 
hacerlo simplemente añadiendo esas funciones de forma específica para cada 
navegador, pero no querían volver a caer en la falta de interoperabilidad. 
Necesitaban que los estándares evolucionaran e incluyeran estas nuevas 
funciones.

Sin embargo, existía un problema con la evolución de los estándares existentes 
en aquel momento (en concreto, XHTML): aún existían muchísimos sitios web y 
aplicaciones que dependían del HTML heredado, y si esas nuevas y atractivas 
funciones se estandarizaban siguiendo el estricto método XHTML, todas esas 
aplicaciones nunca podrían usarlas a menos que se reescribieran por completo. 
Todos querían una web más interoperable y estándar, pero no a costa de 
desperdiciar muchos años de trabajo de millones de autores web.

Así que estos creadores (junto con otras personas) presentaron al W3C la idea de 
evolucionar el HTML de forma que todo (o la mayor parte) del código HTML y XHTML 
existente siguiera siendo válido como *nuevo HTML*, a la vez que proporcionaba 
nuevas y potentes funciones para las aplicaciones web y, lo que es más 
importante, definía claramente cómo debía gestionarse el error.

Este último punto significaba que, en lugar de fallar con el primer error, los 
navegadores sabrían *por especificación* cómo realizar la corrección automática 
de errores creados por los autores web y, por lo tanto, reaccionarían a ellos 
exactamente de la misma manera, convirtiendo el código HTML (ya fuera en formato 
XML o no) en totalmente compatible con todos los navegadores. Se seguiría 
recomendando crear código en formato XML para sitios nuevos, pero si no te 
apetecía o aún tenías mucho HTML antiguo (y sin duda lo tenías), estarías 
invitado a unirte a la fiesta. ¿Ves ese viejo sitio HTML? ¡Agreguémosle un 
vídeo! Todo sonaba bastante sensato.

Pero lo cierto es que nada de esto le sonaba tan bien al W3C en 2004, y 
rechazaron la propuesta y decidieron seguir estrictamente el camino XHTML. HTML 
estaba muerto para ellos, no había razón para resucitarlo, y «XHTML 2.0» era el 
futuro.

Esto llevó al divorcio. Los promotores de este nuevo concepto de HTML, un grupo 
que incluía a personas de Opera Software, la Fundación Mozilla y Apple, 
abandonaron el W3C y fundaron el *Web Hypertext Application Technology Working 
Group (WHATWG)* con el objetivo de definir lo que hoy conocemos como HTML5.

Finalmente, en 2007, el W3C creó un grupo de trabajo para HTML de nueva 
generación, que posteriormente aceptó colaborar con WHATWG, adoptando HTML5 como 
su especificación de trabajo y futuro producto.

El W3C y WHATWG se unieron para crear HTML5, y en 2009 el W3C simplemente 
abandonó XHTML 2.0 al cerrar el grupo que trabajaba en su especificación.

HTML5 se convirtió en el *único* futuro de los estándares web.

Entonces, ¿qué es HTML5?
------------------------

HTML5 es un conjunto de estándares, aún en desarrollo en 2011, que evoluciona a 
partir de las especificaciones actuales de HTML 4 y XHTML y tiene como objetivo:

- Añadir nuevas capacidades avanzadas a HTML que alejan el desarrollo web de la 
filosofía orientada a documentos y lo acercan a una más orientada a 
aplicaciones. Estas capacidades se denominan *características HTML5* y, en 
algunos casos, están definidas por estándares independientes, aparte del 
estándar principal de HTML5. Las características de HTML5 incluyen, entre otras: 
vídeo, audio, lienzo de dibujo, geolocalización, almacenamiento local, 
compatibilidad sin conexión y funciones avanzadas relacionadas con formularios.
- Ofrecer una ruta sencilla para la migración desde HTML y XHTML, lo que permite 
la adopción de HTML5 con poca o ninguna reescritura de código.
- Proporcionar una forma estándar de gestionar errores de código, de modo que el 
código HTML5 mal formado funcione de forma predecible en todos los navegadores.

Desde un punto de vista práctico, esto significa que (probablemente todo) su 
código HTML y XHTML actual se considerará HTML5 válido con solo cambiar su 
`DOCTYPE` al de HTML5:

```html
<!DOCTYPE html>
```

Y al servir su contenido con el tipo de contenido `text/html`:

```html
    Content-Type: text/html
```
Y aquí podrías estar pensando: ¿por qué ese `DOCTYPE` no especifica ninguna DTD? 
Porque no la hay. HTML5 no tiene DTD porque las reglas que definen si un 
documento es HTML5 válido o no se definen como texto legible en la propia 
especificación, pero no se pueden expresar en el lenguaje DTD.

Pero esto no significa que un analizador o motor de HTML5 no pueda validar. Sí 
puede. Simplemente debe ser un software especialmente dedicado al análisis de 
HTML5, que incluya código específico programado para ejecutar las reglas 
involucradas en la validación de HTML5 (en lugar de leer esas reglas desde un 
archivo DTD). Aunque la especificación ahora sea bastante flexible, sigue siendo 
una especificación, y hay que cumplirla.

Pero si no hay DTD, ¿por qué tener una cláusula DOCTYPE? Porque se necesita una 
cláusula DOCTYPE para que los navegadores muestren los documentos en 
*Modo Estándar* (en lugar de *Modo Peculiar*). La cláusula `<!DOCTYPE html>` es 
la declaración DOCTYPE mínima válida posible, y eso es exactamente lo que 
necesitamos. Simplemente actúa como un interruptor.


¿Ya puedo usar HTML5?
---------------------

En general, sí. Si bien (a fecha de 2016) ningún navegador implementa 
completamente todas las funciones de HTML5, la mayoría de los más comunes sí 
implementan gran parte de ellas. Por lo tanto, mientras sus usuarios no se vean 
obligados a usar versiones muy antiguas del (ahora obsoleto) Internet Explorer, 
debería funcionar correctamente en la mayoría de los casos.

Además, tenga en cuenta que la compatibilidad de los navegadores evoluciona con 
el tiempo, no solo debido al rápido ritmo con el que los navegadores lanzan 
nuevas versiones, sino también porque la especificación en sí aún está en 
desarrollo.

Para obtener una lista de las características de HTML5 y la compatibilidad con 
los navegadores correspondientes, consulte el sitio web 
[¿Puedo usar...?](http://caniuse.com/). En particular, la lista de categorías de 
HTML5 para todas las características: 
[http://caniuse.com/#cats=HTML5](http://caniuse.com/#cats=HTML5)


¿Y qué hay de XHTML5? ¿Existe?
---------------------------------------

En teoría, sí. XHTML5 es simplemente HTML5 servido con:

```html
    Content-Type: application/xhtml+xml
```

Pero tenga en cuenta que IE no era compatible con esto hasta la versión 11 
(Microsoft Edge sí lo es). Por lo tanto, considere las capacidades del navegador 
de sus usuarios.

Además, tenga en cuenta que la diferencia entre HTML5 y XHTML5 radica en el tipo 
de contenido y *solo* en el tipo de contenido, ya que un documento HTML5 con 
formato XML correcto es, de hecho, un documento HTML5 perfectamente válido. Esto 
es muy diferente a la relación entre HTML4 y XHTML 1.0/1.1, que eran lenguajes 
incompatibles.