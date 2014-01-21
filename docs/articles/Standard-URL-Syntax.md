Standard URL Syntax
===================

The Thymeleaf standard dialects —called *Standard* and *SpringStandard*—
offer a way to easily create URLs in your web application so that they
include any required *URL preparation* artifacts. This is done by means
of the so-called *“at” syntax* of the *standard expressions*: `@{...}`

Absolute URLs
-------------

Absolute URLs allow you to create links to other servers. They start by
specifying a protocol name (`http://` or `https://`)

```html
<a th:href="@{http://www.thymeleaf/documentation.html}">
```

They are not modified at all:

```html
<a href="http://www.thymeleaf/documentation.html">
```

Context-relative URLs
---------------------

The most used type of URLs are *context-relative* ones. These are URLs
which are supposed to be relative to the web application root once it is
installed on the server. For example, if we deploy a `myapp.war` file
into a Tomcat server, our application will probably be accessible as
`http://localhost:8080/myapp`, and `myapp` will be the *context name*.

Context-relative URLs start with `/`:

```html
<a th:href="@{/order/list}">
```

If our app is installed at `http://localhost:8080/myapp`, this URL will
output:

```html
<a href="/myapp/order/list">
```

### URL Rewriting

Rewriting *context-relative* URLs means to:

-   Automatically add the context name to context-relative URLs, as
    already seen.
-   Automatically detect whether the user has cookies enabled or not,
    and add the `;jsessionid=...` fragment to the URL if not —or if it
    is the first request and cookie configuration is still unknown.

All of this is automatically done when outputting this kind of URLs,
because thymeleaf will apply the standard application server's
`response.encodeURL(url)` mechanism before outputting any URL.

Server-relative URLs
--------------------

*Server-relative* URLs are very similar to *context-relative* URLs,
except they do not assume you want your URL to be linking to a resource
inside your application's context, and therefore allow you to link to a
different context in the same server:

```html
<a th:href="@{~/billing-app/showDetails.htm}">
```

The current application's context will be ignored, therefore although
our application is deployed at `http://localhost:8080/myapp`, this URL
will output:

```html
<a href="/billing-app/showDetails.htm">
```

*(Note that server-relative URLs are only available since Thymeleaf
2.0.5)*

Protocol-relative URLs
----------------------

*Protocol-relative* URLs are in fact absolute URLs which will keep the
protocol (HTTP, HTTPS) being used for displaying the current page. They
are typically used for including external resources like styles,
scripts, etc.:

```html
<script th:src="@{//scriptserver.example.net/myscript.js}">...</script>
```

...which will render unmodified, as:

```html
<script src="//scriptserver.example.net/myscript.js">...</script>
```

Adding parameters
-----------------

How do we add parameters to the URLs we create with `@{...}`
expressions? Simple:

```html
<a th:href="@{/order/details(id=3)}">
```

Which would output as:

```html
<a href="/order/details?id=3">
```

You can add several parameters, separating them with commas:

```html
<a th:href="@{/order/details(id=3,action='show_all')}">
```

Which would output as:

```html
<a href="/order/details?id=3&action=show_all">
```

URL fragment identifiers
------------------------

Fragment identifiers can be included in URLs, both with and without
parameters. They will always be included at the URL base, so that:

```html
<a th:href="@{/home#all_info(action='show')}">
```

...would output as:

```html
<a href="/home?action=show#all_info">
```

*(Note that fragment identifiers in parameterized URLs are only
supported since Thymeleaf 2.0.7)*

Only for th:href's?
-------------------

Do not think URL `@{...}` expressions are only used in `th:href`
attributes. They can, in fact, be used *anywhere* just like variable
expressions (`${...}`) or message externalization / internationalization
ones (`#{...}`).

For example, you could use them in forms...

```html
<form th:action="@{/order/processOrder}">
```

...or as a part of other expression. Here as a parameter of an
externalized/internationalized string:

```html
<p th:text="#{orders.explanation('3', @{/order/details(id=3,action='show_all')})}">
```

Using expressions in URLs
-------------------------

What if we needed to write an URL expression like this:

```html
<a th:href="@{/order/details(id=3,action='show_all')}">
```

...but neither `3` nor `'show_all'` could be literals, because we only
know their value at run time?

No problem! Every URL parameter value is in fact an expression, so you
can easily substitute your literals with any other expressions,
including i18n, conditionals...:

```html
<a th:href="@{/order/details(id=${order.id},action=(${user.admin} ? 'show_all' : 'show_public'))}">
```

What's more: an URL expression like:

```html
<a th:href="@{/order/details(id=${order.id})}">
```

...is in fact a shortcut for:

```html
<a th:href="@{'/order/details'(id=${order.id})}">
```

Which means that the URL base itself can be specified as an expression,
for example a variable expression:

```html
<a th:href="@{${detailsURL}(id=${order.id})}">
```

...or an externalized/internationalized text:

```html
<a th:href="@{#{orders.details.localized_url}(id=${order.id})}">
```

...even complex expressions can be used, including conditionals, for
example:

```html
<a th:href="@{(${user.admin}? '/admin/home' : ${user.homeUrl})(id=${order.id})}">
```

Want it cleaner? Use `th:with`:

```html
<a th:with="baseUrl=(${user.admin}? '/admin/home' : ${user.homeUrl})"
  th:href="@{${baseUrl}(id=${order.id})}">
```

...or...

```html
<div th:with="baseUrl=(${user.admin}? '/admin/home' : ${user.homeUrl})">
  ...
  <a th:href="@{${baseUrl}(id=${order.id})}">...</a>
  ...
</div>
```
