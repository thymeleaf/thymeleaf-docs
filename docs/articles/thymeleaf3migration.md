% Thymeleaf 3 five-minute migration guide


Thymeleaf 3 five-minute migration guide
=======================================

Are you a Thymeleaf 2 user wishing to try the new Thymeleaf 3?

First, the good news. Your existing Thymeleaf templates are 100% compatible with
Thymeleaf 3 so you will only have to do a few modifications in your configuration.

Thymeleaf 3 betas are stable and feature-complete, so we encourage you to migrate to
Thymeleaf 3 in order to take advantage of its performance improvements and all the 
new features.

The only downside is that not all Thymeleaf dialects have been migrated to Thymeleaf 3
at this stage, so if you are using some dialects they may not work with Thymeleaf 3.
Please check if the dialects needed have a Thymeleaf 3 compatible version.

Configuration changes
---------------------

We will show an example of the Thymeleaf 3 configuration using the *thymeleaf-spring4*
integration package and Java config, are it is the most common choice among Thymeleaf users.

First, the updated Maven dependencies:

```xml
    <dependency>
        <groupId>org.thymeleaf</groupId>
        <artifactId>thymeleaf</artifactId>
        <version>3.0.0.BETA01</version>
    </dependency>
    <dependency>
        <groupId>org.thymeleaf</groupId>
        <artifactId>thymeleaf-spring4</artifactId>
        <version>3.0.0.BETA01</version>
    </dependency>
```

Second, the Spring configuration:

```java
    @Configuration
    @EnableWebMvc
    @ComponentScan("com.thymeleafexamples")
    public class ThymeleafConfig extends WebMvcConfigurerAdapter {

        @Bean
        public ViewResolver viewResolver() {
            ThymeleafViewResolver resolver = new ThymeleafViewResolver();
            resolver.setTemplateEngine(templateEngine());
            resolver.setCharacterEncoding("UTF-8");
            return resolver;
        }

        private TemplateEngine templateEngine() {
            SpringTemplateEngine engine = new SpringTemplateEngine();
            engine.addTemplateResolver(templateResolver());
            return engine;
        }

        private TemplateResolver templateResolver() {
            ServletContextTemplateResolver resolver = new ServletContextTemplateResolver();
            resolver.setPrefix("/WEB-INF/templates/");
            resolver.setTemplateMode(TemplateMode.HTML);
            return resolver;
        }

    }
```

The main difference with the Thymeleaf 2 configuration is the template mode TemplateMode.HTML.
Template modes are not strings anymore and the possible values are quite different from Thymeleaf 2.
We will discuss that in a minute.

If you need to add any extra dialect, you can use the `engine.addDialect(...)` method, but first 
make sure that it has a Thymeleaf 3 compatible version.

**FIXME link to example applications "Thymeleaf 3 Hello World" (Spring+XML, Spring+Java, pure Java) **



Template modes
--------------

Thymeleaf 3 replaces the set of template modes from previous versions. The new template modes are:

- HTML
- XML
- TEXT
- JAVASCRIPT
- CSS

There are two markup template modes (HTML and XML) and three textual template modes (TEXT, JAVASCRIPT and CSS).

The HTML template mode will admit any kind of HTML markup input, including HTML5, HTML 4 and XHTML. 
No markup validation of well-formedness check will be performed, and template markup code structure will be respected 
to the biggest possible extent in output.

The brand new template modes bring to Thymeleaf the ability to output CSS, Javascript and plain text. This is
handy if you want to use the values of server-side variables in your CSS and Javascript files, or to generate
plain text content as, for example, in e-mail composing.

For a detailed explanation of the different template modes, please take a look at [Thymeleaf 3.0 Template Mode set](https://github.com/thymeleaf/thymeleaf/issues/391).

For an explanation of the new parsing system, see [Full HTML5 support, new parsing infrastructure](https://github.com/thymeleaf/thymeleaf/issues/390)


[New syntax for textual template modes](https://github.com/thymeleaf/thymeleaf/issues/395)


The inlining mechanism also matches the new template modes and, indeed, make innecesary the `th:inline="text"` attribute.
If you used it, take a look at the discussion on [Refactoring of the inlining mechanism](https://github.com/thymeleaf/thymeleaf/issues/396)



**FIXME link to example application "new template modes" **



Performance improvements
------------------------

The main goal of the version 3 of Thymeleaf was the performance improvements.
This has been a hot discussion topic in the previous versions, comparing Thymeleaf performance against other text-based template engines.
Being Thymeleaf an XML-based template engine brought the power of implementing many features but at a performance cost. While Thymeleaf
rendering time was trivial in most of the projects, this caveat was noticiable in projects with special characteristics (for example, dealing with tables with dozens of thousands rows).

Thymeleaf 3 engine has been rewritten from scratch with the main focus on performance. Thymeleaf 3 performs much better than the previous versions 
so we hope it covers the needs of more and more projects.

Thymeleaf 3 performance is not only about rendering time, it has been specifically designed to have a low memory footprint and prevent any blocking on high concurrency scenarios.

For a technical discussion in the new Thymeleaf 3 architecture, see [New event-based template processing engine](https://github.com/thymeleaf/thymeleaf/issues/389)



New Dialect system
------------------

[New Dialect API](https://github.com/thymeleaf/thymeleaf/issues/401)
[New Pre-Processor and Post-Processor APIs](https://github.com/thymeleaf/thymeleaf/issues/400)
[New Processor API](https://github.com/thymeleaf/thymeleaf/issues/399)



Miscellaneous improvements
--------------------------

- Inline output expressions

Sometimes it is handy to be able to just display expressions, as in:

```html
    This product is called [[${product.name}]] and it's great!
```

This is now possible, see [Inlined output expressions](https://github.com/thymeleaf/thymeleaf/issues/394) for details.

- Decoupled templates

See [Decouple context from template_resource resolution](https://github.com/thymeleaf/thymeleaf/issues/413)

- Refactoring of the core APIs

See [Refactoring of the Template Resolution API](https://github.com/thymeleaf/thymeleaf/issues/419)

See [Refactoring of the Context API](https://github.com/thymeleaf/thymeleaf/issues/420)

See [Refactoring of the Message Resolution API](https://github.com/thymeleaf/thymeleaf/issues/421)





