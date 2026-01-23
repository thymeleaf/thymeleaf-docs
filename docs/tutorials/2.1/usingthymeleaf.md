---
title: 'Tutorial: Usando Thymeleaf'
author: Thymeleaf
version: @documentVersion@
thymeleafVersion: @projectVersion@
---


1\. Presentando Thymeleaf
=========================

1.1 ¿Qué es Thymeleaf?
----------------------

Thymeleaf es una biblioteca Java. Es un motor de plantillas XML/XHTML/HTML5 
capaz de aplicar un conjunto de transformaciones a los archivos de plantilla 
para mostrar los datos o el texto generados por sus aplicaciones.

Es más adecuado para servir XHTML/HTML5 en aplicaciones web, pero puede procesar 
cualquier archivo XML, ya sea en aplicaciones web o independientes.

El objetivo principal de Thymeleaf es proporcionar una forma elegante y bien 
organiz estructurada de crear plantillas. Para lograrlo, se basa en etiquetas y 
atributos XML que definen la ejecución de la lógica predefinida en el DOM  
(Modelo de Objetos del Documento), en lugar de escribir explícitamente dicha 
lógica como código dentro de la plantilla.

Su arquitectura permite un procesamiento rápido de plantillas, basándose en el 
almacenamiento en caché inteligente de los archivos analizados para minimizar 
las operaciones de E/S durante la ejecución.

Y por último, pero no menos importante, Thymeleaf se diseñó desde el principio 
para tener en cuenta los estándares XML y web, lo que permite crear plantillas 
con validación completa si es necesario.



1.2 ¿Qué clase de plantillas puede procesar Thymeleaf?
------------------------------------------------------

De fábrica, Thymeleaf le permite procesar seis tipos de plantillas, cada una de las cuales se denomina Modo de
plantilla:

* XML
* XML válido
* XHTML
* XHTML válido
* HTML5
* HTML5 heredado

Todos estos modos se refieren a archivos XML bien formados, excepto el modo _HTML5 heredado_, que permite procesar
archivos HTML5 con características como etiquetas independientes (no cerradas), atributos de etiqueta sin valor o sin
comillas. Para procesar archivos en este modo específico, Thymeleaf primero realiza una transformación que convierte los
archivos en archivos XML bien formados, que siguen siendo HTML5 perfectamente válidos (y, de hecho, son la forma
recomendada de crear código HTML5). Dado que XHTML5 es simplemente HTML5 en formato XML, servido con el tipo de
contenido application/xhtml+xml, también podríamos decir que Thymeleaf es compatible con XHTML5.

Tenga en cuenta también que la validación solo está disponible para plantillas XML y XHTML.

Sin embargo, estos no son los únicos tipos de plantilla que Thymeleaf puede procesar, y el usuario siempre puede definir
su propio modo especificando tanto la forma de analizar las plantillas en este modo como la de escribir los resultados.
De esta forma, cualquier elemento que pueda modelarse como un árbol DOM (ya sea XML o no) podrá ser procesado
eficazmente como plantilla por Thymeleaf.



1.3 Dialectos: El dialecto estándar
-----------------------------------

Thymeleaf es un motor de plantillas extremadamente extensible (de hecho, debería llamarse mejor _framework de motor de
plantillas_) que le permite definir completamente los nodos DOM que se procesarán en sus plantillas y también cómo se
procesarán.

Un objeto que aplica alguna lógica a un nodo DOM se llama _procesador_, y un conjunto de estos procesadores ---más
algunos artefactos extra--- se llama dialecto, de los cuales la biblioteca principal de Thymeleaf proporciona uno listo
para usar llamado _Dialecto estándar_, que debería ser suficiente para las necesidades de un gran porcentaje de 
usuarios.

_El dialecto estándar es el que se describe en este tutorial_. Todos los atributos y características sintácticas que
aprenderá en las siguientes páginas están definidos por este dialecto, incluso si no se menciona explícitamente.

Por supuesto, los usuarios pueden crear sus propios dialectos (incluso ampliando el Estándar) si desean definir su
propia lógica de procesamiento y aprovechar las funciones avanzadas de la biblioteca. Un motor de plantillas permite 
configurar varios dialectos a la vez.

> Los paquetes de integración oficiales thymeleaf-spring3 y thymeleaf-spring4 definen un dialecto llamado 
> "SpringStandard Dialect", prácticamente equivalente al Dialecto Estándar, pero con pequeñas adaptaciones para 
> optimizar algunas características de Spring Framework (por ejemplo, usando el lenguaje de expresiones Spring en lugar 
> del OGNL estándar de Thymeleaf). Así que, si usas Spring MVC, no estás perdiendo el tiempo, ya que casi todo lo que 
> aprendas aquí te será útil en tus aplicaciones Spring.

El Dialecto Estándar de Thymeleaf puede procesar plantillas en cualquier modo, pero es especialmente adecuado para los
modos de plantilla orientados a la web (XHTML y HTML5). Además de HTML5, admite y valida específicamente las siguientes
especificaciones XHTML: _XHTML 1.0 Transitional_, _XHTML 1.0 Strict_, _XHTML 1.0 Frameset_ y _XHTML 1.1_.

La mayoría de los procesadores del Dialecto Estándar son _procesadores de atributos_. Esto permite a los navegadores
mostrar correctamente los archivos de plantilla XHTML/HTML5 incluso antes de procesarlos, ya que ignoran los atributos
adicionales. Por ejemplo, una JSP que utiliza bibliotecas de etiquetas podría incluir un fragmento de código que un 
navegador no puede mostrar directamente, como:

```html

<form:inputText name="userName" value="${user.name}"/>
```

...el Dialecto Estándar de Thymeleaf nos permitiría lograr la misma funcionalidad con:

```html
<input type="text" name="userName" value="James Carrot" th:value="${user.name}"/>
```

Que no sólo se mostrará correctamente en los navegadores, sino que también nos permitirá (opcionalmente) especificar en
él un atributo de valor ("James Carrot", en este caso) que se mostrará cuando el prototipo se abra estáticamente en un
navegador, y que será sustituido por el valor resultante de la evaluación de `${user.name}` durante el procesamiento de 
Thymeleaf de la plantilla.

Si es necesario, esto permitirá que el diseñador y el desarrollador trabajen en el mismo archivo de plantilla y reducirá
el esfuerzo necesario para transformar un prototipo estático en un archivo de plantilla funcional. Esta capacidad se 
conoce comúnmente como _Plantillas Naturales_.



1.4 Arquitectura general
------------------------

El núcleo de Thymeleaf es un motor de procesado del DOM. Específicamente, usa su propia implementación de alto
rendimiento del DOM --- no es la IPA estándar del DOM--- para la construcción de representaciones en árbol en memoria de 
sus plantillas, sobre las cuales opera más tarde recorriendo sus nodos y ejecutando procesadores en ellos que modifican 
el DOM de acuerdo a la _configuración_ actual y el conjunto de datos que se le pasa a la plantilla para su 
representación ---conocidos como el contexto.

El uso de una representación de plantilla DOM hace que se ajuste muy bien a las aplicaciones web porque los documentos
web son representados muy a menudo como árboles de objetos (en realida los árboles DOM son la forma en la que los 
navegadores representan las páginas web en memoria). Además, construir sobre la idea de que la mayoría de las 
aplicaciones web usan solo unas pocas docenas de plantillas, que estas no son archivos grandes y que no cambian 
normalmente mientras se ejecuta la aplicación, el uso de Thymeleaf de una caché en memoria de de árboles DOM de 
plantillas le permite ser rápido en entornos de producción, porque se necesita muy poca E/S (si existe alguna) para la 
mayoría de las operaciones de procesado de plantilla.

> Si quiere más detalles, más tarde en este tutorial hay un capítulo entero dedicado al tamponado (caching) y a la forma
> en que Thymeleaf optimiza la memoria y el uso de recursos para unas operaciones más rápidas.

Sin embargo, hay una restricción: esta arquitectura también requiere el uso de grandes cantidades de espacio de memoria
para cada ejecución de plantilla que otras aproximaciones de análisis/procesado de plantillas, lo que significa que no 
debería usar la librería para crear documentos XML grandes de datos (en oposición a los documentos web). Como regla 
general (y siempre dependiendo del tamaño de memoria de su MVJ), si está generando archivos XML con tamaños alrededor de 
las decenas de megabytes en una única ejecución de plantilla, probablemente no debería estar usando Thymeleaf.

> La razón por la que consideramos esta restricción solo aplica a los archivos de datos XML y no a la web con
> XHTML/HTML5 es que no debería nunca generar documentos web tan grandes que los navegadores de sus usuarios se bloqueen 
> y/o exploten -- ¡recuerde que estos navegadores también tendrán que crear los árboles DOM de sus páginas!


1.5 Antes de continuar, deberías leer...
----------------------------------------

Thymeleaf es especialmente adecuado para trabajar con aplicaciones web. Estas aplicaciones se basan en una serie de
estándares que todos deberían conocer muy bien, pero pocos lo hacen, incluso si llevan años trabajando con ellos.

Con la llegada de HTML5, el estado del arte de los estándares web es más confuso que nunca... ¿Volveremos de XHTML a
HTML? ¿Abandonaremos la sintaxis XML? ¿Por qué ya nadie habla de XHTML 2.0?

Antes de continuar con este tutorial, le recomendamos leer el artículo "De HTML a HTML (vía HTML)" en el sitio web de
Thymeleaf, disponible en:
[http://www.thymeleaf.org/doc/articles/fromhtmltohtmlviahtml.html](http://www.thymeleaf.org/doc/articles/fromhtmltohtmlviahtml.html)



2\. La tienda de comestibles virtual Good Thymes
==============================================

El código fuente de los ejemplos que se muestran en este y futuros capítulos de esta guía se puede encontrar en el
[repositorio de GitHub de Good Thymes Virtual Grocery](https://github.com/thymeleaf/thymeleafexamples-gtvg).


2.1 Un sitio web para una tienda de comestibles
-----------------------------------------------

Para explicar mejor los conceptos involucrados en el procesamiento de plantillas con Thymeleaf, este tutorial utilizará
una aplicación de demostración que puede descargar del sitio web del proyecto.

Esta aplicación representa el sitio web de una tienda de comestibles virtual imaginaria, y nos proporcionará los
escenarios adecuados para ejemplificar diversas características de Thymeleaf.

Necesitaremos un conjunto bastante simple de entidades modelo para nuestra aplicación: «Productos», que se venden a
«Clientes» mediante la creación de «Pedidos». También gestionaremos los «Comentarios» sobre estos «Productos».

![Modelo de aplicación de ejemplo](images/usingthymeleaf/gtvg-model.png)

Nuestra pequeña aplicación también tendrá una capa de servicio muy simple, compuesta por objetos `Servicio` que
contienen métodos como:

```java
public class ProductService {

    ...

    public List<Product> findAll() {
        return ProductRepository.getInstance().findAll();
    }

    public Product findById(Integer id) {
        return ProductRepository.getInstance().findById(id);
    }

}
```

Finalmente, en la capa web nuestra aplicación tendrá un filtro que delegará la ejecución a comandos habilitados para
Thymeleaf dependiendo de la URL de la solicitud:

```java
private boolean process(HttpServletRequest request, HttpServletResponse response)
        throws ServletException {

    try {

        /*
         * Consultar la asignación de controlador/URL y obtener el controlador
         * que procesará la solicitud. Si no hay ningún controlador disponible,
         * devolver falso y permitir que otros filtros/servlets procesen la
         * solicitud.
         */
        IGTVGController controller = GTVGApplication.resolveControllerForRequest(request);
        if (controller == null) {
            return false;
        }
        /*
         * Obtener la instancia de TemplateEngine.
         */
        TemplateEngine templateEngine = GTVGApplication.getTemplateEngine();

        /*
         * Escribe los encabezados de respuesta
         */
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);

        /*
         * Ejecutar el controlador y la plantilla de vista de proceso,
         * escribir los resultados en el generador de respuestas.
         */
        controller.process(
                request, response, this.servletContext, templateEngine);

        return true;

    } catch (Exception e) {
        throw new ServletException(e);
    }

}    
```

Este es nuestro interfaz `IGTVGController`:

```java
public interface IGTVGController {

    public void process(
            HttpServletRequest request, HttpServletResponse response,
            ServletContext servletContext, TemplateEngine templateEngine);

}
```

Todo lo que tenemos que hacer ahora es crear implementaciones de la interfaz `IGTVGController`, recuperar datos de los
servicios y procesar plantillas utilizando el objeto `TemplateEngine`.

Al final se verá así:

![Ejemplo de página de inicio de la aplicación](images/usingthymeleaf/gtvg-view.png)

Pero primero veamos cómo se inicializa ese motor de plantillas.



2.2 Creación y configuración del Motor de Plantillas
----------------------------------------------------

El método _process(...)_ en nuestro filtro contenía esta sentencia:

```java
TemplateEngine templateEngine = GTVGApplication.getTemplateEngine();
```

Lo que significa que la clase _GTVGApplication_ está a cargo de crear y configurar uno de los objetos más importantes en
una aplicación habilitada para Thymeleaf: la instancia `TemplateEngine`.

Nuestro objeto `org.thymeleaf.TemplateEngine` se inicializa de la siguiente manera:

```java
public class GTVGApplication {
  
    
    ...
    private static TemplateEngine templateEngine;
    ...


    static {
        ...
        initializeTemplateEngine();
        ...
    }


    private static void initializeTemplateEngine() {

        ServletContextTemplateResolver templateResolver =
                new ServletContextTemplateResolver();
        // XHTML es el modo predeterminado, pero lo configuramos de todos modos 
        // para una mejor comprensión del código.
        templateResolver.setTemplateMode("XHTML");
        // Esto convertirá "home" a "/WEB-INF/templates/home.html"
        templateResolver.setPrefix("/WEB-INF/templates/");
        templateResolver.setSuffix(".html");
        // Tiempo de vida de la caché de plantillas: 1 h. Si no se configura, 
        // las entradas se almacenarán en caché hasta que LRU las expulse.
        templateResolver.setCacheTTLMs(3600000L);

        templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);

    }
    
    ...

}
```

Por supuesto, hay muchas formas de configurar un objeto `TemplateEngine`, pero por ahora estas pocas líneas de código
nos enseñarán lo suficiente sobre los pasos necesarios.

### El Solucionador de Plantillas (Template Resolver)

Comencemos con el solucionador de plantillas (Template Resolver):

```java
ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver();
```

Los solucionadores de plantillas son objetos que implementan una interfaz de la API de Thymeleaf llamada
`org.thymeleaf.templateresolver.ITemplateResolver`:

```java
public interface ITemplateResolver {

    ...

    /*
     * Las plantillas se resuelven por el nombre de la cadena (templateProcessingParameters.getTemplateName())
     * Devolverá un valor nulo si este solucionador de plantillas no puede procesar la plantilla.
     */
    public TemplateResolution resolveTemplate(
            TemplateProcessingParameters templateProcessingParameters);

}
```

Estos objetos se encargan de determinar cómo se accederá a nuestras plantillas y, en esta aplicación GTVG, la
implementación `org.thymeleaf.templateresolver.ServletContextTemplateResolver` que estamos usando especifica que vamos 
a recuperar nuestros archivos de plantilla como recursos del _Servlet Context_: un objeto `javax.servlet.ServletContext` 
de toda la aplicación que existe en todas las aplicaciones web Java y que resuelve recursos considerando la raíz de la 
aplicación web como la raíz de las rutas de recursos.

Pero eso no es todo lo que podemos decir sobre el solucionador de plantillas, ya que podemos configurarlo. Primero, el
modo de plantilla, uno de los estándar:

```java
templateResolver.setTemplateMode("XHTML");
```

XHTML es el modo de plantilla predeterminado para `ServletContextTemplateResolver`, pero es una buena práctica
establecerlo de todos modos para que nuestro código documente claramente lo que está sucediendo.

```java
templateResolver.setPrefix("/WEB-INF/templates/");
templateResolver.

setSuffix(".html");
```

Estos _prefix_ y _suffix_ hacen exactamente lo que parecen: modifican los nombres de las plantillas que pasaremos al
motor para obtener los nombres de los recursos reales que se utilizarán.

Usando esta configuración, el nombre de la plantilla _"product/list"_ correspondería a:

```java
servletContext.getResourceAsStream("/WEB-INF/templates/product/list.html")
```

De manera opcional, la cantidad de tiempo que una plantilla analizada que se encuentra en caché se considerará válida se
puede configurar en el solucionador de plantillas mediante la propiedad _cacheTTLMs_:

```java
templateResolver.setCacheTTLMs(3600000L);
```

Por supuesto, una plantilla puede ser expulsada de la memoria caché antes de que se alcance ese TTL si se alcanza el
tamaño máximo de memoria caché y es la entrada más antigua almacenada en caché actualmente.

> El usuario puede definir el comportamiento y el tamaño del caché implementando la interfaz `ICacheManager` o
> simplemente modificando el objeto `StandardCacheManager` configurado para administrar los cachés de forma 
> predeterminada.

Aprenderemos más sobre los solucionadores de plantillas más adelante. Ahora veamos la creación de nuestro objeto Motor
de Plantillas.

### El Motor de Plantillas (Template Engine)

Los objetos de Template Engine son de la clase _org.thymeleaf.TemplateEngine_, y estas son las líneas que crearon
nuestro motor en el ejemplo actual:

```java
templateEngine =new

TemplateEngine();
templateEngine.

setTemplateResolver(templateResolver);
```

Bastante sencillo, ¿verdad? Solo necesitamos crear una instancia y configurarla como solucionador de plantillas.

Un solucionador de plantillas es el único parámetro obligatorio que necesita un `TemplateEngine`, aunque, por supuesto,
hay muchos otros que se abordarán más adelante (solucionadores de mensajes, tamaño de caché, etc.). Por ahora, esto es 
todo lo que necesitamos.

Nuestro motor de plantillas ya está listo y podemos comenzar a crear nuestras páginas usando Thymeleaf.


3\. Uso de textos
=================

3.1 Una bienvenida en varios idiomas
------------------------------------

Nuestra primera tarea será crear una página de inicio para nuestro sitio de comestibles.

La primera versión que escribiremos de esta página será extremadamente sencilla: solo un título y un mensaje de
bienvenida. Este es nuestro archivo `/WEB-INF/templates/home.html`:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

<head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" media="all"
          href="../../css/gtvg.css" th:href="@{/css/gtvg.css}"/>
</head>

<body>

<p th:text="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>

</body>

</html>
```

Lo primero que notará es que este archivo es XHTML y cualquier navegador puede mostrarlo correctamente, ya que no
incluye etiquetas que no sean XHTML (y los navegadores ignoran todos los atributos que no comprenden, como `th:text`). 
Además, los navegadores lo mostrarán en modo estándar (no en modo peculiar), ya que tiene una declaración `DOCTYPE` bien 
formada.

Además, esto también es XHTML _válido_ ^[Tenga en cuenta que, aunque esta plantilla es XHTML válido, anteriormente 
seleccionamos el modo de plantilla "XHTML" y no "VALIDXHTML". Por ahora, podemos desactivar la validación, pero no 
queremos que nuestro IDE genere demasiados problemas.], ya que hemos especificado una DTD de Thymeleaf que define 
atributos como `th:text` para que sus plantillas se consideren válidas. Además, una vez procesada la plantilla (y 
eliminados todos los atributos `th:*`), Thymeleaf sustituirá automáticamente esa declaración de DTD en la cláusula 
`DOCTYPE` por una declaración estándar `XHTML 1.0 Strict` ( dejaremos estas funciones de traducción de DTD para un 
capítulo posterior).

También se declara un espacio de nombres thymeleaf para los atributos `th:*`:

```html

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
```

Tenga en cuenta que, si no nos hubiéramos preocupado en absoluto por la validez o la correcta formación de nuestra
plantilla, podríamos haber especificado simplemente un `XHTML 1.0 Strict DOCTYPE` estándar, sin declaraciones de 
espacios de nombres xmlns:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>

<head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" media="all"
          href="../../css/gtvg.css" th:href="@{/css/gtvg.css}"/>
</head>

<body>

<p th:text="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>

</body>

</html>
```

...y esto aún sería perfectamente procesable por Thymeleaf en el modo XHTML (aunque probablemente nuestro IDE nos haría
la vida imposible mostrando advertencias por todas partes).

Pero ya basta de validación. Ahora, la parte realmente interesante de la plantilla: veamos qué hace el atributo
`th:text`.

### Usando th:text y externalizando texto

Externalizar texto consiste en extraer fragmentos de código de plantilla de los archivos de plantilla para guardarlos en
archivos separados específicos (normalmente archivos `.properties`) y poder sustituirlos fácilmente por textos 
equivalentes escritos en otros idiomas (un proceso denominado internacionalización o simplemente _i18n_). Los fragmentos 
de texto externalizados suelen denominarse "mensajes".

Los mensajes tiene siempre una clave que los identifica, y Thymeleaf le permite especificar que un texto debe
corresponder a un mensaje expecífico con la sintaxis `#{...}`:

```html
<p th:text="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
```

Lo que podemos ver aquí son, de hecho, dos características diferentes del Dialecto Estándar de Thymeleaf:

* El atributo `th:text`, el cual evalúa su expresión de valor y establece el resultado de esta evaluación como el cuerpo
  de la etiqueta en la que se encuentra, substituyendo así el texto "¡Bienvenido a nuestra tienda de comestibles!" que 
  vemos en el código.
* La expresión `#{home.welcome}`, especificada en la _Sintaxis de Expresión Estándar_, que especifica que el texto que
  utilizará el atributo `th:text` debe ser el mensaje con la clave `home.welcome` correspondiente a la configuración 
  regiional con la que estemos procesando la plantilla.

Ahora bien, ¿dónde está este texto externalizado?

La ubicación del texto externalizado en Thymeleaf es completamente configurable, y dependerá de la implementación
específica de `org.thymeleaf.messageresolver.IMessageResolver` utilizada. Normalmente, una implementación basada en 
archivos `.properties` será la utilizada, aunque podríamos crear nuestras propias implementaciones si quisiéramos, por 
ejemplo, obtener mensajes de una base de datos.

Sin embargo, no hemos especificado un solucionador de mensajes en nuestro Motor de Plantillas durante la inicialización,
y eso significa que nuestra aplicación está usando el _Solucionador Estándar de Mensajes_, implementado por la clase
`org.thymeleaf.messageresolver.StandardMessageResolver`.

Este solucionador estándar de mensajes espera encontrar los mensajes para `/WEB-INF/templates/home.html` en archivos
.properties en la misma carpeta y con el mismo nombre que la plantilla como:

* `/WEB-INF/templates/home_en.properties` para textos en inglés.
* `/WEB-INF/templates/home_es.properties` para textos en español.
* `/WEB-INF/templates/home_pt_BR.properties` para textos en portugués (Brasil).
* `/WEB-INF/templates/home.properties` para textos predeterminados (si no se coincide con la configuración regional).

Echemos un vistazo a nuestro archivo `home_es.properties`:

```
home.welcome=¡Bienvenido a nuestra tienda de comestibles!
```

Esto es todo lo que necesitamos para hacer que Thymeleaf procese nuestra plantilla. Ahora, creemos nuestro controlador
de inicio.

### Contextos (Contexts)

Para procesar nuestra plantilla, crearemos una clase `HomeController` que implemente la interfaz `IGTVGController` que
vimos antes:

```java
public class HomeController implements IGTVGController {

    public void process(
            HttpServletRequest request, HttpServletResponse response,
            ServletContext servletContext, TemplateEngine templateEngine) {

        WebContext ctx =
                new WebContext(request, response, servletContext, request.getLocale());
        templateEngine.process("home", ctx, response.getWriter());

    }

}
```

Lo primero que vemos aquí es la creación de un contexto. Un contexto de Thymeleaf es un objeto que implementa la
interfaz `org.thymeleaf.context.IContext`. Los contextos deben contener todos los datos necesarios para la ejecución del 
motor de plantillas en un mapa de variables, así como la configuración regional que debe utilizarse para los mensajes 
externalizados.

```java
public interface IContext {

    public VariablesMap<String, Object> getVariables();

    public Locale getLocale();
    ...

}
```

Hay una extensión especializada de esta interfaz, `org.thymeleaf.context.IWebContext`:

```java
public interface IWebContext extends IContext {

    public HttpSerlvetRequest getHttpServletRequest();

    public HttpSession getHttpSession();

    public ServletContext getServletContext();

    public VariablesMap<String, String[]> getRequestParameters();

    public VariablesMap<String, Object> getRequestAttributes();

    public VariablesMap<String, Object> getSessionAttributes();

    public VariablesMap<String, Object> getApplicationAttributes();

}
```

La biblioteca principal de Thymeleaf ofrece una implementación de cada una de estas interfaces:

* `org.thymeleaf.context.Context` implementa `IContext`
* `org.thymeleaf.context.WebContext` implementa `IWebContext`

Como pueden ver en el código del controlador, usaremos `WebContext`. De hecho, es obligatorio, ya que el uso de
`ServletContextTemplateResolver` requiere un contexto que implemente `IWebContext`.

```java
WebContext ctx = new WebContext(request, servletContext, request.getLocale());
```

Solo se requieren dos de esos tres argumentos del constructor, porque se utilizará la configuración regional
predeterminada del sistema si no se especifica ninguna (aunque nunca debe permitir que esto suceda en aplicaciones 
reales).

Según la definición de la interfaz, podemos ver que `WebContext` ofrecerá métodos especializados para obtener los
parámetros de la solicitud y los atributos de la solicitud, la sesión y la aplicación. Pero, de hecho, `WebContext` hará 
algo más que eso:

* Agrega todos los atributos de la petición al mapa de variables del contexto.
* Agrega una variable de contexto llamada `param` que contiene todos los parámetros de la petición.
* Agrega una variable de contexto llamada `session` que contiene todos los atributos de la sesión.
* Agrega una variable de contexto llamada `application` que contiene todos los atributos del ServletContext.

Justo antes de la ejecución, se establece una variable especial en todos los objetos de contexto (implementaciones de
`IContext`), incluyendo `Context` y `WebContext`, llamada información de ejecución (`execInfo`).
Esta variable contiene dos datos que se pueden usar desde las plantillas:

* El nombre de la plantilla (`${execInfo.templateName}`), el nombre especificado para la ejecución del motor y
  correspondiente a la  plantilla que se está ejecutando.
* La fecha y hora actuales (`${execInfo.now}`), un objeto `Calendar` correspondiente al momento en que el motor de
  plantillas inició su ejecución para esta plantilla.

### Ejecución del motor de plantillas

Con nuestro objeto de contexto listo, solo necesitamos ejecutar el motor de plantillas, especificar el nombre de la
plantilla y el contexto, y pasar el generador de respuestas para que la respuesta se pueda escribir en él:

```java
templateEngine.process("home",ctx, response.getWriter());
```

Veamos los resultados de esto usando la configuración regional española:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>Good Thymes Virtual Grocery</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <link rel="stylesheet" type="text/css" media="all" href="/gtvg/css/gtvg.css"/>
</head>

<body>

<p>¡Bienvenido a nuestra tienda de comestibles!</p>

</body>

</html>
```

3.2 Más sobre textos y variables
-------------------------------

### Texto no escapado

La versión más sencilla de nuestra página de inicio parece estar lista ya, pero hay algo en lo que no hemos pensado...
¿qué pasaría si tuviéramos un mensaje como este?

```java
home.welcome=¡
Bienvenido a
nuestra<b> fántastica</b>
tienda de
comestibles!
```

Si ejecutamos esta plantilla como antes, obtendremos:

```html
<p>¡Bienvenido a nuestra &lt;b&gt;fantástica&lt;/b&gt; tienda de comestibles!</p>
```

Esto no es exactamente lo que esperábamos, porque nuestra etiqueta `<b>` ha sido escapada y, por lo tanto, se mostrará
en el navegador.

Este es el comportamiento predeterminado del atributo th:text. Si queremos que Thymeleaf respete nuestras etiquetas
XHTML y no las escape, tendremos que usar un atributo diferente: `th:utext` (para "texto sin escape").

```html
<p th:utext="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
Esto mostrará nuestro mensaje tal como lo queríamos:
<p>¡Bienvenidos a nuestra <b>fantástica</b> tienda de comestibles!</p>
```

### Uso y visualización de variables

Ahora, añadamos más contenido a nuestra página de inicio. Por ejemplo, podríamos mostrar la fecha debajo del mensaje de
bienvenida, así:

```
¡Bienvenidos a nuestra fantástica tienda de comestibles!

Hoy es: 12 julio 2010
```

En primer lugar, tendremos que modificar nuestro controlador para que agreguemos esa fecha como variable de contexto:

```java
public void process(
        HttpServletRequest request, HttpServletResponse response,
        ServletContext servletContext, TemplateEngine templateEngine) {

    SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
    Calendar cal = Calendar.getInstance();

    WebContext ctx =
            new WebContext(request, response, servletContext, request.getLocale());
    ctx.setVariable("today", dateFormat.format(cal.getTime()));

    templateEngine.process("home", ctx, response.getWriter());

}
```

Hemos agregado una variable today de tipo `String` a nuestro contexto, y ahora podemos visualizarla en nuestra
plantilla:

```html

<body>

<p th:utext="#{home.welcome}">¡Bienvenidos a nuestra fantástica tienda de comestibles!</p>

<p>Hoy es: <span th:text="${today}">13 febrero 2011</span></p>

</body>
```

Como pueden ver, seguimos usando el atributo `th:text` para el trabajo (correcto, ya que queremos sustituir el cuerpo de
la etiqueta), pero la sintaxis es ligeramente diferente esta vez: en lugar de un valor de expresión `#{...}`, usamos uno
`${...}`. Este valor de expresión variable contiene una expresión en un lenguaje llamado _OGNL (Lenguaje de Navegación 
de Objetos-Gráficos)_ que se ejecutará en el mapa de variables de contexto.

La expresión `${today}` simplemente significa "obtén la variable llamada today", pero estas expresiones pueden ser más
complejas (como `${user.name}` para "obtén una variable llamda user, y llama a su método `getName()`").

Existen muchas posibilidades en los valores de los atributos: mensajes, expresiones de variables... y mucho más. El
próximo capítulo nos mostrará cuáles son todas estas posibilidades.

4\. Sintaxis de expresiones estándar
====================================

Haremos una breve pausa en el desarrollo de nuestra tienda virtual de comestibles para aprender sobre una de las partes
más importantes del dialecto estándar de Thymeleaf: la sintaxis de las expresiones estándar de Thymeleaf.

Ya hemos visto dos tipos de valores de atributo válidos expresados en esta sintaxis: mensaje y expresiones de variable:

```html
<p th:utext="#{home.welcome}">Welcome to our grocery store!</p>

<p>Today is: <span th:text="${today}">13 february 2011</span></p>
```

Pero hay más tipos de valores que aún desconocemos, y más detalles interesantes sobre los que ya conocemos. Primero,
veamos un breve resumen de las características de las expresiones estándar:

* Expresiones simples:
    * Expresiones de variables: `${...}`
    * Expresiones de variables de selección: `*{...}`
    * Expresiones de mensajes: `#{...}`
    * Expresiones de enlaces URL: `@{...}`
* Literales
    * Literales de Texto: `'one text'`, `'Another one!'`,...
    * Literales numéricos: `0`, `34`, `3.0`, `12.3`,...
    * Literales booleanos: `true`, `false`
    * Literal null: `null`
    * Tokens literales: `one`, `sometext`, `main`,...
* Operaciones de texto:
    * Concatenación de cadenas: `+`
    * Sustituciones literales: `|The name is ${name}|`
* Operaciones aritméticas:
    * Operadores binarios: `+`, `-`, `*`, `/`, `%`
    * Signo menos (operador unario): `-`
* Operaciones booleanas:
    * Operadores binarios: `and`, `or`
    * Negación booleana (operador unario): `!`, `not`
* Comparaciones e igualdad:
    * Comparadores: `>`, `<`, `>=`, `<=` (`gt`, `lt`, `ge`, `le`)
    * Operadores de igualdad: `==`, `!=` (`eq`, `ne`)
* Operadores condicionales:
    * If-then: `(if) ? (then)`
    * If-then-else: `(if) ? (then) : (else)`
    * Default: `(value) ?: (defaultvalue)`

Todas estas características se pueden combinar y anidar:

```html
'User is of type ' + (${user.isAdmin()} ? 'Administrator' : (${user.type} ?: 'Unknown'))
```

4.1 Mensajes
------------

Como ya sabemos, las expresiones de mensaje `#{...}` nos permiten vincular esto:

```html
<p th:utext="#{home.welcome}">Welcome to our grocery store!</p>
```

...a esto:

```html
home.welcome=¡Bienvenido a nuestra tienda de comestibles!
```

Pero hay un aspecto que aún no hemos considerado: ¿qué ocurre si el texto del mensaje no es completamente estático? ¿Qué
sucedería si, por ejemplo, nuestra aplicación supiera quién es el usuario que visita el sitio en cualquier momento y 
quisiéramos saludarlo por su nombre?

```html
<p>¡Bienvenido a nuestra tienda de comestibles, John Apricot!</p>
```

Esto significa que necesitaríamos agregar un parámetro a nuestro mensaje. Algo como esto:

```html
home.welcome=¡Bienvenido a nuestra tienda de comestibles, {0}!
```

Los parámetros se especifican de acuerdo con la sintaxis estándar `java.text.MessageFormat`, lo que significa que puede
agregar formato a números y fechas como se especifica en la documentación de API para esa clase.

Para especificar un valor para nuestro parámetro, y dado un atributo de sesión HTTP llamado `usuario`, tendríamos:

```html
<p th:utext="#{home.welcome(${session.user.name})}">
    Welcome to our grocery store, Sebastian Pepper!
</p>
```

Si es necesario, se pueden especificar varios parámetros, separados por comas. De hecho, la clave del mensaje podría
provenir de una variable:

```html
<p th:utext="#{${welcomeMsgKey}(${session.user.name})}">
    Welcome to our grocery store, Sebastian Pepper!
</p>
```

4.2 Variables
-------------
Ya mencionamos que las expresiones `${...}` son en realidad expresiones OGNL (Object-Graph Navigation Language)
ejecutadas en el mapa de variables contenidas en el contexto.

> Para información detallada sobre la sintaxis y capacidades de OGNL, debería leer la Guía del Lenguaje OGNL en:
> [http://commons.apache.org/ognl/](http://commons.apache.org/ognl/)

De la sintaxis de OGNL, sabemos que esto:

```html
<p>Today is: <span th:text="${today}">13 february 2011</span>.</p>
```

...es de hecho equivalente a esto:

```java
ctx.getVariables().

get("today");
```

Pero OGNL nos permite crear expresiones mucho más potentes, y así es como funciona esto:

```html
<p th:utext="#{home.welcome(${session.user.name})}">
    Welcome to our grocery store, Sebastian Pepper!
</p>
```

...de hecho obtiene el nombre de usuario ejecutando:

```java
((User)ctx.

getVariables().

get("session").

get("user")).

getName();
```

Pero la navegación por métodos getter es solo una de las características de OGNL. Veamos más:

```java
/*
 * Acceso a las propiedades usando el punto (.). Es el equivalente a llamar a los métodos get de la propiedad
 */
$ {
    person.father.name
}

/*
 * Se puede acceder a las propieades también utilizando los corchetes ([]) y escribiendo el nombre de la propiedad como
 * una variable o entre comillas simples.
 */
$ {
    person['father']['name']
}

/*
 * Si el objeto es un mapa, tanto el punto como la sintaxis de corchetes serán equivalemntes a ejecutar una llamada
 * a un método get(...).
 */
$ {
    countriesByCode.ES
}

$ {
    personsByName['Stephen Zucchini'].age
}

/*
 * El acceso indexado a matrices o colecciones también se realiza con corchetes, escribiendo el índice sin comillas.
 */
$ {
    personsArray[0].name
}

/*
 * Se pueden llamar a los métodos, incluso con argumentos.
 */
$ {
    person.createCompleteName()
}

$ {
    person.createCompleteNameWithSeparator('-')
}
```

### Objetos básicos de expresión

Al evaluar las expresiones OGNL en las variables de contexto, algunos objetos se ponen a disposición de las expresiones
para mayor flexibilidad. Estos objetos se referenciarán (según el estandar OGNL) comenzando con el símbolo `#`:

* `#ctx`: el objeto context (el contexto, en español).
* `#vars:` las variables contenidas en context.
* `#locale`: la configuración regional de context.
* `#httpServletRequest`: (solo en Contextos de Web) el objeto `HttpServletRequest`.
* `#httpSession`: (solo en Contextos de Web) el objeto `HttpSession`.

Así que podemos hacer esto:

```html
Established locale country: <span th:text="${#locale.country}">US</span>.
```

Puede leer la referencia completa de estos objetos en el [Apéndice A]{#apendice-a-expresion-objetos-basicos}.

### Objetos de utilidad de expresión

Además de estos objetos básicos, Thymeleaf nos ofrecerá un conjunto de objetos de utilidad que nos ayudarán a realizar
tareas comunes en nuestras expresiones.

* `#dates`: métodos de utilidad para los objetos `java.util.Date`: formateo, extracción de componentes, etc.
* `#calendars`: análogo a `#dates`, pero para los objetos `java.util.Calendar`.
* `#numbers`: métodos de utilidad para dar formato a los objetos numéricos.
* `#strings`: métodos de utilidad para los objetos `String`: contains, startsWith, prepending/appending, etc.
* `#objects`: métodos de utilidad para todos los objetos en general.
* `#bools`: métodos de utilidad para la evaluación booleana.
* `#arrays`: métodos de utilidad para matrices (arrays en inglés).
* `#lists`: métodos de utilidad para las listas (list en inglés).
* `#sets`: métodos de utilidad para los conjuntos (sets en inglés).
* `#maps`: métodos de utilidad para los mapas (maps en inglés).
* `#aggregates`: Métodos de utilidad para crear agregados en matrices o colecciones.
* `#messages`: métodos de utilidad para obtener mensajes externalizados dentro de expresiones variables, de la misma
  manera que se obtendrían utilizando la sintaxis #{...}.
* `#ids`: Métodos de utilidad para gestionar atributos de identificación que puedan repetirse (por ejemplo, como
  resultado de una iteración).

Puede comprobar qué funciones se ofrecen para cada uno de estos objetos de utilidad en el
[Apéndice B]{#apendice-b-expresion-objetos-de-utilidad}.

### Reformateando las fechas en nuestra página de inicio

Ahora que conocemos estos objetos de utilidad, podemos usarlos para cambiar la forma en que mostramos la fecha en
nuestra página de inicio. En lugar de hacerlo en nuestro `HomeController`:

```java
SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
Calendar cal = Calendar.getInstance();

WebContext ctx = new WebContext(request, servletContext, request.getLocale());
ctx.

setVariable("today",dateFormat.format(cal.getTime()));

        templateEngine.

process("home",ctx, response.getWriter());
```

...Podemos hacer precisamente esto:

```java
WebContext ctx = new WebContext(request, servletContext, request.getLocale());
ctx.

setVariable("today",Calendar.getInstance());

        templateEngine.

process("home",ctx, response.getWriter());
```

...y luego realizar el formato de fecha en la propia capa de vista:

```html
<p>
    Hoy es: <span th:text="${#calendars.format(today,'dd MMMM yyyy')}">13 Mayo 2011</span>
</p>
```

4.3 Expresiones en selecciones (sintaxis de asterisco)
------------------------------------------------------

Las expresiones variables no sólo se pueden escribir en expresiones `${...}`, sino también en expresiones `*{...}`.

Sin embargo, existe una diferencia importante: la sintaxis de asterisco evalúa las expresiones en los objetos
seleccionados, en lugar de en todo el mapa de variables de contexto. Es decir, mientras no haya ningún objeto 
seleccionado, las sintaxis de dólar y de asterisco hacen exactamente lo mismo.

¿Y qué es esa selección de objetos? Un atributo `th:object`. Usémoslo en nuestra página de perfil de usuario (
`userprofile.html`):

```html

<div th:object="${session.user}">
    <p>Nombre: <span th:text="*{firstName}">Sebastian</span>.</p>
    <p>Apellido: <span th:text="*{lastName}">Pepper</span>.</p>
    <p>Nacionalidad: <span th:text="*{nationality}">Saturno</span>.</p>
</div>
```

Lo cual es exactamente equivalente a:

```html

<div>
    <p>Nombre: <span th:text="${session.user.firstName}">Sebastian</span>.</p>
    <p>Apellido: <span th:text="${session.user.lastName}">Pepper</span>.</p>
    <p>Nacionalidad: <span th:text="${session.user.nationality}">Saturno</span>.</p>
</div>
```

Por supuesto, la sintaxis dólar y asterisco se pueden mezclar:

```html

<div th:object="${session.user}">
    <p>Nombre: <span th:text="*{firstName}">Sebastian</span>.</p>
    <p>Apellido: <span th:text="${session.user.lastName}">Pepper</span>.</p>
    <p>Nacionalidad: <span th:text="*{nationality}">Saturno</span>.</p>
</div>
```

Cuando hay una selección de objetos en su lugar, el objeto seleccionado también estará disponible para las expresiones
dólares como la variable de expresión `#object`:

```html

<div th:object="${session.user}">
    <p>Nombre: <span th:text="${#object.firstName}">Sebastian</span>.</p>
    <p>Apellido: <span th:text="${session.user.lastName}">Pepper</span>.</p>
    <p>Nacionalidad: <span th:text="*{nationality}">Saturno</span>.</p>
</div>
```

Como se dijo, si no se ha realizado ninguna selección de objetos, las sintaxis de dólar y asterisco son exactamente
equivalentes.

```html

<div>
    <p>Nombre: <span th:text="*{session.user.name}">Sebastian</span>.</p>
    <p>Apellido: <span th:text="*{session.user.surname}">Pepper</span>.</p>
    <p>Nacionalidad: <span th:text="*{session.user.nationality}">Saturno</span>.</p>
</div>
```

4.4 Enlaces a URLs
------------------

Debido a su importancia, las URL son ciudadanos de primera clase en las plantillas de aplicaciones web, y el dialecto
estándar de Thymeleaf tiene una sintaxis especial para ellas, la sintaxis `@`: `@{...}`

Existen diferentes tipos de URL:

* URLs absolutas, como `http://www.thymeleaf.org`
* URLs relativas, las cuales pueden ser:
    * relativas a una página, como `user/login.html`
    * relativas al contexto, como `/itemdetails?id=3` (el nombre del contexto en el servidor se agregará
      automáticamente)
    * relativas al servidor, como `~/billing/processInvoice` (permiten la llamada de URLs en otros contextos (=
      application) en el mismo servidor).
    * URL relativas al protocolo, como `//code.jquery.com/jquery-2.0.3.min.js`

Thymeleaf puede manejar URL absolutas en cualquier situación, pero para las relativas requerirá que utilice un objeto de
contexto que implemente la interfaz `IWebContext`, que contiene información proveniente de la solicitud HTTP y necesaria 
para crear enlaces relativos.

Usemos esta nueva sintaxis. Conozcamos el atributo `th:href`:

```html
<!-- Producirá 'http://localhost:8080/gtvg/order/details?orderId=3' (mas reescritura) -->
<a href="details.html"
   th:href="@{http://localhost:8080/gtvg/order/details(orderId=${o.id})}">vista</a>

<!-- Producirá '/gtvg/order/details?orderId=3' (mas reescritura) -->
<a href="details.html" th:href="@{/order/details(orderId=${o.id})}">vista</a>

<!-- Producirá '/gtvg/order/3/details' (mas reescritura) -->
<a href="details.html" th:href="@{/order/{orderId}/details(orderId=${o.id})}">vista</a>
```

Aspectos a tener en cuenta:

* `th:href` es un atributo modificador de atributo: una vez procesado, calculará la URL del enlace que se utilizará y
  asignará el atributo href de la etiqueta `<a>` a esta URL.
* Se permiten expresiones para los parámetros de URL (como se puede ver en `orderId=${o.id}`). Las operaciones de
  codificación de URL necesarias también se realizarán automáticamente.
* Si se necesitan varios parámetros, estos se separarán con comas, como
  `@{/order/process(execId=${execId},execType='FAST')}`.
* También se permiten plantillas de variables en las rutas de URL, como
  `@{/order/{orderId}/details(orderId=${orderId})}`.
* Las URL relativas que empiezan por `/` (como `/order/details`) se prefijarán automáticamente con el nombre del
  contexto de la aplicación.
* Si las cookies no están habilitadas o aún no se conoce, se podría añadir un sufijo `";jsessionid=..."` a las URL
  relativas para preservar la sesión. Esto se denomina _Reescritura de URL_, y Thymeleaf permite incorporar filtros de 
  reescritura propios mediante el mecanismo `response.encodeURL(...)` de la API de Servlets para cada URL.
* La etiqueta `th:href` nos permitió (opcionalmente) tener un atributo `href` estático funcional en nuestra plantilla,
  de modo que los enlaces de la plantilla permanecieran navegables en un navegador al abrirse directamente para fines de
  prototipado.

Como fue el caso con la sintaxis del mensaje (`#{...}`), las bases de URL también pueden ser el resultado de evaluar
otra expresión:

```html
<a th:href="@{${url}(orderId=${o.id})}">vista</a>
<a th:href="@{'/details/'+${user.login}(orderId=${o.id})}">vista</a>
```

### Un menú para nuestra página de inicio

Ahora que sabemos cómo crear URL de enlaces, ¿qué tal si agregamos un pequeño menú en nuestra página de inicio para
algunas de las otras páginas del sitio?

```html
<p>Por favor, seleccione una opción</p>
<ol>
    <li><a href="product/list.html" th:href="@{/product/list}">Lista de Productos</a></li>
    <li><a href="order/list.html" th:href="@{/order/list}">Lista de Pedidos</a></li>
    <li><a href="subscribe.html" th:href="@{/subscribe}">Suscríbete a Nuestro Boletín Informativo</a></li>
    <li><a href="userprofile.html" th:href="@{/userprofile}">Ver Perfil de Usuario</a></li>
</ol>
```

### URLs relativas a la raíz del servidor

Se puede usar una sintaxis adicional para crear URL relativas a la raíz del servidor (en lugar de las relativas a la
raíz del contexto) para enlazar a diferentes contextos en el mismo servidor. Estas URL se especificarán como
`@{~/path/to/something}`



4.5 Literales
-------------

### Literales de texto

Los literales de texto son cadenas de caracteres entre comillas simples. Pueden incluir cualquier carácter, pero las
comillas simples que los contienen deben escaparse con `\`.

```html
<p>
    Ahora estás viendo un <span th:text="'aplicación web funcional'">archivo de plantilla</span>.
</p>
```

### Literales numéricos

Los literales numéricos se ven exactamente como lo que son: números.

```html
<p>El año es <span th:text="2013">1492</span>.</p>
<p>En dos años, será <span th:text="2013 + 2">1494</span>.</p>
```

### Literales booleanos

Los literales booleano son `true` y `false`. Por ejemplo:

```html

<div th:if="${usuario.esAdmin()} == false"> ...
```

Tenga en cuenta que, en el ejemplo anterior, el `== false` se escribe fuera de las llaves, por lo que es Thymeleaf quien
se encarga de ello. Si se escribiera dentro de las llaves, sería responsabilidad de los motores OGNL/SpringEL:

```html

<div th:if="${usuario.esAdmin() == false}"> ...
```

### El literal null (nulo)

El literal `null` también se puede utilizar:

```html

<div th:if="${variable.algo} == null"> ...
```

### Literales de identificadores (tokens)

Los literales numéricos, booleanos y nulos son de hecho un caso particular de _literales de identificadores_.

Estos identificadores permiten simplificar ligeramente las expresiones estándar. Funcionan igual que los literales de
texto (`'...'`), pero solo admiten letras (`A-Z` y `a-z`), números (`0-9`), corchetes (`[` y `]`), puntos (`.`), 
guiones (`-`) y guiones bajos (`_`). Por lo tanto, no se permiten espacios, comas, etc.

¿Lo bueno? Los tokens no necesitan comillas. Así que podemos hacer esto:

```html

<div th:class="content">...</div>
```

en lugar de:

```html

<div th:class="'content'">...</div>
```

4.6 Agregar textos
-----------------

Los textos, sin importar si son literales o el resultado de evaluar expresiones variables o de mensajes, se pueden
agregar fácilmente usando el operador `+`:

```html
th:text="'El nombre del usuario es ' + ${usuario.nombre}"
```

4.7 Sustituciones de literales
------------------------------

Las sustituciones literales permiten formatear fácilmente cadenas que contienen valores de variables sin la necesidad de
agregar literales con '...' + '...'`.

Estas sustituciones deben estar rodeadas de barras verticales (`|`), como:

```html
<span th:text="|Bienvenido a nuestra aplicación, ${usuario.nombre}!|">
```

Lo cual en realidad es equivalente a:

```html
<span th:text="'Bienvenido a nuestra aplicación, ' + ${usuario.nombre} + '!'">
```

Las sustituciones literales se pueden combinar con otros tipos de expresiones:

```html
<span th:text="${varuno} + ' ' + |${vardos}, ${vartres}|">
```

**Nota:** Solo se permiten expresiones variables (`${...}`) dentro de las sustituciones literales `|...|`. No se
permiten otros literales (`'...'`), identificadores, booleanos/numéricos, expresiones condicionales, etc.




4.8 Operaciones aritméticas
---------------------------

También están disponibles algunas operaciones aritméticas: `+`, `-`, `*`, `/` y `%`.

```html
th:with="esPar=(${prodStat.cuenta} % 2 == 0)"
```

Tenga en cuenta que estos operadores también se pueden aplicar dentro de las expresiones de variables OGNL (y en ese
caso serán ejecutados por OGNL en lugar del motor de expresiones estándar de Thymeleaf):

```html
th:with="esPar=${prodStat.cuenta % 2 == 0}"
```

Tenga en cuenta que existen alias textuales para algunos de estos operadores:
`div` (`/`), `mod` (`%`).


4.9 Comparadores e igualdad
---------------------------

Los valores de las expresiones se pueden comparar con los símbolos `>`, `<`, `>=` y `<=`, como es habitual, y también se
pueden usar los operadores `==` y `!=` para comprobar la igualdad (o la falta de ella). Tenga en cuenta que XML 
establece que los símbolos `<` y `>` no deben usarse en valores de atributos, por lo que deben sustituirse por 
`&lt;` y `&gt;`.

```html
th:if="${prodStat.count} &gt; 1"
th:text="'El modo de ejecución es ' + ( (${execMode} == 'dev')? 'Desarrollo' : 'Producción')"
```

Tenga en cuenta que existen alias textuales para algunos de estos operadores:
`gt` (`>`), `lt` (`<`), `ge` (`>=`), `le` (`<=`), `not` (`!`). También `eq` (`==`), `neq`/`ne` (`!=`).



4.10 Expresiones condicionales
------------------------------

Las _expresiones condicionales_ están destinadas a evaluar solo una de dos expresiones dependiendo del resultado de
evaluar una condición (que es en sí otra expresión).

Echemos un vistazo a un fragmento de ejemplo (que introduce otro modificador de atributo, esta vez `the:class`):

```html

<tr th:class="${fila.par}? 'par' : 'impar'">
    ...
</tr>
```

Las tres partes de una expresión condicional (`condition`, `then` y `else`) son en sí mismas expresiones, lo que
significa que pueden ser variables (`${...}`, `*{...}`), mensajes (`#{...}`), URL (`@{...}`) o literales (`'...'`).

Las expresiones condicionales también se pueden anidar mediante paréntesis:

```html

<tr th:class="${fila.par}? (${fila.primera}? 'primera' : 'par') : 'impar'">
    ...
</tr>
```

Las expresiones else también se pueden omitir, en cuyo caso se devuelve un valor nulo si la condición es falsa:

```html

<tr th:class="${fila.par}? 'alt'">
    ...
</tr>
```

4.11 Expresiones predeterminadas (operador Elvis)
-------------------------------------------------

Una _expresión predeterminada_ es un tipo especial de valor condicional sin la parte _then_. Equivale al _operador
Elvis_, presente en lenguajes como Groovy, y permite especificar dos expresiones; la segunda solo se evalúa si la 
primera devuelve un valor nulo.

Veámoslo en acción en nuestra página de perfil de usuario:

```html

<div th:object="${sesion.usuario}">
    ...
    <p>Edad: <span th:text="*{age}?: '(sin edad especificada)'">27</span>.</p>
</div>
```

Como puede ver, el operador es `?:`, y lo usamos aquí para especificar un valor predeterminado para un nombre (un valor
literal, en este caso) solo si el resultado de evaluar `*{age}` es nulo. Por lo tanto, esto equivale a:

```html
<p>Edad: <span th:text="*{age != null}? *{age} : '(sin edad especificada)'">27</span>.</p>
```

Al igual que los valores condicionales, pueden contener expresiones anidadas entre paréntesis:

```html
<p>
    Nombre:
    <span th:text="*{firstName}?: (*{admin}? 'Admin' : #{default.username})">Sebastian</span>
</p>
```

4.12 Preprocesamiento
---------------------

Además de todas estas funcionalidades para el procesamiento de expresiones, Thymeleaf nos ofrece la posibilidad de
_preprocesar_ expresiones.

¿Y qué es el preprocesamiento? Es una ejecución de las expresiones antes de la normal, que permite modificar la
expresión que finalmente se ejecutará.

Las expresiones preprocesadas son exactamente como las normales, pero aparecen rodeadas por un símbolo de doble guión
bajo (como `__${expresion}__`).

Imaginemos que tenemos una entrada i18n `Messages_fr.properties` que contiene una expresión OGNL que llama a un método
estático específico del lenguaje, como:

```java
article.text=@myapp.translator.Translator @translateToFrench({0})
```

...y un `Messages_es.properties equivalente`:

```java
article.text=@myapp.translator.Translator @translateToSpanish({0})
```

Podemos crear un fragmento de marcado que evalúe una u otra expresión según la configuración regional. Para ello,
primero seleccionaremos la expresión (mediante preprocesamiento) y luego dejaremos que Thymeleaf la ejecute:

```html
<p th:text="${__#{article.text('textVar')}__}">Algún texto aquí...</p>
```

Tenga en cuenta que el paso de preprocesamiento para una configuración regional francesa será la creación del siguiente
equivalente:

```html
<p th:text="${@myapp.translator.Translator@translateToFrench(textVar)}">Algún texto aquí...</p>
```

La cadena de preprocesamiento `__` se puede escapar en atributos usando `\_\_`.


5\. Establecer valores de atributos
=================================

Este capítulo explicará la forma en que podemos establecer (o modificar) valores de atributos en nuestras etiquetas de
marcado, posiblemente la siguiente característica más básica que necesitaremos después de establecer el contenido del 
cuerpo de la etiqueta.



5.1 Establecer el valor de cualquier atributo
---------------------------------------------

Digamos que nuestro sitio web publica un boletín informativo y queremos que nuestros usuarios puedan suscribirse a él,
por lo que creamos una plantilla `/WEB-INF/templates/subscribe.html` con un formulario:

```html

<form action="subscribe.html">
    <fieldset>
        <input type="text" name="email"/>
        <input type="submit" value="¡Suscribeme!"/>
    </fieldset>
</form>
```

Parece bastante correcto, pero lo cierto es que este archivo se parece más a una página XHTML estática que a una
plantilla para una aplicación web. En primer lugar, el atributo "action" de nuestro formulario enlaza estáticamente al 
archivo de plantilla, lo que impide la reescritura de URLs. En segundo lugar, el atributo "value" del botón de envío 
hace que muestre un texto en inglés, pero nos gustaría que estuviera internacionalizado.

Ingrese entonces el atributo `th:attr` y su capacidad para cambiar el valor de los atributos de las etiquetas en las que
está configurado:

```html

<form action="subscribe.html" th:attr="action=@{/subscribe}">
    <fieldset>
        <input type="text" name="email"/>
        <input type="submit" value="¡Suscribeme!" th:attr="value=#{subscribe.submit}"/>
    </fieldset>
</form>
```

El concepto es bastante sencillo: `th:attr` simplemente toma una expresión que asigna un valor a un atributo. Tras crear
los archivos de controlador y mensajes correspondientes, el resultado del procesamiento de este archivo será el 
esperado:

```html

<form action="/gtvg/subscribe">
    <fieldset>
        <input type="text" name="email"/>
        <input type="submit" value="¡Suscríbeme!"/>
    </fieldset>
</form>
```

Además de los nuevos valores de atributos, también puedes ver que el nombre del contexto de la aplicación se ha
prefijado automáticamente a la base de la URL en `/gtvg/subscribe`, como se explicó en el capítulo anterior.

¿Pero qué sucede si queremos configurar más de un atributo a la vez? Las reglas XML no permiten configurar un atributo
dos veces en una etiqueta, por lo que `th:attr` tomará una lista de asignaciones separadas por comas, como:

```html
<img src="../../images/gtvglogo.png"
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}"/>
```

Dados los archivos de mensajes requeridos, esto generará:

```html
<img src="/gtgv/images/gtvglogo.png" title="Logo de Good Thymes" alt="Logo de Good Thymes"/>
```

5.2 Establecer valores para atributos específicos
-------------------------------------------------

A estas alturas, es posible que estés pensando que algo como:

```html
<input type="submit" value="Subscribe me!" th:attr="value=#{subscribe.submit}"/>
```

...es un marcado bastante feo. Especificar una asignación dentro del valor de un atributo puede ser muy práctico, pero
no es la forma más elegante de crear plantillas si tienes que hacerlo constantemente.

Thymeleaf está de acuerdo contigo. Y por eso, de hecho, `th:attr` apenas se usa en plantillas. Normalmente, usarás otros
atributos `th:*` cuya función es configurar atributos de etiqueta específicos (y no cualquier atributo como `th:attr`).

¿Y qué atributo nos ofrece el dialecto estándar para configurar el atributo `value` de nuestro botón? Bueno, de forma
bastante obvia, es `th:value`. Veamos:

```html
<input type="submit" value="Subscribe me!" th:value="#{subscribe.submit}"/>
```

¡Esto se ve mucho mejor! Intentemos hacer lo mismo con el atributo `action` en la etiqueta `form`:

```html

<form action="subscribe.html" th:action="@{/subscribe}">
```

¿Y recuerdas esos `th:href` que incluimos en nuestro `home.html`? Son exactamente el mismo tipo de atributos:

```html

<li><a href="product/list.html" th:href="@{/product/list}">Product List</a></li>
```

Hay muchos atributos como estos, cada uno de ellos apunta a un atributo XHTML o HTML5 específico:

|                      |                  |                     |
|:---------------------|:-----------------|:--------------------|
| `th:abbr`            | `th:accept`      | `th:accept-charset` |
| `th:accesskey`       | `th:action`      | `th:align`          |
| `th:alt`             | `th:archive`     | `th:audio`          |
| `th:autocomplete`    | `th:axis`        | `th:background`     |
| `th:bgcolor`         | `th:border`      | `th:cellpadding`    |
| `th:cellspacing`     | `th:challenge`   | `th:charset`        |
| `th:cite`            | `th:class`       | `th:classid`        |
| `th:codebase`        | `th:codetype`    | `th:cols`           |
| `th:colspan`         | `th:compact`     | `th:content`        |
| `th:contenteditable` | `th:contextmenu` | `th:data`           |
| `th:datetime`        | `th:dir`         | `th:draggable`      |
| `th:dropzone`        | `th:enctype`     | `th:for`            |
| `th:form`            | `th:formaction`  | `th:formenctype`    |
| `th:formmethod`      | `th:formtarget`  | `th:frame`          |
| `th:frameborder`     | `th:headers`     | `th:height`         |
| `th:high`            | `th:href`        | `th:hreflang`       |
| `th:hspace`          | `th:http-equiv`  | `th:icon`           |
| `th:id`              | `th:keytype`     | `th:kind`           |
| `th:label`           | `th:lang`        | `th:list`           |
| `th:longdesc`        | `th:low`         | `th:manifest`       |
| `th:marginheight`    | `th:marginwidth` | `th:max`            |
| `th:maxlength`       | `th:media`       | `th:method`         |
| `th:min`             | `th:name`        | `th:optimum`        |
| `th:pattern`         | `th:placeholder` | `th:poster`         |
| `th:preload`         | `th:radiogroup`  | `th:rel`            |
| `th:rev`             | `th:rows`        | `th:rowspan`        |
| `th:rules`           | `th:sandbox`     | `th:scheme`         |
| `th:scope`           | `th:scrolling`   | `th:size`           |
| `th:sizes`           | `th:span`        | `th:spellcheck`     |
| `th:src`             | `th:srclang`     | `th:standby`        |
| `th:start`           | `th:step`        | `th:style`          |
| `th:summary`         | `th:tabindex`    | `th:target`         |
| `th:title`           | `th:type`        | `th:usemap`         |
| `th:value`           | `th:valuetype`   | `th:vspace`         |
| `th:width`           | `th:wrap`        | `th:xmlbase`        |
| `th:xmllang`         | `th:xmlspace`    |                     |

5.3 Establecer más de un valor a la vez
---------------------------------------

Existen dos atributos bastante especiales, llamados `th:alt-title` y `th:lang-xmllang`, que permiten asignar el mismo
valor a dos atributos simultáneamente. En concreto:

* `th:alt-title` establecerá `alt` y `title`.
* `th:lang-xmllang` establecerá `lang` y `xml:lang`.

Para nuestra página de inicio de GTVG, esto nos permitirá sustituir esto:

```html
<img src="../../images/gtvglogo.png"
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}"/>
```

...o esto, que es equivalente:

```html
<img src="../../images/gtvglogo.png"
     th:src="@{/images/gtvglogo.png}" th:title="#{logo}" th:alt="#{logo}"/>
```

...por esto:

```html
<img src="../../images/gtvglogo.png"
     th:src="@{/images/gtvglogo.png}" th:alt-title="#{logo}"/>
```

5.4 Anexar y anteponer
----------------------

De forma similar a `th:attr`, Thymeleaf ofrece los atributos `th:attrappend` y `th:attrprepend`, que añaden (sufijo) o
anteponen (prefijo) el resultado de su evaluación a los valores de los atributos existentes.

Por ejemplo, podría querer almacenar el nombre de una clase CSS que se añadirá (no se establecerá, solo se añadirá) a
uno de sus botones en una variable de contexto, ya que la clase CSS específica que se utilizará dependería de algo que 
el usuario haya hecho previamente. Fácil:

```html
<input type="button" value="Do it!" class="btn" th:attrappend="class=${' ' + cssStyle}"/>
```

Si procesa esta plantilla con la variable `cssStyle` establecida en `"warning"`, obtendrá:

```html
<input type="button" value="Do it!" class="btn warning"/>
```

También hay dos _atributos de agregación_ específicos en el dialecto estándar: los atributos `th:classappend` y
`th:styleappend`, que se utilizan para agregar una clase CSS o un fragmento de _style_ a un elemento sin sobrescribir 
los existentes:

```html

<tr th:each="prod : ${prods}" class="row" th:classappend="${prodStat.odd}? 'odd'">
```

(No te preocupes por el atributo `th:each`. Es un _atributo iterativo_ y hablaremos de él más adelante).



5.5 Atributos booleanos de valor fijo
-------------------------------------

Algunos atributos XHTML/HTML5 son especiales porque están presentes en sus elementos con un valor específico y fijo o no
están presentes en absoluto.

Por ejemplo, `checked`:

```html
<input type="checkbox" name="option1" checked="checked"/>
<input type="checkbox" name="option2"/>
```

Según los estándares XHTML, no se permite ningún otro valor que no sea `"checked"` para el atributo `checked` (las
reglas HTML5 son un poco más flexibles al respecto). Lo mismo ocurre con `disabled`, `multiple`, `readonly` y `selected`.

El dialecto estándar incluye atributos que permiten configurar estos atributos evaluando una condición. De esta manera,
si se evalúa como verdadero, el atributo se establecerá en su valor fijo, y si se evalúa como falso, no se establecerá.

```html
<input type="checkbox" name="active" th:checked="${user.active}"/>
```

Los siguientes atributos booleanos de valor fijo existen en el dialecto estándar:

|     Fixed-value     |    boolean     |   Attributes    |
|:-------------------:|:--------------:|:---------------:|
|     `th:async`      | `th:autofocus` |  `th:autoplay`  |
|    `th:checked`     | `th:controls`  |  `th:declare`   |
|    `th:default`     |   `th:defer`   |  `th:disabled`  |
| `th:formnovalidate` |  `th:hidden`   |   `th:ismap`    |
|      `th:loop`      | `th:multiple`  | `th:novalidate` |
|     `th:nowrap`     |   `th:open`    |  `th:pubdate`   |
|    `th:readonly`    | `th:required`  |  `th:reversed`  |
|     `th:scoped`     | `th:seamless`  |  `th:selected`  |

5.6 Compatibilidad con nombres de elementos y atributos compatibles con HTML5
-----------------------------------------------------------------------------

También es posible utilizar una sintaxis completamente diferente para aplicar procesadores a sus plantillas, más
compatible con HTML5.

```html	
<table>
    <tr data-th-each="user : ${users}">
        <td data-th-text="${user.login}">...</td>
        <td data-th-text="${user.name}">...</td>
    </tr>
</table>
```

La sintaxis `data-{prefix}-{name}` es la forma estándar de escribir atributos personalizados en HTML5, sin necesidad de
que los desarrolladores usen nombres con espacios de nombres como `th:*`. Thymeleaf hace que esta sintaxis esté 
disponible automáticamente para todos sus dialectos (no solo para los estándar).

También existe una sintaxis para especificar etiquetas personalizadas: `{prefijo}-{nombre}`, que sigue la
_Especificación de Elementos Personalizados del W3C_ (parte de la _Especificación de Componentes Web del W3C_, más 
amplia). Esto se puede usar, por ejemplo, para el elemento `th:block` (o también `th-block`), que se explicará en una 
sección posterior.

**Importante:** Esta sintaxis se añade a la sintaxis con espacio de nombres `th:*`, no la reemplaza. No se pretende
descontinuar la sintaxis con espacio de nombres en el futuro.


6\. Iteración
=============

Hasta ahora hemos creado una página de inicio, una página de perfil de usuario y también una página para que los
usuarios se suscriban a nuestro boletín informativo... pero ¿qué pasa con nuestros productos? ¿No deberíamos crear una 
lista de productos para que los visitantes sepan qué vendemos? Pues claro que sí. Y aquí estamos.



6.1 Conceptos básicos de iteración
----------------------------------

Para listar nuestros productos en nuestra página `/WEB-INF/templates/product/list.html`, necesitaremos una tabla. Cada
uno de nuestros productos se mostrará en una fila (un elemento `<tr>`), por lo que para nuestra plantilla necesitaremos 
crear una _fila de plantilla_ que muestre cómo queremos que se muestre cada producto--- y luego indicarle a Thymeleaf 
que _la itere_ una vez para cada producto.

El dialecto estándar nos ofrece un atributo para exactamente eso, `th:each`.

### Usando th:each

Para nuestra página de lista de productos, necesitaremos un controlador que recupere la lista de productos de la capa de
servicio y la agregue al contexto de la plantilla:

```java
public void process(
        HttpServletRequest request, HttpServletResponse response,
        ServletContext servletContext, TemplateEngine templateEngine) {

    ProductService productService = new ProductService();
    List<Product> allProducts = productService.findAll();

    WebContext ctx = new WebContext(request, servletContext, request.getLocale());
    ctx.setVariable("prods", allProducts);

    templateEngine.process("product/list", ctx, response.getWriter());
}
```

Y luego usaremos `th:each` en nuestra plantilla para iterar la lista de productos:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

<head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" media="all"
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}"/>
</head>

<body>

<h1>Lista de productos</h1>

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
    </tr>
    <tr th:each="prod : ${prods}">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
    </tr>
</table>

<p>
    <a href="../home.html" th:href="@{/}">Volver al inicio</a>
</p>

</body>

</html>
```

El valor del atributo `prod: ${prods}` que se ve arriba significa que, para cada elemento del resultado de la evaluación
de `${prods}`, se repite este fragmento de plantilla que define ese elemento en una variable llamada `prod`. Asignemos un
nombre a cada elemento que vemos:

* Llamaremos `${prods}` a la _expresión iterada_ o _variable iterada_.
* Llamaremos `prod` a la _variable de iteración_ o simplemente _variable iter_.

Tenga en cuenta que la variable iteradora `prod` solo estará disponible dentro del elemento `<tr>` (incluidas las
etiquetas internas como `<td>`).

### Valores iterables

En Thymeleaf, no solo se pueden usar objetos `java.util.List` para la iteración. De hecho, existe un conjunto bastante
completo de objetos que se consideran _iterables_ mediante el atributo `th:each`:

* Cualquier objeto que implemente `java.util.Iterable`.
* Cualquier objeto que implemente `java.util.Map`. Al iterar mapas, las variables iteradoras serán de la clase
  `java.util.Map.Entry`.
* Cualquier matriz.
* Cualquier otro objeto será tratado como si fuera una lista de un solo valor que contiene el objeto en sí.

6.2 Mantener el estado de la iteración
--------------------------------------

Al utilizar `th:each`, Thymeleaf ofrece un mecanismo útil para realizar un seguimiento del estado de su iteración: la
_variable status_.

Las variables de estado se definen dentro de un atributo `th:each` y contienen los siguientes datos:

* El _índice de iteración_ actual, que comienza con 0. Esta es la propiedad `index`.
* El _índice de iteración_ actual, que comienza con 1. Esta es la propiedad `count`.
* La cantidad total de elementos en la variable iterada. Esta es la propiedad `size`.
* La variable _iter_ para cada iteración. Esta es la propiedad `current`.
* Si la iteración actual es par o impar. Estas son las propiedades booleanas `even/odd`.
* Si la iteración actual es la primera. Esta es la propiedad booleana `first`.
* Si la iteración actual es la última. Esta es la propiedad boolean `last`.

Veamos cómo podríamos usarlo dentro del ejemplo anterior:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
    </tr>
    <tr th:each="prod,iterStat : ${prods}" th:class="${iterStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
    </tr>
</table>
```

Como puede ver, la variable de estado (`iterStat` en este ejemplo) se define en el atributo `th:each` escribiendo su
nombre después de la variable iter, separado por una coma. Al igual que con la variable iter, la variable de estado solo 
estará disponible dentro del fragmento de código definido por la etiqueta que contiene el atributo `th:each`.

Echemos un vistazo al resultado del procesamiento de nuestra plantilla:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <link rel="stylesheet" type="text/css" media="all" href="/gtvg/css/gtvg.css"/>
</head>

<body>

<h1>Lista de productos</h1>

<table>
    <tr>
        <th colspan="1" rowspan="1">NOMBRE</th>
        <th colspan="1" rowspan="1">PRECIO</th>
        <th colspan="1" rowspan="1">EN STOCK</th>
    </tr>
    <tr>
        <td colspan="1" rowspan="1"> Albahaca dulce fresca</td>
        <td colspan="1" rowspan="1">4.99</td>
        <td colspan="1" rowspan="1">si</td>
    </tr>
    <tr class="odd">
        <td colspan="1" rowspan="1">Tomate italiano</td>
        <td colspan="1" rowspan="1">1.25</td>
        <td colspan="1" rowspan="1">no</td>
    </tr>
    <tr>
        <td colspan="1" rowspan="1">Pimiento amarillo</td>
        <td colspan="1" rowspan="1">2.50</td>
        <td colspan="1" rowspan="1">si</td>
    </tr>
    <tr class="odd">
        <td colspan="1" rowspan="1">Cheddar viejo</td>
        <td colspan="1" rowspan="1">18.75</td>
        <td colspan="1" rowspan="1">si</td>
    </tr>
</table>

<p>
    <a href="/gtvg/" shape="rect">Volver al inicio</a>
</p>

</body>

</html>
```

Tenga en cuenta que nuestra variable de estado de iteración ha funcionado perfectamente, estableciendo la clase CSS "
odd" solo para las filas impares (el conteo de filas comienza con 0).

> Thymeleaf añade automáticamente todos los atributos colspan y rowspan en las etiquetas `<td>`, así como el de forma en
`<a>`, de acuerdo con la DTD del estándar _XHTML 1.0 Strict_ seleccionado, que establece estos valores como 
> predeterminados para dichos atributos (recuerde que nuestra plantilla no les asignó ningún valor). No se preocupe, ya 
> que no afectarán la visualización de su página. Por ejemplo, si usáramos HTML5 (que no tiene DTD), esos atributos 
> nunca se añadirían.

Si no establece explícitamente una variable de estado, Thymeleaf siempre creará una para usted añadiendo el sufijo
`Stat` al nombre de la variable de iteración:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
    </tr>
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
    </tr>
</table>
```

7\. Evaluación condicional
==========================



7.1 Condicionales simples: "if" y "unless"
------------------------------------------

A veces necesitarás que un fragmento de tu plantilla sólo aparezca en el resultado si se cumple una determinada
condición.

Por ejemplo, imaginemos que queremos mostrar en nuestra tabla de productos una columna con la cantidad de comentarios
que existen para cada producto y, si hay comentarios, un enlace a la página de detalles de comentarios para ese 
producto.

Para hacer esto, usaríamos el atributo `th:if`:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
        <td>
            <span th:text="${#lists.size(prod.comments)}">2</span> comentario/s
            <a href="comments.html"
               th:href="@{/product/comments(prodId=${prod.id})}"
               th:if="${not #lists.isEmpty(prod.comments)}">ver</a>
        </td>
    </tr>
</table>
```

Hay muchas cosas que ver aquí, así que centrémonos en la línea importante:

```html
<a href="comments.html"
   th:href="@{/product/comments(prodId=${prod.id})}"
   th:if="${not #lists.isEmpty(prod.comments)}">ver</a>
```

De hecho, hay poco que explicar a partir de este código: crearemos un enlace a la página de comentarios (con URL
`/product/comments`) con un parámetro `prodId` establecido en el `id` del producto, pero solo si el producto tiene algún
comentario.

Echemos un vistazo al marcado resultante (eliminando los atributos predeterminados `rowspan` y `colspan` para una vista
más limpia):

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr>
        <td>Albahaca dulce fresca</td>
        <td>4.99</td>
        <td>si</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr class="odd">
        <td>Tomate italiano</td>
        <td>1.25</td>
        <td>no</td>
        <td>
            <span>2</span> comentario/s
            <a href="/gtvg/product/comments?prodId=2">ver</a>
        </td>
    </tr>
    <tr>
        <td>Pimiento amarillo</td>
        <td>2.50</td>
        <td>si</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr class="odd">
        <td>Cheddar viejo</td>
        <td>18.75</td>
        <td>si</td>
        <td>
            <span>1</span> comentario/s
            <a href="/gtvg/product/comments?prodId=4">ver</a>
        </td>
    </tr>
</table>
```

¡Perfecto! Eso es justo lo que queríamos.

Tenga en cuenta que el atributo `th:if` no solo evalúa condiciones _booleanas_. Sus funciones van un poco más allá y
evalúa la
expresión especificada como `true` siguiendo estas reglas:

* Si el valor no es nulo:
    * Si el valor es un booleano y es `true`.
    * Si el valor es un número y no es cero
    * Si el valor es un carácter y no es cero
    * Si el valor es una String y no es `false`, `off` o `no`
    * Si el valor no es un valor booleano, un número, un carácter o una cadena.
* (Si el valor es nulo, th:if se evaluará como falso).

Además, `th:if` tiene una contraparte negativa, `th:unless`, que podríamos haber usado en el ejemplo anterior en lugar
de usar un
`not` dentro de la expresión OGNL:

```html
<a href="comments.html"
   th:href="@{/comments(prodId=${prod.id})}"
   th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
```

7.2 Sentencias Switch
---------------------

También hay una forma de mostrar contenido de forma condicional usando el equivalente de una estructura _switch_ en
Java: el conjunto de atributos `th:switch` / `th:case`.

Funcionan exactamente como se espera:

```html

<div th:switch="${user.role}">
    <p th:case="'admin'">El usuario es administrador</p>
    <p th:case="#{roles.manager}">El usuario es gestor</p>
</div>
```

Tenga en cuenta que tan pronto como un atributo `th:case` se evalúa como `true`, todos los demás atributos `th:case` en
el mismo contexto de conmutación se evalúan como `false`.

La opción predeterminada se especifica como `th:case="*"`:

```html

<div th:switch="${user.role}">
    <p th:case="'admin'">El usuario es administrador</p>
    <p th:case="#{roles.manager}">El usuario es gestor</p>
    <p th:case="*">El usuario es alguna otra cosa</p>
</div>
```

8\. Diseño de plantillas
========================



8.1 Incluyendo fragmentos de plantilla
--------------------------------------

### Definición y referencia de fragmentos

A menudo, querremos incluir fragmentos de otras plantillas en nuestras plantillas. Algunos usos comunes son pies de
página, encabezados, menús...

Para ello, Thymeleaf necesita que definamos los fragmentos disponibles para su inclusión, lo cual podemos hacer mediante
el atributo `th:fragment`.

Supongamos que queremos añadir un pie de página estándar con derechos de autor a todas nuestras páginas de
supermercados. Para ello, definimos un archivo `/WEB-INF/templates/footer.html` que contiene este código:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

<body>

<div th:fragment="copy">
    &copy; 2011 La tienda de comestibles virtual Good Thymes
</div>

</body>

</html>
```

El código anterior define un fragmento llamado `copy` que podemos incluir fácilmente en nuestra página de inicio usando
uno de los atributos `th:include` o `th:replace`:

```html

<body>

...

<div th:include="footer :: copy"></div>

</body>
```

### Sintaxis de especificación de fragmentos

La sintaxis de ambos atributos de inclusión es bastante sencilla. Existen tres formatos diferentes:

* `"templatename::domselector"` o su equivalente `templatename::[domselector]` Incluye el fragmento resultante de 
ejecutar el Selector DOM especificado en la plantilla denominada `templatename`.
  * Tenga en cuenta que `domselector` puede ser simplemente un nombre de fragmento, por lo que podría especificar algo 
  tan simple como `templatename::fragmentname`, como en `footer::copy` anterior.

  > La sintaxis del selector DOM es similar a la de las expresiones XPath y los selectores CSS. Consulte el 
  > [Apéndice C]{#appendix-c-dom-selector-syntax} para obtener más información sobre esta sintaxis.

* `"templatename"` Incluye la plantilla completa llamada `templatename`.  

  > Tenga en cuenta que el nombre de plantilla que utilice en las etiquetas `th:include`/`th:replace` deberá ser 
  > resoluble por el solucionador de plantillas que utiliza actualmente el motor de plantillas.

* `::domselector"` o `"this::domselector"` Incluye un fragmento de la misma plantilla..

Tanto `templatename` como `domselector` en los ejemplos anteriores pueden ser expresiones con todas las funciones 
(¡incluso condicionales!) como:

```html

<div th:include="footer :: (${user.isAdmin}? #{footer.admin} : #{footer.normaluser})"></div>
```

Los fragmentos pueden incluir cualquier atributo `th:*`. Estos atributos se evaluarán una vez que el fragmento se 
incluya en la plantilla de destino (la que tiene el atributo `th:include`/`th:replace`) y podrán hacer referencia a 
cualquier variable de contexto definida en esta plantilla de destino.

> Una gran ventaja de este enfoque para los fragmentos es que puedes escribir el código de tus fragmentos en páginas que 
> se pueden visualizar perfectamente en un navegador, con una estructura XHTML completa e incluso validada, al tiempo 
> que conservas la capacidad de hacer que Thymeleaf los incluya en otras plantillas.

### Referenciar fragmentos sin `th:fragment`

Además, gracias a la potencia de los selectores DOM, podemos incluir fragmentos que no utilizan ningún atributo 
`th:fragment`. Incluso puede ser código de marcado procedente de otra aplicación sin ningún conocimiento de Thymeleaf:

```html
...
<div id="copy-section">
    &copy; 2011 La tienda de comestibles virtual Good Thymes
</div>
...
```

Podemos utilizar el fragmento anterior simplemente haciendo referencia a él por su atributo `id`, de forma similar a un 
selector CSS:

```html

<body>

...

<div th:include="footer :: #copy-section"></div>

</body>
```

### Diferencia entre `th:insert` y `th:replace`

¿Y cuál es la diferencia entre `th:insert` y `th:replace`? Mientras que `th:insert` incluye el contenido del fragmento 
en su etiqueta de host, `th:replace` sustituye la etiqueta de host por la del fragmento. De esta manera, un fragmento 
HTML5 como este:

```html

<footer th:fragment="copy">
    &copy; 2011 La tienda de comestibles virtual Good Thymes
</footer>
```

...incluido dos veces en las etiquetas `<div>` del host, de esta manera:

```html

<body>

...

<div th:include="footer :: copy"></div>
<div th:replace="footer :: copy"></div>

</body>
```

...dará como resultado:

```html

<body>

...

<div>
    &copy; 2011 La tienda de comestibles virtual Good Thymes
</div>
<footer>
    &copy; 2011 La tienda de comestibles virtual Good Thymes
</footer>

</body>
```

El atributo `th:substituteby` también puede usarse como alias de `th:replace`, pero se recomienda este último. Tenga en 
cuenta que `th:substituteby` podría quedar obsoleto en futuras versiones.

8.2 Firmas de fragmentos parametrizables
----------------------------------------

Para crear un mecanismo más funcional para el uso de fragmentos de plantilla, los fragmentos definidos con `th:fragment` 
pueden especificar un conjunto de parámetros:

```html

<div th:fragment="frag (onevar,twovar)">
    <p th:text="${onevar} + ' - ' + ${twovar}">...</p>
</div>
```

Esto requiere el uso de una de estas dos sintaxis para llamar al fragmento de `th:include`, `th:replace`:

```html

<div th:include="::frag (${value1},${value2})">...</div>
<div th:include="::frag (onevar=${value1},twovar=${value2})">...</div>
```

Tenga en cuenta que el orden no es importante en la última opción:

```html

<div th:include="::frag (twovar=${value2},onevar=${value1})">...</div>
```

### Variables locales de fragmentos sin firma de fragmento

Incluso si los fragmentos se definen sin firma, como esto:

```html	
<div th:fragment="frag">
    ...
</div>
```

Podríamos utilizar la segunda sintaxis especificada anteriormente para llamarlos (y solo la segunda):

```html	
<div th:include="::frag (onevar=${value1},twovar=${value2})">
```

Esto sería, de hecho, equivalente a una combinación de `th:include` y `th:with`:

```html	
<div th:include="::frag" th:with="onevar=${value1},twovar=${value2}">
```

**Nota**: esta especificación de variables locales para un fragmento, independientemente de si tiene firma o no, no 
provoca que el contexto se vacíe antes de su ejecución. Los fragmentos podrán acceder a todas las variables de contexto 
utilizadas en la plantilla de llamada, como lo hacen actualmente.

### th:assert para afirmaciones dentro de la plantilla

El atributo `th:assert` puede especificar una lista separada por comas de expresiones que deben evaluarse y producir 
verdadero para cada evaluación, generando una excepción en caso contrario.

```html

<div th:assert="${onevar},(${twovar} != 43)">...</div>
```

Esto resulta útil para validar parámetros en una firma de fragmento:

```html

<header th:fragment="contentheader(title)" th:assert="${!#strings.isEmpty(title)}">...</header>
```

8.3 Eliminación de fragmentos de plantilla
------------------------------------------

Revisemos la última versión de nuestra plantilla de lista de productos:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
        <td>
            <span th:text="${#lists.size(prod.comments)}">2</span> comentario/s
            <a href="comments.html"
               th:href="@{/product/comments(prodId=${prod.id})}"
               th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
        </td>
    </tr>
</table>
```

Este código está bien como plantilla, pero como página estática (cuando se abre directamente en un navegador sin que 
Thymeleaf lo procese) no sería un buen prototipo.

¿Por qué? Porque, aunque los navegadores pueden visualizarla perfectamente, esa tabla solo tiene una fila, y esta fila 
contiene datos ficticios. Como prototipo, simplemente no se vería lo suficientemente realista... Deberíamos tener más de 
un producto; _necesitamos más filas_.

Así que vamos a añadir algunas:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
        <td>
            <span th:text="${#lists.size(prod.comments)}">2</span> comentario/s
            <a href="comments.html"
               th:href="@{/product/comments(prodId=${prod.id})}"
               th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
        </td>
    </tr>
    <tr class="odd">
        <td>Lechuga azul</td>
        <td>9.55</td>
        <td>no</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr>
        <td>Canela suave</td>
        <td>1.99</td>
        <td>si</td>
        <td>
            <span>3</span> comentario/s
            <a href="comments.html">ver</a>
        </td>
    </tr>
</table>
```

Bien, ya tenemos tres, definitivamente mejor para un prototipo. Pero... ¿qué pasará cuando lo procesemos con Thymeleaf?

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr>
        <td>Albahaca dulce fresca</td>
        <td>4.99</td>
        <td>si</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr class="odd">
        <td>Tomate italiano</td>
        <td>1.25</td>
        <td>no</td>
        <td>
            <span>2</span> comentario/s
            <a href="/gtvg/product/comments?prodId=2">view</a>
        </td>
    </tr>
    <tr>
        <td>Pimiento amarillo</td>
        <td>2.50</td>
        <td>si</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr class="odd">
        <td>Cheddar viejo</td>
        <td>18.75</td>
        <td>si</td>
        <td>
            <span>1</span> comentario/s
            <a href="/gtvg/product/comments?prodId=4">view</a>
        </td>
    </tr>
    <tr class="odd">
        <td>Lechuga azul</td>
        <td>9.55</td>
        <td>no</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr>
        <td>Canela suave</td>
        <td>1.99</td>
        <td>si</td>
        <td>
            <span>3</span> comentario/s
            <a href="comments.html">view</a>
        </td>
    </tr>
</table>
```

¡Las dos últimas filas son filas simuladas! Claro que sí: la iteración solo se aplicó a la primera, así que no hay razón 
para que Thymeleaf eliminara las otras dos.

Necesitamos una forma de eliminar esas dos filas durante el procesamiento de la plantilla. Usemos el atributo 
`th:remove` en la segunda y tercera etiquetas `<tr>`:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
        <td>
            <span th:text="${#lists.size(prod.comments)}">2</span> comentario/s
            <a href="comments.html"
               th:href="@{/product/comments(prodId=${prod.id})}"
               th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
        </td>
    </tr>
    <tr class="odd" th:remove="all">
        <td>Lechuga azul</td>
        <td>9.55</td>
        <td>no</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr th:remove="all">
        <td>Canela suave</td>
        <td>1.99</td>
        <td>si</td>
        <td>
            <span>3</span> comentario/s
            <a href="comments.html">ver</a>
        </td>
    </tr>
</table>
```

Una vez procesado, todo volverá a verse como debería:

```html

<table>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    <tr>
        <td>Albahaca dulce fresca</td>
        <td>4.99</td>
        <td>si</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr class="odd">
        <td>Tomate italiano</td>
        <td>1.25</td>
        <td>no</td>
        <td>
            <span>2</span> comentario/s
            <a href="/gtvg/product/comments?prodId=2">ver</a>
        </td>
    </tr>
    <tr>
        <td>Pimiento amarillo</td>
        <td>2.50</td>
        <td>si</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr class="odd">
        <td>Cheddar viejo</td>
        <td>18.75</td>
        <td>si</td>
        <td>
            <span>1</span> comentario/s
            <a href="/gtvg/product/comments?prodId=4">ver</a>
        </td>
    </tr>
</table>
```
¿Y qué pasa con el valor `all` del atributo? ¿Qué significa? Bueno, de hecho, `th:remove` puede comportarse de cinco 
maneras diferentes, según su valor:

* `all`: Elimine tanto la etiqueta contenedora como todos sus elementos secundarios.
* `body`: No elimine la etiqueta que la contiene, sino todos sus elementos secundarios.
* `tag`: Elimine la etiqueta que la contiene, pero no elimine sus etiquetas secundarias.
* `all-but-first`: Eliminar todos los hijos de la etiqueta contenedora excepto el primero.
* `none` : No hacer nada. Este valor es útil para la evaluación dinámica.

¿Para qué sirve ese valor `all-but-first`? Nos permitirá ahorrar algo de `th:remove="all"` al crear prototipos.

```html

<table>
    <thead>
    <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
        <th>COMENTARIOS</th>
    </tr>
    </thead>
    <tbody th:remove="all-but-first">
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
        <td th:text="${prod.name}">Cebollas</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">si</td>
        <td>
            <span th:text="${#lists.size(prod.comments)}">2</span> comentario/s
            <a href="comments.html"
               th:href="@{/product/comments(prodId=${prod.id})}"
               th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
        </td>
    </tr>
    <tr class="odd">
        <td>Lechuga azul</td>
        <td>9.55</td>
        <td>no</td>
        <td>
            <span>0</span> comentario/s
        </td>
    </tr>
    <tr>
        <td>Canela suave</td>
        <td>1.99</td>
        <td>si</td>
        <td>
            <span>3</span> comentario/s
            <a href="comments.html">ver</a>
        </td>
    </tr>
    </tbody>
</table>
```

El atributo `th:remove` puede tomar cualquier _Expresión estándar de Thymeleaf_, siempre que devuelva uno de los valores 
de cadena permitidos (`all`, `tag`, `body`, `all-but-first` o `none`).

Esto significa que las eliminaciones podrían ser condicionales, como:

```html
<a href="/something" th:remove="${condition}? tag : none">El texto del enlace no debe eliminarse</a>
```

Tenga en cuenta también que `th:remove` considera `null` como sinónimo de `none`, por lo que lo siguiente funciona 
exactamente como el ejemplo anterior:

```html
<a href="/something" th:remove="${condition}? tag">El texto del enlace no debe eliminarse</a>
```

En este caso, si `${condition}` es falso, se devolverá `null` y, por lo tanto, no se realizará ninguna eliminación.


9\. Variables locales
=====================

Thymeleaf denomina _variables locales_ a aquellas variables definidas para un fragmento específico de una plantilla y 
que solo están disponibles para su evaluación dentro de ese fragmento.

Un ejemplo que ya hemos visto es la variable iter `prod` en nuestra página de lista de productos:

```html

<tr th:each="prod : ${prods}">
    ...
</tr>
```

La variable `prod` solo estará disponible dentro de los enlaces de la etiqueta `<tr>`. En concreto:

* Estará disponible para cualquier otro atributo `th:*` que se ejecute en esa etiqueta con menos _precedencia_ que 
  `th:each` (lo que significa que se ejecutarán después de `th:each`).
* Estará disponible para cualquier elemento secundario de la etiqueta `<tr>`, como los elementos `<td>`.

Thymeleaf ofrece una forma de declarar variables locales sin iteración. Se trata del atributo `th:with`, y su sintaxis 
es similar a la de las asignaciones de valores de atributos:

```html

<div th:with="firstPer=${persons[0]}">
    <p>
      El nombre de la primera persona es <span th:text="${firstPer.name}">Julius Caesar</span>.
    </p>
</div>
```
Cuando se procesa `th:with`, esa variable `firstPer` se crea como una variable local y se agrega al mapa de variables 
que proviene del contexto, de modo que esté tan disponible para la evaluación como cualquier otra variable declarada en 
el contexto desde el principio, pero solo dentro de los límites de la etiqueta `<div>` que la contiene.

Puede definir varias variables al mismo tiempo utilizando la sintaxis de asignación múltiple habitual:

```html

<div th:with="firstPer=${persons[0]},secondPer=${persons[1]}">
    <p>
      El nombre de la primera persona es <span th:text="${firstPer.name}">Julius Caesar</span>.
    </p>
    <p>
      Pero el nombre de la segunda persona es
        <span th:text="${secondPer.name}">Marcus Antonius</span>.
    </p>
</div>
```

El atributo `th:with` permite reutilizar variables definidas en el mismo atributo:

```html

<div th:with="company=${user.company + ' Co.'},account=${accounts[company]}">...</div>
```

¡Usemos esto en la página principal de nuestra tienda de comestibles! ¿Recuerdas el código que escribimos para mostrar 
una fecha con formato?

```html
<p>
    Hoy es:
    <span th:text="${#calendars.format(today,'dd MMMM yyyy')}">13 febrero 2011</span>
</p>
```

¿Y si quisiéramos que el `"dd MMMM yyyy"` dependiera de la configuración regional? Por ejemplo, podríamos añadir el 
siguiente mensaje a `home_en.properties`:

```
date.format=MMMM dd'','' yyyy
```

...Y un equivalente a nuestro `home_es.properties`:

```
date.format=dd ''de'' MMMM'','' yyyy
```

Ahora, usemos `th:with` para obtener el formato de fecha localizado en una variable y luego usarlo en nuestra expresión 
`th:text`:

```html
<p th:with="df=#{date.format}">
    Hoy es: <span th:text="${#calendars.format(today,df)}">13 febrero 2011</span>
</p>
```
Eso fue claro y sencillo. De hecho, dado que `th:with` tiene mayor `precedencia` que `th:text`, podríamos haberlo 
resuelto todo en la etiqueta `span`:

```html
<p>
  Hoy es:
    <span th:with="df=#{date.format}"
          th:text="${#calendars.format(today,df)}">13 febrero 2011</span>
</p>
```

Quizás estés pensando: ¿Precedencia? ¡Aún no hemos hablado de eso! Bueno, no te preocupes, porque de eso trata 
precisamente el siguiente capítulo.




10\. Precedencia de atributos
 =============================

¿Qué ocurre al escribir más de un atributo `th:*` en la misma etiqueta? Por ejemplo:

```html

<ul>
    <li th:each="item : ${items}" th:text="${item.description}">Descripción del artículo aquí...</li>
</ul>
```
Por supuesto, esperaríamos que el atributo `th:each` se ejecutara antes que `th:text` para obtener los resultados 
deseados, pero dado que el estándar DOM (Document Object Model) no le da ningún significado al orden en que se escriben 
los atributos de una etiqueta, se debe establecer un mecanismo de _precedencia_ en los propios atributos para garantizar 
que esto funcione como se espera.

Por lo tanto, todos los atributos de Thymeleaf definen una precedencia numérica que establece el orden en que se 
ejecutan en la etiqueta. Este orden es:

| Orden | Característica                                 | Atributos         |
|------:|:-----------------------------------------------|:------------------|
|     1 | Inclusión de fragmentos                        | `th:include`\     |
|       |                                                | `th:replace`      |
|     2 | Iteración de fragmentos                        | `th:each`         |
|     3 | Evaluación condicional                         | `th:if`\          |
|       |                                                | `th:unless`\      |
|       |                                                | `th:switch`\      |
|       |                                                | `th:case`         |
|     4 | Definición de variable local                   | `th:object`\      |
|       |                                                | `th:with`         |
|     5 | Modificación de atributos generales            | `th:attr`\        |
|       |                                                | `th:attrprepend`\ |
|       |                                                | `th:attrappend`   |
|     6 | Modificación de atributos específicos          | `th:value`\       |
|       |                                                | `th:href`\        |
|       |                                                | `th:src`\         |
|       |                                                | `...`             |
|     7 | Texto (modificación del cuerpo de la etiqueta) | `th:text`\        |
|       |                                                | `th:utext`        |
|     8 | Especificación de fragmentos                   | `th:fragment`     |
|     9 | Eliminación de fragmentos                      | `th:remove`       |

Este mecanismo de precedencia significa que el fragmento de iteración anterior dará exactamente los mismos resultados si 
se invierte la posición del atributo (aunque sería un poco menos legible):

```html

<ul>
    <li th:text="${item.description}" th:each="item : ${items}">Descripción del artículo aquí...</li>
</ul>
```

11\. Comentarios y bloques
==========================

11.1. Comentarios HTML/XML estándar
-----------------------------------
Los comentarios HTML/XML estándar `<!-- ... -->` se pueden usar en cualquier parte de las plantillas de thymeleaf. El 
contenido de estos comentarios no será procesado ni por Thymeleaf ni por el navegador, y se copiará textualmente al 
resultado:

```html
<!-- A continuación se muestra la información del usuario -->
<div th:text="${...}">
    ...
</div>
```

11.2. Bloques de comentarios a nivel de analizador de Thymeleaf
---------------------------------------------------------------

Los bloques de comentarios a nivel de analizador son código que simplemente se eliminará de la plantilla cuando 
thymeleaf la analice. Tienen este aspecto:

```html
<!--/* ¡Este código se eliminará en el momento del análisis de thymeleaf! */-->
``` 
Thymeleaf eliminará absolutamente todo entre `<!--/*` y `*/-->`, por lo que estos bloques de comentarios también se 
pueden usar para mostrar código cuando una plantilla está abierta estáticamente, sabiendo que se eliminará cuando 
thymeleaf lo procese:

```html
<!--/*-->
<div>
  ¡Sólo puedes verme antes de que Thymeleaf me procese!
</div>
<!--*/-->
```

Esto podría resultar muy útil para crear prototipos de tablas con muchos `<tr>`, por ejemplo:

```html

<table>
    <tr th:each="x : ${xs}">
        ...
    </tr>
    <!--/*-->
    <tr>
        ...
    </tr>
    <tr>
        ...
    </tr>
    <!--*/-->
</table>
```

11.3. Bloques de comentarios exclusivos del prototipo de Thymeleaf
------------------------------------------------------------------

Thymeleaf permite la definición de bloques de comentarios especiales marcados como comentarios cuando la plantilla está 
abierta estáticamente (es decir, como un prototipo), pero que Thymeleaf considera como marcado normal cuando ejecuta la 
plantilla.

```html
<span>¡hola!</span>
<!--/*/
  <div th:text="${...}">
    ...
  </div>
/*/-->
<span>¡adiós!</span>
```

El sistema de análisis de Thymeleaf simplemente eliminará los marcadores `<!--/*/` y `/*/-->`, pero no su contenido, que 
quedará sin comentar. Por lo tanto, al ejecutar la plantilla, Thymeleaf verá esto:

```html
<span>¡hola!</span>

<div th:text="${...}">
    ...
</div>

<span>¡adiós!</span>
```

Al igual que sucede con los bloques de comentarios a nivel de analizador, tenga en cuenta que esta característica es 
independiente del dialecto.


11.4. Etiqueta sintética `th:block`
-----------------------------------

El único procesador de elementos (no un atributo) de Thymeleaf incluido en los dialectos estándar es `th:block`.

`th:block` es un simple contenedor de atributos que permite a los desarrolladores de plantillas especificar los 
atributos que deseen. Thymeleaf ejecutará estos atributos y luego simplemente hará que el bloque desaparezca sin dejar 
rastro.

Por lo tanto, podría ser útil, por ejemplo, al crear tablas iteradas que requieren más de un `<tr>` para cada elemento:


```html

<table>
    <th:block th:each="user : ${users}">
        <tr>
            <td th:text="${user.login}">...</td>
            <td th:text="${user.name}">...</td>
        </tr>
        <tr>
            <td colspan="2" th:text="${user.address}">...</td>
        </tr>
    </th:block>
</table>
```

Y especialmente útil cuando se usa en combinación con bloques de comentarios exclusivos de prototipos:

```html

<table>
    <!--/*/ <th:block th:each="user : ${users}"> /*/-->
    <tr>
        <td th:text="${user.login}">...</td>
        <td th:text="${user.name}">...</td>
    </tr>
    <tr>
        <td colspan="2" th:text="${user.address}">...</td>
    </tr>
    <!--/*/ </th:block> /*/-->
</table>
```

Tenga en cuenta cómo esta solución permite que las plantillas sean HTML válido (sin necesidad de agregar bloques 
prohibidos `<div>` dentro de `<table>`), ¡y aún funciona correctamente cuando se abren estáticamente en navegadores como 
prototipos!




12\. Inserción en línea
=======================



12.1 Inserción de texto en línea
--------------------------------

Aunque el dialecto estándar nos permite hacer casi todo lo necesario mediante atributos de etiqueta, hay situaciones en 
las que podríamos preferir escribir expresiones directamente en nuestros textos HTML. Por ejemplo, podríamos preferir 
escribir esto:

```html
<p>Hola, [[${session.user.name}]]!</p>
```

...En lugar de esto:

```html
<p>Hola, <span th:text="${session.user.name}">Sebastian</span>!</p>
```

Las expresiones entre `[[...]]` se consideran expresiones en línea en Thymeleaf, y en ellas se puede usar cualquier tipo 
de expresión que también sería válida en un atributo `th:text`.

Para que la inserción funcione, debemos activarla mediante el atributo `th:inline`, que tiene tres valores o modos 
posibles (`text`, `javascript` y `none`). Probemos con `text`:

```html
<p th:inline="text">Hola, [[${session.user.name}]]!</p>
```

La etiqueta que contiene `th:inline` no tiene que ser la que contiene las expresiones en línea, cualquier etiqueta 
principal serviría:

```html

<body th:inline="text">

...

<p>Hola, [[${session.user.name}]]!</p>

...

</body>
```
Así que ahora te estarás preguntando: _¿Por qué no hacemos esto desde el principio? ¡Es menos código que todos esos 
atributos_ `th:text`! Bueno, ten cuidado, porque aunque la inserción en línea te parezca interesante, siempre debes 
recordar que las expresiones en línea se mostrarán textualmente en tus archivos HTML al abrirlos estáticamente, ¡así que 
probablemente ya no podrás usarlas como prototipos!

La diferencia entre cómo un navegador mostraría estáticamente nuestro fragmento de código sin utilizar incrustación...

```html
Hola, Sebastian!
```

...y usarlo...

```html
Hola, [[${session.user.name}]]!
```

...es bastante claro.



12.2 Inserción de scripts en línea (JavaScript y Dart)
------------------------------------------------------

Thymeleaf ofrece una serie de "modos de scripting" para sus capacidades de inlineado, lo que permite integrar los datos 
en scripts creados en algunos lenguajes de script.

Los modos de scripting actuales son `javascript` (`th:inline="javascript"`) y `dart` (`th:inline="dart"`).

Lo primero que podemos hacer con el inlineado de scripts es escribir el valor de las expresiones en nuestros scripts, 
como:

```html

<script th:inline="javascript">
    /*<![CDATA[*/
    ...

    var username = /*[[${session.user.name}]]*/ 'Sebastian';

    ...
    /*]]>*/
</script>
```

La sintaxis `/*[[...]]*/` indica a Thymeleaf que evalúe la expresión contenida. Pero hay más implicaciones aquí:

* Al ser un comentario de JavaScript (`/*...*/`), nuestra expresión será ignorada al mostrar la página estáticamente en 
  un navegador.
* El código después de la expresión en línea (`'Sebastian'`) se ejecutará al mostrar la página estáticamente.
* Thymeleaf ejecutará la expresión e insertará el resultado, pero también eliminará todo el código en la línea después 
  de la expresión en línea (la parte que se ejecuta cuando se muestra estáticamente).

Entonces el resultado de ejecutar esto será:

```html

<script th:inline="javascript">
    /*<![CDATA[*/
    ...

    var username = 'John Apricot';

    ...
    /*]]>*/
</script>
```

También puedes hacerlo sin comentarios con los mismos efectos, pero eso hará que tu script falle al cargarse 
estáticamente.

```html

<script th:inline="javascript">
    /*<![CDATA[*/
    ...

    var username = [[${session.user.name}]];

    ...
    /*]]>*/
</script>
```

Tenga en cuenta que esta evaluación es inteligente y no se limita a cadenas. Thymeleaf escribirá correctamente en 
sintaxis Javascript/Dart los siguientes tipos de objetos:

* Cadenas
* Números
* Booleanos
* Matriz
* Colecciones
* Mapas
* Beans (objetos con métodos _getter_ y _setter_)

Por ejemplo, si tuviéramos el siguiente código:

```html

<script th:inline="javascript">
    /*<![CDATA[*/
    ...

    var user = /*[[${session.user}]]*/ null;

    ...
    /*]]>*/
</script>
```

Esa expresión `${session.user}` se evaluará como un objeto `User` y Thymeleaf la convertirá correctamente a la sintaxis 
de JavaScript:

```html

<script th:inline="javascript">
    /*<![CDATA[*/
    ...

    var user = {
        'age': null, 'firstName': 'John', 'lastName': 'Apricot',
        'name': 'John Apricot', 'nationality': 'Antarctica'
    };

    ...
    /*]]>*/
</script>
```

### Añadiendo código

Una característica adicional al usar la incrustación de JavaScript es la capacidad de incluir código entre una sintaxis 
de comentario especial `/*[+...+]*/` para que Thymeleaf descomente automáticamente ese código al procesar la plantilla:

```javascript
var x = 23;

/*[+

var msg  = 'Esta es una aplicación funcional';

+]*/

var f = function () {
...
```

Se ejecutará como:

```javascript
var x = 23;

var msg = 'Esta es una aplicación funcional';

var f = function () {
...
```

Puedes incluir expresiones dentro de estos comentarios y se evaluarán:

```javascript
var x = 23;

/*[+

var msg  = 'Hola, ' + [[${session.user.name}]];

+]*/

var f = function () {
...
```

### Eliminando código

También es posible hacer que Thymeleaf elimine el código entre los comentarios especiales `/*[- */` y `/* -]*/`, de la 
siguiente manera:

```javascript
var x = 23;

/*[- */

var msg = 'Esta es una plantilla que no funciona';

/* -]*/

var f = function () {
...
```

13\. Validación y tipos de documentos
=====================================

13.1 Validación de plantillas
-----------------------------

As mentioned before, Thymeleaf offers us out-of-the-box two standard template modes that validate our templates before 
processing them: `VALIDXML` and `VALIDXHTML`.
These modes require our templates to be not only _well-formed XML_ (which they should always be), but in fact valid 
according to the specified `DTD`.

The problem is that if we use the `VALIDXHTML` mode with templates including a `DOCTYPE` clause such as this:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

...we are going to obtain validation errors because the `th:*` tags do not exist according to that `DTD.` That's 
perfectly normal, as the W3C obviously has no reason to include Thymeleaf's features in their standards but, how do we 
solve it? By changing the `DTD.`

Thymeleaf includes a set of `DTD` files that mirror the original ones from the XHTML standards, but adding all the 
available `th:*` attributes from the Standard Dialect. That's why we have been using this in our templates:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">
```

That `SYSTEM` identifier instructs the Thymeleaf parser to resolve the special Thymeleaf-enabled `XHTML 1.0 Strict DTD` 
file and use it for validating our template. And don't worry about that `http` thing, because that is only an 
identifier, and the `DTD` file will be locally read from Thymeleaf's jar files.

> Note that because this DOCTYPE declaration is a perfectly valid one, if we open a browser to statically display our 
> template as a prototype it will be rendered in _Standards Mode_.

Here you have the complete set of Thymeleaf-enabled `DTD` declarations for all the supported flavours of XHTML:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-transitional-thymeleaf-4.dtd">
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-frameset-thymeleaf-4.dtd">
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml11-thymeleaf-4.dtd">
```

Also note that, in order for your IDE to be happy, and even if you are not working in a validating mode, you will need 
to declare the `th` namespace in your `html` tag:

```html

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
```

13.2 Traducción de Doctype
--------------------------

It is fine for our templates to have a `DOCTYPE` like:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">
```

But it would not be fine for our web applications to send XHTML documents with this `DOCTYPE` to client browsers, 
because:

* They are not `PUBLIC` (they are `SYSTEM DOCTYPE`s), and therefore our web would not be validatable with the W3C 
  Validators.
* They are not needed, because once processed, all `th:*` tags will have dissapeared.

That's why Thymeleaf includes a mechanism for _DOCTYPE translation_, which will automatically translate your 
thymeleaf-specific XHTML `DOCTYPE`s into standard `DOCTYPE`s.

For example, if your template is _XHTML 1.0 Strict_ and looks like this:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
...
</html>
```

After making Thymeleaf process the template, your resulting XHTML will look like this:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
...
</html>
```

You don't have to do anything for these transformations to take place: Thymeleaf will take care of them automatically.




14\. Algunas páginas más para nuestra tienda de comestibles
===========================================================

Now we know a lot about using Thymeleaf, we can add some new pages to our website for order management.

Note that we will focus on XHTML code, but you can have a look at the bundled source code if you want to see the 
corresponding controllers.



14.1 Lista de pedidos
---------------------

Let's start by creating an order list page, `/WEB-INF/templates/order/list.html`:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

<head>

    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" media="all"
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}"/>
</head>

<body>

<h1>Order list</h1>

<table>
    <tr>
        <th>DATE</th>
        <th>CUSTOMER</th>
        <th>TOTAL</th>
        <th></th>
    </tr>
    <tr th:each="o : ${orders}" th:class="${oStat.odd}? 'odd'">
        <td th:text="${#calendars.format(o.date,'dd/MMM/yyyy')}">13 jan 2011</td>
        <td th:text="${o.customer.name}">Frederic Tomato</td>
        <td th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}">23.32</td>
        <td>
            <a href="details.html" th:href="@{/order/details(orderId=${o.id})}">ver</a>
        </td>
    </tr>
</table>

<p>
    <a href="../home.html" th:href="@{/}">Return to home</a>
</p>

</body>

</html>
```

There's nothing here that should surprise us, except for this little bit of OGNL magic:

```html

<td th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}">23.32</td>
```

What that does is, for each order line (`OrderLine` object) in the order, multiply its `purchasePrice` and `amount` 
properties (by calling the corresponding `getPurchasePrice()` and `getAmount()` methods) and return the result into a 
list of numbers, later aggregated by the `#aggregates.sum(...)` function in order to obtain the order total price.

You've got to love the power of OGNL.

14.2 Detalles del pedido
------------------------

Now for the order details page, in which we will make a heavy use of asterisk syntax:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

<head>
    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" media="all"
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}"/>
</head>

<body th:object="${order}">

<h1>Order details</h1>

<div>
    <p><b>Code:</b> <span th:text="*{id}">99</span></p>
    <p>
        <b>Date:</b>
        <span th:text="*{#calendars.format(date,'dd MMM yyyy')}">13 jan 2011</span>
    </p>
</div>

<h2>Customer</h2>

<div th:object="*{customer}">
    <p><b>Name:</b> <span th:text="*{name}">Frederic Tomato</span></p>
    <p>
        <b>Since:</b>
        <span th:text="*{#calendars.format(customerSince,'dd MMM yyyy')}">1 jan 2011</span>
    </p>
</div>

<h2>Products</h2>

<table>
    <tr>
        <th>PRODUCT</th>
        <th>AMOUNT</th>
        <th>PURCHASE PRICE</th>
    </tr>
    <tr th:each="ol,row : *{orderLines}" th:class="${row.odd}? 'odd'">
        <td th:text="${ol.product.name}">Strawberries</td>
        <td th:text="${ol.amount}" class="number">3</td>
        <td th:text="${ol.purchasePrice}" class="number">23.32</td>
    </tr>
</table>

<div>
    <b>TOTAL:</b>
    <span th:text="*{#aggregates.sum(orderLines.{purchasePrice * amount})}">35.23</span>
</div>

<p>
    <a href="list.html" th:href="@{/order/list}">Return to order list</a>
</p>

</body>

</html>
```

Not much really new here, except for this nested object selection:

```html

<body th:object="${order}">

...

<div th:object="*{customer}">
    <p><b>Name:</b> <span th:text="*{name}">Frederic Tomato</span></p>
    ...
</div>

...
</body>
```

...which makes that `*{name}` in fact equivalent to:

```html
<p><b>Name:</b> <span th:text="${order.customer.name}">Frederic Tomato</span></p>
```

15\. Más sobre la configuración
===============================



15.1 Resolvedores de plantillas
-------------------------------

For our Good Thymes Virtual Grocery, we chose an `ITemplateResolver` implementation called 
`ServletContextTemplateResolver` that allowed us to obtain templates as resources from the Servlet Context.

Besides giving you the ability to create your own template resolver by implementing `ITemplateResolver,` Thymeleaf 
includes three other implementations out of the box:

* `org.thymeleaf.templateresolver.ClassLoaderTemplateResolver`, which resolves templates as classloader resources, like:

   ```java
   return Thread.currentThread().getContextClassLoader().getResourceAsStream(templateName);
   ```

* `org.thymeleaf.templateresolver.FileTemplateResolver`, which resolves templates as files from the file system, like:

   ```java
   return new FileInputStream(new File(templateName));
   ```

* `org.thymeleaf.templateresolver.UrlTemplateResolver`, which resolves templates as URLs (even non-local ones), like:

   ```java
   return (new URL(templateName)).openStream();
   ```

All of the pre-bundled implementations of `ITemplateResolver` allow the same set of configuration parameters, which 
include:

* Prefix and suffix (as already seen):

   ```java
   templateResolver.setPrefix("/WEB-INF/templates/");
   templateResolver.setSuffix(".html");
   ```

* Template aliases that allow the use of template names that do not directly correspond to file names. If both 
suffix/prefix and alias exist, alias will be applied before prefix/suffix:

   ```java
   templateResolver.addTemplateAlias("adminHome","profiles/admin/home");
   templateResolver.setTemplateAliases(aliasesMap);
   ```

* Encoding to be applied when reading templates:

   ```java
   templateResolver.setEncoding("UTF-8");
   ```

* Default template mode, and patterns for defining other modes for specific
  templates:

   ```java
   // Default is TemplateMode.XHTML
   templateResolver.setTemplateMode("HTML5");
   templateResolver.getXhtmlTemplateModePatternSpec().addPattern("*.xhtml");
   ```

* Default mode for template cache, and patterns for defining whether specific templates are cacheable or not:

   ```java
   // Default is true
   templateResolver.setCacheable(false);
   templateResolver.getCacheablePatternSpec().addPattern("/users/*");
   ```

* TTL in milliseconds for parsed template cache entries originated in this template resolver. If not set, the only way 
to remove an entry from the cache  will be LRU (cache max size exceeded and the entry is the oldest).

   ```java
   // Default is no TTL (only LRU would remove entries)
   templateResolver.setCacheTTLMs(60000L);
   ```

Also, a Template Engine can be specified several template resolvers, in which case an order can be established between 
them for template resolution so that, if the first one is not able to resolve the template, the second one is asked, and 
so on:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.

setOrder(Integer.valueOf(1));

ServletContextTemplateResolver servletContextTemplateResolver = new ServletContextTemplateResolver();
servletContextTemplateResolver.

setOrder(Integer.valueOf(2));

        templateEngine.

addTemplateResolver(classLoaderTemplateResolver);
templateEngine.

addTemplateResolver(servletContextTemplateResolver);
```

When several template resolvers are applied, it is recommended to specify patterns for each template resolver so that 
Thymeleaf can quickly discard those template resolvers that are not meant to resolve the template, enhancing 
performance. Doing this is not a requirement, but an optimization:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.

setOrder(Integer.valueOf(1));
// This classloader will not be even asked for any templates not matching these patterns 
        classLoaderTemplateResolver.

getResolvablePatternSpec().

addPattern("/layout/*.html");
classLoaderTemplateResolver.

getResolvablePatternSpec().

addPattern("/menu/*.html");

ServletContextTemplateResolver servletContextTemplateResolver = new ServletContextTemplateResolver();
servletContextTemplateResolver.

setOrder(Integer.valueOf(2));
```

15.2 Resolvedores de mensajes
-----------------------------

We did not explicitly specify a Message Resolver implementation for our Grocery application, and as it was explained 
before, this meant that the implementation being used was an `org.thymeleaf.messageresolver.StandardMessageResolver` 
object.

This `StandardMessageResolver,` which looks for messages files with the same name as the template in the way already 
explained, is in fact the only message resolver implementation offered by Thymeleaf core out of the box, although of
course you can create your own by just implementing the `org.thymeleaf.messageresolver.IMessageResolver` interface.

> The Thymeleaf + Spring integration packages offer an `IMessageResolver` implementation which uses the standard Spring 
> way of retrieving externalized messages, by using `MessageSource` objects.

What if you wanted to add a message resolver (or more) to the Template Engine? Easy:

```java
// For setting only one
templateEngine.setMessageResolver(messageResolver);

// For setting more than one
templateEngine.

addMessageResolver(messageResolver);
```

And why would you want to have more than one message resolver? for the same reason as template resolvers: message 
resolvers are ordered and if the first one cannot resolve a specific message, the second one will be asked, then the 
third, etc.



15.3 Registro
-------------

Thymeleaf pays quite a lot of attention to logging, and always tries to offer the maximum amount of useful information 
through its logging interface.

The logging library used is `slf4j,` which in fact acts as a bridge to whichever logging implementation you might want 
to use in your application (for example, `log4j`).

Thymeleaf classes will log `TRACE`, `DEBUG` and `INFO`-level information, depending on the level of detail you desire, 
and besides general logging it will use three special loggers associated with the TemplateEngine class which you can
configure separately for different purposes:

* `org.thymeleaf.TemplateEngine.CONFIG` will output detailed configuration of  the library during initialization.
* `org.thymeleaf.TemplateEngine.TIMER` will output information about the amount  of time taken to process each template 
  (useful for benchmarking!)
* `org.thymeleaf.TemplateEngine.cache` is the prefix for a set of loggers that output specific information about the 
  caches. Although the names of the cache loggers are configurable by the user and thus could change, by default they
  are:
    * `org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.FRAGMENT_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.MESSAGE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.EXPRESSION_CACHE`

An example configuration for Thymeleaf's logging infrastructure, using `log4j`, could be:

```
log4j.logger.org.thymeleaf=DEBUG
log4j.logger.org.thymeleaf.TemplateEngine.CONFIG=TRACE
log4j.logger.org.thymeleaf.TemplateEngine.TIMER=TRACE
log4j.logger.org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE=TRACE
```

16\. Caché de plantillas
========================

Thymeleaf works thanks to a DOM processing engine and a series of processors ---one for each type of node that needs to 
apply logic--- that modify the document's DOM tree in order to create the results you expect by combining this tree with
your data.

It also includes ---by default--- a cache that stores parsed templates, this is, the DOM trees resulting from reading 
and parsing template files before processing them. This is especially useful when working in a web application, and 
builds on the following concepts:

* Input/Output is almost always the slowest part of any application. In-memory process is extremely quick compared to 
it.
* Cloning an existing in-memory DOM-tree is always much quicker than reading a template file, parsing it and creating a 
new DOM object tree for it.
* Web applications usually only have a few dozen templates.
* Template files are small-to-medium size, and they are not modified while the application is running.

This all leads to the idea that caching the most used templates in a web application is feasible without wasting big 
amounts of memory, and also that it will save a lot of time that would be spent on input/output operations on a
small set of files that, in fact, never change.

And how can we take control of this cache? First, we've learned before that we can enable or disable it at the Template 
Resolver, even acting only on specific templates:

```java
// Default is true
templateResolver.setCacheable(false);
templateResolver.

getCacheablePatternSpec().

addPattern("/users/*");
```

Also, we could modify its configuration by establishing our own _Cache Manager_ object, which could be an instance of 
the default `StandardCacheManager` implementation:

```java
// Default is 50
StandardCacheManager cacheManager = new StandardCacheManager();
cacheManager.

setTemplateCacheMaxSize(100);
...
        templateEngine.

setCacheManager(cacheManager);
```

Refer to the javadoc API of `org.thymeleaf.cache.StandardCacheManager` for more info on configuring the caches.

Entries can be manually removed from the template cache:

```java
// Clear the cache completely
templateEngine.clearTemplateCache();

// Clear a specific template from the cache
templateEngine.

clearTemplateCacheFor("/users/userList");
```

17\. Apéndice A: Objetos básicos de expresión {#apendice-a-expresion-objetos-basicos}
=====================================================================================

Some objects and variable maps are always available to be invoked at variable expressions (executed by OGNL or
SpringEL). Let's see them:

### Base objects

* **\#ctx** : the context object. It will be an implementation of `org.thymeleaf.context.IContext`,
`org.thymeleaf.context.IWebContext` depending on our environment (standalone or web). If we are  using the 
 _Spring integration module_, it will be an instance of  `org.thymeleaf.spring[3|4].context.SpringWebContext`.

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.IContext
 * ======================================================================
 */

$ {#ctx.locale
}

$ {#ctx.variables
}

/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.IWebContext
 * ======================================================================
 */

$ {#ctx.applicationAttributes
}

$ {#ctx.httpServletRequest
}

$ {#ctx.httpServletResponse
}

$ {#ctx.httpSession
}

$ {#ctx.requestAttributes
}

$ {#ctx.requestParameters
}

$ {#ctx.servletContext
}

$ {#ctx.sessionAttributes
}
```

* **\#locale** : direct access to the `java.util.Locale` associated with current request.

```java
$ {#locale
}
```

* **\#vars** : an instance of `org.thymeleaf.context.VariablesMap` with all the variables in the Context  (usually the 
* variables contained in `#ctx.variables` plus local ones).

Unqualified expressions are evaluated against this object. In fact, `${something}` is completely equivalent  to (but 
more beautiful than) `${#vars.something}`.

  `#root` is a synomyn for the same object.

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.VariablesMap
 * ======================================================================
 */

$ {#vars.get('foo')
}

$ {#vars.containsKey('foo')
}

$ {#vars.size()
}
...
```

###Espacios de nombres de contexto web para atributos de solicitud/sesión, etc.

When using Thymeleaf in a web environment, we can use a series of shortcuts for accessing request parameters, session
attributes and application attributes:

> Note these are not *context objects*, but maps added to the context as variables, so we access them without `#`. In
> some way, therefore, they act as *namespaces*.

* **param** : for retrieving request parameters. `${param.foo}` is a  `String[]` with the values of the `foo` request 
parameter, so `${param.foo[0]}` will normally be used for getting the first value.

```java
/*
 * ============================================================================
 * See javadoc API for class org.thymeleaf.context.WebRequestParamsVariablesMap
 * ============================================================================
 */

$ {
    param.foo
}              // Retrieves a String[] with the values of request parameter 'foo'

$ {
    param.size()
}

$ {
    param.isEmpty()
}

$ {
    param.containsKey('foo')
}
...
```

* **session** : for retrieving session attributes.

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.WebSessionVariablesMap
 * ======================================================================
 */

$ {
    session.foo
}                 // Retrieves the session atttribute 'foo'

$ {
    session.size()
}

$ {
    session.isEmpty()
}

$ {
    session.containsKey('foo')
}
...
```

* **application** : for retrieving application/servlet context attributes.

```java
/*
 * =============================================================================
 * See javadoc API for class org.thymeleaf.context.WebServletContextVariablesMap
 * =============================================================================
 */

$ {
    application.foo
}              // Retrieves the ServletContext atttribute 'foo'

$ {
    application.size()
}

$ {
    application.isEmpty()
}

$ {
    application.containsKey('foo')
}
...
```

Note there is **no need to specify a namespace for accessing request attributes** (as opposed to *request parameters*)
because all request attributes are automatically added to the context as variables in the context root:

```java
$ {
    myRequestAttribute
}
```

### Objetos de contexto web

Inside a web environment there is also direct access to the following objects (note these are objects, not
maps/namespaces):

* **\#httpServletRequest** : direct access to the `javax.servlet.http.HttpServletRequest` object associated with the
  current request.

```java
$ {#httpServletRequest.getAttribute('foo')
}

$ {#httpServletRequest.getParameter('foo')
}

$ {#httpServletRequest.getContextPath()
}

$ {#httpServletRequest.getRequestName()
}
...
```

* **\#httpSession** : direct access to the `javax.servlet.http.HttpSession` object associated with the current request.

```java
$ {#httpSession.getAttribute('foo')
}

$ {#httpSession.id
}

$ {#httpSession.lastAccessedTime
}
...
```

### Objetos de contexto de Spring

If you are using Thymeleaf from Spring, you can also access these objects:

* **\#themes** : provides the same features as the Spring `spring:theme` JSP tag.

```java
$ {#themes.code('foo')
}
```

### Beans de Spring

Thymeleaf also allows accessing beans registered at your Spring Application Context in the standard way defined by
Spring EL, which is using the syntax `@beanName`, for example:

```html

<div th:text="${@authService.getUserName()}">...</div>
```

18\. Apéndice B: Objetos de utilidad de expresión {#apendice-b-expresion-objetos-de-utilidad}
=============================================================================================

### Fechas

* **\#dates** : utility methods for `java.util.Date` objects:

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Dates
 * ======================================================================
 */

/*
 * Format date with the standard locale format
 * Also works with arrays, lists or sets
 */
$ {#dates.format(date)
}

$ {#dates.arrayFormat(datesArray)
}

$ {#dates.listFormat(datesList)
}

$ {#dates.setFormat(datesSet)
}

/*
 * Format date with the ISO8601 format
 * Also works with arrays, lists or sets
 */
$ {#dates.formatISO(date)
}

$ {#dates.arrayFormatISO(datesArray)
}

$ {#dates.listFormatISO(datesList)
}

$ {#dates.setFormatISO(datesSet)
}

/*
 * Format date with the specified pattern
 * Also works with arrays, lists or sets
 */
$ {#dates.format(date, 'dd/MMM/yyyy HH:mm')
}

$ {#dates.arrayFormat(datesArray, 'dd/MMM/yyyy HH:mm')
}

$ {#dates.listFormat(datesList, 'dd/MMM/yyyy HH:mm')
}

$ {#dates.setFormat(datesSet, 'dd/MMM/yyyy HH:mm')
}

/*
 * Obtain date properties
 * Also works with arrays, lists or sets
 */
$ {#dates.day(date)
}                    // also arrayDay(...), listDay(...), etc.

$ {#dates.month(date)
}                  // also arrayMonth(...), listMonth(...), etc.

$ {#dates.monthName(date)
}              // also arrayMonthName(...), listMonthName(...), etc.

$ {#dates.monthNameShort(date)
}         // also arrayMonthNameShort(...), listMonthNameShort(...), etc.

$ {#dates.year(date)
}                   // also arrayYear(...), listYear(...), etc.

$ {#dates.dayOfWeek(date)
}              // also arrayDayOfWeek(...), listDayOfWeek(...), etc.

$ {#dates.dayOfWeekName(date)
}          // also arrayDayOfWeekName(...), listDayOfWeekName(...), etc.

$ {#dates.dayOfWeekNameShort(date)
}     // also arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.

$ {#dates.hour(date)
}                   // also arrayHour(...), listHour(...), etc.

$ {#dates.minute(date)
}                 // also arrayMinute(...), listMinute(...), etc.

$ {#dates.second(date)
}                 // also arraySecond(...), listSecond(...), etc.

$ {#dates.millisecond(date)
}            // also arrayMillisecond(...), listMillisecond(...), etc.

/*
 * Create date (java.util.Date) objects from its components
 */
$ {#dates.create(year, month, day)
}

$ {#dates.create(year, month, day, hour, minute)
}

$ {#dates.create(year, month, day, hour, minute, second)
}

$ {#dates.create(year, month, day, hour, minute, second, millisecond)
}

/*
 * Create a date (java.util.Date) object for the current date and time
 */
$ {#dates.createNow()
}

$ {#dates.createNowForTimeZone()
}

/*
 * Create a date (java.util.Date) object for the current date (time set to 00:00)
 */
$ {#dates.createToday()
}

$ {#dates.createTodayForTimeZone()
}
```

### Calendarios

* **\#calendars** : analogous to `#dates`, but for `java.util.Calendar` objects:

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Calendars
 * ======================================================================
 */

/*
 * Format calendar with the standard locale format
 * Also works with arrays, lists or sets
 */
$ {#calendars.format(cal)
}

$ {#calendars.arrayFormat(calArray)
}

$ {#calendars.listFormat(calList)
}

$ {#calendars.setFormat(calSet)
}

/*
 * Format calendar with the ISO8601 format
 * Also works with arrays, lists or sets
 */
$ {#calendars.formatISO(cal)
}

$ {#calendars.arrayFormatISO(calArray)
}

$ {#calendars.listFormatISO(calList)
}

$ {#calendars.setFormatISO(calSet)
}

/*
 * Format calendar with the specified pattern
 * Also works with arrays, lists or sets
 */
$ {#calendars.format(cal, 'dd/MMM/yyyy HH:mm')
}

$ {#calendars.arrayFormat(calArray, 'dd/MMM/yyyy HH:mm')
}

$ {#calendars.listFormat(calList, 'dd/MMM/yyyy HH:mm')
}

$ {#calendars.setFormat(calSet, 'dd/MMM/yyyy HH:mm')
}

/*
 * Obtain calendar properties
 * Also works with arrays, lists or sets
 */
$ {#calendars.day(date)
}                // also arrayDay(...), listDay(...), etc.

$ {#calendars.month(date)
}              // also arrayMonth(...), listMonth(...), etc.

$ {#calendars.monthName(date)
}          // also arrayMonthName(...), listMonthName(...), etc.

$ {#calendars.monthNameShort(date)
}     // also arrayMonthNameShort(...), listMonthNameShort(...), etc.

$ {#calendars.year(date)
}               // also arrayYear(...), listYear(...), etc.

$ {#calendars.dayOfWeek(date)
}          // also arrayDayOfWeek(...), listDayOfWeek(...), etc.

$ {#calendars.dayOfWeekName(date)
}      // also arrayDayOfWeekName(...), listDayOfWeekName(...), etc.

$ {#calendars.dayOfWeekNameShort(date)
} // also arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.

$ {#calendars.hour(date)
}               // also arrayHour(...), listHour(...), etc.

$ {#calendars.minute(date)
}             // also arrayMinute(...), listMinute(...), etc.

$ {#calendars.second(date)
}             // also arraySecond(...), listSecond(...), etc.

$ {#calendars.millisecond(date)
}        // also arrayMillisecond(...), listMillisecond(...), etc.

/*
 * Create calendar (java.util.Calendar) objects from its components
 */
$ {#calendars.create(year, month, day)
}

$ {#calendars.create(year, month, day, hour, minute)
}

$ {#calendars.create(year, month, day, hour, minute, second)
}

$ {#calendars.create(year, month, day, hour, minute, second, millisecond)
}

$ {#calendars.createForTimeZone(year, month, day, timeZone)
}

$ {#calendars.createForTimeZone(year, month, day, hour, minute, timeZone)
}

$ {#calendars.createForTimeZone(year, month, day, hour, minute, second, timeZone)
}

$ {#calendars.createForTimeZone(year, month, day, hour, minute, second, millisecond, timeZone)
}

/*
 * Create a calendar (java.util.Calendar) object for the current date and time
 */
$ {#calendars.createNow()
}

$ {#calendars.createNowForTimeZone()
}

/*
 * Create a calendar (java.util.Calendar) object for the current date (time set to 00:00)
 */
$ {#calendars.createToday()
}

$ {#calendars.createTodayForTimeZone()
}
```

### Números

* **\#numbers** : utility methods for number objects:

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Numbers
 * ======================================================================
 */

/*
 * ==========================
 * Formatting integer numbers
 * ==========================
 */

/*
 * Set minimum integer digits.
 * Also works with arrays, lists or sets
 */
$ {#numbers.formatInteger(num, 3)
}

$ {#numbers.arrayFormatInteger(numArray, 3)
}

$ {#numbers.listFormatInteger(numList, 3)
}

$ {#numbers.setFormatInteger(numSet, 3)
}


/*
 * Set minimum integer digits and thousands separator:
 * 'POINT', 'COMMA', 'WHITESPACE', 'NONE' or 'DEFAULT' (by locale).
 * Also works with arrays, lists or sets
 */
$ {#numbers.formatInteger(num, 3, 'POINT')
}

$ {#numbers.arrayFormatInteger(numArray, 3, 'POINT')
}

$ {#numbers.listFormatInteger(numList, 3, 'POINT')
}

$ {#numbers.setFormatInteger(numSet, 3, 'POINT')
}


/*
 * ==========================
 * Formatting decimal numbers
 * ==========================
 */

/*
 * Set minimum integer digits and (exact) decimal digits.
 * Also works with arrays, lists or sets
 */
$ {#numbers.formatDecimal(num, 3, 2)
}

$ {#numbers.arrayFormatDecimal(numArray, 3, 2)
}

$ {#numbers.listFormatDecimal(numList, 3, 2)
}

$ {#numbers.setFormatDecimal(numSet, 3, 2)
}

/*
 * Set minimum integer digits and (exact) decimal digits, and also decimal separator.
 * Also works with arrays, lists or sets
 */
$ {#numbers.formatDecimal(num, 3, 2, 'COMMA')
}

$ {#numbers.arrayFormatDecimal(numArray, 3, 2, 'COMMA')
}

$ {#numbers.listFormatDecimal(numList, 3, 2, 'COMMA')
}

$ {#numbers.setFormatDecimal(numSet, 3, 2, 'COMMA')
}

/*
 * Set minimum integer digits and (exact) decimal digits, and also thousands and
 * decimal separator.
 * Also works with arrays, lists or sets
 */
$ {#numbers.formatDecimal(num, 3, 'POINT', 2, 'COMMA')
}

$ {#numbers.arrayFormatDecimal(numArray, 3, 'POINT', 2, 'COMMA')
}

$ {#numbers.listFormatDecimal(numList, 3, 'POINT', 2, 'COMMA')
}

$ {#numbers.setFormatDecimal(numSet, 3, 'POINT', 2, 'COMMA')
}



/*
 * ==========================
 * Utility methods
 * ==========================
 */

/*
 * Create a sequence (array) of integer numbers going
 * from x to y
 */
$ {#numbers.sequence(from, to)
}

$ {#numbers.sequence(from, to, step)
}
```

### Cadenas (Strings, en inglés)

* **\#strings** : utility methods for `String` objects:

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Strings
 * ======================================================================
 */

/*
 * Null-safe toString()
 */
$ {#strings.toString(obj)
}                           // also array*, list* and set*

/*
 * Check whether a String is empty (or null). Performs a trim() operation before check
 * Also works with arrays, lists or sets
 */
$ {#strings.isEmpty(name)
}

$ {#strings.arrayIsEmpty(nameArr)
}

$ {#strings.listIsEmpty(nameList)
}

$ {#strings.setIsEmpty(nameSet)
}

/*
 * Perform an 'isEmpty()' check on a string and return it if false, defaulting to
 * another specified string if true.
 * Also works with arrays, lists or sets
 */
$ {#strings.defaultString(text,
    default)}

$ {#strings.arrayDefaultString(textArr,
    default)}

$ {#strings.listDefaultString(textList,
    default)}

$ {#strings.setDefaultString(textSet,
    default)}

/*
 * Check whether a fragment is contained in a String
 * Also works with arrays, lists or sets
 */
$ {#strings.contains(name, 'ez')
}                     // also array*, list* and set*

$ {#strings.containsIgnoreCase(name, 'ez')
}           // also array*, list* and set*

/*
 * Check whether a String starts or ends with a fragment
 * Also works with arrays, lists or sets
 */
$ {#strings.startsWith(name, 'Don')
}                  // also array*, list* and set*

$ {#strings.endsWith(name, endingFragment)
}           // also array*, list* and set*

/*
 * Substring-related operations
 * Also works with arrays, lists or sets
 */
$ {#strings.indexOf(name, frag)
}                      // also array*, list* and set*

$ {#strings.substring(name, 3, 5)
}                     // also array*, list* and set*

$ {#strings.substringAfter(name, prefix)
}             // also array*, list* and set*

$ {#strings.substringBefore(name, suffix)
}            // also array*, list* and set*

$ {#strings.replace(name, 'las', 'ler')
}               // also array*, list* and set*

/*
 * Append and prepend
 * Also works with arrays, lists or sets
 */
$ {#strings.prepend(str, prefix)
}                     // also array*, list* and set*

$ {#strings.append(str, suffix)
}                      // also array*, list* and set*

/*
 * Change case
 * Also works with arrays, lists or sets
 */
$ {#strings.toUpperCase(name)
}                       // also array*, list* and set*

$ {#strings.toLowerCase(name)
}                       // also array*, list* and set*

/*
 * Split and join
 */
$ {#strings.arrayJoin(namesArray, ',')
}

$ {#strings.listJoin(namesList, ',')
}

$ {#strings.setJoin(namesSet, ',')
}

$ {#strings.arraySplit(namesStr, ',')
}                // returns String[]

$ {#strings.listSplit(namesStr, ',')
}                 // returns List<String>

$ {#strings.setSplit(namesStr, ',')
}                  // returns Set<String>

/*
 * Trim
 * Also works with arrays, lists or sets
 */
$ {#strings.trim(str)
}                               // also array*, list* and set*

/*
 * Compute length
 * Also works with arrays, lists or sets
 */
$ {#strings.length(str)
}                             // also array*, list* and set*

/*
 * Abbreviate text making it have a maximum size of n. If text is bigger, it
 * will be clipped and finished in "..."
 * Also works with arrays, lists or sets
 */
$ {#strings.abbreviate(str, 10)
}                      // also array*, list* and set*

/*
 * Convert the first character to upper-case (and vice-versa)
 */
$ {#strings.capitalize(str)
}                         // also array*, list* and set*

$ {#strings.unCapitalize(str)
}                       // also array*, list* and set*

/*
 * Convert the first character of every word to upper-case
 */
$ {#strings.capitalizeWords(str)
}                    // also array*, list* and set*

$ {#strings.capitalizeWords(str, delimiters)
}         // also array*, list* and set*

/*
 * Escape the string
 */
$ {#strings.escapeXml(str)
}                          // also array*, list* and set*

$ {#strings.escapeJava(str)
}                         // also array*, list* and set*

$ {#strings.escapeJavaScript(str)
}                   // also array*, list* and set*

$ {#strings.unescapeJava(str)
}                       // also array*, list* and set*

$ {#strings.unescapeJavaScript(str)
}                 // also array*, list* and set*

/*
 * Null-safe comparison and concatenation
 */
$ {#strings.equals(first, second)
}

$ {#strings.equalsIgnoreCase(first, second)
}

$ {#strings.concat(values...)}

$ {#strings.concatReplaceNulls(nullValue, values...)}

/*
 * Random
 */
$ {#strings.randomAlphanumeric(count)
}
```

### Objetos

* **\#objects** : utility methods for objects in general

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Objects
 * ======================================================================
 */

/*
 * Return obj if it is not null, and default otherwise
 * Also works with arrays, lists or sets
 */
$ {#objects.nullSafe(obj,
    default)}

$ {#objects.arrayNullSafe(objArray,
    default)}

$ {#objects.listNullSafe(objList,
    default)}

$ {#objects.setNullSafe(objSet,
    default)}
```

### Booleanos

* **\#bools** : utility methods for boolean evaluation

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Bools
 * ======================================================================
 */

/*
 * Evaluate a condition in the same way that it would be evaluated in a th:if tag
 * (see conditional evaluation chapter afterwards).
 * Also works with arrays, lists or sets
 */
$ {#bools.isTrue(obj)
}

$ {#bools.arrayIsTrue(objArray)
}

$ {#bools.listIsTrue(objList)
}

$ {#bools.setIsTrue(objSet)
}

/*
 * Evaluate with negation
 * Also works with arrays, lists or sets
 */
$ {#bools.isFalse(cond)
}

$ {#bools.arrayIsFalse(condArray)
}

$ {#bools.listIsFalse(condList)
}

$ {#bools.setIsFalse(condSet)
}

/*
 * Evaluate and apply AND operator
 * Receive an array, a list or a set as parameter
 */
$ {#bools.arrayAnd(condArray)
}

$ {#bools.listAnd(condList)
}

$ {#bools.setAnd(condSet)
}

/*
 * Evaluate and apply OR operator
 * Receive an array, a list or a set as parameter
 */
$ {#bools.arrayOr(condArray)
}

$ {#bools.listOr(condList)
}

$ {#bools.setOr(condSet)
}
```

### Matrices (arrays en inglés)

* **\#arrays** : utility methods for arrays

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Arrays
 * ======================================================================
 */

/*
 * Converts to array, trying to infer array component class.
 * Note that if resulting array is empty, or if the elements
 * of the target object are not all of the same class,
 * this method will return Object[].
 */
$ {#arrays.toArray(object)
}

/*
 * Convert to arrays of the specified component class.
 */
$ {#arrays.toStringArray(object)
}

$ {#arrays.toIntegerArray(object)
}

$ {#arrays.toLongArray(object)
}

$ {#arrays.toDoubleArray(object)
}

$ {#arrays.toFloatArray(object)
}

$ {#arrays.toBooleanArray(object)
}

/*
 * Compute length
 */
$ {#arrays.length(array)
}

/*
 * Check whether array is empty
 */
$ {#arrays.isEmpty(array)
}

/*
 * Check if element or elements are contained in array
 */
$ {#arrays.contains(array, element)
}

$ {#arrays.containsAll(array, elements)
}
```

### Listas

* **\#lists** : utility methods for lists

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Lists
 * ======================================================================
 */

/*
 * Converts to list
 */
$ {#lists.toList(object)
}

/*
 * Compute size
 */
$ {#lists.size(list)
}

/*
 * Check whether list is empty
 */
$ {#lists.isEmpty(list)
}

/*
 * Check if element or elements are contained in list
 */
$ {#lists.contains(list, element)
}

$ {#lists.containsAll(list, elements)
}

/*
 * Sort a copy of the given list. The members of the list must implement
 * comparable or you must define a comparator.
 */
$ {#lists.sort(list)
}

$ {#lists.sort(list, comparator)
}
```

### Conjuntos (Sets en inglés)

* **\#sets** : utility methods for sets

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Sets
 * ======================================================================
 */

/*
 * Converts to set
 */
$ {#sets.toSet(object)
}

/*
 * Compute size
 */
$ {#sets.size(set)
}

/*
 * Check whether set is empty
 */
$ {#sets.isEmpty(set)
}

/*
 * Check if element or elements are contained in set
 */
$ {#sets.contains(set, element)
}

$ {#sets.containsAll(set, elements)
}
```

### Mapas

* **\#maps** : utility methods for maps

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Maps
 * ======================================================================
 */

/*
 * Compute size
 */
$ {#maps.size(map)
}

/*
 * Check whether map is empty
 */
$ {#maps.isEmpty(map)
}

/*
 * Check if key/s or value/s are contained in maps
 */
$ {#maps.containsKey(map, key)
}

$ {#maps.containsAllKeys(map, keys)
}

$ {#maps.containsValue(map, value)
}

$ {#maps.containsAllValues(map, value)
}
```

### Agregados

* **\#aggregates** : utility methods for creating aggregates on arrays or collections

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Aggregates
 * ======================================================================
 */

/*
 * Compute sum. Returns null if array or collection is empty
 */
$ {#aggregates.sum(array)
}

$ {#aggregates.sum(collection)
}

/*
 * Compute average. Returns null if array or collection is empty
 */
$ {#aggregates.avg(array)
}

$ {#aggregates.avg(collection)
}
```

### Mensajes

* **\#messages** : utility methods for obtaining externalized messages inside variables expressions, in the same way as 
they would be obtained using `#{...}` syntax.

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Messages
 * ======================================================================
 */

/*
 * Obtain externalized messages. Can receive a single key, a key plus arguments,
 * or an array/list/set of keys (in which case it will return an array/list/set of
 * externalized messages).
 * If a message is not found, a default message (like '??msgKey??') is returned.
 */
$ {#messages.msg('msgKey')
}

$ {#messages.msg('msgKey', param1)
}

$ {#messages.msg('msgKey', param1, param2)
}

$ {#messages.msg('msgKey', param1, param2, param3)
}

$ {#messages.msgWithParams('msgKey', new Object[]{param1, param2, param3, param4})
}

$ {#messages.arrayMsg(messageKeyArray)
}

$ {#messages.listMsg(messageKeyList)
}

$ {#messages.setMsg(messageKeySet)
}

/*
 * Obtain externalized messages or null. Null is returned instead of a default
 * message if a message for the specified key is not found.
 */
$ {#messages.msgOrNull('msgKey')
}

$ {#messages.msgOrNull('msgKey', param1)
}

$ {#messages.msgOrNull('msgKey', param1, param2)
}

$ {#messages.msgOrNull('msgKey', param1, param2, param3)
}

$ {#messages.msgOrNullWithParams('msgKey', new Object[]{param1, param2, param3, param4})
}

$ {#messages.arrayMsgOrNull(messageKeyArray)
}

$ {#messages.listMsgOrNull(messageKeyList)
}

$ {#messages.setMsgOrNull(messageKeySet)
}
```

### IDs

* **\#ids** : utility methods for dealing with `id` attributes that might be repeated (for example, as a result of an 
iteration).

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Ids
 * ======================================================================
 */

/*
 * Normally used in th:id attributes, for appending a counter to the id attribute value
 * so that it remains unique even when involved in an iteration process.
 */
$ {#ids.seq('someId')
}

/*
 * Normally used in th:for attributes in <label> tags, so that these labels can refer to Ids
 * generated by means if the #ids.seq(...) function.
 *
 * Depending on whether the <label> goes before or after the element with the #ids.seq(...)
 * function, the "next" (label goes before "seq") or the "prev" function (label goes after
 * "seq") function should be called.
 */
$ {#ids.next('someId')
}

$ {#ids.prev('someId')
}
```

19\. Apéndice C: Sintaxis del selector DOM {#appendix-c-dom-selector-syntax}
============================================================================

DOM Selectors borrow syntax features from XPATH, CSS and jQuery, in order to provide a powerful and easy to use way to
specify template fragments.

For example, the following selector will select every `<div>` with the class `content`, in every position inside the
markup:

```html

<div th:include="mytemplate :: [//div[@class='content']]">...</div>
```

The basic syntax inspired from XPath includes:

* `/x` means direct children of the current node with name x.

* `//x` means children of the current node with name x, at any depth.

* `x[@z="v"]` means elements with name x and an attribute called z with value "v".

* `x[@z1="v1" and @z2="v2"]` means elements with name x and attributes z1 and z2 with values "v1" and "v2",
  respectively.

* `x[i]` means element with name x positioned in number i among its siblings.

* `x[@z="v"][i]` means elements with name x, attribute z with value "v" and positioned in number i among its siblings
  that also match this condition.

But more concise syntax can also be used:

* `x` is exactly equivalent to `//x` (search an element with name or reference `x` at any depth level).

* Selectors are also allowed without element name/reference, as long as they include a specification of arguments. So
  `[@class='oneclass']` is a valid selector that looks for any elements (tags) with a class attribute with value "
  oneclass".

Advanced attribute selection features:

* Besides `=` (equal), other comparison operators are also valid: `!=` (not equal), `^=` (starts with) and `$=` (ends
  with). For example: `x[@class^='section']` means elements with name `x` and a value for attribute `class` that starts
  with `section`.

* Attributes can be specified both starting with `@` (XPath-style) and without (jQuery-style). So `x[z='v']` is
  equivalent to `x[@z='v']`.

* Multiple-attribute modifiers can be joined both with `and` (XPath-style) and also by chaining multiple modifiers (
  jQuery-style). So `x[@z1='v1' and @z2='v2']` is actually equivalent to `x[@z1='v1'][@z2='v2']` (and also to
  `x[z1='v1'][z2='v2']`).

Direct _jQuery-like_ selectors:

* `x.oneclass` is equivalent to `x[class='oneclass']`.

* `.oneclass` is equivalent to `[class='oneclass']`.

* `x#oneid` is equivalent to `x[id='oneid']`.

* `#oneid` is equivalent to `[id='oneid']`.

* `x%oneref` means nodes -not just elements- with name x that match reference _oneref_ according to a specified
  `DOMSelector.INodeReferenceChecker` implementation.

* `%oneref` means nodes -not just elements- with any name that match reference _oneref_ according to a specified
  `DOMSelector.INodeReferenceChecker` implementation. Note this is actually equivalent to simply `oneref` because
  references can be used instead of element names.

* Direct selectors and attribute selectors can be mixed: `a.external[@href^='https']`.

The above DOM Selector expression:

```html

<div th:include="mytemplate :: [//div[@class='content']]">...</div>
```

could be written as:

```html

<div th:include="mytemplate :: [div.content]">...</div>
```

###Coincidencia de clases multivalor

DOM Selectors understand the class attribute to be **multivalued**, and therefore allow the application of selectors on
this attribute even if the element has several class values.

For example, `div[class='two']` will match `<div class="one two three" />`

###Corchetes opcionales

The syntax of the fragment inclusion attributes converts every fragment selection into a DOM selection, so brackets
`[...]` are not needed (though allowed).

So the following, with no brackets, is equivalent to the bracketed selector seen above:

```html

<div th:include="mytemplate :: div.content">...</div>
```

So, summarizing, this:

```html

<div th:replace="mytemplate :: myfrag">...</div>
```

Will look for a `th:fragment="myfrag"` fragment signature. But would also look for tags with name `myfrag` if they
existed (which they don't, in HTML). Note the difference with:

```html

<div th:replace="mytemplate :: .myfrag">...</div>
```

which will actually look for any elements with `class="myfrag"`, without caring about `th:fragment` signatures.
