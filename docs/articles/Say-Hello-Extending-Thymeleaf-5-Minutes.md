Say Hello! Extending Thymeleaf in 5 minutes
===========================================

Extending Thymeleaf is easy: you only have to create a dialect and add
it to your template engine. Let's see how.

*(All the code seen here comes from a working application. You can
download the source code of such application from the [documentation
page](documentation.html))*

Dialects
--------

Thymeleaf Dialects are sets of features you can use in your templates.
These features include:

-   **Processing logic** specified via *processors* that apply on
    specific DOM nodes.
-   **DOCTYPE translations** which allow the automatic conversion of the
    template's DOCTYPE declaration into a target one, thus allowing
    validation both before processing --against a DTD including the
    dialect's tags and attributes-- and after processing --against a DTD
    not including these, like e.g. a standard XHTML DTD.
-   **DOCTYPE resolution entries** which are fed into Thymeleaf's
    template parsers and allow the resolution of DTD files for the
    validation of templates (if required) in an offline manner, this is,
    without the need to perform remote HTTP connections and/or download
    anything.

All of these features are optional, and a dialect can specify only some
of them. For example, your dialect might not need to specify any DOCTYPE
translations because you do not plan to allow the ability to validate
templates against a DTD including your dialect's features.

If you've seen fragments of code written in the *Standard Dialects*, you
should have noticed that the processable attributes start with `th:`.
That "`th`" is called the **dialect prefix**, and it means that all tags
and attributes processed by that dialect will start with such prefix.

It is important also to note that **a Template Engine can be set several
dialects at a time**, thus allowing the processing of templates
including features from all of the specified dialects (think of dialects
as a sort of *JSP taglibs* in steroids). What's more, some of these
dialects can *share prefix*, effectively acting as an aggregate dialect.

The simplest dialect ever: Say Hello!
-------------------------------------

Let's create a dialect for one of our applications. This will be a
Spring MVC application, so we will be already using the SpringStandard
dialect (have a look at the [Thymeleaf + Spring 3
tutorial](documentation.html) for more details). But we want to add a
new attribute that allows us to say hello to whoever we want, like this:

```html
<p hello:sayto="World">Hi ya!</p>
```

### The processor

First, we will have to create the attribute processor that will take
care of displaying our salutation message.

All attribute processors implement the
`org.thymeleaf.processor.IProcessor` interface —which marks them as
*processors*— and specify a *matcher* (`IProcessor.getMatcher()`) that
implements the `org.thymeleaf.processor.IAttributeNameProcessorMatcher`
interface —which specifically marks them as *attribute processors* and
allows the use of several engine optimizations—. However, several
convenience abstract implementations exist that not only implement the
right interfaces, but also ease the development of each type of
processor.

Specifically, the `AbstractTextChildModifierAttrProcessor` class
specializes in attributes that substitute the body of the tag they sit
on by a text (which is exactly what we want). So we will extend this
class for our attribute processor:

```java
public class SayToAttrProcessor
extends AbstractTextChildModifierAttrProcessor {


public SayToAttrProcessor() {
// Only execute this processor for 'sayto' attributes.
super("sayto");
}


public int getPrecedence() {
// A value of 10000 is higher than any attribute in the
// SpringStandard dialect. So this attribute will execute
// after all other attributes from that dialect, if in the
// same tag.
return 10000;
}


//
// Our processor is a subclass of the convenience abstract implementation
// 'AbstractTextChildModifierAttrProcessor', which takes care of the
// DOM modifying stuff and allows us just to implement this 'getText(...)'
// method to compute the text to be set as tag body.
//
@Override
protected String getText(final Arguments arguments, final Element element,
final String attributeName) {
return "Hello, "  + element.getAttributeValue(attributeName) + "!";
}


}
```

### The dialect class

Creating our processor was very easy, but now we will need to create the
*dialect class*, which will be in charge of telling Thymeleaf that our
processor is available.

We could make our dialect implement the `org.thymeleaf.dialect.IDialect`
interface (which is the one every dialect should implement), but instead
we will extend a convenience abstract class called `AbstractDialect`
that already implements all methods from that interface, returning empty
values for all of them (so that we only have to override the ones we
require).

```java
public class HelloDialect extends AbstractDialect {

public HelloDialect() {
super();
}

//
// All of this dialect's attributes and/or tags
// will start with 'hello:'
//
public String getPrefix() {
return "hello";
}


//
// The processors.
//
@Override
public Set<IProcessor> getProcessors() {
final Set<IProcessor> processors = new HashSet<IProcessor>();
processors.add(new SayToAttrProcessor());
return processors;
}

}
```

As you can see, we didn't need to set any *DOCTYPE resolution entries*
or *translations*. We didn't need any of those because our dialect is
meant to be used together with the SpringStandard dialect, which already
includes a useful set of all those things (although we could have
defined them here also if for some reason we wanted to be more
exhaustive). All our dialect does is specify a prefix (`hello`) and our
*"sayto"* attribute processor.

Using the hello dialect
-----------------------

Using our new dialect is very easy. This being a Spring MVC application,
we just have to set it at the *additionalDialects* property of the
Template Engine bean, so that it is added to the default
*SpringStandard* dialect:

```html
<bean id="templateEngine"
class="org.thymeleaf.spring3.SpringTemplateEngine">
<property name="templateResolver" ref="templateResolver" />
<property name="additionalDialects">
<set>
<bean class="thymeleafexamples.sayhello.dialect.HelloDialect"/>
</set>
</property>
</bean>
```

And our new attribute would work seamlessly:

```html
<p>Hello World!</p>
```

Want to know more?
------------------

Then have a look at [*"Say Hello Again! Extending Thymeleaf even more in
another 5
minutes"*](sayhelloagainextendingthymeleafevenmore5minutes.html).
