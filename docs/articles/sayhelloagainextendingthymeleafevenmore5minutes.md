---
title: Say Hello Again! Extending Thymeleaf even more in another 5 minutes
---


Say Hello Again! Extending Thymeleaf even more in another 5 minutes
===================================================================

This article is a continuation of [*"Say Hello! Extending Thymeleaf in 5
minutes"*](sayhelloextendingthymeleaf5minutes.html) and is meant to be
read after it. Code in this article comes from the same example
application, which you can download from the
[documentation](/documentation.html) page.

Some improvements for our 'hello' dialect
-----------------------------------------

To the moment, our `HelloDialect` allowed us to turn this:

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
public class HelloDialect extends AbstractDialect {

...

  //
  // The processors.
  //
  @Override
  public Set<IProcessor> getProcessors() {
    final Set<IProcessor> processors = new HashSet<IProcessor>();
    processors.add(new SayToAttrProcessor());
    processors.add(new SayToPlanetAttrProcessor());
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
public class SayToPlanetAttrProcessor
extends AbstractTextChildModifierAttrProcessor {

  private static final String SAYTO_PLANET_MESSAGE = "msg.helloplanet";

  public SayToPlanetAttrProcessor() {
    // Only execute this processor for 'saytoplanet' attributes.
    super("saytoplanet");
  }

  public int getPrecedence() {
    // Higher (less-precedent) than any attribute in the
    // SpringStandard dialect and also than 'sayto'.
    return 11000;
  }

  @Override
  protected String getText(final Arguments arguments, final Element element,
    final String attributeName) {

    final Configuration configuration = arguments.getConfiguration();

    final IStandardExpressionParser parser =
        StandardExpressions.getExpressionParser(configuration);

    final String attributeValue = element.getAttributeValue(attributeName);

    final IStandardExpression expression =
        parser.parseExpression(configuration, arguments, attributeValue);

    final String planet = (String) expression.execute(configuration, arguments);

    return "Hello, planet " + planet;

  }

}
```

Note that, as we did in the previous article, we used the
`AbstractTextChildModifierAttrProcessor` convenience abstract class in
order to simplify the development of our processor, simply computing the
text that will be inserted as body of the processed tag.

Adding internationalization
---------------------------

Now we want to internationalize the message returned by our attribute
processor. This means substituting this English-only message building
code:

```java
return "Hello, planet " + planet;
```

...by a message built from an externalized String that we must somehow
obtain from our code. The abstract parent class `AbstractProcessor`
offers three methods we can use for this:

```java
protected String getMessage(
  final Arguments arguments, final String messageKey, final Object[] messageParameters);

protected String getMessageForTemplate(
  final Arguments arguments, final String messageKey, final Object[] messageParameters);

protected String getMessageForProcessor(
  final Arguments arguments, final String messageKey, final Object[] messageParameters);
```

Each of them has a different meaning, let's start by the last two:

-   `getMessageForTemplate(...)` uses the Template Engine's currently
    registered internationalization mechanisms to look for the desired
    message. For example:
    -   In a Spring application, we will probably be using specific
        *Message Resolvers* that query the Spring `MessageSource`
        objects registered for the application.
    -   When not in a Spring application, we will probably be using
        Thymeleaf's *Standard Message Resolver* that looks for
        `.properties` files with the same name as the template being
        processed.

-   `getMessageForProcessor(...)` uses a message resolution mechanism
    created for allowing the *componentization* ---or, if you prefer,
    *encapsulation*--- of dialects. This mechanism consists in allowing
    *tag* and *attribute processors* to specify their own messages,
    whichever the application their dialects are used on. These are read
    from `.properties` files with the same name and living in the same
    package as the processor class (or any of its superclasses). For
    example, the `thymeleafexamples.sayhello.dialect` package in our
    example could contain:
    -   `SayToPlanetAttrProcessor.java`: the *attribute processor*.
    -   `SayToPlanetAttrProcessor_en_GB.properties`: externalized
        messages for English (UK) language.
    -   `SayToPlanetAttrProcessor_en.properties`: externalized messages
        for English (rest of countries) language.
    -   `SayToPlanetAttrProcessor.properties`: default externalized
        messages.

Finally, the first method of the three, `getMessage(...)` acts as a
combination of the other two: first it tries to resolve the required
message as a *template message* (defined in the application messages
files) and if it doesn't exist tries to resolve it as a *processor
message*. This way, applications can override if needed any messages
established by its dialects.

Enough about theory, let's put all this into practice. First we will
need some `.properties` files, like
`SayToPlanetAttrProcessor_es.properties` for Spanish:

```html
    msg.helloplanet=&iexcl;Hola, planeta {0}!
```    

`SayToPlanetAttrProcessor_pt.properties` for Portuguese:

```html
msg.helloplanet=Ol&aacute;, planeta {0}!
```

...etc.

And now we will have to modify the `getText()` method in our
`SayToPlanetAttrProcessor` class to make use of these messages:

```java
@Override
protected String getText(final Arguments arguments, final Element element,
  final String attributeName) {


  final Configuration configuration = arguments.getConfiguration();

  final IStandardExpressionParser parser =
      StandardExpressions.getExpressionParser(configuration);

  final String attributeValue = element.getAttributeValue(attributeName);

  final IStandardExpression expression =
      parser.parseExpression(configuration, arguments, attributeValue);

  final String planet = (String) expression.execute(configuration, arguments);

  //
  // This 'getMessage(...)' method will first try to resolve the
  // message as a 'template message' (one that is defined for a specific
  // template or templates, and that would be resolved, in a Spring MVC app,
  // by Spring's MessageSource objects).
  //
  // If not found, it will try to resolve it as a 'processor message', a type
  // of messages meant to appear in .properties files by the side of the
  // attribute processor itself (or any of its superclasses) and, if needed,
  // be packaged along with it in a .jar file for better encapsulation of UI
  // components.
  //
  final String message =
      getMessage(arguments, SAYTO_PLANET_MESSAGE, new Object[] {planet});

  return message;

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

Once you're done (or if you get stuck), you can share your results at
our [user forums](http://forum.thymeleaf.org).
