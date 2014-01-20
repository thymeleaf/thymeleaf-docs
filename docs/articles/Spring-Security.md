Thymeleaf + Spring Security integration basics
==============================================

*By José Miguel Samper \<jmiguelsamper AT users.sourceforge.net\>*

Have you switched to Thymeleaf but your login and error pages are still
using JSP? \
 In this article we will see how to configure your Spring application to
use Thymeleaf for login and error pages.

Prerequisites
-------------

We asume you are familiar with Thymeleaf and Spring Security, and you
have a working application using these technologies. If you don't know
Spring Security, you could be interested on reading the [Spring Security
Documentation](http://static.springsource.org/spring-security/site/reference.html).

Login pages
-----------

With Spring security you could specify any URL to act as a login page,
so we simply set URLs for login page and login error page as
**\<form-login\>** element attributes into the Spring-Security
configuration file (usually **applicationContext-security.xml**):

```html
&lt;http auto-config=&quot;true&quot;&gt;
&lt;form-login login-page=&quot;/login.html&quot; authentication-failure-url=&quot;/login-error.html&quot; /&gt;
&lt;logout /&gt;
...
&lt;/http&gt;
```

Now we have to match these pages inside a Spring Controller:

```java
@Controller
public class MainController {

...

// Login form
@RequestMapping(&quot;/login.html&quot;)
public String login() {
return &quot;login.html&quot;;
}

// Login form with error
@RequestMapping(&quot;/login-error.html&quot;)
public String loginError(Model model) {
model.addAttribute(&quot;loginError&quot;, true);
return &quot;login.html&quot;;
}

}
```

Note that we are using the same template **login.html** for both pages,
but when there is an error, we set a boolean attribute into the model.

Our **login.html** template is as follows:

```html
&lt;!DOCTYPE html&gt;
&lt;html xmlns=&quot;http://www.w3.org/1999/xhtml&quot; xmlns:th=&quot;http://www.thymeleaf.org&quot;&gt;
&lt;head&gt;
&lt;title&gt;Login page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Login page&lt;/h1&gt;
&lt;p th:if=&quot;${loginError}&quot;&gt;Wrong user or password&lt;/p&gt;
&lt;form th:action=&quot;@{/j_spring_security_check}&quot; method=&quot;post&quot;&gt;
&lt;label for=&quot;j_username&quot;&gt;Username&lt;/label&gt;:
&lt;input type=&quot;text&quot; id=&quot;j_username&quot; name=&quot;j_username&quot; /&gt; &lt;br /&gt;
&lt;label for=&quot;j_password&quot;&gt;Password&lt;/label&gt;:
&lt;input type=&quot;password&quot; id=&quot;j_password&quot; name=&quot;j_password&quot; /&gt; &lt;br /&gt;
&lt;input type=&quot;submit&quot; value=&quot;Log in&quot; /&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;
```

Error page
----------

We also can configure a Thymeleaf error page. In this case Spring
Security is not involved at all, we should simply modify our **web.xml**
adding error **\<error-page\>** elements like:

```xml
...
&lt;error-page&gt;
&lt;exception-type&gt;java.lang.Throwable&lt;/exception-type&gt;
&lt;location&gt;/error.html&lt;/location&gt;
&lt;/error-page&gt;
&lt;error-page&gt;
&lt;error-code&gt;500&lt;/error-code&gt;
&lt;location&gt;/error.html&lt;/location&gt;
&lt;/error-page&gt;
...
```

Then, we have to map the **/error.html** in our Spring Controller:

```java
@Controller
public class HomeController {

...

// Error page
@RequestMapping(&quot;/error.html&quot;)
public String error(HttpServletRequest request, Model model) {
model.addAttribute(&quot;errorCode&quot;, request.getAttribute(&quot;javax.servlet.error.status_code&quot;));
Throwable throwable = (Throwable) request.getAttribute(&quot;javax.servlet.error.exception&quot;);
String errorMessage = null;
if (throwable != null) {
errorMessage = throwable.getMessage();
}
model.addAttribute(&quot;errorMessage&quot;, errorMessage.toString());
return &quot;error.html&quot;;
}

}
```

Note that we store error code and error message into the model to show
some information in the error page.

The **error.html** template could be like:

```html
&lt;!DOCTYPE html&gt;
&lt;html xmlns=&quot;http://www.w3.org/1999/xhtml&quot; xmlns:th=&quot;http://www.thymeleaf.org&quot;&gt;
&lt;head&gt;
&lt;title&gt;Error page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;h1 th:text=&quot;${errorCode}&quot;&gt;500&lt;/h1&gt;
&lt;p th:text=&quot;${errorMessage}&quot;&gt;java.lang.NullPointerException&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
```

Spring security dialect
-----------------------

The [Spring Security 3 integration
module](https://github.com/thymeleaf/thymeleaf-extras-springsecurity3)
is a Thymeleaf dialect equivalent to [Spring security
taglib](http://static.springsource.org/spring-security/site/docs/3.1.x/reference/taglibs.html).

We use this dialect in the example in order to print the logged user
credentials and to show different content to different roles.

The attribute **sec:authorize** renders its content when the attribute
expression is evaluated to **true**:

```html
&lt;div sec:authorize=&quot;hasRole('ROLE_ADMIN')&quot;&gt;
This content is only shown to administrators.
&lt;/div&gt;
&lt;div sec:authorize=&quot;hasRole('ROLE_USER')&quot;&gt;
This content is only shown to users.
&lt;/div&gt;
```

The attribute **sec:authentication** is used to print logged user name
and roles:

```html
Logged user: <span sec:authentication="name">Bob</span>
Roles: &lt;span sec:authentication=&quot;principal.authorities&quot;&gt;[ROLE_USER, ROLE_ADMIN]&lt;/span&gt;
```

Download example
----------------

The full working example code used in this article is available for
download at the [project's documentation page](documentation.html).
