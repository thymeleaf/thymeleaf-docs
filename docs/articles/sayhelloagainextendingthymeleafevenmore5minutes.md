---
title: Say Hello Again! Extending Thymeleaf even more in another 5 minutes
---


This article is a continuation of [*"Say Hello! Extending Thymeleaf in 5
minutes"*](sayhelloextendingthymeleaf5minutes.html) and is meant to be
read after it.  Code in this article comes from the same example application,
which you can view or download from [its GitHub repo](https://github.com/thymeleaf/thymeleaf/tree/3.1-master/examples/spring6/thymeleaf-examples-spring6-sayhello).


Some improvements for our 'hello' dialect
-----------------------------------------

So far our `HelloDialect` allowed us to turn this:

```html
<p hello:sayto="World">Hi ya!</p>
```

...into this:

```html
<p>Hello World!</p>
```

And it works just fine... but we want to add some nice additional
features. For example:

-   Allow Spring EL expressions as attribute values, like in most tags
    in the *Spring Thymeleaf Dialect*. For example:
    `hello:sayto="${user.name}"`
-   Internationalize output: say *Hello* for English, *Hola* for
    Spanish, *Ol&aacute;* for Portuguese, etc.

And we will need all that because we want to be able to create a new
attribute, called "`saytoplanet`" and salute all the planets in the
solar system, with a template like this:

```html
<ul>
  <li th:each="planet : ${planets}" hello:saytoplanet="${planet}">Hello Planet!</li>
</ul>
```

...backed by a Spring MVC controller that includes all those planets as
a model attribute called `planets`:

```java
@Controller
public class SayHelloController {

  public SayHelloController() {
    super();
  }

  @ModelAttribute("planets")
  public List<String> populatePlanets() {
    return Arrays.asList(new String[] {
        "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
    });
  }

  @RequestMapping({"/","/sayhello"})
  public String showSayHello() {
    return "sayhello";
  }

}
```


Adding a new processor to our dialect
-------------------------------------

The first thing we want to do is add a new *processor* to our existing
`HelloDialect`. For this we modify the dialect's `getProcessors()`
method in order to include our new `SayToPlanetAttrProcessor` class:

```java
public class HelloDialect extends AbstractProcessorDialect {

  ...

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
      processors.add(new SayToPlanetAttributeTagProcessor(dialectPrefix));
      return processors;
  }

  ...

}
```


Using expressions as attribute values
-------------------------------------

Now we want to add to our new processor the ability of parsing and
executing expressions in the same way we can do in the *Standard* and
*SpringStandard* dialects, this is, *Thymeleaf standard expressions*:

-   `${...}` Spring EL variable expressions.
-   `#{...}` externalization of messages.
-   `@{...}` link specifications.
-   `(cond)? (then) : (else)` conditional/default expressions.
-   etc...

In order to achieve this, we will make use of the *Standard Expression
Parser*, which will parse the attribute value into an executable
*expression* object:

```java
public class SayToPlanetAttributeTagProcessor extends AbstractAttributeTagProcessor {

    private static final String ATTR_NAME = "saytoplanet";
    private static final int PRECEDENCE = 10000;

    private static final String SAYTO_PLANET_MESSAGE = "msg.helloplanet";

    
    public SayToPlanetAttributeTagProcessor(final String dialectPrefix) {
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

        /*
         * In order to evaluate the attribute value as a Thymeleaf Standard Expression,
         * we first obtain the parser, then use it for parsing the attribute value into
         * an expression object, and finally execute this expression object.
         */
        final IEngineConfiguration configuration = context.getConfiguration();

        final IStandardExpressionParser parser =
                StandardExpressions.getExpressionParser(configuration);

        final IStandardExpression expression = parser.parseExpression(context, attributeValue);

        final String planet = (String) expression.execute(context);

        /*
         * Set the salutation as the body of the tag, HTML-escaped and
         * non-processable (hence the 'false' argument)
         */
        structureHandler.setBody("Hello, planet " + planet, false);
        
    }

}
```

Note that, as we did in the previous article, we are extending the
`AbstractAttributeTagProcessor` convenience abstract class.


Adding internationalization
---------------------------

Now we want to internationalize the message returned by our attribute
processor. This means replacing this English-only message building
code:

```java
"Hello, planet " + planet;
```

...with a message built from an externalized String that we must somehow
obtain from our code. The context object (`ITemplateContext`) offers
what we need:

```java
    public String getMessage(
            final Class<?> origin, 
            final String key, 
            final Object[] messageParameters, 
            final boolean useAbsentMessageRepresentation);
```

Its arguments have the following meaning:

  - `origin`  the *origin* class to be used for message resolution. When 
    calling from a processor, this is normally the processor class itself. 
  - `key` the key of the message to be retrieved.
  - `messageParameters` the parameters to be applied to the requested message.
  - `useAbsentMessageRepresentation` whether an *absent message representation* 
    should be returned in the case that the message does not exist or not

So let's use this to achieve some internationalization. First we will
need some `.properties` files, like
`SayToPlanetAttributeTagProcessor_es.properties` for Spanish:

```html
    msg.helloplanet=&iexcl;Hola, planeta {0}!
```    

`SayToPlanetAttributeTagProcessor_pt.properties` for Portuguese:

```html
msg.helloplanet=Ol&aacute;, planeta {0}!
```

...etc.

And now we will have to modify the `SayToPlanetAttributeTagProcessor` processor
class to make use of these messages:

```java
protected void doProcess(
        final ITemplateContext context, final IProcessableElementTag tag,
        final AttributeName attributeName, final String attributeValue,
        final IElementTagStructureHandler structureHandler) {

    /*
     * In order to evaluate the attribute value as a Thymeleaf Standard Expression,
     * we first obtain the parser, then use it for parsing the attribute value into
     * an expression object, and finally execute this expression object.
     */
    final IEngineConfiguration configuration = context.getConfiguration();

    final IStandardExpressionParser parser =
            StandardExpressions.getExpressionParser(configuration);

    final IStandardExpression expression = parser.parseExpression(context, attributeValue);

    final String planet = (String) expression.execute(context);

    /*
     * This 'getMessage(...)' method will first try to resolve the message
     * from the configured Spring Message Sources (because this is a Spring
     * -enabled application).
     * 
     * If not found, it will try to resolve it from a classpath-bound
     * .properties with the same name as the specified 'origin', which
     * in this case is this processor's class itself. This allows resources
     * to be packaged if needed in the same .jar files as the processors
     * they are used in.
     */
    final String i18nMessage =
            context.getMessage(
                    SayToPlanetAttributeTagProcessor.class,
                    SAYTO_PLANET_MESSAGE,
                    new Object[] {planet},
                    true);

    /*
     * Set the computed message as the body of the tag, HTML-escaped and
     * non-processable (hence the 'false' argument)
     */
    structureHandler.setBody(HtmlEscape.escapeHtml5(i18nMessage), false);
    
}
```

And that's it! Let's have a look at the results of executing our
template with Spanish locale:

-   &iexcl;Hola, planeta Mercury!
-   &iexcl;Hola, planeta Venus!
-   &iexcl;Hola, planeta Earth!
-   &iexcl;Hola, planeta Mars!
-   &iexcl;Hola, planeta Jupiter!
-   &iexcl;Hola, planeta Saturn!
-   &iexcl;Hola, planeta Uranus!
-   &iexcl;Hola, planeta Neptune!


Exercise for the reader: internationalize the planet names
----------------------------------------------------------

Now we've applied internationalization to the message output by our
attribute processor, but our planet names are still all in English
because they are *hard coded* variables in our context (in Spring
language, *model attributes*).

So, how about internationalizing those planet names? The `#{...}`
expressions we can use in this attribute now should make this quite
easy, and there are also some examples in articles like [*"Getting
started with the Standard Dialect in 5
minutes"*](standarddialect5minutes.html) and the
[tutorials](/documentation.html) quite similar to this scenario.

