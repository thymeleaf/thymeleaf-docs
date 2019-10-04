---
title: 'Tutorial: Using Thymeleaf (ja)'
author: The Thymeleaf Team
version: 20141222 - 22 December 2014
thymeleafVersion: 2.1.4.RELEASE
language: Japanese
lang: ja
translator: 'Mitsuyuki Shiiba (<a href="https://twitter.com/bufferings">@bufferings</a>)'
---


<!--
1 Introducing Thymeleaf
-->
1 Thymeleafの紹介
=======================

<!--
1.1 What is Thymeleaf?
-->
1.1 Thymeleafって何？
----------------------

<!--
Thymeleaf is a Java library. It is an XML/XHTML/HTML5 template engine able to
apply a set of transformations to template files in order to display data and/or
text produced by your applications.
-->
ThymeleafはJavaのテンプレートエンジンライブラリです。XML/XHTML/HTML5で書かれたテンプレートを変換して、アプリケーションのデータやテキストを表示することができます。

<!--
It is better suited for serving XHTML/HTML5 in web applications, but it can
process any XML file, be it in web or in standalone applications.
-->
ウェブアプリケーション内のXHTML/HTML5を扱う方が得意ですが、どんなXMLファイルでも処理できますし、ウェブアプリケーションでもスタンドアローンアプリケーションでも使用可能です。

<!--
The main goal of Thymeleaf is to provide an elegant and well-formed way of
creating templates. In order to achieve this, it is based on XML tags and
attributes that define the execution of predefined logic on the _DOM (Document Object Model)_,
instead of explicitly writing that logic as code inside the template.
-->
Thymeleafのメインゴールは、テンプレート作成のための優雅で整形式の方法を提供することです。そのため、テンプレート内にロジックを記述する方法ではなく、事前定義されたロジックの実行を _DOM(Document Object Model)_ 上でXMLタグ・属性によって指定する方法を基本としています。

<!--
Its architecture allows a fast processing of templates, relying on intelligent
caching of parsed files in order to use the least possible amount of I/O
operations during execution.
-->
このアーキテクチャのおかげで、パースしたファイルを賢くキャッシュして実行時のI/O処理を最小限に抑えることができるので、テンプレートを高速に処理することが可能となっています。

<!--
And last but not least, Thymeleaf has been designed from the beginning with XML
and Web standards in mind, allowing you to create fully validating templates if
that is a need for you.
-->
さらに、Thymeleafは最初からXMLとウェブ標準を念頭に置いてデザインされているので、必要に応じて完全にバリデーションされた状態のテンプレートを作成することもできます。

<!--
1.2 What kind of templates can Thymeleaf process?
-->
1.2 Thymeleafはどんな種類のテンプレートを処理できるの？
-------------------------------------------------

<!--
Out-of-the-box, Thymeleaf allows you to process six kinds of templates, each of
which is called a Template Mode:
-->
Thymeleafは6種類のテンプレートを処理することができます。これをテンプレートモードと呼びます:

 * XML
 * Valid XML
 * XHTML
 * Valid XHTML
 * HTML5
 * Legacy HTML5

<!--
All of these modes refer to well-formed XML files except the _Legacy HTML5_ mode,
which allows you to process HTML5 files with features such as standalone (not
closed) tags, tag attributes without a value or not written between quotes. In
order to process files in this specific mode, Thymeleaf will first perform a
transformation that will convert your files to well-formed XML files which are
still perfectly valid HTML5 (and are in fact the recommended way to create HTML5
code)^[Given the fact that XHTML5 is just XML-formed HTML5 served with the
application/xhtml+xml content type, we could also say that Thymeleaf supports
XHTML5.].
-->
_Legacy HTML5_ 以外は整形式XMLです。_Legacy HTML5_ モードでは閉じていないタグ・値がない属性・引用符で囲まれていない属性が許容されていますが、Thymeleafはこのモードのファイルを最初に整形式XMLに変換します。それでもHTML5としては正しい状態です(そして実際こちらがHTML5を書くのに推奨されている方法です) ^[application/xhtml+xmlコンテンツタイプで取り扱われるXML整形式のHTML5はXHTML5と呼ばれるので、ThymeleafはXHTML5をサポートしていると言ってもいいかもしれません。]。

<!--
Also note that validation is only available for XML and XHTML templates.
-->
また、バリデーションはXMLとXHTMLのみで使用可能なことに注意してください。

<!--
Nevertheless, these are not the only types of template that Thymeleaf can
process, and the user is always able to define his/her own mode by specifying
both a way to _parse_ templates in this mode and a way to _write_ the results.
This way, anything that can be modelled as a DOM tree (be it XML or not) could
effectively be processed as a template by Thymeleaf.
-->
ただ、Thymeleafが処理できるテンプレートのタイプはこれだけではありません。テンプレートを「パースする方法」と結果を「書き込む方法」を指定することで、ユーザーは独自のモードを定義することができます。Thymeleafは、DOMツリーとして表現することができるものであれば何でも(XMLかどうかに関係なく)テンプレートとして効率よく処理することができます。


<!--
1.3 Dialects: The Standard Dialect
-->
1.3 ダイアレクト: スタンダードダイアレクト
----------------------------------

<!--
Thymeleaf is an extremely extensible template engine (in fact it should be
better called a _template engine framework_) that allows you to completely
define the DOM nodes that will be processed in your templates and also how they
will be processed.
-->
Thymeleafは非常に拡張性の高いテンプレートエンジンです(実際「テンプレートエンジンフレームワーク」と呼んだほうがいいかもしれません)。Thymeleafでは、処理対象のDOMノードと、そのDOMノードをどのように処理するかを完全に定義することができます。

<!--
An object that applies some logic to a DOM node is called a _processor_, and a
set of these processors ーーーplus some extra artifactsーーー is called a dialect, of
which Thymeleaf's core library provides one out-of-the-box called the _Standard Dialect_,
which should be enough for the needs of a big percent of users.
-->
DOMノードにロジックを適用するものを「プロセッサ」と呼びます。そして、プロセッサ一式 --- と、いくつかの特別な生成物 --- のことをダイアレクトと呼びます。Thymeleafでは「スタンダードダイアレクト」というそのまますぐに使えるコアライブラリを提供していて、大半のユーザーにとってはこれで十分です。

<!--
_The Standard Dialect is the dialect this tutorial covers_. Every attribute and
syntax feature you will learn about in the following pages is defined by this
dialect, even if that isn't explicitly mentioned.
-->
このチュートリアルでカバーしているのはスタンダードダイアレクトです。以降のページで学ぶ全ての属性や文法は特に明記していなくても、このダイアレクトに定義してあります。

<!--
Of course, users may create their own dialects (even extending the Standard one)
if they want to define their own processing logic while taking advantage of the
library's advanced features. A Template Engine can be configured several
dialects at a time.
-->
もちろん、ライブラリの拡張機能を利用して独自の処理ロジックを定義したい、など(スタンダードダイアレクトを拡張することも含めて)独自のダイアレクトを作りたい場合があるかもしれません。テンプレートエンジンは複数のダイアレクトを同時に使用できます。

<!--
> The official thymeleaf-spring3 and thymeleaf-spring4 integration packages 
> both define a dialect called the "SpringStandard Dialect", mostly equivalent 
> to the Standard Dialect but with small adaptations to make better use of some 
> features in Spring Framework (for example, by using Spring Expression Language 
> instead of Thymeleaf's standard OGNL). So if you are a Spring MVC user you are 
> not wasting your time, as almost everything you learn here will be of use in 
> your Spring applications.
-->
> 公式の thymeleaf-spring3 と thymeleaf-spring4 連携パッケージはどちらも「Springスタンダードダイアレクト」と呼ばれるダイアレクトを定義しています。これは、ほぼスタンダードダイアレクトと同じで、そこにSpring Framework用の便利機能を少しだけ適用しています(例えば、Thymeleaf標準のOGNLの代わりにSpring式言語を使用するなど)。ですので、Spring MVCを使用するような場合でも時間の無駄にはなりません。ここで学ぶことは全て、Springアプリケーションを作成する際にも役立つでしょう。

<!--
The Thymeleaf Standard Dialect can process templates in any mode, but is
especially suited for web-oriented template modes (XHTML and HTML5 ones).
Besides HTML5, it specifically supports and validates the following XHTML
specifications: _XHTML 1.0 Transitional_, _XHTML 1.0 Strict_, _XHTML 1.0 Frameset_,
and _XHTML 1.1_.
-->
Thymeleafのスタンダードダイアレクトはどのテンプレートモードでも使用できますが、特にウェブ向けのテンプレートモードに適しています(XHTMLとHTML5モード)。HTML5の他に具体的には以下のXHTML仕様をサポート・動作確認しています: "XHTML 1.0 Transitional"、"XHTML 1.0 Strict"、"XHTML 1.0 Frameset"、そして "XHTML 1.1" です。

<!--
Most of the processors of the Standard Dialect are _attribute processors_. This
allows browsers to correctly display XHTML/HTML5 template files even before
being processed, because they will simply ignore the additional attributes. For
example, while a JSP using tag libraries could include a fragment of code not
directly displayable by a browser like:
-->
スタンダードダイアレクトの大半のプロセッサは「属性プロセッサ」です。属性プロセッサを使用すると、XHTML/HTML5テンプレートファイルは処理前であってもブラウザで正しく表示することができます。単純にその属性が無視されるからです。例えば、タグライブラリを使用したJSPだとブラウザで直接表示できない場合がありますが:

```html
<form:inputText name="userName" value="${user.name}" />
```

<!--
...the Thymeleaf Standard Dialect would allow us to achieve the same
functionality with:
-->
Thymeleafスタンダードダイアレクトでは同様の機能をこのように実現します:

```html
<input type="text" name="userName" value="James Carrot" th:value="${user.name}" />
```

<!--
Which not only will be correctly displayed by browsers, but also allow us to
(optionally) specify a value attribute in it ("James Carrot", in this case) that
will be displayed when the prototype is statically opened in a browser, and that
will be substituted by the value resulting from the evaluation of `${user.name}`
during Thymeleaf processing of the template.
-->
ブラウザで正しく表示できるだけでなく、(任意ですが)value属性を指定することもできます(この場合の "James Carrot" の部分です)。プロトタイプを静的にブラウザで開いた場合にはこの値が表示され、Thymeleafでテンプレートを処理した場合には `${user.name}` の評価結果値で置き換えられます。

<!--
If needed, this will allow your designer and developer to work on the very same
template file and reduce the effort required to transform a static prototype
into a working template file. The ability to do this is a feature usually called
_Natural Templating_.
-->
必要な場合には、全く同じファイルをデザイナーとデベロッパーが触ることができるので、静的なプロトタイプをテンプレートに変換する労力を減らすことができます。この機能のことを「ナチュラルテンプレーティング」と呼びます。


<!--
1.4 Overall Architecture
-->
1.4 全体のアーキテクチャ
------------------------

<!--
Thymeleaf's core is a DOM processing engine. Specifically, it uses its own
high-performance DOM implementation ーーーnot the standard DOM APIーーー for building
in-memory tree representations of your templates, on which it later operates by
traversing their nodes and executing processors on them that modify the DOM
according to the current _configuration_ and the set of data that is passed to
the template for its representation ーーーknown as the context.
-->
ThymeleafのコアはDOM処理エンジンです。具体的にいうと ---標準のDOM APIではなく--- 高性能の独自DOM実装によってテンプレートのインメモリツリー表現を生成します。その後、そのインメモリツリー上でノードを走査してプロセッサを実行しDOMを変更します。DOMの変更は現在の設定や、テンプレートに渡されるコンテキストと呼ばれるデータセットに従います。

<!--
The use of a DOM template representation makes it very well suited for web
applications because web documents are very often represented as object trees
(in fact DOM trees are the way browsers represent web pages in memory). Also,
building on the idea that most web applications use only a few dozen templates,
that these are not big files and that they don't normally change while the
application is running, Thymeleaf's usage of an in-memory cache of parsed
template DOM trees allows it to be fast in production environments, because very
little I/O is needed (if any) for most template processing operations. 
-->
ウェブドキュメントはオブジェクトツリーとして表現されることが本当によくあるので、DOMテンプレート表現の使用はウェブアプリケーションにとても適しています(実際にブラウザはDOMツリーによってメモリ上でウェブページを表現します)。また、多くのウェブアプリケーションで、使用するテンプレート数は数十個程度である、そのテンプレートが大きなサイズではない、アプリケーションの実行中に通常は変更されない、という考えに基づいてThymeleafはテンプレートのDOMツリーのインメモリキャッシュを利用しています。これによって多くのテンプレート処理で(必要だとしても)ほんの少しのI/Oしか必要なくなるので、本番環境での実行を速くすることができます。

<!--
> If you want more detail, later in this tutorial there is an entire chapter
> dedicated to caching and to the way Thymeleaf optimizes memory and resource
> usage for faster operation.
-->
> このチュートリアルの後ろの方にキャッシュについてと、高速な処理のためにThymeleafがどのようにメモリとリソースを最適化しているかについて説明した章がありますので詳細はそちらを参照してください。

<!--
Nevertheless, there is a restriction: this architecture also requires the use of
bigger amounts of memory space for each template execution than other template parsing/processing approaches, which means that you should not use the library for creating big data XML documents (as opposed to web documents). As a general rule of thumb (and always depending on the memory size of your JVM), if you are generating XML files with sizes around the tens of megabytes in a single template execution, you probably should not be using Thymeleaf.
-->
しかし、制約もあります: このアーキテクチャではテンプレート処理に他のアプローチよりも多くのメモリスペースが必要になります。つまり、(ウェブドキュメントとは対照的な)大きなサイズのデータXMLの作成には使わない方が良いということです。大まかには(といってもJVMのメモリサイズによりますが)1テンプレートを処理するのに数十メガバイトが必要になるXMLファイルを処理する場合は、おそらくThymeleafを使わない方が良いでしょう。

<!--
> The reason we consider this restriction only applies to data XML files and not
> web XHTML/HTML5 is that you should never generate web documents so big that
> your users' browsers set ablaze and/or explode ーー remember that these browsers
> will also have to create DOM trees for your pages!
-->
> ここで、データXMLに対してだけこの制約について考えているのは、ウェブのXHTML/HTML5に関しては、そんなに大きなサイズのドキュメントは作成しないからです。ブラウザもDOMツリーを生成するので、そんなことをすると固まってしまいますもんね。

<!--
1.5 Before going any further, you should read...
-->
1.5 次に進む前に読むことをお勧めします...
------------------------------------------------

<!--
Thymeleaf is especially suited for working in web applications. And web
applications are based on a series of standards that everyone should know very
well but few do ーー even if they have been working with them for years.
-->
Thymeleafは特にウェブアプリケーションに適しています。そしてウェブアプリケーションには標準というものがあります。みんながこの標準についてよく知っているべきなのですが、ほとんどの人が知りません。たとえウェブアプリケーションの仕事を何年もやっている人であってもです。

<!--
With the advent of HTML5, the state of the art in web standards today is more
confusing than ever... _are we going back from XHTML to HTML? Will we abandon
XML syntax? Why is nobody talking about XHTML 2.0 anymore?_
-->
HTML5の出現によって、今日のウェブ標準はかつてないほどに混乱しています... 「XHTMLからHTMLに戻るの？」「XMLシンタックスはなくなるの？」「XHTML2.0はどこにいったの？」

<!--
So before going any further in this tutorial, you are strongly advised to read
an article on Thymeleaf's web site called _"From HTML to HTML (via HTML)"_,
which you can find at this address:
[http://www.thymeleaf.org/doc/articles/fromhtmltohtmlviahtml.html](http://www.thymeleaf.org/doc/articles/fromhtmltohtmlviahtml.html)
-->
ということでこのチュートリアルでは先に進む前に、Thymeleafのウェブサイトの次の記事を読むことを強くお勧めします:
_"From HTML to HTML (via HTML)"_ [http://www.thymeleaf.org/doc/articles/fromhtmltohtmlviahtml.html](http://www.thymeleaf.org/doc/articles/fromhtmltohtmlviahtml.html)

<!--
2 The Good Thymes Virtual Grocery
-->
2 The Good Thymes Virtual Grocery(グッドタイムス仮想食料品店)
=================================

<!--
2.1 A website for a grocery
-->
2.1 食料品店用のウェブサイト
---------------------------

<!--
In order to better explain the concepts involved in processing templates with
Thymeleaf, this tutorial will use a demo application you can download from the
project web site.
-->
Thymeleafのテンプレート処理のコンセプトを分かりやすく説明するために、このチュートリアルではデモアプリケーションを使用します。デモアプリケーションはプロジェクトのウェブサイトからダウンロードできます。

<!--
This application represents the web site of an imaginary virtual grocery, and
will provide us with the adequate scenarios to exemplify diverse Thymeleaf
features.
-->
このアプリケーションは架空の仮想食料品店のウェブサイトで、様々なThymeleafの機能の例をお見せするのに十分なシナリオが用意されています。

<!--
We will need a quite simple set of model entities for our application: `Products`
which are sold to `Customers` by creating `Orders`. We will also be managing `Comments`
about those `Products`:
-->
アプリケーションにはとてもシンプルなモデルエンティティが必要でしょう: `Products` は `Orders` を作成することによって `Customers` に販売されます。さらにこの `Products` について `Comments` も管理しましょう:

![Example application model](images/usingthymeleaf/gtvg-model.png)

<!--
Our small application will also have a very simple service layer, composed by `Service`
objects containing methods like:
-->
とてもシンプルなサービスレイヤも作りましょう。次のようなメソッドを持つ `Service` オブジェクトです:

```java
public class ProductService {

    ...

    public List<Product> findAll() {
        return ProductRepository.getInstance().findAll();
    }

    public Product findById(Integer id) {
        return ProductRepository.getInstance().findById(id);
    }
    
}
```
<!--
Finally, at the web layer our application will have a filter that will delegate
execution to Thymeleaf-enabled commands depending on the request URL:
-->
最後に、リクエストURLに応じてThymeleafに処理を委譲するフィルタをウェブレイヤに作成しましょう:

```java
private boolean process(HttpServletRequest request, HttpServletResponse response)
        throws ServletException {
        
    try {
            
        /*
         * Query controller/URL mapping and obtain the controller
         * that will process the request. If no controller is available,
         * return false and let other filters/servlets process the request.
         */
        IGTVGController controller = GTVGApplication.resolveControllerForRequest(request);
        if (controller == null) {
            return false;
        }
        /*
         * Obtain the TemplateEngine instance.
         */
        TemplateEngine templateEngine = GTVGApplication.getTemplateEngine();
            
        /*
         * Write the response headers
         */
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);

        /*
         * Execute the controller and process view template,
         * writing the results to the response writer.
         */
        controller.process(
                request, response, this.servletContext, templateEngine);

        return true;
            
    } catch (Exception e) {
        throw new ServletException(e);
    }
        
}    
```

<!--
This is our `IGTVGController` interface:
-->
`IGTVGController` インターフェイスは次のようになります:

```java
public interface IGTVGController {

    public void process(
            HttpServletRequest request, HttpServletResponse response,
            ServletContext servletContext, TemplateEngine templateEngine);    
    
}
```

<!--
All we have to do now is create implementations of the `IGTVGController`
interface, retrieving data from the services and processing templates using the
`TemplateEngine` object.
-->
これで `IGTVGController` の実装を作成すれば良いだけです。データをサービスから受け取って `TemplateEngine` オブジェクトを使用してテンプレートを処理します。

<!--
In the end, it will look like this:
-->
最終的にはこのようになりますが:

![Example application home page](images/usingthymeleaf/gtvg-view.png)

<!--
But first let's see how that template engine is initialized.
-->
まずはテンプレートエンジンの初期化について見てみましょう。

<!--
2.2 Creating and configuring the Template Engine
-->
2.2 テンプレートエンジンの作成と設定
------------------------------------------------

<!--
The _process(...)_ method in our filter contained this sentence:
-->
フィルタの _process(...)_ メソッドの中に次のような文があります:

```java
TemplateEngine templateEngine = GTVGApplication.getTemplateEngine();
```

<!--
Which means that the _GTVGApplication_ class is in charge of creating and
configuring one of the most important objects in a Thymeleaf-enabled
application: The `TemplateEngine` instance.
-->
これは、Thymeleafを使用するアプリケーションにおいて最も重要なオブジェクトの中の一つである `TemplateEngine` インスタンスの作成と設定を _GTVGApplication_ クラスが担っているということです。

<!--
Our `org.thymeleaf.TemplateEngine` object is initialized like this:
-->
ここでは `org.thymeleaf.TemplateEngine` を次のように初期化しています:

```java
public class GTVGApplication {
  
    
    ...
    private static TemplateEngine templateEngine;
    ...
    
    
    static {
        ...
        initializeTemplateEngine();
        ...
    }
    
    
    private static void initializeTemplateEngine() {
        
        ServletContextTemplateResolver templateResolver = 
            new ServletContextTemplateResolver();
        // XHTML is the default mode, but we set it anyway for better understanding of code
        templateResolver.setTemplateMode("XHTML");
        // This will convert "home" to "/WEB-INF/templates/home.html"
        templateResolver.setPrefix("/WEB-INF/templates/");
        templateResolver.setSuffix(".html");
        // Template cache TTL=1h. If not set, entries would be cached until expelled by LRU
        templateResolver.setCacheTTLMs(3600000L);
        
        templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);
        
    }
    
    ...

}
```

<!--
Of course there are many ways of configuring a `TemplateEngine` object, but for
now these few lines of code will teach us enough about the steps needed.
-->
もちろん `TemplateEngine` オブジェクトを初期化するのには様々な方法がありますが、今はこの数行のコードで十分です。


<!--
### The Template Resolver
-->
### テンプレートリゾルバー

<!--
Let's start with the Template Resolver:
-->
テンプレートリゾルバーからスタートしましょう:

```java
ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver();
```

<!--
Template Resolvers are objects that implement an interface from the Thymeleaf
API called `org.thymeleaf.templateresolver.ITemplateResolver`: 
-->
テンプレートリゾルバーはThymeleafのAPIである `org.thymeleaf.templateresolver.ITemplateResolver` を実装しています:

<!--
```java
public interface ITemplateResolver {

    ...
  
    /*
     * Templates are resolved by String name (templateProcessingParameters.getTemplateName())
     * Will return null if template cannot be handled by this template resolver.
     */
    public TemplateResolution resolveTemplate(
            TemplateProcessingParameters templateProcessingParameters);

}
```
-->
```java
public interface ITemplateResolver {

    ...
  
    /*
     * 文字列名(templateProcessingParameters.getTemplateName())によってテンプレートを解決します。
     * このテンプレートリゾルバーで解決できない場合は null を返します。
     */
    public TemplateResolution resolveTemplate(
            TemplateProcessingParameters templateProcessingParameters);

}
```

<!--
These objects are in charge of determining how our templates will be accessed,
and in this GTVG application, the `org.thymeleaf.templateresolver.ServletContextTemplateResolver`
implementation that we are using specifies that we are going to retrieve our
template files as resources from the _Servlet Context_: an application-wide `javax.servlet.ServletContext`
object that exists in every Java web application, and that resolves resources
considering the web application root as the root for resource paths.
-->
テンプレートリゾルバーは、どうやってテンプレートにアクセスするかを決定する役割を担っています。GTVGアプリケーションの場合は `org.thymeleaf.templateresolver.ServletContextTemplateResolver` 実装を使用して _Servlet Context_ からテンプレートファイルを取得します: Javaの全てのウェブアプリケーションにはアプリケーションレベルの `javax.servlet.ServletContext` というオブジェクトが存在し、それによってウェブアプリケーションのルートをリソースパスのルートとしてリソースを解決することができます。

<!--
But that's not all we can say about the template resolver, because we can set
some configuration parameters on it. First, the template mode, one of the
standard ones:
-->
テンプレートリゾルバーにはいくつかのパラメータを設定することができます。まず、標準的なものとして、テンプレートモードがあります:

```java
templateResolver.setTemplateMode("XHTML");
```

<!--
XHTML is the default template mode for `ServletContextTemplateResolver`, but it
is good practice to establish it anyway so that our code documents clearly what
is going on.
-->
XHTMLは `ServletContextTemplateResolver` のデフォルトテンプレートモードですが意図を明らかにするために書いておくのは良い習慣ですね。

```java
templateResolver.setPrefix("/WEB-INF/templates/");
templateResolver.setSuffix(".html");
```

<!--
These _prefix_ and _suffix_ do exactly what it looks like: modify the template
names that we will be passing to the engine for obtaining the real resource
names to be used.
-->
_prefix_ と _suffix_ は文字通り、テンプレート名から実際のリソース名を作り出すために使用されます。

<!--
Using this configuration, the template name _"product/list"_ would correspond to:
-->
この設定を使用すると _"product/list"_ というテンプレート名は次の内容と同じになります:

```java
servletContext.getResourceAsStream("/WEB-INF/templates/product/list.html")
```

<!--
Optionally, the amount of time that a parsed template living in cache will be
considered valid can be configured at the Template Resolver by means of the _cacheTTLMs_
property:
-->
任意ですが _cacheTTLMs_ でテンプレートキャッシュの生存期間を指定することもできます:

```java
templateResolver.setCacheTTLMs(3600000L);
```

<!--
Of course, a template can be expelled from cache before that TTL is reached if
the max cache size is reached and it is the oldest entry currently cached.
-->
もちろんTTL以内であってもキャッシュのサイズが最大値に達した場合は古いエントリーから削除されます。

<!--
> Cache behaviour and sizes can be defined by the user by implementing the `ICacheManager`
> interface or simply modifying the `StandardCacheManager` object set to manage
> caches by default.
-->
> キャッシュの振る舞いやサイズは `ICacheManager` インターフェイスの実装によって定義されます。または、単純にデフォルトで設定されている `StandardCacheManager` を修正しても良いです。

<!--
We will learn more about template resolvers later. Now let's have a look at the
creation of our Template Engine object.
-->
テンプレートリゾルバーについてのより詳細な説明は後ほど行います。今はテンプレートエンジンオブジェクトの生成について見てみましょう。

<!--
### The Template Engine
-->
### テンプレートエンジン

<!--
Template Engine objects are of class _org.thymeleaf.TemplateEngine_, and these
are the lines that created our engine in the current example:
-->
テンプレートエンジンオブジェクトとは _org.thymeleaf.TemplateEngine_ のことです。現在の例ではこのようにエンジンを作成しています:

```java
templateEngine = new TemplateEngine();
templateEngine.setTemplateResolver(templateResolver);
```

<!--
Rather simple, isn't it? All we need is to create an instance and set the
Template Resolver to it.
-->
かなりシンプルですよね。インスタンスを作成してテンプレートリゾルバーをセットするだけです。

<!--
A template resolver is the only required parameter a `TemplateEngine` needs,
although of course there are many others that will be covered later (message
resolvers, cache sizes, etc). For now, this is all we need.
-->
`TemplateEngine` に必須のパラメータはテンプレートリゾルバーだけです。もちろん他にも色々な設定があります(メッセージリゾルバーやキャッシュサイズなど)が、それについては後ほど説明します。今はこれだけで十分です。

<!--
Our Template Engine is now ready and we can start creating our pages using
Thymeleaf.
-->
これでテンプレートエンジンの準備ができました。では、Thymeleafを使用したページの作成に進みましょう。


<!--
3 Using Texts
-->
3 テキストを使う
=============

<!--
3.1 A multi-language welcome
-->
3.1 複数言語でウェルカム
----------------------------

<!--
Our first task will be to create a home page for our grocery site.
-->
私たちの食料品店用の最初のタスクはホームページ作成です。

<!--
The first version we will write of this page will be extremely simple: just a
title and a welcome message. This is our `/WEB-INF/templates/home.html` file:
-->
最初のバージョンは非常にシンプルです: タイトルとウェルカムメッセージだけです。 `/WEB-INF/templates/home.html` は以下のようになります:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

  <head>
    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body>
  
    <p th:text="#{home.welcome}">Welcome to our grocery store!</p>
  
  </body>

</html>
```

<!--
The first thing you will notice here is that this file is XHTML that can be
correctly displayed by any browser, because it does not include any non-XHTML
tags (and browsers ignore all attributes they don't understand, like `th:text`).
Also, browsers will display it in standards mode (not in quirks mode), because
it has a well-formed `DOCTYPE` declaration.
-->
最初に見て欲しいのは、このファイルがどんなブラウザでも正しく表示できるXHTMLであるということです。理由は、XHTMLにあるタグしか使っていないからです(そしてブラウザは `th:text` のような知らない属性は無視します)。また整形式の `DOCTYPE` 宣言を持っているので互換モードではなくスタンダードモードで表示されます。

<!--
Next, this is also _valid_ XHTML^[Note that, although this template is valid
XHTML, we earlier selected template mode "XHTML" and not "VALIDXHTML". For now,
it will be OK for us to just have validation turned off ーー but at the same time
we don't want our IDE to complain too much.], because we have specified a
Thymeleaf DTD which defines attributes like `th:text` so that your templates can
be considered valid. And even more: once the template is processed (and all `th:*`
attributes are removed), Thymeleaf will automatically substitute that DTD
declaration in the `DOCTYPE` clause by a standard `XHTML 1.0 Strict` one (we
will leave this DTD translation features for a later chapter).
-->
次に、このファイルは `th:text` のような属性を定義したThymeleafのDTDを指定しているので「妥当な」XHTMLでもあります ^[このテンプレートは妥当なXHTMLですが、テンプレートモードとしては "VALIDXHTML" ではなく "XHTML" を選んでいます。ですので今のところ、バリデーションを気にしなくても問題ないのですが、そうはいってもIDEにたくさん指摘されるのも嫌ですよね。]。 さらに、テンプレートが処理されると(全ての `th:*` 属性が取り除かれますが)、Thymeleafは自動的に `DOCTYPE` 内のDTD定義を標準的な `XHTML 1.0 Strict` のものに置き換えます(このDTD変換機能に関しては後の章で説明します)。

<!--
A thymeleaf namespace is also being declared for `th:*` attributes:
-->
thymeleaf名前空間も `th:*` として定義されています。

```html
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
```

<!--
Note that, if we hadn't cared about our template's validity or well-formedness
at all, we could have simply specified a standard `XHTML 1.0 Strict DOCTYPE`,
along with no xmlns namespace declarations:
-->
もしテンプレートの妥当性や、整形式であるかどうかを全く気にしないのであれば単純に標準の `XHTML 1.0 Strict DOCTYPE` を指定すればよく、xmlns名前空間の定義も不要であることに気をつけてください:


```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>

  <head>
    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body>
  
    <p th:text="#{home.welcome}">Welcome to our grocery store!</p>
  
  </body>

</html>
```

<!--
...and this would still be perfectly processable by Thymeleaf in the XHTML mode
(although probably our IDE would make our life quite miserable showing warnings
everywhere).
-->
...こう書いてもXHTMLモードのThymeleafは問題なく処理することができます(IDEの警告で残念な感じになると思いますけど)。

<!--
But enough about validation. Now for the really interesting part of the template:
let's see what that `th:text` attribute is about.
-->
バリデーションに関してはOKですね。ではテンプレートに関する本当に面白い部分に進みましょう: `th:text` 属性を見て行きましょう。

<!--
### Using th:text and externalizing text
-->
### th:text とテキストの外部化

<!--
Externalizing text is extracting fragments of template code out of template
files so that they can be kept in specific separate files (typically `.properties`
files) and that they can be easily substituted by equivalent texts written in
other languages (a process called internationalization or simply _i18n_).
Externalized fragments of text are usually called "messages".
-->
テキストの外部化とは、テンプレートコードのフラグメント(断片)をテンプレートファイルの外に取り出すことです。それによって、テンプレートから切り離された別のファイル(通常は `.properties` ファイル)の中でフラグメントを管理することができ、また、簡単に他の言語で書かれた文字列に置き換えることができます(このことを多言語対応、または _i18n_ と呼びます)。外部化されたテキストのフラグメントのことを通常は "メッセージ" と呼びます。

<!--
Messages have always a key that identifies them, and Thymeleaf allows you to
specify that a text should correspond to a specific message with the `#{...}`
syntax:
-->
メッセージは、そのメッセージを特定するためのキーを持っており、Thymeleafは `#{...}` という構文を使用してテキストとメッセージの紐付けを行います:

```html
<p th:text="#{home.welcome}">Welcome to our grocery store!</p>
```

<!--
What we can see here are in fact two different features of the Thymeleaf
Standard Dialect:
-->
ここでは実際、Thymeleafスタンダードダイアレクトの2つの異なる機能を使用しています:

<!--
 * The `th:text` attribute, which evaluates its value expression and sets the
   result of this evaluation as the body of the tag it is in, effectively
   substituting that "Welcome to our grocery store!" text we see in the code.
 * The `#{home.welcome}` expression, specified in the _Standard Expression Syntax_,
   specifying that the text to be used by the `th:text` attribute should be the
   message with the `home.welcome` key corresponding to whichever locale we are
   processing the template with.
-->
 * `th:text` 属性: この属性は値の式を評価した結果をタグのボディに設定します。ここでは、コード内の "Welcome to our grocery store!" というテキストを置換します。
 * `#{home.welcome}` 式: 「スタンダード式構文」に規定されています。ここでは、テンプレートを処理する全てのロケールで `home.welcome` キーに対応するメッセージを取得して `th:text` 属性で使用するということを意味します。

<!--
Now, where is this externalized text?
-->
ふむ。では外部化されたテキストはどこにあるのでしょうか？

<!--
The location of externalized text in Thymeleaf is fully configurable, and it
will depend on the specific `org.thymeleaf.messageresolver.IMessageResolver`
implementation being used. Normally, an implementation based on `.properties`
files will be used, but we could create our own implementations if we wanted,
for example, to obtain messages from a database.
-->
Thymeleafでは外部化テキストの場所は `org.thymeleaf.messageresolver.IMessageResolver` を実装することで自由に設定できます。通常は `.properties` ファイルを使用する実装になっていますが、独自実装を作成することも可能です。例えばメッセージをDBから取得することも可能です。

<!--
However, we have not specified a message resolver to our Template Engine during
initialization, and that means that our application is using the _Standard Message Resolver_,
implemented by class `org.thymeleaf.messageresolver.StandardMessageResolver`.
-->
ところで、私たちのテンプレートエンジンには初期化の時にメッセージリゾルバーを指定していません。これは `org.thymeleaf.messageresolver.StandardMessageResolver` クラスによって実装された「スタンダードメッセージリゾルバー」を使用していますよ、ということです。

<!--
This standard message resolver expects to find messages for `/WEB-INF/templates/home.html`
in .properties files in the same folder and with the same name as the template,
like:
-->
スタンダードメッセージリゾルバーは `/WEB-INF/templates/home.html` というテンプレートに対してテンプレートと同じフォルダ内で、同じ名前のファイルで拡張子が .properties のファイルの中からメッセージを探します。

<!--
 * `/WEB-INF/templates/home_en.properties` for English texts.
 * `/WEB-INF/templates/home_es.properties` for Spanish language texts.
 * `/WEB-INF/templates/home_pt_BR.properties` for Portuguese (Brazil) language
   texts.
 * `/WEB-INF/templates/home.properties` for default texts (if locale is not
   matched).
-->
 * `/WEB-INF/templates/home_en.properties` が英語用。
 * `/WEB-INF/templates/home_es.properties` がスペイン語用。
 * `/WEB-INF/templates/home_pt_BR.properties` がポルトガル語(ブラジル)用。
 * `/WEB-INF/templates/home.properties` がデフォルト用(ロケールが一致しない場合)。

<!--
Let's have a look at our `home_es.properties` file:
-->
`home_es.properties` ファイルを見てみましょう:

```
home.welcome=¡Bienvenido a nuestra tienda de comestibles!
```

<!--
This is all we need for making Thymeleaf process our template. Let's create our
Home controller then.
-->
これでThymeleafのテンプレート処理に必要なことは全て終わりました。ではHomeコントローラーを作成しましょう。

<!--
### Contexts
-->
### コンテキスト

<!--
In order to process our template, we will create a `HomeController` class
implementing the `IGTVGController` interface we saw before:
-->
テンプレートを処理するために `HomeController` クラスを作成します。前述の `IGTVGController` インターフェイスを実装します:

```java
public class HomeController implements IGTVGController {

    public void process(
            HttpServletRequest request, HttpServletResponse response,
            ServletContext servletContext, TemplateEngine templateEngine) {
        
        WebContext ctx = 
            new WebContext(request, response, servletContext, request.getLocale());
        templateEngine.process("home", ctx, response.getWriter());
        
    }

}
```

<!--
The first thing we can see here is the creation of a context. A Thymeleaf
context is an object implementing the `org.thymeleaf.context.IContext` interface.
Contexts should contain all the data required for an execution of the Template
Engine in a variables map, and also reference the Locale that must be used for
externalized messages.
-->
まずはコンテキストの作成について見てみましょう。Thymeleafのコンテキストは `org.thymeleaf.context.IContext` インターフェイスを実装したオブジェクトです。コンテキストはテンプレートエンジンの実行に必要な全てのデータを変数のマップとして持ち、また、外部化メッセージで使用されるロケールへの参照を持っています。

```java
public interface IContext {

    public VariablesMap<String,Object> getVariables();
    public Locale getLocale();
    ...
    
}
```

<!--
There is a specialized extension of this interface, `org.thymeleaf.context.IWebContext`:
-->
このインターフェイスの拡張として `org.thymeleaf.context.IWebContext` というインターフェイスがあります:

```java
public interface IWebContext extends IContext {
    
    public HttpSerlvetRequest getHttpServletRequest();
    public HttpSession getHttpSession();
    public ServletContext getServletContext();
    
    public VariablesMap<String,String[]> getRequestParameters();
    public VariablesMap<String,Object> getRequestAttributes();
    public VariablesMap<String,Object> getSessionAttributes();
    public VariablesMap<String,Object> getApplicationAttributes();
    
}
```

<!--
The Thymeleaf core library offers an implementation of each of these interfaces:
-->
Thymeleafのコアライブラリはそれぞれの実装を提供しています:

 * `org.thymeleaf.context.Context` implements `IContext`
 * `org.thymeleaf.context.WebContext` implements `IWebContext`

<!--
And as you can see in the controller code, `WebContext` is the one we will use.
In fact we have to, because the use of a `ServletContextTemplateResolver`
requires that we use a context implementing `IWebContext`.
-->
コントローラーのコードを見ていただければ分かるように、ここでは `WebContext` を使用しています。というか、そうしなければなりません。 `ServletContextTemplateResolver` が `IWebContext` の実装を必要とするからです。

```java
WebContext ctx = new WebContext(request, servletContext, request.getLocale());
```

<!--
Only two of those three constructor arguments are required, because the default
locale for the system will be used if none is specified (although you should
never let this happen in real applications).
-->
3つの引数のうち2つだけが必須です。ロケールに何も指定しなかったらシステムのデフォルトロケールが使用されます(実際のアプリケーションでは絶対に指定した方がよいですが)。

<!--
From the interface definition we can tell that `WebContext` will offer
specialized methods for obtaining the request parameters and request, session
and application attributes . But in fact `WebContext` will do a little bit more
than just that:
-->
インターフェイスの定義から `WebContext` はリクエストパラメータ、リクエスト属性、セッション属性、アプリケーション属性を取得するメソッドを持っていることが分かりますが、実際のところ `WebContext` はもう少し色々とやっています:

<!--
 * Add all the request attributes to the context variables map.
 * Add a context variable called `param` containing all the request parameters.
 * Add a context variable called `session` containing all the session attributes.
 * Add a context variable called `application` containing all the ServletContext attributes.
-->
 * 全てのリクエスト属性をコンテキスト変数マップに追加。
 * 全てのリクエストパラメータを持つ`param` というコンテキスト変数を追加。
 * 全てのセッション変数を持つ`session` というコンテキスト変数を追加。
 * 全てのサーブレットコンテキスト属性を持つ`application` というコンテキスト変数を追加。

<!--
Just before execution, a special variable is set into all context objects 
(implementations of `IContext`), including both `Context` and `WebContext`, 
called the execution info (`execInfo`). This variable contains two pieces of data that can
be used from within your templates:
-->
実行直前に全てのコンテキストオブジェクト(`IContext` の実装)に対して特別な変数が設定されます。 `Context` と `WebContext` のどちらもその対象です。この変数は実行情報(`execInfo`)と呼ばれます。この変数はテンプレートで使用される2つのデータを持っています。

<!--
 * The template name (`${execInfo.templateName}`), the name specified for engine
   execution, and corresponding to the template being executed.
 * The current date and time (`${execInfo.now}`), a `Calendar` object
   corresponding to the moment the template engine started its execution for
   this template.
-->
 * テンプレート名(`${execInfo.templateName}`): エンジンの実行時に指定される名前です。これは、処理するテンプレート名と一致します。
 * 現在日時(`${execInfo.now}`): テンプレートエンジンが現在のテンプレートの処理を開始した日時を示す `Calendar` オブジェクトです。

<!--
### Executing the template engine
-->
### テンプレートエンジンの実行

<!--
With our context object ready, all we need is executing the template engine
specifying the template name and the context, and passing on the response writer
so that the response can be written to it:
-->
コンテキストオブジェクトが準備できたので、あとはテンプレートエンジンを実行するだけです。テンプレート名とコンテキストとレスポンスライターを渡してレスポンスへの書き込みを行います:


```java
templateEngine.process("home", ctx, response.getWriter());
```

<!--
Let's see the results of this using the Spanish locale:
-->
ではスペイン語ロケールを使用して結果を見てみましょう:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <title>Good Thymes Virtual Grocery</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <link rel="stylesheet" type="text/css" media="all" href="/gtvg/css/gtvg.css" />
  </head>

  <body>
  
    <p>¡Bienvenido a nuestra tienda de comestibles!</p>

  </body>

</html>
```



<!--
3.2 More on texts and variables
-->
3.2 テキストと変数に関するその他のこと
-------------------------------

<!--
### Unescaped Text
-->
### エスケープなしのテキスト

<!--
The simplest version of our Home page seems to be ready now, but there is
something we have not thought about... what if we had a message like this?
-->
私たちのホームページの最もシンプルなバージョンは準備できましたが、もしメッセージが次のようなものだったらどうしましょう...

```java
home.welcome=Welcome to our <b>fantastic</b> grocery store!
```

<!--
If we execute this template like before, we will obtain:
-->
今のままでテンプレートを実行するとこのようになります:

```html
<p>Welcome to our &lt;b&gt;fantastic&lt;/b&gt; grocery store!</p>
```

<!--
Which is not exactly what we expected, because our `<b>` tag has been escaped
and therefore it will be displayed at the browser.
-->
これは本当に欲しい結果ではありません。 `<b>` タグがエスケープされてブラウザに表示されてしまっています。

<!--
This is the default behaviour of the th:text attribute. If we want Thymeleaf to
respect our XHTML tags and not escape them, we will have to use a different
attribute: `th:utext` (for "unescaped text"):
-->
これは th:text 属性のデフォルトの振る舞いです。ThymeleafでXHTMLタグをエスケープせずに表示したいのであれば、違う属性を使用しなければなりません: `th:utext` ("unescaped text"用):

```html
<p th:utext="#{home.welcome}">Welcome to our grocery store!</p>
This will output our message just like we wanted it:
<p>Welcome to our <b>fantastic</b> grocery store!</p>
```

<!--
### Using and displaying variables
-->
### 変数の使用と表示

<!--
Now let's add some more contents to our home page. For example, we could want to
display the date below our welcome message, like this:
-->
さて、私たちのホームページについてもう少し見てみましょう。例えば、ウェルカムメッセージに次のようなデータを表示したいかもしれません:

```
Welcome to our fantastic grocery store!

Today is: 12 july 2010
```

<!--
First of all, we will have to modify our controller so that we add that date as
a context variable:
-->
まずはじめに、コントローラーを修正してコンテキスト変数に日付を追加します:

```java
public void process(
        HttpServletRequest request, HttpServletResponse response,
        ServletContext servletContext, TemplateEngine templateEngine) {
        
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
    Calendar cal = Calendar.getInstance();
        
    WebContext ctx = 
        new WebContext(request, response, servletContext, request.getLocale());
    ctx.setVariable("today", dateFormat.format(cal.getTime()));
        
    templateEngine.process("home", ctx, response.getWriter());
      
}
```

<!--
We have added a `String` today variable to our context, and now we can display
it in our template:
-->
`String` 型のtoday変数をコンテキストに追加したので、テンプレートで表示することができるようになりました:

```html
<body>

  <p th:utext="#{home.welcome}">Welcome to our grocery store!</p>

  <p>Today is: <span th:text="${today}">13 February 2011</span></p>
  
</body>
```

<!--
As you can see, we are still using the `th:text` attribute for the job (and
that's correct, because we want to substitute the tag's body), but the syntax is
a little bit different this time and instead of a `#{...}` expression value, we
are using a `${...}` one. This is a variable expression value, and it contains
an expression in a language called _OGNL (Object-Graph Navigation Language)_
that will be executed on the context variables map.
-->
見ての通りここでも `th:text` 属性を使用しています(タグのボディを置換したいので、これで問題ありません)。ですが構文が少し違いますね。 `#{...}` 式ではなく `${...}` 式を使っています。これが変数用の式です。 _OGNL (Object-Graph Navigation Language)_ と呼ばれる言語の式でコンテキスト変数マップに対して処理を行います。

<!--
The `${today}` expression simply means "get the variable called today", but
these expressions could be more complex (like `${user.name}` for "get the
variable called user, and call its `getName()` method").
-->
この `${today}` は単純に「todayという名前の変数を取得する」という意味ですが、もっと複雑なこともできます(例えば `${user.name}` は「user変数を取得してその `getName()` メソッドを呼び出す」という意味になります)。

<!--
There are quite a lot of possibilities in attribute values: messages, variable
expressions... and quite a lot more. Next chapter will show us what all these
possibilities are.
-->
属性には様々な値を設定することができます: メッセージ、変数式...などなど。次の章では、どのようなものが指定できるかを全て見ていきましょう。

<!--
4 Standard Expression Syntax
-->
4 スタンダード式構文
============================

<!--
We will make a small break in the development of our grocery virtual store to
learn about one of the most important parts of the Thymeleaf Standard Dialect:
the Thymeleaf Standard Expression syntax.
-->
私たちの仮想食料品店の開発は少し休憩して、Thymeleafスタンダードダイアレクトの中でもっとも重要なものの一つについて学んでいきましょう: 「Thymeleafスタンダード式構文」です。

<!--
We have already seen two types of valid attribute values expressed in this
syntax: message and variable expressions:
-->
この構文を使って表現された2タイプの属性値を既に見てきました: メッセージ式と変数式です:

```html
<p th:utext="#{home.welcome}">Welcome to our grocery store!</p>

<p>Today is: <span th:text="${today}">13 february 2011</span></p>
```

<!--
But there are more types of value we don't know yet, and more interesting detail
to know about the ones we already know. First, let's see a quick summary of the
Standard Expression features:
-->
ですが、まだ知らないタイプがたくさんあります。また、知っているものにももっと面白い部分があります。初めにスタンダード式の機能の概要を見てみましょう。

<!--
 * Simple expressions:
    * Variable Expressions: `${...}`
    * Selection Variable Expressions: `*{...}`
    * Message Expressions: `#{...}`
    * Link URL Expressions: `@{...}`
 * Literals
    * Text literals: `'one text'`, `'Another one!'`,...
    * Number literals: `0`, `34`, `3.0`, `12.3`,...
    * Boolean literals: `true`, `false`
    * Null literal: `null`
    * Literal tokens: `one`, `sometext`, `main`,...
 * Text operations: 
    * String concatenation: `+`
    * Literal substitutions: `|The name is ${name}|`
 * Arithmetic operations:
    * Binary operators: `+`, `-`, `*`, `/`, `%`
    * Minus sign (unary operator): `-`
 * Boolean operations:
    * Binary operators: `and`, `or`
    * Boolean negation (unary operator): `!`, `not`
 * Comparisons and equality:
    * Comparators: `>`, `<`, `>=`, `<=` (`gt`, `lt`, `ge`, `le`)
    * Equality operators: `==`, `!=` (`eq`, `ne`)
 * Conditional operators:
    * If-then: `(if) ? (then)`
    * If-then-else: `(if) ? (then) : (else)`
    * Default: `(value) ?: (defaultvalue)`
-->
 * 単純式:
    * 変数式: `${...}`
    * 選択変数式: `*{...}`
    * メッセージ式: `#{...}`
    * リンクURL式: `@{...}`
 * リテラル
    * テキストリテラル: `'one text'`, `'Another one!'`,...
    * 数値リテラル: `0`, `34`, `3.0`, `12.3`,...
    * 真偽値リテラル: `true`, `false`
    * Nullリテラル: `null`
    * リテラルトークン: `one`, `sometext`, `main`,...
 * テキスト演算子: 
    * 文字列結合: `+`
    * リテラル置換: `|The name is ${name}|`
 * 算術演算子:
    * バイナリ演算子: `+`, `-`, `*`, `/`, `%`
    * マイナス符号 (単項演算子): `-`
 * 論理演算子:
    * 二項演算子: `and`, `or`
    * 論理否定演算子 (単項演算子): `!`, `not`
 * 比較と等価:
    * 比較演算子: `>`, `<`, `>=`, `<=` (`gt`, `lt`, `ge`, `le`)
    * 等価演算子: `==`, `!=` (`eq`, `ne`)
 * 条件演算子:
    * If-then: `(if) ? (then)`
    * If-then-else: `(if) ? (then) : (else)`
    * Default: `(value) ?: (defaultvalue)`

<!--
All these features can be combined and nested:
-->
これら全ての機能は、結合したりネストしたりすることができます:

```html
'User is of type ' + (${user.isAdmin()} ? 'Administrator' : (${user.type} ?: 'Unknown'))
```


<!--
4.1 Messages
-->
4.1 メッセージ
------------

<!--
As we already know, `#{...}` message expressions allow us to link this:
-->
ご存知の通り `#{...}` メッセージ式は次のように書いて:

```html
<p th:utext="#{home.welcome}">Welcome to our grocery store!</p>
```

<!--
...to this:
-->
...これとリンクすることができます:

```html
home.welcome=¡Bienvenido a nuestra tienda de comestibles!
```

<!--
But there's one aspect we still haven't thought of: what happens if the message
text is not completely static? What if, for example, our application knew who is
the user visiting the site at any moment and we wanted to greet him/her by name?
-->
でも、まだ考えていないことが一つあります: メッセージテキストが完全に静的ではない場合はどうしましょうか？例えば、アプリケーションは誰がサイトに訪れているかをいつでも知っているとして、その人の名前を呼んで挨拶文を出したい場合にはどのようにすればいいのでしょうか？

```html
<p>¡Bienvenido a nuestra tienda de comestibles, John Apricot!</p>
```

<!--
This means we would need to add a parameter to our message. Just like this:
-->
つまり、メッセージにパラメータを持たせる必要があるということです。こんなふうに:

```html
home.welcome=¡Bienvenido a nuestra tienda de comestibles, {0}!
```

<!--
Parameters are specified according to the `java.text.MessageFormat` standard
syntax, which means you could add format to numbers and dates as specified in
the API docs for that class.
-->
パラメータは `java.text.MessageFormat` の標準構文に従って指定します。つまり、そのクラスのAPIドキュメントにあるように、数値や日付にフォーマットを指定することもできるということです。

<!--
In order to specify a value for our parameter, and given an HTTP session
attribute called `user`, we would have:
-->
HTTPセッションに持っている `user` という属性をパラメータとして指定するには次のように記述します:

```html
<p th:utext="#{home.welcome(${session.user.name})}">
  Welcome to our grocery store, Sebastian Pepper!
</p>
```

<!--
If needed, several parameters could be specified, separated by commas. In fact,
the message key itself could come from a variable:
-->
必要に応じて複数のパラメータをカンマ区切りで指定することも可能です。実際のところ、メッセージキー自体も変数から取得することができます:

```html
<p th:utext="#{${welcomeMsgKey}(${session.user.name})}">
  Welcome to our grocery store, Sebastian Pepper!
</p>
```


<!--
4.2 Variables
-->
4.2 変数
-------------

<!--
We already mentioned that `${...}` expressions are in fact OGNL (Object-Graph
Navigation Language) expressions executed on the map of variables contained in
the context.
-->
既に述べたように `${...}` 式は、実際にはコンテキスト内の変数マップ上で実行されるOGNL(Object-Graph Navigation Language)式です。

<!--
> For detailed info about OGNL syntax and features, you should read the OGNL
> Language Guide at: [http://commons.apache.org/ognl/](http://commons.apache.org/ognl/)
-->
> OGNL構文や機能についての詳細はOGNL Language Guideを参照してください: [http://commons.apache.org/ognl/](http://commons.apache.org/ognl/)

<!--
From OGNL's syntax, we know that this:
-->
OGNL構文から次のようなことが分かります。以下の内容は:

```html
<p>Today is: <span th:text="${today}">13 february 2011</span>.</p>
```

<!--
...is in fact equivalent to this:
-->
...実際には次の内容と同等です:

```java
ctx.getVariables().get("today");
```

<!--
But OGNL allows us to create quite more powerful expressions, and that's how
this:
-->
ただし、OGNLではもっとパワフルな表現が可能です。こんな風に:

```html
<p th:utext="#{home.welcome(${session.user.name})}">
  Welcome to our grocery store, Sebastian Pepper!
</p>
```

<!--
...does in fact obtain the user name by executing:
-->
...これは、実際には次の処理を実行することでユーザー名を取得します:

```java
((User) ctx.getVariables().get("session").get("user")).getName();
```

<!--
But getter method navigation is just one of OGNL's features. Let's see some more:
-->
ですが、GetterメソッドのナビゲーションはOGNLの機能の1つにすぎません。もっと見てみましょう:

<!--
```java
/*
 * Access to properties using the point (.). Equivalent to calling property getters.
 */
${person.father.name}

/*
 * Access to properties can also be made by using brackets ([]) and writing 
 * the name of the property as a variable or between single quotes.
 */
${person['father']['name']}

/*
 * If the object is a map, both dot and bracket syntax will be equivalent to 
 * executing a call on its get(...) method.
 */
${countriesByCode.ES}
${personsByName['Stephen Zucchini'].age}

/*
 * Indexed access to arrays or collections is also performed with brackets, 
 * writing the index without quotes.
 */
${personsArray[0].name}

/*
 * Methods can be called, even with arguments.
 */
${person.createCompleteName()}
${person.createCompleteNameWithSeparator('-')}
```
-->
```java
/*
 * ポイント(.)を使用したプロパティへのアクセス。プロパティのGetterを呼び出すのと同じです。
 */
${person.father.name}

/*
 * プロパティへのアクセスは角括弧([])にプロパティ名を指定することでも可能です。
 * プロパティ名の指定は変数でも、シングルクォートで囲まれた文字列でも可能です。
 */
${person['father']['name']}

/*
 * オブジェクトがマップの場合、ドットも括弧も同様に get(...) メソッドを呼び出します。
 */
${countriesByCode.ES}
${personsByName['Stephen Zucchini'].age}

/*
 * 配列やコレクションに対するインデックスを使用したアクセスも同様に角括弧を使用します。
 * インデックスをクォートなしで書きます。
 */
${personsArray[0].name}

/*
 * メソッド呼び出しが可能です。引数ありでも可能です。
 */
${person.createCompleteName()}
${person.createCompleteNameWithSeparator('-')}
```

<!--
### Expression Basic Objects
-->
### 式の基本オブジェクト

<!--
When evaluating OGNL expressions on the context variables, some objects are made
available to expressions for higher flexibility. These objects will be
referenced (per OGNL standard) starting with the `#` symbol:
-->
コンテキスト変数に対してOGNL式で評価をする際に、より柔軟に記述できるようにいくつかのオブジェクトを用意しています。これらのオブジェクトの参照は(OGNL標準に従って) `#` シンボルで始まります:

<!--
 * `#ctx`: the context object.
 * `#vars:` the context variables.
 * `#locale`: the context locale.
 * `#httpServletRequest`: (only in Web Contexts) the `HttpServletRequest` object.
 * `#httpSession`: (only in Web Contexts) the `HttpSession` object.
-->
 * `#ctx`: コンテキストオブジェクト。
 * `#vars:` コンテキスト変数。
 * `#locale`: コンテキストロケール。
 * `#httpServletRequest`: (ウェブコンテキストのみ) `HttpServletRequest` オブジェクト。
 * `#httpSession`: (ウェブコンテキストのみ) `HttpSession` オブジェクト。

<!--
So we can do this:
-->
次のようなことができます:

```html
Established locale country: <span th:text="${#locale.country}">US</span>.
```

<!--
You can read the full reference of these objects in the
[Appendix A](#appendix-a-expression-basic-objects).
-->
詳細は [Appendix A](#appendix-a-expression-basic-objects) を参照して下さい。

<!--
### Expression Utility Objects
-->
### 式のユーティリティオブジェクト

<!--
Besides these basic objects, Thymeleaf will offer us a set of utility objects
that will help us perform common tasks in our expressions.
-->
基本オブジェクト以外にも、式の中の共通のタスクを手助けするためのユーティリティオブジェクトがあります。

<!--
 * `#dates`: utility methods for `java.util.Date` objects: formatting, component
   extraction, etc.
 * `#calendars`: analogous to `#dates`, but for `java.util.Calendar` objects.
 * `#numbers`: utility methods for formatting numeric objects.
 * `#strings`: utility methods for `String` objects: contains, startsWith,
   prepending/appending, etc.
 * `#objects`: utility methods for objects in general.
 * `#bools`: utility methods for boolean evaluation.
 * `#arrays`: utility methods for arrays.
 * `#lists`: utility methods for lists.
 * `#sets`: utility methods for sets.
 * `#maps`: utility methods for maps.
 * `#aggregates`: utility methods for creating aggregates on arrays or
   collections.
 * `#messages`: utility methods for obtaining externalized messages inside
   variables expressions, in the same way as they would be obtained using #{...} syntax.
 * `#ids`: utility methods for dealing with id attributes that might be repeated
   (for example, as a result of an iteration).
-->
 * `#dates`: `java.util.Date` オブジェクト用のユーティリティメソッド: フォーマット、コンポーネントの抽出など。
 * `#calendars`: `#dates` に似ていますが `java.util.Calendar` オブジェクト用です。
 * `#numbers`: 数値オブジェクト用のユーティリティメソッド。
 * `#strings`: `String` オブジェクト用のユーティリティメソッド: contains, startsWith,
   prepending/appending, など。
 * `#objects`: オブジェクト一般のユーティリティメソッド。
 * `#bools`: 真偽値評価用のユーティリティメソッド。
 * `#arrays`: 配列用のユーティリティメソッド。
 * `#lists`: リスト用のユーティリティメソッド。
 * `#sets`: セット用のユーティリティメソッド。
 * `#maps`: マップ用のユーティリティメソッド。
 * `#aggregates`: 配列やコレクション上での集約処理用ユーティリティメソッド。
 * `#messages`: #{...} と同様に、変数式内での外部化メッセージを取り扱うためのユーティリティメソッド。
 * `#ids`: (例えば、イテレーション結果などの)繰り返し処理内でid属性を取り扱うためのユーティリティメソッド。

<!--
You can check what functions are offered by each of these utility objects in the
[Appendix B](#appendix-b-expression-utility-objects).
-->
それぞれのユーティリティオブジェクトの詳細については [Appendix B](#appendix-b-expression-utility-objects) を参照してください。

<!--
### Reformatting dates in our home page
-->
### 私たちのホームページ内の日付を再フォーマット

<!--
Now we know about these utility objects, we could use them to change the way in
which we show the date in our home page. Instead of doing this in our `HomeController`:
-->
ユーティリティオブジェクトについて学んだので、それを使って私たちのホームページ内の日付表示を変えてみましょう。
次のように `HomeController` で処理する代わりに:

```java
SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
Calendar cal = Calendar.getInstance();

WebContext ctx = new WebContext(request, servletContext, request.getLocale());
ctx.setVariable("today", dateFormat.format(cal.getTime()));

templateEngine.process("home", ctx, response.getWriter());
```

<!--
...we can do just this:
-->
...次のように書いて:

```java
WebContext ctx = new WebContext(request, servletContext, request.getLocale());
ctx.setVariable("today", Calendar.getInstance());

templateEngine.process("home", ctx, response.getWriter());
```

<!--
...and then perform date formatting in the view layer itself:
-->
...ビュー側でフォーマットすることができます:

```html
<p>
  Today is: <span th:text="${#calendars.format(today,'dd MMMM yyyy')}">13 May 2011</span>
</p>
```


<!--
4.3 Expressions on selections (asterisk syntax)
-->
4.3 選択したものに対する式 (アスタリスク構文)
-----------------------------------------------

<!--
Variable expressions not only can be written in `${...}` expressions, but also
in `*{...}` ones.
-->
変数式は `${...}` だけでなく `*{...}` でも書くことができます。

<!--
There is an important difference, though: the asterisk syntax evaluates
expressions on selected objects rather than on the whole context variables map.
This is: as long as there is no selected object, the dollar and the asterisk 
syntaxes do exactly the same.
-->
重要な違いは、アスタリスク構文はコンテキスト変数マップに対してではなく、選択されたオブジェクトに対して評価をする式であるということです。選択されたオブジェクトがない場合は、ダラー構文もアスタリスク構文も全く同じになります。

<!--
And what is that object selection thing? A `th:object` attribute. Let's use it
in our user profile (`userprofile.html`) page:
-->
オブジェクトの選択とはどういうことでしょうか？ `th:object` のことです。では、ユーザープロフィールページ (`userprofile.html`) で使ってみましょう:

```html
  <div th:object="${session.user}">
    <p>Name: <span th:text="*{firstName}">Sebastian</span>.</p>
    <p>Surname: <span th:text="*{lastName}">Pepper</span>.</p>
    <p>Nationality: <span th:text="*{nationality}">Saturn</span>.</p>
  </div>
```
<!--
Which is exactly equivalent to:
-->
これは次と全く同じです:

```html
<div>
  <p>Name: <span th:text="${session.user.firstName}">Sebastian</span>.</p>
  <p>Surname: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nationality: <span th:text="${session.user.nationality}">Saturn</span>.</p>
</div>
```

<!--
Of course, dollar and asterisk syntax can be mixed:
-->
もちろん、ダラー構文とアスタリスク構文は共存可能です:

```html
<div th:object="${session.user}">
  <p>Name: <span th:text="*{firstName}">Sebastian</span>.</p>
  <p>Surname: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nationality: <span th:text="*{nationality}">Saturn</span>.</p>
</div>
```

<!--
When an object selection is in place, the selected object will be also available
to dollar expressions as the `#object` expression variable:
-->
ダラー構文内で `#object` 式変数を使用して選択されているオブジェクトを参照することもできます:

```html
<div th:object="${session.user}">
  <p>Name: <span th:text="${#object.firstName}">Sebastian</span>.</p>
  <p>Surname: <span th:text="${session.user.lastName}">Pepper</span>.</p>
  <p>Nationality: <span th:text="*{nationality}">Saturn</span>.</p>
</div>
```

<!--
As said, if no object selection has been performed, dollar and asterisk syntaxes
are exactly equivalent.
-->
繰り返しになりますが、オブジェクトが選択されていない場合はダラー構文とアスタリスク構文は全く同じ意味になります。

```html
<div>
  <p>Name: <span th:text="*{session.user.name}">Sebastian</span>.</p>
  <p>Surname: <span th:text="*{session.user.surname}">Pepper</span>.</p>
  <p>Nationality: <span th:text="*{session.user.nationality}">Saturn</span>.</p>
</div>
```


<!--
4.4 Link URLs
-->
4.4 リンクURL
-------------

<!--
Because of their importance, URLs are first-class citizens in web application
templates, and the _Thymeleaf Standard Dialect_ has a special syntax for them,
the `@` syntax: `@{...}`
-->
その重要性から、URLはウェブアプリケーションテンプレートにおけるファーストクラスオブジェクトであり「Thymeleafスタンダードダイアレクト」にも特別な構文が用意されています。 `@` 構文です: `@{...}`

<!--
There are different types of URLs:
-->
URLにはいくつかのタイプがあります:

<!--
 * Absolute URLs, like `http://www.thymeleaf.org`
 * Relative URLs, which can be:
    * Page-relative, like `user/login.html`
    * Context-relative, like `/itemdetails?id=3` (context name in server will be
      added automatically)
    * Server-relative, like `~/billing/processInvoice` (allows calling URLs in
      another context (= application) in the same server.
    * Protocol-relative URLs, like `//code.jquery.com/jquery-2.0.3.min.js`
-->
 * 絶対URL: `http://www.thymeleaf.org`
 * 相対URL:
    * ページ相対URL: `user/login.html`
    * コンテキスト相対URL: `/itemdetails?id=3` (サーバー内のコンテキスト名は自動的に付与されます)
    * サーバー相対URL: `~/billing/processInvoice` (同じサーバー内の異なるコンテキスト(= application)のURLを呼び出すことができます。)
    * プロトコル相対URL: `//code.jquery.com/jquery-2.0.3.min.js`

<!--
Thymeleaf can handle absolute URLs in any situation, but for relative ones it
will require you to use a context object that implements the `IWebContext`
interface, which contains some info coming from the HTTP request and needed to
create relative links.
-->
Thymeleafでは絶対URLはどんな場合でも使用できますが、相対URLを使用する場合は `IWebContext` を実装したコンテキストオブジェクトが必要です。そのコンテキストオブジェクトを使用して、相対リンクを生成するための情報をHTTPリクエスト内から取得します。

<!--
Let's use this new syntax. Meet the `th:href` attribute:
-->
ではこの新しい構文を使ってみましょう。 `th:href` 属性で使用します:

```html
<!-- Will produce 'http://localhost:8080/gtvg/order/details?orderId=3' (plus rewriting) -->
<a href="details.html" 
   th:href="@{http://localhost:8080/gtvg/order/details(orderId=${o.id})}">view</a>

<!-- Will produce '/gtvg/order/details?orderId=3' (plus rewriting) -->
<a href="details.html" th:href="@{/order/details(orderId=${o.id})}">view</a>

<!-- Will produce '/gtvg/order/3/details' (plus rewriting) -->
<a href="details.html" th:href="@{/order/{orderId}/details(orderId=${o.id})}">view</a>
```


<!--
Some things to note here:
-->
いくつか注意点:

<!--
 * `th:href` is an attribute modifier attribute: once processed, it will compute
   the link URL to be used and set the href attribute of the `<a>` tag to this
   URL.
 * We are allowed to use expressions for URL parameters (as you can see in `orderId=${o.id}`).
   The required URL-encoding operations will also be automatically performed.
 * If several parameters are needed, these will be separated by commas like `@{/order/process(execId=${execId},execType='FAST')}`
 * Variable templates are also allowed in URL paths, like `@{/order/{orderId}/details(orderId=${orderId})}`
 * Relative URLs starting with `/` (like `/order/details`) will be automatically
   prefixed the application context name.
 * If cookies are not enabled or this is not yet known, a `";jsessionid=..."`
   suffix might be added to relative URLs so that session is preserved. This is called _URL Rewriting_,
   and Thymeleaf allows you to plug in your own rewriting filters by using the `response.encodeURL(...)`
   mechanism from the Servlet API for every URL.
 * The `th:href` tag allowed us to (optionally) have a working static `href`
   attribute in our template, so that our template links remained navigable by a
   browser when opened directly for prototyping purposes.
-->
 * `th:href` は属性変更用の属性です: リンクURLを生成し `<a>` タグのhref属性にセットします。
 * URLパラメータを指定することができます(`orderId=${o.id}` の部分です)。自動的にURLエンコーディングされます。
 * 複数のパラメータを指定する場合はカンマ区切りで指定できます `@{/order/process(execId=${execId},execType='FAST')}`
 * URLパス内でも変数式は使用可能です `@{/order/{orderId}/details(orderId=${orderId})}`
 * `/` で始まる相対URL(`/order/details`)に対しては、自動的にアプリケーションコンテキスト名を前に付けます。
 * クッキーが使用できない場合、またはまだ分からない場合は `";jsessionid=..."` を相対URLの最後につけてセッションをキープできるようにすることがあります。これは _URL Rewriting_ と呼ばれていますが、Thymeleafでは全てのURLに対してサーブレットAPIの `response.encodeURL(...)` のメカニズムを使用して独自リライトフィルタを追加することができます。
 * `th:href` タグを使用する場合、(任意ですが)静的な `href` 属性をテンプレートに同時に指定することができます。そうすることでプロトタイプ用途などで直接テンプレートをブラウザで開いた場合でもリンクを有効にすることができます。

<!--
As was the case with the message syntax (`#{...}`), URL bases can also be the
result of evaluating another expression:
-->
メッセージ構文(`#{...}`)のときと同様に、URL構文でも他の式の評価結果が使用可能です。

```html
<a th:href="@{${url}(orderId=${o.id})}">view</a>
<a th:href="@{'/details/'+${user.login}(orderId=${o.id})}">view</a>
```

<!--
### A menu for our home page
-->
### 私たちのホームページ用のメニュー

<!--
Now we know how to create link URLs, what about adding a small menu in our home
for some of the other pages in the site?
-->
リンクURLの作成方法がわかったので、ホームにサイト内の他のページへの小さなメニューを加えてみましょうか。

```html
<p>Please select an option</p>
<ol>
  <li><a href="product/list.html" th:href="@{/product/list}">Product List</a></li>
  <li><a href="order/list.html" th:href="@{/order/list}">Order List</a></li>
  <li><a href="subscribe.html" th:href="@{/subscribe}">Subscribe to our Newsletter</a></li>
  <li><a href="userprofile.html" th:href="@{/userprofile}">See User Profile</a></li>
</ol>
```


<!--
### Server root relative URLs
-->
### サーバールート相対URL

<!--
An additional syntax can be used to create server-root-relative (instead of context-root-relative)
URLs in order to link to different contexts in the same server. These URLs will be specified like
`@{~/path/to/something}`
-->
追加のシンタックスを使用して、(コンテキストルート相対URLの代わりに)サーバールート相対URLを作成することができます。 `@{~/path/to/something}` のように指定することで、同じサーバーの異なるコンテキストへのリンクを作成することができます。


<!--
4.5 Literals
-->
4.5 リテラル
------------

<!--
###Text literals
-->
###テキストリテラル

<!--
Text literals are just character strings specified between single quotes. They can include any character, but you should escape any single quotes inside them as `\'`.
-->
テキストリテラルはシングルクォートで囲まれた文字列です。どんな文字でも大丈夫ですが、シングルクォート自体は `\'` のようにエスケープしてください。

```html
<p>
  Now you are looking at a <span th:text="'working web application'">template file</span>.
</p>
```

<!--
###Number literals
-->
###数値リテラル

<!--
Numeric literals look exactly like what they are: numbers.
-->
数値リテラルは数字そのままです。

```html
<p>The year is <span th:text="2013">1492</span>.</p>
<p>In two years, it will be <span th:text="2013 + 2">1494</span>.</p>
```

<!--
###Boolean literals
-->
###真偽値リテラル

<!--
The boolean literals are `true` and `false`. For example:
-->
真偽値リテラルは `true` と `false` です:

```html
<div th:if="${user.isAdmin()} == false"> ...
```

<!--
Note that in the above example, the `== false` is written outside the braces, and thus
it is Thymeleaf itself who takes care of it. If it were written inside the braces, it would
be the responsibility of the OGNL/SpringEL engines:
-->
ここで注意して欲しいのは、 `== false` が括弧の外側にあるということです。この場合はThymeleaf自身が処理します。もし括弧の中にある場合は、OGNL/SpringELのエンジンが処理を担当します。

```html
<div th:if="${user.isAdmin() == false}"> ...
```


<!--
###The null literal
-->
###nullリテラル

<!--
The `null` literal can be also used:
-->
`null` リテラルも使用可能です:

```html
<div th:if="${variable.something} == null"> ...
```

<!--
###Literal tokens
-->
###リテラルトークン

<!--
Numeric, boolean and null literals are in fact a particular case of _literal tokens_.
-->
数値、真偽値、nullリテラルは実は「リテラルトークン」の特定のケースなのです。

<!--
These tokens allow a little bit of simplification in Standard Expressions. They work exactly the same as text literals (`'...'`), but they only allow letters (`A-Z` and `a-z`),
numbers (`0-9`), brackets (`[` and `]`), dots (`.`), hyphens (`-`) and underscores (`_`).
So no whitespaces, no commas, etc.
-->
このリテラルトークンはスタンダード式を少しだけシンプルにしてくれます。テキストリテラル(`'...'`)と全く同様の動きをしますが次の文字しか使用できません: 文字(`A-Z` and `a-z`)、数字(`0-9`)、括弧(`[` と `]`), ドット (`.`), ハイフン (`-`) アンダースコア (`_`)。ですので、空白文字やカンマ等は使用できません。

<!--
The nice part? Tokens don't need any quotes surrounding them. So we can do this:

```html
<div th:class="content">...</div>
```

instead of:

```html
<div th:class="'content'">...</div>
```
-->
この利点は何でしょうか？それはトークンはクォートで囲む必要がないという点です。ですので、次のように書く代わりに:

```html
<div th:class="'content'">...</div>
```

こう書くことができます:

```html
<div th:class="content">...</div>
```

<!--
4.6 Appending texts
-->
4.6 テキストの追加
-------------------

<!--
Texts, no matter whether they are literals or the result of evaluating variable or message expressions, can be easily appended using the `+` operator:
-->
テキストは `+` 演算子で追加できます。文字列リテラルであっても、値やメッセージ式の評価結果であっても大丈夫です:

```html
th:text="'The name of the user is ' + ${user.name}"
```



<!--
4.7 Literal substitutions
-->
4.7 リテラル置換
-------------------------

<!--
Literal substitutions allow the easy formatting of strings containing values from variables without the need to append literals with `'...' + '...'`.
-->
リテラル置換を使用すると複数の変数から文字列を作成するフォーマットが簡単になります。 `'...' + '...'` のようにリテラルを追加する必要がありません。

<!--
These substitutions must be surrounded by vertical bars (`|`), like:
-->
リテラル置換を使用する場合は、縦棒(`|`)で囲みます:

```html
<span th:text="|Welcome to our application, ${user.name}!|">
```

<!--
Which is actually equivalent to:
-->
これは以下の内容と同じです:

```html
<span th:text="'Welcome to our application, ' + ${user.name} + '!'">
```

<!--
Literal substitutions can be combined with other types of expressions:
-->
リテラル置換は他の式と組み合わせて使用することができます:

```html
<span th:text="${onevar} + ' ' + |${twovar}, ${threevar}|">
```

<!--
**Note:** only variable expressions (`${...}`) are allowed inside `|...|` literal substitutions. No other literals (`'...'`), boolean/numeric tokens, conditional expressions etc. are. 
-->
**注意点:** リテラル置換(`|...|`)内で使用可能なのは、変数式(`${...}`)だけです。他のリテラル(`'...'`)や真偽値/数値トークンや条件式などは使用できません。


<!--
4.8 Arithmetic operations
-->
4.8 算術演算子
-------------------------

<!--
Some arithmetic operations are also available: `+`, `-`, `*`, `/` and `%`.
-->
いくつかの算術演算子が使用可能です: `+`, `-`, `*`, `/`, `%`

```html
th:with="isEven=(${prodStat.count} % 2 == 0)"
```

<!--
Note that these operators can also be applied inside OGNL variable expressions
themselves (and in that case will be executed by OGNL instead of the Thymeleaf
Standard Expression engine):
-->
この演算子はOGNL変数式の中でも使用可能なことに注意して下さい(その場合はThymeleafスタンダード式エンジンの代わりにOGNLによって計算されます)。

```html
th:with="isEven=${prodStat.count % 2 == 0}"
```

<!--
Note that textual aliases exist for some of these operators: `div` (`/`), `mod` (`%`).
-->
いくつかの演算子には文字列エイリアスもあります: `div` (`/`), `mod` (`%`)


<!--
4.9 Comparators and Equality
-->
4.9 比較演算子と等価演算子
----------------------------

<!--
Values in expressions can be compared with the `>`, `<`, `>=` and `<=` symbols,
as usual, and also the `==` and `!=` operators can be used to check equality (or
the lack of it). Note that XML establishes that the `<` and `>` symbols should
not be used in attribute values, and so they should be substituted by `&lt;` and
`&gt;`.
-->
式の中の値は `>`, `<`, `>=`, `<=` シンボルで比較できます。また、 `==` と `!=` 演算子で等価性を確認できます。ただし、XMLの属性値には `<` と `>` を使用すべきではないと策定されていますので、代わりに `&lt;` と `&gt;` を使用すべきです。

```html
th:if="${prodStat.count} &gt; 1"
th:text="'Execution mode is ' + ( (${execMode} == 'dev')? 'Development' : 'Production')"
```

<!--
Note that textual aliases exist for some of these operators: `gt` (`>`), `lt` (`<`), `ge`
(`>=`), `le` (`<=`), `not` (`!`). Also `eq` (`==`), `neq`/`ne` (`!=`).
-->
文字列エイリアスもあります: `gt` (`>`), `lt` (`<`), `ge` (`>=`), `le` (`<=`), `not` (`!`), `eq` (`==`), `neq`/`ne` (`!=`)。


<!--
4.10 Conditional expressions
-->
4.10 条件式
---------------------------

<!--
_Conditional expressions_ are meant to evaluate only one of two expressions
depending on the result of evaluating a condition (which is itself another
expression).
-->
「条件式」は条件(それ自体が別の式です)を評価した結果によって、2つのうちのどちらかの式を評価することを意味します。

<!--
Let's have a look at an example fragment (introducing another _attribute modifier_,
this time `th:class`):
-->
例を見てみましょう(今回は `th:class` という「属性変更子」を使用しますね):

```html
<tr th:class="${row.even}? 'even' : 'odd'">
  ...
</tr>
```

<!--
All three parts of a conditional expression (`condition`, `then` and `else`) are
themselves  expressions, which means that they can be variables (`${...}`, `*{...}`),
messages (`#{...}`), URLs (`@{...}`) or literals (`'...'`).
-->
条件式の3つのパーツ全て(`condition`, `then` and `else`)がそれぞれ式になっています。つまり、変数(`${...}`, `*{...}`)やメッセージ(`#{...}`)や、URL(`@{...}`)やリテラル(`'...'`)を使うことができるということです。

<!--
Conditional expressions can also be nested using parentheses:
-->
条件式は括弧で囲むことでネスト可能です:

```html
<tr th:class="${row.even}? (${row.first}? 'first' : 'even') : 'odd'">
  ...
</tr>
```

<!--
Else expressions can also be omitted, in which case a null value is returned if
the condition is false:
-->
Else式は省略可能です。その場合、条件がfalseのときにはnull値が返されます。

```html
<tr th:class="${row.even}? 'alt'">
  ...
</tr>
```


<!--
4.11 Default expressions (Elvis operator)
-->
4.11 デフォルト式 (エルビス演算子)
-----------------------------------------

<!--
A _default expression_ is a special kind of conditional value without a _then_
part. It is equivalent to the _Elvis operator_ present in some languages like
Groovy, and allows to specify two  expressions, being the second one evaluated
only in the case of the first one returning null.
-->
「デフォルト式」は「then」のない特別な条件式です。Groovyなどの「エルビス演算子」と同じです。2つの式を指定して最初の式がnullを返した場合にのみ2番目の式の値が評価されます。

<!--
Let's see it in action in our user profile page:
-->
実際にユーザープロフィールページを見てみましょう:

```html
<div th:object="${session.user}">
  ...
  <p>Age: <span th:text="*{age}?: '(no age specified)'">27</span>.</p>
</div>
```

<!--
As you can see, the operator is `?:`, and we use it here to specify a default
value for a name (a literal value, in this case) only if the result of
evaluating `*{age}` is null. This is therefore equivalent to:
-->
演算子は `?:` です。年齢(`*{age}`)がnullの場合にのみラベル(今回はリテラル値)を表示します。つまり、以下の内容と同じです:

```html
<p>Age: <span th:text="*{age != null}? *{age} : '(no age specified)'">27</span>.</p>
```

<!--
As with conditional values, they can contain nested expressions between
parentheses:
-->
括弧で囲むことでネスト可能です:

```html
<p>
  Name: 
  <span th:text="*{firstName}?: (*{admin}? 'Admin' : #{default.username})">Sebastian</span>
</p>
```


<!--
4.12 Preprocessing
-->
4.12 プリプロセッシング
------------------

<!--
In addition to all these features for expression processing, Thymeleaf offers to
us the possibility of _preprocessing_ expressions.
-->
ここまで見てきた式に加えて、Thymeleafは「プリプロセッシング」式を提供します。

<!--
And what is that preprocessing thing? It is an execution of the expressions done
before the normal one, that allows the modification of the actual expression
that will be eventually executed.
-->
プリプロセッシングとはどういうことでしょうか？それは、通常の式よりも先に評価されるということです。それによって、最終的に実行される実際の式の変更をすることができます。

<!--
Preprocessed expressions are exactly like normal ones, but appear surrounded by
a double underscore symbol (like `__${expression}__`).
-->
プリプロセッシング式は普通の式と全く同じように書くことができますが、二重のアンダースコアで囲まれています(`__${expression}__`)。

<!--
Let's imagine we have an i18n `Messages_fr.properties` entry containing an OGNL
expression calling a language-specific static method, like:
-->
i18nの `Messages_fr.properties` のエントリに言語特有のスタティックメソッドを呼び出すようなOGNL式が含まれているとしましょう:

```java
article.text=@myapp.translator.Translator@translateToFrench({0})
```

<!--
...and a `Messages_es.properties equivalent`:
-->
... `Messages_es.properties` の対応する部分:


```java
article.text=@myapp.translator.Translator@translateToSpanish({0})
```

<!--
We can create a fragment of markup that evaluates one expression or the other
depending on the locale. For this, we will first select the expression (by
preprocessing) and then let Thymeleaf execute it:
-->
ロケールに応じた式を評価してマークアップを作成する必要があるので、まずは(プリプロセッシングで)式を選択して、その次にThymeleafにそれを実行させます:

```html
<p th:text="${__#{article.text('textVar')}__}">Some text here...</p>
```

<!--
Note that the preprocessing step for a French locale will be creating the
following equivalent:
-->
フランス語ロケールの場合のプリプロセッシングは次と同等になります:

```html
<p th:text="${@myapp.translator.Translator@translateToFrench(textVar)}">Some text here...</p>
```

<!--
The preprocessing String `__` can be escaped in attributes using `\_\_`.
-->
プリプロセッシング用文字列 `__` は属性の中では `\_\_` とエスケープします。


<!--
5 Setting Attribute Values
-->
5 属性値を設定する
==========================

<!--
This chapter will explain the way in which we can set (or modify) values of
attributes in our markup tags, possibly the next most basic feature we will need
after setting the tag body content.
-->
この章ではThymeleafでどのようにしてマークアップタグ内の属性値を設定(または変更)するかを説明します。タグのボディの内容を設定する機能の次に必要な基本機能かもしれません。

<!--
5.1 Setting the value of any attribute
-->
5.1 任意の属性に値を設定する
--------------------------------------

<!--
Say our website publishes a newsletter, and we want our users to be able to
subscribe to it, so we create a `/WEB-INF/templates/subscribe.html` template
with a form:
-->
私たちのウェブサイトでニュースレターを発行するとしましょう。ユーザーが購読できるようにしたいので `/WEB-INF/templates/subscribe.html` テンプレートにフォームを設置します:

```html
<form action="subscribe.html">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="Subscribe me!" />
  </fieldset>
</form>
```

<!--
It looks quite OK, but the fact is that this file looks more like a static XHTML
page than a template for a web application. First, the action attribute in our
form statically links to the template file itself, so that there is no place
for useful URL rewriting. Second, the value attribute in the submit button makes
it display a text in English, but we'd like it to be internationalized.
-->
これで全然問題ないように見えます。しかし実際はこのファイルはウェブアプリケーションのテンプレートというよりは静的なXHTMLに見えます。まず、action属性がこのテンプレートファイル自身への静的リンクなので、URLを書き換える方法がありません。次に、submitボタンのvalue属性は英語で表示されますが多言語対応したいですよね。

<!--
Enter then the `th:attr` attribute, and its ability to change the value of
attributes of the tags it is set in:
-->
ということで `th:attr` 属性を使いましょう。これで、タグの中の属性値を変更することができます。

```html
<form action="subscribe.html" th:attr="action=@{/subscribe}">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="Subscribe me!" th:attr="value=#{subscribe.submit}"/>
  </fieldset>
</form>
```

<!--
The concept is quite straightforward: `th:attr` simply takes an expression that
assigns a value to an attribute. Having created the corresponding controller and
messages files, the result of processing this file will be as expected:
-->
コンセプトは非常に直感的です: `th:attr` には単純に属性に値を代入する式を書きます。対応するコントローラーやメッセージファイルを作成することによって、想定通りの処理結果が得られます:

```html
<form action="/gtvg/subscribe">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="¡Suscríbeme!"/>
  </fieldset>
</form>
```

<!--
Besides the new attribute values, you can also see that the application context
name has been automatically prefixed to the URL base in `/gtvg/subscribe`, as
explained in the previous chapter.
-->
新しい属性の値が使用されていることに加えて `/gtvg/subscribe` のURLには、既に説明したようにアプリケーションコンテキスト名が自動的に付け加えられています。

<!--
But what if we wanted to set more than one attribute at a time? XML rules do not
allow you to set an attribute twice in a tag, so `th:attr` will take a
comma-separated list of assignments, like:
-->
同時に複数の属性に値を設定したい場合はどうしたらよいでしょうか？XMLでは1つのタグの中に同じ属性を2つ以上書くことはできませんので `th:attr` にカンマ区切りのリストを指定します:

```html
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

<!--
Given the required messages files, this will output:
-->
メッセージファイルを用意すれば、このような出力になります:

```html
<img src="/gtgv/images/gtvglogo.png" title="Logo de Good Thymes" alt="Logo de Good Thymes" />
```


<!--
5.2 Setting value to specific attributes
-->
5.2 特定の属性に値を設定する
----------------------------------------

<!--
By now, you might be thinking that something like:
-->
ここまでで、次のような書き方はすごく汚いなぁと思っているかもしれませんね:

```html
<input type="submit" value="Subscribe me!" th:attr="value=#{subscribe.submit}"/>
```

<!--
...is quite an ugly piece of markup. Specifying an assignment inside an
attribute's value can be very practical, but it is not the most elegant way of
creating templates if you have to do it all the time.
-->
属性の中で値を設定するというのはとても実用的ではありますが、常にそうしないといけないというのはエレガントではありません。

<!--
Thymeleaf agrees with you. And that's why in fact `th:attr` is scarcely used in
templates. Normally, you will be using other `th:*` attributes whose task is
setting specific tag attributes (and not just any attribute like `th:attr`).
-->
ですよね。なので実際のところ `th:attr` 属性はテンプレート内ではほとんど使われません。通常は `th:*` 属性を使用します。この属性を使用すると(`th:attr` のような任意の属性ではなく)特定のタグ属性に値を設定することができます。

<!--
And which attribute does the Standard Dialect offer us for setting the `value`
attribute of our button? Well, in a rather obvious manner, it's `th:value`. Let's
have a look:
-->
ではスタンダードダイアレクトでボタンの `value` 属性に値を設定するにはどのような属性を使用すればいいのでしょうか？これはかなり分かりやすいと思います。 `th:value` です。では見てみましょう:

```html
<input type="submit" value="Subscribe me!" th:value="#{subscribe.submit}"/>
```

<!--
This looks much better!. Let's try and do the same to the `action` attribute in
the `form` tag:
-->
この方が全然良いですよね！同様に `form` タグの `action` 属性も見てみましょう:

```html
<form action="subscribe.html" th:action="@{/subscribe}">
```

<!--
And do you remember those `th:href` we put in our `home.html` before? They are
exactly this same kind of attributes:
-->
`th:href` 属性を `home.html` で使用したのを覚えていますか？これも同じです:

```html
<li><a href="product/list.html" th:href="@{/product/list}">Product List</a></li>
```

<!--
There are quite a lot of attributes like these, each of them targeting a
specific XHTML or HTML5 attribute:
-->
このような属性が非常にたくさん用意されていて、それぞれが特定のXHTMLやHTML5のタグを対象にしています:

<div class="table-scroller">
|-----------------------+-----------------------+-----------------------|
|`th:abbr`              |`th:accept`            |`th:accept-charset`    |
|`th:accesskey`         |`th:action`            |`th:align`             |
|`th:alt`               |`th:archive`           |`th:audio`             |
|`th:autocomplete`      |`th:axis`              |`th:background`        |
|`th:bgcolor`           |`th:border`            |`th:cellpadding`       |
|`th:cellspacing`       |`th:challenge`         |`th:charset`           |
|`th:cite`              |`th:class`             |`th:classid`           |
|`th:codebase`          |`th:codetype`          |`th:cols`              |
|`th:colspan`           |`th:compact`           |`th:content`           |
|`th:contenteditable`   |`th:contextmenu`       |`th:data`              |
|`th:datetime`          |`th:dir`               |`th:draggable`         |
|`th:dropzone`          |`th:enctype`           |`th:for`               |
|`th:form`              |`th:formaction`        |`th:formenctype`       |
|`th:formmethod`        |`th:formtarget`        |`th:frame`             |
|`th:frameborder`       |`th:headers`           |`th:height`            |
|`th:high`              |`th:href`              |`th:hreflang`          |
|`th:hspace`            |`th:http-equiv`        |`th:icon`              |
|`th:id`                |`th:keytype`           |`th:kind`              |
|`th:label`             |`th:lang`              |`th:list`              |
|`th:longdesc`          |`th:low`               |`th:manifest`          |
|`th:marginheight`      |`th:marginwidth`       |`th:max`               |
|`th:maxlength`         |`th:media`             |`th:method`            |
|`th:min`               |`th:name`              |`th:optimum`           |
|`th:pattern`           |`th:placeholder`       |`th:poster`            |
|`th:preload`           |`th:radiogroup`        |`th:rel`               |
|`th:rev`               |`th:rows`              |`th:rowspan`           |
|`th:rules`             |`th:sandbox`           |`th:scheme`            |
|`th:scope`             |`th:scrolling`         |`th:size`              |
|`th:sizes`             |`th:span`              |`th:spellcheck`        |
|`th:src`               |`th:srclang`           |`th:standby`           |
|`th:start`             |`th:step`              |`th:style`             |
|`th:summary`           |`th:tabindex`          |`th:target`            |
|`th:title`             |`th:type`              |`th:usemap`            |
|`th:value`             |`th:valuetype`         |`th:vspace`            |
|`th:width`             |`th:wrap`              |`th:xmlbase`           |
|`th:xmllang`           |`th:xmlspace`          |                       |
</div>


<!--
5.3 Setting more than one value at a time
-->
5.3 複数の値を同時に設定する
-----------------------------------------

<!--
There are two rather special attributes called `th:alt-title` and `th:lang-xmllang`
which can be used for setting two attributes to the same value at the same time.
Specifically:
-->
ここでは2つのちょっと特別な属性を紹介します。 `th:alt-title` と `th:lang-xmllang` です。2つの属性に同じ値を同時に指定することができます。具体的には:

<!--
 * `th:alt-title` will set `alt` and `title`. 
 * `th:lang-xmllang` will set `lang` and `xml:lang`.
-->
 * `th:alt-title` は `alt` と `title` を設定します。
 * `th:lang-xmllang` は `lang` と `xml:lang` を設定します。

<!--
For our GTVG home page, this will allow us to substitute this:
-->
私たちのGTVGホームページで次のように書いている部分は:

```html
<img src="../../images/gtvglogo.png" 
     th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}" />
```

<!--
...or this, which is equivalent:
-->
このように書くこともできますし:

```html
<img src="../../images/gtvglogo.png" 
     th:src="@{/images/gtvglogo.png}" th:title="#{logo}" th:alt="#{logo}" />
```

<!--
...by this:
-->
このように書くこともできます:

```html
<img src="../../images/gtvglogo.png" 
     th:src="@{/images/gtvglogo.png}" th:alt-title="#{logo}" />
```


<!--
5.4 Appending and prepending
-->
5.4 前後に追加する
----------------------------

<!--
Working in an equivalent way to `th:attr`, Thymeleaf offers the `th:attrappend`
and `th:attrprepend` attributes, which append (suffix) or prepend (prefix) the
result of their evaluation to the existing attribute values.
-->
`th:attr` と同じように任意の属性に対して作用するものとして、Thymeleafには `th:attrappend` と `th:attrprepend` 属性があります。既存の属性値の前や後ろに評価結果を付け加えるための属性です。

<!--
For example, you might want to store the name of a CSS class to be added (not
set, just added) to one of your buttons in a context variable, because the
specific CSS class to be used would depend on something that the user did before.
Easy:
-->
例えばあるボタンに対して、ユーザーが何をしたかによって異なるCSSクラスを追加(設定ではなく追加)したい場合が考えられます。これは簡単です:

```html
<input type="button" value="Do it!" class="btn" th:attrappend="class=${' ' + cssStyle}" />
```

<!--
If you process this template with the `cssStyle` variable set to `"warning"`,
you will get:
-->
`cssStyle` 変数に `"warning"` という値を設定してテンプレートを処理すると次の結果が得られます:

```html
<input type="button" value="Do it!" class="btn warning" />
```

<!--
There are also two specific _appending attributes_ in the Standard Dialect: the `th:classappend`
and `th:styleappend` attributes, which are used for adding a CSS class or a fragment of _style_ to an element without
overwriting the existing ones:
-->
スタンダードダイアレクトには2つの特別な属性追加用の属性があります: `th:classappend` と `th:styleappend` です。CSSクラスや _style_ の一部を既存のものを上書きせずに追加します:

```html
<tr th:each="prod : ${prods}" class="row" th:classappend="${prodStat.odd}? 'odd'">
```

<!--
(Don't worry about that `th:each` attribute. It is an _iterating attribute_ and
we will talk about it later.)
-->
(`th:each` 属性のことは心配しないでください。「繰り返し用の属性」として後ほど説明します。)


<!--
5.5 Fixed-value boolean attributes
-->
5.5 固定値ブール属性
----------------------------------

<!--
Some XHTML/HTML5 attributes are special in that, either they are present in
their elements with a specific and fixed value, or they are not present at all.
-->
XHTML/HTML5属性の中には、決まった値を持つか、その属性自体が存在しないかのどちらか、という特別な属性があります。

<!--
For example, `checked`:
-->
例えば `checked` です:

```html
<input type="checkbox" name="option1" checked="checked" />
<input type="checkbox" name="option2" />
```

<!--
No other value than `"checked"` is allowed according to the XHTML standards for
the `checked` attribute (HTML5 rules are a little more relaxed on that). And the
same happens with `disabled`, `multiple`, `readonly` and `selected`.
-->
XHTML標準では `checked` 属性には `"checked"` という値しか設定できません(HTML5では少し緩いですが)。 `disabled`, `multiple`, `readonly` と `selected` も同様です。

<!--
The Standard Dialect includes attributes that allow you to set these attributes
by evaluating a condition, so that if evaluated to true, the attribute will be
set to its fixed value, and if evaluated to false, the attribute will not be set:
-->
これらの属性に対して条件の結果によって値を設定するための属性を、スタンダードダイアレクトでは提供しています。条件の評価結果がtrueの場合はその固定値が設定され、falseの場合は属性自体が設定されません:

```html
<input type="checkbox" name="active" th:checked="${user.active}" />
```

<!--
The following fixed-value boolean attributes exist in the Standard Dialect:
-->
スタンダードダイアレクトには次のような固定値ブール属性があります:

<div class="table-scroller">
|-------------------+-------------------+-------------------|
|`th:async`         |`th:autofocus`     |`th:autoplay`      |
|`th:checked`       |`th:controls`      |`th:declare`       |
|`th:default`       |`th:defer`         |`th:disabled`      |
|`th:formnovalidate`|`th:hidden`        |`th:ismap`         |
|`th:loop`          |`th:multiple`      |`th:novalidate`    |
|`th:nowrap`        |`th:open`          |`th:pubdate`       |
|`th:readonly`      |`th:required`      |`th:reversed`      |
|`th:scoped`        |`th:seamless`      |`th:selected`      |
</div>


<!--
5.6 Support for HTML5-friendly attribute and element names
-->
5.6 HTML5フレンドリーな属性や要素名のサポート
----------------------------------------------------------

<!--
It is also possible to use a completely different syntax to apply processors to your templates, more HTML5-friendly.
-->
よりHTML5フレンドリーな書き方もできます。これは全く異なる構文になります。

```html	
<table>
    <tr data-th-each="user : ${users}">
        <td data-th-text="${user.login}">...</td>
        <td data-th-text="${user.name}">...</td>
    </tr>
</table>
```

<!--
The `data-{prefix}-{name}` syntax is the standard way to write custom attributes in HTML5, without requiring developers to use any namespaced names like `th:*`. Thymeleaf makes this syntax automatically available to all your dialects (not only the Standard ones).
-->
`data-{prefix}-{name}` 構文は、 `th:*` などの名前空間を使用せずに独自属性を書くためのHTML5での標準的な方法です。Thymeleafでは、(スタンダードダイアレクトだけでなく)全てのダイアレクトでこの構文を使用することができます。

<!--
There is also a syntax to specify custom tags: `{prefix}-{name}`, which follows the _W3C Custom Elements specification_ (a part of the larger _W3C Web Components spec_). This can be used, for example, for the `th:block` element (or also `th-block`), which will be explained in a later section. 
-->
`{prefix}-{name}` という形式で独自タグを指定するための構文もあります。これは _W3C Custom Elements specification_ (より大きな _W3C Web Components spec_ の一部です)に準拠しています。例えば `th:block` 要素(または `th-block` )で使用することができますが、これについては後述します。

<!--
**Important:** this syntax is an addition to the namespaced `th:*` one, it does not replace it. There is no intention at all to deprecate the namespaced syntax in the future. 
-->
**重要:** この構文は名前空間を使用した `th:*` に追加された機能であって、置き換えるものではありません。将来的に名前空間構文を非推奨にする意図は全くありません。



<!--
6 Iteration
-->
6 繰り返し処理
===========

<!--
So far we have created a home page, a user profile page and also a page for
letting users subscribe to our newsletter... but what about our products?
Shouldn't we build a product list to let visitors know what we sell? Well,
obviously yes. And there we go now.
-->
ここまでホームページとしてユーザープロフィールページと、ニュースレター購読ページを作ってきました。ですが、商品についてはどうでしょう？訪問者に、私たちの商品を知ってもらうための商品一覧ページを作るべきではないでしょうか？えぇ、明らかにYesですね。ではそうしましょう。


<!--
6.1 Iteration basics
-->
6.1 繰り返し処理の基礎
--------------------

<!--
For listing our products in our `/WEB-INF/templates/product/list.html` page we
will need a table. Each of our products will be displayed in a row (a `<tr>`
element), and so for our template we will need to create a _template row_ ーーーone
that will exemplify how we want each product to be displayedーーー and then instruct
Thymeleaf to _iterate it_ once for each product.
-->
`/WEB-INF/templates/product/list.html` ページに商品一覧を掲載するためにテーブルが必要です。1行(`<tr>` 要素)に1商品ずつ表示したいので、テンプレートの中に「テンプレート行」(各商品がどのように表示されるかを示す行)を作って、それをThymeleafで商品ごとに繰り返す必要があります。

<!--
The Standard Dialect offers us an attribute for exactly that, `th:each`.
-->
スタンダードダイアレクトにはそのための属性があります。 `th:each` です。

<!--
### Using th:each
-->
### th:each を使用する

<!--
For our product list page, we will need a controller that retrieves the list of
products from the service layer and adds it to the template context:
-->
商品一覧ページのコントローラーはサービスレイヤから商品一覧を取得してテンプレートコンテキストにそれを追加します:

```java
public void process(
        HttpServletRequest request, HttpServletResponse response,
        ServletContext servletContext, TemplateEngine templateEngine) {

    ProductService productService = new ProductService();
    List<Product> allProducts = productService.findAll(); 

    WebContext ctx = new WebContext(request, servletContext, request.getLocale());
    ctx.setVariable("prods", allProducts);

    templateEngine.process("product/list", ctx, response.getWriter());
}
```

<!--
And then we will use `th:each` in our template to iterate the list of products:
-->
では商品リストを繰り返し処理するために `th:each` を使いましょう:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

  <head>
    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body>

    <h1>Product list</h1>
  
    <table>
      <tr>
        <th>NAME</th>
        <th>PRICE</th>
        <th>IN STOCK</th>
      </tr>
      <tr th:each="prod : ${prods}">
        <td th:text="${prod.name}">Onions</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
      </tr>
    </table>
  
    <p>
      <a href="../home.html" th:href="@{/}">Return to home</a>
    </p>

  </body>

</html>
```

<!--
That `prod : ${prods}` attribute value you see above means "for each element in
the result of evaluating `${prods}`, repeat this fragment of template setting
that element into a variable called prod". Let's give a name each of the things
we see:
-->
上記の `prod : ${prods}` 属性値は「 `${prods}` の評価結果の各要素に対して、その要素をprodという変数に詰めて、
このテンプレートのフラグメントを繰り返し処理する」という意味になります。呼び名を決めておきましょう。

<!--
 * We will call `${prods}` the _iterated expression_ or _iterated variable_.
 * We will call `prod` the _iteration variable_ or simply _iter variable_.
-->
 * ここでは `${prods}` のことを「被繰り返し式」または「被繰り返し変数」と呼びます。 ^[訳注: iterated expression の適当な訳が分かりませんでした...]
 * ここでは `prod` のことを「繰り返し変数」と呼びます。

<!--
Note that the `prod` iter variable will only be available inside the `<tr>`
element (including inner tags like `<td>`).
-->
繰り返し変数 `prod` は `<tr>` 要素の内部だけで使用できることに注意してください。(`<td>` のような内部のタグでも使用可能です)

<!--
### Iterable values
-->
### 繰り返し処理が可能な値

<!--
Not only `java.util.List` objects can be used for iteration in Thymeleaf. In
fact, there is a quite complete set of objects that are considered _iterable_
by a `th:each` attribute:
-->
Thymeleafの繰り返し処理で使用可能なのは `java.util.List` だけではありません。実際に `th:each` ではオブジェクト一式が「繰り返し可能」だと見なされます。

<!--
 * Any object implementing `java.util.Iterable`
 * Any object implementing `java.util.Map`. When iterating maps, iter variables
   will be of class `java.util.Map.Entry`.
 * Any array
 * Any other object will be treated as if it were a single-valued list
   containing the object itself.
-->
 * `java.util.Iterable` を実装しているオブジェクト
 * `java.util.Map` を実装しているオブジェクト。マップを繰り返し処理する場合の繰り返し変数は `java.util.Map.Entry` のクラスになります。
 * 配列
 * その他のオブジェクトは、そのオブジェクト自身のみを要素として持つ、1要素だけのリストのように扱われます。


<!--
6.2 Keeping iteration status
-->
6.2 繰り返しステータスの保持
----------------------------

<!--
When using `th:each,` Thymeleaf offers a mechanism useful for keeping track of
the status of your iteration: the _status variable_.
-->
`th:each` を使用する際に、繰り返し処理中のステータスを知るための便利なメカニズムがThymeleafにはあります:「ステータス変数」です。

<!--
Status variables are defined within a `th:each` attribute and contain the
following data:
-->
ステータス変数は `th:each` 属性の中で定義され、次の内容を保持しています:

<!--
 * The current _iteration index_, starting with 0. This is the `index` property.
 * The current _iteration index_, starting with 1. This is the `count` property.
 * The total amount of elements in the iterated variable. This is the `size`
   property.
 * The _iter variable_ for each iteration. This is the `current` property.
 * Whether the current iteration is even or odd. These are the `even/odd` boolean
   properties.
 * Whether the current iteration is the first one. This is the `first` boolean
   property.
 * Whether the current iteration is the last one. This is the `last` boolean
   property.
-->
 * `index` プロパティ: 0始まりの現在の「繰り返しインデックス」
 * `count` プロパティ: 1始まりの現在の「繰り返しインデックス」
 * `size` プロパティ: 被繰り返し変数の全要素数
 * `current` プロパティ: 繰り返し中の「繰り返し変数」
 * `even/odd` 真偽値プロパティ: 現在の繰り返し処理が偶数か奇数か
 * `first` 真偽値プロパティ: 現在の繰り返し処理が最初かどうか
 * `last` 真偽値プロパティ: 現在の繰り返し処理が最後かどうか

<!--
Let's see how we could use it within the previous example:
-->
ではどのように使用するのかを前回の例で見てみましょう:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
  </tr>
  <tr th:each="prod,iterStat : ${prods}" th:class="${iterStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
  </tr>
</table>
```

<!--
As you can see, the status variable (`iterStat` in this example) is defined in
the `th:each` attribute by writing its name after the iter variable itself,
separated by a comma. As happens to the iter variable, the status variable will
only be available inside the fragment of code defined by the tag holding the `th:each`
attribute.
-->
ご覧のとおり `th:each` 属性の中で、繰り返し変数の後ろにカンマで区切って名前を書いてステータス変数(この例では `iterStat` )を定義します。繰り返し変数と同様、ステータス変数も `th:each` 属性を持っているタグによって定義されたフラグメントの内部でのみ使用可能です。

<!--
Let's have a look at the result of processing our template:
-->
それでは、テンプレートの処理結果を見てみましょう:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <title>Good Thymes Virtual Grocery</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <link rel="stylesheet" type="text/css" media="all" href="/gtvg/css/gtvg.css" />
  </head>

  <body>

    <h1>Product list</h1>
  
    <table>
      <tr>
        <th colspan="1" rowspan="1">NAME</th>
        <th colspan="1" rowspan="1">PRICE</th>
        <th colspan="1" rowspan="1">IN STOCK</th>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">Fresh Sweet Basil</td>
        <td colspan="1" rowspan="1">4.99</td>
        <td colspan="1" rowspan="1">yes</td>
      </tr>
      <tr class="odd">
        <td colspan="1" rowspan="1">Italian Tomato</td>
        <td colspan="1" rowspan="1">1.25</td>
        <td colspan="1" rowspan="1">no</td>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">Yellow Bell Pepper</td>
        <td colspan="1" rowspan="1">2.50</td>
        <td colspan="1" rowspan="1">yes</td>
      </tr>
      <tr class="odd">
        <td colspan="1" rowspan="1">Old Cheddar</td>
        <td colspan="1" rowspan="1">18.75</td>
        <td colspan="1" rowspan="1">yes</td>
      </tr>
    </table>
  
    <p>
      <a href="/gtvg/" shape="rect">Return to home</a>
    </p>

  </body>
  
</html>
```

<!--
Note that our iteration status variable has worked perfectly, establishing the
`odd` CSS class only to odd rows (row counting starts with 0).
-->
繰り返しステータス変数は完璧に動いていますね。 `odd` CSSクラスが奇数行のみに適用されています(行番号は0から始まります)。

<!--
> All those colspan and rowspan attributes in the `<td>` tags, as well as the
> shape one in `<a>` are automatically added by Thymeleaf in accordance with the
> DTD for the selected _XHTML 1.0 Strict_ standard, that establishes those
> values as default for those attributes (remember that our template didn't set a value for them). Don't worry about them at all, because they will not affect the display of your page. As an example, if we were using HTML5 (which has no DTD), those attributes would never be added.
-->
> colspanとrowspan属性が `<td>` タグに追加されていますが、これは `<a>` のshape属性と同様に、選択されている _XHTML 1.0 Strict_ 標準のDTDに従ってThymeleafが自動的に追加します。 _XHTML 1.0 Strict_ 標準では、これらの値が属性のデフォルト値として策定されています(テンプレートでは値を設定していないことに注意してください)。ページの表示には影響はないので、このことを気にする必要は全然ありません。例えば、HTML5(にはDTDがありませんが)を使用していたら、この属性は決して追加されません。

<!--
If you don't explicitly set a status variable, Thymeleaf will always create one
for you by suffixing `Stat` to the name of the iteration variable:
-->
ステータス変数を明示的に指定しない場合は、繰り返し変数の後ろに `Stat` をつけた変数名をThymeleafはいつでも作成します:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
  </tr>
  <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
  </tr>
</table>
```



<!--
7 Conditional Evaluation
-->
7 条件の評価
========================


<!--
7.1 Simple conditionals: "if" and "unless"
-->
7.1 単純な条件: "if" と "unless"
------------------------------------------

<!--
Sometimes you will need a fragment of your template only to appear in the result
if a certain condition is met. 
-->
特定の条件が満たされる場合にのみ、フラグメントを表示したい場合があるでしょう。

<!--
For example, imagine we want to show in our product table a column with the
number of comments that exist for each product and, if there are any comments, a
link to the comment detail page for that product.
-->
例えば、商品テーブルの各商品に対してコメント数を表示するカラムを用意する場合を想像してみてください。もしコメントがあれば、その商品のコメント詳細ページへのリンクを貼りたいです。

<!--
In order to do this, we would use the `th:if` attribute:
-->
この場合 `th:if` 属性を使用します:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
    <td>
      <span th:text="${#lists.size(prod.comments)}">2</span> comment/s
      <a href="comments.html" 
         th:href="@{/product/comments(prodId=${prod.id})}" 
         th:if="${not #lists.isEmpty(prod.comments)}">view</a>
    </td>
  </tr>
</table>
```

<!--
Quite a lot of things to see here, so let's focus on the important line:
-->
結構沢山のことをやっているので、重要な行にフォーカスしましょう:

```html
<a href="comments.html"
   th:href="@{/product/comments(prodId=${prod.id})}" 
   th:if="${not #lists.isEmpty(prod.comments)}">view</a>
```

<!--
There is little to explain from this code, in fact: We will be creating a link
to the comments page (with URL `/product/comments`) with a `prodId` parameter
set to the `id` of the product, but only if the product has any comments.
-->
実際、ほとんど説明することはないですね: 商品の `id` を `prodId` パラメータに設定してコメントページ(`/product/comments`)へのリンクを作成します。でもそれは商品にコメントがついている場合だけです。

<!--
Let's have a look at the resulting markup (getting rid of the defaulted `rowspan`
and `colspan` attributes for a cleaner view):
-->
では、結果のマークアップを見てみましょう(見やすくするために、デフォルト属性の `rowspan` と `colspan` は取り除いています):

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr>
    <td>Fresh Sweet Basil</td>
    <td>4.99</td>
    <td>yes</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr class="odd">
    <td>Italian Tomato</td>
    <td>1.25</td>
    <td>no</td>
    <td>
      <span>2</span> comment/s
      <a href="/gtvg/product/comments?prodId=2">view</a>
    </td>
  </tr>
  <tr>
    <td>Yellow Bell Pepper</td>
    <td>2.50</td>
    <td>yes</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr class="odd">
    <td>Old Cheddar</td>
    <td>18.75</td>
    <td>yes</td>
    <td>
      <span>1</span> comment/s
      <a href="/gtvg/product/comments?prodId=4">view</a>
    </td>
  </tr>
</table>
```

<!--
Perfect! That's exactly what we wanted.
-->
カンペキ！まさに欲しかったものです。

<!--
Note that the `th:if` attribute will not only evaluate _boolean_ conditions.
Its capabilities go a little beyond that, and it will evaluate the specified
expression as `true` following these rules:
-->
`th:if` 属性は _boolean_ 条件のみを評価するわけではないことに注意して下さい。もう少し幅広いのです。次のようなルールに従って指定された式を `true` と評価します:

<!--
 * If value is not null:
    * If value is a boolean and is `true`.
    * If value is a number and is non-zero
    * If value is a character and is non-zero
    * If value is a String and is not "false", "off" or "no"
    * If value is not a boolean, a number, a character or a String.
 * (If value is null, th:if will evaluate to false).
-->
 * 値が null ではない場合:
    * booleanの `true`
    * 0以外の数値
    * 0以外の文字
    * "false" でも "off" でも "no" でもない文字列
    * 真偽値でも、数値でも、文字でも文字列でもない場合
 * (値が null の場合は th:if は false と評価します).


<!--
Also, `th:if` has a negative counterpart, `th:unless`, which we could have used
in the previous example instead of using a `not` inside the OGNL expression:
-->
また、 `th:if` には反対の意味で対になるものがあります。 `th:unless` です。先ほどの例で、OGNL式の `not` を使用する代わりに、これを使用することもできます。

```html
<a href="comments.html"
   th:href="@{/comments(prodId=${prod.id})}" 
   th:unless="${#lists.isEmpty(prod.comments)}">view</a>
```


<!--
7.2 Switch statements
-->
7.2 スイッチ文
---------------------

<!--
There is also a way to display content conditionally using the equivalent of a
_switch_ structure in Java: the `th:switch` / `th:case` attribute set.
-->
Javaにおける _switch_ 構造と同じように使用して、コンテンツを条件毎に表示する方法もあります: `th:switch` / `th:case` 属性のセットです。

<!--
They work exactly as you would expect:
-->
ご想像通りの動きをします:

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
</div>
```

<!--
Note that as soon as one `th:case` attribute is evaluated as `true`, every other
`th:case` attribute in the same switch context is evaluated as `false`.
-->
一つの `th:case` 属性が `true` と評価されるとすぐに、同じスイッチコンテキスト内の他の全ての `th:case` 属性は `false` と評価されることに注意してください。

<!--
The default option is specified as `th:case="*"`:
-->
デフォルトオプションは `th:case="*"` で指定します:

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
  <p th:case="*">User is some other thing</p>
</div>
```



<!--
8 Template Layout
-->
8 テンプレートレイアウト
=================


<!--
8.1 Including template fragments
-->
8.1 テンプレートフラグメントのインクルード
--------------------------------

<!--
### Defining and referencing fragments
-->
### フラグメントの定義と参照

<!--
We will often want to include in our templates fragments from other templates.
Common uses for this are footers, headers, menus...
-->
他のテンプレートのフラグメントを別のテンプレートにインクルードしたいという場合がよくあります。よく使われるのはフッターやヘッダー、メニューなどです。

<!--
In order to do this, Thymeleaf needs us to define the fragments available for
inclusion, which we can do by using the `th:fragment` attribute. 
-->
そうするためにThymeleafではインクルード可能なフラグメントを定義する必要があります。定義には `th:fragment` 属性を使用します。

<!--
Now let's say we want to add a standard copyright footer to all our grocery
pages, and for that we define a `/WEB-INF/templates/footer.html` file containing
this code:
-->
私たちの食料品店の全てのページに標準的なコピーライトフッターを追加したいとしましょう。 `/WEB-INF/templates/footer.html` ファイルにこのようなコードを定義します:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

  <body>
  
    <div th:fragment="copy">
      &copy; 2011 The Good Thymes Virtual Grocery
    </div>
  
  </body>
  
</html>
```

<!--
The code above defines a fragment called `copy` that we can easily include in
our home page using one of the `th:include` or `th:replace` attributes:
-->
このコードは `copy` と呼ばれるフラグメントを定義しており、私たちのホームページで `th:include` または `th:replace` 属性のどちらかを使用して簡単にインクルードすることができます:

```html
<body>

  ...

  <div th:include="footer :: copy"></div>
  
</body>
```

<!--
The syntax for both these inclusion attributes is quite straightforward. There
are three different formats:
-->
これらのインクルード属性の構文は両方ともとても直感的です。そのフォーマットには3種類あります:

<!--
 * `"templatename::domselector"` or the equivalent `templatename::[domselector]` Includes the fragment resulting from executing the specified DOM Selector on the template named `templatename`.
    * Note that `domselector` can be a mere fragment name, so you could specify something as simple as `templatename::fragmentname` like in the `footer :: copy` above.

   > DOM Selector syntax is similar to XPath expressions and CSS selectors, see the [Appendix C](#appendix-c-dom-selector-syntax) for more info on this syntax.

 * `"templatename"` Includes the complete template named `templatename`.

   > Note that the template name you use in `th:include`/`th:replace` tags
   > will have to be resolvable by the Template Resolver currently being used by
   > the Template Engine.

 * `::domselector"` or `"this::domselector"` Includes a fragment from the same template.
-->
 * `"templatename::domselector"` またはそれと同等の `templatename::[domselector]` `templatename` という名前のテンプレート内にある、DOMセレクターで指定されたフラグメントをインクルードします。
    * `domselector` はフラグメント名でも大丈夫なので上記の例の `footer :: copy` のように単に `templatename::fragmentname` を指定することもできることに注意してください。

   > DOMセレクター構文はXPath表現やCSSセレクターと似ています。詳しくは [Appendix C](#appendix-c-dom-selector-syntax) を参照してください。

 * `"templatename"` `templatename` という名前のテンプレート全体をインクルードします。

   > `th:include`/`th:replace` タグで使用されるテンプレート名は現在テンプレートエンジンで使用されているテンプレートリゾルバーによって解決可能でなければならないことに注意してください。

 * `::domselector"` or `"this::domselector"` 同じテンプレート内のフラグメントをインクルードします。

<!--
Both `templatename` and `domselector` in the above examples
can be fully-featured expressions (even conditionals!) like:
-->
上記の例の `templatename` と `domselector` には両方とも式を指定することができます(条件式でも大丈夫です！):

```html
<div th:include="footer :: (${user.isAdmin}? #{footer.admin} : #{footer.normaluser})"></div>
```

<!--
Fragments can include any `th:* attributes`. These attributes will be evaluated
once the fragment is included into the target template (the one with the `th:include`/`th:replace`
attribute), and they will be able to reference any context variables defined in
this target template.
-->
フラグメントにはどんな `th:*` 属性でも含めることができます。これらの属性は対象テンプレート(`th:include`/`th:replace` 属性が書かれたテンプレートのことです)にそのフラグメントがインクルードされるときに1度評価されます。フラグメント内の属性は、対象テンプレート内のコンテキスト変数を参照することができます。

<!--
> A big advantage of this approach to fragments is that you can write your
> fragments' code in pages that are perfectly displayable by a browser, with a
> complete and even validating XHTML structure, while still retaining the
> ability to make Thymeleaf include them into other templates.
-->
> フラグメントに対するこのアプローチの大きな利点は、完全かつ妥当なXHTML構造によって、ブラウザで完全に表示できるフラグメントを書くことができるという点です。Thymeleafを使って他のテンプレートにインクルードすることができるのに、です。

<!--
### Referencing fragments without `th:fragment`
-->
### `th:fragment` を使用せずにフラグメントを参照する

<!--
Besides, thanks to the power of DOM Selectors, we can include fragments that do not use any `th:fragment` attributes. It can even be markup code coming from a different application with no knowledge of Thymeleaf at all:
-->
さらに、DOMセレクターのパワーのお陰で、 `th:fragment` 属性を使わなくてもフラグメントをインクルードすることができます。全くThymeleafのことを知らない別のアプリケーションのマークアップコードでさえもインクルードすることができます。

```html
...
<div id="copy-section">
  &copy; 2011 The Good Thymes Virtual Grocery
</div>
...
```

<!--
We can use the fragment above simply referencing it by its `id` attribute, in a similar way to a CSS selector:
-->
このフラグメントを単に `id` 属性によってCSSセレクターに似た方法で参照することができます。

```html
<body>

  ...

  <div th:include="footer :: #copy-section"></div>
  
</body>
```


<!--
### Difference between `th:include` and `th:replace` 
-->
### `th:include` と `th:replace` の違い

<!--
And what is the difference between `th:include` and `th:replace`? Whereas `th:include`
will include the contents of the fragment into its host tag, `th:replace`
will actually substitute the host tag by the fragment's. So that an HTML5
fragment like this:
-->
では、 `th:include` と `th:replace` の違いって何でしょうか？ `th:include` はホストタグの中にフラグメントの中身をインクルードする一方で `th:replace` は実際にホストタグをフラグメントで置換します。ですので、このようなHTML5フラグメントに対して:

```html
<footer th:fragment="copy">
  &copy; 2011 The Good Thymes Virtual Grocery
</footer>
```

<!--
...included twice in host `<div>` tags, like this:
-->
...ホストとなる `<div>` タグを2個書いてインクルードしてみます:

```html
<body>

  ...

  <div th:include="footer :: copy"></div>
  <div th:replace="footer :: copy"></div>
  
</body>
```

<!--
...will result in:
-->
...するとこのような結果になります:

```html
<body>

  ...

  <div>
    &copy; 2011 The Good Thymes Virtual Grocery
  </div>
  <footer>
    &copy; 2011 The Good Thymes Virtual Grocery
  </footer>
  
</body>
```

<!--
The `th:substituteby` attribute can also be used as an alias for `th:replace`, but the latter is recommended. Note that `th:substituteby` might be deprecated in future versions.
-->
`th:substituteby` 属性は `th:replace` 属性に対するエイリアスとして使用できますが、後者を推奨します。 `th:substituteby` は将来のバージョンで非推奨になるかもしれないことに注意してください。


<!--
8.2 Parameterizable fragment signatures
-->
8.2 パラメータ化可能なフラグメントシグネチャ
---------------------------------------

<!--
In order to create a more _function-like_ mechanism for the use of template fragments,
fragments defined with `th:fragment` can specify a set of parameters:
-->
テンプレートフラグメントを、より「関数のような」メカニズムで作成するために `th:fragment` で定義されたフラグメントは、パラメータを持つことができます:

```html
<div th:fragment="frag (onevar,twovar)">
    <p th:text="${onevar} + ' - ' + ${twovar}">...</p>
</div>
```

<!--
This requires the use of one of these two syntaxes to call the fragment from `th:include`, 
`th:replace`:
-->
`th:include` や `th:replace` からこのフラグメントを呼び出す場合には、以下の2つのどちらかの構文を使用します:

```html
<div th:include="::frag (${value1},${value2})">...</div>
<div th:include="::frag (onevar=${value1},twovar=${value2})">...</div>
```

<!--
Note that order is not important in the last option:
-->
後者の場合は、順番が重要ではないことに注意してください:

```html
<div th:include="::frag (twovar=${value2},onevar=${value1})">...</div>
```

<!--
###Fragment local variables without fragment signature
-->
### フラグメントシグネチャなしでのフラグメントローカル変数

<!--
Even if fragments are defined without signature, like this:
-->
シグネチャなしでフラグメントが定義されている場合でも:

```html	
<div th:fragment="frag">
    ...
</div>
```

<!--
We could use the second syntax specified above to call them (and only the second one):
-->
上記の後者の構文を使うことができます(後者の構文だけです):

```html	
<div th:include="::frag (onevar=${value1},twovar=${value2})">
```

<!--
This would be, in fact, equivalent to a combination of `th:include` and `th:with`:
-->
実際のところ、これは `th:include` と `th:with` を組み合わせて使ったのと同じことです:

```html	
<div th:include="::frag" th:with="onevar=${value1},twovar=${value2}">
```

<!--
**Note** that this specification of local variables for a fragment ーーーno matter whether it 
has a signature or notーーー does not cause the context to emptied previously to its 
execution. Fragments will still be able to access every context variable being used at the 
calling template like they currently are. 
-->
**注意** シグネチャの有無に関わらず、フラグメントに対するローカル変数のこの仕様によってコンテキストが実行前に空になるというようなことはありません。この場合でもフラグメントは呼び出し元のテンプレートと同じように、全てのコンテキスト変数にアクセスすることができます。


<!--
###th:assert for in-template assertions
-->
### テンプレート内でのアサーションのための th:assert

<!--
The `th:assert` attribute can specify a comma-separated list of expressions which should be
evaluated and produce true for every evaluation, raising an exception if not.
-->
`th:assert` 属性に対して、全ての評価が true になるはずの式をカンマ区切りのリストで指定すると、もしそうならない場合には例外を投げます。

```html
<div th:assert="${onevar},(${twovar} != 43)">...</div>
```

<!--
This comes in handy for validating parameters at a fragment signature:
-->
これを使うと、フラグメントシグネチャで簡単にパラメータをバリデートすることができます:

```html
<header th:fragment="contentheader(title)" th:assert="${!#strings.isEmpty(title)}">...</header>
```



<!--
8.3 Removing template fragments
-->
8.3 テンプレートフラグメントの削除
-------------------------------

<!--
Let's revisit the last version of our product list template:
-->
私たちの商品リストテンプレートの最新バージョンをもう一度見てみましょう:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
    <td>
      <span th:text="${#lists.size(prod.comments)}">2</span> comment/s
      <a href="comments.html" 
         th:href="@{/product/comments(prodId=${prod.id})}" 
         th:unless="${#lists.isEmpty(prod.comments)}">view</a>
    </td>
  </tr>
</table>
```

<!--
This code is just fine as a template, but as a static page (when directly open
by a browser without Thymeleaf processing it) it would not make a nice prototype. 
-->
このコードはテンプレートとしては全然問題ありませんが、静的ページ(Thymeleafで処理をせずに直接ブラウザで開いた場合)としては良いプロトタイプではなさそうです。

<!--
Why? Because although perfectly displayable by browsers, that table only has a
row, and this row has mock data. As a prototype, it simply wouldn't look
realistic enough... we should have more than one product, _we need more rows_.
-->
なぜでしょうか？ブラウザで完全に表示できはしますが、テーブルにはモックデータの1行しかないからです。プロトタイプとして単純にリアルさが足りません... 2つ以上の商品を表示するほうが良かったですね。複数行必要ですよね。

<!--
So let's add some:
-->
ということで、追加しましょう:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
    <td>
      <span th:text="${#lists.size(prod.comments)}">2</span> comment/s
      <a href="comments.html" 
         th:href="@{/product/comments(prodId=${prod.id})}" 
         th:unless="${#lists.isEmpty(prod.comments)}">view</a>
    </td>
  </tr>
  <tr class="odd">
    <td>Blue Lettuce</td>
    <td>9.55</td>
    <td>no</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr>
    <td>Mild Cinnamon</td>
    <td>1.99</td>
    <td>yes</td>
    <td>
      <span>3</span> comment/s
      <a href="comments.html">view</a>
    </td>
  </tr>
</table>
```

<!--
Ok, now we have three, definitely better for a prototype. But... what will
happen when we process it with Thymeleaf?:
-->
よし、これで3商品になったので、プロトタイプとしてはこのほうが全然良いです。でも...Thymeleafで処理したらどうなるでしょうか？:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr>
    <td>Fresh Sweet Basil</td>
    <td>4.99</td>
    <td>yes</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr class="odd">
    <td>Italian Tomato</td>
    <td>1.25</td>
    <td>no</td>
    <td>
      <span>2</span> comment/s
      <a href="/gtvg/product/comments?prodId=2">view</a>
    </td>
  </tr>
  <tr>
    <td>Yellow Bell Pepper</td>
    <td>2.50</td>
    <td>yes</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr class="odd">
    <td>Old Cheddar</td>
    <td>18.75</td>
    <td>yes</td>
    <td>
      <span>1</span> comment/s
      <a href="/gtvg/product/comments?prodId=4">view</a>
    </td>
  </tr>
  <tr class="odd">
    <td>Blue Lettuce</td>
    <td>9.55</td>
    <td>no</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr>
    <td>Mild Cinnamon</td>
    <td>1.99</td>
    <td>yes</td>
    <td>
      <span>3</span> comment/s
      <a href="comments.html">view</a>
    </td>
  </tr>
</table>
```

<!--
The last two rows are mock rows! Well, of course they are: iteration was only
applied to the first row, so there is no reason why Thymeleaf should have
removed the other two.
-->
最後の2行がモック行です！あぁ、そりゃそうです: 繰り返し処理は最初の行にしか適用されませんので、Thymeleafが他の2行を削除する理由がありません。

<!--
We need a way to remove those two rows during template processing. Let's use the
`th:remove` attribute on the second and third `<tr>` tags:
-->
テンプレート処理をする際にこの2行を削除する手段が必要です。 `th:remove` 属性を2つ目と、3つ目の `<tr>` に使用しましょう:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
    <td th:text="${prod.name}">Onions</td>
    <td th:text="${prod.price}">2.41</td>
    <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
    <td>
      <span th:text="${#lists.size(prod.comments)}">2</span> comment/s
      <a href="comments.html" 
         th:href="@{/product/comments(prodId=${prod.id})}" 
         th:unless="${#lists.isEmpty(prod.comments)}">view</a>
    </td>
  </tr>
  <tr class="odd" th:remove="all">
    <td>Blue Lettuce</td>
    <td>9.55</td>
    <td>no</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr th:remove="all">
    <td>Mild Cinnamon</td>
    <td>1.99</td>
    <td>yes</td>
    <td>
      <span>3</span> comment/s
      <a href="comments.html">view</a>
    </td>
  </tr>
</table>
```

<!--
Once processed, everything will look again as it should:
-->
テンプレートを処理すると、正しく動くように戻りましたね:

```html
<table>
  <tr>
    <th>NAME</th>
    <th>PRICE</th>
    <th>IN STOCK</th>
    <th>COMMENTS</th>
  </tr>
  <tr>
    <td>Fresh Sweet Basil</td>
    <td>4.99</td>
    <td>yes</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr class="odd">
    <td>Italian Tomato</td>
    <td>1.25</td>
    <td>no</td>
    <td>
      <span>2</span> comment/s
      <a href="/gtvg/product/comments?prodId=2">view</a>
    </td>
  </tr>
  <tr>
    <td>Yellow Bell Pepper</td>
    <td>2.50</td>
    <td>yes</td>
    <td>
      <span>0</span> comment/s
    </td>
  </tr>
  <tr class="odd">
    <td>Old Cheddar</td>
    <td>18.75</td>
    <td>yes</td>
    <td>
      <span>1</span> comment/s
      <a href="/gtvg/product/comments?prodId=4">view</a>
    </td>
  </tr>
</table>
```

<!--
And what about that `all` value in the attribute, what does it mean? Well, in fact
`th:remove` can behave in three different ways, depending on its value:
-->
この属性に対する `all` という値はどうなっているのでしょう？何を意味するのでしょうか？はい、実際のところ `th:remove` はその値によって、5つの異なる振る舞いをします:

<!--
 * `all`: Remove both the containing tag and all its children.
 * `body`: Do not remove the containing tag, but remove all its children.
 * `tag`: Remove the containing tag, but do not remove its children.
 * `all-but-first`: Remove all children of the containing tag except the first one.
 * `none` : Do nothing. This value is useful for dynamic evaluation.
-->
 * `all`: この属性を含んでいるタグとその全ての子の両方を削除します。
 * `body`: この属性を含んでいるタグは削除せずに、全ての子を削除します。
 * `tag`: この属性を含んでいるタグは削除しますが、子は削除しません。
 * `all-but-first`: 最初の子以外の全ての子を削除します。
 * `none` : 何もしません。この値は、動的な評価の場合に有用です。

<!--
What can that `all-but-first` value be useful for? It will let us save some `th:remove="all"`
when prototyping:
-->
`all-but-first` 値は何の役に立つのでしょう？それはプロトタイプに書く `th:remove="all"` を減らしてくれます:


```html
<table>
  <thead>
    <tr>
      <th>NAME</th>
      <th>PRICE</th>
      <th>IN STOCK</th>
      <th>COMMENTS</th>
    </tr>
  </thead>
  <tbody th:remove="all-but-first">
    <tr th:each="prod : ${prods}" th:class="${prodStat.odd}? 'odd'">
      <td th:text="${prod.name}">Onions</td>
      <td th:text="${prod.price}">2.41</td>
      <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
      <td>
        <span th:text="${#lists.size(prod.comments)}">2</span> comment/s
        <a href="comments.html" 
           th:href="@{/product/comments(prodId=${prod.id})}" 
           th:unless="${#lists.isEmpty(prod.comments)}">view</a>
      </td>
    </tr>
    <tr class="odd">
      <td>Blue Lettuce</td>
      <td>9.55</td>
      <td>no</td>
      <td>
        <span>0</span> comment/s
      </td>
    </tr>
    <tr>
      <td>Mild Cinnamon</td>
      <td>1.99</td>
      <td>yes</td>
      <td>
        <span>3</span> comment/s
        <a href="comments.html">view</a>
      </td>
    </tr>
  </tbody>
</table>
```

<!--
The `th:remove` attribute can take any _Thymeleaf Standard Expression_, as long as it returns one 
of the allowed String values (`all`, `tag`, `body`, `all-but-first` or `none`).
-->
`th:remove` 属性は許可された文字列値(`all`, `tag`, `body`, `all-but-first` または `none`)を返すのであればどんな「Thymeleafスタンダード式」でも指定することができます。

<!--
This means removals could be conditional, like:
-->
つまり、削除に条件を適用することもできるということです:

```html
<a href="/something" th:remove="${condition}? tag : none">Link text not to be removed</a>
```

<!--
Also note that `th:remove` considers `null` a synonym to `none`, so that the following works
exactly as the example above:
-->
また、 `th:remove` は `null` を `none` と同義の別名とみなすため、次のような場合は上記の例と全く同じ動きをします:

```html
<a href="/something" th:remove="${condition}? tag">Link text not to be removed</a>
```

<!--
In this case, if `${condition}` is false, `null` will be returned, and thus no removal will be performed. 
-->
この場合、 `${condition}` がfalseの場合、 `null` が返されるので、何も削除されません。



<!--
9 Local Variables
-->
9 ローカル変数
=================

<!--
Thymeleaf calls _local variables_ those variables that are defined for a
specific fragment of a template, and are only available for evaluation inside
that fragment.
-->
Thymeleafではテンプレートの特定のフラグメントに対して定義され、そのフラグメント内でのみ評価可能な変数のことを「ローカル変数」と呼びます。

<!--
An example we have already seen is the `prod` iter variable in our product list
page:
-->
既に見たことのある例を挙げると、商品リストページの繰り返し変数 `prod` がそれにあたります。

```html
<tr th:each="prod : ${prods}">
    ...
</tr>
```

<!--
That `prod` variable will be available only within the bonds of the `<tr>` tag.
Specifically:
-->
`prod` 変数は `<tr>` タグの間だけで有効です。具体的には:

<!--
 * It will be available for any other `th:*` attributes executing in that tag
   with less _precedence_ than `th:each` (which means they will execute after `th:each`).
 * It will be available for any child element of the `<tr>` tag, such as `<td>`
   elements.
-->
 * そのタグの中で `th:each` より優先順位が下の `th:*` 属性全てで使用することができます(優先順位が下の属性とは `th:each` より後に実行される属性という意味です)。
 * `<tr>` タグの子要素、例えば `<td>` など、でも使用可能です。

<!--
Thymeleaf offers you a way to declare local variables without iteration. It is
the `th:with` attribute, and its syntax is like that of attribute value
assignments:
-->
Thymeleafには、繰り返し処理以外でもローカル変数を定義する方法があります。 `th:with` 属性です。その構文は属性値の代入の構文に似ています:

```html
<div th:with="firstPer=${persons[0]}">
  <p>
    The name of the first person is <span th:text="${firstPer.name}">Julius Caesar</span>.
  </p>
</div>
```

<!--
When `th:with` is processed, that `firstPer` variable is created as a local
variable and added to the variables map coming from the context, so that it is
as available for evaluation as any other variables declared in the context from
the beginning, but only within the bounds of the containing `<div>` tag.
-->
`th:with` が処理されると、 `firstPer` 変数がローカル変数として作成されコンテキストの変数マップに追加されます。そして、コンテキスト内で最初から定義されている他の変数と同様に評価可能になります。ただし、 `<div>` タグの間だけです。

<!--
You can define several variables at the same time using the usual multiple
assignment syntax:
-->
複数の変数を同時に設定したい場合は、普通に複数の代入をする構文を使用することができます:

```html
<div th:with="firstPer=${persons[0]},secondPer=${persons[1]}">
  <p>
    The name of the first person is <span th:text="${firstPer.name}">Julius Caesar</span>.
  </p>
  <p>
    But the name of the second person is 
    <span th:text="${secondPer.name}">Marcus Antonius</span>.
  </p>
</div>
```

<!--
The `th:with` attribute allows reusing variables defined in the same attribute:
-->
`th:with` 属性ではその属性内で定義された変数の再利用ができます:


```html
<div th:with="company=${user.company + ' Co.'},account=${accounts[company]}">...</div>
```

<!--
Let's use this in our Grocery's home page! Remember the code we wrote for
outputting a formatted date?
-->
それでは私たちの食料品店のホームページで使ってみましょう！日付をフォーマットして出しているコードを覚えていますか？

```html
<p>
  Today is: 
  <span th:text="${#calendars.format(today,'dd MMMM yyyy')}">13 february 2011</span>
</p>
```

<!--
Well, what if we wanted that `"dd MMMM yyyy"` to actually depend on the locale?
For example, we might want to add the following message to our `home_en.properties`:
-->
では、実際にこの `"dd MMMM yyyy"` をロケールに合わせたい場合はどうしましょうか？例えば `home_en.properties` に次のようなメッセージを追加したいかもしれません:

```
date.format=MMMM dd'','' yyyy
```

<!--
...and an equivalent one to our `home_es.properties`:
-->
そして、同様に `home_es.properties` には次のように:

```
date.format=dd ''de'' MMMM'','' yyyy
```

<!--
Now, let's use `th:with` to get the localized date format into a variable, and
then use it in our `th:text` expression:
-->
さて、 `th:with` を使って、ローカライズされた日付フォーマットを変数に入れて、それを `th:text` 式で使ってみましょう:

```html
<p th:with="df=#{date.format}">
  Today is: <span th:text="${#calendars.format(today,df)}">13 February 2011</span>
</p>
```

<!--
That was clean and easy. In fact, given the fact that `th:with` has a higher
`precedence` than `th:text`, we could have solved this all in the `span` tag:
-->
綺麗で簡単ですね。実は、 `th:with` は `th:text` よりも高い優先順位を持っていますので全部を `span` タグに書くこともできます:

```html
<p>
  Today is: 
  <span th:with="df=#{date.format}" 
        th:text="${#calendars.format(today,df)}">13 February 2011</span>
</p>
```

<!--
You might be thinking: Precedence? We haven't talked about that yet! Well, don't
worry because that is exactly what the next chapter is about.
-->
優先順位？それまだ知らない！と思ったかもしれませんね。心配しないでください、次の章は優先度についてです。


<!--
10 Attribute Precedence
-->
10 属性の優先順位
=======================

<!--
What happens when you write more than one `th:*` attribute in the same tag? For
example:
-->
同じタグの中に複数の `th:*` 属性を書いた場合には何が起こるのでしょうか？例えば:

```html
<ul>
  <li th:each="item : ${items}" th:text="${item.description}">Item description here...</li>
</ul>
```

<!--
Of course, we would expect that `th:each` attribute to execute before the `th:text`
so that we get the results we want, but given the fact that the DOM (Document
Object Model) standard does not give any kind of meaning to the order in which
the attributes of a tag are written, a _precedence_ mechanism has to be
established in the attributes themselves in order to be sure that this will work
as expected.
-->
もちろん、期待した結果を得るためには `th:each` 属性が `th:text` より先に実行されて欲しいですよね。ですが、DOM(Document Object Model)標準ではタグの中の属性が書かれている順番には特に意味を持たせていないので、私たちの想定通りに動作することを保証するためには、属性自身に「優先順位」というメカニズムを持たせなければなりません。

<!--
So, all Thymeleaf attributes define a numeric precedence, which establishes the
order in which they are executed in the tag. This order is:
-->
ですので、Thymeleafの全ての属性は数値の優先順位を定義しています。その値によってタグの中で実行される順番が決まります。この順番は次の通りです:

<!--
Order   Feature                            Attributes

      1 Fragment inclusion                 `th:include`\
                                           `th:replace`

      2 Fragment iteration                 `th:each`

      3 Conditional evaluation             `th:if`\
                                           `th:unless`\
                                           `th:switch`\
                                           `th:case`

      4 Local variable definition          `th:object`\
                                           `th:with`

      5 General attribute modification     `th:attr`\
                                           `th:attrprepend`\
                                           `th:attrappend`

      6 Specific attribute modification    `th:value`\
                                           `th:href`\
                                           `th:src`\
                                           `...`

      7 Text (tag body modification)       `th:text`\
                                           `th:utext`

      8 Fragment specification             `th:fragment`

      9 Fragment removal                   `th:remove`
-->
<div class="table-scroller">
-----------------------------------------------------------------
順番    機能                               属性
------- ---------------------------------- ----------------------
     1  フラグメントのインクルード                      `th:include`\
                                           `th:replace`

     2  フラグメントの繰り返し                        `th:each`

     3  条件の評価                              `th:if`\
                                           `th:unless`\
                                           `th:switch`\
                                           `th:case`

     4  ローカル変数の定義                          `th:object`\
                                           `th:with`

     5  一般的な属性の変更                          `th:attr`\
                                           `th:attrprepend`\
                                           `th:attrappend`

     6  特定の属性の変更                           `th:value`\
                                            `th:href`\
                                           `th:src`\
                                           `...`

     7  テキスト (タグボディの変更)                    `th:text`\
                                           `th:utext`

     8  フラグメントの定義                          `th:fragment`

     9  フラグメントの削除                          `th:remove`
-----------------------------------------------------------------
</div>

<!--
This precedence mechanism means that the above iteration fragment will give
exactly the same results if the attribute position is inverted (although it would be
slightly less readable):
-->
この優先順位のメカニズムがあるので、上記の繰り返しのフラグメントで属性の位置を入れ替えても全く同じ結果を得ることができます(少し読みにくくなりますけどね)。

```html
<ul>
  <li th:text="${item.description}" th:each="item : ${items}">Item description here...</li>
</ul>
```


<!--
11. Comments and Blocks
-->
11. コメントとブロック
=======================

<!--
11.1. Standard HTML/XML comments
-->
11.1. 標準的なHTML/XMLコメント
--------------------------------

<!--
Standard HTML/XML comments `<!ーー ... ーー>` can be used anywhere in thymeleaf templates. Anything inside these comments won't be processed by neither Thymeleaf nor the browser, and will be just copied verbatim to the result:
-->
標準的なHTML/XMLコメント `<!-- ... -->` はThymeleafテンプレート内のどこでも使用することができます。このコメントの中にあるものは全てThymeleafにもブラウザにも処理されずに、一字一句そのまま単純に結果にコピーされます:


```html
<!-- User info follows -->
<div th:text="${...}">
  ...
</div>
```


<!--
11.2. Thymeleaf parser-level comment blocks
-->
11.2. Thymeleafパーサーレベルのコメントブロック
-------------------------------------------


<!--
Parser-level comment blocks are code that will be simply removed from the template when thymeleaf parses it. They look like this:
-->
パーサーレベルのコメントブロックはThymeleafがそれをパースする際にテンプレートから削除されます。こんな感じです:

```html
<!--/* This code will be removed at thymeleaf parsing time! */-->
``` 

<!--
Thymeleaf will remove absolutely everything between `<!ーー/*` and `*/ーー>`, so these comment blocks can also be used for displaying code when a template is statically open, knowing that it will be removed when thymeleaf processes it:
-->
Thymeleafは ` <!--/*` と `*/-->` の間にあるもの全てを完全に削除するので、このコメントブロックは「テンプレートが静的に開かれた場合にだけ内容を表示する」という用途のために使用することもできます。Thymeleafで処理すると削除されます:

```html
<!--/*--> 
  <div>
     you can see me only before thymeleaf processes me!
  </div>
<!--*/-->
```

<!--
This might come very handy for prototyping tables with a lot of `<tr>`'s, for example:
-->
これは、例えばたくさんの `<tr>` を持ったテーブルのプロトタイプを作成する際にとても便利かもしれません:

```html
<table>
   <tr th:each="x : ${xs}">
     ...
   </tr>
   <!--/*-->
   <tr>
     ...
   </tr>
   <tr>
     ...
   </tr>
   <!--*/-->
</table>
```

<!--
11.3. Thymeleaf prototype-only comment blocks
-->
11.3. Thymeleafプロトタイプのみのコメントブロック
---------------------------------------------

<!--
Thymeleaf allows the definition of special comment blocks marked to be comments when the template is open statically (i.e. as a prototype), but considered normal markup by Thymeleaf when executing the template.
-->
Thymeleafにはテンプレートが静的に(例えばプロトタイプとして)開かれた場合にはコメントになり、テンプレートとして実行された場合には通常のマークアップとして扱われる特別なコメントブロックがあります。

```html
<span>hello!</span>
<!--/*/
  <div th:text="${...}">
    ...
  </div>
/*/-->
<span>goodbye!</span>
```

<!--
Thymeleaf's parsing system will simply remove the `<!ーー/*/` and `/*/ーー>` markers, but not its contents, which will be left therefore uncommented. So when executing the template, Thymeleaf will actually see this:
-->
Thymeleafのパースシステムは単純に `<!--/*/` と `/*/-->` のマーカーを削除しますが、コンテンツは削除しないので、そのコンテンツがアンコメントされて残ります。ですので、テンプレートを実行するときには
Thymeleafからは実際このように見えます:

```html
<span>hello!</span>
 
  <div th:text="${...}">
    ...
  </div>
 
<span>goodbye!</span>
```

<!--
As happens with parser-level comment blocks, note that this feature is dialect-independent.
-->
パーサーレベルコメントブロックと同様、この機能はダイアレクトからは独立した機能です。


<!--
11.4. Synthetic `th:block` tag
-->
11.4. 擬似的な `th:block` タグ
------------------------------

<!--
Thymeleaf's only element processor (not an attribute) included in the Standard Dialects is `th:block`.
-->
`th:block` は、Thymeleafのスタンダードダイアレクトに唯一含まれている要素プロセッサ(属性プロセッサではなく)です。

<!--
`th:block` is a mere attribute container that allows template developers to specify whichever attributes they want. Thymeleaf will execute these attributes and then simply make the block dissapear without a trace.
-->
`th:block` は、テンプレート開発者が好きな属性を指定することができるという、ただの属性コンテナにすぎません。Thymeleafは属性を実行して、次に単純にそのブロックを跡形もなく消してしまいます。

<!--
So it could be useful, for example, when creating iterated tables that require more than one `<tr>` for each element:
-->
ですので例えば、繰り返しを使用したテーブルで各要素に対して1つ以上の `<tr>` が必要な場合に有用でしょう:

```html
<table>
  <th:block th:each="user : ${users}">
    <tr>
        <td th:text="${user.login}">...</td>
        <td th:text="${user.name}">...</td>
    </tr>
    <tr>
        <td colspan="2" th:text="${user.address}">...</td>
    </tr>
  </th:block>
</table>
```

<!--
And especially useful when used in combination with prototype-only comment blocks:
-->
そしてプロトタイプのみのコメントと組み合わせると特に有用です:

```html
<table>
    <!--/*/ <th:block th:each="user : ${users}"> /*/-->
    <tr>
        <td th:text="${user.login}">...</td>
        <td th:text="${user.name}">...</td>
    </tr>
    <tr>
        <td colspan="2" th:text="${user.address}">...</td>
    </tr>
    <!--/*/ </th:block> /*/-->
</table>
```

<!--
Note how this solution allows templates to be valid HTML (no need to add forbidden `<div>` blocks inside `<table>`), and still works OK when open statically in browsers as prototypes! 
-->
この解決策によって、テンプレートが(`<table>` 内で禁止されている `<div>` ブロックを書く必要がなく)妥当なHTMLになっていることに注意してください。また、プロトタイプとしてブラウザで静的に開かれても問題ありません！



<!--
12 Inlining
-->
12 インライン処理
===========


<!--
12.1 Text inlining
-->
12.1 テキストのインライン処理
------------------

<!--
Although the Standard Dialect allows us to do almost everything we might need by
using tag attributes, there are situations in which we could prefer writing
expressions directly into our HTML texts. For example, we could prefer writing
this:
-->
必要なものはほぼ全てスタンダードダイアレクトのタグ属性で実現できますが、HTMLテキストの中に直接式を書きたいというシチュエーションもあります。例えば、こう書くよりは:

```html
<p>Hello, <span th:text="${session.user.name}">Sebastian</span>!</p>
```

<!--
...instead of this:
-->
このように書きたいかも知れません:

```html
<p>Hello, [[${session.user.name}]]!</p>
```

<!--
Expressions between `[[...]]` are considered expression inlining in Thymeleaf,
and in them you can use any kind of expression that would also be valid in a
`th:text` attribute.
-->
`[[...]]` の中の式はThymeleafでインライン処理される式と見なされ、 `th:text` 属性で使用することができる式ならどんな種類のものでも使用できます。

<!--
In order for inlining to work, we must activate it by using the `th:inline`
attribute, which has three possible values or modes (`text`, `javascript` and `none`).
Let's try `text`:
-->
インライン処理を動作させるためには `th:inline` 属性を使用してアクティブにしなければなりません。` `th:inline` 属性には3つの値またはモードを指定することができます (`text` と `javascript` と `none`)。

```html
<p th:inline="text">Hello, [[${session.user.name}]]!</p>
```

<!--
The tag holding the `th:inline` does not have to be the one containing the
inlined expression/s, any parent tag would do:
-->
`th:inline` を持つタグはインライン式を含んでいるタグ自体である必要はなく、親タグであっても構いません:

```html
<body th:inline="text">

   ...

   <p>Hello, [[${session.user.name}]]!</p>

   ...

</body>
```

<!--
So you might now be asking: _Why aren't we doing this from the beginning? It's
less code than all those_ `th:text` _attributes!_ Well, be careful there,
because although you might find inlining quite interesting, you should always
remember that inlined expressions will be displayed verbatim in your HTML files
when you open them statically, so you probably won't be able to use them as
prototypes anymore!
-->
そして今こう思っているかもしれません: 「どうして最初からこれをしなかったの？この方が `th:text` 属性よりコードが少なくてすむじゃない！」 あぁ、気をつけてくださいね。インライン処理はとても面白いと思ったかもしれませんが、インライン用に書かれた式は静的に開いた場合にはそのままHTMLの中に表示される、ということを覚えておいてください。つまりその場合、プロトタイプとしてはたぶんもう使えないのです！

<!--
The difference between how a browser would statically display our fragment of
code without using inlining...
-->
インライン処理を使用していないフラグメントを静的にブラウザで表示した場合:

```html
Hello, Sebastian!
```

<!--
...and using it...
-->
そして、インライン処理を使用した場合:

```html
Hello, [[${session.user.name}]]!
```

<!--
...is quite clear.
-->
ということです。



<!--
12.2 Script inlining (JavaScript and Dart)
-->
12.2 スクリプトのインライン処理 (JavaScript と Dart)
------------------------------------------


<!--
Thymeleaf offers a series of "scripting" modes for its inlining capabilities, so
that you can integrate your data inside scripts created in some script languages.
-->
Thymeleafのインライン処理機能には「スクリプト」モードがあります。いくつかのスクリプト言語で書かれたスクリプト内にデータを組み込むことができます。

<!--
Current scripting modes are `javascript` (`th:inline="javascript"`) and `dart` (`th:inline="dart"`).
-->
現在のスクリプトモードは `javascript` (`th:inline="javascript"`) と `dart` (`th:inline="dart"`) です。

<!--
The first thing we can do with script inlining is writing the value of
expressions into our scripts, like:
-->
スクリプトのインライン処理でできることの1つ目は、スクリプト内に式の値を書くことです:

```html
<script th:inline="javascript">
/*<![CDATA[*/
    ...

    var username = /*[[${session.user.name}]]*/ 'Sebastian';

    ...
/*]]>*/
</script>
```

<!--
The `/*[[...]]*/` syntax, instructs Thymeleaf to evaluate the contained
expression. But there are more implications here:
-->
`/*[[...]]*/` 構文は、中の式を評価するようにThymeleafに伝えます。しかし、いくつかポイントがあります:

<!--
 * Being a javascript comment (`/*...*/`), our expression will be ignored when
   displaying the page statically in a browser.
 * The code after the inline expression (`'Sebastian'`) will be executed when
   displaying the page statically.
 * Thymeleaf will execute the expression and insert the result, but it will also
   remove all the code in the line after the inline expression itself (the part
   that is executed when displayed statically).
-->
 * Javascriptコメント(`/*...*/`)になっているので、ブラウザで静的にページを開いた場合にはこの式は無視されます。
 * インライン式の後ろのコード(`'Sebastian'`)は、静的にページを開いた場合には表示されます。
 * Thymeleafは式を実行して結果を挿入しますが、同時にこの行のインライン式の後ろにある全てのコードを削除します(静的に開いた際には表示される部分です)。

<!--
So, the result of executing this will be:
-->
ですので、実行結果はこのようになります:

```html
<script th:inline="javascript">
/*<![CDATA[*/
    ...

    var username = 'John Apricot';

    ...
/*]]>*/
</script>
```

<!--
You can also do it without comments with the same effects, but that will make
your script to fail when loaded statically:
-->
コメント化しなくても大丈夫なのですが、それだと静的に読み込んだ場合にスクリプトのエラーになるでしょう:

```html
<script th:inline="javascript">
/*<![CDATA[*/
    ...

    var username = [[${session.user.name}]];

    ...
/*]]>*/
</script>
```

<!--
Note that this evaluation is intelligent and not limited to Strings. Thymeleaf
will correctly write in Javascript/Dart syntax the following kinds of objects:
-->
この評価は賢いので、文字列以外も使用できることに注意してください。Thymeleafは次の種類のオブジェクトをJavascript/Dart構文に正しく書くことができます:

 * Strings
 * Numbers
 * Booleans
 * Arrays
 * Collections
 * Maps
 * Beans (objects with _getter_ and _setter_ methods)

<!--
For example, if we had the following code:
-->
例えば、このようなコードがあったとしましょう:

```html
<script th:inline="javascript">
/*<![CDATA[*/
    ...

    var user = /*[[${session.user}]]*/ null;

    ...
/*]]>*/
</script>
```

<!--
That `${session.user}` expression will evaluate to a `User` object, and
Thymeleaf will correctly convert it to Javascript syntax:
-->
この `${session.user}` 式によって `User` オブジェクトが評価され、Thymeleafによって正しくJavascript構文に変換されます:

```html
<script th:inline="javascript">
/*<![CDATA[*/
    ...

    var user = {'age':null,'firstName':'John','lastName':'Apricot',
                'name':'John Apricot','nationality':'Antarctica'};

    ...
/*]]>*/
</script>
```

<!--
### Adding code
-->
### コードを追加する

<!--
An additional feature when using javascript inlining is the ability to include
code between a special comment syntax `/*[+...+]*/` so that Thymeleaf will
automatically uncomment that code when processing the template:
-->
Javascriptインライン処理で使用できるもう1つの機能は、 `/*[+...+]*/` という特別なコメント構文で挟まれたコードをインクルードするという機能です。これを使用すると、Thymeleafはテンプレート処理時に自動的にそのコードをアンコメントします:

```javascript
var x = 23;

/*[+

var msg  = 'This is a working application';

+]*/

var f = function() {
    ...
```

<!--
Will be executed as:
-->
は、このように処理されます:

```javascript
var x = 23;

var msg  = 'This is a working application';

var f = function() {
...
```

<!--
You can include expressions inside these comments, and they will be evaluated:
-->
このコメントの中には式を含めることができ、Thymeleafで評価されます:

```javascript
var x = 23;

/*[+

var msg  = 'Hello, ' + [[${session.user.name}]];

+]*/

var f = function() {
...
```


<!--
### Removing code
-->
### コードを削除する

<!--
It is also possible to make Thymeleaf remove code between special `/*[- */` and `/* -]*/`
comments, like this:
-->
Thymeleafでは `/*[- */` と `/* -]*/` という特別なコメントの間に挟むことでコードを削除することもできます:

```javascript
var x = 23;

/*[- */

var msg  = 'This is a non-working template';

/* -]*/

var f = function() {
...
```



<!--
13 Validation and Doctypes
-->
13 バリデーションとDoctype
==========================



<!--
13.1 Validating templates
-->
13.1 テンプレートをバリデートする
-------------------------

<!--
As mentioned before, Thymeleaf offers us out-of-the-box two standard template
modes that validate our templates before processing them: `VALIDXML` and `VALIDXHTML.`
These modes require our templates to be not only _well-formed XML_ (which they
should always be), but in fact valid according to the specified `DTD`.
-->
前述の通り、Thymeleafには処理前にテンプレートをバリデートする2つの標準テンプレートモードがあります: `VALIDXML` と `VALIDXHTML` です。これらのモードの場合はテンプレートは「整形式のXML」である(常にそうあるべきですが)というだけでなく、実際に指定された `DTD` に従って妥当である必要があります。

<!--
The problem is that if we use the `VALIDXHTML` mode with templates including a `DOCTYPE`
clause such as this:
-->
問題は、以下のように `DOCTYPE` 節を含んでいるテンプレートに対して `VALIDXHTML` モードを使用する場合です:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

<!--
...we are going to obtain validation errors because the `th:*` tags do not exist
according to that `DTD.` That's perfectly normal, as the W3C obviously has no
reason to include Thymeleaf's features in their standards but, how do we solve
it? By changing the `DTD.` 
-->
これは、バリデーションエラーになるでしょう。 `th:*` タグが `DTD` に存在しないからです。当然ですよね、W3CがThymeleafの機能を標準に入れるわけがないですよね。でも、じゃあどうしましょうか？ `DTD` を変更することによって解決します。

<!--
Thymeleaf includes a set of `DTD` files that mirror the original ones from the
XHTML standards, but adding all the available `th:*` attributes from the
Standard Dialect. That's why we have been using this in our templates:
-->
ThymeleafにはXHTML標準のオリジナルをコピーした `DTD` が含まれていて、それらの `DTD` では、スタンダードダイアレクトの全ての `th:*` 属性が使用できるようなっています。そういった理由で、これまでテンプレート内で次のようにしていたのです:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">
```

<!--
That `SYSTEM` identifier instructs the Thymeleaf parser to resolve the special
Thymeleaf-enabled `XHTML 1.0 Strict DTD` file and use it for validating our
template. And don't worry about that `http` thing, because that is only an
identifier, and the `DTD` file will be locally read from Thymeleaf's jar files.
-->
`SYSTEM` 識別子はThymeleafパーサーに対して、Thymeleafが用意した特別な `XHTML 1.0 Strict DTD`ファイルを解決して、テンプレートをバリデートするときにそれを使用するように指示します。 `http` の部分に関しては心配しないでください、これはただの識別子であって `DTD` ファイルはThymeleafのjarファイルからローカルで読み込まれます。

<!--
> Note that because this DOCTYPE declaration is a perfectly valid one, if we
> open a browser to statically display our template as a prototype it will be
> rendered in _Standards Mode_.
-->
> このDOCTYPE宣言は完全に妥当なので、ブラウザで静的にこのテンプレートをプロトタイプとして開いた場合は「標準モード」でレンダリングされることに注意してください。

<!--
Here you have the complete set of Thymeleaf-enabled `DTD` declarations for all
the supported flavours of XHTML:
-->
対応しているXHTML全てに対してThymeleafが用意した `DTD` 定義の一式を記載します:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-transitional-thymeleaf-4.dtd">
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-frameset-thymeleaf-4.dtd">
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml11-thymeleaf-4.dtd">
```

<!--
Also note that, in order for your IDE to be happy, and even if you are not
working in a validating mode, you will need to declare the `th` namespace in
your `html` tag:
-->
また、バリデートモードを使用していない場合でも、IDEが幸せになるように `th` ネームスペースを `html` タグに定義しておいてあげると良いです。

```html
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
```


<!--
13.2 Doctype translation
-->
13.2 Doctype変換
------------------------

<!--
It is fine for our templates to have a `DOCTYPE` like:
-->
テンプレートに次のように `DOCTYPE` を持つことは良いのですが:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">
```

<!--
But it would not be fine for our web applications to send XHTML documents with
this `DOCTYPE` to client browsers, because:
-->
この `DOCTYPE` を持ったXHTMLドキュメントをウェブアプリケーションからクライアントブラウザに送るのは次のような理由から良くありません:

<!--
 * They are not `PUBLIC` (they are `SYSTEM DOCTYPE`s), and therefore our web
   would not be validatable with the W3C Validators.
 * They are not needed, because once processed, all `th:*` tags will have
   dissapeared.
-->
 * `PUBLIC` ではないので(`SYSTEM DOCTYPE` なので)、W3Cのバリデーターでバリデートすることができない。
 * 処理後には全ての `th:*` タグはなくなるので、この宣言は不要。

<!--
That's why Thymeleaf includes a mechanism for _DOCTYPE translation_, which will
automatically translate your thymeleaf-specific XHTML `DOCTYPE`s into standard `DOCTYPE`s.
-->
そのため、Thymeleafには「DOCTYPE 変換」のメカニズムがあり、自動的にThymeleaf用のXHTML `DOCTYPE` を標準の `DOCTYPE` に変換します。

<!--
For example, if your template is _XHTML 1.0 Strict_ and looks like this:
-->
例えば、テンプレートが _XHTML 1.0 Strict_ で次のような場合:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
    ... 
</html>
```

<!--
After making Thymeleaf process the template, your resulting XHTML will look like
this:
-->
Thymeleafでテンプレートを処理すると、結果のXHTMLは次のようになります:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    ... 
</html>
```

<!--
You don't have to do anything for these transformations to take place: Thymeleaf
will take care of them automatically.
-->
この変換の実行に関しては何もする必要はありません: Thymeleafが自動的に面倒をみてくれます。



<!--
14 Some more Pages for our Grocery
-->
14 食料品店用のページをいくつか追加
==================================

<!--
Now we know a lot about using Thymeleaf, we can add some new pages to our
website for order management.
-->
Thymeleafの使い方について、もうたくさん知っているので、注文管理のための新規ページをいくつか追加することができます。

<!--
Note that we will focus on XHTML code, but you can have a look at the bundled
source code if you want to see the corresponding controllers.
-->
XHTMLコードにフォーカスしますが、対応するコントローラーを見てみたい場合はバンドルされたソースコードをチェックしてください。


<!--
14.1 Order List
-->
14.1 注文リスト
---------------

<!--
Let's start by creating an order list page, `/WEB-INF/templates/order/list.html`:
-->
注文リストページを作成しましょう `/WEB-INF/templates/order/list.html`:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

  <head>

    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body>

    <h1>Order list</h1>
  
    <table>
      <tr>
        <th>DATE</th>
        <th>CUSTOMER</th>
        <th>TOTAL</th>
        <th></th>
      </tr>
      <tr th:each="o : ${orders}" th:class="${oStat.odd}? 'odd'">
        <td th:text="${#calendars.format(o.date,'dd/MMM/yyyy')}">13 jan 2011</td>
        <td th:text="${o.customer.name}">Frederic Tomato</td>
        <td th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}">23.32</td>
        <td>
          <a href="details.html" th:href="@{/order/details(orderId=${o.id})}">view</a>
        </td>
      </tr>
    </table>
  
    <p>
      <a href="../home.html" th:href="@{/}">Return to home</a>
    </p>
    
  </body>
  
</html>
```

<!--
There's nothing here that should surprise us, except for this little bit of OGNL
magic:
-->
驚くようなことは何もありません。ちょっとしたOGNLマジックくらいですね:

```html
<td th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}">23.32</td>
```

<!--
What that does is, for each order line (`OrderLine` object) in the order,
multiply its `purchasePrice` and `amount` properties (by calling the
corresponding `getPurchasePrice()` and `getAmount()` methods) and return the
result into a list of numbers, later aggregated by the `#aggregates.sum(...)`
function in order to obtain the order total price.
-->
ここでやっているのは、注文の中の各注文行(`OrderLine` オブジェクト)で `purchasePrice` と `amount` プロパティを(対応する `getPurchasePrice()` と `getAmount()` メソッドを呼び出して)掛けあわせて結果を数値のリストに返し、 `#aggregates.sum(...)` 関数で集計して注文の合計金額を取得するという処理です。

<!--
You've got to love the power of OGNL.
-->
きっとOGNLのパワーが好きになったでしょう。


<!--
14.2 Order Details
-->
14.2 注文詳細
------------------

<!--
Now for the order details page, in which we will make a heavy use of asterisk
syntax:
-->
次は、注文詳細ページです。アスタリスク構文を多用します:

```html
<!DOCTYPE html SYSTEM "http://www.thymeleaf.org/dtd/xhtml1-strict-thymeleaf-4.dtd">

<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">

  <head>
    <title>Good Thymes Virtual Grocery</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" media="all" 
          href="../../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
  </head>

  <body th:object="${order}">

    <h1>Order details</h1>

    <div>
      <p><b>Code:</b> <span th:text="*{id}">99</span></p>
      <p>
        <b>Date:</b>
        <span th:text="*{#calendars.format(date,'dd MMM yyyy')}">13 jan 2011</span>
      </p>
    </div>

    <h2>Customer</h2>

    <div th:object="*{customer}">
      <p><b>Name:</b> <span th:text="*{name}">Frederic Tomato</span></p>
      <p>
        <b>Since:</b>
        <span th:text="*{#calendars.format(customerSince,'dd MMM yyyy')}">1 jan 2011</span>
      </p>
    </div>
  
    <h2>Products</h2>
  
    <table>
      <tr>
        <th>PRODUCT</th>
        <th>AMOUNT</th>
        <th>PURCHASE PRICE</th>
      </tr>
      <tr th:each="ol,row : *{orderLines}" th:class="${row.odd}? 'odd'">
        <td th:text="${ol.product.name}">Strawberries</td>
        <td th:text="${ol.amount}" class="number">3</td>
        <td th:text="${ol.purchasePrice}" class="number">23.32</td>
      </tr>
    </table>

    <div>
      <b>TOTAL:</b>
      <span th:text="*{#aggregates.sum(orderLines.{purchasePrice * amount})}">35.23</span>
    </div>
  
    <p>
      <a href="list.html" th:href="@{/order/list}">Return to order list</a>
    </p>

  </body>
  
</html>
```

<!--
Not much really new here, except for this nested object selection:
-->
ここでも本当に新しいことはありません。このネストされたオブジェクト選択くらいですね:

```html
<body th:object="${order}">

  ...

  <div th:object="*{customer}">
    <p><b>Name:</b> <span th:text="*{name}">Frederic Tomato</span></p>
    ...
  </div>

  ...
</body>
```

<!--
...which makes that `*{name}` in fact equivalent to:
-->
この `*{name}` は実際には次と同等です:

```html
<p><b>Name:</b> <span th:text="${order.customer.name}">Frederic Tomato</span></p>
```



<!--
15 More on Configuration
-->
15 設定についてもう少し
========================


<!--
15.1 Template Resolvers
-->
15.1 テンプレートリゾルバー
-----------------------


<!--
For our Good Thymes Virtual Grocery, we chose an `ITemplateResolver`
implementation called `ServletContextTemplateResolver` that allowed us to obtain
templates as resources from the Servlet Context.
-->
グッドタイムス仮想食料品店では `ITemplateResolver` 実装の `ServletContextTemplateResolver` を選び、テンプレートをサーブレットコンテキストからリソースとして取得しました。

<!--
Besides giving you the ability to create your own template resolver by
implementing `ITemplateResolver,` Thymeleaf includes three other implementations
out of the box:
-->
`ITemplateResolver` を実装して独自のテンプレートリゾルバーを作成する以外にもThymeleafにはそのまま使用可能な実装が3つあります:

<!--
 * `org.thymeleaf.templateresolver.ClassLoaderTemplateResolver`, which resolves
   templates as classloader resources, like:

    ```java
    return Thread.currentThread().getContextClassLoader().getResourceAsStream(templateName);
    ```

 * `org.thymeleaf.templateresolver.FileTemplateResolver`, which resolves
   templates as files from the file system, like:

    ```java
    return new FileInputStream(new File(templateName));
    ```

 * `org.thymeleaf.templateresolver.UrlTemplateResolver`, which resolves
   templates as URLs (even non-local ones), like:

    ```java
    return (new URL(templateName)).openStream();
    ```
-->
 * `org.thymeleaf.templateresolver.ClassLoaderTemplateResolver`
   テンプレートをクラスローダーリソースとして解決します:

    ```java
    return Thread.currentThread().getContextClassLoader().getResourceAsStream(templateName);
    ```

 * `org.thymeleaf.templateresolver.FileTemplateResolver` テンプレートをファイルシステムのファイルとして解決します:

    ```java
    return new FileInputStream(new File(templateName));
    ```

 * `org.thymeleaf.templateresolver.UrlTemplateResolver` テンプレートをURL(ローカル以外でも大丈夫)として解決します:

    ```java
    return (new URL(templateName)).openStream();
    ```

<!--
All of the pre-bundled implementations of `ITemplateResolver` allow the same set
of configuration parameters, which include:
-->
最初からバンドルされている `ITemplateResolver` 実装には、全て同じ設定パラメータを指定することができます。
そのパラメータには次のようなものがあります:

<!--
 * Prefix and suffix (as already seen):

    ```java
    templateResolver.setPrefix("/WEB-INF/templates/");
    templateResolver.setSuffix(".html");
    ```

 * Template aliases that allow the use of template names that do not directly
   correspond to file names. If both suffix/prefix and alias exist, alias will
   be applied before prefix/suffix:

    ```java
    templateResolver.addTemplateAlias("adminHome","profiles/admin/home");
    templateResolver.setTemplateAliases(aliasesMap);
    ```

 * Encoding to be applied when reading templates:

    ```java
    templateResolver.setEncoding("UTF-8");
    ```

 * Default template mode, and patterns for defining other modes for specific
   templates:

    ```java
    // Default is TemplateMode.XHTML
    templateResolver.setTemplateMode("HTML5");
    templateResolver.getXhtmlTemplateModePatternSpec().addPattern("*.xhtml");
    ```

 * Default mode for template cache, and patterns for defining whether specific
   templates are cacheable or not:

    ```java
    // Default is true
    templateResolver.setCacheable(false);
    templateResolver.getCacheablePatternSpec().addPattern("/users/*");
    ```

 * TTL in milliseconds for parsed template cache entries originated in this
   template resolver. If not set, the only way to remove an entry from the cache
   will be LRU (cache max size exceeded and the entry is the oldest).

    ```java
    // Default is no TTL (only LRU would remove entries)
    templateResolver.setCacheTTLMs(60000L);
    ```
-->
 * Prefix と suffix の設定(もう見たことありますね):

    ```java
    templateResolver.setPrefix("/WEB-INF/templates/");
    templateResolver.setSuffix(".html");
    ```

 * テンプレートエイリアス設定。これを使用するとファイル名と一致しないテンプレート名を使用することができます。suffix/prefixとエイリアスが両方指定されている場合はエイリアスがprefix/suffixより前に適用されます:

    ```java
    templateResolver.addTemplateAlias("adminHome","profiles/admin/home");
    templateResolver.setTemplateAliases(aliasesMap);
    ```

 * テンプレートを読み込む際のエンコーディング設定:

    ```java
    templateResolver.setEncoding("UTF-8");
    ```

 * デフォルトテンプレートモード設定と、特定のテンプレートに他のモードを指定するためのパターン設定:

    ```java
    // デフォルトは TemplateMode.XHTML
    templateResolver.setTemplateMode("HTML5");
    templateResolver.getXhtmlTemplateModePatternSpec().addPattern("*.xhtml");
    ```

 * テンプレートキャッシュのデフォルトモード設定と、特定のテンプレートにキャッシュするかしないかを指定するためのパターン設定:

    ```java
    // デフォルトは true
    templateResolver.setCacheable(false);
    templateResolver.getCacheablePatternSpec().addPattern("/users/*");
    ```

 * このテンプレートリゾルバーでパースされたテンプレートキャッシュエントリーのTTLをミリセカンドで設定。設定されていない場合は、キャッシュからエントリーが削除されるのはLRU(最大キャッシュサイズを超えた際に一番古いキャッシュエントリーが削除される)のみになります。

    ```java
    // デフォルトはTTL指定なし (LRUのみがエントリーを削除)
    templateResolver.setCacheTTLMs(60000L);
    ```


<!--
Also, a Template Engine can be specified several template resolvers, in which case an
order can be established between them for template resolution so that, if the
first one is not able to resolve the template, the second one is asked, and so
on:
-->
また、テンプレートエンジンには複数のテンプレートリゾルバーを指定することもできます。その場合、テンプレート解決のためにテンプレートリゾルバーは順番付けされ、最初のリゾルバーがテンプレートを解決できない場合には、次のリゾルバーに問い合わせる、といった流れで処理を行います:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.setOrder(Integer.valueOf(1));

ServletContextTemplateResolver servletContextTemplateResolver = new ServletContextTemplateResolver();
servletContextTemplateResolver.setOrder(Integer.valueOf(2));

templateEngine.addTemplateResolver(classLoaderTemplateResolver);
templateEngine.addTemplateResolver(servletContextTemplateResolver);
```

<!--
When several template resolvers are applied, it is recommended to specify
patterns for each template resolver so that Thymeleaf can quickly discard those
template resolvers that are not meant to resolve the template, enhancing
performance. Doing this is not a requirement, but an optimization:
-->
複数のテンプレートリゾルバーが適用されている場合には、それぞれのテンプレートリゾルバーにパターンを指定することをお勧めします。そうすることでThymeleafはテンプレートに対して、対象外のリゾルバーを素早く無視することができるので、パフォーマンスが良くなります。必須ということではなく、最適化のためのお勧めです:

```java
ClassLoaderTemplateResolver classLoaderTemplateResolver = new ClassLoaderTemplateResolver();
classLoaderTemplateResolver.setOrder(Integer.valueOf(1));
// This classloader will not be even asked for any templates not matching these patterns 
classLoaderTemplateResolver.getResolvablePatternSpec().addPattern("/layout/*.html");
classLoaderTemplateResolver.getResolvablePatternSpec().addPattern("/menu/*.html");

ServletContextTemplateResolver servletContextTemplateResolver = new ServletContextTemplateResolver();
servletContextTemplateResolver.setOrder(Integer.valueOf(2));
```


<!--
15.2 Message Resolvers
-->
15.2 メッセージリゾルバー
----------------------

<!--
We did not explicitly specify a Message Resolver implementation for our Grocery
application, and as it was explained before, this meant that the implementation
being used was an `org.thymeleaf.messageresolver.StandardMessageResolver` object.
-->
私たちの食料品店アプリケーションでは、明示的にメッセージリゾルバーの実装を指定していません。前述の通り、この場合は `org.thymeleaf.messageresolver.StandardMessageResolver` オブジェクトが使用されています。

<!--
This `StandardMessageResolver,` which looks for messages files with the same
name as the template in the way already explained, is in fact the only message
resolver implementation offered by Thymeleaf core out of the box, although of
course you can create your own by just implementing the `org.thymeleaf.messageresolver.IMessageResolver`
interface.
-->
この `StandardMessageResolver` は、既に説明した通りテンプレートと同じ名前のメッセージファイルを探しますが、実際のところThymeleafのコアがそのまま使えるように用意している唯一のメッセージリゾルバーです。ですがもちろん、 `org.thymeleaf.messageresolver.IMessageResolver` を実装すればあなた独自のメッセージリゾルバーを作成することができます。

<!--
> The Thymeleaf + Spring integration packages offer an `IMessageResolver`
> implementation which uses the standard Spring way of retrieving externalized
> messages, by using `MessageSource` objects.
-->
> Thymeleaf + Spring 連携パッケージでは `IMessageResolver` の実装が提供されていて、そのリゾルバーは標準的なSpringの方法で、`MessageSource` オブジェクトを使用して外部化されたメッセージを取得します。

<!--
What if you wanted to add a message resolver (or more) to the Template Engine?
Easy:
-->
テンプレートエンジンにメッセージリゾルバーを1つ(または複数)指定したい場合はどうすれば良いでしょうか？簡単です:

```java
// For setting only one
templateEngine.setMessageResolver(messageResolver);

// For setting more than one
templateEngine.addMessageResolver(messageResolver);
```

<!--
And why would you want to have more than one message resolver? for the same
reason as template resolvers: message resolvers are ordered and if the first one
cannot resolve a specific message, the second one will be asked, then the third,
etc.
-->
でも、どうして複数のメッセージリゾルバーを指定したいのでしょうか？テンプレートリゾルバーと同じ理由ですね: メッセージリゾルバーは順番付けされて、最初のリゾルバーがあるメッセージを解決できなければ、次のリゾルバーに問い合わせて、その次は3番目に・・・となります。


<!--
15.3 Logging
-->
15.3 ロギング
------------

<!--
Thymeleaf pays quite a lot of attention to logging, and always tries to offer
the maximum amount of useful information through its logging interface.
-->
Thymeleafはロギングにもかなり気を使っていて、いつでもロギングインターフェイスを通して最大限の有用な情報を提供しようとしています。

<!--
The logging library used is `slf4j,` which in fact acts as a bridge to whichever
logging implementation you might want to use in your application (for example, `log4j`).
-->
ロギングライブラリは `slf4j` を使用しています。`slf4j` は実際にアプリケーションで使用しているどんなロギング実装(例えば `log4j` )に対してもブリッジとして振る舞います。

<!--
Thymeleaf classes will log `TRACE`, `DEBUG` and `INFO`-level information,
depending on the level of detail you desire, and besides general logging it will
use three special loggers associated with the TemplateEngine class which you can
configure separately for different purposes:
-->
Thymeleafのクラスは、詳細レベルに合わせて `TRACE` と `DEBUG` と `INFO` レベルのログを出力します。そして一般的なロギングとは別に、 TemplateEngine クラスに関連付けられた3つの特別なロガーがあり目的に合わせて個別に設定をすることができます。

<!--
 * `org.thymeleaf.TemplateEngine.CONFIG` will output detailed configuration of
   the library during initialization.
 * `org.thymeleaf.TemplateEngine.TIMER` will output information about the amount
   of time taken to process each template (useful for benchmarking!)
 * `org.thymeleaf.TemplateEngine.cache` is the prefix for a set of loggers that
   output specific information about the caches. Although the names of the cache
   loggers are configurable by the user and thus could change, by default they
   are:
    * `org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.FRAGMENT_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.MESSAGE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.EXPRESSION_CACHE`
-->
 * `org.thymeleaf.TemplateEngine.CONFIG` は、ライブラリの初期化時に設定の詳細を出力します。
 * `org.thymeleaf.TemplateEngine.TIMER` は、それぞれのテンプレートを処理する際にかかった時間を出力します(ベンチマークに便利です！)。
 * `org.thymeleaf.TemplateEngine.cache` は、キャッシュに関する特定の情報を出力するロガーのプレフィックスになっています。ユーザーがキャッシュロガーの名前を設定することができるので、名前は変わりうるのですが、デフォルトでは:
    * `org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.FRAGMENT_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.MESSAGE_CACHE`
    * `org.thymeleaf.TemplateEngine.cache.EXPRESSION_CACHE`

<!--
An example configuration for Thymeleaf's logging infrastructure, using `log4j`,
could be:
-->
Thymeleafのロギングインフラのための設定例は `log4j` を使用する場合、次のようになります:

```
log4j.logger.org.thymeleaf=DEBUG
log4j.logger.org.thymeleaf.TemplateEngine.CONFIG=TRACE
log4j.logger.org.thymeleaf.TemplateEngine.TIMER=TRACE
log4j.logger.org.thymeleaf.TemplateEngine.cache.TEMPLATE_CACHE=TRACE
```



<!--
16 Template Cache
-->
16 テンプレートキャッシュ
=================

<!--
Thymeleaf works thanks to a DOM processing engine and a series of processors
ーーーone for each type of node that needs to apply logicーーー that modify the document's
DOM tree in order to create the results you expect by combining this tree with
your data.
-->
ThymeleafはDOM処理エンジンと一連のプロセッサ --- ロジックを適用する必要があるノードのタイプごとに1つ --- のおかげで動いています。プロセッサは、ドキュメントのDOMツリーとデータを結びつけることによって期待する結果を作成するために、DOMツリーに変更を加えます。

<!--
It also includes ーーーby defaultーーー a cache that stores parsed templates, this is, the
DOM trees resulting from reading and parsing template files before processing
them. This is especially useful when working in a web application, and builds on
the following concepts:
-->
また、 --- デフォルトで --- パースしたテンプレートをキャッシュする機能があります。テンプレートファイルを読み込んでパースした結果の、処理前のDOMツリーをキャッシュします。これは特に以下のようなコンセプトに基づいて作成されているウェブアプリケーションに役立ちます:


<!--
 * Input/Output is almost always the slowest part of any application. In-memory
   process is extremely quick compared to it.
 * Cloning an existing in-memory DOM-tree is always much quicker than reading a
   template file, parsing it and creating a new DOM object tree for it.
 * Web applications usually only have a few dozen templates.
 * Template files are small-to-medium size, and they are not modified while the
   application is running.
-->
 * Input/Output が、いつでもどんなアプリケーションにとっても最も遅い部分である。インメモリ処理の方が全然速い。
 * インメモリのDOMツリーをクローンする方が、テンプレートファイルを読み込んでパースして新しいDOMツリーを生成するよりも断然速い。
 * ウェブアプリケーションは通常数十個のテンプレートしか使わない。
 * テンプレートファイルは小-中程度のサイズであって、アプリケーションの実行中には変更されない。


<!--
This all leads to the idea that caching the most used templates in a web
application is feasible without wasting big amounts of memory, and also that it
will save a lot of time that would be spent on input/output operations on a
small set of files that, in fact, never change.
-->
このことから、ウェブアプリケーションで最も使用されているテンプレートをキャッシュすることで、大量のメモリを無駄に使うこともなくうまくいきそうですし、実際には決して変更されない少ないファイルのIO処理に費やされるたくさんの時間を節約することができると考えられます。

<!--
And how can we take control of this cache? First, we've learned before that we
can enable or disable it at the Template Resolver, even acting only on specific
templates:
-->
このキャッシュをどのようにコントロールすることができるのでしょうか？まず、テンプレートリゾルバーで有効/無効の切り替えをすることができ、特定のテンプレートにだけ適用することもできるということは学びましたね。

```java
// Default is true
templateResolver.setCacheable(false);
templateResolver.getCacheablePatternSpec().addPattern("/users/*");
```

<!--
Also, we could modify its configuration by establishing our own _Cache Manager_
object, which could be an instance of the default `StandardCacheManager`
implementation:
-->
また、独自の「キャッシュマネージャ」を作成することで設定を変更することもできます。デフォルトの `StandardCacheManager` 実装のインスタンスを使用することも可能です。

```java
// Default is 50
StandardCacheManager cacheManager = new StandardCacheManager();
cacheManager.setTemplateCacheMaxSize(100);
...
templateEngine.setCacheManager(cacheManager);
```

<!--
Refer to the javadoc API of `org.thymeleaf.cache.StandardCacheManager` for more
info on configuring the caches.
-->
キャッシュの設定についてのより詳しい情報は `org.thymeleaf.cache.StandardCacheManager` のJavadoc APIを参照してください。

<!--
Entries can be manually removed from the template cache:
-->
テンプレートキャッシュから手動でエントリーを削除することもできます:

```java
// Clear the cache completely
templateEngine.clearTemplateCache();

// Clear a specific template from the cache
templateEngine.clearTemplateCacheFor("/users/userList");
```



17 Appendix A: Expression Basic Objects
=======================================

<!--
Some objects and variable maps are always available to be invoked at variable expressions (executed by OGNL or SpringEL). Let's see them:
-->
(OGNLやSpringELによって実行される)変数式の中で、常に使用可能なオブジェクトや変数マップがあります。それを見てみましょう:

<!--
### Base objects
-->
### 基本オブジェクト

<!--
 * **\#ctx** : the context object. It will be an implementation of `org.thymeleaf.context.IContext`, 
   `org.thymeleaf.context.IWebContext` depending on our environment (standalone or web). If we are
   using the _Spring integration module_, it will be an instance of 
   `org.thymeleaf.spring[3|4].context.SpringWebContext`.
-->
 * **\#ctx** : コンテキストオブジェクト。環境(スタンドアローンかウェブか)によって `org.thymeleaf.context.IContext` や `org.thymeleaf.context.IWebContext` の実装になります。 _Spring連携モジュール_ を使用している場合は、 `org.thymeleaf.spring[3|4].context.SpringWebContext` のインスタンスになります。


```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.IContext
 * ======================================================================
 */

${#ctx.locale}
${#ctx.variables}

/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.IWebContext
 * ======================================================================
 */

${#ctx.applicationAttributes}
${#ctx.httpServletRequest}
${#ctx.httpServletResponse}
${#ctx.httpSession}
${#ctx.requestAttributes}
${#ctx.requestParameters}
${#ctx.servletContext}
${#ctx.sessionAttributes}
```

<!--
 * **\#locale** : direct access to the `java.util.Locale` associated with current request.
-->
 * **\#locale** : 現在のリクエストに関連付けられている `java.util.Locale` への直接アクセス。

```java
${#locale}
```

<!--
 * **\#vars** : an instance of `org.thymeleaf.context.VariablesMap` with all the variables in the Context
    (usually the variables contained in `#ctx.variables` plus local ones).

    Unqualified expressions are evaluated against this object. In fact, `${something}` is completely equivalent
    to (but more beautiful than) `${#vars.something}`.

    `#root` is a synomyn for the same object.
-->
 * **\#vars** : コンテキスト内の全ての変数を持った `org.thymeleaf.context.VariablesMap` のインスタンス(通常は `#ctx.variables` に含まれている変数にローカル変数を加えたものです)。

    限定子がついていない式はこのオブジェクトに対して評価されます。実際のところ `${something}` は `${#vars.something}` と完全に同等です(がより美しいです)。

    `#root` はこのオブジェクトの同意語です。

```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.VariablesMap
 * ======================================================================
 */

${#vars.get('foo')}
${#vars.containsKey('foo')}
${#vars.size()}
...
```

<!--
### Web context namespaces for request/session attributes, etc.
-->
### request/session 属性などに対するウェブコンテキストネームスペース

<!--
When using Thymeleaf in a web environment, we can use a series of shortcuts for accessing request parameters, session attributes and application attributes:
-->
ウェブ環境でThymeleafを使っている場合、リクエストパラメータ、セッション属性、アプリケーション属性にアクセスするのにショートカットを使用することができます。

<!--
   > Note these are not *context objects*, but maps added to the context as variables, so we access them without `#`. In some way, therefore, they act as *namespaces*.
-->
   > これらは「コンテキストオブジェクト」ではなく、コンテキストに対して変数として追加されたマップです。ですので `#` を使いません。そのため、ある意味で「名前空間」のように振る舞います。

<!--
 * **param** : for retrieving request parameters. `${param.foo}` is a
   `String[]` with the values of the `foo` request parameter, so `${param.foo[0]}` will normally be used for getting the first value.
-->
 * **param** : リクエストパラメータを取得するために使用します。 `${param.foo}` は `foo` リクエストパラメータの値を持つ `String[]` です。ですので、最初の値を取得するために普通は `${param.foo[0]}` を使用します。

```java
/*
 * ============================================================================
 * See javadoc API for class org.thymeleaf.context.WebRequestParamsVariablesMap
 * ============================================================================
 */

${param.foo}              // Retrieves a String[] with the values of request parameter 'foo'
${param.size()}
${param.isEmpty()}
${param.containsKey('foo')}
...
```

<!--
 * **session** : for retrieving session attributes.
-->
 * **session** : セッション属性を取得するために使用します。


```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.context.WebSessionVariablesMap
 * ======================================================================
 */

${session.foo}                 // Retrieves the session atttribute 'foo'
${session.size()}
${session.isEmpty()}
${session.containsKey('foo')}
...
```

<!--
 * **application** : for retrieving application/servlet context attributes.
-->
 * **application** : アプリケーション/サーブレットコンテキストを取得するために使用します。


```java
/*
 * =============================================================================
 * See javadoc API for class org.thymeleaf.context.WebServletContextVariablesMap
 * =============================================================================
 */

${application.foo}              // Retrieves the ServletContext atttribute 'foo'
${application.size()}
${application.isEmpty()}
${application.containsKey('foo')}
...
```

<!--
Note there is **no need to specify a namespace for accessing request attributes** (as opposed to *request parameters*) because all request attributes are automatically added to the context as variables in the context root:
-->
**リクエスト属性にアクセスする際には(リクエストパラメータとは対照的に)名前空間を指定する必要がない** ことに注意してください。なぜなら、全てのリクエスト属性は自動的にコンテキストルートの変数としてコンテキストに追加されるからです:

```java
${myRequestAttribute}
```

<!--
### Web context objects
-->
### ウェブコンテキストオブジェクト

<!--
Inside a web environment there is also direct access to the following objects (note these are objects, not maps/namespaces):
-->
ウェブ環境の場合は、次のようなオブジェクトにも直接アクセスすることができます(これらはオブジェクトであって、マップや名前空間ではないことに注意して下さい):

<!--
 * **\#httpServletRequest** : direct access to the `javax.servlet.http.HttpServletRequest` object associated with the current request.
-->
 * **\#httpServletRequest** : 現在のリクエストに関連付けられた `javax.servlet.http.HttpServletRequest` オブジェクトへの直接アクセス


```java
${#httpServletRequest.getAttribute('foo')}
${#httpServletRequest.getParameter('foo')}
${#httpServletRequest.getContextPath()}
${#httpServletRequest.getRequestName()}
...
```

<!--
 * **\#httpSession** : direct access to the `javax.servlet.http.HttpSession` object associated with the current request.
-->
 * **\#httpSession** : 現在のリクエストに関連付けられた `javax.servlet.http.HttpSession` オブジェクトへの直接アクセス。

```java
${#httpSession.getAttribute('foo')}
${#httpSession.id}
${#httpSession.lastAccessedTime}
...
```

<!--
### Spring context objects
-->
### Springコンテキストオブジェクト

<!--
If you are using Thymeleaf from Spring, you can also access these objects:
-->
SpringからThymeleafを使用している場合は、これらのオブジェクトにもアクセスできます:

<!--
 * **\#themes** : provides the same features as the Spring `spring:theme` JSP tag.
-->
 * **\#themes** : Springの `spring:theme` JSPタグと同じ機能を提供します。


```java
${#themes.code('foo')}
```

<!--
### Spring beans
-->
### Springビーン

<!--
Thymeleaf also allows accessing beans registered at your Spring Application Context in the standard way defined  by Spring EL, which is using the syntax `@beanName`, for example:
-->
Thymeleafでは、SpringELによってSpringアプリケーションコンテキストに通常の方法で定義されて登録されたビーンに `@beanName` シンタックスを使用してアクセスすることができます。例:


```html
<div th:text="${@authService.getUserName()}">...</div>
```




18 Appendix B: Expression Utility Objects
=========================================

<!--
### Dates
-->
### 日付

<!--
 * **\#dates** : utility methods for `java.util.Date` objects:
-->
 * **\#dates** : `java.util.Date` オブジェクトに対するユーティリティメソッド群:

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Dates
 * ======================================================================
 */

/*
 * Format date with the standard locale format
 * Also works with arrays, lists or sets
 */
${#dates.format(date)}
${#dates.arrayFormat(datesArray)}
${#dates.listFormat(datesList)}
${#dates.setFormat(datesSet)}

/*
 * Format date with the ISO8601 format
 * Also works with arrays, lists or sets
 */
${#dates.formatISO(date)}
${#dates.arrayFormatISO(datesArray)}
${#dates.listFormatISO(datesList)}
${#dates.setFormatISO(datesSet)}

/*
 * Format date with the specified pattern
 * Also works with arrays, lists or sets
 */
${#dates.format(date, 'dd/MMM/yyyy HH:mm')}
${#dates.arrayFormat(datesArray, 'dd/MMM/yyyy HH:mm')}
${#dates.listFormat(datesList, 'dd/MMM/yyyy HH:mm')}
${#dates.setFormat(datesSet, 'dd/MMM/yyyy HH:mm')}

/*
 * Obtain date properties
 * Also works with arrays, lists or sets
 */
${#dates.day(date)}                    // also arrayDay(...), listDay(...), etc.
${#dates.month(date)}                  // also arrayMonth(...), listMonth(...), etc.
${#dates.monthName(date)}              // also arrayMonthName(...), listMonthName(...), etc.
${#dates.monthNameShort(date)}         // also arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#dates.year(date)}                   // also arrayYear(...), listYear(...), etc.
${#dates.dayOfWeek(date)}              // also arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#dates.dayOfWeekName(date)}          // also arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#dates.dayOfWeekNameShort(date)}     // also arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#dates.hour(date)}                   // also arrayHour(...), listHour(...), etc.
${#dates.minute(date)}                 // also arrayMinute(...), listMinute(...), etc.
${#dates.second(date)}                 // also arraySecond(...), listSecond(...), etc.
${#dates.millisecond(date)}            // also arrayMillisecond(...), listMillisecond(...), etc.

/*
 * Create date (java.util.Date) objects from its components
 */
${#dates.create(year,month,day)}
${#dates.create(year,month,day,hour,minute)}
${#dates.create(year,month,day,hour,minute,second)}
${#dates.create(year,month,day,hour,minute,second,millisecond)}

/*
 * Create a date (java.util.Date) object for the current date and time
 */
${#dates.createNow()}

/*
 * Create a date (java.util.Date) object for the current date (time set to 00:00)
 */
${#dates.createToday()}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Dates
 * ======================================================================
 */

/*
 * 標準ロケールフォーマットで日付をフォーマットします
 * 配列、リスト、セットにも対応しています
 */
${#dates.format(date)}
${#dates.arrayFormat(datesArray)}
${#dates.listFormat(datesList)}
${#dates.setFormat(datesSet)}

/*
 * ISO8601フォーマットで日付をフォーマットします
 * 配列、リスト、セットにも対応しています
 */
${#dates.formatISO(date)}
${#dates.arrayFormatISO(datesArray)}
${#dates.listFormatISO(datesList)}
${#dates.setFormatISO(datesSet)}

/*
 * 指定されたパターンで日付をフォーマットします
 * 配列、リスト、セットにも対応しています
 */
${#dates.format(date, 'dd/MMM/yyyy HH:mm')}
${#dates.arrayFormat(datesArray, 'dd/MMM/yyyy HH:mm')}
${#dates.listFormat(datesList, 'dd/MMM/yyyy HH:mm')}
${#dates.setFormat(datesSet, 'dd/MMM/yyyy HH:mm')}

/*
 * 日付のプロパティを取得します
 * 配列、リスト、セットにも対応しています
 */
${#dates.day(date)}                    // also arrayDay(...), listDay(...), etc.
${#dates.month(date)}                  // also arrayMonth(...), listMonth(...), etc.
${#dates.monthName(date)}              // also arrayMonthName(...), listMonthName(...), etc.
${#dates.monthNameShort(date)}         // also arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#dates.year(date)}                   // also arrayYear(...), listYear(...), etc.
${#dates.dayOfWeek(date)}              // also arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#dates.dayOfWeekName(date)}          // also arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#dates.dayOfWeekNameShort(date)}     // also arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#dates.hour(date)}                   // also arrayHour(...), listHour(...), etc.
${#dates.minute(date)}                 // also arrayMinute(...), listMinute(...), etc.
${#dates.second(date)}                 // also arraySecond(...), listSecond(...), etc.
${#dates.millisecond(date)}            // also arrayMillisecond(...), listMillisecond(...), etc.

/*
 * コンポーネントを指定して日付オブジェクト(java.util.Date)を作成します
 */
${#dates.create(year,month,day)}
${#dates.create(year,month,day,hour,minute)}
${#dates.create(year,month,day,hour,minute,second)}
${#dates.create(year,month,day,hour,minute,second,millisecond)}

/*
 * 現在日時の日付オブジェクト(java.util.Date)を作成します
 */
${#dates.createNow()}

/*
 * 現在日の日付のオブジェクト(java.util.Date)を作成します(時間は00:00に設定されます)
 */
${#dates.createToday()}
```


<!--
### Calendars
-->
### カレンダー

<!--
 * **\#calendars** : analogous to `#dates`, but for `java.util.Calendar` objects:
-->
 * **\#calendars** : `#dates` に似ていますが、 `java.util.Calendar` オブジェクト用です:

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Calendars
 * ======================================================================
 */

/*
 * Format calendar with the standard locale format
 * Also works with arrays, lists or sets
 */
${#calendars.format(cal)}
${#calendars.arrayFormat(calArray)}
${#calendars.listFormat(calList)}
${#calendars.setFormat(calSet)}

/*
 * Format calendar with the ISO8601 format
 * Also works with arrays, lists or sets
 */
${#calendars.formatISO(cal)}
${#calendars.arrayFormatISO(calArray)}
${#calendars.listFormatISO(calList)}
${#calendars.setFormatISO(calSet)}

/*
 * Format calendar with the specified pattern
 * Also works with arrays, lists or sets
 */
${#calendars.format(cal, 'dd/MMM/yyyy HH:mm')}
${#calendars.arrayFormat(calArray, 'dd/MMM/yyyy HH:mm')}
${#calendars.listFormat(calList, 'dd/MMM/yyyy HH:mm')}
${#calendars.setFormat(calSet, 'dd/MMM/yyyy HH:mm')}

/*
 * Obtain calendar properties
 * Also works with arrays, lists or sets
 */
${#calendars.day(date)}                // also arrayDay(...), listDay(...), etc.
${#calendars.month(date)}              // also arrayMonth(...), listMonth(...), etc.
${#calendars.monthName(date)}          // also arrayMonthName(...), listMonthName(...), etc.
${#calendars.monthNameShort(date)}     // also arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#calendars.year(date)}               // also arrayYear(...), listYear(...), etc.
${#calendars.dayOfWeek(date)}          // also arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#calendars.dayOfWeekName(date)}      // also arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#calendars.dayOfWeekNameShort(date)} // also arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#calendars.hour(date)}               // also arrayHour(...), listHour(...), etc.
${#calendars.minute(date)}             // also arrayMinute(...), listMinute(...), etc.
${#calendars.second(date)}             // also arraySecond(...), listSecond(...), etc.
${#calendars.millisecond(date)}        // also arrayMillisecond(...), listMillisecond(...), etc.

/*
 * Create calendar (java.util.Calendar) objects from its components
 */
${#calendars.create(year,month,day)}
${#calendars.create(year,month,day,hour,minute)}
${#calendars.create(year,month,day,hour,minute,second)}
${#calendars.create(year,month,day,hour,minute,second,millisecond)}

/*
 * Create a calendar (java.util.Calendar) object for the current date and time
 */
${#calendars.createNow()}

/*
 * Create a calendar (java.util.Calendar) object for the current date (time set to 00:00)
 */
${#calendars.createToday()}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Calendars
 * ======================================================================
 */

/*
 * 標準ロケールフォーマットでカレンダーをフォーマットします
 * 配列、リスト、セットにも対応しています
 */
${#calendars.format(cal)}
${#calendars.arrayFormat(calArray)}
${#calendars.listFormat(calList)}
${#calendars.setFormat(calSet)}

/*
 * ISO8601フォーマットでカレンダーをフォーマットします
 * 配列、リスト、セットにも対応しています
 */
${#calendars.formatISO(cal)}
${#calendars.arrayFormatISO(calArray)}
${#calendars.listFormatISO(calList)}
${#calendars.setFormatISO(calSet)}

/*
 * 指定されたパターンでカレンダーをフォーマットします
 * 配列、リスト、セットにも対応しています
 */
${#calendars.format(cal, 'dd/MMM/yyyy HH:mm')}
${#calendars.arrayFormat(calArray, 'dd/MMM/yyyy HH:mm')}
${#calendars.listFormat(calList, 'dd/MMM/yyyy HH:mm')}
${#calendars.setFormat(calSet, 'dd/MMM/yyyy HH:mm')}

/*
 * カレンダーのプロパティを取得します
 * 配列、リスト、セットにも対応しています
 */
${#calendars.day(date)}                // also arrayDay(...), listDay(...), etc.
${#calendars.month(date)}              // also arrayMonth(...), listMonth(...), etc.
${#calendars.monthName(date)}          // also arrayMonthName(...), listMonthName(...), etc.
${#calendars.monthNameShort(date)}     // also arrayMonthNameShort(...), listMonthNameShort(...), etc.
${#calendars.year(date)}               // also arrayYear(...), listYear(...), etc.
${#calendars.dayOfWeek(date)}          // also arrayDayOfWeek(...), listDayOfWeek(...), etc.
${#calendars.dayOfWeekName(date)}      // also arrayDayOfWeekName(...), listDayOfWeekName(...), etc.
${#calendars.dayOfWeekNameShort(date)} // also arrayDayOfWeekNameShort(...), listDayOfWeekNameShort(...), etc.
${#calendars.hour(date)}               // also arrayHour(...), listHour(...), etc.
${#calendars.minute(date)}             // also arrayMinute(...), listMinute(...), etc.
${#calendars.second(date)}             // also arraySecond(...), listSecond(...), etc.
${#calendars.millisecond(date)}        // also arrayMillisecond(...), listMillisecond(...), etc.

/*
 * コンポーネントを指定してカレンダーオブジェクト(java.util.Calendar)を作成します
 */
${#calendars.create(year,month,day)}
${#calendars.create(year,month,day,hour,minute)}
${#calendars.create(year,month,day,hour,minute,second)}
${#calendars.create(year,month,day,hour,minute,second,millisecond)}

/*
 * 現在日時のカレンダーオブジェクト(java.util.Calendar)を作成します
 */
${#calendars.createNow()}

/*
 * 現在日のカレンダーのオブジェクト(java.util.Calendar)を作成します(時間は00:00に設定されます)
 */
${#calendars.createToday()}
```

<!--
### Numbers
-->
### 数値

<!--
 * **\#numbers** : utility methods for number objects:
-->
 * **\#numbers** : 数値オブジェクトに対するユーティリティメソッド群:

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Numbers
 * ======================================================================
 */

/*
 * ==========================
 * Formatting integer numbers
 * ==========================
 */

/* 
 * Set minimum integer digits.
 * Also works with arrays, lists or sets
 */
${#numbers.formatInteger(num,3)}
${#numbers.arrayFormatInteger(numArray,3)}
${#numbers.listFormatInteger(numList,3)}
${#numbers.setFormatInteger(numSet,3)}


/* 
 * Set minimum integer digits and thousands separator: 
 * 'POINT', 'COMMA', 'WHITESPACE', 'NONE' or 'DEFAULT' (by locale).
 * Also works with arrays, lists or sets
 */
${#numbers.formatInteger(num,3,'POINT')}
${#numbers.arrayFormatInteger(numArray,3,'POINT')}
${#numbers.listFormatInteger(numList,3,'POINT')}
${#numbers.setFormatInteger(numSet,3,'POINT')}


/*
 * ==========================
 * Formatting decimal numbers
 * ==========================
 */

/*
 * Set minimum integer digits and (exact) decimal digits.
 * Also works with arrays, lists or sets
 */
${#numbers.formatDecimal(num,3,2)}
${#numbers.arrayFormatDecimal(numArray,3,2)}
${#numbers.listFormatDecimal(numList,3,2)}
${#numbers.setFormatDecimal(numSet,3,2)}

/*
 * Set minimum integer digits and (exact) decimal digits, and also decimal separator.
 * Also works with arrays, lists or sets
 */
${#numbers.formatDecimal(num,3,2,'COMMA')}
${#numbers.arrayFormatDecimal(numArray,3,2,'COMMA')}
${#numbers.listFormatDecimal(numList,3,2,'COMMA')}
${#numbers.setFormatDecimal(numSet,3,2,'COMMA')}

/*
 * Set minimum integer digits and (exact) decimal digits, and also thousands and 
 * decimal separator.
 * Also works with arrays, lists or sets
 */
${#numbers.formatDecimal(num,3,'POINT',2,'COMMA')}
${#numbers.arrayFormatDecimal(numArray,3,'POINT',2,'COMMA')}
${#numbers.listFormatDecimal(numList,3,'POINT',2,'COMMA')}
${#numbers.setFormatDecimal(numSet,3,'POINT',2,'COMMA')}



/*
 * ==========================
 * Utility methods
 * ==========================
 */

/*
 * Create a sequence (array) of integer numbers going
 * from x to y
 */
${#numbers.sequence(from,to)}
${#numbers.sequence(from,to,step)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Numbers
 * ======================================================================
 */

/*
 * ==========================
 * 整数値のフォーマット
 * ==========================
 */

/* 
 * 整数の最小桁数を設定します。
 * 配列、リスト、セットにも対応しています
 */
${#numbers.formatInteger(num,3)}
${#numbers.arrayFormatInteger(numArray,3)}
${#numbers.listFormatInteger(numList,3)}
${#numbers.setFormatInteger(numSet,3)}


/* 
 * 整数の最小桁数と千の位の区切り文字を設定します:
 * 'POINT', 'COMMA', 'WHITESPACE', 'NONE' または 'DEFAULT' (ロケールに依存)。
 * 配列、リスト、セットにも対応しています
 */
${#numbers.formatInteger(num,3,'POINT')}
${#numbers.arrayFormatInteger(numArray,3,'POINT')}
${#numbers.listFormatInteger(numList,3,'POINT')}
${#numbers.setFormatInteger(numSet,3,'POINT')}


/*
 * ==========================
 * 小数値のフォーマット
 * ==========================
 */

/*
 * 整数の最小桁数と小数桁数を設定します。
 * 配列、リスト、セットにも対応しています
 */
${#numbers.formatDecimal(num,3,2)}
${#numbers.arrayFormatDecimal(numArray,3,2)}
${#numbers.listFormatDecimal(numList,3,2)}
${#numbers.setFormatDecimal(numSet,3,2)}

/*
 * 整数の最小桁数と小数桁数と小数点の文字を設定します。
 * 配列、リスト、セットにも対応しています
 */
${#numbers.formatDecimal(num,3,2,'COMMA')}
${#numbers.arrayFormatDecimal(numArray,3,2,'COMMA')}
${#numbers.listFormatDecimal(numList,3,2,'COMMA')}
${#numbers.setFormatDecimal(numSet,3,2,'COMMA')}

/*
 * 整数の最小桁数と小数桁数と小数点の文字と千の位の区切り文字を設定します。
 * 配列、リスト、セットにも対応しています
 */
${#numbers.formatDecimal(num,3,'POINT',2,'COMMA')}
${#numbers.arrayFormatDecimal(numArray,3,'POINT',2,'COMMA')}
${#numbers.listFormatDecimal(numList,3,'POINT',2,'COMMA')}
${#numbers.setFormatDecimal(numSet,3,'POINT',2,'COMMA')}



/*
 * ==========================
 * ユーティリティメソッド
 * ==========================
 */

/*
 * xからyまでの整数のシーケンス(配列)を作成します
 */
${#numbers.sequence(from,to)}
${#numbers.sequence(from,to,step)}
```

<!--
### Strings
-->
### 文字列

<!--
 * **\#strings** : utility methods for `String` objects:
-->
 * **\#strings** : `String` オブジェクトに対するユーティリティメソッド群:

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Strings
 * ======================================================================
 */

/*
 * Null-safe toString()
 */
${#strings.toString(obj)}                           // also array*, list* and set*

/*
 * Check whether a String is empty (or null). Performs a trim() operation before check
 * Also works with arrays, lists or sets
 */
${#strings.isEmpty(name)}
${#strings.arrayIsEmpty(nameArr)}
${#strings.listIsEmpty(nameList)}
${#strings.setIsEmpty(nameSet)}

/*
 * Perform an 'isEmpty()' check on a string and return it if false, defaulting to
 * another specified string if true.
 * Also works with arrays, lists or sets
 */
${#strings.defaultString(text,default)}
${#strings.arrayDefaultString(textArr,default)}
${#strings.listDefaultString(textList,default)}
${#strings.setDefaultString(textSet,default)}

/*
 * Check whether a fragment is contained in a String
 * Also works with arrays, lists or sets
 */
${#strings.contains(name,'ez')}                     // also array*, list* and set*
${#strings.containsIgnoreCase(name,'ez')}           // also array*, list* and set*

/*
 * Check whether a String starts or ends with a fragment
 * Also works with arrays, lists or sets
 */
${#strings.startsWith(name,'Don')}                  // also array*, list* and set*
${#strings.endsWith(name,endingFragment)}           // also array*, list* and set*

/*
 * Substring-related operations
 * Also works with arrays, lists or sets
 */
${#strings.indexOf(name,frag)}                      // also array*, list* and set*
${#strings.substring(name,3,5)}                     // also array*, list* and set*
${#strings.substringAfter(name,prefix)}             // also array*, list* and set*
${#strings.substringBefore(name,suffix)}            // also array*, list* and set*
${#strings.replace(name,'las','ler')}               // also array*, list* and set*

/*
 * Append and prepend
 * Also works with arrays, lists or sets
 */
${#strings.prepend(str,prefix)}                     // also array*, list* and set*
${#strings.append(str,suffix)}                      // also array*, list* and set*

/*
 * Change case
 * Also works with arrays, lists or sets
 */
${#strings.toUpperCase(name)}                       // also array*, list* and set*
${#strings.toLowerCase(name)}                       // also array*, list* and set*

/*
 * Split and join
 */
${#strings.arrayJoin(namesArray,',')}
${#strings.listJoin(namesList,',')}
${#strings.setJoin(namesSet,',')}
${#strings.arraySplit(namesStr,',')}                // returns String[]
${#strings.listSplit(namesStr,',')}                 // returns List<String>
${#strings.setSplit(namesStr,',')}                  // returns Set<String>

/*
 * Trim
 * Also works with arrays, lists or sets
 */
${#strings.trim(str)}                               // also array*, list* and set*

/*
 * Compute length
 * Also works with arrays, lists or sets
 */
${#strings.length(str)}                             // also array*, list* and set*

/*
 * Abbreviate text making it have a maximum size of n. If text is bigger, it
 * will be clipped and finished in "..."
 * Also works with arrays, lists or sets
 */
${#strings.abbreviate(str,10)}                      // also array*, list* and set*

/*
 * Convert the first character to upper-case (and vice-versa)
 */
${#strings.capitalize(str)}                         // also array*, list* and set*
${#strings.unCapitalize(str)}                       // also array*, list* and set*

/*
 * Convert the first character of every word to upper-case
 */
${#strings.capitalizeWords(str)}                    // also array*, list* and set*
${#strings.capitalizeWords(str,delimiters)}         // also array*, list* and set*

/*
 * Escape the string
 */
${#strings.escapeXml(str)}                          // also array*, list* and set*
${#strings.escapeJava(str)}                         // also array*, list* and set*
${#strings.escapeJavaScript(str)}                   // also array*, list* and set*
${#strings.unescapeJava(str)}                       // also array*, list* and set*
${#strings.unescapeJavaScript(str)}                 // also array*, list* and set*

/*
 * Null-safe comparison and concatenation
 */
${#strings.equals(first, second)}
${#strings.equalsIgnoreCase(first, second)}
${#strings.concat(values...)}
${#strings.concatReplaceNulls(nullValue, values...)}

/*
 * Random
 */
${#strings.randomAlphanumeric(count)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Strings
 * ======================================================================
 */

/*
 * Null安全な toString()
 */
${#strings.toString(obj)}                           // array*, list* and set* にも対応しています

/*
 * 文字列が空(またはnull)かどうかをチェックします。チェック前に trim() 処理をします。
 * 配列、リスト、セットにも対応しています
 */
${#strings.isEmpty(name)}
${#strings.arrayIsEmpty(nameArr)}
${#strings.listIsEmpty(nameList)}
${#strings.setIsEmpty(nameSet)}

/*
 * 'isEmpty()' を実行して false の場合はその文字列を返し、true の場合は指定されたデフォルト文字列を返します
 * 配列、リスト、セットにも対応しています
 */
${#strings.defaultString(text,default)}
${#strings.arrayDefaultString(textArr,default)}
${#strings.listDefaultString(textList,default)}
${#strings.setDefaultString(textSet,default)}

/*
 * 文字列にフラグメントが含まれているかどうかをチェックします
 * 配列、リスト、セットにも対応しています
 */
${#strings.contains(name,'ez')}                     // also array*, list* and set*
${#strings.containsIgnoreCase(name,'ez')}           // also array*, list* and set*

/*
 * 文字列が指定されたフラグメントで始まっているかどうかまたは終わっているかどうかをチェックします
 * 配列、リスト、セットにも対応しています
 */
${#strings.startsWith(name,'Don')}                  // also array*, list* and set*
${#strings.endsWith(name,endingFragment)}           // also array*, list* and set*

/*
 * 部分文字列関係
 * 配列、リスト、セットにも対応しています
 */
${#strings.indexOf(name,frag)}                      // also array*, list* and set*
${#strings.substring(name,3,5)}                     // also array*, list* and set*
${#strings.substringAfter(name,prefix)}             // also array*, list* and set*
${#strings.substringBefore(name,suffix)}            // also array*, list* and set*
${#strings.replace(name,'las','ler')}               // also array*, list* and set*

/*
 * Append と prepend
 * 配列、リスト、セットにも対応しています
 */
${#strings.prepend(str,prefix)}                     // also array*, list* and set*
${#strings.append(str,suffix)}                      // also array*, list* and set*

/*
 * 大文字小文字変換
 * 配列、リスト、セットにも対応しています
 */
${#strings.toUpperCase(name)}                       // also array*, list* and set*
${#strings.toLowerCase(name)}                       // also array*, list* and set*

/*
 * Split と join
 */
${#strings.arrayJoin(namesArray,',')}
${#strings.listJoin(namesList,',')}
${#strings.setJoin(namesSet,',')}
${#strings.arraySplit(namesStr,',')}                // returns String[]
${#strings.listSplit(namesStr,',')}                 // returns List<String>
${#strings.setSplit(namesStr,',')}                  // returns Set<String>

/*
 * Trim
 * 配列、リスト、セットにも対応しています
 */
${#strings.trim(str)}                               // also array*, list* and set*

/*
 * 長さの計算
 * 配列、リスト、セットにも対応しています
 */
${#strings.length(str)}                             // also array*, list* and set*

/*
 * 与えられたテキストが最大サイズnになるよう省略処理をします。
 * もしテキストがそれよりも大きい場合は、切り取られて最後に "..." がつきます。
 * 配列、リスト、セットにも対応しています
 */
${#strings.abbreviate(str,10)}                      // also array*, list* and set*

/*
 * 最初の文字を大文字に変換(とその逆)
 */
${#strings.capitalize(str)}                         // also array*, list* and set*
${#strings.unCapitalize(str)}                       // also array*, list* and set*

/*
 * 単語の最初の文字を大文字に変換
 */
${#strings.capitalizeWords(str)}                    // also array*, list* and set*
${#strings.capitalizeWords(str,delimiters)}         // also array*, list* and set*

/*
 * 文字列のエスケープ
 */
${#strings.escapeXml(str)}                          // also array*, list* and set*
${#strings.escapeJava(str)}                         // also array*, list* and set*
${#strings.escapeJavaScript(str)}                   // also array*, list* and set*
${#strings.unescapeJava(str)}                       // also array*, list* and set*
${#strings.unescapeJavaScript(str)}                 // also array*, list* and set*

/*
 * Null安全な比較と連結
 */
${#strings.equals(first, second)}
${#strings.equalsIgnoreCase(first, second)}
${#strings.concat(values...)}
${#strings.concatReplaceNulls(nullValue, values...)}

/*
 * Random
 */
${#strings.randomAlphanumeric(count)}
```

<!--
### Objects
-->
### オブジェクト

<!--
 * **\#objects** : utility methods for objects in general
-->
 * **\#objects** : 一般的なオブジェクトに対するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Objects
 * ======================================================================
 */

/*
 * Return obj if it is not null, and default otherwise
 * Also works with arrays, lists or sets
 */
${#objects.nullSafe(obj,default)}
${#objects.arrayNullSafe(objArray,default)}
${#objects.listNullSafe(objList,default)}
${#objects.setNullSafe(objSet,default)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Objects
 * ======================================================================
 */

/*
 * null でなければ obj を、null の場合は指定されたデフォルト値を返します
 * 配列、リスト、セットにも対応しています
 */
${#objects.nullSafe(obj,default)}
${#objects.arrayNullSafe(objArray,default)}
${#objects.listNullSafe(objList,default)}
${#objects.setNullSafe(objSet,default)}
```

<!--
### Booleans
-->
### 真偽値

<!--
 * **\#bools** : utility methods for boolean evaluation
-->
 * **\#bools** : 真偽値評価に対するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Bools
 * ======================================================================
 */

/*
 * Evaluate a condition in the same way that it would be evaluated in a th:if tag
 * (see conditional evaluation chapter afterwards).
 * Also works with arrays, lists or sets
 */
${#bools.isTrue(obj)}
${#bools.arrayIsTrue(objArray)}
${#bools.listIsTrue(objList)}
${#bools.setIsTrue(objSet)}

/*
 * Evaluate with negation
 * Also works with arrays, lists or sets
 */
${#bools.isFalse(cond)}
${#bools.arrayIsFalse(condArray)}
${#bools.listIsFalse(condList)}
${#bools.setIsFalse(condSet)}

/*
 * Evaluate and apply AND operator
 * Receive an array, a list or a set as parameter
 */
${#bools.arrayAnd(condArray)}
${#bools.listAnd(condList)}
${#bools.setAnd(condSet)}

/*
 * Evaluate and apply OR operator
 * Receive an array, a list or a set as parameter
 */
${#bools.arrayOr(condArray)}
${#bools.listOr(condList)}
${#bools.setOr(condSet)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Bools
 * ======================================================================
 */

/*
 * th:if タグと同じように条件を評価します(条件の評価の章を後で参照してください)。
 * 配列、リスト、セットにも対応しています
 */
${#bools.isTrue(obj)}
${#bools.arrayIsTrue(objArray)}
${#bools.listIsTrue(objList)}
${#bools.setIsTrue(objSet)}

/*
 * 否定の評価
 * 配列、リスト、セットにも対応しています
 */
${#bools.isFalse(cond)}
${#bools.arrayIsFalse(condArray)}
${#bools.listIsFalse(condList)}
${#bools.setIsFalse(condSet)}

/*
 * 評価してAND演算子を適用
 * 配列、リスト、セットをパラメータとして受け取ります
 */
${#bools.arrayAnd(condArray)}
${#bools.listAnd(condList)}
${#bools.setAnd(condSet)}

/*
 * 評価してOR演算子を適用
 * 配列、リスト、セットをパラメータとして受け取ります
 */
${#bools.arrayOr(condArray)}
${#bools.listOr(condList)}
${#bools.setOr(condSet)}
```

<!--
### Arrays
-->
### 配列

<!--
 * **\#arrays** : utility methods for arrays
-->
 * **\#arrays** : 配列に対するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Arrays
 * ======================================================================
 */

/*
 * Converts to array, trying to infer array component class.
 * Note that if resulting array is empty, or if the elements
 * of the target object are not all of the same class,
 * this method will return Object[].
 */
${#arrays.toArray(object)}

/*
 * Convert to arrays of the specified component class.
 */
${#arrays.toStringArray(object)}
${#arrays.toIntegerArray(object)}
${#arrays.toLongArray(object)}
${#arrays.toDoubleArray(object)}
${#arrays.toFloatArray(object)}
${#arrays.toBooleanArray(object)}

/*
 * Compute length
 */
${#arrays.length(array)}

/*
 * Check whether array is empty
 */
${#arrays.isEmpty(array)}

/*
 * Check if element or elements are contained in array
 */
${#arrays.contains(array, element)}
${#arrays.containsAll(array, elements)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Arrays
 * ======================================================================
 */

/*
 * コンポーネントクラスを推測して配列に変換します。
 * 結果の配列が空もしくは、対象オブジェクトに複数のクラスが含まれる場合 Object[] を変えします。
 */
${#arrays.toArray(object)}

/*
 * コンポーネントクラスを指定して配列に変換
 */
${#arrays.toStringArray(object)}
${#arrays.toIntegerArray(object)}
${#arrays.toLongArray(object)}
${#arrays.toDoubleArray(object)}
${#arrays.toFloatArray(object)}
${#arrays.toBooleanArray(object)}

/*
 * 長さを計算
 */
${#arrays.length(array)}

/*
 * 配列が空かどうかをチェック
 */
${#arrays.isEmpty(array)}

/*
 * 1つまたは複数の要素が配列に含まれているかどうかをチェック
 */
${#arrays.contains(array, element)}
${#arrays.containsAll(array, elements)}
```

<!--
### Lists
-->
### リスト

<!--
 * **\#lists** : utility methods for lists
-->
 * **\#lists** : リストに対するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Lists
 * ======================================================================
 */

/*
 * Converts to list
 */
${#lists.toList(object)}

/*
 * Compute size
 */
${#lists.size(list)}

/*
 * Check whether list is empty
 */
${#lists.isEmpty(list)}

/*
 * Check if element or elements are contained in list
 */
${#lists.contains(list, element)}
${#lists.containsAll(list, elements)}

/*
 * Sort a copy of the given list. The members of the list must implement
 * comparable or you must define a comparator.
 */
${#lists.sort(list)}
${#lists.sort(list, comparator)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Lists
 * ======================================================================
 */

/*
 * リストに変換
 */
${#lists.toList(object)}

/*
 * サイズを計算
 */
${#lists.size(list)}

/*
 * リストが空かどうかをチェック
 */
${#lists.isEmpty(list)}

/*
 * 1つまたは複数の要素がリストに含まれているかどうかをチェック
 */
${#lists.contains(list, element)}
${#lists.containsAll(list, elements)}

/*
 * 与えられたリストのコピーをソート。リストのメンバーが comparable を実装しているか
 * または comparator が指定されている必要があります。
 */
${#lists.sort(list)}
${#lists.sort(list, comparator)}
```

<!--
### Sets
-->
### セット

<!--
 * **\#sets** : utility methods for sets
-->
 * **\#sets** : セットに対するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Sets
 * ======================================================================
 */

/*
 * Converts to set
 */
${#sets.toSet(object)}

/*
 * Compute size
 */
${#sets.size(set)}

/*
 * Check whether set is empty
 */
${#sets.isEmpty(set)}

/*
 * Check if element or elements are contained in set
 */
${#sets.contains(set, element)}
${#sets.containsAll(set, elements)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Sets
 * ======================================================================
 */

/*
 * セットに変換
 */
${#sets.toSet(object)}

/*
 * サイズを計算
 */
${#sets.size(set)}

/*
 * セットが空かどうかをチェック
 */
${#sets.isEmpty(set)}

/*
 * 1つまたは複数の要素がセットに含まれているかどうかをチェック
 */
${#sets.contains(set, element)}
${#sets.containsAll(set, elements)}
```

<!--
### Maps
-->
### マップ

<!--
 * **\#maps** : utility methods for maps
-->
 * **\#maps** : マップに対するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Maps
 * ======================================================================
 */

/*
 * Compute size
 */
${#maps.size(map)}

/*
 * Check whether map is empty
 */
${#maps.isEmpty(map)}

/*
 * Check if key/s or value/s are contained in maps
 */
${#maps.containsKey(map, key)}
${#maps.containsAllKeys(map, keys)}
${#maps.containsValue(map, value)}
${#maps.containsAllValues(map, value)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Maps
 * ======================================================================
 */

/*
 * サイズを計算
 */
${#maps.size(map)}

/*
 * マップが空かどうかをチェック
 */
${#maps.isEmpty(map)}

/*
 * キーや値がマップに含まれているかどうかをチェック
 */
${#maps.containsKey(map, key)}
${#maps.containsAllKeys(map, keys)}
${#maps.containsValue(map, value)}
${#maps.containsAllValues(map, value)}
```

<!--
### Aggregates
-->
### 集約

<!--
 * **\#aggregates** : utility methods for creating aggregates on arrays or
   collections
-->
 * **\#aggregates** : 配列やコレクションに対する集約を生成するユーティリティメソッド群

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Aggregates
 * ======================================================================
 */

/*
 * Compute sum. Returns null if array or collection is empty
 */
${#aggregates.sum(array)}
${#aggregates.sum(collection)}

/*
 * Compute average. Returns null if array or collection is empty
 */
${#aggregates.avg(array)}
${#aggregates.avg(collection)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Aggregates
 * ======================================================================
 */

/*
 * 合計値を計算。配列またはコレクションが空の場合は null を返します
 */
${#aggregates.sum(array)}
${#aggregates.sum(collection)}

/*
 * 平均を計算。配列またはコレクションが空の場合は null を返します
 */
${#aggregates.avg(array)}
${#aggregates.avg(collection)}
```


<!--
### Messages
-->
### メッセージ

<!--
 * **\#messages** : utility methods for obtaining externalized messages inside
   variables expressions, in the same way as they would be obtained using `#{...}`
   syntax.
-->
 * **\#messages** : 変数式の中で外部化メッセージを取得するためのユーティリティメソッド群。 `#{...}` 構文を使用して取得するのと同じです。

<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Messages
 * ======================================================================
 */

/*
 * Obtain externalized messages. Can receive a single key, a key plus arguments,
 * or an array/list/set of keys (in which case it will return an array/list/set of 
 * externalized messages).
 * If a message is not found, a default message (like '??msgKey??') is returned.
 */
${#messages.msg('msgKey')}
${#messages.msg('msgKey', param1)}
${#messages.msg('msgKey', param1, param2)}
${#messages.msg('msgKey', param1, param2, param3)}
${#messages.msgWithParams('msgKey', new Object[] {param1, param2, param3, param4})}
${#messages.arrayMsg(messageKeyArray)}
${#messages.listMsg(messageKeyList)}
${#messages.setMsg(messageKeySet)}

/*
 * Obtain externalized messages or null. Null is returned instead of a default
 * message if a message for the specified key is not found.
 */
${#messages.msgOrNull('msgKey')}
${#messages.msgOrNull('msgKey', param1)}
${#messages.msgOrNull('msgKey', param1, param2)}
${#messages.msgOrNull('msgKey', param1, param2, param3)}
${#messages.msgOrNullWithParams('msgKey', new Object[] {param1, param2, param3, param4})}
${#messages.arrayMsgOrNull(messageKeyArray)}
${#messages.listMsgOrNull(messageKeyList)}
${#messages.setMsgOrNull(messageKeySet)}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Messages
 * ======================================================================
 */

/*
 * 外部化メッセージを取得します。単一のキー、単一のキーと引数、
 * キーの配列/リスト/セット(この場合は外部化メッセージの配列/リスト/セットを返します)を渡すことができます。
 * メッセージが見つからない場合は、デフォルトメッセージ( '??msgKey??' など)を返します。
 */
${#messages.msg('msgKey')}
${#messages.msg('msgKey', param1)}
${#messages.msg('msgKey', param1, param2)}
${#messages.msg('msgKey', param1, param2, param3)}
${#messages.msgWithParams('msgKey', new Object[] {param1, param2, param3, param4})}
${#messages.arrayMsg(messageKeyArray)}
${#messages.listMsg(messageKeyList)}
${#messages.setMsg(messageKeySet)}

/*
 * 外部化メッセージまたは null を取得します。指定されたキーに対するメッセージが見つからない場合に
 * デフォルトメッセージの代わりに null を返します。
 */
${#messages.msgOrNull('msgKey')}
${#messages.msgOrNull('msgKey', param1)}
${#messages.msgOrNull('msgKey', param1, param2)}
${#messages.msgOrNull('msgKey', param1, param2, param3)}
${#messages.msgOrNullWithParams('msgKey', new Object[] {param1, param2, param3, param4})}
${#messages.arrayMsgOrNull(messageKeyArray)}
${#messages.listMsgOrNull(messageKeyList)}
${#messages.setMsgOrNull(messageKeySet)}
```


<!--
### IDs
-->
### ID

<!--
 * **\#ids** : utility methods for dealing with `id` attributes that might be
   repeated (for example, as a result of an iteration).
-->
 * **\#ids** : (繰り返し処理の中などで)繰り返し登場する `id` 属性を扱うためのユーティリティメソッド群


<!--
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Ids
 * ======================================================================
 */

/*
 * Normally used in th:id attributes, for appending a counter to the id attribute value
 * so that it remains unique even when involved in an iteration process.
 */
${#ids.seq('someId')}

/*
 * Normally used in th:for attributes in <label> tags, so that these labels can refer to Ids
 * generated by means if the #ids.seq(...) function.
 *
 * Depending on whether the <label> goes before or after the element with the #ids.seq(...)
 * function, the "next" (label goes before "seq") or the "prev" function (label goes after 
 * "seq") function should be called.
 */
${#ids.next('someId')}
${#ids.prev('someId')}
```
-->
```java
/*
 * ======================================================================
 * See javadoc API for class org.thymeleaf.expression.Ids
 * ======================================================================
 */

/*
 * 通常は th:id 属性に使用されます。
 * id属性値にカウンターの値を加えるので、繰り返し処理の中でもユニークな値を持つことができます。
 */
${#ids.seq('someId')}

/*
 * 通常は <label> タグの中の th:for 属性に使用されます。
 * #ids.seq(...) 関数で生成されたidをラベルから参照することができます。
 *
 * <label> が #ids.seq(...) 関数を持った要素の前にあるか後ろにあるかによって、
 * "next" (ラベルが"seq"の前の場合) または "prev" (ラベルが"seq"の後の場合) 関数を呼び出します。
 */
${#ids.next('someId')}
${#ids.prev('someId')}
```


19 Appendix C: DOM Selector syntax
==================================

<!--
DOM Selectors borrow syntax features from XPATH, CSS and jQuery, in order to provide a powerful and easy to use way to specify template fragments.
-->
DOMセレクターはXPATHやCSSやjQueryの構文を参考にして、テンプレートフラグメントを特定するための簡単かつパワフルな方法を提供しています。

<!--
For example, the following selector will select every `<div>` with the class `content`, in every position inside the markup:
-->
例えば、次のセレクターはマークアップの中で `content` クラスを持った `<div>` を全て取得します:

```html
<div th:include="mytemplate :: [//div[@class='content']]">...</div>
```

<!--
The basic syntax inspired from XPath includes:

 * `/x` means direct children of the current node with name x.

 * `//x` means children of the current node with name x, at any depth.

 * `x[@z="v"]` means elements with name x and an attribute called z with value "v".

 * `x[@z1="v1" and @z2="v2"]` means elements with name x and attributes z1 and z2 with values "v1" and "v2", respectively.

 * `x[i]` means element with name x positioned in number i among its siblings.

 * `x[@z="v"][i]` means elements with name x, attribute z with value "v" and positioned in number i among its siblings that also match this condition.
-->
XPathを参考にした基本構文には次のようなものがあります:

 * `/x` 現在のノードの直接の子の中でxという名前を持つノード。

 * `//x` 現在のノードの子孫の中でxという名前を持つノード。

 * `x[@z="v"]` xという名前の要素で、z属性の値が"v"のもの。

 * `x[@z1="v1" and @z2="v2"]` xという名前の要素で、z1,z2属性の値がそれぞれ"v1","v2"のもの。

 * `x[i]` xという名前の要素の兄弟の中でi番目のもの。

 * `x[@z="v"][i]` xという名前の要素で、z属性の値が"v"の兄弟の中でi番目のもの。


<!--
But more concise syntax can also be used:

 * `x` is exactly equivalent to `//x` (search an element with name or reference `x` at any depth level).

 * Selectors are also allowed without element name/reference, as long as they include a specification of arguments. So `[@class='oneclass']` is a valid selector that looks for any elements (tags) with a class attribute with value "oneclass".
-->
ですが、もっと簡潔な構文もあります:

 * `x` は `//x` と全く同じ意味です(深さに関係なく `x` という名前または参照を持つ要素を探します)。

 * 引数を持つ場合は要素名や参照を指定しなくても大丈夫です。ですので `[@class='oneclass']` は、class属性の値が"oneclass"の要素(タグ)を探す、という意味の有効なセレクターになります。

<!--
Advanced attribute selection features:

 * Besides `=` (equal), other comparison operators are also valid: `!=` (not equal), `^=` (starts with) and `$=` (ends with). For example: `x[@class^='section']` means elements with name `x` and a value for attribute `class` that starts with `section`.

 * Attributes can be specified both starting with `@` (XPath-style) and without (jQuery-style). So `x[z='v']` is equivalent to `x[@z='v']`.
 
 * Multiple-attribute modifiers can be joined both with `and` (XPath-style) and also by chaining multiple modifiers (jQuery-style). So `x[@z1='v1' and @z2='v2']` is actually equivalent to `x[@z1='v1'][@z2='v2']` (and also to `x[z1='v1'][z2='v2']`).
-->
高度な属性選択機能:

 * `=` (equal)の他にも比較演算子が使用できます: `!=` (not equal), `^=` (starts with) と `$=` (ends with)。例: `x[@class^='section']` は `x` という名前の要素で `class` 属性の値が `section` で始まっているものを指します。

 * 属性の指定は `@` で始まっていても(XPath-style) 、始まっていなくても(jQuery-style)大丈夫です。ですので、 `x[z='v']` は `x[@z='v']` と同じ意味になります。
 
 * 複数属性を指定する場合は `and` でつないでも(XPath-style)、複数の修飾子をつないでも(jQuery-style)大丈夫です。ですので、 `x[@z1='v1' and @z2='v2']` と `x[@z1='v1'][@z2='v2']` は同じ意味になります(`x[z1='v1'][z2='v2']` もです)。

<!--
Direct _jQuery-like_ selectors:

 * `x.oneclass` is equivalent to `x[class='oneclass']`.

 * `.oneclass` is equivalent to `[class='oneclass']`.

 * `x#oneid` is equivalent to `x[id='oneid']`.

 * `#oneid` is equivalent to `[id='oneid']`.

 * `x%oneref` means nodes -not just elements- with name x that match reference _oneref_ according to a specified `DOMSelector.INodeReferenceChecker` implementation.

 * `%oneref` means nodes -not just elements- with any name that match reference _oneref_ according to a specified `DOMSelector.INodeReferenceChecker` implementation. Note this is actually equivalent to simply `oneref` because references can be used instead of element names.

 * Direct selectors and attribute selectors can be mixed: `a.external[@href^='https']`.
-->
「jQueryのような」ダイレクトセレクター:

 * `x.oneclass` は `x[class='oneclass']` と同等です。

 * `.oneclass` は `[class='oneclass']` と同等です。

 * `x#oneid` は `x[id='oneid']` と同等です。

 * `#oneid` は `[id='oneid']` と同等です。

 * `x%oneref` は、xという名前を持った -要素だけではなく- ノードの中で、指定された `DOMSelector.INodeReferenceChecker` 実装に従って _oneref_ という参照に一致するもの指します。

 * `%oneref` は、名前に関係なく -要素だけではなく- ノードの中で、指定された `DOMSelector.INodeReferenceChecker` 実装に従って _oneref_ という参照に一致するもの指します。参照は要素名の代わりに使用されるので、実際は単に `oneref` と同等であることに注意してください。

 * ダイレクトセレクターと属性セレクターは混ぜることができます: `a.external[@href^='https']`.

<!--
The above DOM Selector expression:
-->
上記のDOMセレクター式は:

```html
<div th:include="mytemplate :: [//div[@class='content']]">...</div>
```
<!--
could be written as:
-->
このように書くことができます:

```html
<div th:include="mytemplate :: [div.content]">...</div>
```

<!--
###Multivalued class matching
-->
###複数の値を持つclassのマッチング

<!--
DOM Selectors understand the class attribute to be **multivalued**, and therefore allow the application of selectors on this attribute even if the element has several class values.
-->
DOMセレクターは **複数の値を持った** class属性に対応しているので、要素がいくつかのclass値を持っている場合でも、セレクターを適用することができます。

<!--
For example, `div[class='two']` will match `<div class="one two three" />`
-->
例えば、 `div[class='two']` は `<div class="one two three" />` にマッチします。

<!--
###Optional brackets
-->
###任意の括弧

<!--
The syntax of the fragment inclusion attributes converts every fragment selection into a DOM selection, so brackets `[...]` are not needed (though allowed).
-->
フラグメントインクルード属性の構文は全てのフラグメント選択をDOM選択に変換するので、括弧 `[...]` はなくても大丈夫です(あってもいいですが)。

<!--
So the following, with no brackets, is equivalent to the bracketed selector seen above:
-->
なので、次のように括弧を付けなくても、上記の括弧をつけたものと同等になります:

```html
<div th:include="mytemplate :: div.content">...</div>
```

<!--
So, summarizing, this:
-->
ですので、まとめると:

```html
<div th:replace="mytemplate :: myfrag">...</div>
```

<!--
Will look for a `th:fragment="myfrag"` fragment signature. But would also look for tags with name `myfrag` if they existed (which they don't, in HTML). Note the difference with:
-->
これは `th:fragment="myfrag"` フラグメントシグネチャを探します。しかし、(HTMLには存在しませんが)もし存在するならば `myfrag` という名前のタグも探します。次の違いに気をつけてください:

```html
<div th:replace="mytemplate :: .myfrag">...</div>
```

<!--
which will actually look for any elements with `class="myfrag"`, without caring about `th:fragment` signatures. 
-->
この場合は実際 `class="myfrag"` の要素を探しますが、 `th:fragment` シグネチャについては気にしません。


