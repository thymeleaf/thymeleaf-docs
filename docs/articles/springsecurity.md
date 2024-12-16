---
title: Thymeleaf + Spring Security integration basics
author: 'Jos&eacute; Miguel Samper \<jmiguelsamper AT users.sourceforge.net\>'
---

Have you switched to Thymeleaf but your login and error pages are still
using JSP?  In this article we will see how to configure your Spring application
to use Thymeleaf for login and error pages.

All the code seen here comes from a working application. You can view or
download the source code from [its GitHub repo](https://github.com/thymeleaf/thymeleaf/tree/3.1-master/examples/springsecurity6/thymeleaf-examples-springsecurity6-websecurity).

**Note** that the Thymeleaf integration packages for Spring Security support both
Spring MVC and Spring WebFlux applications since Spring Security 5, but this
article will focus on a Spring MVC configuration.


Prerequisites
-------------

We assume you are familiar with Thymeleaf and Spring Security, and you
have a working application using these technologies. If you don't know
Spring Security, you could be interested on reading the [Spring Security
Documentation](http://static.springsource.org/spring-security/site/reference.html).


Login pages
-----------

With Spring Security you could specify any URL to act as a login page,
just like:

```java
@Override
protected void configure(final HttpSecurity http) throws Exception {
    http
        .formLogin()
        .loginPage("/login.html")
        .failureUrl("/login-error.html")
      .and()
        .logout()
        .logoutSuccessUrl("/index.html");
}
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
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <title>Login page</title>
  </head>
  <body>
    <h1>Login page</h1>
    <p th:if="${loginError}" class="error">Wrong user or password</p>
    <form th:action="@{/login.html}" method="post">
      <label for="username">Username</label>:
      <input type="text" id="username" name="username" autofocus="autofocus" /> <br />
      <label for="password">Password</label>:
      <input type="password" id="password" name="password" /> <br />
      <input type="submit" value="Log in" />
    </form>
  </body>
</html>
```


Error page
----------

We can also configure an error page based on Thymeleaf. In this case Spring
Security is not involved at all, we should simply add an
[ExceptionHandler](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc)
to our Spring configuration like:


```java
@ControllerAdvice
public class ErrorController {

    private static Logger logger = LoggerFactory.getLogger(ErrorController.class);

    @ExceptionHandler(Throwable.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String exception(final Throwable throwable, final Model model) {
        logger.error("Exception during execution of SpringSecurity application", throwable);
        String errorMessage = (throwable != null ? throwable.getMessage() : "Unknown error");
        model.addAttribute("errorMessage", errorMessage);
        return "error";
    }

}
```

The **error.html** template could be like:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Error page</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="css/main.css" th:href="@{/css/main.css}" />
    </head>
    <body th:with="httpStatus=${T(org.springframework.http.HttpStatus).valueOf(#response.status)}">
        <h1 th:text="|${httpStatus} - ${httpStatus.reasonPhrase}|">404</h1>
        <p th:utext="${errorMessage}">Error java.lang.NullPointerException</p>
        <a href="index.html" th:href="@{/index.html}">Back to Home Page</a>
    </body>
</html>
```

Note how we are using Spring's `HttpStatus` enum in order to obtain detailed information about the
response status that has been set (which in this case will always be `500`, but this allows us
to use this `error.html` in other error reporting scenarios).


Spring Security Dialect
-----------------------

In Spring MVC environments, the [Spring Security integration
module](https://github.com/thymeleaf/thymeleaf-extras-springsecurity)
works as a replacement of the [Spring security
taglib](http://docs.spring.io/spring-security/site/docs/4.2.x/reference/html/taglibs.html).

We use this dialect in the example in order to print the logged user
credentials and to show different content to different roles.

The **sec:authorize** attribute renders its content when the attribute
expression is evaluated to **true**:

```html
<div sec:authorize="isAuthenticated()">
  This content is only shown to authenticated users.
</div>
<div sec:authorize="hasRole('ROLE_ADMIN')">
  This content is only shown to administrators.
</div>
<div sec:authorize="hasRole('ROLE_USER')">
  This content is only shown to users.
</div>
```

The **sec:authentication** attribute is used to print logged user name
and roles:

```html
Logged user: <span sec:authentication="name">Bob</span>
Roles: <span sec:authentication="authorities">[ROLE_USER, ROLE_ADMIN]</span>
```
