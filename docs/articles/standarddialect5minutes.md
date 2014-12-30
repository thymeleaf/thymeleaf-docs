---
title: Getting started with the Standard dialects in 5 minutes
---


Getting started with the Standard dialects in 5 minutes
=======================================================

This guide will take you through some of the most important concepts you
need to know to understand a Thymeleaf template written in the
*Standard* or *SpringStandard* dialects. It is not a substitute for the
tutorials -- which are much more comprehensive -- but it will teach you
enough for getting the feel of the technology.

Standard dialects?
------------------

Thymeleaf is very, very extensible, and it allows you to define your own
sets of template attributes (or even tags) with the names you want,
evaluating the expressions you want in the syntax you want and applying
the logic you want. It's more like a *template engine framework*.

Out of the box, nevertheless, it comes with something called *the
standard dialects* (named *Standard* and *SpringStandard*) that define a
set of features which should be more than enough for most scenarios. You
can identify when these standard dialects are being used in a template
because it will contain attributes starting with the `th` prefix, like
`<span th:text="...">`.

Note that the *Standard* and the *SpringStandard* dialects are almost
identical, except that *SpringStandard* includes specific features for
integrating into Spring MVC applications (like, for example, using
*Spring Expression Language* for expression evaluation instead of
*OGNL*).

Also note we usually refer to features in the Standard dialects when we
talk about Thymeleaf without being more specific.

Standard Expression syntax
--------------------------

Most Thymeleaf attributes allow their values to be set as or containing
*expressions*, which we will call *Standard Expressions* because of the
dialects they are used in. These can be of four types:

-   Variable expressions
-   Selection or *asterisk* expressions
-   Text externalization or *internationalization* expressions
-   URL expressions

### Variable expressions

Variable expressions are OGNL expressions ---or Spring EL if you're using
*SpringStandard*--- executed on the map of context variables ---also called
*model attributes* in Spring jargon. They look like this:

```html
    ${session.user.name}
```

And you will find them as attribute values or as a part of them,
depending on the attribute:

```html
<span th:text="${book.author.name}">
```

```html
<li th:each="book : ${books}">
```

### Selection (asterisk) expressions

Selection expressions are just like variable expressions, except they
will be executed on a previously selected object instead of the whole
context variables map. They look like this:

```html
    *{customer.name}
```

The object they act on is specified by a `th:object` attribute:

```html
<div th:object="${book}">
  ...
  <span th:text="*{title}">...</span>
  ...
</div>
```

### Text externalization expressions

Text externalization (often called *internationalization*) allows us to
retrieve locale-specific messages from external sources (`.properties`
files), referencing them by a key and (optionally) applying a set of
parameters.

```html
    #{main.title}
```

```html
    #{message.entrycreated(${entryId})}
```

You can find them in templates like:

```html
<table>
  ...
  <th th:text="#{header.address.city}">...</th>
  <th th:text="#{header.address.country}">...</th>
  ...
</table>
```

### URL expressions

URL expressions are meant to add useful context and session info to the
URLs, a process usually called *URL rewriting*.

```html
    @{/order/list}
```

URLs can also take parameters:

```html
    @{/order/details(id=${orderId})}
```

And be relative (in which case no application context will be added to
the URL):

```html
    @{../documents/report}
```

Let's see these expressions in context:

```html
<form th:action="@{/createOrder}">
```

```html
<a href="main.html" th:href="@{/main}">
```

From this last example, see how Thymleaf allows us to set an `href`
value for static prototyping, letting our templates link to each other
nicely when directly open in a browser, and at the same time with
`th:href` we can specify the URL that will be set as `href` when
Thymeleaf really executes the template.

### Literals and operations

A good bunch of types of literals and operations are available:

-   Literals:
    -   Text literals: `'one text'`, `'Another one!'`,...
    -   Number literals: `0`, `34`, `3.0`, `12.3`,...
    -   Boolean literals: `true`, `false`
    -   Null literal: `null`
    -   Literal tokens: `one`, `sometext`, `main`,...

-   Text operations:
    -   String concatenation: `+`
    -   Literal substitutions: `|The name is ${name}|`

-   Arithmetic operations:
    -   Binary operators: `+`, `-`, `*`, `/`, `%`
    -   Minus sign (unary operator): `-`

-   Boolean operations:
    -   Binary operators: `and`, `or`
    -   Boolean negation (unary operator): `!`, `not`

-   Comparisons and equality:
    -   Comparators: `>`, `<`, `>=`, `<=` (`gt`, `lt`, `ge`, `le`)
    -   Equality operators: `==`, `!=` (`eq`, `ne`)

-   Conditional operators:
    -   If-then: `(if) ? (then)`
    -   If-then-else: `(if) ? (then) : (else)`
    -   Default: `(value) ?: (defaultvalue)`

### Expression preprocessing

One last thing to know about expressions is there is something called
*expression preprocessing*, specified between `__`, which looks like
this:

```html
    #{selection.__${sel.code}__}
```

What we are seeing there is a variable expression (`${sel.code}`) that
will be executed first and which result -- let's say, "`ALL`" -- will be
used as a part of the real expression to be executed afterwards, in this
case an internationalization one (which would look for the message with
key `selection.ALL`).

Some basic attributes
---------------------

Let's have a look at a couple of the most basic attributes in the
Standard Dialect. Starting with `th:text`, which just replaces the body
of a tag (notice again the prototyping abilities here):

```html
<p th:text="#{msg.welcome}">Welcome everyone!</p>
```

Now `th:each`, which repeats the element it's in as many times as
specified by the array or list returned by its expression, creating also
an inner variable for the iteration element with a syntax equivalent to
that of a Java *foreach* expression:

```html
<li th:each="book : ${books}" th:text="${book.title}">En las Orillas del Sar</li>
```

Lastly, Thymeleaf includes lots of `th` attributes for specific XHTML
and HTML5 attributes which just evaluate their expressions and set the
value of these attributes to their result. Their names mimic those of
the attributes which values they set:

```html
<form th:action="@{/createOrder}">
```

```html
<input type="button" th:value="#{form.submit}" />
```

```html
<a th:href="@{/admin/users}">
```

Want to know more?
------------------

Then the [*"Using Thymeleaf"*](/documentation.html) tutorial is what
you're looking for!
