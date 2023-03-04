---
title: "Thymeleaf 3.1: What's new and how to migrate (ja)"
---

Latest version is Thymeleaf `3.1.1.RELEASE`.

## What's new

### サーブレットAPI 5.0と`jakarta.*`ネームスペースのサポート

Thymeleaf 3.1では、以前のバージョンでの`javax.*`クラスのサポートを削除すること無く、サーブレットAPI 5.0以降における`jakarta.*`クラスネームスペースのサポートを追加しました。

### Spring 6.0のサポート

Thymeleaf 3.1は、Spring Framework 6.0と連携する新しい`thymeleaf-spring6`コアライブラリを追加しました。

Spring 5.0よりも前のバージョンのサポートは削除されました。

### Spring Security 6.0のサポート
 
Thymeleaf 3.1は、Spring Security 6.0と連携する新しい`thymeleaf-extras-springsecurity6`コアライブラリを追加しました。

Spring Security 5.0よりも前のバージョンのサポートは削除されました。

### `java.time`パッケージのコアサポート

`thymeleaf-extras-java8time`追加モジュールはThymeleafコアに統合されました：`#temporals`式ユーティリティーオブジェクトは常に利用可能です。

### Java互換性

必要な最低バージョンはJDK 8です。

`thymeleaf-spring6`および`thymeleaf-extras-springsecurity6`コアライブラリに必要な最低バージョンはJDK 17です。

### Web APIベース式ユーティリティオブジェクトの削除

`#request`・`#response`・`#session`・`#servletContext`はThymeleaf 3.1の式では利用できません。

### 式で利用できるクラスの制限強化

Thymeleaf 3.1ではコアパッケージのクラスの利用を制限しています：`java.*`・`javax.*`・`jakarta.*`・`jdk.*`・`org.ietf.jgss.*`・`org.omg.*`・`org.w3c.dom.*`・`org.xml.sax.*`・`com.sun.*`・`sun.*`

これらのパッケージのクラスへのメソッド/コンストラクタ呼び出しおよび静的参照は禁止されます。

この制限の例外としては、これらのパッケージのクラスは常に*許可*されます：

* 基本的な`java.lang.*`・`java.math.*`クラス：`java.lang.Boolean`・`java.lang.Byte`・`java.lang.Character`・`java.lang.Double`・`java.lang.Enum`・`java.lang.Float`・`java.lang.Integer`・`java.lang.Long`・`java.lang.Math`・`java.lang.Number`・`java.lang.Short`・`java.lang.String`・`java.math.BigDecimal`・`java.math.BigInteger`・`java.math.RoundingMode`。

* コレクションクラスおよびインターフェース：`java.util.Collection`・`java.util.Enumeration`・`java.util.Iterable`・`java.util.Iterator`・`java.util.List`・`java.util.ArrayList`・`java.util.LinkedList`・`java.util.Set`・`java.util.HashSet`・`java.util.LinkedHashSet`・`java.util.Map`・`java.util.Map.Entry`・`java.util.HashMap`・`java.util.LinkedHashMap`。注: インターフェースメソッド（例：`Map#get(key)`）はどの実装でも許可されます。しかし、ここにある特定の実装もインスタンス化および静的参照が可能です。

* その他`java.util.*`内の一般的に使われるクラス：`java.util.Properties`・`java.util.Optional`・`java.util.stream.Stream`・`java.util.Locale`・`java.util.Date`・`java.util.Calendar`。

### いくつかの非推奨化と以前に非推奨化されたものの削除

いくつかのものがThymeleaf 3.1で非推奨化されました。

* `th:insert`により`th:include`が非推奨化されました。`th:insert`は`th:include`と文法が少し違うことに注意してください。
* フラグメント挿入のアンラップ構文が非推奨化されました：単に`template :: fragment`を使う代わりに、今後は`~{template :: fragment}`が利用されるべきです。

そして、以前3.0で非推奨化されたものが削除されました：

* 以前`th:replace`により非推奨化されていた`th:substituteby`が削除されました。
* 非推奨だったコンテキスト変数（`${execInfo}`）としての`execInfo`の利用が削除されました。3.0から式ユーティリティオブジェクトが利用可能です（`${#execInfo}`）。

### その他の細かい改善

* 依存性のバージョンをアップデートしました。
* `#temporals`式ユーティリティオブジェクトでデフォルトでないロケールでのフォーマットが可能になりました。
* Java Stream（`java.util.stream.Stream`）の直接繰り返し（例：`th:each`）がサポートされました。
* `SpringTemplateEngine`インスタンスに自作メッセージリゾルバー（Springのものでなくても）を設定できるようになりました。

### （開発者向け）プロジェクトソースリポジトリ構造の抜本的見直し

Thymeleaf 3.1は（以前は複数だった）ソースリポジトリの抜本的見直しと、開発観点からのサンプルアプリケーションの処理方法の大幅な改善を含みます：

* 以前のThymeleafコードリポジトリのほとんどを[`thymeleaf`GitHubリポジトリ](https://github.com/thymeleaf/thymeleaf)へ統合。以下のものを含みます：
  * すべてのThymeleaf依存性とビルド設定を統合・統一する新しいThymeleaf BOM（`thymeleaf-parent`）。
  * SpringおよびSpring Security連携を含む、すべてのThymeleafコアライブラリ。
  * すべてのThymeleafテスティングライブラリとそれらの統合。
  * すべてのThymeleafテストリポジトリ。
  * すべてのThymeleaf公式サンプルアプリケーション（コア・Spring・Spring Security・Spring Bootベースのサンプルアプリ）。
* Thymeleafモジュールの完全なツリーを作るための大規模Mavenマルチプロジェクト設定の作成。
* Mavenコマンドラインで非Spring BootベースWebアプリを実行できるように、サンプルアプリケーションを設定。
* より多くの`.zip`形式での完全な配布パッケージの作成。現在はコアライブラリだけでなくサンプルアプリケーションのバイナリおよび（ビルド可能な）ソースを含む。
* 全テストインフラストラクチャをJUnit 5に移行。


## Thymeleaf 3.1への移行

### JDKのバージョン

Thymeleaf 3.1は最低互換レベルをJDK 8に移行しました。しかしSpring 6.0が必要とするバージョンであるため、`thymeleaf-spring6`と`thymeleaf-extras-springsecurity6`にはJDK 17が必要です。


### Web関連の構造

*（注：SpringベースのWebアプリケーションでは、ここで説明されていることは開発者には隠蔽されているため、アプリには影響しません。Springユーザーは安全にこの節をスキップできます。）*

Thymeleaf 3.1では、利用されるWeb API（例：`javax.*`または`jakarta.*`）を抽象化する4つのインターフェースが導入されました。

* `org.thymeleaf.web.IWebApplication`：Webアプリケーションとそれに関連する属性を表す。
* `org.thymeleaf.web.IWebExchange`：Webリクエストのハンドリングを表す。リクエスト・（もしあれば）セッションおよびアプリケーションによって特定の通信と関連付けられた属性を含む。
* `org.thymeleaf.web.IWebRequest`：Webリクエストを表す：URLパス、パラメーター、ヘッダー、Cookie。
* `org.thymeleaf.web.IWebSession`：存在すればWebセッションを表す。関連付けられたすべての属性を含む。

`IWebApplication`が多かれ少なかれサーブレットAPIの`ServletContext`に対応するとしても、上記のものとサーブレットAPIのその他の構造は完全には一致しないかもしれません。例えば、サーブレットAPIの`HttpServletRequest`によるデータの一部（例えばURLとパラメーター）は`IWebRequest`オブジェクトに含まれるかもしれない一方、他の部分（例えばリクエスト属性）は`IWebExchange`に含まれるかもしれません。

Thymeleafは、これらのインターフェースの`javax.*`および`jakarta.*`環境の両方の実装を提供します。

典型的には、Webアプリケーションは初期化時に`IWebApplication`の特定の実装をこのようにインスタンス化します：

```java
final JakartaServletWebApplication application =
    JakartaServletWebApplication.buildApplication(servletContext);
```

各リクエストでは、この特定のアプリケーション実装は、そのようなリクエストのハンドリングをモデリングする`IWebExchange`オブジェクトを作る方法を提供します。典型的には `buildExchange(...)`メソッドです：

```java
final HttpServletRequest request = ...;
final HttpServletResponse response = ...;
...
final IWebExchange webExchange = this.application.buildExchange(request, response);
final IWebRequest webRequest = webExchange.getRequest();
...
final String path = webRequest.getPathWithinApplication();
```

これらのインタフェースはリソースの読み込み・データの保存や読み取り・URLの変換などのためのメソッドを提供します。Webアプリケーションで必要とされる最も一般的な情報のすべてです。併せて、これらのインタフェースの特定の実装は、それらが内部で利用している特定Web APIのネイティブオブジェクトを取得する方法を提供します（例：`IWebExchange`オブジェクトから内部の`HttpServletRequest`を取得する）。

更に、あなたのアプリケーションは特定のWeb APIのクラス（例：`jakarta.*`クラス）を利用し続けることも可能ということを覚えておいてください。Thymeleaf APIと直接やり取りをする際のみこれらの抽象化の利用が必要です。


### Spring 6.0とSpring Security 6.0（そしてSpring Boot 3.0）

Thymeleafの新しいSpring 6.0およびSpring Security 6.0連携は、Spring 5.xと同等であるかのように設定されています。

以前の`thymeleaf-spring5`または`thymeleaf-extras-springsecurity5`依存性を、新しい`thymeleaf-spring6`または`thymeleaf-extras-springsecurity6`のものに置き換える以外に変更は必要ありません。

Spring Bootベースのアプリケーションの場合は、変更は必要ありません。新しいSpring Boot 3.0は、Thymeleaf Spring Boot Starterが追加されるとThymeleaf 3.1を使うように設定されています。


### 式の制限

テンプレートのセキュリティを改善するために、Thymeleaf 3.1は変数式（`${...}`および`*{...}`）に一連の制限を適用しています。これはあなたの既存コードに影響があるかもしれません。

*"What's new"*の節で説明したとおり、式ユーティリティオブジェクト`#request`・`#response`・`#session`・`#servletContext`はテンプレート内の式からはもはや利用できません。

推奨される代替方法は、テンプレートでこれらのオブジェクトから必要とする情報を、コントローラーレベルでモデルに追加することです。これはコントローラーで`model#addAttribute(...)`を利用するか、`@ModelAttribute`または`@ControllerAdvice`アノテーションを利用することで達成できます。

```java
@ModelAttribute("contextPath")
public String contextPath(final HttpServletRequest request) {
    return request.getContextPath();
}
```

しかしその一方で、同様に*"What's new"*の節で説明したとおり、いくつかの例外を除いて、JDKおよびJakarta EEコアクラスに属するクラスの利用に厳しい制限があります。Thymeleaf 3.1以降では、禁止されているクラスを変数式で利用できなくなります。

もしテンプレートで禁止されたクラスのオブジェクトに対して式を実行したい場合は、ラッパークラス（あなたのアプリケーションのパッケージ内に）を作ってオリジナルオブジェクトのメソッドを委譲すればよいです。それは変数式から利用できます。


### th:includeの非推奨化

テンプレートで`th:include`属性を利用している場合、Thymeleaf 3.1ではまだ利用できるものの将来のバージョンでは削除されることに注意してください。`th:include`を`th:insert`に置き換えることを推奨します。しかし完全に同じようには動作しません。

このように`th:include`はフラグメントの*内容*を挿入する一方で：


```html
<div id="main" th:include="~{::frag}">...</div>
...
<p th:fragment="frag" class="content">
    something
</p>
```

...結果：

```html
<div id="main">
      something
</div>
```

このように`th:insert`では、*定義されているタグを含む*フラグメントが挿入されます：

```html
<div id="main" th:insert="~{::frag}">...</div>
...
<p th:fragment="frag" class="content">
    something
</p>
```

...結果：

```html
<div id="main">
  <p class="content">
      something
  </p>
</div>
```

`th:include`と同じ結果を達成したい場合は、`th:insert`と`th:remove`を組み合わせる必要があります：

```html
<div id="main" th:insert="~{::frag}">...</div>
...
<p th:fragment="frag" th:remove="tag" class="content">
    something
</p>
```

...結果：

```html
<div id="main">
      something
</div>
```

併せて、`<th:block>`タグを利用してフラグメントを定義できることも覚えておいてください。これは評価後に必ず消えるので高い柔軟性を提供します：

```html
<div id="main" th:insert="~{::frag}">...</div>
...
<th:block th:fragment="frag">
    something
</th:block>
```

結果：

```html
<div id="main">
      something
</div>
```


### アンラップドフラグメント式の非推奨化

Thymeleafのフラグメント式は`~{...}`のように表されます。これらは多くの属性や式で利用できます。典型的には`th:insert`や`th:replace`属性で現れます。

Thymeleaf 3.1より前では、`th:insert`・`th:replace`（または非推奨化された`th:include`）属性は`~{...}`エンベロープなしでのフラグメント式を許可していました：

```html
<div id="top" th:insert="common :: header">...</div>
```

しかしThymeleaf 3.1からは、まだ動作はしますが、非推奨となり将来のバージョンでは削除されます。上記はこのように書かれるべきです：

```html
<div id="top" th:insert="~{common :: header}">...</div>
```

