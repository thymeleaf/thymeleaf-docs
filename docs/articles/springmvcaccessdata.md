---
title: 'Spring MVC and Thymeleaf: how to access data from templates'
author: 'Rafa&#322; Borowiec &mdash; <a href="http://blog.codeleak.pl">http://blog.codeleak.pl</a>'
---


In a typical Spring MVC application, `@Controller` classes are responsible for preparing a model map with data and selecting a view to be rendered. This _model map_ allows for the complete abstraction of the view technology and, in the case of Thymeleaf, it is transformed into a `VariablesMap` object (part of the Thymeleaf _template execution context_) that makes all the defined variables available to expressions executed in templates.


Spring model attributes
-----------------------

Spring MVC calls the pieces of data that can be accessed during the execution of views _model attributes_. The equivalent term in Thymeleaf language is _context variables_.

There are several ways of adding model attributes to a view in Spring MVC. Below you will find some common cases:

Add attribute to `Model` via its `addAttribute` method:

```java
    @RequestMapping(value = "message", method = RequestMethod.GET)
    public String messages(Model model) {
        model.addAttribute("messages", messageRepository.findAll());
        return "message/list";
    }
```

Return `ModelAndView` with model attributes included:

```java
    @RequestMapping(value = "message", method = RequestMethod.GET)
    public ModelAndView messages() {
        ModelAndView mav = new ModelAndView("message/list");
        mav.addObject("messages", messageRepository.findAll());
        return mav;
    }
```

Expose common attributes via methods annotated with `@ModelAttribute`:

```java
    @ModelAttribute("messages")
    public List<Message> messages() {
        return messageRepository.findAll();
    }
```

As you may have noticed, in all the above cases the `messages` attribute is added to the model and it will be available in Thymeleaf views. 

In Thymeleaf, these model attributes (or _context variables_ in Thymeleaf jargon) can be accessed with the following syntax: `${attributeName}`, where `attributeName` in our case is `messages`. This is a [Spring EL][1] expression. In short, Spring EL (Spring Expression Language) is a language that supports querying and manipulating an object graph at runtime.

You can access model attributes in views with Thymeleaf as follows:

```html
    <tr th:each="message : ${messages}">
        <td th:text="${message.id}">1</td>
        <td><a href="#" th:text="${message.title}">Title ...</a></td>
        <td th:text="${message.text}">Text ...</td>
    </tr>
```


Request parameters
------------------

Request parameters can be easily accessed in Thymeleaf views. Request parameters are passed from the client to server like:

```html
    https://example.com/query?q=Thymeleaf+Is+Great!
```

Let's assume we have a `@Controller` that sends a redirect with a request parameter:

```java
    @Controller
    public class SomeController {
        @RequestMapping("/")
        public String redirect() {
            return "redirect:/query?q=Thymeleaf Is Great!";
        }
    }
```

In order to access the `q` parameter you can use the `param.` prefix:

```html
    <p th:text="${param.q[0]}" th:unless="${param.q == null}">Test</p>
```

Two things are important to notice in the above example: 

 - `${param.q != null}` checks if the parameter `q` is set
 - Parameters are always string arrays, as they can be multivalued (e.g. `https://example.com/query?q=Thymeleaf%20Is%20Great!&q=Really%3F`).

Another way to access request parameters is by using the special object `#httpServletRequest` that gives you direct access to the `javax.servlet.http.HttpServletRequest` object:

```html
    <p th:text="${#httpServletRequest.getParameter('q')}" th:unless="${#httpServletRequest.getParameter('q') == null}">Test</p>
```


Session attributes
------------------

In the below example we add `mySessionAttribute` to session:

```java
    @RequestMapping({"/"})
    String index(HttpSession session) {
        session.setAttribute("mySessionAttribute", "someValue");
        return "index";
    }
```

Similarly to the request parameters, session attributes can be access by using the `session.` prefix:

```html
    <div th:text="${session.mySessionAttribute}">[...]</div>
```

Or by using `#httpSession`, that gives you direct access to the `javax.servlet.http.HttpSession` object.


ServletContext attributes
-------------------------

The ServletContext attributes are shared between requests and sessions. In order to access ServletContext attributes in Thymeleaf you can use the `application.` prefix:

```html
        <table>
            <tr>
                <td>My context attribute</td>
                <!-- Retrieves the ServletContext attribute 'myContextAttribute' -->
                <td th:text="${application.myContextAttribute}">42</td>
            </tr>
            <tr>
                <td>Number of attributes</td>
                <!-- Returns the number of attributes -->
                <td th:text="${application.size()}">42</td>
            </tr>
            <tr th:each="attr : ${application.keySet()}">
                <td th:text="${attr}">javax.servlet.context.tempdir</td>
                <td th:text="${application.get(attr)}">/tmp</td>
            </tr>
        </table>
```


Spring beans
------------

Thymeleaf allows accessing beans registered at the Spring Application Context with the `@beanName` syntax, for example:

```html
    <div th:text="${@urlService.getApplicationUrl()}">...</div> 
```

In the above example, `@urlService` refers to a Spring Bean registered at your context, e.g.

```java
    @Configuration
    public class MyConfiguration {
        @Bean(name = "urlService")
        public UrlService urlService() {
            return new FixedUrlService("somedomain.com/myapp"); // some implementation
        }
    }
    
    public interface UrlService {
        String getApplicationUrl();
    }
```

This is fairly easy and useful in some scenarios.


References
----------

[Thymeleaf + Spring 3][2]
[Expression Basic Objects][3]


  [1]: http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/expressions.html
  [2]: http://www.thymeleaf.org/doc/html/Thymeleaf-Spring3.html
  [3]: http://www.thymeleaf.org/doc/html/Using-Thymeleaf.html#appendix-a-expression-basic-objects
