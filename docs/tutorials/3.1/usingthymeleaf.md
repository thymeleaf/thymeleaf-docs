---
title: 'Tutorial: Usando Thymeleaf'
author: Thymeleaf
version: @documentVersion@
thymeleafVersion: @projectVersion@
---

# 1 Presentando Thymeleaf

## 1.1 ¿Qué es Thymeleaf?

Thymeleaf es un motor de plantillas del lado del servidor realizado en Java 
tanto para la web como para entornos aislados, capaz de procesar HTML, XML, 
JavaScript, CSS e incluso texto plano.

El objetivo principal de Thymeleaf es proporcionar una forma elegante y 
altamente mantenible de crear plantillas. Para conseguir esto, construye sobre 
el concepto de *Plantillas Naturales* para inyectar su lógica en ficheros de 
plantilla de una forma que no afecte a la plantilla al usarla como un prototipo 
de diseño. Esto mejora la comunicación del diseño y acorta la brecha entre los 
equipos de diseño y desarrollo.

Thymeleaf también ha sido diseñado desde el principio con los Estándares Web en 
mente -- especialmente **HTML5** -- permitiéndole crear plantillas plenamente 
validadas si es lo que necesita.

## 1.2 ¿Qué clase de plantillas puede procesar Thymeleaf?

Tal como está, Thymeleaf le permite procesar ses clases de plantillas, cada una 
de las cuales se llama **Modo de Plantilla**:

 * HTML
 * XML
 * TEXT
 * JAVASCRIPT
 * CSS
 * RAW 

Existen dos modos de plantilla de *marcado* (`HTML` y `XML`), tres modos de 
plantilla *textuales* (`TEXT`, `JAVASCRIPT` y `CSS`) y un modo de plantilla 
*no-op* (`RAW`).

El modo de plantilla **`HTML`** permitirá cualquier clase de entrada HTML, 
incluyendo HTML5, HTML 4 y XHTML. No se realizará ninguna validación ni 
comprobación de buen formato, y la estructura/código de la plantilla será 
respetada en la mayor medida posible en la salida.

El modo de plantilla **`XML`** permitirá la entrada XML. En este caso, se 
espera que el código esté bien formado -- sin etiquetas sin cerrar, sin 
atributos no entrecomillados, etc. -- y el analizador lanzará excepciones si se 
encuentran violaciones del buen formado. Tenga en cuenta que no se realizará 
*validación* (contra un DTD o Esquema XML).

El modo de plantilla **`TEXT`** permitirá el uso de una sintaxis especial para 
plantilla que no sean de naturaleza de marcado. Ejemplos de tales plantillas 
podrían ser el texto de los correos electrónicos o documentación aplantillada. 
Tenga en cuenta que las plantillas HTML o XML pueden ser también procesadas 
como `TEXT`, en cuyo caso no serán analizadas como marcado, y cada etiqueta, 
DOCTYPE, comentario, etc. será tratado como mero texto.

El modo de plantilla **`JAVASCRIPT`** permitirá el procesado de ficheros 
JavaScript en una aplicación de Thymeleaf. Esto significa ser capaz de usar el 
modelo de atos dentro de los ficheros JavaScript de la misma forma que puede ser 
hecho en los ficheros HTML, pero con integraciones específicas de JavaScript 
tales como el escapado especializado o *scripting natural*. El modo de plantilla
`JAVASCRIPT` se considera un modo *textual* y, por lo tanto, usa la misma sintaxis 
especial que el modo de plantilla `TEXT`.

El modo de plantilla **`CSS`** permitirá el procesado de ficheros CSS 
involucrados en una aplicación Thymeleaf. De forma similar al modo `JAVASCRIPT`, 
el modo de plantilla `CSS` es también un modo *textual* y usa la sintaxis de 
procesado especial del modo de plantilla `TEXT`.

El modo de plantilla **`RAW`** simplemente no procesará ninguna plantilla. Está 
destinado a usarse para insertar recursos intactos (archivos, respuestas de 
URL, etc.) en las plantillas que se procesan. Por ejemplo, recursos 
incontrolados, externos en formato HTML podrían ser incluídos en plantillas de la 
aplicación, sabiendo de forma segura que no se ejecutará ningún código 
Thymeleaf que estos recursos puedan incluir.

## 1.3 Dialectos: El dialecto estándar

Thymeleaf es un motor de plantillas extremadamente extensible (en realidad podría 
ser llamado un _marco de trabajo de motor de plantillas_) que le permite definir 
y personalizar la forma en las que sus plantillas serán procesadas hasta un 
nivel fino de detalle.

Un objeto que aplica alguna lógica a un artefacto de marcado (una etiqueta, algo 
de texto, un comentario, o un mero marcador de posición si las plantillas no están 
marcadas) se llama un _procesador_ (processor en inglés, N. del T.) y un 
conjunto de esos procesadores -- más quizás algunos artefactos extra -- es de 
lo que se compone normalmente un **dialecto** (dialect en inglés, N. del T.). 
Tal como está, la librería principal de Thymeleaf proporciona un dialecto 
llamado el **Dialecto Estandar*, el cual debería ser suficiente para la mayoría 
de los usuarios.

> Tenga en cuenta que los dialectos pueden en realidad no tener procesadores y 
> estar enteramente compuestos de otras clases de artefactos, pero los 
> procesadores son definitivamente el caso de uso más común.

_Este tutorial cubre el Dialecto Estándar_. Cada atributo y característica de 
sintaxis que aprenderá en las páginas siguientes se define por este dialecto, 
incluso si no se menciona explicitamente.

Por supuesto, los usuarios pueden crear sus propios dialectos (incluso 
extendiendo el Estándar) si quieren definir su propia lógica de procesamiento 
mientras se aprovechan de las características avanzadas de la librería. 
Thymeleaf puede ser configurado para usar varios dialectos a la vez.

> Los paquetes de integración oficiales thymeleaf-spring3 y thymeleaf-spring4 
> definen ambos un dialecto llamado el "Dialecto Spring Estándar", el cual en su 
> mayor parte es el mismo que el Dialecto Estándar, pero con pequeñas 
> adaptaciones para hacer un mejor uso de algunas características de Spring 
> Framework (por ejemplo, usando el Lenguaje de Expresión de Spring y SpringEL en 
> vez de OGNL). Así que si usted es un usuario de Spring MVC no estará perdiendo 
> su tiempo, y casi todas las cosas que aprenderá aquí será de uso en sus 
> aplicaciones Spring.

La mayoría de los procesadores del Dialecto Estándar son _procesadores de 
atributos_. Esto permite a los navegadores visualizar correctamente los ficheros 
de plantilla HTML incluso antes de ser procesados porque simplemente ignoran los 
atributos adicionales. Por ejemplo, mientras una JSP usando una librería de 
etiquetas podría incluir un fragmento de código no directamente visualizable por 
un navegador como:

```html
<form:inputText name="userName" value="${user.name}" />
```

... El Dialecto Estándar de Thymeleaf nos permitiría alcanzar la misma 
funcionalidad con::

```html
<input type="text" name="userName" value="James Carrot" th:value="${user.name}" />
```

No solo será esto más correctamente mostrado por los navegadores, sino que también 
nos permite (opcionalmente) especificar un valor de atributo en este ("James 
Carrot", en este caso) que será mostrado cuando el prototipo esté abierto 
estáticamente en un navegador, y que será sustituido por el valor resultante de 
la evaluación de `${user.name}` durante el procesado de la plantilla.

Esto ayuda a que tu diseñador y desarrollador trabajen en el mismo fichero de 
plantilla y reduce el esfuerzo requerido para transformar un prototipo estático 
en un fichero de plantilla funcional. La habilidad para hacer esto es una 
funcionalidad llamada _Plantillado Natural_.

# 2 La tienda de comestibles virtual Good Thymes

El código fuente para los ejemplos mostrados en este, y futuros capítulos de 
esta guía, se puede encontrar en el ejemplo _Good Thymes Virtual Grocery (GTVG)
el cual tiene dos versiones (equivalentes):

   * basado en `javax.*`: [gtvg-javax](https://github.com/thymeleaf/thymeleaf/tree/3.1-master/examples/core/thymeleaf-examples-gtvg-javax).
   * basado en `jakarta.*`: [gtvg-jakarta](https://github.com/thymeleaf/thymeleaf/tree/3.1-master/examples/core/thymeleaf-examples-gtvg-jakarta).

## 2.1 Un sitio web para una tienda de comestibles

Para explicar mejor los conceptos involucrados en el procesamiento de 
plantillas con Thymeleaf, este tutorial usará una aplicación de demostración que 
puede descargar desde el sitio web del proyecto.

Esta aplicación es el sitio web de una tienda de comestibles virtual 
imaginaria, y nos ofrecerá muchos escenarios para mostrar las muchas 
características de Thymeleaf.

Para empezar, necesitamos un conjunto simple de entidades del modelo para 
nuestra aplicación:  `Products` (Productos) que son vendidos a los `Customers`
(Clientes) creando `Orders` (Pedidos). También gestionaremos  `Comments` 
(Comentarios) sobre estos `Products`:

![Ejemplo del modelo de la aplicación](images/usingthymeleaf/gtvg-model.png)

Nuestra aplicación también tendrá una capa muy simple de servicio, compuesta por 
objetos `Service` (Servicio) que contienen métodos como:


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

En la capa web nuestra aplicación tendrá un filtro que delegará la ejecución a 
los comandos habilitados por Thymeleaf dependiendo de la URL solicitada:

```java

/*
 * El objeto application necesita ser declarado primero (implementa IWebApplication)
 * En este caso, se usará la versión basada en Jakarta.
 */
public void init(final FilterConfig filterConfig) throws ServletException {
    this.application =
            JakartaServletWebApplication.buildApplication(
                filterConfig.getServletContext());
    // Veremos más tarde cómo el objeto TemplateEngine se construye y configura
    this.templateEngine = buildTemplateEngine(this.application);
}

/*
 * Cada petición será procesada creando un objeto de intercambio (modelando la 
 * petición, su respuesta y todos los datos necesitados para este proceso) y 
 * después se llama al controlador correspondiente.
 */
private boolean process(HttpServletRequest request, HttpServletResponse response)
        throws ServletException {
    
    try {

        final IWebExchange webExchange = 
            this.application.buildExchange(request, response);
        final IWebRequest webRequest = webExchange.getRequest();

        // Esto evita que se activen ejecuciones del motor para las URLs de recursos
        if (request.getRequestURI().startsWith("/css") ||
                request.getRequestURI().startsWith("/images") ||
                request.getRequestURI().startsWith("/favicon")) {
            return false;
        }
        
        /*
         * Consulta la asignación de controlador/URL y obtiene el controlador 
         * que procesará la solicitud. Si no hay ningún controlador disponible, 
         * devuelve falso y deja que otros filtros/servlets procesen la solicitud. 
         */
        final IGTVGController controller = 
            ControllerMappings.resolveControllerForRequest(webRequest);
        if (controller == null) {
            return false;
        }

        /*
         *  Escribe las cabeceras de la respuesta
         */
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);

        /*
         * Obtiene el flujo escritor (writer) de la respuesta (response)
         */
        final Writer writer = response.getWriter();

        /*
         * Ejecuta el controlador y procesa la plantilla de la vista, 
         * escribiendo los resultados al flujo escritor de la respuesta 
         * (response writer) 
         */
        controller.process(webExchange, this.templateEngine, writer);
        
        return true;
        
    } catch (Exception e) {
        try {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (final IOException ignored) {
            // Simplemente ignora esto
        }
        throw new ServletException(e);
    }
    
}
```

Este es nuestro interfaz `IGTVGController`:

```java
public interface IGTVGController {

    public void process(
            final IWebExchange webExchange, 
            final ITemplateEngine templateEngine,
            final Writer writer)
            throws Exception;
    
}
```

Todo lo que tenemos que hacer ahora es crear implementaciones de la interfaz 
`IGTVGController`, recuperando los datos de los servicios y procesando las 
plantillas usando el objeto `ITemplateEngine`.

Al final se verá así:


![Ejemplo de página de inicio de la aplicación](images/usingthymeleaf/gtvg-view.png)

Pero primero veamos cómo se inicializa el motor de plantillas.

## 2.2 Creación y configuración del Motor de Plantillas

El método _init(...)_ en nuestro filtro contenía esta línea: 

```java
this.templateEngine = buildTemplateEngine(this.application);
```
Veamos ahora cómo nuestro objeto `org.thymeleaf.TemplateEngine` se inicializa: 

```java
private static ITemplateEngine buildTemplateEngine(final IWebApplication application) {

    // Las plantillas se resolverán como recursos de aplicación (ServletContext)
    final WebApplicationTemplateResolver templateResolver = 
            new WebApplicationTemplateResolver(application);

    // HTML es el modo por defecto, pero lo estableceremos igualmente para entender mejor el código
    templateResolver.setTemplateMode(TemplateMode.HTML);
    // Esto convertíra "home" en "/WEB-INF/templates/home.html"
    templateResolver.setPrefix("/WEB-INF/templates/");
    templateResolver.setSuffix(".html");
    // Establece la caché TTL de la plantilla a 1 hora. Si no establece, las entradas existirían en la caché hasta que la LRU las expulse 
    templateResolver.setCacheTTLMs(Long.valueOf(3600000L));

    // La caché se establece a verdadero por defecto. Establézcala a falso si quiere que las plantillas
    // se actualizen automáticamente cuando se modifiquen.
    templateResolver.setCacheable(true);

    final TemplateEngine templateEngine = new TemplateEngine();
    templateEngine.setTemplateResolver(templateResolver);

    return templateEngine;

}
```
Hay muchas formas de configurar un objeto `TemplateEngine`, pero por ahora estas
pocas líneas de código nos enseñarán lo bastante sobre los pasos necesitados.

### El Solucionador de Plantillas (Template Resolver)

Empecemos con el Solucionador de Plantillas (Template Resolver):

```java
final WebApplicationTemplateResolver templateResolver = 
        new WebApplicationTemplateResolver(application);
```

Los Solucionadores de Plantillas son objetos que implementan una interfaz de la 
IPA (Interfaz Público de Aplicaciones, API en inglés) de Thymeleaf llamada
`org.thymeleaf.templateresolver.ITemplateResolver`: 

```java
public interface ITemplateResolver {

    ...
  
    /*
     * Las plantillas se resuelven por su nombre (o contenido) y también (opcionalmente) por su 
     * plantilla propietaria en el caso de que estemos intentando resolver un fragmento para otra plantilla.
     * Devolverá nulo si la plantilla no puede ser manejada por este solucionador de plantillas.
     */
    public TemplateResolution resolveTemplate(
            final IEngineConfiguration configuration,
            final String ownerTemplate, final String template,
            final Map<String, Object> templateResolutionAttributes);
}
```

Estos objetos están a cargo de determinar cómo serán accedidas nuestras plantillas 
y, en esta aplicación GTVG, el uso de `org.thymeleaf.templateresolver.WebApplicationTemplateResolver`
significa que vamos a recuperar nuestros ficheros de plantillas como recursos del 
objeto _IWebApplication_: una abstracción de Thymeleaf que, en las aplicaciones basadas en Servlets,  
básicamente envuelve el objeto de la IPA de Servlets `[javax|jakarta].servlet.ServletContext`, 
y eso resuelve los recursos desde la raíz de la aplicación web.

Pero eso no es todo lo que podemos decir sobre el solucionador de plantillas, porque podemos establecer
algunos parámetros de configuración en él. Primero, el modo de plantilla:

```java
templateResolver.setTemplateMode(TemplateMode.HTML);
```
HTML es el modo de plantilla por defecto para `WebApplicationTemplateResolver`, pero es 
una buena práctica establecerla siempre de forma que nuestro código documente claramente lo qué 
está sucediendo.

```java
templateResolver.setPrefix("/WEB-INF/templates/");
templateResolver.setSuffix(".html");
```
Los _prefix_ y _suffix_ modifican los nombres de la plantilla que estamos pasando al 
motor para obtener los nombres reales del recurso que se utilizarán.

Usando esta configuración, el nombre de plantilla _"product/list"_ correspondería a:

```java
servletContext.getResourceAsStream("/WEB-INF/templates/product/list.html")
```

Opcionalmente, la cantidad de tiempo que una plantilla analizada puede existir en la caché se 
configura en el Solucionador de Plantillas mediante la propiedad _cacheTTLMs_: 


```java
templateResolver.setCacheTTLMs(3600000L);
```

Una plantilla puede aún ser expulsada de la caché antes de que se alcance el TTL 
si se alcanza el tamaño máximo de la caché y esta es la entrada más antigua 
almacenada actualmente en caché. 

> El comportamiento y tamaños de la Caché puede ser definido por el usuario implementando 
> la interfaz `ICacheManager` o modificando el objeto `StandardCacheManager` para gestionar 
> la caché por defecto.

Hay mucho más que aprender sobre los solucionadores de plantillas, pero por ahora
echemos un vistazo a la creación de nuestro objeto de Motor de Plantilla (Templete Engine).

### El Motor de Plantillas (Template Engine)

Los objetos de Motor de Plantilla son implementaciones de la interfaz 
`org.thymeleaf.ITemplateEngine`. Una de estas implementaciones es ofrecida por 
el nucleo de Thymeleaf: `org.thymeleaf.TemplateEngine`, y nosotros creamos una 
instancia de esta aquí:

```java
templateEngine = new TemplateEngine();
templateEngine.setTemplateResolver(templateResolver);
```

Bastante sencillo, ¿verdad? Todo lo que necesitamos es crear una instancia y 
configurarla como Solucionador de Plantillas.

Un solucionador de plantillas es el único parámetro *requerido* que necesita un
`TemplateEngine`, aunque existen muchos otros que cubriremos más tarde 
(resolvedores de mensajes, tamaños de caché, etc.). Por ahora, esto es todo lo que 
necesitamos.

Nuestro Motor de Plantillas está ahora listo y podemos empezar a crear nuestras 
páginas usando Thymeleaf.

# 3 Uso de textos

## 3.1 Una bienvenida en varios idiomas

Nuestra primera tarea será crear una página de inicio para nuestro sitio de la 
tienda de comestibles.

La primera versión de esta página ser extremadamente simple: simplemente un título 
y un mensaje de bienvenida. Este es nuestro fichero `/WEB-INF/templates/home.html`:

```html
<!DOCTYPE html>

<html xmlns:th="http://www.thymeleaf.org">

  <head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body>
  
    <p th:text="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
  
  </body>

</html>
```

Lo primero que notará es que este archivo es HTML5 y puede ser mostrado 
correctamente por cualquier navegador porque no incluye ninguna etiqueta que no 
sea HTML (los navegadores ignoran todos los atributos que no entienden, como 
`th:text`).

Pero también podrá notar que esta plantilla no es realmente un documento HTML5 
_válido_, porque esos atributos no estándar que estamos usando en la forma `th:*`
no están permitidos por la especificación HTML5. En realidad, estamos incluso 
agregando un atributo `xmlns:th` a nuestra etiqueta `<html>`, algo absolutamente 
no HTML5:

```html
<html xmlns:th="http://www.thymeleaf.org">
```
... Que no tiene ninguna influencia en el procesamiento de la plantilla, pero 
funciona como un *encantamiento* que evita que nuestro IDE se queje de la falta 
de un espacio de nombres de una definición de espacio de nombres para todos esos 
atributos `th:*`.

¿Y qué pasa si queremos que esta plantilla sea **válida para HTML5**? Fácil: 
cambie a la sintaxis de atributos de datos de Thymeleaf, utilizando el prefijo 
`data-` para los nombres de atributos y separadores de guion (`-`) en lugar de 
punto y coma (`:`):

```html
<!DOCTYPE html>

<html>

  <head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../css/gtvg.css" data-th-href="@{/css/gtvg.css}" />
  </head>

  <body>
  
    <p data-th-text="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
  
  </body>

</html>
```

Los atributos personalizados `data-` están permitidos por la especificación HTML5, 
de forma que, con el código de arriba, nuestra plantilla sería un *documento HTML5 
válido*.

> Ambas notaciones son completamente equivalentes e intercambiables, pero por el
> bien de la simplicidad y la brevedad de los ejemplos de código, este tutorial 
> usará la *notacion del espacio de nombres* (`th:*`). Además, la notación
> `th:*` es más general y permitida en cada modo de plantilla Thymeleaf (`XML`, 
> `TEXT`...) mientras que la notación `data-` se permite solo en el modo `HTML`.

### Usando th:text y externalizando texto

Externalizar texto es extraer fragmentos del código de la plantilla fuera de los 
ficheros de plantillas de forma que puedan mantenerse en ficheros separados
(normalmente ficheros `.properties`) y que puedan ser facilmente reemplazados con
los textos equivalentes escritos en otros lenguajes (un proceso llamado 
internacionalización o simplemente _i18n_). Los fragmentos externalizados de 
texto se llaman normalmente *"messages"*.

Los mensajes (messages) siempre tienen una clave que los identifica, y Thymeleaf 
le permite especificar que un texto corresponderá a un mensaje específico con la 
sintaxis `#{...}`:

```html
<p th:text="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
```

Lo que podemos ver aquí es de hecho dos características diferentes del Dialecto 
Estandar de Thymeleaf:

 * El atributo `th:text`, que evalúa su expresión de valor y establece el
   resultado como el cuerpo de la etiqueta anfitriona, reemplazando efectivamente
   el texto "¡Bienvenido a nuestra tienda de comestibles!", que vemos en el código.
 * La expresión `#{home.welcome}`, especificada en la _Sintaxis de la Expresión 
   Estándar_, que indica que el texto que debe utilizar el atributo `th:text`
   debe ser reemplazado por el mensaje con la clave `home.welcome` correspondiente  
   a la configuración regional con la que estamos procesando la plantilla.

Ahora bien, ¿dónde está este texto externalizado?

La ubicación del texto externalizado en Thymeleaf es completamente configurable, y 
dependerá de la implementación específica de `org.thymeleaf.messageresolver.IMessageResolver`
que será usada, pero podríamos crear nuestras propias implementaciones si 
quisiéramos, por ejemplo, obtener los mensajes de una base de datos.

Sin embargo, no hemos especificado un solucionador de mensajes para nuestro motor 
de plantillas durante la inicialización, y eso significa que nuestra aplicación 
está usando el _Solucionador Estándar de Mensajes_, implementado por 
`org.thymeleaf.messageresolver.StandardMessageResolver`.

El solucionador estándar de mensajes espera encontrar los mensajes para 
`/WEB-INF/templates/home.html` en ficheros de propiedades en la misma carpeta y 
con el mismo nombre que la plantilla, como:

 * `/WEB-INF/templates/home_en.properties` para textos en inglés.
 * `/WEB-INF/templates/home_es.properties` para textos en lenguaje español.
 * `/WEB-INF/templates/home_pt_BR.properties` para textos en lenguaje portugues (Brasil).
 * `/WEB-INF/templates/home.properties` para los textos por defecto (si la 
   configuración regional no coincide).

Echemos un vistazo a nuestro fichero `home_es.properties`:

```
home.welcome=¡Bienvenido a nuestra tienda de comestibles!
```

Esto es todo lo que necesitamos para que Thymeleaf procese nuestra plantilla. 
Ahora, creemos ahora nuestro controlador de inicio.

### Contextos (Contexts)

Para procesar nuestra plantilla, crearemos una clase `HomeController` que 
implemente la interfaz `IGTVGController` que vimos antes:

```java
public class HomeController implements IGTVGController {

    public void process(
            final IWebExchange webExchange, 
            final ITemplateEngine templateEngine,
            final Writer writer)
            throws Exception {
        
        WebContext ctx = new WebContext(webExchange, webExchange.getLocale());
        
        templateEngine.process("home", ctx, writer);
        
    }

}
```

Lo primero que vemos es la creación de un *contexto*. Un contexto de Thymeleaf 
es un objeto que implementa la interfaz `org.thymeleaf.context.IContext`. Los 
contextos deben contener todos los datos necesarios para la ejecución del motor 
de plantillas en un mapa de variables, así como la configuración regional que 
debe utilizarse para los mensajes externalizados.

```java
public interface IContext {

    public Locale getLocale();
    public boolean containsVariable(final String name);
    public Set<String> getVariableNames();
    public Object getVariable(final String name);
    
}
```

Existe una extensión especializada de esta interfaz,  `org.thymeleaf.context.IWebContext`,
diseñada para ser utilizada en aplicaciones web.

```java
public interface IWebContext extends IContext {
    
    public IWebExchange getExchange();
    
}
```

El núcleo de la librería de Thymeleaf ofrece una implementación de cada una de 
estas interfaces:

 * `org.thymeleaf.context.Context` implementa `IContext`
 * `org.thymeleaf.context.WebContext` implementa `IWebContext`

Y como puede ver en el código del controlado, `WebContext` es el que usamos. De 
hecho tenemos que hacerlo, porque el uso de un `WebApplicationTemplateResolver` 
requiere que usemos un contexto que implemente `IWebContext`.

```java
WebContext ctx = new WebContext(webExchange, webExchange.getLocale());
```

El constructor `WebContext` requiere información contenida en el objeto de 
abstracción `IWebExchange` que fue creado en el filtro representando este 
intercambio basado en web (p. ej. petición + respuesta). La configuración regional 
por defecto del sistema se utilizará si no se especifica ninguna (aunque usted 
no debe permitir nunca que esto ocurra en aplicaciones reales).

Existen algunas expresiones especializadas que seremos capaces de utilizar para 
obtener los parámetros de la petición y los atributos de la petición, sesión y 
aplicación del `WebContext` en nuestras plantillas. Por ejemplo:

 * `${x}` devolverá una variable `x` almacenada en el contexto de Thymeleaf o como un *atributo de intercambio* (Un *"atributo de la petición* e"* en la jerga de los Servlet).
 * `${param.x}` devolverá un *parámetro de petición* llamado `x` (el cual podría ser multi valor).
 * `${session.x}` devolverá un *atributo de sesión* llamado `x`.
 * `${application.x}` devolverá un *atributo de aplicación* llamado `x` (un *"atributo del contexto del servlet"* en la jerga de los Servlets).

### Ejecución del motor de plantillas

Con nuestro objeto de contexto listo, ahora podemos decirle al motor de plantillas
que procese la plantilla (por su nombre) usando el contexto, y pasándole un 
escritor de respuesta (response writer) de forma que la respuesta pueda escribir
en él: 


```java
templateEngine.process("home", ctx, writer);
```

Veamos los resultados de esto usando la configuración regional española:

```html
<!DOCTYPE html>

<html>

  <head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <link rel="stylesheet" type="text/css" media="all" href="/gtvg/css/gtvg.css" />
  </head>

  <body>
  
    <p>¡Bienvenido a nuestra tienda de comestibles!</p>

  </body>

</html>
```

## 3.2 Más sobre textos y variables

### Texto no escapado

La versión más simple de nuestra página de Inicio parece estar lista ahora, pero 
hay algo en el código que lo que no hemos pensado... ¿Qué pasaría si tenemos un 
mensaje como este?

```java
home.welcome=¡Bienvenido a nuestra <b>fantástica</b> tienda de comestibles!
```

Si ejecutamos esta plantilla como antes, obtendremos:

```html
<p>¡Bienvenido a nuestra  &lt;b&gt;fantástica&lt;/b&gt; tienda de comestibles!</p>
```

Lo que no es exactamente lo que esperábamos, porque nuestra etiqueta `<b>` ha 
sido escapada y, por lo tanto, será visualizada en el navegador.

Este es el comportamiento por defecto del atributo `th:text`. Si queremos que 
Thymeleaf respete nuestras etiquetas HTML y no las escape, tendremos que usar un 
atributo diferente: `th:utext` (para "texto sin escape"):

```html
<p th:utext="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
```

Esto sacará nuestro mensaje tal como lo queríamos:


```html
<p>¡Bienvenido a nuestra <b>fantástica</b> tienda de comestibles!</p>
```

### Uso y visualización de variables

Ahora agreguemos algo de más contenido a nuestra página de inicio. Por ejemplo, 
podremos querer visualizar la fecha debajo de nuestro mensaje de bienvenida, así:

```
¡Bienvenido a nuestra fantástica tienda de comestibles!

Hoy es: 12 julio 2010
```

En primer lugar, tendremos que modificar nuestro controlador para que agreguemos 
esa fecha como variable de contexto:

```java
public void process(
        final IWebExchange webExchange, 
        final ITemplateEngine templateEngine,
        final Writer writer)
        throws Exception {
        
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
    Calendar cal = Calendar.getInstance();

    WebContext ctx = new WebContext(webExchange, webExchange.getLocale());
    ctx.setVariable("today", dateFormat.format(cal.getTime()));
    
    templateEngine.process("home", ctx, writer);

}
```

Hemos agregado una variable `String` llamada `today` a nuestro contexto, y ahora 
podemos visualizarla en nuestra plantilla:
```html
<body>

  <p th:utext="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>

  <p>Hoy es: <span th:text="${today}">13 febrero 2011</span></p>
  
</body>
```

Como puede ver, estamos aún usando el atributo `th:text` para el trabajo (y eso 
es correcto, porque queremos reemplazar el cuerpo de la etiqueta), pero la 
sintaxis es un poquito diferente esta vez y en vez de una expresión de valor 
`#{...}`, estamos usando una `${...}`. Esta es una **expresión de variable**, 
y contiene una expresión en un lenguaje llamado _OGNL (Object-Graph Navigation 
Language)_ (Lenguaje de Navegación de Objetos-Gráficos) que será ejecutado en el 
mapa de variables del contexto del que hablamos antes.

La expresión `${today}` simplemente significa "obtén la variable llamada today", 
pero estas expresiones podrían ser más complejas (como `${user.name}`) para 
"obtener la variable llamada usuario, y llamar su método "getName()"

Existen muchas posibilidades en los valores de los atributos: mensajes, 
expresiones de variables... y mucho más. El siguiente capítulo nos mostrará 
cuáles son todas estas posibilidades.

# 4 Sintaxis de expresiones estándar

Nos tomaremos un pequeño descanso en el desarrollo de nuestra tienda virtual de 
comestibles para aprender sobre una de las partes más importantes del Dialecto 
Estándar de Thymeleaf: La sintaxis de las Expresiones Estándar de Thymeleaf:

```html
<p th:utext="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>

<p>Hoy es: <span th:text="${today}">13 febrero 2011</span></p>
```

Pero existen más tipos de expresiones, y más detalles interesantes que aprender 
sobre las que ya conocemos. Primero, veamos un breve resumen de las 
características de las expresiones estándar:


 * Expresiones simples:
    * Expresiones de Variable: `${...}`
    * Expresiones de Variable de Selección: `*{...}`
    * Expresiones de Mensaje: `#{...}`
    * Expresiones de Enlace URL: `@{...}`
    * Expresiones de Fragmento: `~{...}`
 * Literales
    * Literales de texto: `'one text'`, `'Another one!'`,...
    * Literales de número: `0`, `34`, `3.0`, `12.3`,...
    * Literales booleanos: `true`, `false`
    * Literal nulo (null): `null`
    * Literal de ficha (token): `one`, `sometext`, `main`,...
 * Operaciones de texto: 
    * Concatenación de cadenas: `+`
    * Substituciones en literales: `|The name is ${name}|`
 * Operaciones aritméticas:
    * Operadores binarios: `+`, `-`, `*`, `/`, `%`
    * Signo menos (operador unario): `-`
 * Operadores lógicos:
    * Operadores binarios: `and`, `or`
    * Negación lógica (operador unario): `!`, `not`
 * Comparaciones e igualdad:
    * Comparadores: `>`, `<`, `>=`, `<=` (`gt`, `lt`, `ge`, `le`)
    * Operadores de igualdad: `==`, `!=` (`eq`, `ne`)
 * Operadores condicionales:
    * If-then: `(if) ? (then)`
    * If-then-else: `(if) ? (then) : (else)`
    * Valor por defecto: `(value) ?: (defaultvalue)`
 * Fichas (Tokens) especiales :
    * Operación nula: `_`

Todas estas características pueden combinarse y anidarse:

```html
'Usuario es del tipo: ' + ( ' + (${user.isAdmin()} ? 'Administrador' : (${user.type} ?: 'Desconocido'))
```

## 4.1 Mensajes

Como ya sabemos, las expresiones de mensaje `#{...}` nos permiten vincular esto:

```html
<p th:utext="#{home.welcome}">¡Bienvenido a nuestra tienda de comestibles!</p>
```

... A esto:

```
home.welcome=¡Bienvenido a nuestra tienda de comestibles!
```

Pero hay un aspecto que aún no hemos considerado: ¿qué ocurre si el texto del 
mensaje no es completamente estático? ¿Qué ocurriría, por ejemplo, si nuestra 
aplicación sabía quién es el usuario que visita el sitio en cualquier momento y 
queremos saludarle por su nombre?


```html
<p>¡Bienvenido a nuestra tienda de comestibles, John Apricot!</p>
```

Esto significa que necesitaríamos agregar un parámetro a nuestro mensaje. Así:

```
home.welcome=¡Bienvenido a nuestra tienda de comestibles, {0}!
```

Los parámetros se especifican de acuerdo a la sintaxis estándar de 
[`java.text.MessageFormat`](https://docs.oracle.com/javase/10/docs/api/java/text/MessageFormat.html)
, lo cual significa que puede dar formato a números y fechas como se especifica 
en los documentos de las IPA para las clases en el paquete `java.text.*`.

Para especificar un valor para nuestro parámetro, y dado un atributo de sesión 
llamado `user`, podríamos tener:

```html
<p th:utext="#{home.welcome(${session.user.name})}">
  ¡Bienvenido a nuestra tienda de comestibles, Sebastian Pepper!
</p>
```

> Dese cuenta de que el uso de `th:utext` aquí significa que el mensaje con formato 
> no será escapado. Este ejemplo asume que `user.name` ya está escapado.

Se pueden especificar varios parámetros, separados por comas.

La misma clave del mensaje puede provenir de una variable: 


```html
<p th:utext="#{${welcomeMsgKey}(${session.user.name})}">
    ¡Bienvenido a nuestra tienda de comestibles, Sebastian Pepper!
</p>
```

## 4.2 Variables

Ya mencionamos que las expresiones `${...}` son en realidad expresiones OGNL
(Lenguaje de Navegación Objeto-Gráfico) ejecutadas sobre el mapa de variables 
contenidas en el contexto.

> Para información detallada sobre la sintaxis OGNL y sus características, consulte 
> la guía [Guía del Lenguaje OGNL](http://commons.apache.org/ognl/)
> 
> En aplicaciones que habilitan Spring MVC OGNL será reemplazado con **SpringEL**, pero 
> su sintaxis es muy similar a la de OGNL (En realidad, exactamente lo mismo 
> para la mayoría de los casos comunes).

De la sintaxis de OGNL, sabemos que la expresión en:

```html
<p>Hoy es: <span th:text="${today}">13 febrero 2011</span>.</p>
```

...es en realidad equivalente a esto:

```java
ctx.getVariable("today");
```

Pero OGNL nos permite crear expresiones mucho más potentes, y así es como 
funciona esto:

```html
<p th:utext="#{home.welcome(${session.user.name})}">
    ¡Bienvenido a nuestra tienda de comestibles, Sebastian Pepper!
</p>
```

... Obtiene el nombre de usuario ejecutando:

```java
((User) ctx.getVariable("session").get("user")).getName();
```

Pero la navegación por métodos getter es solo una de las características de 
OGNL. Veamos más:

```java
/*
 * Acceso a propiedades usando el punto  (.). Es equivalente a llamar a los getters de la propiedad.
 */
${person.father.name}

/*
 * El acceso a propiedades puede también realizarse usando corchetes ([]) y 
 * escribir el nombre de la propiedad como una variable o entre comillas simples.
 */
${person['father']['name']}

/*
 * Si el objeto es un map, tanto el punto como la sintaxis de corchete serán 
 * equivalentes a ejecutar una llamada a su método get(...).
 */
${countriesByCode.ES}
${personsByName['Stephen Zucchini'].age}

/*
 * El acceso indexado a matrices o colecciones se realizar también con corchetes, 
 * escribiendo el índice sin comillas.
 */
${personsArray[0].name}

/*
 * Se puede llamar a los métodos, incluso con argumentos.
 */
${person.createCompleteName()}
${person.createCompleteNameWithSeparator('-')}
```

### Objetos básicos de Expresiones OGNL

Cuando se evaluan las expresiones OGNL en las variables del contexto, algunos 
objetos se ponen a disposición de las expresiones para mayor flexibilidad. Estos 
 objetos se referenciarán (según el estándar OGNL) comenzando con el símbolo `#`:

 * `#ctx`: el objeto de contexto.
 * `#vars:` las variables del contexto.
 * `#locale`: la configuración regional del contexto.

Así que podemos hacer esto:

```html
País de configuración regional establecido: <span th:text="${#locale.country}">ES</span>.
```

Puede leer la referencia completa de estos objetos en el [Apéndice A](#18-apéndice-a-objetos-básicos-de-expresión). 

### Objetos de utilidad de expresión

Además de estos objetos básicos, Thymeleaf nos ofrecerá un conjunto de objetos de 
utilidad que nos ayudarán a realizar tareas comunes en nuestras expresiones.

 * `#execInfo`: información sobre la plantilla que está siendo procesada.
 * `#messages`: métodos para obtener mensajes externalizados dentro de expresiones 
    de variables, en la misma forma que serían obtenidas usando la sintaxis 
    #{...}. 
 * `#uris`: métodos para escapar partes de las URL/URI
 * `#conversions`: métodos para la ejecución del *servicio de conversión* 
    configurado (si lo hay).
 * `#dates`: métodos para objetos `java.util.Date`: formateado, extracción de 
    componentes, etc.
 * `#calendars`: análogo a `#dates`, pero para objetos `java.util.Calendar`.
 * `#temporals`: para tratar con fechas y horas utilizando la API `java.time` 
    en JDK8+.
 * `#numbers`: métodos para formatear objetos numéricos.
 * `#strings`: métodos para objetos `String`: contiene, comienza con, 
    anteponer/agregar, etc.
 * `#objects`: métodos para objetos en general.
 * `#bools`: métodos para la evaluación booleana.
 * `#arrays`: métodos para matrices.
 * `#lists`: métodos para listas.
 * `#sets`: métodos para conjuntos.
 * `#maps`: métodos para mapas.
 * `#aggregates`: métodos para crear agregados en matrices o colecciones.
 * `#ids`: métodos para tratar con atributos de identificación que podrían 
    repetirse (por ejemplo, como resultado de una iteración).

Puede comprobar qué funciones se ofrecen para cada uno de estos objetos de 
utilidad en el [Apéndice B](#19-apéndice-b-objetos-de-utilidad-de-expresión).

### Reformateando las fechas en nuestra página de inicio

Ahora que sabemos de estos objetos de utilidad, podríamos usarlos para cambiar 
la forma en que mostramos la fecha en nuestra página de inicio. En vez de hacer 
esto en nuestro `HomeController`:

```java
SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
Calendar cal = Calendar.getInstance();

WebContext ctx = new WebContext(webExchange, webExchange.getLocale());
ctx.setVariable("today", dateFormat.format(cal.getTime()));

templateEngine.process("home", ctx, writer);
```

... Podemos hacer precisamente esto:

```java
WebContext ctx = new WebContext(webExchange, webExchange.getLocale());
ctx.setVariable("today", Calendar.getInstance());

templateEngine.process("home", ctx, writer);
```

...y luego realizar el formato de fecha en la propia capa de vista:

```html
<p>
  Hoy es: <span th:text="${#calendars.format(today,'dd MMMM yyyy')}">13 Mayo 2011</span>
</p>
```

## 4.3 Expresiones en selecciones (sintaxis de asterisco)

No solo las expresiones de variables pueden ser escritas como `${...}`, si no 
también como `*{...}`.


Sin embargo, existe una diferencia importante: la sintaxis del asterisco evalúa 
las expresiones en _objetos seleccionados_ en lugar de en todo el contexto. 
Es decir, mientras no haya ningún objeto seleccionado, las sintaxis del dólar y 
del asterisco hacen exactamente lo mismo.

¿Y qué es un objeto seleccionado? El resultado de una expresión que usa el 
atributo `th:object`. Usemos uno en nuestra página de perfil de usuario 
(`userprofile.html`):

```html
  <div th:object="${session.user}">
    <p>Nombre: <span th:text="*{firstName}">Sebastian</span>.</p>
    <p>Apellidos: <span th:text="*{lastName}">Pepper</span>.</p>
    <p>Nacionalidad: <span th:text="*{nationality}">Saturno</span>.</p>
  </div>
```

Lo cual es exactamente equivalente a:

```html
<div>
  <p>Nombre: <span th:text="${session.user.firstName}">Sebastian</span>.</p>
  <p>Apellidos: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nacionalidad: <span th:text="${session.user.nationality}">Saturno</span>.</p>
</div>
```

Por supuesto, la sintaxis del dólar y del asterisco se puede mezclar:

```html
<div th:object="${session.user}">
  <p>Nombre: <span th:text="*{firstName}">Sebastian</span>.</p>
  <p>Apellidos: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nacionalidad: <span th:text="*{nationality}">Saturno</span>.</p>
</div>
```

Cuando hay una selección de objetos en su lugar, el objeto seleccionado también 
estará disponible para las expresiones en dólares como la variable de expresión 
`#object`:

```html
<div th:object="${session.user}">
  <p>Nombre: <span th:text="${#object.firstName}">Sebastian</span>.</p>
  <p>Apellidos: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nacionalidad: <span th:text="*{nationality}">Saturno</span>.</p>
</div>
```

Como se dijo, si no se ha realizado ninguna selección de objetos, las sintaxis 
de dólar y asterisco son equivalentes.

```html
<div>
  <p>Nombre: <span th:text="*{session.user.name}">Sebastian</span>.</p>
  <p>Apellidos: <span th:text="*{session.user.surname}">Pepper</span>.</p>
  <p>Nacionalidad: <span th:text="*{session.user.nationality}">Saturno</span>.</p>
</div>
```
## 4.4 Enlaces a URL

Debido a su importancia, las URL son ciudadanas de primera clase en las 
plantillas de aplicaciones web, y el _Dialecto Estándar de Thymeleaf_ tiene una 
sintaxis especial para ellas, la sintaxis `@`: `@{...}`

Hay diferentes tipos de URLs:
There are different types of URLs:

 * URLs absolutas: `http://www.thymeleaf.org`
 *  URL relativas, las cuales pueden ser:
    * relativas a la página: `user/login.html`
    * relativas al contexto: `/itemdetails?id=3` (el nombre del contexto en el 
      servidor será agregado automáticamente)
    * relativas al servidor: `~/billing/processInvoice` (permite llamar URLS en 
      otros contextos (= aplicación) en el mismo servidor).
    * URLs relativas al protocolo: `//code.jquery.com/jquery-2.0.3.min.js`

El procesado real de estas expresiones y sus conversiones a las URL que serán
mostradas se hace por implementaciones de la interfaz `org.thymeleaf.linkbuilder.ILinkBuilder`
que está registrada dentro del objeto `ITemplateEngine` que está siendo usado.

De forma predeterminada, se registra una única implementación de esta interfaz 
de la clase `org.thymeleaf.linkbuilder.StandardLinkBuilder`, lo cual es 
suficiente tanto para entornos web como offline basados en la API de Servlet. 
Otros escenarios (como la integración con frameworks web que no utilizan la API 
de Servlet) podrían requerir implementaciones específicas de la interfaz del 
constructor de enlaces.

Usemos esta nueva sintaxis. Conozca el atributo `th:href`:

```html
<!-- Producirá 'http://localhost:8080/gtvg/order/details?orderId=3' (mas reescritura) -->
<a href="details.html" 
   th:href="@{http://localhost:8080/gtvg/order/details(orderId=${o.id})}">ver</a>

<!-- Producirá '/gtvg/order/details?orderId=3' (mas reescritura) -->
<a href="details.html" th:href="@{/order/details(orderId=${o.id})}">ver</a>

<!-- Producirá '/gtvg/order/3/details' (mas reescritura) -->
<a href="details.html" th:href="@{/order/{orderId}/details(orderId=${o.id})}">ver</a>
```

Algunas cosas a tener en cuenta aquí:

 * `th:href` es un atributo modificador: una vez procesado, calculará la URL del 
   enlace que se utilizará y establecerá ese valor en el atributo `href` de la 
   etiqueta `<a>`.
 * Se permite usar expresiones para los parámetros de URL (como se puede ver en 
   `orderId=${o.id}`). Las operaciones de codificación de parámetros de URL 
   requeridas también se realizarán automáticamente.
 * Si se necesitan varios parámetros, se separarán con comas: 
   `@{/order/process(execId=${execId},execType='FAST')}`
 * También se permiten plantillas de variables en las rutas de URL: 
   `@{/order/{orderId}/details(orderId=${orderId})}`
 * Las URL relativas que empiezan por `/` (p. ej., `/order/details`) tendrán 
   automáticamente como prefijo el nombre del contexto de la aplicación.
 * Si las cookies no están habilitadas o aún no se conoce, se podría añadir el 
   sufijo `";jsessionid=..."` a las URL relativas para preservar la sesión. Esto 
   se llama _Reescritura de URL_ y Thymeleaf te permite conectar tus propios 
   filtros de reescritura mediante el mecanismo `response.encodeURL(...)` de la 
   API de Servlet para cada URL.
 * El atributo `th:href` nos permite (opcionalmente) tener un atributo `href` 
   estático funcional en nuestra plantilla, de modo que los enlaces de nuestra 
   plantilla sigan siendo navegables por un navegador al abrirlos directamente 
   para fines de creación de prototipos.

Como fue el caso con la sintaxis de mensajes (`#{...}`) las bases de las URL 
pueden ser el resultado de evaluar otra expresión:

```html
<a th:href="@{${url}(orderId=${o.id})}">vista</a>
<a th:href="@{'/details/'+${user.login}(orderId=${o.id})}">vista</a>
```

### Un menú para nuestra página de inicio

Ahora que sabemos como crear URL de enlace, ¿Qué tal si añadimos un pequeño 
menú en nuestra página de inicio para algunas de las otras páginas del sitio?

```html
<p>Por favor, seleccione una opción</p>
<ol>
  <li><a href="product/list.html" th:href="@{/product/list}">Lista de Productos</a></li>
  <li><a href="order/list.html" th:href="@{/order/list}">Lista de Pedidos</a></li>
  <li><a href="subscribe.html" th:href="@{/subscribe}">Suscríbete a nuestro boletín informativo</a></li>
  <li><a href="userprofile.html" th:href="@{/userprofile}">Ver perfil de usuario</a></li>
</ol>
```

### URL relativas a la raíz del servidor

Se puede usar una sintaxis adicional para crear URL relativas a la raíz del 
servidor (en vez de relativas a la raíz del contexto) para enlazar a diferentes 
contextos en el mismo servidor. Estas URL se especificarán como 
`@{~/path/to/something}`

## 4.5 Fragmentos

Las expresiones de fragmento son una forma fácil de representar fragmentos de 
marco y moverlos entre las plantillas. Esto nos permite replicarlas, pasarlas 
a otras plantillas como argumentos, etc.

El uso más común es para la inserción de fragmentos usando `th:insert` o 
`th:replace` (más sobre esto en una sección posterior):
(more on these in a later section):

```html
<div th:insert="~{commons :: main}">...</div>
```
Pero pueden ser utilizadas en cualquier parte, al igual que cualquier otra 
variable:

```html
<div th:with="frag=~{footer :: #main/text()}">
  <p th:insert="${frag}"></p>
</div>
```

Más tarde en este tutorial hay una sección entera dedicada al Diseño de 
Plantillas, incluyendo una explicación más profunda de las expresiones de 
fragmento.

## 4.6 Literales

### Literales de texto

Los literales de texto son simplemente cadenas de caracteres delimitados entre 
comillas simples. Pueden incluir cualquier carácter, pero deberá escapar 
cualquier comilla simple dentro de ellas usando `\'`.

```html
<p>
  Ahora está mirando un  <span th:text="'aplicación web funcional'">fichero de plantilla</span>.
</p>
```

### Literales numéricos

Los literales numéricos son simplemente eso: números.

```html
<p>El año es  <span th:text="2013">1492</span>.</p>
<p>En dos años, será <span th:text="2013 + 2">1494</span>.</p>
```

### Literales booleanos

Los literales booleanos son `true` y `false`. Por ejemplo:

```html
<div th:if="${user.isAdmin()} == false"> ...
```

En este ejemplo, el `== false` está escrito fuera de las llaves, y así es 
Thymeleaf quien se cuida de ello. Si estuviera escrito dentro de las llaves, 
sería responsabilidad de los motores OGNL/SpringEL:

```html
<div th:if="${user.isAdmin() == false}"> ...
```

### El literal null (nulo)

El literal `null` puede ser también usado:

```html
<div th:if="${variable.something} == null"> ...
```

### Literales de identificadores (tokens)

Los literales numéricos, booleanos y nulo son en realidad un caso particular de 
_fichas literales_.

Estas fichas (tokens) permiten un poco de simplificación en las Expresiones 
Estándar. Trabajan exactamente de la misma forma que los literales de texto 
(`'...'`), pero estos solo permiten letras (`A-Z` y `a-z`), números (`0-9`), 
corchetes (`[` y `]`), puntos (`.`), guiones (`-`) y subrayados (`_`). Así que 
nada de espacios en blanco, ni comas, etc.

¿Lo bueno? Los tokens no necesitan comillas. Así que podemos hacer esto:

```html
<div th:class="content">...</div>
```

en lugar de:

```html
<div th:class="'content'">...</div>
```

## 4.7 Agregar textos

Los textos, sin importar si son literales o el resultado de evaluar expresiones 
variables o de mensajes, se pueden agregar fácilmente usando el operador `+`:

```html
<span th:text="'El nombre del usuario es ' + ${user.name}">
```

## 4.8 Sustituciones de literales

Las sustituciones literales permiten formatear fácilmente cadenas que contienen 
valores de variables sin la necesidad de agregar literales con '...' + '...'`.

Estas sustituciones deben estar rodeadas de barras verticales (`|`), como:

```html
<span th:text="|¡Bienvenido a nuestra aplicación, ${user.name}!|">
```

Lo cual es equivalente a:

```html
<span th:text="'¡Bienvenido a nuestra aplicación, ' + ${user.name} + '!'">
```

Las sustituciones literales se pueden combinar con otros tipos de expresiones:

```html
<span th:text="${onevar} + ' ' + |${twovar}, ${threevar}|">
```
> Solo las expresiones de mensaje/variables (`${...}`, `*{...}`, `#{...}`) se 
> permiten dentro de las substituciones de literales `|...|`. No se permiten 
> otros literales (`'...'`), tokens booleanos/numéricos, expresiones 
> condicionales, etc. 

## 4.9 Operaciones aritméticas

También se encuentran disponibles algunas operaciones aritméticas: 
`+`, `-`, `*`, `/` y `%`.

```html
<div th:with="isEven=(${prodStat.count} % 2 == 0)">
```
Dese cuenta de que estos operadores pueden también ser utilizados dentro de 
expresiones OGNL por sí mismos (y en ese caso serán ejecutados por OGNL en vez 
del motor de Expresiones Estándar de Thymeleaf):

```html
<div th:with="isEven=${prodStat.count % 2 == 0}">
```

Dese cuenta de que existen aliases textuales para algunos de estos operadores: 
`div` (`/`), `mod` (`%`).

## 4.10 Comparadores e igualdad 

Los valores en las expresiones pueden compararse con los símbolos 
`>`, `<`, `>=` y `<=`, y los operadores `==` y `!=` se pueden utilizar para 
comprobar la igualdad (o la ausencia de ella). Dese cuenta de que XML establece 
que los símbolos `<` y `>` no deberían utilizarse como valores de atributos, y 
por ello deben sustituirse por `&lt;` y `&gt;`.

```html
<div th:if="${prodStat.count} &gt; 1">
<span th:text="'El modo de ejecución es ' + ( (${execMode} == 'dev')? 'Desarrollo' : 'Producción')">
```

Una alternativa más simple podría ser usar los alias textuales que existen para 
algunos de estos operandos: `gt` (`>`), `lt` (`<`), `ge` (`>=`), `le` (`<=`), 
`not` (`!`). También `eq` (`==`), `neq`/`ne` (`!=`).

## 4.11 Expresiones condicionales

Las _expresiones condicionales_ están destinadas a evaluar solo una de dos 
expresiones dependiendo del resultado de evaluar una condición (que es en sí 
otra expresión).

Echemos una mirada a un fragmento de ejemplo (introduciendo otro _modificador de 
atributos_, `th:class`):

```html
<tr th:class="${row.even}? 'even' : 'odd'">
  ...
</tr>
```

Todas las partes de una expresión condicional (`condition`, `then` y `else`) son 
por sí mismas expresiones, lo que significa que pueden ser variables (`${...}`, 
`*{...}`), mensajes (`#{...}`), URL (`@{...}`) o literales (`'...'`).

Las expresiones condicionales pueden también anidarse usando paréntesis:

```html
<tr th:class="${row.even}? (${row.first}? 'first' : 'even') : 'odd'">
  ...
</tr>
```

Las expresiones Else (si no, N. del T.) pueden omitirse, en cuyo caso se devuelve 
un valor nulo si la condición es falsa:

```html
<tr th:class="${row.even}? 'alt'">
  ...
</tr>
```

## 4.12 Expresiones predeterminadas (operador Elvis)

Una _expresión por defecto_ es una clase especial de valor condicional sin una 
parte _then_. Es el equivalente al _Operador elvis_ presente en algunos lenguajes 
como Groovy, permitiéndole especificar dos expresiones: la primera se usa si no 
evalúa a nulo, pero si lo hace entonces se usa la segunda.

Veamos esto en acción en nuestra página de perfil de usuario:

```html
<div th:object="${session.user}">
  ...
  <p>Edad: <span th:text="*{age}?: '(sin edad especificada)'">27</span>.</p>
</div>
```
Como puede ver, el operador es `?:`, y lo usamos aquí para especificar un valor 
por defecto para un nombre (un valor literal, en este caso) solo si el resultado 
de evaluar `*{age}` es nulo. Esto es, por lo tanto, equivalente a:

```html
<p>Edad: <span th:text="*{age != null}? *{age} : '(sin edad especificada)'">27</span>.</p>
```

Como con los valores condicionales, pueden contener expresiones anidadas entre 
paréntesis:

```html
<p>
  Nombre: 
  <span th:text="*{firstName}?: (*{admin}? 'Administrador' : #{default.username})">Sebastian</span>
</p>
```

## 4.13 El token de no operación

La ficha No-Operación se representa por un símbolo de subrayado (`_`).

La idea detrás de esta ficha es especificar que el resultado deseado para una 
expresión es *no hacer nada*, por ejemplo, haga exactamente como si el atributo 
procesable (por ejemplo, `th:text`) no existiera en absoluto.

Entre otras posibilidades, esto permite a los desarrolladores a usar texto 
prototipado como valores por defecto. Por ejemplo, en vez de:

```html
<span th:text="${user.name} ?: 'usuario no autenticado'">...</span>
```
... Podemos usar directamente *'usuario no autenticado'* como un texto 
prototipado, lo que resulta en un código que es más conciso y versátil desde un 
punto de vista de diseño:

```html
<span th:text="${user.name} ?: _">usuario no autenticado</span>
```

## 4.14 Conversión y Formato de datos 

Thymeleaf define una sintaxis de *dobles llaves* para las expresiones de 
variables (`${...}`) y selección (`*{...}`) que nos permite aplicar 
*conversiones de datos* mediante un *servicio de conversión* configurado.

Básicamente funciona así:

```html
<td th:text="${{user.lastAccessDate}}">...</td>
```
¿Ha notado la doble llave?: `${{...}}`. Esto indica a Thymeleaf que pase el 
resultado de la expresión `user.lastAccessDate` al *servicio de conversión* y le 
solicita que realice una **operación de formato** (una conversión a `String`) 
antes de escribir el resultado.

Suponiendo que `user.lastAccessDate` es del tipo `java.util.Calendar`, si se ha 
registrado un *servicio de conversión* (implementación de 
`IStandardConversionService`) y contiene una conversión válida para 
`Calendar -> String`, se aplicará.

La implementación predeterminada de `IStandardConversionService` (la clase 
`StandardConversionService`) simplemente ejecuta `.toString()` en cualquier 
objeto convertido a `String`. Para obtener más información sobre cómo registrar 
una implementación personalizada de *servicio de conversión*, consulte la 
sección [Más sobre la configuración](#15-más-sobre-la-configuración).

> Los paquetes de integración oficiales thymeleaf-spring3 y thymeleaf-spring4 
> integran de forma transparente el mecanismo del servicio de conversión de 
> Thymeleaf con la infraestructura propia del *Servicio de Conversión* de 
> Spring, de modo que los servicios de conversión y los formateadores declarados 
> en la configuración de Spring estarán disponibles automáticamente para las 
> expresiones `${{...}}` y `*{{...}}`.

## 4.15 Preprocesamiento

Además de todas estas funciones para el procesamiento de expresiones, Thymeleaf 
cuenta con la función de preprocesar expresiones.

El preprocesamiento consiste en ejecutar las expresiones antes de la normal, lo 
que permite modificar la expresión que finalmente se ejecutará.

Las expresiones preprocesadas son exactamente iguales a las normales, pero 
aparecen rodeadas por un doble guion bajo (como `__${expression}__`).

Imaginemos que tenemos una entrada `Messages_fr.properties` de i18n que contiene 
una expresión OGNL que llama a un método estático específico del lenguaje, como:

```java
article.text=@myapp.translator.Translator@translateToFrench({0})
```

...y un equivalente de `Messages_es.properties`:

```java
article.text=@myapp.translator.Translator@translateToSpanish({0})
```

Podemos crear un fragmento de marcado que evalúe una u otra expresión según la 
configuración regional. Para ello, primero seleccionaremos la expresión 
(mediante preprocesamiento) y luego dejaremos que Thymeleaf la ejecute:...

```html
<p th:text="${__#{article.text('textVar')}__}">Algún texto aquí...</p>
```

y un equivalente de `Messages_es.properties`:

```java
article.text=@myapp.translator.Translator@translateToSpanish({0})
```
Tenga en cuenta que el paso de preprocesamiento para una configuración regional 
en francés creará el siguiente equivalente:

```html
<p th:text="${@myapp.translator.Translator@translateToFrench(textVar)}">Algo de texto aquí...</p>
```

La cadena de preprocesamiento `__` se puede escapar en los atributos 
usando `\_\_`.

# 5 Establecer valores de atributos

Este capítulo explicará la forma en que podemos establecer (o modificar) valores 
de atributos en nuestro marcado.

## 5.1 Establecer el valor de cualquier atributo

Digamos que nuestro sitio web publica un boletín informativo y queremos que 
nuestros usuarios puedan suscribirse a él, por lo que creamos una plantilla 
`/WEB-INF/templates/subscribe.html` con un formulario:

```html
<form action="subscribe.html">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="¡Subscribase!" />
  </fieldset>
</form>
```
Al igual que con Thymeleaf, esta plantilla se parece más a un prototipo estático 
que a una plantilla para una aplicación web. En primer lugar, el atributo 
`action` de nuestro formulario enlaza estáticamente al archivo de plantilla, lo 
que evita la reescritura de URL. En segundo lugar, el atributo `value` del 
botón de envío muestra un texto en inglés, pero nos gustaría que estuviera 
internacionalizado.

Ingrese entonces el atributo `th:attr` y su capacidad para cambiar el valor de 
los atributos de las etiquetas en las que está configurado:

```html
<form action="subscribe.html" th:attr="action=@{/subscribe}">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="¡Subscribase!" th:attr="value=#{subscribe.submit}"/>
  </fieldset>
</form>
```
El concepto es bastante sencillo: `th:attr` simplemente toma una expresión que 
asigna un valor a un atributo. Tras crear los archivos de controlador y mensajes 
correspondientes, el resultado del procesamiento de este archivo será:

```html
<form action="/gtvg/subscribe">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="¡Suscríbase!"/>
  </fieldset>
</form>
```
Además de los nuevos valores de atributos, también puedes ver que el nombre del 
contexto de la aplicación se ha prefijado automáticamente a la base de URL en 
`/gtvg/subscribe`, como se explicó en el capítulo anterior.

¿Y si quisiéramos configurar más de un atributo a la vez? Las reglas XML no 
permiten configurar un atributo dos veces en una etiqueta, por lo que `th:attr` 
tomará una lista de asignaciones separadas por comas, como:

```html
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

Dados los archivos de mensajes necesarios, esto generará:

```html
<img src="/gtgv/images/gtvglogo.png" title="Logo de Good Thymes" alt="Logo de Good Thymes" />
```

## 5.2 Establecer valores para atributos específicos

A estas alturas, es posible que estés pensando en algo como esto:

```html
<input type="submit" value="Subscribe!" th:attr="value=#{subscribe.submit}"/>
```

...es una pieza de marcado bastante fea. Especificar una asignación dentro del 
valor de un atributo puede ser muy práctico, pero no es la forma más elegante de 
crear plantillas si tienes que hacerlo constantemente.

Thymeleaf está de acuerdo contigo, y por eso «th:attr» apenas se usa en las 
plantillas. Normalmente, usarás otros atributos «th:*» cuya función es 
establecer atributos de etiqueta específicos (y no cualquier atributo como 
`th:attr`).

Por ejemplo, para establecer el atributo `value`, use `th:value`:

```html
<input type="submit" value="¡Subscribase!" th:value="#{subscribe.submit}"/>
```
¡Esto se ve mucho mejor! Intentemos hacer lo mismo con el atributo `action` en 
la etiqueta `form`:

```html
<form action="subscribe.html" th:action="@{/subscribe}">
```
¿Y recuerdas esos `th:href` que incluimos en nuestro `home.html`? Son 
exactamente el mismo tipo de atributos:

```html
<li><a href="product/list.html" th:href="@{/product/list}">Lista de Productos</a></li>
```
Hay muchos atributos como estos, cada uno de ellos dirigido a un atributo HTML5 
específico:

---------------------- ---------------------- ----------------------
`th:abbr`              `th:accept`            `th:accept-charset`    
`th:accesskey`         `th:action`            `th:align`             
`th:alt`               `th:archive`           `th:audio`             
`th:autocomplete`      `th:axis`              `th:background`        
`th:bgcolor`           `th:border`            `th:cellpadding`       
`th:cellspacing`       `th:challenge`         `th:charset`           
`th:cite`              `th:class`             `th:classid`           
`th:codebase`          `th:codetype`          `th:cols`              
`th:colspan`           `th:compact`           `th:content`           
`th:contenteditable`   `th:contextmenu`       `th:data`              
`th:datetime`          `th:dir`               `th:draggable`         
`th:dropzone`          `th:enctype`           `th:for`               
`th:form`              `th:formaction`        `th:formenctype`       
`th:formmethod`        `th:formtarget`        `th:fragment`          
`th:frame`             `th:frameborder`       `th:headers`           
`th:height`            `th:high`              `th:href`              
`th:hreflang`          `th:hspace`            `th:http-equiv`        
`th:icon`              `th:id`                `th:inline`            
`th:keytype`           `th:kind`              `th:label`             
`th:lang`              `th:list`              `th:longdesc`          
`th:low`               `th:manifest`          `th:marginheight`      
`th:marginwidth`       `th:max`               `th:maxlength`         
`th:media`             `th:method`            `th:min`               
`th:name`              `th:onabort`           `th:onafterprint`      
`th:onbeforeprint`     `th:onbeforeunload`    `th:onblur`            
`th:oncanplay`         `th:oncanplaythrough`  `th:onchange`          
`th:onclick`           `th:oncontextmenu`     `th:ondblclick`        
`th:ondrag`            `th:ondragend`         `th:ondragenter`       
`th:ondragleave`       `th:ondragover`        `th:ondragstart`       
`th:ondrop`            `th:ondurationchange`  `th:onemptied`         
`th:onended`           `th:onerror`           `th:onfocus`           
`th:onformchange`      `th:onforminput`       `th:onhashchange`      
`th:oninput`           `th:oninvalid`         `th:onkeydown`         
`th:onkeypress`        `th:onkeyup`           `th:onload`            
`th:onloadeddata`      `th:onloadedmetadata`  `th:onloadstart`       
`th:onmessage`         `th:onmousedown`       `th:onmousemove`       
`th:onmouseout`        `th:onmouseover`       `th:onmouseup`         
`th:onmousewheel`      `th:onoffline`         `th:ononline`          
`th:onpause`           `th:onplay`            `th:onplaying`         
`th:onpopstate`        `th:onprogress`        `th:onratechange`      
`th:onreadystatechange``th:onredo`            `th:onreset`           
`th:onresize`          `th:onscroll`          `th:onseeked`          
`th:onseeking`         `th:onselect`          `th:onshow`            
`th:onstalled`         `th:onstorage`         `th:onsubmit`          
`th:onsuspend`         `th:ontimeupdate`      `th:onundo`            
`th:onunload`          `th:onvolumechange`    `th:onwaiting`         
`th:optimum`           `th:pattern`           `th:placeholder`       
`th:poster`            `th:preload`           `th:radiogroup`        
`th:rel`               `th:rev`               `th:rows`              
`th:rowspan`           `th:rules`             `th:sandbox`           
`th:scheme`            `th:scope`             `th:scrolling`         
`th:size`              `th:sizes`             `th:span`              
`th:spellcheck`        `th:src`               `th:srclang`           
`th:standby`           `th:start`             `th:step`              
`th:style`             `th:summary`           `th:tabindex`          
`th:target`            `th:title`             `th:type`              
`th:usemap`            `th:value`             `th:valuetype`         
`th:vspace`            `th:width`             `th:wrap`              
`th:xmlbase`           `th:xmllang`           `th:xmlspace`          
---------------------- ---------------------- ----------------------

## 5.3 Establecer más de un valor a la vez

Existen dos atributos bastante especiales, llamados `th:alt-title` y 
`th:lang-xmllang`, que permiten asignar el mismo valor a dos atributos 
simultáneamente. En concreto:

 * `th:alt-title` establecerá `alt` y `title`. 
 * `th:lang-xmllang` establecerá `lang` y `xml:lang`.

Para nuestra pagína de inicio GTVG, esto nos permitirá substituir esto:

```html
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

... A esto, lo que es equivalente:

```html
<img src="../../images/gtvglogo.png" 
     th:src="@{/images/gtvglogo.png}" th:title="#{logo}" th:alt="#{logo}" />
```

... Con esto:

```html
<img src="../../images/gtvglogo.png" 
     th:src="@{/images/gtvglogo.png}" th:alt-title="#{logo}" />
```

## 5.4 Anexar y anteponer

Thymeleaf también ofrece los atributos `th:attrappend` y `th:attrprepend`, que 
añaden (sufijo) o anteponen (prefijo) el resultado de su evaluación a los 
valores de los atributos existentes.

Por ejemplo, es posible que desees almacenar el nombre de una clase CSS que se 
aplique y agregará (no se configurará, solo se agregará) a uno de tus botones en 
una variable de contexto, porque la clase CSS específica que se usará dependerá 
de algo que el usuario hizo antes:

```html
<input type="button" value="¡Hazlo!" class="btn" th:attrappend="class=${' ' + cssStyle}" />
```

Si procesa esta plantilla con la variable `cssStyle` establecida en `"warning"`, 
obtendrá:

```html
<input type="button" value="¡Hazlo!" class="btn warning" />
```

También hay dos _atributos de agregación_ específicos en el dialecto estándar: 
los atributos `th:classappend` y `th:styleappend`, que se utilizan para agregar 
una clase CSS o un fragmento de _style_ a un elemento sin sobrescribir los 
existentes:

```html
<tr th:each="prod : ${prods}" class="row" th:classappend="${prodStat.odd}? 'odd'">
```
(No te preocupes por el atributo `th:each`. Es un _atributo iterativo_ y 
hablaremos de él más adelante).

## 5.5 Atributos booleanos de valor fijo

HTML utiliza el concepto de _atributos booleanos_, atributos que no tienen valor 
y la presencia de uno significa que el valor es "verdadero". En XHTML, estos 
atributos solo aceptan un valor: él mismo.

Por ejemplo, `checked`:

```html
<input type="checkbox" name="option2" checked /> <!-- HTML -->
<input type="checkbox" name="option1" checked="checked" /> <!-- XHTML -->
```
El dialecto estándar incluye atributos que le permiten configurar estos 
atributos evaluando una condición, de modo que si se evalúa como verdadero, el 
atributo se configurará en su valor fijo, y si se evalúa como falso, el atributo 
no se configurará:

```html
<input type="checkbox" name="active" th:checked="${user.active}" />
```

Los siguientes atributos booleanos de valor fijo existen en el dialecto 
estándar:

|                     |                |                 |
|:-------------------:|:--------------:|:---------------:|
|     `th:async`      | `th:autofocus` |  `th:autoplay`  |
|    `th:checked`     | `th:controls`  |  `th:declare`   |
|    `th:default`     |   `th:defer`   |  `th:disabled`  |
| `th:formnovalidate` |  `th:hidden`   |   `th:ismap`    |
|      `th:loop`      | `th:multiple`  | `th:novalidate` |
|     `th:nowrap`     |   `th:open`    |  `th:pubdate`   |
|    `th:readonly`    | `th:required`  |  `th:reversed`  |
|     `th:scoped`     | `th:seamless`  |  `th:selected`  |

## 5.6 Compatibilidad con nombres de elementos y atributos compatibles con HTML5

Thymeleaf ofrece un *procesador de atributos predeterminado* que nos permite 
establecer el valor de *cualquier* atributo, incluso si no se ha definido un 
procesador `th:*` específico para él en el dialecto estándar.

Entonces algo como:

```html
<span th:whatever="${user.name}">...</span>
```

Dará como resultado:

```html
<span whatever="John Apricot">...</span>
```

## 5.7 Compatibilidad con nombres de elementos y atributos compatibles con HTML5

También es posible utilizar una sintaxis completamente diferente para aplicar 
procesadores a sus plantillas de una manera más compatible con HTML5.

```html	
<table>
    <tr data-th-each="user : ${users}">
        <td data-th-text="${user.login}">...</td>
        <td data-th-text="${user.name}">...</td>
    </tr>
</table>
```
La sintaxis `data-{prefix}-{name}` es la forma estándar de escribir atributos 
personalizados en HTML5, sin necesidad de que los desarrolladores usen nombres 
con espacios de nombres como `th:*`. Thymeleaf hace que esta sintaxis esté 
disponible automáticamente para todos sus dialectos (no solo para los estándares).

También existe una sintaxis para especificar etiquetas personalizadas: 
`{prefijo}-{nombre}`, que sigue la _especificación de Elementos Personalizados 
del W3C_ (parte de la _especificación más amplia de Componentes Web del W3C_). 
Esto se puede usar, por ejemplo, para el elemento `th:block` (o también 
`th-block`), que se explicará en una sección posterior.

**Importante:** Esta sintaxis se añade a la sintaxis con espacio de nombres 
`th:*`, no la reemplaza. No se pretende discontinuar la sintaxis con espacio de 
nombres en el futuro.

# 6 Iteración

Hasta ahora hemos creado una página de inicio, una página de perfil de usuario y 
una página para que los usuarios se suscriban a nuestro boletín informativo... 
pero ¿qué pasa con nuestros productos? Para ello, necesitaremos una forma de 
iterar sobre los artículos de una colección para crear nuestra página de 
producto.

## 6.1 Conceptos básicos de iteración

Para mostrar los productos en nuestra página 
`/WEB-INF/templates/product/list.html`, usaremos una tabla. Cada producto se 
mostrará en una fila (un elemento `<tr>`), por lo que para nuestra plantilla 
necesitaremos crear una _fila de plantilla_ (que ejemplifique cómo queremos que 
se muestre cada producto) y luego indicarle a Thymeleaf que la repita una vez 
para cada producto.

El dialecto estándar nos ofrece un atributo exactamente para eso: `th:each`.

### Usando th:each

Para nuestra página de lista de productos, necesitaremos un método controlador 
que recupere la lista de productos de la capa de servicio y la agregue al 
contexto de la plantilla:

```java
public void process(
        final IWebExchange webExchange, 
        final ITemplateEngine templateEngine, 
        final Writer writer)
        throws Exception {
    
    final ProductService productService = new ProductService();
    final List<Product> allProducts = productService.findAll();
    
    final WebContext ctx = new WebContext(webExchange, webExchange.getLocale());
    ctx.setVariable("prods", allProducts);
    
    templateEngine.process("product/list", ctx, writer);
    
}
```

Y luego usaremos `th:each` en nuestra plantilla para iterar sobre la lista de 
productos:

```html
<!DOCTYPE html>

<html xmlns:th="http://www.thymeleaf.org">

  <head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
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
        <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
      </tr>
    </table>
  
    <p>
      <a href="../home.html" th:href="@{/}">Regresar al Inicio</a>
    </p>

  </body>

</html>
```
El valor del atributo `prod : ${prods}` que se ve arriba significa que, para 
cada elemento del resultado de la evaluación de `${prods}`, se repite este 
fragmento de plantilla, utilizando el elemento actual en una variable llamada 
prod. Asignemos un nombre a cada elemento que vemos:

* Llamaremos `${prods}` a la _expresión iterada_ o _variable iterada_.
* Llamaremos `prod` a la _variable de iteración_ o simplemente _variable iteradora_.

Tenga en cuenta que la variable iteradora `prod` tiene como ámbito el elemento 
`<tr>`, lo que significa que está disponible para etiquetas internas como `<td>`.

### Valores iterables

La clase `java.util.List` no es el único valor que se puede usar para la 
iteración en Thymeleaf. Existe un conjunto bastante completo de objetos que se 
consideran _iterables_ mediante un atributo `th:each`:

 * Cualquier objeto que implemente `java.util.Iterable`
 * Cualquier objeto que implemente `java.util.Enumeration`.
 * Cualquier objeto que implemente `java.util.Iterator`, cuyos valores se 
   utilizarán tal como son devueltos por el iterador, sin la necesidad de 
   almacenar en caché todos los valores en la memoria.
 * Cualquier objeto que implemente `java.util.Map`. Al iterar mapas, las 
   variables iteradoras serán de la clase `java.util.Map.Entry`.
 * Cualquier objeto que implemente `java.util.stream.Stream`.
 * Cualquier matriz.
 * Cualquier otro objeto se tratará como si fuera una lista de un solo valor que 
   contiene el objeto mismo.

## 6.2 Mantener el estado de la iteración

Cuando usa `th:each`, Thymeleaf ofrece un mecanismo útil para seguir la pista del 
estado de tu iteración: _la variable status_.

Las variables de estado se definen dentro de un atributo `th:each` y contiene los
siguientes datos:

 * El _índice de iteración_ actual, que empieza en 0. Esta es la propiedad `index`.  
 * El _índice de iteración_ actual, que empieza en 1. Esta es la propiedad `count`. 
 * La cantidad total de elementos en la variable iterada. Esta es la propiedad `size`. 
 * La _variable iter_ para cada iteración. Esta es la propiedad `current`.
 * Si la iteración actual es par o impar. Estas son las propiedades booleanas `even/odd`. 
 * Si la iteración actual es la primera de todas. Esta es la propiedad booleana `first`. 
 * Si la iteración actual es la última de todas. Esta es la propiedad booleana `last`.

Vea como podríamos usarlo con el ejemplo previo:

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
    <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
  </tr>
</table>
```

La variable status (`iterStat` en este ejemplo) se define en el atributo
`th:each` escribiendo su nombre después la propia variable iter, separada por una
coma. Al igual que la variable iter, la variable de estado también tiene como 
alcance el fragmento de código definido por la etiqueta que contiene el atributo 
`th:each`.

Echemos un vistazo al resultado de procesar nuestra plantilla:

```html
<!DOCTYPE html>

<html>

  <head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <link rel="stylesheet" type="text/css" media="all" href="/gtvg/css/gtvg.css" />
  </head>

  <body>

    <h1>Lista de productos</h1>
  
    <table>
      <tr>
        <th>NOMBRE</th>
        <th>PRECIO</th>
        <th>EN STOCK</th>
      </tr>
      <tr class="odd">
        <td>Albahaca dulce fresca</td>
        <td>4.99</td>
        <td>sí</td>
      </tr>
      <tr>
        <td>Tomate italiano</td>
        <td>1.25</td>
        <td>no</td>
      </tr>
      <tr class="odd">
        <td>Pimiento amarillo</td>
        <td>2.50</td>
        <td>sí</td>
      </tr>
      <tr>
        <td>Cheddar viejo</td>
        <td>18.75</td>
        <td>sí</td>
      </tr>
    </table>
  
    <p>
      <a href="/gtvg/" shape="rect">Regresar al inicio</a>
    </p>

  </body>
  
</html>
```

Tenga en cuenta que nuestra variable de estado de iteración ha funcionado 
perfectamente, estableciendo la clase CSS `odd` solo para las filas impares.

Si no establece explícitamente una variable de estado, Thymeleaf siempre 
creará una para usted agregando el sufijo `Stat` al nombre de la variable de 
iteración:

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
    <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
  </tr>
</table>
```

## 6.3 Optimización mediante recuperación diferida de datos

Algunas veces podríamos querer optimizar la adquisición de colecciones de datos 
(p. ej. desde una base de datos) así que estas colecciones se recuperan únicamente si 
realmente se van a utilizar.
 
> De hecho, esto es algo que puede ser aplicado a *cualquier* pieza de datos, pero dado el tamaño
> que las colecciones en memoria podrían tener, la recuperación de colecciones que deben iterarse 
> es el caso más común para este escenario.

Para facilitar esto, Thymeleaf ofrece un mecanismo para cargar variables de contexto de forma 
diferida. Las variables de contexto que implementan la interfaz `ILazyContextVariable` (probablemente 
extendiendo su implementación predeterminada `LazyContextVariable`) se resolverán al 
momento de su ejecución. Por ejemplo:

```java
context.setVariable(
     "users",
     new LazyContextVariable<List<User>>() {
         @Override
         protected List<User> loadValue() {
             return databaseRepository.findAllUsers();
         }
     });
```

Esta variable puede utilizarse sin conocimiento de su *carga perezosa*, en código como:

```html
<ul>
  <li th:each="u : ${users}" th:text="${u.name}">nombre de usuario</li>
</ul>
```

Pero al mismo tiempo, nunca será inicializada (su método `loadValue()` nunca se 
llamará) si la `condition` evalúa a `false` en un código como:

```html
<ul th:if="${condition}">
  <li th:each="u : ${users}" th:text="${u.name}">nombre de usuario</li>
</ul>
```

# 7 Evaluación condicional

## 7.1 Condicionales simples: "if" y "unless"

Algunas veces necesitarás que un fragmento de su plantilla solo aparezca en el resultado
si se cumple una cierta condición.

Por ejemplo, imagine que queremos mostrar en nuestra tabla de productos una columna con el 
número de comentarios que exista para cada producto y, si hay algunos comentarios, un 
enlace a la página de detalle del comentario para ese producto.

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
    <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
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

Esto creará un enlace a la página de comentarios (con URL `/product/comments`) 
con un parámetro `prodId` establecido en el `id` del producto, pero solo si el 
producto tiene algún comentario.

Echemos un vistazo al marcado resultante:

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

¡Perfecto! Eso es exactamente lo que queríamos.

Tenga en cuenta que el atributo `th:if` no solo evalúa condiciones _booleanas_.
Sus capacidades van un poco más allá y evaluará la expresión especificada como `true` siguiendo estas reglas:

 * El valor no es nulo:
    * Si el valor es un valor booleano y es `true`.
    * Si el valor es un número y no es cero.
    * Si el valor es un carácter y no es cero
    * Si el valor es una String y esta no es "false", "off"" o "no"
    * Si el valor no es un booleano, un número, un carácter o una String.
 * (Si el valor es null, th:if evaluará a falso).

Además, `th:if` tiene un atributo inverso, `th:unless`, el cual podríamos haber usado en 
el ejemplo previo en vez de usar un `not` dentro de la expresión OGNL:

```html
<a href="comments.html"
   th:href="@{/comments(prodId=${prod.id})}" 
   th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
```

## 7.2 Sentencias Switch

También hay una forma de mostrar contenido condicionalmente usando el equivalente de una 
estructura _switch_ en Java: el conjunto de atributos `th:switch` / `th:case`.

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">El usuario es administrador</p>
  <p th:case="#{roles.manager}">El usuario es un gerente</p>
</div>
```

Tenga en cuenta que tan pronto como un atributo `th:case` se evalúa como `true`, todos los 
demás atributos `th:case` en el mismo contexto de conmutación se evalúan como `false`.

La opción predeterminada se especifica como `th:case="*"`:

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">El usuario es administrador</p>
  <p th:case="#{roles.manager}">El usuario es un gerente</p>
  <p th:case="*">El usuario es alguna otra cosa</p>
</div>
```

# 8 Diseño de plantillas

## 8.1 Incluyendo fragmentos de plantilla

### Definición y referencia de fragmentos

En nuestras plantillas, a menudo querremos incluir partes de otras plantillas, 
partes como pies de página, cabeceras, menús...

Para poder hacer esto, Thymeleaf necesita que definamos estas partes, 
los "fragmentos", para su inclusión, que se realiza usando el atributo 
`th:fragment`. 

Digamos que queremos agregar un pie de página estándar de derechos de autor a 
todas nuestras páginas de comestibles, por lo que creamos un archivo
`/WEB-INF/templates/footer.html` que contiene este código:

```html
<!DOCTYPE html>

<html xmlns:th="http://www.thymeleaf.org">

  <body>
  
    <div th:fragment="copy">
      &copy; 2011 La tienda de comestibles virtual Good Thymes
    </div>
  
  </body>
  
</html>
```

El código de arriba define un fragmento llamado `copy` que podemos incluir 
facilmente en nuestra página de inicio usando uno de los atributos  `th:insert` 
o `th:replace`:

```html
<body>

  ...

  <div th:insert="~{footer :: copy}"></div>
  
</body>
```

Fíjese que `th:insert` espera una *expresión de fragmento* (`~{...}`), que es 
una *expresión que da como resultado un fragmento*.

### Sintaxis de especificación de fragmentos

La sintaxis de las *expresiones de fragmento* es bastante sencilla. Hay tres 
formatos diferentes:

 * `"~{templatename::selector}"` Incluye el fragmento resultante de aplicar el 
   marcador Selector especificado en la plantilla llamada `templatename`. Fíjese 
   que `selector` puede ser un mero nombre de fragmento, por lo que podría 
   especificar algo tan simple como `~{templatename::fragmentname}` como en el
   `~{footer :: copy}` anterior.

   > La sintaxis del Selector de Marcado se define mediante la biblioteca de 
   > análisis AttoParser y es similar a las de las expresiones XPath o los 
   > selectores CSS. Consulte el
   > [Apéndice C](#20-apéndice-c-sintaxis-del-selector-de-marcado) para más 
   > información.

   
 * `"~{templatename}"` Incluye la plantilla completa de nombre  `templatename`.

   > Fíjese que el nombre de la plantilla que utiliza en las etiquetas
   > `th:insert`/`th:replace` tendrán que ser resueltas por el 
   > Resolvedor de Plantillas (Template Resolver) que actualmente esté usando el 
   > Motor de Plantillas (Template Engine).

 * `~{::selector}"` o `"~{this::selector}"` Insertan un fragmento desde la misma
   plantilla, que coincida con `selector`.  Si no se encuentra en la plantilla 
   donde aparece la expresión, se recorre la pila de llamadas de plantilla 
   (inserciones) hacia la plantilla procesada originalmente (la *raíz*), hasta 
   que `selector` coincide en algún nivel.


Tanto `templatename` como `selector` en los ejemplos de arriba pueden ser 
expresiones con todas las funcionalidades (¡incluso condicionales!) como:

```html
<div th:insert="~{ footer :: (${user.isAdmin}? #{footer.admin} : #{footer.normaluser}) }"></div>
```
Los fragmentos pueden incluir cualquier atributo `th:*`. Estos atributos serán 
evaluados una vez el fragmento se incluye dentro de la plantilla objetivo (la 
que contiene el atributo `th:insert`/`th:replace`), y será capaz de referenciar 
cualesquiera variables de contexto definidas en la plantilla objetivo.

> Una gran ventaja de este enfoque para los fragmentos es que puedes escribirlos
> en páginas que son perfectamente visualizables por un navegador, con una  
> estructura de marcado completa e incluso *válida*, al tiempo que conservas la 
> capacidad de hacer que Thymeleaf los incluya en otras plantillas.


### Referenciar fragmentos sin `th:fragment`

Gracias al poder de los Selectores de Marcado, podemos incluir fragmentos que 
no usen ningún atributo `th:fragment`. Puede incluso ser código fuente que 
proviene de una aplicación diferente sin ningún conocimiento de Thymeleaf:

```html
...
<div id="copy-section">
  &copy; 2011 La tienda de comestibles virtual Good Thymes
</div>
...
```

Podemos usar el fragmento de arriba simplemente referenciándolo por su atributo 
`id`, de forma similar a un selector CSS:

```html
<body>

  ...

  <div th:insert="~{footer :: #copy-section}"></div>
  
</body>
```

### Diferencia entre `th:insert` y `th:replace`

¿Y cuál es la diferencia entre `th:insert` y `th:replace`?

 * `th:insert` simplemente insertará el fragmento especificado como el cuerpo de
   su etiqueta anfitriona.

 * `th:replace` en realidad *reemplaza* su etiqueta anfitriona con el fragmento 
 * especificado.

Así, un fragmento HTML como este:

```html
<footer th:fragment="copy">
  &copy; 2011 La tienda de comestibles virtual Good Thymes
</footer>
```

...incluído dos veces en las etiquetas DIV, de esta manera:

```html
<body>

  ...

  <div th:insert="~{footer :: copy}"></div>

  <div th:replace="~{footer :: copy}"></div>
  
</body>
```

... Dará como resultado:

```html
<body>

  ...

  <div>
    <footer>
      &copy; 2011 La tienda de comestibles virtual Good Thymes
    </footer>
  </div>

  <footer>
    &copy; 2011 La tienda de comestibles virtual Good Thymes
  </footer>
  
</body>
```

## 8.2 Firmas de fragmentos parametrizables

Para crear un mecanismo más funcional para los fragmentos de plantilla, los 
fragmentos definidos con `th:fragment` pueden especificar un conjunto de 
parámetros:
	
```html
<div th:fragment="frag (onevar,twovar)">
    <p th:text="${onevar} + ' - ' + ${twovar}">...</p>
</div>
```

Esto requiere el uso de una de estas dos sintaxis para llamar al fragmento desde 
`th:insert` o `th:replace`:

```html
<div th:replace="~{ ::frag (${value1},${value2}) }">...</div>
<div th:replace="~{ ::frag (onevar=${value1},twovar=${value2}) }">...</div>
```

Tenga en cuenta que el orden no es importante en la última opción:

```html
<div th:replace="~{ ::frag (twovar=${value2},onevar=${value1}) }">...</div>
```

### Variables locales de fragmentos sin firma de fragmento

Incluso si los fragmentos se definen sin argumentos como este:

```html	
<div th:fragment="frag">
    ...
</div>
```

Podríamos usar la segunda sintaxis especificada anteriormente para llamarlos (y solo la segunda):

```html	
<div th:replace="~{::frag (onevar=${value1},twovar=${value2})}">
```

Esto sería equivalente a una combinación de `th:replace` y `th:with`:

```html	
<div th:replace="~{::frag}" th:with="onevar=${value1},twovar=${value2}">
```

**Nota**: Esta especificación de variables locales para un fragmento, 
independientemente de si tiene una firma de argumento o no, no provoca que el 
contexto se vacíe antes de su ejecución. Los fragmentos podrán acceder a todas 
las variables de contexto utilizadas en la plantilla de llamada, como lo hacen 
actualmente.


### th:assert para afirmaciones dentro de la plantilla

El atributo `th:assert` puede especificar una lista de expresiones separadas por 
comas que deben evaluarse y producir verdadero para cada evaluación, generando 
una excepción en caso contrario.

```html
<div th:assert="${onevar},(${twovar} != 43)">...</div>
```

Esto resulta útil para validar parámetros en una firma de fragmento:

```html
<header th:fragment="contentheader(title)" th:assert="${!#strings.isEmpty(title)}">...</header>
```

## 8.3 Eliminación de fragmentos de plantilla

Gracias a las *expresiones de fragmento*, podemos especificar parámetros para 
fragmentos que no son textos, números ni objetos bean, sino fragmentos de 
marcado.

Esto nos permite crear nuestros fragmentos de forma que se puedan *enriquecer* 
con el marcado procedente de las plantillas que los llaman, lo que resulta en un 
*mecanismo de diseño de plantillas* muy flexible.

Observe el uso de las variables `title` y `links` en el fragmento a continuación:

```html
<head th:fragment="common_header(title,links)">

  <title th:replace="${title}">La increíble aplicación</title>

  <!-- Estilos comunes y scripts  -->
  <link rel="stylesheet" type="text/css" media="all" th:href="@{/css/awesomeapp.css}">
  <link rel="shortcut icon" th:href="@{/images/favicon.ico}">
  <script type="text/javascript" th:src="@{/sh/scripts/codebase.js}"></script>

  <!--/* Marcador de posición por página para enlaces adicionales */-->
  <th:block th:replace="${links}" />

</head>
```

Ahora podemos llamar a este fragmento así:

```html
...
<head th:replace="~{ base :: common_header(~{::title},~{::link}) }">

  <title>Impresionante - Principal</title>

  <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
  <link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}">

</head>
...
```
... Y el resultado usará las etiquetas `<title>` y `<link>` de nuestra plantilla 
llamada, de llamada como valores de las variables `title` y `links`, lo que hará 
que nuestro fragmento se personalice durante la inserción:


```html
...
<head>

  <title>Impresionante - Principal</title>

    <!-- Estilos comunes y scripts  -->
  <link rel="stylesheet" type="text/css" media="all" href="/awe/css/awesomeapp.css">
  <link rel="shortcut icon" href="/awe/images/favicon.ico">
  <script type="text/javascript" src="/awe/sh/scripts/codebase.js"></script>

  <link rel="stylesheet" href="/awe/css/bootstrap.min.css">
  <link rel="stylesheet" href="/awe/themes/smoothness/jquery-ui.css">

</head>
...
```

### Usando el fragmento vacío

Se puede usar una expresión de fragmento especial, el *fragmento vacío* (`~{}`), 
para especificar *sin marcado*. Siguiendo el ejemplo anterior:

```html
<head th:replace="~{ base :: common_header(~{::title},~{}) }">

  <title>Impresionante - Principal</title>

</head>
...
```
Observe cómo el segundo parámetro del fragmento (`links`) se establece en el 
*fragmento vacío* y, por lo tanto, no se escribe nada para el bloque 
`<th:block th:replace="${links}" />`:

```html
...
<head>

  <title>Impresionante - Principal</title>

  <!-- Estilos comunes y scripts  -->
  <link rel="stylesheet" type="text/css" media="all" href="/awe/css/awesomeapp.css">
  <link rel="shortcut icon" href="/awe/images/favicon.ico">
  <script type="text/javascript" src="/awe/sh/scripts/codebase.js"></script>

</head>
...
```

### Uso del token de no operación

La operación no-operación (`_`) se puede también se puede usar como parámetro de 
un fragmento si simplemente queremos que nuestro fragmento use su marcado actual 
como valor predeterminado. De nuevo, usando el ejemplo `common_header`:

```html
...
<head th:replace="~{base :: common_header(_,~{::link})}">

  <title>Impresionante - Principal</title>

  <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
  <link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}">

</head>
...
```

Observe cómo el argumento `title` (primer argumento del fragmento 
`common_header`) se establece en *no-op* (`_`), lo que hace que esta parte del 
fragmento no se ejecute en absoluto (`title` = *no-operation*):

```html
  <title th:replace="${title}">La increíble aplicación</title>
```

Entonces el resultado es:

```html
...
<head>

  <title>Impresionante - Principal</title>

  <!-- Estilos comunes y scripts -->
  <link rel="stylesheet" type="text/css" media="all" href="/awe/css/awesomeapp.css">
  <link rel="shortcut icon" href="/awe/images/favicon.ico">
  <script type="text/javascript" src="/awe/sh/scripts/codebase.js"></script>

  <link rel="stylesheet" href="/awe/css/bootstrap.min.css">
  <link rel="stylesheet" href="/awe/themes/smoothness/jquery-ui.css">

</head>
...
```

### Inserción condicional avanzada de fragmentos

La disponibilidad tanto del *fragmento vacío* como del *token de no operación* 
nos permite realizar la inserción condicional de fragmentos de forma sencilla y 
elegante.

Por ejemplo, podríamos hacer esto para insertar nuestro fragmento 
`common::adminhead` *solo* si el usuario es administrador y no insertar nada 
(fragmento vacío) si no lo es:

```html
...
<div th:insert="${user.isAdmin()} ? ~{common :: adminhead} : ~{}">...</div>
...
```

También podemos usar el token *no-operation* para insertar un fragmento solo si 
se cumple la condición especificada, pero dejar el marcado sin modificaciones si 
no se cumple la condición:

```html
...
<div th:insert="${user.isAdmin()} ? ~{common :: adminhead} : _">
    Bienvenido [[${user.name}]], pulse <a th:href="@{/support}">aquí</a> para soporte técnico.
</div>
...
```

Además, si hemos configurado nuestros solucionadores de plantillas para 
*verificar la existencia* de los recursos de plantilla -- mediante su indicador 
`checkExistence`) --, podemos usar la existencia del propio fragmento como 
condición en una operación *predeterminada*:

```html
...
<!-- El cuerpo de la <div> se usará si el fragmento "common :: salutation"   -->
<!-- no existe  (o está vacío).                                              -->
<div th:insert="~{common :: salutation} ?: _">
    Bienvenido [[${user.name}]], pulse <a th:href="@{/support}">aquí</a> para soporte técnico.
</div>
...
```

## 8.4 Eliminación de fragmentos de plantilla

Volviendo a la aplicación de ejemplo, revisemos la última versión de nuestra 
plantilla de lista de productos:

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
    <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
    <td>
      <span th:text="${#lists.size(prod.comments)}">2</span> comentario/s
      <a href="comments.html" 
         th:href="@{/product/comments(prodId=${prod.id})}" 
         th:unless="${#lists.isEmpty(prod.comments)}">ver</a>
    </td>
  </tr>
</table>
```

Este código funciona bien como plantilla, pero como página estática (al abrirse 
directamente en un navegador sin que Thymeleaf lo procese) no sería un buen 
prototipo.

¿Por qué? Porque, aunque se puede visualizar perfectamente en los navegadores, 
esa tabla solo tiene una fila, y esta fila contiene datos ficticios. Como 
prototipo, simplemente no se vería lo suficientemente realista... Deberíamos 
tener más de un producto; necesitamos más filas.

Agreguemos algunos:

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
    <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
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

Bien, ahora tenemos tres, definitivamente mejor para un prototipo. Pero... ¿Qué 
pasará cuando lo procesemos con Thymeleaf?

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
    <td>sí</td>
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
    <td>sí</td>
    <td>
      <span>0</span> comentario/s
    </td>
  </tr>
  <tr class="odd">
    <td>Cheddar viejo</td>
    <td>18.75</td>
    <td>sí</td>
    <td>
      <span>1</span> comentario/s
      <a href="/gtvg/product/comments?prodId=4">ver</a>
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
    <td>sí</td>
    <td>
      <span>3</span> comentario/s
      <a href="comments.html">ver</a>
    </td>
  </tr>
</table>
```

¡Las dos últimas filas son filas simuladas! Claro que sí: la iteración solo se 
aplicó a la primera, así que no hay razón para que Thymeleaf eliminara las otras 
dos.

Necesitamos una forma de eliminar esas dos filas durante el procesamiento de la 
plantilla. Usemos el atributo `th:remove` en la segunda y tercera etiqueta 
`<tr>`:

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
    <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
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
    <td>sí</td>
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
    <td>sí</td>
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
    <td>sí</td>
    <td>
      <span>0</span> comentario/s
    </td>
  </tr>
  <tr class="odd">
    <td>Cheddar viejo</td>
    <td>18.75</td>
    <td>sí</td>
    <td>
      <span>1</span> comentario/s
      <a href="/gtvg/product/comments?prodId=4">ver</a>
    </td>
  </tr>
</table>
```
¿Y qué significa el valor `all` en el atributo? `th:remove` puede comportarse de 
cinco maneras diferentes, según su valor:

* `all`: Elimina la etiqueta contenedora y todos sus hijos.
* `body`: No elimina la etiqueta contenedora, pero sí todos sus hijos.
* `tag`: Elimina la etiqueta contenedora, pero no sus hijos.
* `all-but-first`: Elimina todos los hijos de la etiqueta contenedora excepto el 
   primero.
* `none`: No hace nada. Este valor es útil para la evaluación dinámica.

¿Para qué puede ser útil el valor `all-but-first`? Nos permitirá ahorrar 
`th:remove="all"` al crear prototipos.

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
      <td th:text="${prod.inStock}? #{true} : #{false}">sí</td>
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
      <td>sí</td>
      <td>
        <span>3</span> comentario/s
        <a href="comments.html">ver</a>
      </td>
    </tr>
  </tbody>
</table>
```

El atributo `th:remove` puede aceptar cualquier expresión estándar de Thymeleaf, 
siempre que devuelva uno de los valores de cadena permitidos 
(`all`, `tag`, `body`, `all-but-first` o `none`).

Esto significa que las eliminaciones pueden ser condicionales, como:

```html
<a href="/something" th:remove="${condition}? tag : none">El texto del enlace no debe eliminarse</a>
```

Tenga en cuenta también que `th:remove` considera que `null` es un sinónimo de 
`none`, por lo que lo siguiente funciona igual que el ejemplo anterior:

```html
<a href="/something" th:remove="${condition}? tag">El texto del enlace no debe eliminarse</a>
```

En este caso, si `${condition}` es falso, se devolverá `null` y, por lo tanto, 
no se realizará ninguna eliminación.

## 8.5 Herencia de diseño

Para tener un solo archivo como diseño, se pueden usar fragmentos. Un ejemplo de 
un diseño simple con `title` y `content` usa `th:fragment` y `th:replace`:

```html
<!DOCTYPE html>
<html th:fragment="layout (title, content)" xmlns:th="http://www.thymeleaf.org">
<head>
    <title th:replace="${title}">Título del diseño</title>
</head>
<body>
    <h1>Diseño H1</h1>
    <div th:replace="${content}">
        <p>Contenido del diseño</p>
    </div>
    <footer>
        Pie de página de diseño
    </footer>
</body>
</html>
```

Este ejemplo declara un fragmento llamado **layout** con _title_ y _content_ 
como parámetros. Ambos se reemplazarán en la página que lo herede por las 
expresiones de fragmento proporcionadas en el ejemplo siguiente.

```html
<!DOCTYPE html>
<html th:replace="~{layoutFile :: layout(~{::title}, ~{::section})}">
<head>
    <title>Título de la página</title>
</head>
<body>
<section>
    <p>Contenido de la página</p>
    <div>Incluido en la página</div>
</section>
</body>
</html>
```

En este archivo, la etiqueta `html` se reemplazará por _layout_, pero en el 
diseño, `title` y `content` se reemplazarán por los bloques `title` y `section`, 
respectivamente.

Si se desea, el diseño puede estar compuesto por varios fragmentos como _header_ 
y _footer_.

# 9 Variables locales

Thymeleaf llama _variables locales_ a las variables que se definen para un 
fragmento específico de una plantilla, y que solo están disponibles para la 
evaluación dentro de ese fragmento. 

Un ejemplo que ya hemos visto es la variable de iteración `prod` en nuestra 
página de lista de productos:

```html
<tr th:each="prod : ${prods}">
    ...
</tr>
```
Esa variable `prod` estará disponible solo dentro de los límites de la etiqueta
`<tr>`. Específicamente:

 * Estará disponible para cualquier otro atributo `th:*` que se ejecute en esa 
   etiqueta con menor _precedencia_ que `th:each` (lo que significa que se 
   ejecutará después de `th:each`).
 * Estará disponible para cualquier elemento hijo de la etiqueta `<tr>`, tales 
   como cualquier elemento `<td>`.

Thymeleaf te ofrece una forma de declarar variables locales sin iteración, 
usando el atributo `th:with`, y su sintaxis es similar a la de las asignaciones 
de valores de atributos:

```html
<div th:with="firstPer=${persons[0]}">
  <p>
    El nombre de la primera persona es <span th:text="${firstPer.name}">Julius Caesar</span>.
  </p>
</div>
```
Cuando se procesa `th:with`, se crea esa variable `firstPer` como una variable 
local y se agrega al mapa de variables proveniente del contexto, de forma que 
esté disponible para evaluación junto con cualquier otra variable declarada 
en el contexto, pero solo dentro de los límites de la etiqueta `<div>` que la 
contiene.

Puede definir varias variables al mismo tiempo usando la sintaxis habitual de 
asignación múltiple:

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
El atributo `th:with` permite reutilizar las variables definidas en el mismo 
atributo:

```html
<div th:with="company=${user.company + ' Co.'},account=${accounts[company]}">...</div>
```

¡Usemos esto en la página principal de nuestra tienda de comestibles! ¿Recuerdas 
el código que escribimos para mostrar una fecha con formato?

```html
<p>
  Today is: 
  <span th:text="${#calendars.format(today,'dd MMMM yyyy')}">13 febrero 2011</span>
</p>
```
¿Y si quisiéramos que `"dd MMMM yyyy"` dependiera de la configuración regional?
Por ejemplo, podríamos añadir el siguiente mensaje a `home_en.properties`:

```
date.format=MMMM dd'','' yyyy
```

...y uno equivalente a nuestro `home_es.properties`:

```
date.format=dd ''de'' MMMM'','' yyyy
```
Ahora, usemos `th:with` para obtener el formato de dato regionalizado en una 
variable, y después usémoslo en nuestra expresión `th:text`: 

```html
<p th:with="df=#{date.format}">
  Hoy es: <span th:text="${#calendars.format(today,df)}">13 febrero 2011</span>
</p>
```

Fue fácil y sencillo. De hecho, dado que `th:with` tiene mayor `precedencia` 
que `th:text`, podríamos haber solucionado todo en la etiqueta `span`:


```html
<p>
  Hoy es: 
  <span th:with="df=#{date.format}" 
        th:text="${#calendars.format(today,df)}">13 Febrero 2011</span>
</p>
```

Quizás estés pensando: ¿Precedencia? ¡Aún no hemos hablado de eso! Bueno, no te 
preocupes, porque de eso trata precisamente el siguiente capítulo.

# 10 Precedencia de atributos

¿Qué ocurre al escribir más de un atributo `th:*` en la misma etiqueta? Por 
ejemplo:

```html
<ul>
  <li th:each="item : ${items}" th:text="${item.description}">Descripción del elemento aquí...</li>
</ul>
```
Esperaríamos que el atributo `th:each` se ejecutara antes que `th:text` para 
obtener los resultados deseados, pero dado que los estándares HTML/XML no 
definen el orden en que se escriben los atributos en una etiqueta, fue necesario 
establecer un mecanismo de precedencia en los propios atributos para garantizar 
su correcto funcionamiento.

Por lo tanto, todos los atributos de Thymeleaf definen una precedencia numérica 
que establece el orden en que se ejecutan en la etiqueta. Este orden es:

| Orden | Característica                                 | Atributos                                  |
|:-----:|------------------------------------------------|--------------------------------------------|
|   1   | Inclusión de fragmento                         | `th:insert`,`th:replace`                   |
|   2   | Iteración de fragmento                         | `th:each`                                  |
|   3   | Evaluación condicional                         | `th:if`,`th:unless`,`th:switch`,`th:case`  |
|   4   | Definición de variable local                   | `th:object`,`th:with`                      |
|   5   | Modificación de atributos generales            | `th:attr`,`th:attrprepend`,`th:attrappend` |
|   6   | Modificación de atributos especificos          | `th:value`,`th:href`,`th:src`,`...`        |
|   7   | Texto (modificación del cuerpo de la etiqueta) | `th:text`,`th:utext`                       |
|   8   | Especificación de fragmentos                   | `th:fragment`                              |
|   9   | Eliminación de fragmentos                      | `th:remove`                                |

Este mecanismo de precedencia significa que el fragmento de iteración anterior 
dará exactamente los mismos resultados si se invierte la posición del atributo 
(aunque sería un poco menos legible).

```html
<ul>
  <li th:text="${item.description}" th:each="item : ${items}">Descripción del elemento aquí...</li>
</ul>
```

# 11 Comentarios y bloques

## 11.1. Comentarios HTML/XML estándar

Los comentarios HTML/XML estándar `<!-- ... -->` se pueden usar en cualquier 
parte de las plantillas de Thymeleaf. El contenido de estos comentarios no será 
procesado por Thymeleaf y se copiará textualmente en el resultado:

```html
<!-- A continuación se muestra la información del usuario -->
<div th:text="${...}">
  ...
</div>
```

## 11.2. Bloques de comentarios a nivel de analizador de Thymeleaf

Los bloques de comentarios a nivel de analizador son código que simplemente se 
eliminará de la plantilla cuando Thymeleaf la analice. Tienen este aspecto:

```html
<!--/* ¡Este código se eliminará en el momento del análisis de Thymeleaf! */-->
``` 

Thymeleaf eliminará todo lo que esté entre `<!--/*` y `*/-->`, por lo que estos 
bloques de comentarios también se pueden usar para mostrar código cuando una 
plantilla está abierta estáticamente, sabiendo que se eliminará cuando Thymeleaf 
lo procese:

```html
<!--/*--> 
  <div>
      ¡Sólo puedes verme antes de que Thymeleaf me procese!
  </div>
<!--*/-->
```

Esto podría resultar muy útil para crear prototipos de tablas con muchos `<tr>`, 
por ejemplo:

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

## 11.3. Bloques de comentarios exclusivos del prototipo de Thymeleaf

Thymeleaf permite la definición de bloques de comentarios especiales marcados 
como comentarios cuando la plantilla está abierta estáticamente (es decir, como 
prototipo), pero que Thymeleaf considera como marcado normal al ejecutar la 
plantilla.

```html
<span>¡hola!</span>
<!--/*/
  <div th:text="${...}">
    ...
  </div>
/*/-->
<span>¡adios!</span>
```

El sistema de análisis de Thymeleaf simplemente eliminará los marcadores 
`<!--/*/` y `/*/-->`, pero no su contenido, que quedará sin comentar. Por lo 
tanto, al ejecutar la plantilla, Thymeleaf verá esto:

```html
<span>¡hola!</span>
 
  <div th:text="${...}">
    ...
  </div>
 
<span>¡adios!</span>
```

Al igual que con los bloques de comentarios a nivel de analizador, esta 
característica es independiente del dialecto.

## 11.4. Etiqueta sintética `th:block`

El único procesador de elementos (no un atributo) de Thymeleaf incluido en los 
dialectos estándar es `th:block`.

`th:block` es un simple contenedor de atributos que permite a los 
desarrolladores de plantillas especificar los atributos que deseen. Thymeleaf 
ejecutará estos atributos y luego simplemente hará que el bloque, pero no su 
contenido, desaparezca.

Por lo tanto, podría ser útil, por ejemplo, al crear tablas iteradas que 
requieren más de un `<tr>` para cada elemento:

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

Y especialmente útil cuando se usa en combinación con bloques de comentarios 
exclusivos de prototipos:

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
Tenga en cuenta como esta solución permite que las plantillas sean HTML válido 
(sin necesidad de agregar bloques prohibidos `<div>` dentro de `<table>`) y aún 
funciona correctamente cuando se abren estáticamente en navegadores como 
prototipos. 

# 12 Inserción en línea

## 12.1 Inserción de expresiones en línea

Aunque el Dialecto Estándar nos permite hacer casi todo usando atributos de 
etiqueta, hay situaciones en las que preferiríamos escribir expresiones 
directamente en nuestros textos HTML. Por ejemplo, podríamos escribir esto:

```html
<p>¡Hola, [[${session.user.name}]]!</p>
```

...en vez de esto:

```html
<p>¡Hola, <span th:text="${session.user.name}">Sebastian</span>!</p>
```

Las expresiones entre `[[...]]` o `[(...)]` se consideran 
**expresiones en línea** en Thymeleaf, y dentro de ellas podemos usar cualquier 
tipo de expresión que también sería válida en un atributo `th:text` o 
`th:utext`.

Tenga en cuenta que, mientras que `[[...]]` corresponde a `th:text` (es decir, 
el resultado se escapará en HTML), `[(...)]` corresponde a `th:utext` y no se 
escapará en HTML. Por lo tanto, con una variable como 
`msg = '¡Esto es <b>genial!</b>'`, dado este fragmento:

```html
<p>El mensaje es "[(${msg})]"</p>
```

El resultado tendrá esas etiquetas `<b>` sin escapar, así que:

```html
<p>El mensaje es "¡Esto es <b>genial!</b>"</p>
```

Mientras que si se escapa así:

```html
<p>El mensaje es "[[${msg}]]"</p>
```

El resultado se escapará en HTML:

```html
<p>El mensaje es "¡Esto es &lt;b&gt;genial!&lt;/b&gt;"</p>
```
Tenga en cuenta que la **inserción de texto en línea está activa de forma 
predeterminada** en el cuerpo de cada etiqueta de nuestro marcado, no en las 
etiquetas en sí, por lo que no es necesario hacer nada para habilitarla.


### Plantillas en línea vs. plantillas naturales

Si vienes de otros motores de plantillas donde esta forma de generar texto es la 
norma, te preguntarás: ¿Por qué no lo hacemos desde el principio?
¡Es menos código que todos esos atributos `th:text`!

Bueno, ten cuidado, porque aunque la inlineación te parezca bastante 
interesante, recuerda siempre que las expresiones inlineadas se mostrarán 
textualmente en tus archivos HTML al abrirlos estáticamente, por lo que 
probablemente ya no podrás usarlas como prototipos de diseño.

La diferencia entre cómo un navegador mostraría estáticamente nuestro fragmento 
de código sin usar la inlineación...

```
¡Hola, Sebastian!
```

... Y usarla...

```
Hola, [[${session.user.name}]]!
```

...es bastante claro en términos de utilidad del diseño.

### Deshabilitar la inserción en línea

Sin embargo, este mecanismo se puede desactivar, ya que podría haber ocasiones 
en las que queramos generar las secuencias `[[...]]` o `[(...)]` sin que su 
contenido se procese como una expresión. Para ello, usaremos `th:inline="none"`:

```html
<p th:inline="none">¡Una matriz doble se ve así: [[1, 2, 3], [4, 5]]!</p>
```

Esto dará como resultado:

```html
<p>¡Una matriz doble se ve así: [[1, 2, 3], [4, 5]]!</p>
```

## 12.2 Inserción de texto en línea

La *inserción de texto en línea* es muy similar a la función de 
*inserción de expresiones* que acabamos de ver, pero en realidad añade más 
potencia. Debe habilitarse explícitamente con `th:inline="text"`.

La inserción de texto en línea no solo nos permite usar las mismas *expresiones 
insertadas* que acabamos de ver, sino que procesa los *cuerpos de las etiquetas* 
como si fueran plantillas procesadas en el modo de plantilla `TEXT`, lo que nos 
permite ejecutar lógica de plantilla basada en texto (no solo expresiones de 
salida).

Veremos más sobre esto en el próximo capítulo sobre los *modos de plantilla 
textual*.

## 12.3 Inserción de JavaScript en línea

La inserción en línea de JavaScript permite una mejor integración de los bloques
de código `<script>` de JavaScript en las plantillas que se procesan en el modo 
de plantilla `HTML`.

Al igual que con la *inserción en línea de texto*, esto equivale a procesar el 
contenido de los scripts como si fueran plantillas en el modo de plantilla 
`JAVASCRIPT` y, por lo tanto, se aprovechará toda la potencia de los *modos de 
plantilla textuales* (véase el siguiente capítulo). Sin embargo, en esta sección 
nos centraremos en cómo podemos usarlo para añadir la salida de nuestras 
expresiones de Thymeleaf a nuestros bloques de JavaScript.

Este modo debe habilitarse explícitamente mediante `th:inline="javascript"`:

```html
<script th:inline="javascript">
    ...
    var username = [[${session.user.name}]];
    ...
</script>
```

Esto dará como resultado:

```html
<script th:inline="javascript">
    ...
    var username = "Sebastian \"Sabroso\" Jugo de manzana";
    ...
</script>
```
Dos aspectos importantes a tener en cuenta en el código anterior:

*Primero*, la inserción en línea de JavaScript no solo mostrará el texto 
requerido, sino que también lo encerrará entre comillas y escapará su contenido 
con JavaScript, de modo que los resultados de la expresión se muestren como un 
**literal de JavaScript bien formado**.

*Segundo*, esto ocurre porque mostramos la expresión `${session.user.name}` 
como **escapada**, es decir, usando una expresión entre corchetes: 
`[[${session.user.name}]]`.
Si, en cambio, usáramos *sin escape*, como:

```html
<script th:inline="javascript">
    ...
    var username = [(${session.user.name})];
    ...
</script>
```

El resultado se vería así:

```html
<script th:inline="javascript">
    ...
    var username = Sebastian "Fruity" Applejuice;
    ...
</script>
```

... Que es código JavaScript mal formado. Pero generar algo sin escape podría ser 
lo que necesitamos si construimos partes de nuestro script añadiendo expresiones 
en línea, así que es bueno tener esta herramienta a mano.

### Plantillas naturales de JavaScript

La mencionada *inteligencia* del mecanismo de inline de JavaScript va mucho más 
allá de simplemente aplicar escapes específicos de JavaScript y mostrar los 
resultados de las expresiones como literales válidos.

Por ejemplo, podemos encapsular nuestras expresiones inline (escapadas) en 
JavaScript comentarios de JavaScript como:

```html
<script th:inline="javascript">
    ...
    var username = /*[[${session.user.name}]]*/ "Gertrud Kiwifruit";
    ...
</script>
```
Y Thymeleaf ignorará todo lo que hayamos escrito *después del comentario y
antes del punto y coma* (en este caso, ` 'Gertrud Kiwifruit'`), por lo que el 
resultado de ejecutar esto se verá exactamente como cuando no usábamos los 
comentarios envolventes:

```html
<script th:inline="javascript">
    ...
    var username = "Sebastian \"Fruity\" Applejuice";
    ...
</script>
```

Pero eche otra mirada cuidadosa al código de la plantilla original:

```html
<script th:inline="javascript">
    ...
    var username = /*[[${session.user.name}]]*/ "Gertrud Kiwifruit";
    ...
</script>
```
Tenga en cuenta que este código es **JavaScript válido**. Se ejecutará 
perfectamente al abrir el archivo de plantilla de forma estática (sin ejecutarlo 
en un servidor).

¡Así que tenemos una forma de crear **plantillas naturales de JavaScript**!


### Evaluación en línea avanzada y serialización de JavaScript

Un aspecto importante a tener en cuenta con respecto a la inlineación de 
JavaScript es que esta evaluación de expresiones es inteligente y no se limita a 
Strings. Thymeleaf escribirá correctamente en sintaxis JavaScript los siguientes 
tipos de objetos:

* Strings
* Numbers
* Booleanos
* Arrays
* Collections
* Maps
* Beans (objetos con métodos _getter_ y _setter_)

Por ejemplo, si tuviéramos el siguiente código:

```html
<script th:inline="javascript">
    ...
    var user = /*[[${session.user}]]*/ null;
    ...
</script>
```
Esa expresión `${session.user}` se evaluará como un objeto `User` y Thymeleaf la 
convertirá correctamente a la sintaxis de Javascript:

```html
<script th:inline="javascript">
    ...
    var user = {"age":null,"firstName":"John","lastName":"Apricot",
                "name":"John Apricot","nationality":"Antarctica"};
    ...
</script>
```
Esta serialización de JavaScript se realiza mediante la implementación de la 
interfaz `org.thymeleaf.standard.serializer.IStandardJavaScriptSerializer`, que 
se puede configurar en la instancia de `StandardDialect` que se utiliza en el 
motor de plantillas.

La implementación predeterminada de este mecanismo de serialización de JS 
buscará la [biblioteca Jackson](https://github.com/FasterXML/jackson) en la ruta 
de clases y, si está presente, la usará. De lo contrario, aplicará un mecanismo 
de serialización integrado que cubre las necesidades de la mayoría de los 
escenarios y produce resultados similares (pero es menos flexible).

## 12.4 Inserción de CSS

Thymeleaf también permite el uso de incrustación en etiquetas CSS `<style>`, 
como:

```html
<style th:inline="css">
  ...
</style>
```

Por ejemplo, digamos que tenemos dos variables configuradas con dos valores 
`String` diferentes:

```
classname = 'main elems'
align = 'center'
```

Podríamos usarlas así:

```html
<style th:inline="css">
    .[[${classname}]] {
      text-align: [[${align}]];
    }
</style>
```

Y el resultado sería:

```html
<style th:inline="css">
    .main\ elems {
      text-align: center;
    }
</style>
```
Observe cómo la inserción de CSS en línea también aporta cierta *inteligencia*, 
al igual que la de JavaScript. En concreto, las expresiones generadas mediante 
expresiones *escapadas* como `[[${classname}]]` se escaparán como 
**identificadores CSS**. Por eso, `classname = 'main elems'`
se ha convertido en `main\ elems` en el fragmento de código anterior.


### Funciones avanzadas: plantillas naturales CSS, etc.

De forma similar a lo explicado anteriormente para JavaScript, la inserción de 
CSS en línea también permite que nuestras etiquetas `<style>` funcionen tanto 
estática como dinámicamente, es decir, como **plantillas CSS naturales**, al 
encapsular expresiones en línea en comentarios. Véase:

```html
<style th:inline="css">
    .main\ elems {
      text-align: /*[[${align}]]*/ left;
    }
</style>
```
# 13 Modos de plantilla textual

## 13.1 Sintaxis textual

Tres de los *modos de plantilla* de Thymeleaf se consideran **textuales**: 
`TEXT`, `JAVASCRIPT` y `CSS`. Esto los diferencia de los modos de plantilla de 
marcado: `HTML` y `XML`

La diferencia clave entre los modos de plantilla *textuales* y los de marcaje 
es que en una plantilla textual no hya etiquetas en las que insertar lógica en 
forma de atributos, así que tenemos que confiar en otros mecanismos.

El primero y más básico de estos mecanismos es la **inserción en línea**, la 
cual hemos detallado ya en el capítulo anterior. La sintaxis de la inserción en 
línea es la forma más simple de sacar resultados de expresiones en el modo de 
plantilla textual, así que esto es una plantilla perfectamente válida para un 
correo de texto.

```
  Estimado [(${name})],

  Por favor, encontrará adjuntados los resultados del informe que solicitó 
  con nombre "[(${report.name})]".

  Atentatemente,
    El Reportero.
```

Incluso sin etiquetas, el ejemplo de arriba es una plantilla de Thymeleaf 
completa y válida que puede ser ejecutada en el modo de plantilla `TEXT`.

Pero para incluir una lógica más compleja que las simples 
*expresiones de salida*, necesitamos una nueva sintaxis que no se base en 
etiquetas:

```
[# th:each="item : ${items}"]
  - [(${item})]
[/]
```

La cual es en realidad la versión *condensada* de la más detallada:

```
[#th:block th:each="item : ${items}"]
  - [#th:block th:utext="${item}" /]
[/th:block]
```

Observe cómo esta nueva sintaxis se basa en elementos (es decir, etiquetas 
procesables) que se declaran como `[#element ...]` en lugar de 
`<element ...>`. Los elementos son abiertos como `[#element ...]` y cerrados 
como `[/element]`, y las etiquetas independientes se pueden declarar minimizando 
el elemento abierto con `/`, de forma casi equivalente a las etiquetas XML: 
`[#element ... /]`.

El Dialecto Estándar solo contiene un procesador para uno de estos elementos: 
el ya conocido `th:block`, aunque podríamos extender este en nuestros dialectos 
y crear nuevos elementos de la forma habitual. Además, se permite que el 
elemento `th:block` (`[#th:block ...] ... [/th:block]`) sea abreviado como la 
cadena vacía (`[# ...] ... [/]`), de forma que el bloque de arriba es en 
realidad equivalente a:

```
[# th:each="item : ${items}"]
  - [# th:utext="${item}" /]
[/]
```

Y dado que `[# th:utext="${item}" /]` es equivalente a una *expresión de 
inserción en línea no escapada*, podríamos simplemente usarla para tener menos
código. Así, obtenemos el primer fragmento de código que vimos arriba:

```
[# th:each="item : ${items}"]
  - [(${item})]
[/]
```

Tenga en cuenta que la *sintaxis textual requiere un equilibrio total de 
elementos (sin etiquetas sin cerrar) y atributos entre comillas*; es más estilo 
XML que estilo HTML.

Veamos un ejemplo más completo de una plantilla `TEXT`, una plantilla de correo 
electrónico de *texto sin formato*:

```
Estimado [(${customer.name})],

Esta es la lista de nuestros productos:

[# th:each="prod : ${products}"]
   - [(${prod.name})]. Precio: [(${prod.price})] EUR/kg
[/]

Gracias,
  La Tienda de Thymeleaf
```

Después de la ejecución, el resultado de esto podría ser algo como:

```
Estimada  Mary Ann Blueberry,

Esta es la lista de nuestros productos:

   - Apricots. Precio: 1.12 EUR/kg
   - Bananas. Precio: 1.78 EUR/kg
   - Apples. Precio: 0.85 EUR/kg
   - Watermelon. Precio: 1.91 EUR/kg

Gracias,
  La Tienda de Thymeleaf
```

Otro ejemplo en modo de plantilla `JAVASCRIPT`: un archivo `greeter.js` que 
procesamos como plantilla de texto y cuyo resultado invocamos desde nuestras 
páginas HTML. Nota: Este no es un bloque `<script>` en una plantilla HTML, sino 
un archivo `.js` que se procesa como plantilla por sí solo:

```javascript
var greeter = function() {

    var username = [[${session.user.name}]];

    [# th:each="salut : ${salutations}"]    
      alert([[${salut}]] + " " + username);
    [/]

};
```

Después de la ejecución, el resultado de esto podría ser algo como:

```javascript
var greeter = function() {

    var username = "Bertrand \"Crunchy\" Pear";

      alert("Hello" + " " + username);
      alert("Ol\u00E1" + " " + username);
      alert("Hola" + " " + username);

};
```

### Atributos de elementos escapados

Para evitar interacciones con partes de la plantilla que podrían procesarse en 
otros modos (p. ej., inserción en línea en modo `text` dentro de una plantilla 
`HTML`), Thymeleaf 3.0 permite el escape de los atributos de los elementos en su 
*sintaxis textual*. Por lo tanto:

 * Los atributos en plantillas de modo `TEXT` no tendrán *formato HTML escapado*.
 * Los atributos en el modo de plantilla `JAVASCRIPT` no tendrán *formato de 
escape JavaScript*.
 * Los atributos en el modo de plantilla `CSS` no tendrán *escape CSS*.

Entonces esto estaría perfectamente bien en una plantilla en modo `TEXT` (tenga 
en cuenta el `&gt;`):
```
  [# th:if="${120&lt;user.age}"]
     Congratulations!
  [/]
```

Por supuesto, ese `&lt;` no tendría sentido en una plantilla de *texto real*, 
pero es una buena idea si procesamos una plantilla HTML con un bloque 
`th:inline="text"` que contiene el código anterior y queremos asegurarnos de que 
nuestro navegador no tome ese `<user.age` como nombre de una etiqueta de 
apertura al abrir estáticamente el archivo como prototipo.

## 13.2 Extensibilidad

Una de las ventajas de esta sintaxis es que es tan extensible como la de 
*markup*. Los desarrolladores pueden definir sus propios dialectos con elementos 
y atributos personalizados, aplicarles un prefijo (opcionalmente) y luego 
usarlos en modos de plantilla textual:


```
  [#miorg:hazalgo miorg:attrimportante="211"]algun texto[/miorg:hazalgo]
```

## 13.3 Bloques de comentarios de solo prototipos textuales: agregar código

Los modos de plantilla `JAVASCRIPT` y `CSS` (no disponibles para `TEXT`) 
permiten incluir código entre una sintaxis de comentario especial `/*[+...+]*/` 
para que Thymeleaf quite el comentario automáticamente dicho código al procesar 
la plantilla:

```javascript
var x = 23;

/*[+

var msg  = "Esta es una aplicación funcional";

+]*/

var f = function() {
    ...
```

Se ejecutará como:

```javascript
var x = 23;

var msg  = "Esta es una aplicación funcional";

var f = function() {
...
```

Puede incluir expresiones dentro de estos comentarios, y serán evaluados:

```javascript
var x = 23;

/*[+

var msg  = "Hola, " + [[${session.user.name}]];

+]*/

var f = function() {
...
```

## 13.4 Bloques de comentarios de nivel de analizador textual: eliminación de código

De forma similar a los bloques de comentarios de solo prototipo, los tres modos 
de plantilla textual (`TEXT`, `JAVASCRIPT` y `CSS`) permiten indicar a Thymeleaf 
que elimine el código entre las marcas especiales `/*[- */` y `/* -]*/`, de la 
siguiente manera:

```javascript
var x = 23;

/*[- */

var msg  = "¡Esto se muestra sólo cuando se ejecuta estáticamente!";

/* -]*/

var f = function() {
...
```

O esto, en modo `TEXT`:

```
...
/*[- Tenga en cuenta que el usuario se obtiene de la sesión, que debe existir. -]*/
Bienvenido [(${session.user.name})]!
...
```

## 13.5 Plantillas naturales de JavaScript y CSS

Como se vio en el capítulo anterior, la inserción en línea de JavaScript y CSS 
ofrece la posibilidad de incluir expresiones en línea dentro de los comentarios 
de JavaScript/CSS, como:

```javascript
...
var username = /*[[${session.user.name}]]*/ "Sebastian Lychee";
...
```

... La cual es JavaScript válido, y una vez ejecutado podría verse como:

```html
...
var username = "John Apricot";
...
```

Este mismo *truco* de encerrar expresiones en línea dentro de comentarios se 
puede utilizar para toda la sintaxis del modo textual:

```
  /*[# th:if="${user.admin}"]*/
     alert('Bienvenido administrador');
  /*[/]*/
```

Esa alerta en el código anterior se mostrará cuando la plantilla esté abierta 
estáticamente (ya que es JavaScript 100 % válido) y también cuando se ejecute si 
el usuario es administrador. Equivale a:

```
  [# th:if="${user.admin}"]
     alert('Bienvenido administrador');
  [/]
```

...Este es, en realidad, el código al que se convierte la versión inicial 
durante el análisis de plantillas.

Sin embargo, tenga en cuenta que encapsular elementos en comentarios no borra 
las líneas en las que se encuentran (a la derecha hasta que se encuentra un 
`;`) como sí lo hacen las expresiones de salida en línea.

Este comportamiento está reservado únicamente para expresiones de salida en 
línea.

Por lo tanto, Thymeleaf 3.0 permite el desarrollo de 
**scripts JavaScript complejos y hojas de estilo CSS en forma de plantillas 
naturales**, válidas tanto como *prototipo* como *plantilla de trabajo*.

# 14 Algunas páginas más para nuestra tienda de comestibles

Ahora que sabemos mucho sobre el uso de Thymeleaf, podemos añadir nuevas páginas 
a nuestro sitio web para la gestión de pedidos.

Ten en cuenta que nos centraremos en el código HTML, pero puedes consultar el 
código fuente incluido si quieres ver los controladores correspondientes.

## 14.1 Lista de pedidos

Comencemos creando una página de lista de pedidos, 
`/WEB-INF/templates/order/list.html`:

```html
<!DOCTYPE html>

<html xmlns:th="http://www.thymeleaf.org">

  <head>

    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body>

    <h1>Lista de pedidos</h1>
  
    <table>
      <tr>
        <th>FECHA</th>
        <th>CLIENTE</th>
        <th>TOTAL</th>
        <th></th>
      </tr>
      <tr th:each="o : ${orders}" th:class="${oStat.odd}? 'odd'">
        <td th:text="${#calendars.format(o.date,'dd/MMM/yyyy')}">13 ene 2011</td>
        <td th:text="${o.customer.name}">Federico Tomate</td>
        <td th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}">23.32</td>
        <td>
          <a href="details.html" th:href="@{/order/details(orderId=${o.id})}">ver</a>
        </td>
      </tr>
    </table>
  
    <p>
      <a href="../home.html" th:href="@{/}">Volver al inicio</a>
    </p>
    
  </body>
  
</html>
```

No hay nada aquí que deba sorprendernos, excepto este pequeño toque de magia 
OGNL:

```html
<td th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}">23.32</td>
```

Lo que esto hace es, para cada línea de pedido (objeto `OrderLine`) en el 
pedido, multiplicar sus propiedades `purchasePrice` y `amount` (llamando a los 
métodos `getPurchasePrice()` y `getAmount()` correspondientes) y devolver el 
resultado en una lista de números, que luego se agrega mediante la función 
`#aggregates.sum(...)` para obtener el precio total del pedido.

Tienes que amar el poder de OGNL.

## 14.2 Detalles del pedido

Ahora, para la página de detalles del pedido, en la que haremos un uso intensivo 
de la sintaxis de asterisco:

```html
<!DOCTYPE html>

<html xmlns:th="http://www.thymeleaf.org">

  <head>
    <title>Tienda de comestibles virtual Good Thymes</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body th:object="${order}">

    <h1>Detalles del pedido</h1>

    <div>
      <p><b>Código:</b> <span th:text="*{id}">99</span></p>
      <p>
        <b>Fecha:</b>
        <span th:text="*{#calendars.format(date,'dd MMM yyyy')}">13 ene 2011</span>
      </p>
    </div>

    <h2>Cliente</h2>

    <div th:object="*{customer}">
      <p><b>Nombre:</b> <span th:text="*{name}">Federico Tomate</span></p>
      <p>
        <b>Desde:</b>
        <span th:text="*{#calendars.format(customerSince,'dd MMM yyyy')}">1 ene 2011</span>
      </p>
    </div>
  
    <h2>Productos</h2>
  
    <table>
      <tr>
        <th>PRODUCTO</th>
        <th>CANTIDAD</th>
        <th>PRECIO COMPRA</th>
      </tr>
      <tr th:each="ol,row : *{orderLines}" th:class="${row.odd}? 'odd'">
        <td th:text="${ol.product.name}">Fresas</td>
        <td th:text="${ol.amount}" class="number">3</td>
        <td th:text="${ol.purchasePrice}" class="number">23.32</td>
      </tr>
    </table>

    <div>
      <b>TOTAL:</b>
      <span th:text="*{#aggregates.sum(orderLines.{purchasePrice * amount})}">35.23</span>
    </div>
  
    <p>
      <a href="list.html" th:href="@{/order/list}">Volver a la lista de pedidos</a>
    </p>

  </body>
  
</html>
```

En realidad no hay muchas novedades aquí, excepto esta selección de objetos anidados:

```html
<body th:object="${order}">

  ...

  <div th:object="*{customer}">
    <p><b>Nombre:</b> <span th:text="*{name}">Federico Tomate</span></p>
    ...
  </div>

  ...
</body>
```

... lo que hace que `*{name}` sea equivalente a:


```html
<p><b>Nombre:</b> <span th:text="${order.customer.name}">Federico Tomate</span></p>
```

# 15 Más sobre la configuración

## 15.1 Resolvedores de plantillas

Para nuestra tienda de comestibles virtual Good Thymes, elegimos una 
implementación de `ITemplateResolver` llamada `WebApplicationTemplateResolver` 
que nos permitió obtener plantillas como recursos de los recursos de la 
aplicación (el _Contexto de Servlet_ en una aplicación web basada en Servlet).

Además de brindarnos la posibilidad de crear nuestro propio solucionador de 
plantillas implementando `ITemplateResolver`, Thymeleaf incluye cuatro 
implementaciones listas para usar:

 * `org.thymeleaf.templateresolver.ClassLoaderTemplateResolver`, que resuelve 
las plantillas como recursos del cargador de clases, como:

    ```java
    return Thread.currentThread().getContextClassLoader().getResourceAsStream(template);
    ```

 * `org.thymeleaf.templateresolver.FileTemplateResolver`, que resuelve las 
 * plantillas como archivos del sistema de archivos, como:

    ```java
    return new FileInputStream(new File(template));
    ```

 * `org.thymeleaf.templateresolver.UrlTemplateResolver`, que resuelve plantillas 
como URL (incluso las no locales), como:

    ```java
    return (new URL(template)).openStream();
    ```

 * `org.thymeleaf.templateresolver.StringTemplateResolver`, que resuelve las 
plantillas directamente como la `Cadena` especificada como `plantilla` (o 
*nombre de plantilla*, que en este caso es obviamente mucho más que un simple 
nombre):

    ```java
    return new StringReader(templateName);
    ```

Todas las implementaciones preinstaladas de `ITemplateResolver` permiten el 
mismo conjunto de parámetros de configuración, que incluyen:

 * Prefijo y sufijo (como ya vimos):

    ```java
    templateResolver.setPrefix("/WEB-INF/templates/");
    templateResolver.setSuffix(".html");
    ```

 * Alias de plantilla que permiten el uso de nombres de plantilla que no 
corresponden directamente a los nombres de archivo. Si existen tanto el 
sufijo/prefijo como el alias, el alias se aplicará antes del prefijo/sufijo:

    ```java
    templateResolver.addTemplateAlias("adminHome","profiles/admin/home");
    templateResolver.setTemplateAliases(aliasesMap);
    ```

 * Codificación que se aplicará al leer plantillas:

    ```java
    templateResolver.setCharacterEncoding("UTF-8");
    ```

 * Modo de plantilla a utilizar:

    ```java
    // El valor predeterminado es HTML
    templateResolver.setTemplateMode("XML");
    ```

 * Modo predeterminado para el almacenamiento en caché de plantillas y patrones 
para definir si plantillas específicas se pueden almacenar en caché o no:

    ```java
    // El valor predeterminado es verdadero
    templateResolver.setCacheable(false);
    templateResolver.getCacheablePatternSpec().addPattern("/users/*");
    ```

 * Tiempo de vida (TTL) en milisegundos para las entradas de caché de plantilla 
analizadas originadas en este solucionador de plantillas. Si no se configura, 
la única forma de eliminar una entrada de la caché será superar el tamaño máximo 
de la caché (se eliminará la entrada más antigua).

    ```java
    // El valor predeterminado es sin TTL (solo si se excede el tamaño de caché 
    // se eliminarán las entradas)
    templateResolver.setCacheTTLMs(60000L);
    ```
> Los paquetes de integración de Thymeleaf + Spring ofrecen una implementación 
> de `SpringResourceTemplateResolver` que utiliza toda la infraestructura de 
> Spring para acceder y leer recursos en las aplicaciones, y que es la 
> implementación recomendada en las aplicaciones compatibles con Spring.

### Encadenamiento de solucionadores de plantillas

Además, un motor de plantillas puede especificar varios solucionadores de 
plantillas, en cuyo caso se puede establecer un orden entre ellos para la 
resolución de la plantilla, de modo que, si el primero no puede resolver la 
plantilla, se solicite al segundo, y así sucesivamente:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.setOrder(Integer.valueOf(1));

WebApplicationTemplateResolver webApplicationTemplateResolver = 
        new WebApplicationTemplateResolver(application);
webApplicationTemplateResolver.setOrder(Integer.valueOf(2));

templateEngine.addTemplateResolver(classLoaderTemplateResolver);
templateEngine.addTemplateResolver(webApplicationTemplateResolver);
```

Cuando se aplican varios solucionadores de plantilla, se recomienda especificar 
patrones para cada uno, de modo que Thymeleaf pueda descartar rápidamente 
aquellos que no están diseñados para resolver la plantilla, mejorando así el 
rendimiento. Esto no es un requisito, sino una recomendación:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.setOrder(Integer.valueOf(1));
// A este cargador de clases ni siquiera se le solicitarán plantillas que no coincidan con estos patrones
classLoaderTemplateResolver.getResolvablePatternSpec().addPattern("/layout/*.html");
classLoaderTemplateResolver.getResolvablePatternSpec().addPattern("/menu/*.html");

WebApplicationTemplateResolver webApplicationTemplateResolver = 
        new WebApplicationTemplateResolver(application);
webApplicationTemplateResolver.setOrder(Integer.valueOf(2));
```

Si no se especifican estos *patrones resolubles*, dependeremos de las 
capacidades específicas de cada una de las implementaciones de 
`ITemplateResolver` que estemos utilizando. Tenga en cuenta que no todas las 
implementaciones pueden determinar la existencia de una plantilla antes de 
resolverla y, por lo tanto, siempre podrían considerar una plantilla como 
*resoluble* e interrumpir la cadena de resolución (impidiendo que otros 
resolvedores busquen la misma plantilla), pero no podrían leer el recurso real.

Todas las implementaciones de `ITemplateResolver` incluidas en el núcleo de 
Thymeleaf incluyen un mecanismo que permite que los resolvedores comprueben si 
un recurso existe antes de considerarlo resoluble. Se trata del indicador 
`checkExistence`, que funciona así:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.setOrder(Integer.valueOf(1));
classLoaderTempalteResolver.setCheckExistence(true);
```

Esta bandera `checkExistence` obliga al resolvedor a realizar una 
*verificación real* de la existencia del recurso durante la fase de resolución 
(y permite que se llame al siguiente resolvedor de la cadena si la comprobación 
de existencia devuelve falso). Si bien esto puede parecer correcto en todos los 
casos, en la mayoría de los casos implica un doble acceso al recurso (uno para 
comprobar su existencia y otro para leerlo), y podría representar un problema de 
rendimiento en algunos escenarios, por ejemplo, con recursos de plantilla 
remotos basados en URL. Este problema de rendimiento potencial podría mitigarse 
en gran medida mediante el uso de la caché de plantillas (en cuyo caso, las 
plantillas solo se *resuelven* la primera vez que se accede a ellas).

## 15.2 Resolvedores de mensajes

No especificamos explícitamente una implementación de Message Resolver para 
nuestra aplicación Grocery y, como se explicó anteriormente, esto significaba 
que la implementación utilizada era un objeto 
`org.thymeleaf.messageresolver.StandardMessageResolver`.

`StandardMessageResolver` es la implementación estándar de la interfaz
`IMessageResolver`, pero podríamos crear la nuestra propia si quisiéramos, 
adaptada a las necesidades específicas de nuestra aplicación.

> Los paquetes de integración de Thymeleaf + Spring ofrecen de forma 
> predeterminada una implementación de `IMessageResolver` que utiliza el método 
> estándar de Spring para recuperar mensajes externalizados, mediante beans 
> `MessageSource` declarados en el contexto de la aplicación Spring.

### Resolvedor de mensajes estándar

Entonces, ¿cómo busca `StandardMessageResolver` los mensajes solicitados en una 
plantilla específica?

Si el nombre de la plantilla es `home` y se encuentra en 
`/WEB-INF/templates/home.html`, y la configuración regional solicitada es 
`gl_ES`, este solucionador buscará mensajes en los siguientes archivos, en este 
orden:

 * `/WEB-INF/templates/home_gl_ES.properties`
 * `/WEB-INF/templates/home_gl.properties`
 * `/WEB-INF/templates/home.properties`

Consulte la documentación de JavaDoc de la clase `StandardMessageResolver` para 
obtener más detalles sobre cómo funciona el mecanismo completo de resolución de 
mensajes.

### Configuración de solucionadores de mensajes

¿Qué pasaría si quisiéramos añadir uno o más solucionadores de mensajes al motor 
de plantillas?
Fácil:

```java
// Para configurar solo uno
templateEngine.setMessageResolver(messageResolver);

// Para configurar más de uno
templateEngine.addMessageResolver(messageResolver);
```

¿Y por qué querríamos tener más de un solucionador de mensajes? Por la misma 
razón que los solucionadores de plantillas: los solucionadores de mensajes están 
ordenados y, si el primero no puede resolver un mensaje específico, se le 
pregunta al segundo, luego al tercero, etc.

## 15.3 Servicios de conversión

El *servicio de conversión* que nos permite realizar operaciones de conversión y 
formato de datos mediante la sintaxis de *doble llave* (`${{...}}`) es
en realidad una característica del dialecto estándar, no del motor de plantillas 
Thymeleaf en sí.

Por lo tanto, la forma de configurarlo es configurando nuestra implementación 
personalizada de la interfaz `IStandardConversionService` directamente en la 
instancia de `StandardDialect` que se está configurando en el motor de 
plantillas. Por ejemplo:

```java
IStandardConversionService customConversionService = ...

StandardDialect dialect = new StandardDialect();
dialect.setConversionService(customConversionService);

templateEngine.setDialect(dialect);
```

> Tenga en cuenta que los paquetes thymeleaf-spring3 y thymeleaf-spring4 
> contienen `SpringStandardDialect`, y este dialecto ya viene preconfigurado con 
> una implementación de `IStandardConversionService` que integra la 
> infraestructura *Conversion Service* de Spring en Thymeleaf.

## 15.4 Registro de trazas

Thymeleaf presta mucha atención al registro y siempre intenta ofrecer la máxima 
información útil a través de su interfaz.

La biblioteca de registro utilizada es `slf4j`, que actúa como puente hacia 
cualquier implementación de registro que queramos usar en nuestra aplicación 
(por ejemplo, `log4j`).

Las clases de Thymeleaf registrarán información de nivel `TRACE`, `DEBUG` e 
`INFO`, según el nivel de detalle deseado. Además del registro general, 
utilizará tres registradores especiales asociados a la clase TemplateEngine, que 
podemos configurar por separado para diferentes propósitos:

 * `org.thymeleaf.TemplateEngine.CONFIG` generará una configuración detallada de 
la biblioteca durante la inicialización.
 * `org.thymeleaf.TemplateEngine.TIMER` generará información sobre el tiempo 
necesario para procesar cada plantilla (¡útil para la evaluación comparativa!).
 * `org.thymeleaf.TemplateEngine.cache` es el prefijo de un conjunto de 
registradores que generan información específica sobre las cachés. Aunque los 
nombres de los registradores de caché son configurables por el usuario y, por lo 
tanto, pueden cambiar, por defecto son:
    * `org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.EXPRESSION_CACHE`

Una configuración de ejemplo para la infraestructura de registro de Thymeleaf, 
utilizando `log4j`, podría ser:

```
log4j.logger.org.thymeleaf=DEBUG
log4j.logger.org.thymeleaf.TemplateEngine.CONFIG=TRACE
log4j.logger.org.thymeleaf.TemplateEngine.TIMER=TRACE
log4j.logger.org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE=TRACE
```

# 16 Caché de plantillas

Thymeleaf funciona gracias a un conjunto de analizadores (para marcado y texto) 
que analizan las plantillas en secuencias de eventos (etiqueta de apertura, 
texto, etiqueta de cierre, comentario, etc.) y a una serie de procesadores (uno 
para cada tipo de comportamiento que se debe aplicar) que modifican la secuencia 
de eventos analizada de la plantilla para crear los resultados esperados al 
combinar la plantilla original con nuestros datos.

También incluye, por defecto, una caché que almacena las plantillas analizadas; 
la secuencia de eventos resultante de la lectura y el análisis de los archivos 
de plantilla antes de procesarlos. Esto es especialmente útil al trabajar en una 
aplicación web y se basa en los siguientes conceptos:

* La entrada/salida es casi siempre la parte más lenta de cualquier aplicación. 
  En comparación, el procesamiento en memoria es extremadamente rápido.
* Clonar una secuencia de eventos en memoria existente siempre es mucho más 
  rápido que leer un archivo de plantilla, analizarlo y crear una nueva 
  secuencia de eventos para él.
* Las aplicaciones web suelen tener solo unas pocas docenas de plantillas.
* Los archivos de plantilla son de tamaño pequeño a mediano y no se modifican 
  mientras la aplicación está en ejecución.

Todo esto nos lleva a la idea de que almacenar en caché las plantillas más 
utilizadas en una aplicación web es posible sin desperdiciar grandes cantidades 
de memoria, y además, ahorrará mucho tiempo que se dedicaría a operaciones de 
entrada/salida en un pequeño conjunto de archivos que, de hecho, nunca cambian.

¿Y cómo podemos controlar esta caché? Primero, ya hemos aprendido que podemos 
habilitarla o deshabilitarla en el solucionador de plantillas, incluso actuando 
solo en plantillas específicas: 

```java
// Default is true
templateResolver.setCacheable(false);
templateResolver.getCacheablePatternSpec().addPattern("/users/*");
```
También podríamos modificar su configuración estableciendo nuestro propio 
objeto _Cache Manager_, que podría ser una instancia de la implementación 
predeterminada `StandardCacheManager`:

```java
// El valor predeterminado es 200
StandardCacheManager cacheManager = new StandardCacheManager();
cacheManager.setTemplateCacheMaxSize(100);
...
templateEngine.setCacheManager(cacheManager);
```

Consulte la API javadoc de `org.thymeleaf.cache.StandardCacheManager` para 
obtener más información sobre la configuración de los cachés.

Las entradas se pueden eliminar manualmente del caché de plantillas:

```java
// Borrar el caché por completo
templateEngine.clearTemplateCache();

// Borrar una plantilla específica de la caché
templateEngine.clearTemplateCacheFor("/users/userList");
```

# 17 Lógica de plantilla desacoplada

## 17.1 Lógica desacoplada: El concepto

Hasta ahora, hemos trabajado para nuestra tienda de comestibles con plantillas 
diseñadas de la *forma habitual*, insertando la lógica en forma de atributos.

Pero Thymeleaf también nos permite *desvincular* completamente el marcado de la 
plantilla de su lógica, lo que permite la creación de plantillas de marcado sin 
lógica en los modos de plantilla `HTML` y `XML`.

La idea principal es que la lógica de la plantilla se defina en un *archivo de 
lógica* separado independiente (más exactamente, un *recurso lógico*, ya que no 
necesita ser un *archivo* de plantilla). Por defecto, ese recurso lógico será un 
archivo adicional ubicado en la misma ubicación (por ejemplo, una carpeta) que 
el archivo de plantilla, con el mismo nombre pero con la extensión `.th.xml`.:

```
/templates
+->/home.html
+->/home.th.xml
```

Por lo tanto, el archivo `home.html` puede carecer por completo de lógica. 
Podría verse así:

```html
<!DOCTYPE html>
<html>
  <body>
    <table id="usersTable">
      <tr>
        <td class="username">Jeremías Pomelo</td>
        <td class="usertype">Usuario normal</td>
      </tr>
      <tr>
        <td class="username">Alicia Sandía</td>
        <td class="usertype">Administrador</td>
      </tr>
    </table>
  </body>
</html>
```

No hay absolutamente ningún código de Thymeleaf. Este es un archivo de plantilla 
que un diseñador sin conocimientos de Thymeleaf ni de plantillas podría haber 
creado, editado o entendido. O un fragmento de HTML proporcionado por un sistema 
externo sin ningún tipo de enlace de Thymeleaf.

Ahora, convirtamos esa plantilla `home.html` en una plantilla de Thymeleaf 
desacoplada, creando nuestro archivo `home.th.xml` adicional de esta manera:

```xml
<?xml version="1.0"?>
<thlogic>
  <attr sel="#usersTable" th:remove="all-but-first">
    <attr sel="/tr[0]" th:each="user : ${users}">
      <attr sel="td.username" th:text="${user.name}" />
      <attr sel="td.usertype" th:text="#{|user.type.${user.type}|}" />
    </attr>
  </attr>
</thlogic>
```

Aquí podemos ver varias etiquetas `<attr>` dentro de un bloque `thlogic`. Estas 
etiquetas `<attr>` realizan una *inyección de atributos* en los nodos de la 
plantilla original seleccionados mediante sus atributos `sel`, que contienen 
*selectores de marcado* de Thymeleaf (en realidad, *selectores de marcado de 
AttoParser*). 

Tenga en cuenta también que las etiquetas `<attr>` se pueden anidar para que sus 
selectores se *añadan*. El `sel="/tr[0]"` anterior, por ejemplo, se procesará 
como `sel="#usersTable/tr[0]"`. Y el selector para el nombre de usuario `<td>` 
se procesará como `sel="#usersTable/tr[0]//td.username"`.

Entonces, una vez fusionados, ambos archivos vistos arriba serán los mismos que:

```html
<!DOCTYPE html>
<html>
  <body>
    <table id="usersTable" th:remove="all-but-first">
      <tr th:each="user : ${users}">
        <td class="username" th:text="${user.name}">Jeremías Pomelo</td>
        <td class="usertype" th:text="#{|user.type.${user.type}|}">Usuario normal</td>
      </tr>
      <tr>
        <td class="username">Alicia Sandía</td>
        <td class="usertype">Administrador</td>
      </tr>
    </table>
  </body>
</html>
```

Esto resulta más familiar y, de hecho, es menos *detallado* que crear dos 
conjuntos de archivos separados. Pero la ventaja de las *plantillas 
desacopladas* es que podemos dar a nuestras plantillas total independencia de 
Thymeleaf y, por lo tanto, una mejor mantenibilidad desde el punto de vista del 
diseño.

Por supuesto, todavía serán necesarios algunos *contratos* entre diseñadores o 
desarrolladores, por ejemplo, el hecho de que los usuarios `<table>` necesitarán 
un `id="usersTable"`, pero en muchos escenarios, una plantilla HTML pura será un 
artefacto de comunicación mucho mejor entre los equipos de diseño y desarrollo.

## 17.2 Configuración de plantillas desacopladas

### Habilitación de plantillas desacopladas

No se espera que todas las plantillas usen lógica desacoplada de forma 
predeterminada. En su lugar, los resolvedores de plantillas configurados 
(implementaciones de `ITemplateResolver`) deberán marcar específicamente las 
plantillas que resuelven como *que usan lógica desacoplada*.

Excepto `StringTemplateResolver` (que no permite lógica desacoplada), todas las 
demás implementaciones predefinidas de `ITemplateResolver` proporcionarán un 
indicador llamado `useDecoupledLogic` que marcará todas las plantillas resueltas 
por ese resolvedor como si potencialmente tuvieran toda o parte de su lógica en 
un recurso separado.

```java
final WebApplicationTemplateResolver templateResolver = 
        new WebApplicationTemplateResolver(application);
...
templateResolver.setUseDecoupledLogic(true);
```

### Mezcla de lógica acoplada y desacoplada

La lógica de plantilla desacoplada, cuando está habilitada, no es un requisito. 
Al estar habilitada, el motor *buscará* un recurso que contenga lógica 
desacoplada, lo analizará y lo fusionará con la plantilla original si existe. No 
se generará ningún error si el recurso de lógica desacoplada no existe.

Además, en la misma plantilla podemos combinar lógica *acoplada* y 
*desacoplada*, por ejemplo, añadiendo algunos atributos de Thymeleaf al archivo 
de plantilla original, pero dejando otros para el archivo de lógica desacoplada. 
El caso más común para esto es usar el nuevo atributo `th:ref` (en la versión 
3.0).

## 17.3 El atributo th:ref

`th:ref` es solo un atributo de marcador. No tiene ninguna función desde el 
punto de vista del procesamiento y simplemente desaparece cuando se procesa la 
plantilla, pero su utilidad reside en que actúa como una *referencia de 
marcado*, es decir, se puede resolver por nombre desde un *selector de marcado*, 
al igual que un *nombre de etiqueta* o un *fragmento* (`th:fragment`).

Entonces, si tenemos un selector como:

```xml
  <attr sel="whatever" .../>
```

Coincidirá con:

* Cualquier etiqueta `<whatever>`.
* Cualquier etiqueta con el atributo `th:fragment="whatever"`.
* Cualquier etiqueta con el atributo `th:ref="whatever"`.

¿Cuál es la ventaja de `th:ref` frente, por ejemplo, al uso de un atributo `id` 
puro en HTML? Simplemente, el hecho de que quizás no queramos añadir tantos 
atributos `id` y `class` a nuestras etiquetas para que actúen como *anclajes 
lógicos*, lo que podría acabar *contaminando* nuestra salida.

Y, en el mismo sentido, ¿cuál es la desventaja de `th:ref`? Bueno, obviamente, 
que estaríamos añadiendo un poco de lógica de Thymeleaf (*"lógica"*) a nuestras 
plantillas.

Tenga en cuenta que esta aplicabilidad del atributo `th:ref` **no solo se aplica 
a los archivos de plantilla de lógica desacoplada**: funciona igual en otros 
tipos de escenarios, como en las expresiones de fragmentos (`~{...}`).

## 17.4 Impacto en el rendimiento de las plantillas desacopladas

El impacto es extremadamente pequeño. Cuando una plantilla resuelta se marca 
para usar lógica desacoplada y no se almacena en caché, el recurso de lógica de 
plantilla se resolverá primero, se analizará y se procesará en una secuencia de 
instrucciones en memoria: básicamente, una lista de atributos que se inyectarán 
en cada selector de marcado.

Pero este es el único *paso adicional* necesario, ya que, después, se analizará 
la plantilla real y, mientras se analiza, el propio analizador inyectará estos 
atributos *sobre la marcha*, gracias a las capacidades avanzadas de selección de 
nodos de AttoParser. Por lo tanto, los nodos analizados saldrán del analizador 
como si tuvieran sus atributos inyectados escritos en el archivo de plantilla 
original.

La mayor ventaja de esto es que cuando una plantilla se configura para 
almacenarse en caché, se almacenará en caché con los atributos inyectados. Por 
lo tanto, la sobrecarga de usar *plantillas desacopladas* para plantillas 
almacenables en caché, una vez almacenadas, será absolutamente *cero*.

## 17.5 Resolución de lógica desacoplada

El usuario puede configurar la forma en que Thymeleaf resuelve los recursos 
lógicos desacoplados correspondientes a cada plantilla. Esto se determina 
mediante un punto de extensión, 
`org.thymeleaf.templateparser.markup.decoupled.IDecoupledTemplateLogicResolver`, 
para el cual se proporciona una *implementación predeterminada*: 
`StandardDecoupledTemplateLogicResolver`.

¿Qué hace esta implementación estándar?

* Primero, aplica un `prefijo` y un `sufijo` al *nombre base* del recurso de 
  plantilla (obtenido mediante su método `ITemplateResource#getBaseName()`). 
  Tanto el prefijo como el sufijo se pueden configurar y, por defecto, el 
  prefijo estará vacío y el sufijo será `.th.xml`.
* Segundo, solicita al recurso de plantilla que resuelva un *recurso relativo* 
  con el nombre calculado mediante su método 
  `ITemplateResource#relative(String relativeLocation)`.

La implementación específica de `IDecoupledTemplateLogicResolver` que se 
utilizará se puede configurar fácilmente en `TemplateEngine`:

```java
final StandardDecoupledTemplateLogicResolver decoupledresolver = 
        new StandardDecoupledTemplateLogicResolver();
decoupledResolver.setPrefix("../viewlogic/");
...
templateEngine.setDecoupledTemplateLogicResolver(decoupledResolver);
```

# 18 Apéndice A: Objetos básicos de expresión

Algunos objetos y mapas de variables siempre están disponibles. Veámoslos:

### Objetos base

 * **\#ctx**: El objeto contexto. Una implementación de `org.thymeleaf.context.
 IContext` o `org.thymeleaf.context.IWebContext` dependiendo de nuestro entorno. 
(independiente o web).
   
   Dese cuenta de que `#vars` y `#root` son sinónimos para el mismo objeto, pero
   se recomienda usar `#ctx`
   
```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.context.IContext
 * ======================================================================
 */

${#ctx.locale}
${#ctx.variableNames}

/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.context.IWebContext
 * ======================================================================
 */

${#ctx.request}
${#ctx.response}
${#ctx.session}
${#ctx.servletContext}
```

 * **\#locale**: acceso directo a `java.util.Locale` asociado con la petición 
actual.

```java
${#locale}
```

### Espacios de nombres de contexto web para atributos de solicitud/sesión, etc.

Cuando se usa Thymeleaf en un entorno web, podemos usar una serie de atajos para 
acceder a los parámetros de la petición, los atributos de sesión y los atributos 
de aplicación:

> Tenga en cuenta que estos no son *objetos de contexto*, sino mapas añadidos al 
> contexto como variables por lo que accedemos a ellos sin `#`. De alguna 
> manera, actúan como *espacios de nombres*.

* **param**: para recuperar los parámetros de la petición. `${param.foo}` es 
  una `String[]` con los valores del parámetro de petición `foo`, así que
  `${param.foo[0]}` normalmente utilizado para obtener su primer valor.

```java
/*
 * ============================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.context.WebRequestParamsVariablesMap
 * ============================================================================
 */

${param.foo}              // Recuperara una String[] con los valores de la petición 
parameter 'foo'
${param.size()}
${param.isEmpty()}
${param.containsKey('foo')}
...
```

 * **session** : for retrieving session attributes.

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.context.WebSessionVariablesMap
 * ======================================================================
 */

${session.foo}                 // Recuperar el atributo de sesión 'foo'
${session.size()}
${session.isEmpty()}
${session.containsKey('foo')}
...
```

 * **application**: para recuperar los atributos del contexto de la aplicación/servlet.

```java
/*
 * =============================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.context.WebServletContextVariablesMap
 * =============================================================================
 */

${application.foo}              // Recuperar el atributo del ServletContext 'foo'
${application.size()}
${application.isEmpty()}
${application.containsKey('foo')}
...
```
Tenga en cuenta que **no se necesita especificar un espacio de nombres para 
acceder a los atributos de la petición** (al contrario que los *parámetros de la 
petición*) porque todos los atributos de la petición son agregados 
automáticamente agregados al contexto como variables en el contexto raíz:

```java
${myRequestAttribute}
```

# 19 Apéndice B: Objetos de utilidad de expresión

### Información de ejecución

 * **\#execInfo**: objeto de expresión que ofrece información útil sobre la 
   plantilla que está siendo procesada dentro de las Expresiones Estándar de 
   Thymeleaf.

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.ExecutionInfo
 * ======================================================================
 */

/*
 * Devuelve el nombre y modo de la plantilla 'leaf'. Esto significa la plantilla
 * desde donde se analizaron los eventos que se procesan. Así que si este pedazo 
 * del código no está en la plantilla raíz "A" sino en un fragmento que se está 
 * insertando en "A" desde otra plantilla llamada "B", esto devolverá "B" como
 * nombre y modo B como modo plantilla.
 */
${#execInfo.templateName}
${#execInfo.templateMode}

/*
 * Devuelve el nombre y modo de la plantilla 'raíz'. Esto significa la plantilla
 * que originalmente se le pidió al motor de plantillas que procesara. Entonces 
 * si esto el fragmento de código no está en la plantilla raíz "A" sino en un 
 * fragmento que se está  insertado en "A" desde otra plantilla llamada "B", 
 * esto aún devolver "A" y el modo de plantilla de A.
 */
${#execInfo.processedTemplateName}
${#execInfo.processedTemplateMode}

/*
 * Devuelve las pilas (en realidad, List<String> o List<TemplateMode>) de
 * plantillas en proceso. El primer elemento será el
 * 'processedTemplate' (la raíz), la última será la 'hoja'
 * plantilla, y en el medio todos los fragmentos insertados en anidados
 * Aparecerá la forma de llegar a la hoja desde la raíz.
 */
${#execInfo.templateNames}
${#execInfo.templateModes}

/*
 * Devuelve la pila de plantillas que se procesan de manera similar (y en el
 * mismo orden) a 'templateNames' y 'templateModes', pero regresando
 * una Lista<TemplateData> con los metadatos completos de la plantilla.
 */
${#execInfo.templateStack}
```

### Mensajes

 * **\#messages**: métodos de utilidad para obtener mensajes externalizados 
   dentro de las expresiones de variable, de la misma forma que se obtendrían 
   usando la sintaxis `#{...}`.

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Messages
 * ======================================================================
 */

/*
 * Obtener mensajes externalizados. Puede recibir una sola clave, una clave más argumentos,
 * o una matriz/lista/conjunto de claves (en cuyo caso devolverá una matriz/lista/conjunto 
 * de mensajes externalizados).
 * Si no se encuentra un mensaje, se devuelve un mensaje predeterminado (como '??msgKey??').
 */
${#messages.msg('msgKey')}
${#messages.msg('msgKey', param1)}
${#messages.msg('msgKey', param1, param2)}
${#messages.msg('msgKey', param1, param2, param3)}
${#messages.msgWithParams('msgKey', new Object[] {param1, param2, param3, param4})}
${#messages.arrayMsg(messageKeyArray)}
${#messages.listMsg(messageKeyList)}
${#messages.setMsg(messageKeySet)}

/*
 * Obtener mensajes externalizados o nulos. Se devuelve nulo en lugar de un valor 
 * predeterminado mensaje si no se encuentra un mensaje para la clave especificada.
 */
${#messages.msgOrNull('msgKey')}
${#messages.msgOrNull('msgKey', param1)}
${#messages.msgOrNull('msgKey', param1, param2)}
${#messages.msgOrNull('msgKey', param1, param2, param3)}
${#messages.msgOrNullWithParams('msgKey', new Object[] {param1, param2, param3, param4})}
${#messages.arrayMsgOrNull(messageKeyArray)}
${#messages.listMsgOrNull(messageKeyList)}
${#messages.setMsgOrNull(messageKeySet)}
```

### URIs/URLs

 * **\#uris**: objeto de utilidad par realizar operaciones sobre URI/URL 
   (especialmente el escapado/no escapado) dentro de las Expresiones Estándar de 
   Thymeleaf.

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Uris
 * ======================================================================
 */

/*
 * Escape/Unescape como ruta URI/URL
 */
${#uris.escapePath(uri)}
${#uris.escapePath(uri, encoding)}
${#uris.unescapePath(uri)}
${#uris.unescapePath(uri, encoding)}

/*
 * Escape/Unescape como segmento de ruta URI/URL (entre símbolos '/')
 */
${#uris.escapePathSegment(uri)}
${#uris.escapePathSegment(uri, encoding)}
${#uris.unescapePathSegment(uri)}
${#uris.unescapePathSegment(uri, encoding)}

/*
 * Escape/Unescape como identificador de fragmento (#frag)
 */
${#uris.escapeFragmentId(uri)}
${#uris.escapeFragmentId(uri, encoding)}
${#uris.unescapeFragmentId(uri)}
${#uris.unescapeFragmentId(uri, encoding)}

/*
 * Escape/Unescape como parámetro de consulta (?var=valor)
 */
${#uris.escapeQueryParam(uri)}
${#uris.escapeQueryParam(uri, encoding)}
${#uris.unescapeQueryParam(uri)}
${#uris.unescapeQueryParam(uri, encoding)}
```

### Conversiones

 * **\#conversions**: objeto de utilidad que permite la ejecución del 
   *Servicio de Conversión* en cualquier punto de una plantilla:

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Conversions
 * ======================================================================
 */

/*
 * Ejecute la conversión deseada del valor del 'objeto' al
 * clase especificada.
 */
${#conversions.convert(object, 'java.util.TimeZone')}
${#conversions.convert(object, targetClass)}
```

### Fechas

 * **\#dates**: métodos de utilidad para objetos `java.util.Date`:

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Dates
 * ======================================================================
 */

/*
 * Formatea la fecha con el formato local estándar
 * También funciona con matrices, listas o conjuntos.
 */
${#dates.format(date)}
${#dates.arrayFormat(datesArray)}
${#dates.listFormat(datesList)}
${#dates.setFormat(datesSet)}

/*
 * Formatea fecha con el formato ISO8601
 * También funciona con matrices, listas o conjuntos.
 */
${#dates.formatISO(date)}
${#dates.arrayFormatISO(datesArray)}
${#dates.listFormatISO(datesList)}
${#dates.setFormatISO(datesSet)}

/*
 * Da formato a la fecha con el patrón especificado
 * También funciona con matrices, listas o conjuntos.
 */
${#dates.format(date, 'dd/MMM/yyyy HH:mm')}
${#dates.arrayFormat(datesArray, 'dd/MMM/yyyy HH:mm')}
${#dates.listFormat(datesList, 'dd/MMM/yyyy HH:mm')}
${#dates.setFormat(datesSet, 'dd/MMM/yyyy HH:mm')}

+/*
 * Obtiene propiedades de fecha
 * También funciona con matrices, listas o conjuntos.
 */
${#dates.day(date)}                    // también arrayDay(...), listDay(...), etc.
${#dates.month(date)}                  // también arrayMonth(...), listMonth(...), etc.
${#dates.monthName(date)}              // también arrayMonthName(...), listMonthName(...), etc.
${#dates.monthNameShort(date)}         // también arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#dates.year(date)}                   // también arrayYear(...), listYear(...), etc.
${#dates.dayOfWeek(date)}              // también arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#dates.dayOfWeekName(date)}          // también arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#dates.dayOfWeekNameShort(date)}     // también arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#dates.hour(date)}                   // también arrayHour(...), listHour(...), etc.
${#dates.minute(date)}                 // también arrayMinute(...), listMinute(...), etc.
${#dates.second(date)}                 // también arraySecond(...), listSecond(...), etc.
${#dates.millisecond(date)}            // también arrayMillisecond(...), listMillisecond(...), etc.

/*
 * Crea objetos de fecha (java.util.Date) a partir de sus componentes
 */
${#dates.create(year,month,day)}
${#dates.create(year,month,day,hour,minute)}
${#dates.create(year,month,day,hour,minute,second)}
${#dates.create(year,month,day,hour,minute,second,millisecond)}

/*
 * Crea un objeto de fecha (java.util.Date) para la fecha y hora actuales
 */
${#dates.createNow()}

${#dates.createNowForTimeZone()}

/*
 * Crea un objeto de fecha (java.util.Date) para la fecha actual (hora establecida en 00:00)
 */
${#dates.createToday()}

${#dates.createTodayForTimeZone()}
```

### Calendarios

 * **\#calendars** : análogo a `#dates`, pero para objetos `java.util.Calendar`:

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Calendars
 * ======================================================================
 */

/*
 * Formatea el calendario con el formato local estándar
 * También funciona con matrices, listas o conjuntos.
 */
${#calendars.format(cal)}
${#calendars.arrayFormat(calArray)}
${#calendars.listFormat(calList)}
${#calendars.setFormat(calSet)}

/*
 * Formatea calendario con el formato ISO8601
 * También funciona con matrices, listas o conjuntos.
 */
${#calendars.formatISO(cal)}
${#calendars.arrayFormatISO(calArray)}
${#calendars.listFormatISO(calList)}
${#calendars.setFormatISO(calSet)}

/*
 * Da formato al calendario con el patrón especificado
 * También funciona con matrices, listas o conjuntos.
 */
${#calendars.format(cal, 'dd/MMM/yyyy HH:mm')}
${#calendars.arrayFormat(calArray, 'dd/MMM/yyyy HH:mm')}
${#calendars.listFormat(calList, 'dd/MMM/yyyy HH:mm')}
${#calendars.setFormat(calSet, 'dd/MMM/yyyy HH:mm')}

/*
 * Obtiene propiedades de calendario
 * También funciona con matrices, listas o conjuntos.
 */
${#calendars.day(date)}                // también arrayDay(...), listDay(...), etc.
${#calendars.month(date)}              // también arrayMonth(...), listMonth(...), etc.
${#calendars.monthName(date)}          // también arrayMonthName(...), listMonthName(...), etc.
${#calendars.monthNameShort(date)}     // también arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#calendars.year(date)}               // también arrayYear(...), listYear(...), etc.
${#calendars.dayOfWeek(date)}          // también arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#calendars.dayOfWeekName(date)}      // también arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#calendars.dayOfWeekNameShort(date)} // también arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#calendars.hour(date)}               // también arrayHour(...), listHour(...), etc.
${#calendars.minute(date)}             // también arrayMinute(...), listMinute(...), etc.
${#calendars.second(date)}             // también arraySecond(...), listSecond(...), etc.
${#calendars.millisecond(date)}        // también arrayMillisecond(...), listMillisecond(...), etc.

/*
 * Crea objetos de calendario (java.util.Calendar) a partir de sus componentes
 */
${#calendars.create(year,month,day)}
${#calendars.create(year,month,day,hour,minute)}
${#calendars.create(year,month,day,hour,minute,second)}
${#calendars.create(year,month,day,hour,minute,second,millisecond)}

${#calendars.createForTimeZone(year,month,day,timeZone)}
${#calendars.createForTimeZone(year,month,day,hour,minute,timeZone)}
${#calendars.createForTimeZone(year,month,day,hour,minute,second,timeZone)}
${#calendars.createForTimeZone(year,month,day,hour,minute,second,millisecond,timeZone)}

/*
 * Crea un objeto de calendario (java.util.Calendar) para la fecha y hora actuales
 */
${#calendars.createNow()}

${#calendars.createNowForTimeZone()}

/*
 * Crea un objeto de calendario (java.util.Calendar) para la fecha actual (hora establecida en 
 00:00)
 */
${#calendars.createToday()}

${#calendars.createTodayForTimeZone()}
```
### Temporales (java.time)

 * **\#temporals** : trata con objetos fecha/hora de la IPA de JDK8+ `java.
 time`:

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Temporals
 * ======================================================================
 */

/*
 *
 * Formatea la fecha con el formato local estándar
 * También funciona con matrices, listas o conjuntos.
 */
${#temporals.format(temporal)}
${#temporals.arrayFormat(temporalsArray)}
${#temporals.listFormat(temporalsList)}
${#temporals.setFormat(temporalsSet)}

/*
 * Formatea la fecha con el formato estándar para la configuración regional proporcionada
 * También funciona con matrices, listas o conjuntos.
 */
${#temporals.format(temporal, locale)}
${#temporals.arrayFormat(temporalsArray, locale)}
${#temporals.listFormat(temporalsList, locale)}
${#temporals.setFormat(temporalsSet, locale)}

/*
 * Formatea la fecha con el patrón especificado.
 * También se pueden especificar SHORT, MEDIUM, LARGE y COMPLETE para utilizar los 
 * patrones java time.format.FormatStyle predeterminados.
 * También funciona con matrices, listas o conjuntos.
 */
${#temporals.format(temporal, 'dd/MMM/yyyy HH:mm')}
${#temporals.format(temporal, 'dd/MMM/yyyy HH:mm', 'Europe/Paris')}
${#temporals.arrayFormat(temporalsArray, 'dd/MMM/yyyy HH:mm')}
${#temporals.listFormat(temporalsList, 'dd/MMM/yyyy HH:mm')}
${#temporals.setFormat(temporalsSet, 'dd/MMM/yyyy HH:mm')}

/*
 * Formatea la fecha con el patrón y la configuración regional especificados
 * También funciona con matrices, listas o conjuntos.
 */
${#temporals.format(temporal, 'dd/MMM/yyyy HH:mm', locale)}
${#temporals.arrayFormat(temporalsArray, 'dd/MMM/yyyy HH:mm', locale)}
${#temporals.listFormat(temporalsList, 'dd/MMM/yyyy HH:mm', locale)}
${#temporals.setFormat(temporalsSet, 'dd/MMM/yyyy HH:mm', locale)}

/*
 * Formatea la fecha con formato ISO-8601
 * También funciona con matrices, listas o conjuntos.
 */
${#temporals.formatISO(temporal)}
${#temporals.arrayFormatISO(temporalsArray)}
${#temporals.listFormatISO(temporalsList)}
${#temporals.setFormatISO(temporalsSet)}

/*
 * Obtiene las propiedades de la fecha
 * También funciona con matrices, listas o conjuntos.
 */
${#temporals.day(temporal)}                    // también arrayDay(...), listDay(...), etc.
${#temporals.month(temporal)}                  // también arrayMonth(...), listMonth(...), etc.
${#temporals.monthName(temporal)}              // también arrayMonthName(...), listMonthName(...), etc.
${#temporals.monthNameShort(temporal)}         // también arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#temporals.year(temporal)}                   // también arrayYear(...), listYear(...), etc.
${#temporals.dayOfWeek(temporal)}              // también arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#temporals.dayOfWeekName(temporal)}          // también arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#temporals.dayOfWeekNameShort(temporal)}     // también arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#temporals.hour(temporal)}                   // también arrayHour(...), listHour(...), etc.
${#temporals.minute(temporal)}                 // también arrayMinute(...), listMinute(...), etc.
${#temporals.second(temporal)}                 // también arraySecond(...), listSecond(...), etc.
${#temporals.nanosecond(temporal)}             // también arrayNanosecond(...), listNanosecond(...), etc.

/*
 * Crea objetos temporales (java.time.Temporal) a partir de sus componentes
 */
${#temporals.create(year,month,day)}                                // devuelve una instancia de java.time.LocalDate
${#temporals.create(year,month,day,hour,minute)}                    // devuelve una instancia de java.time.LocalDateTime
${#temporals.create(year,month,day,hour,minute,second)}             // devuelve una instancia de java.time.LocalDateTime
${#temporals.create(year,month,day,hour,minute,second,nanosecond)}  // devuelve una instancia de java.time.LocalDateTime

/*
 * Crea un objeto temporal (java.time.Temporal) para la fecha y hora actuales
 */
${#temporals.createNow()}                      // devuelve una instancia de java.time.LocalDateTime
${#temporals.createNowForTimeZone(zoneId)}     // devuelve una instancia de java.time.ZonedDateTime
${#temporals.createToday()}                    // devuelve una instancia de java.time.LocalDate
${#temporals.createTodayForTimeZone(zoneId)}   // devuelve una instancia de java.time.LocalDate

/*
 * Crea un objeto temporal (java.time.Temporal) para la fecha proporcionada
 */
${#temporals.createDate(isoDate)}              // devuelve una instancia de java.time.LocalDate
${#temporals.createDateTime(isoDate)}          // devuelve una instancia de java.time.LocalDateTime
${#temporals.createDate(isoDate, pattern)}     // devuelve una instancia de java.time.LocalDate
${#temporals.createDateTime(isoDate, pattern)} // devuelve una instancia de java.time.LocalDateTime
```

### Numeros

 * **\#numbers** : métodos de utilidad para objetos number:

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Numbers
 * ======================================================================
 */

/*
 * ==========================
 * Formatea números enteros
 * ==========================
 */

/* 
 * Establece los dígitos enteros mínimos.
 * También funciona con matrices, listas o conjuntos.
 */
${#numbers.formatInteger(num,3)}
${#numbers.arrayFormatInteger(numArray,3)}
${#numbers.listFormatInteger(numList,3)}
${#numbers.setFormatInteger(numSet,3)}


/*
 * Establece lod dígitos enteros mínimos y el separador de miles:
 * 'POINT', 'COMMA', 'BLANK', 'NONE' or 'DEFAULT' (por configuración regional).
 * También funciona con matrices, listas o conjuntos.
 */
${#numbers.formatInteger(num,3,'POINT')}
${#numbers.arrayFormatInteger(numArray,3,'POINT')}
${#numbers.listFormatInteger(numList,3,'POINT')}
${#numbers.setFormatInteger(numSet,3,'POINT')}


/*
 * ==========================
 * Formatea números decimales
 * ==========================
 */

/*
 * Establece dígitos enteros mínimos y dígitos decimales (exactos).
 * También funciona con matrices, listas o conjuntos.
 */
${#numbers.formatDecimal(num,3,2)}
${#numbers.arrayFormatDecimal(numArray,3,2)}
${#numbers.listFormatDecimal(numList,3,2)}
${#numbers.setFormatDecimal(numSet,3,2)}

/*
 * Establece dígitos enteros mínimos y dígitos decimales (exactos), y también el 
 * separador decimal.
 * También funciona con matrices, listas o conjuntos.
 */
${#numbers.formatDecimal(num,3,2,'COMMA')}
${#numbers.arrayFormatDecimal(numArray,3,2,'COMMA')}
${#numbers.listFormatDecimal(numList,3,2,'COMMA')}
${#numbers.setFormatDecimal(numSet,3,2,'COMMA')}

/*
 * Establece los  mínimos dígitos enteros y dígitos decimales (exactos), y también 
 * miles y el separador decimal.
 * También funciona con matrices, listas o conjuntos.
 */
${#numbers.formatDecimal(num,3,'POINT',2,'COMMA')}
${#numbers.arrayFormatDecimal(numArray,3,'POINT',2,'COMMA')}
${#numbers.listFormatDecimal(numList,3,'POINT',2,'COMMA')}
${#numbers.setFormatDecimal(numSet,3,'POINT',2,'COMMA')}


/* 
 * =====================
 * Formatea monedas
 * =====================
 */

${#numbers.formatCurrency(num)}
${#numbers.arrayFormatCurrency(numArray)}
${#numbers.listFormatCurrency(numList)}
${#numbers.setFormatCurrency(numSet)}


/* 
 * ======================
 * Porcentajes de formato
 * ======================
 */

${#numbers.formatPercent(num)}
${#numbers.arrayFormatPercent(numArray)}
${#numbers.listFormatPercent(numList)}
${#numbers.setFormatPercent(numSet)}

/* 
 * Establece dígitos enteros mínimos y dígitos decimales (exactos).
 */
${#numbers.formatPercent(num, 3, 2)}
${#numbers.arrayFormatPercent(numArray, 3, 2)}
${#numbers.listFormatPercent(numList, 3, 2)}
${#numbers.setFormatPercent(numSet, 3, 2)}


/*
 * ===================
 * Métodos de utilidad
 * ===================
 */

/*
 * Crea una secuencia (matriz) de números enteros yendo
 * de x a y
 */
${#numbers.sequence(from,to)}
${#numbers.sequence(from,to,step)}
```

### Cadenas (String, en inglés)

 * **\#strings** : métodos de utilidad para objetos `String`:

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Strings
 * ======================================================================
 */

/*
 * toString() seguro para nulos
 */
${#strings.toString(obj)}                      // también array*, list* y  set*

/*
 * Comprueba si una cadena está vacía (o nula). Realiza una operación trim() 
 * antes de verificar
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.isEmpty(name)}
${#strings.arrayIsEmpty(nameArr)}
${#strings.listIsEmpty(nameList)}
${#strings.setIsEmpty(nameSet)}

/*
 * Realiza una verificación 'isEmpty()' en una cadena y devuélvala si es falsa, 
 * de forma predeterminada otra cadena especificada si es verdadera.
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.defaultString(text,default)}
${#strings.arrayDefaultString(textArr,default)}
${#strings.listDefaultString(textList,default)}
${#strings.setDefaultString(textSet,default)}

/*
 * Comprueba si un fragmento está contenido en una cadena
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.contains(name,'ez')}                   // también array*, list* y set*
${#strings.containsIgnoreCase(name,'ez')}         // también array*, list* y set*

/*
 * Comprueba si una cadena comienza o termina con un fragmento
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.startsWith(name,'Don')}                  // también array*, list* y set*
${#strings.endsWith(name,endingFragment)}           // también array*, list* y set*

/*
 * Operaciones relacionadas con subcadenas
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.indexOf(name,frag)}                      // también array*, list* y set*
${#strings.substring(name,3,5)}                     // también array*, list* y set*
${#strings.substringAfter(name,prefix)}             // también array*, list* y set*
${#strings.substringBefore(name,suffix)}            // también array*, list* y set*
${#strings.replace(name,'las','ler')}               // también array*, list* y set*

/*
 * Agregar y anteponer
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.prepend(str,prefix)}                     // también array*, list* y set*
${#strings.append(str,suffix)}                      // también array*, list* y set*

/*
 * Cambia el caso (mayúsculas y minúsculas)
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.toUpperCase(name)}                       // también array*, list* y set*
${#strings.toLowerCase(name)}                       // también array*, list* y set*

/*
 * Split y  join
 */
${#strings.arrayJoin(namesArray,',')}
${#strings.listJoin(namesList,',')}
${#strings.setJoin(namesSet,',')}
${#strings.arraySplit(namesStr,',')}                // devuelve String[]
${#strings.listSplit(namesStr,',')}                 // devuelve List<String>
${#strings.setSplit(namesStr,',')}                  // devuelve Set<String>

/*
 * Trim
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.trim(str)}                               // también array*, list* y set*

/*
 * Calcular longitud
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.length(str)}                             // también array*, list* y set*

/*
 * Abrevia el texto haciendo que tenga un tamaño máximo de n. Si el texto es más 
 * grande, será recortado y terminado en "..."
 * También funciona con matrices, listas o conjuntos.
 */
${#strings.abbreviate(str,10)}                      // también array*, list* y set*

/*
 * Convertir el primer carácter a mayúsculas (y viceversa)
 */
${#strings.capitalize(str)}                         // también array*, list* y set*
${#strings.unCapitalize(str)}                       // también array*, list* y set*

/*
 * Convierte el primer carácter de cada palabra a mayúsculas
 */
${#strings.capitalizeWords(str)}                    // también array*, list* y set*
${#strings.capitalizeWords(str,delimiters)}         // también array*, list* y set*

/*
 * Realiza el escapado de cadenas
 */
${#strings.escapeXml(str)}                          // también array*, list* y set*
${#strings.escapeJava(str)}                         // también array*, list* y set*
${#strings.escapeJavaScript(str)}                   // también array*, list* y set*
${#strings.unescapeJava(str)}                       // también array*, list* y set*
${#strings.unescapeJavaScript(str)}                 // también array*, list* y set*

/*
 * Comparación y concatenación segura contra nulos
 */
${#strings.equals(first, second)}
${#strings.equalsIgnoreCase(first, second)}
${#strings.concat(values...)}
${#strings.concatReplaceNulls(nullValue, values...)}

/*
 * Aleatorización
 */
${#strings.randomAlphanumeric(count)}
```

### Objetos

 * **\#objects**: métodos de utilidad para objetos en general

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Objects
 * ======================================================================
 */

/*
 * Devuelve el objeto si no es nulo, de forma predeterminada en caso contrario
 * También funciona con matrices, listas o conjuntos.
 */
${#objects.nullSafe(obj,default)}
${#objects.arrayNullSafe(objArray,default)}
${#objects.listNullSafe(objList,default)}
${#objects.setNullSafe(objSet,default)}
```

### Booleanos


* **\#bools**: métodos de utilidad para evaluación booleana

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Bools
 * ======================================================================
 */

/*
 * Evalua una condición de la misma manera que se evaluaría en una etiqueta th:if
 * (ver capítulo de evaluación condicional más adelante).
 * También funciona con matrices, listas o conjuntos.
 */
${#bools.isTrue(obj)}
${#bools.arrayIsTrue(objArray)}
${#bools.listIsTrue(objList)}
${#bools.setIsTrue(objSet)}

/*
 * Evalua con negación
 * También funciona con matrices, listas o conjuntos.
 */
${#bools.isFalse(cond)}
${#bools.arrayIsFalse(condArray)}
${#bools.listIsFalse(condList)}
${#bools.setIsFalse(condSet)}

/*
 * Evalua y aplica el operador AND
 * Recibe una matriz, una lista o un conjunto como parámetro
 */
${#bools.arrayAnd(condArray)}
${#bools.listAnd(condList)}
${#bools.setAnd(condSet)}

/*
 * Evalua y aplica el operador OR
 * Recibe una matriz, una lista o un conjunto como parámetro
 */
${#bools.arrayOr(condArray)}
${#bools.listOr(condList)}
${#bools.setOr(condSet)}
```

### Matrices

 * **\#arrays** : métodos de utilidad para matrices

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Arrays
 * ======================================================================
 */

/*
 * Se convierte en una matriz, intentando inferir la clase del componente de la matriz.
 * Tenga en cuenta que si la matriz resultante está vacía o si los elementos
 * del objeto de destino no son todos de la misma clase,
 * este método devolverá Objeto[].
 */
${#arrays.toArray(object)}

/*
 * Convierte a matrices de la clase de componente especificada.
 */
${#arrays.toStringArray(object)}
${#arrays.toIntegerArray(object)}
${#arrays.toLongArray(object)}
${#arrays.toDoubleArray(object)}
${#arrays.toFloatArray(object)}
${#arrays.toBooleanArray(object)}

/*
 * Calcula la longitud
 */
${#arrays.length(array)}

/*
 * Comprueba si la matriz está vacía
 */
${#arrays.isEmpty(array)}

/*
 * Comprueba si el elemento o elementos están contenidos en la matriz
 */
${#arrays.contains(array, element)}
${#arrays.containsAll(array, elements)}
```

### Listas

 * **\#lists** : métodos de utilidad para listas

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Lists
 * ======================================================================
 */

/*
 * Se convierte en lista
 */
${#lists.toList(object)}

/*
 * Cálculo del tamaño
 */
${#lists.size(list)}

/*
 * Comprueba si la lista está vacía
 */
${#lists.isEmpty(list)}

/*
 * Comprueba si el elemento o elementos están contenidos en la lista
 */
${#lists.contains(list, element)}
${#lists.containsAll(list, elements)}

/*
 * Ordena una copia de la lista dada. Los miembros de la lista deben implementar
 * comparable o debes definir un comparador.
 */
${#lists.sort(list)}
${#lists.sort(list, comparator)}
```

### Conjuntos (Sets)

 * **\#sets** : métodos de utilidad para conjuntos (sets)

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Sets
 * ======================================================================
 */

/*
 * Se convierte en conjunto
 */
${#sets.toSet(object)}

/*
 * Cálculo del tamaño
 */
${#sets.size(set)}

/*
 * Comprueba si el conjunto está vacío
 */
${#sets.isEmpty(set)}

/*
 * Comprueba si el elemento o elementos están contenidos en el conjunto
 */
${#sets.contains(set, element)}
${#sets.containsAll(set, elements)}
```

### Mapas

 * **\#maps** : métodos de utilidad para mapas

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Maps
 * ======================================================================
 */

/*
 * Cálculo del tamaño
 */
${#maps.size(map)}

/*
 * Comprueba si el mapa está vacío
 */
${#maps.isEmpty(map)}

/*
 * Comprueba si las claves o los valores están contenidos en los mapas
 */
${#maps.containsKey(map, key)}
${#maps.containsAllKeys(map, keys)}
${#maps.containsValue(map, value)}
${#maps.containsAllValues(map, value)}
```

### Agregados

 * **\#aggregates**: métodos de utilidad para crear agregados de matrices o 
   colecciones

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Aggregates
 * ======================================================================
 */

/*
 * Calcula la suma. Devuelve nulo si la matriz o colección está vacía
 */
${#aggregates.sum(array)}
${#aggregates.sum(collection)}

/*
 * Calcula el promedio. Devuelve nulo si la matriz o colección está vacía
 */
${#aggregates.avg(array)}
${#aggregates.avg(collection)}
```

### IDs

 * **\#ids**: métodos de utilidad para tratar con los atributos `id` que 
   podrían estar repetidos (por ejemplo, como resultado de una iteración).

```java
/*
 * ======================================================================
 * Ver la IPA de javadoc para la clase org.thymeleaf.expression.Ids
 * ======================================================================
 */

/*
 * Normalmente se usa en los atributos th:id, para agregar un contador al valor del 
 * atributo id  para que siga siendo único incluso cuando esté involucrado en un 
 * proceso de iteración.
 */
${#ids.seq('someId')}

/*
 * Normalmente se usa en th:for atributos en etiquetas <label>, para que estas 
 * etiquetas puedan hacer referencia a Ids.
 * Generado mediante la función #ids.seq(...).
 *
 * Dependiendo de si la <label> va antes o después del elemento con el #ids.seq(...)
 * función, la función "siguiente" (la etiqueta va antes de "seq") o la función "anterior" 
 * (la etiqueta va después. Se debe llamar a la función "seq").
 */
${#ids.next('someId')}
${#ids.prev('someId')}
```

# 20 Apéndice C: Sintaxis del selector de marcado

Los selectores de marcado de Thymeleaf se toman prestados directamente de la 
biblioteca de análisis de Thymeleaf: [AttoParser](http://attoparser.org).

La sintaxis de estos selectores tiene grandes similitudes con la de los 
selectores en XPath, CSS y jQuery, lo que los hace fáciles de usar para la 
mayoría de usuarios. Puedes echar un vistazo a la referencia de sintaxis 
completa en la
[documentación AttoParser](http://www.attoparser.org/apidocs/attoparser/2.0.4.
RELEASE/org/attoparser/select/package-summary.html).

Por ejemplo, el siguiente selector seleccionará cada `<div>` con la clase 
`content`, en cada posición dentro del marcado (tenga en cuenta que esto no es 
tan conciso como podría ser, siga leyendo para saber por qué):

```html
<div th:insert="~{mytemplate :: //div[@class='content']}">...</div>
```

La sintaxis básica incluye:

 * `/x` significa hijos directos del nodo actual con nombre x.

 * `//x` significa hijos del nodo actual con nombre x, en cualquier profundidad.

 * `x[@z="v"]` significa elementos con nombre x y un atributo llamado z con valor
   "v".

 * `x[@z1="v1" y  @z2="v2"]` significa elementos con nombre x y atributos z1 y
   z2 con valores "v1" y "v2", respectivamente.

 * `x[i]` significa elemento con nombre x posicionado en el número i entre sus 
   hermanos.

 * `x[@z="v"][i]` significa elementos con nombre x, atributo z con valor "v" y
   posicionado en el número i entre sus hermanos que también cumplen esta 
   condición.

Pero también se puede utilizar una sintaxis más concisa:

 * `x` es exactamente equivalente a `//x` (buscar un elemento con nombre o 
   referencia `x` en cualquier nivel de profundidad, siendo una *referencia* un 
   atributo `th:ref` o `th:fragment`).

 * También se permiten selectores sin nombre/referencia del elemento, siempre 
   que incluyan una especificación de argumentos. Entonces `[@class='oneclass']` 
   es un selector válido que busca cualquier elemento (etiqueta) con un atributo 
   de clase con valor `"oneclass"`.

Funciones avanzadas de selección de atributos:

 * Además de `=` (igual), también son válidos otros operadores de comparación: 
   `!=` (no igual), `^=` (empieza por) y `$=` (termina en). Por ejemplo: 
   `x[@class^='sección']` significa elementos con nombre `x` y un valor para el 
   atributo `clase` que comienza con `sección`.

 * Se pueden especificar atributos tanto comenzando con `@` (estilo XPath) como 
   sin (estilo jQuery). Entonces `x[z='v']` es equivalente a `x[@z='v']`.
 
 * Los modificadores de múltiples atributos se pueden unir tanto con `and` 
   (estilo XPath) como también encadenando múltiples modificadores (estilo 
   jQuery). Entonces `x [@z1='v1' y @z2='v2']` es en realidad equivalente a 
   `x[@z1='v1'][@z2='v2']` (y también a `x[z1='v1'][z2='v2']`).

Selectores directos tipo jQuery:

 * `x.oneclass` es equivalente a `x[class='oneclass']`.

 * `.oneclass` es equivalente a `[class='oneclass']`.

 * `x#oneid` es equivalente a `x[id='oneid']`.

 * `#oneid` es equivalente a `[id='oneid']`.

 * `x%oneref` significa etiquetas `<x>` que tienen un atributo `th:ref="oneref"` 
   o `th:fragment="oneref"`.

 * `%oneref` significa cualquier etiqueta que tenga un atributo 
   `th:ref="oneref"` o `th:fragment="oneref"`. Tenga en cuenta que esto en 
   realidad es equivalente a simplemente `oneref` porque se pueden usar 
   referencias en lugar de nombres de elementos.

 * Se pueden mezclar selectores directos y selectores de atributos: 
   `a.external[@href^='https']`.

Entonces la expresión anterior del Selector de marcado:

```html
<div th:insert="~{mytemplate :: //div[@class='content']}">...</div>
```

Podría ser escrito como:

```html
<div th:insert="~{mytemplate :: div.content}">...</div>
```

Examinando un ejemplo diferente, esto:

```html
<div th:replace="~{mytemplate :: myfrag}">...</div>
```

Buscará una firma de fragmento `th:fragment="myfrag"` (o `th:ref` referencias). 
Pero también buscaría etiquetas con el nombre `myfrag` si existieran (lo cual no 
es así en HTML). Note la diferencia con:

```html
<div th:replace="~{mytemplate :: .myfrag}">...</div>
```

... Que realmente buscará cualquier elemento con `class="myfrag"`, sin
preocuparse por las firmas `th:fragment` (o referencias `th:ref`). 

### Coincidencia de clases multivalor

Los selectores de marcado entienden que el atributo de clase es **multivalor**, 
por lo que permiten la aplicación de selectores en este atributo incluso si el 
elemento tiene varios valores de clase.

Por ejemplo, `div.two` coincidirá con `<div class="one two three" />`
