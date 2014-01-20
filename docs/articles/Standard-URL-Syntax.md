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
&amp;lt;a th:href=&amp;quot;@{http://www.thymeleaf/documentation.html}&amp;quot;&amp;gt;
```

They are not modified at all:

```html
&amp;lt;a href=&amp;quot;http://www.thymeleaf/documentation.html&amp;quot;&amp;gt;
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
&amp;lt;a th:href=&amp;quot;@{/order/list}&amp;quot;&amp;gt;
```

If our app is installed at `http://localhost:8080/myapp`, this URL will
output:

```html
&amp;lt;a href=&amp;quot;/myapp/order/list&amp;quot;&amp;gt;
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
&amp;lt;a th:href=&amp;quot;@{~/billing-app/showDetails.htm}&amp;quot;&amp;gt;
```

The current application's context will be ignored, therefore although
our application is deployed at `http://localhost:8080/myapp`, this URL
will output:

```html
&amp;lt;a href=&amp;quot;/billing-app/showDetails.htm&amp;quot;&amp;gt;
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
&amp;amp;lt;script th:src=&amp;quot;@{//scriptserver.example.net/myscript.js}&amp;quot;&amp;gt;...&amp;amp;lt;/script&amp;gt;
```

...which will render unmodified, as:

```html
&amp;amp;lt;script src=&amp;quot;//scriptserver.example.net/myscript.js&amp;quot;&amp;gt;...&amp;amp;lt;/script&amp;gt;
```

Adding parameters
-----------------

How do we add parameters to the URLs we create with `@{...}`
expressions? Simple:

```html
&amp;lt;a th:href=&amp;quot;@{/order/details(id=3)}&amp;quot;&amp;gt;
```

Which would output as:

```html
&amp;lt;a href=&amp;quot;/order/details?id=3&amp;quot;&amp;gt;
```

You can add several parameters, separating them with commas:

```html
&amp;lt;a th:href=&amp;quot;@{/order/details(id=3,action='show_all')}&amp;quot;&amp;gt;
```

Which would output as:

```html
&amp;lt;a href=&amp;quot;/order/details?id=3&amp;amp;action=show_all&amp;quot;&amp;gt;
```

URL fragment identifiers
------------------------

Fragment identifiers can be included in URLs, both with and without
parameters. They will always be included at the URL base, so that:

```html
&amp;lt;a th:href=&amp;quot;@{/home#all_info(action='show')}&amp;quot;&amp;gt;
```

...would output as:

```html
&amp;lt;a href=&amp;quot;/home?action=show#all_info&amp;quot;&amp;gt;
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
&amp;lt;form th:action=&amp;quot;@{/order/processOrder}&amp;quot;&amp;gt;
```

...or as a part of other expression. Here as a parameter of an
externalized/internationalized string:

```html
&amp;lt;p th:text=&amp;quot;#{orders.explanation('3', @{/order/details(id=3,action='show_all')})}&amp;quot;&amp;gt;
```

Using expressions in URLs
-------------------------

What if we needed to write an URL expression like this:

```html
&amp;lt;a th:href=&amp;quot;@{/order/details(id=3,action='show_all')}&amp;quot;&amp;gt;
```

...but neither `3` nor `'show_all'` could be literals, because we only
know their value at run time?

No problem! Every URL parameter value is in fact an expression, so you
can easily substitute your literals with any other expressions,
including i18n, conditionals...:

```html
&amp;lt;a th:href=&amp;quot;@{/order/details(id=${order.id},action=(${user.admin} ? 'show_all' : 'show_public'))}&amp;quot;&amp;gt;
```

What's more: an URL expression like:

```html
&amp;lt;a th:href=&amp;quot;@{/order/details(id=${order.id})}&amp;quot;&amp;gt;
```

...is in fact a shortcut for:

```html
&amp;lt;a th:href=&amp;quot;@{'/order/details'(id=${order.id})}&amp;quot;&amp;gt;
```

Which means that the URL base itself can be specified as an expression,
for example a variable expression:

```html
&amp;lt;a th:href=&amp;quot;@{${detailsURL}(id=${order.id})}&amp;quot;&amp;gt;
```

...or an externalized/internationalized text:

```html
&amp;lt;a th:href=&amp;quot;@{#{orders.details.localized_url}(id=${order.id})}&amp;quot;&amp;gt;
```

...even complex expressions can be used, including conditionals, for
example:

```html
&amp;lt;a th:href=&amp;quot;@{(${user.admin}? '/admin/home' : ${user.homeUrl})(id=${order.id})}&amp;quot;&amp;gt;
```

Want it cleaner? Use `th:with`:

```html
&lt;a th:with=&quot;baseUrl=(${user.admin}? '/admin/home' : ${user.homeUrl})&quot;
th:href=&quot;@{${baseUrl}(id=${order.id})}&quot;&gt;
```

...or...

```html
&amp;lt;div th:with=&amp;quot;baseUrl=(${user.admin}? '/admin/home' : ${user.homeUrl})&amp;quot;&amp;gt;
...
&amp;lt;a th:href=&amp;quot;@{${baseUrl}(id=${order.id})}&amp;quot;&amp;gt;...&amp;lt;/a&amp;gt;
...
&amp;lt;/div&amp;gt;
```
