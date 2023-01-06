---
title: Say Hello! Extending Thymeleaf in 5 minutes
---


Extending Thymeleaf is easy: we only have to create a dialect and add
it to our template engine. Let's see how.

All the code seen here comes from a working application. You can view or
download the source code from [its GitHub repo](https://github.com/thymeleaf/thymeleaf/tree/3.1-master/examples/spring6/thymeleaf-examples-spring6-sayhello).


Dialects
--------

Thymeleaf Dialects are sets of features we can use in your templates.
These features include:

-   **Processing logic** specified via *processors* that apply to
    attributes in our tags (or tags themselves).
-   **Preprocessing and Postprocessing logic** specified via *pre-processors*
    and *post-processors* that apply to our template before (pre) or
    after (post) processing actually takes place.
-   **Expression objects** which can be used in Thymeleaf Standard
    Expressions (like `#arrays`, `#dates`, etc.) in order to perform
    the specialized operations we might need.

All of these features are optional, and a dialect can specify only some
of them. For example, a dialect might not need to specify any processors,
but declare a couple of *expression objects*.

If you've seen fragments of code written in the *Standard Dialects*, you
should have noticed that the processable attributes start with `th:`.
That "`th`" is called the **dialect prefix**, and it means that all tags
and attributes processed by that dialect will start with such prefix. Each
dialect can specify its own prefix.

It is important also to note that **a Template Engine can be set several
dialects at a time**, thus allowing the processing of templates
including features from all of the specified dialects (think of dialects
as a sort of *JSP taglibs* in steroids). What's more, some of these
dialects can *share prefix*, effectively acting as an aggregate dialect.


The simplest dialect ever: Say Hello!
-------------------------------------

Let's create a dialect for one of our applications. This will be a
Spring MVC application, so we will be already using the SpringStandard
dialect (have a look at the [Thymeleaf + Spring tutorial](/documentation.html) 
for more details). But we want to add a
new attribute that allows us to say hello to whoever we want, like this:

```html
<p hello:sayto="World">Hi ya!</p>
```

### The processor

First, we will have to create the attribute processor that will take
care of displaying our salutation message.

All processors implement the `org.thymeleaf.processor.IProcessor` interface,
and specifically a tag processor implements the
`org.thymeleaf.processor.element.IElementTagProcessor` because it is a processor
that applies on an *element* (in XML/HTML jargon), and specifically on the 
*open tag* of such element.

Besides, this is a processor that will be triggered by a specific attribute
in such *open tag* (`hello:sayto`), so we will be extending a useful abstract
class that will give us most of the class infrastructure we need:
`org.thymeleaf.processor.element.AbstractAttributeTagProcessor`.

```java
public class SayToAttributeTagProcessor extends AbstractAttributeTagProcessor {

    private static final String ATTR_NAME = "sayto";
    private static final int PRECEDENCE = 10000;


    public SayToAttributeTagProcessor(final String dialectPrefix) {
        super(
            TemplateMode.HTML, // This processor will apply only to HTML mode
            dialectPrefix,     // Prefix to be applied to name for matching
            null,              // No tag name: match any tag name
            false,             // No prefix to be applied to tag name
            ATTR_NAME,         // Name of the attribute that will be matched
            true,              // Apply dialect prefix to attribute name
            PRECEDENCE,        // Precedence (inside dialect's precedence)
            true);             // Remove the matched attribute afterwards
    }


    protected void doProcess(
            final ITemplateContext context, final IProcessableElementTag tag,
            final AttributeName attributeName, final String attributeValue,
            final IElementTagStructureHandler structureHandler) {

        structureHandler.setBody(
                "Hello, " + HtmlEscape.escapeHtml5(attributeValue) + "!", false);

    }


}
```

### The dialect class

Creating our processor was very easy, but now we will need to create the
*dialect class*, which will be in charge of telling Thymeleaf that our
processor is available.

The most basic dialect interface, `org.thymeleaf.dialect.IDialect`, only
tells Thymeleaf that a specific class is a *dialect*. But the engine will
need to know what that dialect is capable of offering, and in order to
declare that, the dialect class will implement one or several of a set
of `IDialect` sub-interfaces.

Specifically, out dialect will offer *processors, and as such it will
implement the `org.thymeleaf.dialect.IProcessorDialect`. And in order
to make it easier, instead of directly implementing the interface we
will extend an abstract class called `org.thymeleaf.dialect.AbstractProcessorDialect`:

```java
public class HelloDialect extends AbstractProcessorDialect {

    public HelloDialect() {
        super(
                "Hello Dialect",    // Dialect name
                "hello",            // Dialect prefix (hello:*)
                1000);              // Dialect precedence
    }

    
    /*
     * Initialize the dialect's processors.
     *
     * Note the dialect prefix is passed here because, although we set
     * "hello" to be the dialect's prefix at the constructor, that only
     * works as a default, and at engine configuration time the user
     * might have chosen a different prefix to be used.
     */
    public Set<IProcessor> getProcessors(final String dialectPrefix) {
        final Set<IProcessor> processors = new HashSet<IProcessor>();
        processors.add(new SayToAttributeTagProcessor(dialectPrefix));
        return processors;
    }


}
```


Using the hello dialect
-----------------------

Using our new dialect is very easy. This being a Spring MVC application,
we just have to add it to our `templateEngine` bean during configuration. 

```java
@Bean
public SpringTemplateEngine templateEngine(){
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    templateEngine.setEnableSpringELCompiler(true);
    templateEngine.setTemplateResolver(templateResolver());
    templateEngine.addDialect(new HelloDialect());
    return templateEngine;
}
```

Note that by using `addDialect(...)` (instead of `setDialect(...)`) we are telling 
the engine that we want to make use of our new dialect *in addition to* the 
default `StandardDialect`. So all the standard `th:*` attributes will be also
available.


And now our new attribute would work seamlessly:

```html
<p>Hello World!</p>
```


Want to know more?
------------------

Then have a look at [*"Say Hello Again! Extending Thymeleaf even more in
another 5 minutes"*](sayhelloagainextendingthymeleafevenmore5minutes.html).
