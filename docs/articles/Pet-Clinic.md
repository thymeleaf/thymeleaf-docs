Bringing Thymeleaf and Natural Templates to the Spring PetClinic
================================================================

*By Soraya Sánchez \<sschz AT users.sourceforge.net\>*

**Note**: The Spring PetClinic application received a major update from
SpringSource in March 2013, and the *thymeleafexamples-petclinic*
application has been updated consequently, along with this article.

The Spring PetClinic application
--------------------------------

*PetClinic* is one of the example applications created by SpringSource
for the Spring Framework. It is designed to display and manage
information related to pets and veterinarians in a pet clinic. The
original SpringSource version lives in GitHub
[here](https://github.com/SpringSource/spring-petclinic), and the
thymeleaf-enabled version lives also in GitHub
[here](https://github.com/thymeleaf/thymeleafexamples-petclinic).

![PetClinic home page](images/pet-clinic/home.png)

*Pet Clinic* originally includes a view layer created with JSP, which we
will replace using Thymeleaf:

-   Modifications will be focused on the view layer: the JSP files will
    be replaced and the application will be reconfigured. All Java code
    will be left untouched.
-   The original markup will be cleaned, but all the application's
    interface will have to display exactly the same as the original.
-   No CSS stylesheet files will be changed. No JavaScript libraries
    will be added, modified or upgraded.
-   Thymeleaf template files should display OK when opened statically on
    a browser (*Natural templates*).

All the code of the PetClinic+Thymeleaf application can be obtained at
the [Thymeleaf Project's Documentation](documentation.html) page. Note
that the original JSP files and JSP tags have not been removed from the
source tree but rather moved to the `doc/old_viewlayer` folder at the
source tree, so that you can still access them in order to compare with
the new templates.

The version of the PetClinic application used as a base is the state of
its *master branch at Github* as of 17 March 2013.

### The original JSP view layer

The original JSP view layer has a number of problems we will try to fix
when converting the view layer to Thymeleaf:

-   JSPs include tags from JSTL, Spring Tag Libs and other external
    libraries. None of these are understandable by browsers, so there is
    no way for them to display the pages statically (no static
    prototyping possible).
-   JSTL tags use the JSP EL (Expression Language), whereas the tags
    from the JSP Spring taglibs use Spring EL. Two different expression
    languages are therefore mixed in the same pages.
-   The original JSP templates are not well-formed HTML documents. For
    example, the *"ownersList"* page:
    1.  Does not contain a head tag, adding instead one from another JSP
        using a *JSP include* (=\> not understandable by browsers).
    2.  Header and footer contents have been replaced by JSP include
        tags (=\> not understandable by browsers) so the pages can't be
        displayed statically including their header and footer. And
        anyway, even if those contents were in the page, as pages
        contain JSP and JSTL tags, we wouldn't be able to see a real
        prototype.

Configuration
-------------

### Basic project configuration

Some basic configuration steps will be needed:

-   The `pom.xml` file will be modified in order to add the Thymeleaf
    dependencies to it and remove the JSP-related ones.
-   The `web.xml` file will be modified in order to remove JSP-related
    servlets and filters.

### mvc-view-config.xml

Our next configuration step will be to add three required beans at the
Spring beans configuration file, `mvc-view-config.xml`:

-   The Thymeleaf *template resolver* that will be in charge of reading
    the template files to be processed. For this application we will use
    a `ServletContextTemplateResolver`.
-   The Thymeleaf *template engine* instance, of class
    `SpringTemplateEngine`.
-   The Thymeleaf *view resolver*, a `ThymeleafViewResolver` instance
    implementing Spring's `org.springframework.web.servlet.ViewResolver`
    interface. This bean will substitute the original
    `InternalResourceViewResolver` bean which enabled JSP support in the
    original application.

```xml
<bean id="templateResolver" class="org.thymeleaf.templateresolver.ServletContextTemplateResolver">
  <property name="prefix" value="/WEB-INF/thymeleaf/" />
  <property name="suffix" value=".html" />
  <property name="templateMode" value="HTML5" />
  <!-- Template cache is set to false (default is true). -->
  <property name="cacheable" value="false" />
</bean>

<bean id="templateEngine" class="org.thymeleaf.spring3.SpringTemplateEngine">
  <property name="templateResolver" ref="templateResolver" />
</bean>

<bean class="org.springframework.web.servlet.view.ContentNegotiatingViewResolver">
  <property name="contentNegotiationManager" ref="cnManager"/>
  <property name="viewResolvers">
    <list>
      <!-- Used here for 'xml' and 'atom' views  -->
      <bean class="org.springframework.web.servlet.view.BeanNameViewResolver">
        <property name="order" value="1"/>
      </bean>
      <!-- Used for Thymeleaf views  -->
      <bean class="org.thymeleaf.spring3.view.ThymeleafViewResolver">
        <property name="templateEngine" ref="templateEngine" />
        <property name="order" value="2"/>
      </bean>
    </list>
  </property>
</bean>
```

Note that, as a difference from the original application, our templates
will live at the `/WEB-INF/thymeleaf` folder instead of the original
`/WEB-INF/jsp`.

From JSP to Thymeleaf
---------------------

PetClinic includes more than 10 JSP templates, and we will rewrite all
of them using Thymeleaf. However, for the sake of brevity, we will focus
on `owners/ownerslist.jsp`, which we will convert into
`owners/ownersList.html`.

Remember you can see all the templates at the source code, downloadable
from [the documentation page](documentation.html), and also that you can
review the original JSP files at the `doc/old_viewlayer` folder.

The *owners/ownersList* page looks like this:

![Owners page](images/pet-clinic/owners.png)

In order to convert this page to Thymeleaf, we will:

-   Rename `ownersList.jsp` to `ownersList.html`.
-   Remove all `<%@ taglib %>` directives as we do not need any JSP tag
    libraries
-   Replace the `jsp:include` tags which add head, header and footer to
    the page with tags containing the thymeleaf attributes
    `th:substituteby` or `th:include`. Those page fragments have been
    kept in the `fragments` folder and converted to thymeleaf as well

```html
<!-- ownersList.jsp -->
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="datatables" uri="http://github.com/dandelion/datatables" %>

<html lang="en">

  <jsp:include page="../fragments/headTag.jsp"/>

  <body>
    <div class="container">
      <jsp:include page="../fragments/bodyHeader.jsp"/>

      <!-- ... -->

      <jsp:include page="../fragments/footer.jsp"/>

    </div>
  </body>

</html>
```

```html
<!-- ownersList.html -->
<!DOCTYPE html>

<html lang="en">

  <head th:substituteby="fragments/headTag :: headTag">

    <!-- ============================================================================ -->
    <!-- This <head> is only used for static prototyping purposes (natural templates) -->
    <!-- and is therefore entirely optionl, as this markup fragment will be included  -->
    <!-- from "fragments.html" at runtime.                                            -->
    <!-- ============================================================================ -->

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>PetClinic :: a Spring Framework demonstration</title>

    <link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap.min.css"
      th:href="@{/webjars/bootstrap/2.3.0/css/bootstrap.min.css}" rel="stylesheet" />
    <link href="../../../resources/css/petclinic.css"
      th:href="@{/resources/css/petclinic.css}" rel="stylesheet" />

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"
      th:src="@{/webjars/jquery/1.9.0/jquery.js}"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"
      th:src="@{/webjars/jquery-ui/1.9.2/js/jquery-ui-1.9.2.custom.js}"></script>

    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/smoothness/jquery-ui.css"
      th:href="@{/webjars/jquery-ui/1.9.2/css/smoothness/jquery-ui-1.9.2.custom.css}"
      rel="stylesheet" />

  </head>

  <body>

    <div class="container">

      <div th:include="fragments/bodyHeader" th:remove="tag">

        <!-- =========================================================================== -->
        <!-- This div is only used for static prototyping purposes (natural templates)   -->
        <!-- and is therefore entirely optionl, as this markup fragment will be included -->
        <!-- from "fragments.html" at runtime.                                           -->
        <!-- =========================================================================== -->

        <img th:src="@{/resources/images/banner-graphic.png}"
          src="../../../resources/images/banner-graphic.png"/>

        <div class="navbar" style="width: 601px;">
          <div class="navbar-inner">
            <ul class="nav">
              <li style="width: 100px;">
                <a href="../welcome.html" th:href="@{/}">
                  <i class="icon-home"></i>Home
                </a>
              </li>
              <li style="width: 130px;">
                <a href="../owners/findOwners.html" th:href="@{/owners/find.html}">
                  <i class="icon-search"></i>Find owners
                </a>
              </li>
              <li style="width: 140px;">
                <a href="../vets/vetList.html" th:href="@{/vets.html}">
                  <i class="icon-th-list"></i>Veterinarians
                </a>
              </li>
              <li style="width: 90px;">
                <a href="../exception.html" th:href="@{/oups.html}"
                  title="trigger a RuntimeException to see how it is handled">
                  <i class="icon-warning-sign"></i>Error
                </a>
              </li>
              <li style="width: 80px;">
                <a href="#" title="not available yet. Work in progress!!">
                  <i class=" icon-question-sign"></i>Help
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>


      <!-- ... -->


      <table th:substituteby="fragments/footer :: footer" class="footer">

        <!-- =========================================================================== -->
        <!-- This table section is only used for static prototyping purposes (natural    -->
        <!-- templates) and is therefore entirely optionl, as this markup fragment will  -->
        <!-- be included from "fragments.html" at runtime.                               -->
        <!-- =========================================================================== -->

        <tr>
          <td></td>
          <td align="right">
            <img src="../../../resources/images/springsource-logo.png"
              th:src="@{/resources/images/springsource-logo.png}"
              alt="Sponsored by SpringSource" />
          </td>
        </tr>

      </table>

    </div>

  </body>

</html>
```

Note how our `ownersList.html` contains more code at its head, header
and footer sections than the original JSP file. Doing it this way is
merely optional, and its only aim is to allow the `ownersList.html`
Thymeleaf-enabled template to display statically as a prototype
(something nearly impossible with JSP).

*Is this additional code worth it?* If you need or want to use design
prototypes, indeed! You will see clearly how much a difference this is
at the last section of this article. And anyway... remember this
prototyping code is optional!

-   Change the page body. The original code looks like this:

```html
<!-- ownersList.jsp -->
<datatables:table id="owners" data="${selections}" cdn="true" row="owner" theme="bootstrap2"
  cssClass="table table-striped" paginate="false" info="false" export="pdf">
  <datatables:column title="Name" cssStyle="width: 150px;" display="html">
    <spring:url value="owners/{ownerId}.html" var="ownerUrl">
      <spring:param name="ownerId" value="${owner.id}"/>
    </spring:url>
    <a href="${fn:escapeXml(ownerUrl)}"><c:out value="${owner.firstName} ${owner.lastName}"/></a>
  </datatables:column>
  <datatables:column title="Name" display="pdf">
    <c:out value="${owner.firstName} ${owner.lastName}"/>
  </datatables:column>
  <datatables:column title="Address" property="address" cssStyle="width: 200px;"/>
  <datatables:column title="City" property="city"/>
  <datatables:column title="Telephone" property="telephone"/>
  <datatables:column title="Pets" cssStyle="width: 100px;">
    <c:forEach var="pet" items="${owner.pets}">
      <c:out value="${pet.name}"/>
    </c:forEach>
  </datatables:column>
  <datatables:export type="pdf" cssClass="btn btn-small" />
</datatables:table>
```

Which we will replace with:

```html
<!-- ownersList.html -->
<h2>Owners</h2>

<table class="table table-striped">
  <thead>
    <tr>
      <th style="width: 150px;">Name</th>
      <th style="width: 200px;">Address</th>
      <th>City</th>
      <th>Telephone</th>
      <th style="width: 100px;">Pets</th>
    </tr>
  </thead>
  <tbody>
    <tr th:each="owner : ${selections}">
      <td>
        <a href="ownerDetails.html"
          th:href="@{|/owners/${owner.id}|}"
          th:text="|${owner.firstName} ${owner.lastName}|">Mary Smith</a>
      </td>
      <td th:text="${owner.address}">45, Oxford Street</td>
      <td th:text="${owner.city}">Cambridge</td>
      <td th:text="${owner.telephone}">555-555-555</td>
      <td>
        <span th:each="pet : ${owner.pets}" th:text="${pet.name}" th:remove="tag">
          Rob
        </span>
      </td>
    </tr>
  </tbody>
</table>
```

-   In the code above you can see how we used HTML code instead of a
    collection of JSP tags from an external library. Not only this makes
    our code much clearer and more readable, but also more standard and
    *understandable by browsers*, which will allow us to use this
    template as a *static prototype*. Again, we will see the advantages
    of this in the next section.

And what about the *Natural Templates* thing?
---------------------------------------------

Before we started this migration, we set a goal that our new Thymeleaf
templates would be able to display correctly when open statically in a
browser (without starting the application server) thanks to the *Natural
Templating* capabilities of Thymeleaf.

Well, let's have a look at how the original `owners/ownersList.jsp`
template looks like when seen statically:

![Owners list (JSP), statically
opened](images/pet-clinic/ownerslist_jsp_static.png)

...and now let's have a look at our new Thymeleaf-powered
`owners/ownersList.html`:

![Owners list (thymeleaf), statically
opened](images/pet-clinic/ownerslist_thymeleaf_static.png)

There we are. Data is not valid, because it is a prototype. But it looks
good!
