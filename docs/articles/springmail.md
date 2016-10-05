---
title: Rich HTML email in Spring with Thymeleaf
author: 'Jos&eacute; Miguel Samper \<jmiguelsamper AT users.sourceforge.net\>'
---

**Note**: this article refers to an older version of Thymeleaf (Thymeleaf 2.1).

In this article we will show how to use Thymeleaf templates for
composing email messages of several kinds, and we will integrate this
with Spring's email utilities in order to configure a simple but
powerful email system.

Note that, although this article ---and the corresponding example app---
uses the Spring Framework, Thymeleaf can also be used for processing
email templates in an application without Spring.


Prerequisites
-------------

This article assumes you are familiar with both Thymeleaf and Spring 4.
We will not dive into Spring Mail details, for further information
please take a look at the [Email chapter at the Spring
Documentation](http://docs.spring.io/spring/docs/current/spring-framework-reference/htmlsingle/#mail).


Example application
-------------------

All the code in this article comes from a working example application.  You can
view or download the source from [its GitHub repo](https://github.com/thymeleaf/thymeleafexamples-springmail).
Downloading this application, executing it and exploring its source code is
highly recommended *(note that you will have to configure your SMTP user name
and password at `configuration.properties`)*.


Sending email with Spring
-------------------------

First, you need to configure a **Mail Sender** object in your Spring
configuration, as in the following code (your specific configuration
needs might differ):

```java
@Bean
public JavaMailSender mailSender() throws IOException {
    Properties properties = configProperties();
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost(properties.getProperty("mail.server.host"));
    mailSender.setPort(Integer.parseInt(properties.getProperty("mail.server.port")));
    mailSender.setProtocol(properties.getProperty("mail.server.protocol"));
    mailSender.setUsername(properties.getProperty("mail.server.username"));
    mailSender.setPassword(properties.getProperty("mail.server.password"));
    mailSender.setJavaMailProperties(javaMailProperties());
    return mailSender;
}

private Properties configProperties() throws IOException {
    Properties properties = new Properties();
    properties.load(new ClassPathResource("configuration.properties").getInputStream());
    return properties;
}

private Properties javaMailProperties() throws IOException {
    Properties properties = new Properties();
    properties.load(new ClassPathResource("javamail.properties").getInputStream());
    return properties;
}
```

Note that the previous code is getting the configuration from the properties
files `configuration.properties` and `javamail.properties` on your classpath.

Spring provides a class called `MimeMessageHelper` to ease the creation
of email messages. Let's see how to use it together with our
`mailSender`.

```java
final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
final MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
message.setFrom("sender@example.com");
message.setTo("recipient@example.com");
message.setSubject("This is the message subject");
message.setText("This is the message body");
this.mailSender.send(mimeMessage);
```


Thymeleaf HTML email templates
------------------------------

Using Thymeleaf for processing our email templates would allow us to use
some interesting features:

-   **Expressions** in Spring EL.
-   Flow control: **iterations**, **conditionals**, ...
-   **Utility functions**: date/number formatting, dealing with lists,
    arrays...
-   Easy **i18n**, integrated with our application's Spring
    internationalization infrastructure.
-   **Natural templating**: our email templates can be static
    prototypes, written by UI designers.
-   etc...

Also, given the fact that Thymeleaf has no dependencies on the servlet
API, there would be **no need at all to create or send this HTML email
from a web application**. The techniques explained here could be used
with little or no change in a standalone application with no web UI.

### Our goals

Our example application will be sending four types of emails:

1.  Simple HTML (with internationalized greeting).
2.  HTML text with an attachment.
3.  HTML text with an inline image.
4.  HTML text edited by the user.

### Spring configuration

In order to process our templates, we will need to configure our
`TemplateEngine` in our Spring configuration:

```java
/**
 * THYMELEAF: View Resolver - implementation of Spring's ViewResolver interface.
 */
@Bean
public ViewResolver viewResolver() {
    ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
    viewResolver.setTemplateEngine(templateEngine());
    return viewResolver;
}

/**
 * THYMELEAF: Template Engine (Spring4-specific version).
 */
@Bean
public SpringTemplateEngine templateEngine() {
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    templateEngine.addTemplateResolver(emailTemplateResolver());
    templateEngine.addTemplateResolver(webTemplateResolver());
    return templateEngine;
}

/**
 * THYMELEAF: Template Resolver for email templates.
 */
private TemplateResolver emailTemplateResolver() {
    TemplateResolver templateResolver = new ClassLoaderTemplateResolver();
    templateResolver.setPrefix("/mail/");
    templateResolver.setTemplateMode("HTML5");
    templateResolver.setOrder(1);
    return templateResolver;
}

/**
 * THYMELEAF: Template Resolver for webapp pages.
 */
private TemplateResolver webTemplateResolver() {
    TemplateResolver templateResolver = new ServletContextTemplateResolver();
    templateResolver.setPrefix("/WEB-INF/templates/");
    templateResolver.setTemplateMode("HTML5");
    templateResolver.setOrder(2);
    return templateResolver;
}
```

Note that we have configured two *template resolvers* for our engine:
one for the email templates ---which come from our resources directory and
therefore are loaded by a `ClassLoaderTemplateResolver`--- and another one
for the web templates that support the example application itself ---which
loads its templates from the *servlet context*, as most Spring web
applications do.

Of course, if we were creating a non-web application, we would not need
either the `webTemplateResolver` or the `viewResolver` beans at all.

### Executing the Template Engine

At some point in our code, we will need to execute our template engine
in order to create the text of our messages. We have chosen to do this
in an `EmailService` class, so that it stays clear that we consider this
a responsibility of our *business layer* (and not the *web layer*).

As usual in Thymeleaf, before executing we will need to populate a
*context* containing all the variables we want to use during template
execution. Given the fact that our email processing is not
web-dependent, an instance of `Context` will do:

```java
final Context ctx = new Context(locale);
ctx.setVariable("name", recipientName);
ctx.setVariable("subscriptionDate", new Date());
ctx.setVariable("hobbies", Arrays.asList("Cinema", "Sports", "Music"));
ctx.setVariable("imageResourceName", imageResourceName); // so that we can reference it from HTML

final String htmlContent = this.templateEngine.process("email-inlineimage.html", ctx);
```

Our `email-inlineimage.html` is the template file we will use for
sending emails with an inlined image, and it looks like:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <title th:remove="all">Template for HTML email with inline image</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <p th:text="#{greeting(${name})}">
      Hello, Peter Static!
    </p>
    <p th:if="${name.length() > 10}">
      Wow! You've got a long name (more than 10 chars)!
    </p>
    <p>
      You have been successfully subscribed to the <b>Fake newsletter</b> on
      <span th:text="${#dates.format(subscriptionDate)}">28-12-2012</span>
    </p>
    <p>Your hobbies are:</p>
    <ul th:remove="all-but-first">
      <li th:each="hobby : ${hobbies}" th:text="${hobby}">Reading</li>
      <li>Writing</li>
      <li>Bowling</li>
    </ul>
    <p>
      You can find <b>your inlined image</b> just below this text.
    </p>
    <p>
      <img src="sample.png" th:src="'cid:' + ${imageResourceName}" />
    </p>
    <p>
      Regards, <br />
      <em>The Thymeleaf Team</em>
    </p>
  </body>
</html>
```

Let's remark some points:

-   The former template is fully WYSIWYG; you can check how it looks
    just by opening it with your browser. That's much better than
    sending an email to see the result, isn't it?

![Image inlined in email](images/springmail/inline.png)

-   We can use all Thymeleaf features. Here for example we have used
    i18n with a parameterized `#{...}` expression, `th:each` to iterate
    over a list, `#dates` to format a date...
-   The `img` element has a hardcoded `src` value ---nice for
    prototyping---, which will be substituted at runtime by something like
    `cid:image.jpg` matching the attached image filename.


Putting it all together
-----------------------

### The service class

Finally, let's see how the method executing this email template at our
`EmailService` service class would look like:

```java
public void sendMailWithInline(
  final String recipientName, final String recipientEmail, final String imageResourceName,
  final byte[] imageBytes, final String imageContentType, final Locale locale)
  throws MessagingException {

  // Prepare the evaluation context
  final Context ctx = new Context(locale);
  ctx.setVariable("name", recipientName);
  ctx.setVariable("subscriptionDate", new Date());
  ctx.setVariable("hobbies", Arrays.asList("Cinema", "Sports", "Music"));
  ctx.setVariable("imageResourceName", imageResourceName); // so that we can reference it from HTML

  // Prepare message using a Spring helper
  final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
  final MimeMessageHelper message =
      new MimeMessageHelper(mimeMessage, true, "UTF-8"); // true = multipart
  message.setSubject("Example HTML email with inline image");
  message.setFrom("thymeleaf@example.com");
  message.setTo(recipientEmail);

  // Create the HTML body using Thymeleaf
  final String htmlContent = this.templateEngine.process("email-inlineimage.html", ctx);
  message.setText(htmlContent, true); // true = isHtml

  // Add the inline image, referenced from the HTML code as "cid:${imageResourceName}"
  final InputStreamSource imageSource = new ByteArrayResource(imageBytes);
  message.addInline(imageResourceName, imageSource, imageContentType);

  // Send mail
  this.mailSender.send(mimeMessage);

}
```

Note that we have used an
`org.springframework.core.io.ByteArrayResource` object to attach the
image uploaded by the user, which we previously converted into a
`byte[]`.

You could also make use of `FileSystemResource` to attach a file
directly from the filesystem ---thus avoiding loading it into memory---, or
`UrlResource` to attach a remote file.

### The controller

Now for the controller method that calls our service:

```java
/*
* Send HTML mail with inline image
*/
@RequestMapping(value = "/sendMailWithInlineImage", method = RequestMethod.POST)
public String sendMailWithInline(
  @RequestParam("recipientName") final String recipientName,
  @RequestParam("recipientEmail") final String recipientEmail,
  @RequestParam("image") final MultipartFile image,
  final Locale locale)
  throws MessagingException, IOException {

  this.emailService.sendMailWithInline(
      recipientName, recipientEmail, image.getName(),
      image.getBytes(), image.getContentType(), locale);
  return "redirect:sent.html";

}
```

Cannot be easier. Note how we use a Spring MVC `MultipartFile` object to
model the uploaded file and pass its contents on to the service.


More examples
-------------

For the sake of brevity, we have only detailed one of the four types of
email we want our application to send. However, you can see the source
code required for creating all four types of emails at the `springmail`
example application you can download from the [documentation
page](/documentation.html).
