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
<http auto-config="true">
  <form-login login-page="/login.html" authentication-failure-url="/login-error.html" />
  <logout />
  ...
</http>
```

Now we have to match these pages inside a Spring Controller:

```java
@Controller
public class MainController {

  ...

  // Login form
  @RequestMapping("/login.html")
  public String login() {
    return "login.html";
  }

  // Login form with error
  @RequestMapping("/login-error.html")
  public String loginError(Model model) {
    model.addAttribute("loginError", true);
    return "login.html";
  }

}
```

Note that we are using the same template **login.html** for both pages,
but when there is an error, we set a boolean attribute into the model.

Our **login.html** template is as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
  <head>
    <title>Login page</title>
  </head>
  <body>
    <h1>Login page</h1>
    <p th:if="${loginError}">Wrong user or password</p>
    <form th:action="@{/j_spring_security_check}" method="post">
      <label for="j_username">Username</label>:
      <input type="text" id="j_username" name="j_username" /> <br />
      <label for="j_password">Password</label>:
      <input type="password" id="j_password" name="j_password" /> <br />
      <input type="submit" value="Log in" />
    </form>
  </body>
</html>
```

Error page
----------

We also can configure a Thymeleaf error page. In this case Spring
Security is not involved at all, we should simply modify our **web.xml**
adding error **\<error-page\>** elements like:

```xml
...
<error-page>
  <exception-type>java.lang.Throwable</exception-type>
  <location>/error.html</location>
</error-page>
<error-page>
  <error-code>500</error-code>
  <location>/error.html</location>
</error-page>
...
```

Then, we have to map the **/error.html** in our Spring Controller:

```java
@Controller
public class HomeController {

  ...

  // Error page
  @RequestMapping("/error.html")
  public String error(HttpServletRequest request, Model model) {
    model.addAttribute("errorCode", request.getAttribute("javax.servlet.error.status_code"));
    Throwable throwable = (Throwable) request.getAttribute("javax.servlet.error.exception");
    String errorMessage = null;
    if (throwable != null) {
      errorMessage = throwable.getMessage();
    }
    model.addAttribute("errorMessage", errorMessage.toString());
    return "error.html";
  }

}
```

Note that we store error code and error message into the model to show
some information in the error page.

The **error.html** template could be like:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
  <head>
    <title>Error page</title>
  </head>
  <body>
    <h1 th:text="${errorCode}">500</h1>
    <p th:text="${errorMessage}">java.lang.NullPointerException</p>
  </body>
</html>
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
<div sec:authorize="hasRole('ROLE_ADMIN')">
  This content is only shown to administrators.
</div>
<div sec:authorize="hasRole('ROLE_USER')">
  This content is only shown to users.
</div>
```

The attribute **sec:authentication** is used to print logged user name
and roles:

```html
Logged user: <span sec:authentication="name">Bob</span>
Roles: <span sec:authentication="principal.authorities">[ROLE_USER, ROLE_ADMIN]</span>
```

Download example
----------------

The full working example code used in this article is available for
download at the [project's documentation page](documentation.html).
