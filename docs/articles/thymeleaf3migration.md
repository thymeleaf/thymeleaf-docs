---
title: Thymeleaf 3 ten-minute migration guide
---


Thymeleaf 3 ten-minute migration guide
=======================================

Are you a Thymeleaf 2 user wishing to try the new **Thymeleaf 3**?

First, the good news. Your existing Thymeleaf templates are almost 100% compatible with Thymeleaf 3 so you will only have to do a few modifications in your configuration.

Thymeleaf 3.0 BETA versions are stable and do everything 2.1 did, so we encourage you to migrate to Thymeleaf 3 as soon as possible in order to take advantage of its performance improvements and new features.

The only downside is that not all Thymeleaf dialects have been migrated to Thymeleaf 3 at this stage, so if you are using some external dialects they may not work with Thymeleaf 3. Please check if the required dialects have a Thymeleaf 3 compatible version.

**Quick pointer**: if you already read this *migration guide* for Thymeleaf 3.0.0.BETA01 and you are only interested in the new features in BETA02, you can fast-forward to the new sections on [*"Fragment Expressions"*](#fragment-expressions), [*"The No-Operation token"*](#the-no-operation-token), [*"Decoupled Template Logic"*](#decoupled-template-logic), [*"Independence from the Servlet API"*](#independence-from-the-servlet-api) and also check some additional comments at the [*"Performance improvements"*](#performance-improvements) section.


Template changes
----------------

The only change we *recommend* doing to your templates is removing any `th:inline="text"` attributes you might have, because they are not needed anymore in order to have output inlined expressions in HTML or XML templates. And it's just a recommendation &mdash; templates  will work anyway. But you will benefit from some extra processing performance if you remove those. 

See more information about this below in the *Improved inlining mechanism* section.



Configuration changes
---------------------

Let's show an example of the Thymeleaf 3 configuration using the *thymeleaf-spring4* integration package and Java config, as it is the most common choice among Thymeleaf users.

First, the updated Maven dependencies to get Thymeleaf 3 and the Spring 4 integration package:

```xml
    <dependency>
        <groupId>org.thymeleaf</groupId>
        <artifactId>thymeleaf</artifactId>
        <version>3.0.0.BETA01</version>
    </dependency>
    <dependency>
        <groupId>org.thymeleaf</groupId>
        <artifactId>thymeleaf-spring4</artifactId>
        <version>3.0.0.BETA02</version>
    </dependency>
```

Second, the Spring configuration:

```java
    @Configuration
    @EnableWebMvc
    @ComponentScan("com.thymeleafexamples")
    public class ThymeleafConfig extends WebMvcConfigurerAdapter implements ApplicationContextAware {

        private ApplicationContext applicationContext;

        public void setApplicationContext(ApplicationContext applicationContext) {
            this.applicationContext = applicationContext;
        }

        @Bean
        public ViewResolver viewResolver() {
            ThymeleafViewResolver resolver = new ThymeleafViewResolver();
            resolver.setTemplateEngine(templateEngine());
            resolver.setCharacterEncoding("UTF-8");
            return resolver;
        }

        private TemplateEngine templateEngine() {
            SpringTemplateEngine engine = new SpringTemplateEngine();
            engine.setTemplateResolver(templateResolver());
            return engine;
        }

        private ITemplateResolver templateResolver() {
            SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
            resolver.setApplicationContext(applicationContext);
            resolver.setPrefix("/WEB-INF/templates/");
            resolver.setTemplateMode(TemplateMode.HTML);
            return resolver;
        }

    }
```

The first difference with the Thymeleaf 2 configuration is that now the recommended template resolver for Spring applications is `SpringResourceTemplateResolver`. It needs a reference to the Spring `ApplicationContext` so the configuration bean has to implement the `ApplicationContextAware` interface.

The second difference is that the template mode has a value of `TemplateMode.HTML`.
Template modes are not strings anymore and the possible values are a bit different from Thymeleaf 2.
We will discuss it in a minute.

If you need to add any extra dialects, you can use the `engine.addDialect(...)` method, but first 
make sure that it has a Thymeleaf 3 compatible version.

You can browse and download the source code for simple "Hello World!" examples at [Thymeleaf 3 + Spring 4 + Java config example](https://github.com/jmiguelsamper/thymeleaf3-spring-helloworld), [Thymeleaf 3 + Spring 4 + XML config example](https://github.com/jmiguelsamper/thymeleaf3-spring-xml-helloworld) and [Thymeleaf 3 + Servlet 3 example](https://github.com/jmiguelsamper/thymeleaf3-servlet-helloworld)

You can also find some additional information (links to binaries and javadocs) at [the Thymeleaf BETA 2 announcement](http://forum.thymeleaf.org/Thymeleaf-News-and-Announcements-f2234422.html).



Full HTML5 markup support
-------------------------

Thymeleaf 3.0 is no longer XML-based, thanks to its new parsing system, so there is no need to write XML-valid HTML code anymore (even if we still recommend you to do so for legibility reasons). When in `HTML` mode, Thymeleaf is now much more lenient in terms of closed tags, quoted attributes, etc.

So this is now a perfectly processable (yet a bit ugly) Thymeleaf template:
```html
    <div><p th:text=${mytext} ng-app>Whatever
```

For an explanation of the new parsing system, see [Full HTML5 support, new parsing infrastructure](https://github.com/thymeleaf/thymeleaf/issues/390)



Template modes
--------------

Thymeleaf 3 replaces the set of template modes from previous versions. The new template modes are:

-   `HTML`
-   `XML`
-   `TEXT`
-   `JAVASCRIPT`
-   `CSS`
-   `RAW`

There are two *markup* template modes (`HTML` and `XML`), three *textual* template modes (`TEXT`, `JAVASCRIPT` and `CSS`) and a *no-op* template mode (`RAW`).

The `HTML` template mode will admit any kind of HTML markup input, including **HTML5**, HTML 4 and XHTML. 
No markup validation of well-formedness check will be performed, and template markup code structure will be respected 
to the biggest possible extent in output.

For a detailed explanation of the different template modes, please take a look at [Thymeleaf 3.0 Template Mode set](https://github.com/thymeleaf/thymeleaf/issues/391).

You can see a simple example exercising the new template modes at [https://github.com/jmiguelsamper/thymeleaf3-template-modes-example](https://github.com/jmiguelsamper/thymeleaf3-template-modes-example)


### Textual template modes

The new textual template modes bring to Thymeleaf the ability to output **CSS**, **Javascript** and **plain text**. This is
handy if you want to use the values of server-side variables in your CSS and Javascript files, or to generate
plain text content as, for example, in e-mail composing.

In order to have all Thymeleaf features avaible for the textual modes, a new syntax has been introduced. For example, you can iterate like:

```text
    [# th:each="item : ${items}"]
        - [# th:utext="${item}" /]
    [/]
```

For a full explanation of this new syntax, take a look at [New syntax for textual template modes](https://github.com/thymeleaf/thymeleaf/issues/395)


### Improved inlining mechanism

Sometimes it is handy to be able to output data without using extra tags or attributes, as in:

```html
    <p>This product is called [[${product.name}]] and it's great!</p>
```

This capability, called *inlining*, has been greatly improved and is now much better supported in Thymeleaf 3. See [Inlined output expressions](https://github.com/thymeleaf/thymeleaf/issues/394) for details.

The existing inlining mechanism also matches the new template modes and, indeed, make innecesary the `th:inline="text"` attribute because inlining now exists in `HTML` mode itself. Take a look at the discussion on [Refactoring of the inlining mechanism](https://github.com/thymeleaf/thymeleaf/issues/396)



Fragment Expressions
--------------------

Thymeleaf 3.0 introduces a new type of expression as a part of the general *Thymeleaf Standard Expression* system: *Fragment Expressions*.

They look like this: `~{commons::footer}` and yes, they are extremely similar to the syntax that could be used inside `th:replace` and `th:include` (now `th:insert`) since long ago... because they use exactly *that* syntax, but generalized so that it can now be used in other scopes.

What is the advantage of that? well, first and most useful, we can now pass markup fragments as parameters to other fragments. See the `th:replace` below:

```html
...
<head th:replace="base :: common_header(~{::title},~{::link})">

  <title>Awesome - Main</title>

  <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
  <link rel="stylesheet" th:href="@{/themes/smoothness/jquery-ui.css}">

</head>
...
```

There we are passing to our `common_header` fragment two other markup fragments containing our `<title>` and `<link>` tags, which can then be easily used in our `common_header`:

```html
<head th:fragment="common_header(title,links)">

  <title th:replace="${title}">The awesome application</title>

  <!-- Common styles and scripts -->
  <link rel="stylesheet" type="text/css" media="all" th:href="@{/css/awesomeapp.css}">
  <link rel="shortcut icon" th:href="@{/images/favicon.ico}">
  <script type="text/javascript" th:src="@{/sh/scripts/codebase.js}"></script>

  <!--/* Per-page placeholder for additional links */-->
  <th:block th:replace="${links}" />

</head>
```

See how, thanks to this, many **layout** (or **page composition**) techniques have become much easier in Thymeleaf 3.0.

But the possibilities don't end here: we can use fragment expressions for much more, which you can learn about here: [Fragment Expressions](https://github.com/thymeleaf/thymeleaf/issues/451).



The No-Operation token
----------------------

Another new feature of *Thymeleaf Standard Expressions* in Thymeleaf 3.0 is the NO-OP (no-operation) token, represented by an underscore symbol (`_`) and which basically means *"do nothing"*.

Using *"do-nothing"* as an expression result is more useful than it might look at first sight. For example, it can help us greatly reduce the complexity of our template code by letting us use our *prototyping code* as *default values*.

See this very simple example:

```html
<span th:text="${user.name} ?: _">no user authenticated</span>
```

In the code above we don't need to specify what exactly should be output if our `user` has no name: in that case, Thymeleaf will do nothing. The result? output will be that text we have written as the body of the tag: `no user authenticated`, which in this case will double as text that will make our template look nice as a prototype and default value for that `th:text` in case there is no user authenticated.

Learn more about this new capability here: [The NO-OP token](https://github.com/thymeleaf/thymeleaf/issues/452).



Decoupled Template Logic
------------------------

Thymeleaf 3.0 allows the complete (and optional) *decoupling* of template logic from templates themselves in the `HTML` and `XML` template modes, resulting in 100%-Thymeleaf-free, logic-less templates.

Now markup of a `home.html` template file can be as clean as this:

```html
<!DOCTYPE html>
<html>
  <body>
    <table id="usersTable">
      <tr>
        <td class="username">Jeremy Grapefruit</td>
        <td class="usertype">Normal User</td>
      </tr>
      <tr>
        <td class="username">Alice Watermelon</td>
        <td class="usertype">Administrator</td>
      </tr>
    </table>
  </body>
</html>
```

And the only thing Thymeleaf will need in order to use that HTML as a template is another file by its side, a `home.th.xml`, looking like this:

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

This *decoupled logic* specifies attributes that should be *injected* during parsing into specific parts of the template (selected by the *markup selectors* in their `sel` attributes). The result will be 100% equivalent to a template in which those attributes had been there from the beginning.

Being able to process HTML templates that have no embedded Thymeleaf code can become a huge advantage when using pure-HTML files as design artifacts: now these can be created, modified and/or understood by designers or other people in the team that don't necessarily have Thymeleaf knowledge. But not only that &mdash; it can also allow the processing as templates of markup created by external tools or systems without the need to modify such markup.

For more information, see [Decoupled Template Logic](https://github.com/thymeleaf/thymeleaf/issues/465).



Performance improvements
------------------------

Even with all the great new features, the main achievement of Thymeleaf 3.0 is a **very significant improvement in performance**, a somewhat common discussion topic with previous versions.

Being Thymeleaf an XML-based template engine up to v2.1 brought the power of implementing many great features, but sometimes at a performance cost. And while Thymeleaf rendering time was negligible for the vast majority of projects, this caveat was noticeable in projects with special characteristics (for example, high-load websites dealing with tables with dozens of thousands of rows).

Thymeleaf 3's engine has been rewritten from scratch with the main focus put on performance. Thymeleaf 3 performs much better than the previous versions so we hope it covers the needs of more and more projects. But Thymeleaf 3's performance is not only about rendering time: it has also been specifically designed to have a low memory footprint and help reduce latency in high-concurrency scenarios.

For a technical discussion on the new Thymeleaf 3 architecture, see [New event-based template processing engine](https://github.com/thymeleaf/thymeleaf/issues/389)

But performance improvements do not stop at the architectural level: there are also some *performance goodies* in v3.0 like the ability to enable the SpringEL (*Spring Expression Language* or *SpEL*) compiler that, since version 4.2.4 of the Spring Framework, can be used by Thymeleaf in order to give an extra push to template processing performance in Spring-enabled environments. See [Configuring the SpringEL compiler](https://github.com/thymeleaf/thymeleaf-spring/issues/95).

And if you are not using Spring and therefore your expression language is OGNL, we've made some performance improvements there too, even making a couple of contributions to the OGNL codebase that should benefit Thymeleaf's performance in environments such as those based on the new MVC1.0 (JSR371) standard.



Independence from the Servlet API
---------------------------------

Versions prior to Thymeleaf 3.0 were already *independent from the Java Servlet API* in the sense that Thymeleaf allowed *offline execution* of the template engine, i.e. processing templates without the application living in a web container. This was useful in scenarios such as processing email templates.

But Thymeleaf 3.0 includes a series of improvements that can make Thymeleaf truly independent from the Servlet API **in web environments** that do not make use of Java Servlets such as [vert.x](http://vertx.io/), [RatPack](https://ratpack.io/), [Play Framework](https://www.playframework.com/)... which will be now able to integrate with Thymeleaf in an easier and more elegant way.

For more information see: [New extension point: Link Builders](https://github.com/thymeleaf/thymeleaf/issues/458) and [Generalisation of the IEngineContext mechanism](https://github.com/thymeleaf/thymeleaf/issues/459).



New Dialect system
------------------

Thymeleaf 3 features a brand new dialect system. If you developed a Thymeleaf Dialect for a previous version of Thymeleaf, you will have to adapt it to make it Thymeleaf 3-compatible.

The new dialect interface is really simple...

```java
    public interface IDialect {

        public String getName();
    
    }
```

...but you can add many different features on top of it depending on the specific subinterfaces of `IDialect` that you implement.

Let's highlight a few enhancements of the new Dialect system:

-   There are not only *processors* but *pre-processors* and *post-processors*, so the template content can be modified before and after being processed. We could, for example, use a pre-processor to serve cached content or a post-processor to minimize and compress the output.
-   *Dialect precedence* is a new concept which allows the sorting of processors accross dialects. Processor precedences are now considered relative to dialect precedence, so every processor in a specific dialect can be configured to be executed before any processors from a different dialect just by setting the correct values for this dialect precedence.
-   *Expression object dialects* provide new expression objects or expression utility objects that can be used in expressions anywhere in templates, such as the `#strings`, `#numbers`, `#dates`, etc. provided by the Standard Dialect.

For further explanation of these features, take a look at:

-   [New Dialect API](https://github.com/thymeleaf/thymeleaf/issues/401)
-   [New Pre-Processor and Post-Processor APIs](https://github.com/thymeleaf/thymeleaf/issues/400)
-   [New Processor API](https://github.com/thymeleaf/thymeleaf/issues/399)



Refactoring of the core APIs
----------------------------

The core APIs have been refactored heavily, browse the following issues for details:

-   [Refactoring of the Template Resolution API](https://github.com/thymeleaf/thymeleaf/issues/419)
-   [Refactoring of the Context API](https://github.com/thymeleaf/thymeleaf/issues/420)
-   [Refactoring of the Message Resolution API](https://github.com/thymeleaf/thymeleaf/issues/421)



Final thoughts
--------------

Thymeleaf 3 is a major achievement on the Thymeleaf Template Engine project after four years of existence and many, many, many hours of very hard work. It comes with terrific new features and many under-the-hood improvements.

We hope it fits better the needs of your projects. So please don't hesitate giving it a try and sending us your feedback!
