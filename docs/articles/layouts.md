---
title: Diseños de página de Thymeleaf
author: 'Rafa&#322; Borowiec &mdash; <a href="https://blog.codeleak.pl">https://blog.codeleak.pl</a>'
---

Introducción
------------

Normalmente, los sitios web comparten componentes de página comunes, como el encabezado, el pie de página, el menú y 
posiblemente muchos más. Estos componentes de página pueden usarse con el mismo diseño o con diseños diferentes. Existen 
dos estilos principales para organizar los diseños en los proyectos: el estilo *include* y el estilo *jerárquico*. 
Ambos estilos se pueden utilizar fácilmente con Thymeleaf sin perder su principal valor: **las plantillas naturales**.

### Diseños de estilo de inclusión

En este estilo, las páginas se crean integrando código de componente común directamente en cada vista para generar el 
resultado final. En Thymeleaf, esto se puede lograr mediante el **Sistema de Diseño Estándar de Thymeleaf**:

```xml
<body>
    <div th:insert="footer :: copy">...</div>
</body>
```
Los diseños de estilo include son bastante fáciles de entender e implementar y, 
de hecho, ofrecen flexibilidad para desarrollar vistas, lo cual constituye su 
mayor ventaja. Sin embargo, la principal desventaja de esta solución es que 
introduce cierta duplicación de código, por lo que modificar el diseño de un 
gran número de vistas en aplicaciones grandes puede resultar algo engorroso.

### Diseños de estilo jerárquico

En un estilo jerárquico, las plantillas suelen crearse con una relación 
padre-hijo, desde la parte más general (diseño) hasta las más específicas 
(subvistas; por ejemplo, el contenido de la página). Cada componente de la 
plantilla puede incluirse dinámicamente mediante la inclusión y sustitución de 
fragmentos de plantilla. En Thymeleaf, esto se puede hacer mediante el 
**Dialecto de Diseño de Thymeleaf**.

Las principales ventajas de esta solución son la reutilización de porciones 
atómicas de la vista y el diseño modular, mientras que la principal desventaja 
es que se necesita mucha más configuración para poder utilizarlas, por lo que la 
complejidad de las vistas es mayor que con los diseños de estilo Include que son 
más "naturales" de utilizar.


Ejemplo de aplicación
---------------------

Todos los ejemplos y fragmentos de código presentados en este artículo están 
disponibles en GitHub en
[https://github.com/thymeleaf/thymeleafexamples-layouts](https://github.com/thymeleaf/thymeleafexamples-layouts)


Sistema de diseño estándar de Thymeleaf
--------------------------------

El sistema de diseño estándar de Thymeleaf ofrece la inclusión de fragmentos de página similares a las *inclusiones JSP*,
con algunas mejoras importantes.

### Inclusión básica con `th:insert` y `th:replace`

Thymeleaf puede incluir partes de otras páginas como fragmentos (mientras que 
JSP solo incluye páginas completas) mediante `th:insert` (simplemente insertará 
el fragmento especificado como el cuerpo de su etiqueta de host) o `th:replace` 
(sustituirá la etiqueta de host por la del fragmento). Esto permite agrupar 
fragmentos en una o varias páginas. Vea el ejemplo.

La plantilla `home/homeNotSignedIn.html` se procesa cuando el usuario anónimo
ingresa a la página de inicio de aplicación..

Clase `thymeleafexamples.layouts.home.HomeController`

```java
@Controller
class HomeController {

    @GetMapping("/")
    String index(Principal principal) {
        return principal != null ? "home/homeSignedIn" : "home/homeNotSignedIn";
    }

}
```

Plantilla `home/homeNotSignedIn.html`

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    ...
    <div th:replace="fragments/header :: header">
        <!-- =================================================================================================== -->
        <!-- Este contenido solo se utiliza para la creación de prototipos estáticos (plantillas naturales)      -->
        <!-- y, por lo tanto, es totalmente opcional, ya que este fragmento de marcado se incluirá               -->
        <!-- de "fragments/header.html" en tiempo de ejecución.                                                  -->
        <!-- =================================================================================================== -->
      <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">Encabezado estático</a>
          </div>
          <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
              <li class="active"><a href="#">Inicio</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="hero-unit">
        <h1>Prueba</h1>
        <p>
            ¡Bienvenido a la aplicación de inicio rápido de Spring MVC!
            Regístrate para empezar rápidamente.
        </p>
        <p>
          <a href="/signup" th:href="@{/signup}" class="btn btn-large btn-success">Inscribirse</a>
        </p>
      </div>
      <div th:replace="fragments/footer :: footer">© 2016 Las plantillas estáticas</div>
    </div>
    ...
  </body>
</html>
```

Puedes abrir el archivo directamente en un navegador:

![Página de inicio cuando no se ha iniciado sesión](images/layouts/homeNotSignedIn.png)

En el ejemplo anterior, estamos creando una página que consta de un encabezado y 
un pie de página. En Thymeleaf, todos los fragmentos pueden definirse en un solo 
archivo (p. ej., `fragments.html`) o en archivos separados, como en este caso 
particular.

Analicemos brevemente la declaración de inclusión:

```xml
<div th:replace="fragments/header :: header">...</div>
```
La primera parte de la declaración, `fragments/header`, es el nombre de la 
plantilla al que hacemos referencia. Puede ser un archivo (como en este ejemplo) 
o puede hacer referencia al mismo archivo usando la palabra clave `this` 
(p. ej., `this::header`) o sin ninguna palabra clave (p. ej., `::header`). La 
expresión después de dos puntos es un selector de fragmentos (ya sea un nombre 
de fragmento o un  *Selector de Marcado*). Como puede ver, el fragmento de 
encabezado contiene un marcado que se utiliza únicamente para la creación de 
prototipos estáticos.

El encabezado y el pie de página se definen en los siguientes archivos:

Plantilla `fragments/header.html`

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="navbar navbar-inverse navbar-fixed-top" th:fragment="header">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Mi Proyecto</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li th:classappend="${module == 'home' ? 'active' : ''}">
              <a href="#" th:href="@{/}">Home</a>
            </li>
            <li th:classappend="${module == 'tasks' ? 'active' : ''}">
              <a href="#" th:href="@{/task}">Tasks</a>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li th:if="${#authorization.expression('!isAuthenticated()')}">
              <a href="/signin" th:href="@{/signin}">
                <span class="glyphicon glyphicon-log-in" aria-hidden="true"></span>&nbsp;Iniciar sesión
              </a>
            </li>
            <li th:if="${#authorization.expression('isAuthenticated()')}">
              <a href="/logout" th:href="@{#}" onclick="$('#form').submit();">
                <span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>&nbsp;Cerrar sesión
              </a>
             <form style="visibility: hidden" id="form" method="post" action="#" th:action="@{/logout}"></form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </body>
</html>
```

...que podemos abrir directamente en un navegador:

![Header page](images/layouts/header.png)

Y la plantilla `fragments/footer.html`

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div th:fragment="footer">
      &copy; 2016 Pie de página
    </div>
  </body>
</html>
```

Observe cómo los fragmentos referenciados se especifican con atributos 
`th:fragment`. De esta forma, podemos definir varios fragmentos en un solo 
archivo de plantilla, como se mencionó anteriormente.

Lo importante aquí es que todas las plantillas pueden seguir siendo plantillas 
naturales y visualizarse en un navegador sin necesidad de un servidor en 
ejecución.

### Incluido con selectores de marcado

En Thymeleaf, no es necesario especificar explícitamente los fragmentos  
usando `th:fragment` en la página de la que se extraen. Thymeleaf puede 
seleccionar una sección arbitraria de una página como fragmento (incluso una 
página alojada en un servidor externo) mediante su sintaxis de Selectores de 
Marcado, similar a las expresiones XPath, CSS o selectores de jQuery. 


```xml
<div th:insert="https://www.thymeleaf.org :: section.description" >...</div>
```

El código anterior incluirá una `section` con `class="description"` de
`thymeleaf.org`.

Para que esto ocurra, el motor de plantillas debe configurarse con `UrlTemplateResolver`:

```java
@Bean
public SpringTemplateEngine templateEngine() {
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();    
    templateEngine.addTemplateResolver(new UrlTemplateResolver());
    ...
    return templateEngine;
}
```

Para obtener la referencia de sintaxis del Selector de marcado, consulte esta 
sección en la documentación de Thymeleaf: [Sintaxis del Selector de Marcado](http://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#appendix-c-markup-selector-syntax).

### Usando expresiones
En `templatename :: selector`. tanto `templatename` como `selector` pueden ser 
expresiones completamente funcionales. En el ejemplo siguiente, queremos incluir 
diferentes fragmentos dependiendo de una condición. Si el usuario autenticado 
es un Administrador, mostraremos un pie de página diferente al de  un usuario 
normal:

```xml
<div th:replace="fragments/footer :: ${#authentication.principal.isAdmin()} ? 'footer-admin' : 'footer'">
  &copy; 2016 Las Plantillas Estáticas
</div>
```

`fragments/footer.html` ha cambiado ligeramente, ya que necesitamos tener dos 
pies de página definidos:

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <!-- /*  Se pueden definir múltiples fragmentos en un archivo */-->
    <div th:fragment="footer">
      &copy; 2016 Pié de página
    </div>
    <div th:fragment="footer-admin">
      &copy; 2016 Pié de página del Administrador
    </div>
  </body>
</html>
```

### Inclusión parametrizada

Los fragmentos pueden especificar argumentos, al igual que los métodos. Al 
especificarse explícitamente con un atributo `th:fragment`, pueden proporcionar 
una firma de argumento que puede completarse con los argumentos de los atributos 
`th:insert` o `th:replace` que los invocan.

Los ejemplos son muy ilustrativos. Podemos usar la inclusión parametrizada en 
muchos contextos, pero un ejemplo práctico es mostrar mensajes en diferentes 
páginas de nuestra aplicación tras enviar correctamente el formulario. Veamos el 
proceso de registro en la aplicación:

```java
@PostMapping("signup")
String signup(@Valid @ModelAttribute SignupForm signupForm,
        Errors errors, RedirectAttributes ra) {
    
    if (errors.hasErrors()) {
        return SIGNUP_VIEW_NAME;
    }
    Account account = accountRepository.save(signupForm.createAccount());
    userService.signin(account);
    // vea /WEB-INF/i18n/messages.properties y /WEB-INF/views/homeSignedIn.html
    MessageHelper.addSuccessAttribute(ra, "signup.success");
    
    return "redirect:/";
    
}
```
Como puede ver, tras registrarse correctamente, el usuario será redirigido a la 
página de inicio con el atributo flash completado. Queremos crear un fragmento 
reutilizable y parametrizado. Esto se puede hacer de la siguiente manera:

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="alert alert-dismissable" th:fragment="alert (type, message)" th:assert="${!#strings.isEmpty(type) and !#strings.isEmpty(message)}" th:classappend="'alert-' + ${type}">      
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
      <span th:text="${message}">Prueba</span>
    </div>
  </body>
</html>
```

El fragmento de alerta anterior acepta dos argumentos: `type` y `message`. Donde 
`type` es el tipo de mensaje utilizado para dar estilo al mensaje, mientras que 
`message` es el texto que se mostrará al usuario. Nos aseguramos de que los 
argumentos existan y no estén vacíos mediante el atributo `th:assert`.

Para incluir `alert` en cualquier plantilla, podemos escribir el siguiente 
código (tenga en cuenta que el valor de una variable puede ser una expresión):

```xml
<div th:replace="fragments/alert :: alert (type='danger', message=${errorMessage})">...</div>
```

Los fragmentos parametrizados permiten a los desarrolladores crear fragmentos funcionales que son más fáciles de 
reutilizar. Lea más sobre los fragmentos parametrizados en la documentación de Thymeleaf: 
[Firmas de fragmentos parametrizables](http://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#parameterizable-fragment-signatures).

### Expresiones de fragmentos

Thymeleaf 3.0 introdujo un nuevo tipo de expresión como parte del sistema 
general de expresiones estándar de Thymeleaf: **Expresiones de fragmento**: 

```xml
    <div th:insert="~{fragments/footer :: footer}">...</div>
```

La idea de esta sintaxis es poder utilizar fragmentos resueltos como cualquier 
otro tipo de objetos en el contexto de ejecución de la plantilla para su uso 
posterior:

```xml
<div th:replace="${#authentication.principal.isAdmin()} ? ~{fragments/footer :: footer-admin} : ~{fragments/footer :: footer-admin}">
  &copy; 2016 Las Plantillas Estáticas
</div>
```
La expresión de fragmento permite crear fragmentos de manera tal que puedan 
enriquecerse con el marcado proveniente de las plantillas que los llaman, lo que 
da como resultado un mecanismo de diseño mucho más flexible que 
`th:insert` y `th:replace` únicamente.

#### Ejemplo de diseño flexible

El archivo `task/layout.html` define todos los fragmentos que se usarán al 
llamar a las plantillas. El siguiente fragmento `header` utiliza el parámetro 
`breadcrumb`, que reemplaza el marcado `ol` con su valor resuelto:

```xml
<!--/* Fragmento de cabecera */-->
<div th:fragment="header(breadcrumb)">
    <ol class="breadcrumb container" th:replace="${breadcrumb}">
        <li><a href="#">Inicio</a></li>
    </ol>
</div>
```

En la plantilla de llamada (`task/task-list.html`) usaremos una sintaxis de 
*Selector de Marcado* para pasar el elemento que coincida con el selector 
`.breadcrumb`:

```xml
<!--/* El marcado con la clase breadcrumb se pasará al fragmento de encabezado */-->
<header th:insert="task/layout :: header(~{ :: .breadcrumb})">
    <ol class="breadcrumb container">
        <li><a href="#">Inicio</a></li>
        <li><a href="#" th:href="@{/task}">Tareas</a></li>
    </ol>
</header>
```

Como resultado, se generará el siguiente HTML para la vista `task/taks-list`:

```xml
<header>
    <div>
        <ol class="breadcrumb container">
            <li><a href="#">Inicio</a></li>
            <li><a href="[...]">Tareas</a></li>
        </ol>
    </div>
</header>
```

De manera similar, podemos usar el mismo fragmento con diferentes rutas de navegación en otra vista (`task/task.html`):

```xml
<header th:insert="task/layout :: header(~{ :: .breadcrumb})">
    <ol class="breadcrumb container">
        <li><a href="#">Inicio</a></li>
        <li><a href="#" th:href="@{/task}">Tareas</a></li>
        <li th:text="${'Task ' + task.id}">Tarea</li>
    </ol>
</header>
```

Si no hay nada que pasar al fragmento, podemos usar una expresión especial de fragmento vacío: `~{}`. Esta expresión 
pasará un valor vacío que se ignorará en el fragmento `header`:

```xml
<header th:insert="task/layout :: header(~{})">
    
</header>
```

Otra característica de la nueva expresión de fragmento es el token llamado *ninguna-operacion* que permite utilizar el 
marcado predeterminado del fragmento en caso de que sea necesario:

```xml
<header th:insert="task/layout :: header(_)">
    
</header>
```
Como resultado obtendremos:

```xml
<header>
    <ol class="breadcrumb container">
        <li><a href="#">Inicio</a></li>
    </ol>
</header>
```

La Expresión de Fragmentos permite personalizar fragmentos de maneras que hasta ahora solo eran posibles con el 
Dialecto de Diseño de terceros. Lea más sobre este tema en la documentación de Thymeleaf: 
[Diseños flexibles: más allá de la simple inserción de fragmentos](http://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#flexible-layouts-beyond-mere-fragment-insertion)

### Inclusión de fragmentos desde el `@Controller` de Spring

Los fragmentos se pueden especificar directamente desde un controlador Spring MVC, por ejemplo, 
`signup::signupForm`;, lo cual puede ser útil para controladores AJAX que devuelven solo un pequeño fragmento de HTML al 
navegador. En el ejemplo a continuación, el fragmento del formulario de registro se cargará tras una solicitud AJAX y la 
vista de registro completa, tras una solicitud regular:

```java
@RequestMapping(value = "signup")
public String signup(Model model,
        @RequestHeader("X-Requested-With") String requestedWith) {
        
    model.addAttribute(new SignupForm());
    if (AjaxUtils.isAjaxRequest(requestedWith)) {
        return SIGNUP_VIEW_NAME.concat(" :: signupForm");
    }
    return SIGNUP_VIEW_NAME;
    
}
```

El fragmento está definido en `signup/signup.html`:

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <form method="post"
          th:action="@{/signup}" th:object="${signupForm}" th:fragment="signupForm">
      ...
    </form>
  </body>
</html>
```

El fragmento anterior se carga cuando un nuevo usuario desea registrarse desde la página de inicio. El cuadro de diálogo 
modal se mostrará al hacer clic en el botón "Registrarse" y el contenido se cargará mediante una llamada AJAX 
(véase `home/homeNotSignedIn.html`).

### Referencias

Consulte la documentación de Thymeleaf que describe este tema detalladamente.

* [Diseño de plantilla](http://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#template-layout).
* [Expresiones de fragmentos](http://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#fragment-specification-syntax)
* [Diseños flexibles: más allá de la mera inserción de fragmentos](http://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#flexible-layouts-beyond-mere-fragment-insertion)

### Thymol

Cuando se usa una plantilla de Thymeleaf como prototipo estático, no podemos ver 
los fragmentos que incluimos mediante las etiquetas de host 
`th:insert/th:replace`. Solo podemos ver los fragmentos a un lado, abriendo sus 
propios documentos de plantilla.

Sin embargo, existe una manera de ver los fragmentos reales incluidos en nuestras 
páginas durante el prototipado. Esto se puede hacer usando 
[Thymol](http://www.thymeleaf.org/ecosystem.html#thymol), una biblioteca 
JavaScript no oficial que implementa la funcionalidad estándar de inclusión de 
fragmentos de Thymeleaf. Esta biblioteca proporciona compatibilidad estática con 
algunos atributos de Thymeleaf como `th:insert` o `th:replace`, visualización 
condicional con `th:if`/`th:unless`, etc.

Como afirma el autor de Thymol: *Thymol se creó para proporcionar una 
representación estática más precisa de las capacidades de creación de plantillas 
dinámicas de Thymeleaf, ofreciendo compatibilidad con los atributos de Thymeleaf 
a través de una biblioteca de JavaScript con acceso estático*.

La documentación y los ejemplos de Thymol se pueden encontrar en el sitio oficial 
del proyecto aquí: [Thymol](https://github.com/thymol/thymol.js).

Dialecto de diseño de Thymeleaf
------------------------

El [Dialecto de diseño](https://github.com/ultraq/thymeleaf-layout-dialect)
ofrece la posibilidad de usar un enfoque jerárquico, pero desde una perspectiva 
exclusiva de Thymeleaf y sin necesidad de bibliotecas externas, como Apache 
Tiles. El Dialecto de Diseño de Thymeleaf  utiliza plantillas de 
diseño/decoración para diseñar el contenido y permite pasar elementos de 
fragmentos completos a las páginas incluidas. Los conceptos de esta biblioteca 
son similares a los de [SiteMesh](http://wiki.sitemesh.org) o JSF con Facelets.

### Configuración

Para empezar a usar el Dialecto de Diseño, debemos incluirlo en el archivo 
`pom.xml`. La dependencia es:

```xml
<dependency>
  <groupId>nz.net.ultraq.thymeleaf</groupId>
  <artifactId>thymeleaf-layout-dialect</artifactId>
  <version>2.0.5</version>
</dependency>
```

También necesitaremos configurar la integración añadiendo un dialecto adicional 
a nuestro motor de plantillas:

```java
@Bean
public SpringTemplateEngine templateEngine() {
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    ...
    templateEngine.addDialect(new LayoutDialect());
    return templateEngine;
}
```

No se requieren otros cambios.

### Creando un diseño

El archivo de diseño se define en `/WEB-INF/views/task/layout.html`:

```xml
<!DOCTYPE html>
<html>
  <head>
    <!--/*  Cada token será reemplazado por su respectivo título en la página resultante. */-->
    <title layout:title-pattern="$LAYOUT_TITLE - $CONTENT_TITLE">Lista de Tareas</title>
    ...
  </head>
  <body>
    <!--/* El diseño estándar se puede combinar con el dialecto de diseño */-->
    <div th:replace="fragments/header :: header">
      ...
    </div>
    <div class="container">
      <div layout:fragment="content">
          <!-- ==================================================================================================  -->
          <!-- Este contenido solo se utiliza para la creación de prototipos estáticos (plantillas naturales)      -->
          <!-- y, por lo tanto, es totalmente opcional, ya que este fragmento de marcado se incluirá               -->
          <!-- de "fragments/header.html" en tiempo de ejecución.                                                  -->
          <!-- =================================================================================================== -->
        <h1>Contenido estático solo para fines de creación de prototipos</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Praesent scelerisque neque neque, ac elementum quam dignissim interdum.
          Phasellus et placerat elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Praesent scelerisque neque neque, ac elementum quam dignissim interdum.
          Phasellus et placerat elit.
        </p>
      </div>
      <div th:replace="fragments/footer :: footer">&copy; 2014 Las Plantillas Estáticas</div>
    </div>
  </body>
</html>
```

Podemos abrir el archivo directamente en un navegador:

![Página de diseño](images/layouts/layoutlayoutdialect.png)

El archivo anterior es nuestro decorador para las páginas de contenido que 
crearemos en la aplicación. Lo más importante del ejemplo anterior es 
`layout:fragment="content"`. Este es el núcleo de la página decoradora (diseño). 
También puede observar que el encabezado y el pie de página se incluyen mediante 
el sistema de Diseño Estándar de Thymeleaf.

La página de contenido se ve así: (`WEB-INF/views/task/list.html`):

```xml
<!DOCTYPE html>
<html layout:decorate="~{task/layout}">
  <head>
    <title>Lista de Tareas</title>
    ...
  </head>
  <body>
    <!-- /* El contenido de esta página será decorado por los elementos de layout.html (tarea/diseño) */ -->
    <div layout:fragment="content">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <td>ID</td>
            <td>Título</td>
            <td>Texto</td>
            <td>Debido a</td>
          </tr>
        </thead>
        <tbody>
          <tr th:if="${tasks.empty}">
            <td colspan="4">Sin tareas</td>
          </tr>
          <tr th:each="task : ${tasks}">
            <td th:text="${task.id}">1</td>
            <td><a href="view.html" th:href="@{'/' + ${task.id}}" th:text="${task.title}">Título ...</a></td>
            <td th:text="${task.text}">Texto ...</td>
            <td th:text="${#calendars.format(task.dueTo)}">11 Julio 2012 2:17:16 PM CDT</td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
```

Y en el navegador se ve así:

![Página de diseño](images/layouts/layoutlayoutdialectlist.png)

El contenido de esta vista `task/list` se decorará con los elementos de la 
vista `task/layout`. Tenga en cuenta el atributo 
`layout:decorate="~{task/layout}"` en el elemento `<html>`. Este atributo indica 
al dialecto de diseño qué diseño debe usarse para decorar la vista.
Y tenga en cuenta que utiliza la sintaxis de expresión de fragmentos de 
Thymeleaf.

¿Y qué hay de las *Plantillas Naturales* que usan el dialecto de diseño? ¡Es 
posible! Simplemente agregue marcado específico para prototipado alrededor de 
los fragmentos que se incluyen en sus plantillas, ¡y listo!

### Incluir enfoque de estilo con el dialecto de diseño

El dialecto de diseño no solo admite un enfoque jerárquico, sino que también 
permite usarlo con estilo de inclusión (`layout:include`).
A diferencia de las inclusiones estándar de Thymeleaf, con el dialecto de diseño 
se pueden pasar elementos HTML a la página incluida. Resulta útil si se desea 
reutilizar HTML, pero cuyo contenido es demasiado complejo para pasarlo mediante 
la inclusión parametrizada en el dialecto estándar de Thymeleaf.

Este es un ejemplo de un fragmento de alerta reutilizable que utiliza `layout:fragment`
(`task/alert.html`):

```xml
<!DOCTYPE html>
<html>
  <body>
    <th:block layout:fragment="alert-content">
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula...</p>
        <p>
            <button type="button" class="btn btn-danger">Tome esta acción</button>
            <button type="button" class="btn btn-default">O haz esto</button>
        </p>
    </th:block>
  </body>
</html>
```

La invocación del fragmento anterior podría verse así:
(`task/list.html`):

```xml
    <div layout:insert="~{task/alert :: alert}" th:with="type='info', header='Info'" th:remove="tag">
        <!--/* Implementa un fragmento de contenido de alerta con contenido simple */-->
        <th:block layout:fragment="alert-content">
            <p><em>¡Esta es una lista sencilla de tareas!</em></p>
        </th:block>
    </div>
```

O:

```xml
    <div layout:insert="~{task/alert :: alert}" th:with="type='danger', header='¡Vaya! ¡Tienes un error!'" th:remove="tag">
        <!--/* Implementa un fragmento de contenido de alerta con contenido HTML completo */-->
        <th:block layout:fragment="alert-content">
           <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula...</p>
            <p>
                <button type="button" class="btn btn-danger">Tome esta acción</button>
                <button type="button" class="btn btn-default">O haz estO</button>
            </p>
        </th:block>
    </div>
```

En este caso, todo el `alert-content` de la plantilla `task/alert` 
(`/WEB-INF/views/task/alert.html`) se reemplazará por el HTML personalizado 
anterior.

### Referencias

Consulta la documentación del dialecto de diseño, que describe este tema 
detalladamente. Sin duda, encontrarás ejemplos más avanzados que los que se 
incluyen en este artículo.

Puedes encontrar la documentación aquí:
[Dialecto de Diseño](https://github.com/ultraq/thymeleaf-layout-dialect).


Otras opciones de diseño
--------------------

Para algunos desarrolladores, ninguna de las soluciones presentadas 
anteriormente es suficiente. El sistema de diseño estándar de Thymeleaf no es
suficiente y el uso de bibliotecas externas no es una opción. En ese caso, una 
solución personalizada podría ser la solución ideal.

### Diseño personalizado de Thymeleaf

Una de estas soluciones se describe detalladamente en esta entrada del blog: 
[Diseños de plantillas de Thymeleaf en una aplicación Spring MVC sin extensiones](http://blog.codeleak.pl/2013/11/thymeleaf-template-layouts-in-spring.html).
La idea de esta solución es muy sencilla. Visualicémosla con un ejemplo:

Archivo de vista de ejemplo (1):

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="container" th:fragment="content">
      <p>
        ¡Hola <span th:text="${#authentication.name}">Usuario</span>!
          ¡Bienvenido a la aplicación Spring MVC Quickstart!
      </p>
    </div>
  </body>
</html>
```

Y el archivo de diseño (2):

```xml
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div th:replace="fragments/header :: header">Cabecera</div>
    <div th:replace="${view} :: content">Contenido de la Página</div>
    <div th:replace="fragments/footer :: footer">Pie de Página</div>
  </body>
</html>
```

¿Qué pasará?

-   Los controladores devuelven nombres de vista, que se traducen en un único 
    archivo de vista de Thymeleaf (1).
-   Antes de renderizar la vista, el atributo `viewName` original del objeto 
    `ModelAndView` se reemplaza por el nombre de la vista de diseño, y el 
    `viewName` original se convierte en un atributo de `ModelAndView`.
-   La vista de diseño (2) contiene varios elementos de inclusión:
-   El archivo de vista contiene fragmentos *extraídos* por la plantilla, que 
    integra la vista.

El proyecto se puede encontrar en [GitHub](https://github.com/kolorobot/thymeleaf-custom-layout).

Resumen
-------

En este artículo, describimos varias maneras de lograrlo: **diseños**. Puedes 
crear diseños utilizando el sistema de Diseño Estándar de Thymeleaf, basado en 
un enfoque de estilo de inclusión. También dispones de un potente Dialecto de 
Diseño, que utiliza patrones decoradores para trabajar con archivos de diseño. 
Finalmente, puedes crear fácilmente tu propia solución.

Esperamos que este artículo te brinde más información sobre el tema y que 
encuentres el enfoque que prefieras según tus necesidades.