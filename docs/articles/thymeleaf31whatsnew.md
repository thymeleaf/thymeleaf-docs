---
title: "Thymeleaf 3.1: What's new and how to migrate"
---

Please note **Thymeleaf 3.1** is not Generally Available yet. It's current status is **release candidate**.

Latest verion is Thymeleaf `3.1.0.RC2`.

## What's new

### Support for Servlet API 5.0 and the `jakarta.*` class namespace

Thymeleaf 3.1 adds support for the new `jakarta.*` class namespace in the Servlet API since version 5.0, without removing support for
the `javax.*` classes in previous versions.

### Support for Spring 6.0

Thymeleaf 3.1 adds a new `thymeleaf-spring6` core library for integration with Spring Framework 6.0.

Support for versions of Spring older than Spring 5.0 has been removed.

### Support for Spring Security 6.0

Thymeleaf 3.1 adds a new `thymeleaf-extras-springsecurity6` core library for integration with Spring Security 6.0.

Support for versions of Spring Security older than Spring Security 5.0 has been removed.

### Core support for the `java.time` package

The `thymeleaf-extras-java8time` extras module has been integrated into the Thymeleaf core: the `#temporals` expression utility object is now always available.

### Java compatibility

JDK 8 is now the minimum generally required version.

JDK 17 is the minimum required version for the `thymeleaf-spring6` and `thymeleaf-extras-springsecurity6` core libraries.

### Removal of web-API based expression utility objects

The `#request`, `#response`, `#session`, and `#servletContext` are no longer available to expressions in Thymeleaf 3.1.

### Tighter restrictions on the use of classes in expressions

Thymeleaf 3.1 establishes a general restriction on the use of classes from core packages: `java.*`, `javax.*`, `jakarta.*`, `jdk.*`, `org.ietf.jgss.*`, `org.omg.*`, `org.w3c.dom.*`, `org.xml.sax.*`, `com.sun.*` and `sun.*`.

Method/constructor calling is now forbidden for classes in these packages, as well as static references.

As an exception to this restriction, some classes in these packages are always _allowed_:

* Basic `java.lang.*` and `java.math.*` classes: `java.lang.Boolean`, `java.lang.Byte`, `java.lang.Character`, `java.lang.Double`, `java.lang.Enum`, `java.lang.Float`, `java.lang.Integer`, `java.lang.Long`, `java.lang.Math`, `java.lang.Number`, `java.lang.Short`, `java.lang.String`, `java.math.BigDecimal`, `java.math.BigInteger`, `java.math.RoundingMode`.

* Collection classes and interfaces: `java.util.Collection`, `java.util.Enumeration`, `java.util.Iterable`, `java.util.Iterator`, `java.util.List`, `java.util.ArrayList`, `java.util.LinkedList`, `java.util.Set`, `java.util.HashSet`, `java.util.LinkedHashSet`, `java.util.Map`, `java.util.Map.Entry`, `java.util.HashMap`, `java.util.LinkedHashMap`. Note: interface methods (e.g. `Map#get(key)`) are commonly allowed for any implementation, but the specific implementations listed here can additionally be constructed and statically referenced.

* Other commonly used classes in `java.util.*`: `java.util.Properties`, `java.util.Optional`, `java.util.stream.Stream`, `java.util.Locale`, `java.util.Date`, `java.util.Calendar`.

### Deprecation of some artifacts and removal of previously deprecated ones

Some artifacts have been deprecated in Thymeleaf 3.1.

* Deprecated `th:include` in favour of `th:insert`. Note that `th:insert` has sligthly different semantics to `th:include`.
* Deprecated unwrapped syntax for fragment insertion: now `~{template :: fragment}` should always be used instead of simply `template :: fragment`.

Also, artifacts previously deprecated in 3.0 have been removed:

* Removed `th:substituteby`, deprecated previously in favour of `th:replace`.
* Removed deprecated use of `execInfo` as a context variable (`${execInfo}`), available since 3.0 as an expression utility object (`${#execInfo}`).

### Other minor improvements

* General update of dependency versions.
* Allow `#temporals` expression utility object to format temporals in non-default locales.
* Support iterating (e.g. `th:each`) directly on java streams (`java.util.stream.Stream`).
* Allow `SpringTemplateEngine` instances to be configured a custom (even non-Spring) message resolver.

### (For developers) Total overhaul of the project source repository structure

Thymeleaf 3.1 includes a total overhaul of the (previously multiple) source repositories and big improvements in how example applications are dealt with from
a development perspective:

* Integration of most previous Thymeleaf code repositories into the [`thymeleaf` GitHub repository](https://github.com/thymeleaf/thymeleaf), which now contains:
  * The new Thymeleaf BOM (`thymeleaf-parent`) integrating and unifying all thymeleaf dependencies and build configuration.
  * All Thymeleaf core libraries, including Spring and Spring Security integrations.
  * All Thymeleaf testing libraries and their integrations.
  * All Thymeleaf test repositories.
  * All Thymeleaf official example applications, including core, Spring, Spring Security and Spring Boot based example apps.
* Creation of a large Maven multiproject configuration for building the complete tree of Thymeleaf modules.
* Configuration of example applications in order to allow non-Spring Boot based web apps to be executed from the Maven command line.
* Creation of more complete distribution packages in `.zip` form, now including not only libraries but also example applications both in binary and (buildable) source form.
* Migration of all the testing infrastructure to JUnit 5.


## Migrating to Thymeleaf 3.1.0

### JDK version

Thymeleaf 3.1 moves its minimum compatibility level to JDK 8, but the `thymeleaf-spring6` and `thymeleaf-extras-springsecurity6` require JDK 17 because this is the version of the JDK
required by Spring 6.0.


### Web related structures

_(NOTE: In Spring-based web applications, what is explained here will be hidden from the developers and therefore will not affect their apps. Spring users can safely skip this section.)_

Thymeleaf 3.1 introduces three interfaces that abstract the specific details of the web API being used (e.g. `javax.*` or `jakarta.*`):

  * `org.thymeleaf.web.IWebApplication`: Represents the web application and the attributes associated to it.
  * `org.thymeleaf.web.IWebExchange`: Represents the handling of a web request. Contains the request, the session (if any) and any attributes associated by the application to this specific exchange.
  * `org.thymeleaf.web.IWebRequest`: Representes a web request: URL path, parameters, headers and cookies.
  * `org.thymeleaf.web.IWebSession`: Representes a web session if it exists, containing any associated attributes.

Even if `IWebApplication` would more or less correspond to the Servlet API's `ServletContext`, there would not be an exact correspondence between the above and other structures in 
the Servlet API. For instance, part of the data offered by Servlet API's `HttpServletRequest` (like e.g. URL and parameters) would be the contained in an `IWebRequest` object, whereas
other parts (like e.g. request attributes) would be contained in the `IWebExchange`.

Thymeleaf provides implementations for all these interfaces both for `javax.*` and for `jakarta.*` environments.

Typically, a web application will instantiate a specific implementation of `IWebApplication` at initialization time, like:

```java
final JakartaServletWebApplication application =
    JakartaServletWebApplication.buildApplication(servletContext);
```

And then for each incoming request this specific application implementation will offer a way to create `IWebExchange` objects that model the handling of such request, typically some
kind of `buildExchange(...)` method:

```java
final HttpServletRequest request = ...;
final HttpServletResponse response = ...;
...
final IWebExchange webExchange = this.application.buildExchange(request, response);
final IWebRequest webRequest = webExchange.getRequest();
...
final String path = webRequest.getPathWithinApplication();
```

These interfaces ofer methods for reading resources, storing and reading data, transforming URLs, etc. All the most typical pieces of information needed by web applications. Also,
specific implementations of these interfaces will typically offer a way to obtain the native objects of the specific web API that they are using underneath (e.g. obtain 
the underlying `HttpServletRequest` from the `IWebExchange` object)).

Also, note that your application will be able to keep using the classes specific to your web API (e.g. `jakarta.*` classes). It's only when directly interacting with Thymeleaf's APIs
that the use of these abstractions will be needed.


### Spring 6.0 and Spring Security 6.0 (and Spring Boot 3.0)

Thymeleaf's new integrations with Spring 6.0 and Spring Security 6.0 are configured in an equivalent way as they were (and still are) for Spring 5.x.

No changes should be needed except for replacing the previous `thymeleaf-spring5` or `thymeleaf-extras-springsecurity5` dependencies with the 
new `thymeleaf-spring6` or `thymeleaf-extras-springsecurity6` ones.

In the case of Spring Boot bases applications, no changes are needed. The new Spring Boot 3.0 will already configure and use Thymeleaf 3.1 when adding
the Thymeleaf Spring Boot starter.


### Expression restrictions

In order to improve the security of your templates, Thymeleaf 3.1 has adopted a series of restrictions on variable expressions (`${...}` and `*{...}`) that might affect 
your existing code.

As explained in the _"What's new"_ section, expression utility objects `#request`, `#response`, `#session` and `#servletContext` are no longer available from
expressions in templates.

The recommended alternative would be to add to your model, at the controller level, the specific pieces of information your templates need from these objects. This can
be done via `model#addAttribute(...)` in the controller code, or via `@ModelAttribute` or even `@ControllerAdvice` annotations.

```java
@ModelAttribute("contextPath")
public String contextPath(final HttpServletRequest request) {
    return request.getContextPath();
}
```

But besides this, as also detailed in the _"What's new"_ section, a hard usage restiction has been established on classes belonging to the JDK and Jakarta EE core
classes, with some exceptions. Objects of the forbidden classes will not be usable in variable expressions since Thymeleaf 3.1.

If some of your templates absolutely need to execute expressions on objects of the forbidden classes, you can create a wrapper class (in your own application's package)
that delegates its methods to the original object, and that will be usable from variable expressions.


### Deprecation of th:include

If your templates make use of the `th:include` attribute, please note that this will still be allowed in Thymeleaf 3.1 but will be removed in a future version of the library. It
is strongly recommended that you replace your uses of `th:include` with `th:insert`, but noting that they do not work in exactly the same way.

Whereas `th:include` only inserted _the contents_ of a fragment, making this:

```html
<div id="main" th:include="~{::frag}">...</div>
...
<p th:fragment="frag" class="content">
    something
</p>
```

...result in this:

```html
<div id="main">
      something
</div>
```

Using `th:insert`, the whole fragment _including the tag it is defined on_ will be inserted, making this:

```html
<div id="main" th:insert="~{::frag}">...</div>
...
<p th:fragment="frag" class="content">
    something
</p>
```

...result in this:

```html
<div id="main">
  <p class="content">
      something
  </p>
</div>
```

If you specifically needed to achieve the same result as with `th:include`, you will need to combine `th:insert` and `th:remove` in a way similar to:

```html
<div id="main" th:insert="~{::frag}">...</div>
...
<p th:fragment="frag" th:remove="tag" class="content">
    something
</p>
```

...which will result in:

```html
<div id="main">
      something
</div>
```

Remember also that fragments can also be defined using the `<th:block>` tag which will always disappear after evaluation, providing higher flexibility:

```html
<div id="main" th:insert="~{::frag}">...</div>
...
<th:block th:fragment="frag">
    something
</th:block>
```

The result would be:

```html
<div id="main">
      something
</div>
```


### Deprecation of unwrapped fragment expressions

Fragment expressions in Thymeleaf are expressed like `~{...}`, and they can be used in many kinds of attributes and expressions, though they typically appear as
the values for `th:insert` and `th:replace` attributes.

Before Thymeleaf 3.1, attributes such `th:insert` or `th:replace` (or the deprecated `th:include`) allowed the specification of fragment expressions without the
`~{...}` _envelope_:

```html
<div id="top" th:insert="common :: header">...</div>
```

But since Thymeleaf 3.1 this syntax, though it will still work, will be considered _deprecated_ and scheduled to be removed in a future version. The above
should now be expressed like:

```html
<div id="top" th:insert="~{common :: header}">...</div>
```

