% From HTML to HTML (via HTML)


From HTML to HTML (via HTML)
============================

Knowing the internals of the HTML family of web standards is quite
important when you are using software such as Thymeleaf. At least if you
want to understand what you are doing.

The problem is that many people know the technologies they are using for
creating webs, but don't really know where these technologies come from.
It has been a long way since the inception of the first web interfaces,
and since then every new technology has been changing the way we
developed for the web by deprecating a good amount of our work and,
especially, our knowledge.

And now, with the arrival of HTML5, things have become even more
complicated. *What's it?* *Why is it HTML instead of XHTML?* *Wasn't the
HTML tag soup considered harmful?*

So let's take a step back, and see how we arrived where we are now, and
why.

Back in the 90s, there was HTML...
----------------------------------

...and HTML was a standard (or more correctly, a *recommendation*)
maintained by the *World Wide Web Consortium* (a.k.a. W3C). Extending
from a language called SGML, HTML defined a tag-based markup language
for writing rich hyper-text documents, highly coupled to the protocol
that was used for serving them and their related resources across the
network: the *Hyper-Text Transfer Protocol* (HTTP).

HTTP used text *headers* for defining what was being served to clients
and how, one of which was extremely important: the `Content-Type`
header. This header explained to browsers what type of content was being
served to them in a language called *MIME (Multipurpose Internet Mail
Extensions)*. And the MIME type used for serving HTML documents was
`text/html`:

    Content-Type: text/html

HTML also defined a way to check whether a document was *valid*. Being
valid basically meant that the document was written according to the
HTML rules that dictated what attributes a tag could have, where a tag
could appear in the document, etc.

These validity rules were specified using a language for defining the
structure of SGML documents called *Document Type Definition* or DTD. A
Standard DTD was created for each version of HTML, and HTML documents
had to declare the DTD (and therefore the version of HTML) they
conformed to by means of a clause that should appear as their first
line, the *Document Type Declaration* or `DOCTYPE` clause:

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

The Document Object Model and the tag soup
------------------------------------------

HTML was meant for displaying documents in browsers, and back in the
late 90s browsers were made by fiercely competing companies that wanted
to offer the maximum amount of cool features to their users. Given that
HTML only defined rules for document formatting, many other features
were left to the browser developers' imagination.

And one of the most interesting ideas that appeared in browsers was
*client-side interactivity*. This interactivity was achieved by
executing *scripts* — in languages such as JavaScript — inside the
browser itself, and giving these scripts the ability to handle, modify
and even execute events on parts of the document being displayed. For
this, browsers had to model HTML documents as in-memory trees of
objects, each of them with state and events, and thus the *Document
Object Model* (DOM) was born.

The problem was that HTML rules for well-formedness were quite loose
whereas DOM trees were strictly hierarchical structures, and this meant
that different interpretations of HTML tag positions and sequences could
lead to different DOM object trees in different browsers. Add to this
the fact that these different browsers modelled the API of DOM nodes in
different ways (different names, events, etc) and you will start to get
the idea of how difficult it was to create cross-browser interactivity
back then.

What's more: while all this was happening, browsers had been growing
quite forgiving with HTML authors, allowing them to write HTML documents
that were not well formed (*tag soups*) by automagically correcting
their errors. This lead HTML authors to create even worse formed
documents, and then browsers to allow even more errors in format, adding
to a quite destructive cycle. And guess what: each browser was
correcting all these errors in a different way. Hooray.

The W3C finally standardized the DOM API and a language for scripting in
web browsers: JavaScript (although for some complex reasons they
insisted on calling it ECMAScript). But the damage done by the world of
tag soups coupled with the slow adoption of these standards in full by
browser makers — in many cases fearing they would damage backwards
compatibility — produced effects that are still influencing the way we
create web applications today.

Enter XML
---------

Some time after HTML became a widely spread language, the W3C developed
a new specification called XML (*eXtensible Markup Language*), aimed at
the representation of general-purpose data (not only web) in the form of
hierarchical markup text.

XML was extensible in that it allowed the definition of purpose-specific
languages (tags and their attributes) to fit the needs of specific
scenarios. But HTML documents were not well formed from the XML
perspective, XML and HTML remained in fact incompatible languages. It
was not possible to express HTML as an XML *application*.

Being strictly hierarchical and removing the structural ambiguities of
HTML, XML documents were more directly translatable to standardized DOM
trees (a process known as *XML Parsing*). Also given the fact that XML
was a text-based language, and that text is a sort of
technology-agnostic format (as opposed to binary), XML became especially
suited for the cross-platform interchange of data across the internet.
In fact, it led to the birth of the now-ubiquitous *Web Services*
technologies.

HTML + XML = XHTML
------------------

At some point, driven by the obvious usefulness of XML and the fact that
it could make web documents more extensible and interoperable (like, for
example, producing more predictable DOMs across browsers), the W3C
decided to reformulate HTML as an XML dialect (or *application*) instead
of an SGML one, and so XHTML was born.

XHTML required web authors to write their documents as well-formed XML,
which introduced some formatting rules that didn't exist in HTML before:
tags should always be closed, attributes should always be escaped and
surrounded by quotes, etc.

The introduction of XHTML and the transformation of web documents into
well formed XML was generally perceived as a step forward, because it
would allow higher levels of standardization across browsers, less space
for authoring errors that had to be corrected in browser-specific ways,
and easier parsing and automated processing of web pages.

As a part of this, XHTML introduced a controversial concept coming
directly from XML and known as *Draconian Error Handling*, which meant
that any interpreter of XML — including now a browser — should fail
immediately should any kind of format error be found in the XML document
being processed. In practice, this meant that XHTML authors would have
to create perfectly well-formed documents or accept the fact that
browsers would never be able (in fact, allowed) to display them at all.

For validation, the XHTML 1.0 specification defined a set of DTDs that
could be used in `DOCTYPE` clauses: `XHTML 1.0 Strict`,
`XHTML 1.0 Transitional` and `XHTML 1.0 Frameset`. The first one was
meant for *pure* XHTML documents that didn't use any deprecated tags
coming from HTML, the second one for transitional documents that still
made use of deprecated tags and attributes, and the third one for
frameset pages.

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

But one of the most important aspects of XHTML was that it also
introduced a new MIME type, which was the one that every web server was
supposed to use for serving XHTML so that browsers knew that they had to
use their XHTML parser and engine instead of their HTML equivalents.
This was `application/xhtml+xml`:

    Content-Type: application/xhtml+xml

Crashing down to (XHTML's) reality
----------------------------------

Just after its introduction, everything looked bright for XHTML. We
developers should just have to wait for browsers to fully implement it
and the world of web development would suddenly look much happier...

Trouble is, that never happened.

What happened was that one specific browser simply denied implementing
support for the `application/xhtml+xml` content type. Guess which one.
Yeah, exactly, that one. Internet Explorer.

IE6, IE7 and IE8 show a download dialog when you try to access a
document served with XHTML's own content type, and that of course means
that you cannot use that content type if you want to be able to display
your web site to IE users. IE9 seems to be on the way to correct that,
but it is simply too late by now.

Fortunately — or maybe unfortunately — The XHTML 1.0 specification
included an appendix that stated that XHTML 1.0 content could also be
served using the old `text/html` content type from the HTML times, in
order to ease the transition. And that's exactly what most of us have
been doing the past several years: creating XHTML 1.0 content, and then
serving it as `text/html`. Given that the XHTML 1.0 specification was
published in 2000, the *transition* has taken long.

But the fact is that when you serve content as HTML instead of XHTML
browsers will use their HTML engines for it, and not the XHTML-specific
ones. And although their HTML engines have been XHTML-enabled, they
still have to provide backwards compatibility for old HTML 4 code —
which makes them very tricky pieces of software — and importantly, they
lack some of the most XML-ish features of XHTML, starting with...
Draconian Error Handling.

And if you don't have Draconian Error Handling, you have a forgiving
engine that will let you serve documents that are not well formed,
automagically correcting your errors. And if you know the browser will
correct your errors (in a browser-specific way), you will probably never
correct your documents... and so the HTML horror story still goes on.

Knowing this, think that you've probably never really created a truly
XHTML web site. What you've done is (probably ill-formed) XHTML
documents served and displayed as plain old HTML. How about that?

But it went worse, because in 2002 `XHTML 1.1` removed the possibility
of using the HTML content type, therefore allowing only
`application/xhtml+xml`. The problem was that, instead of this forcing
Internet Explorer to support `application/xhtml+xml`, which didn't
happen, this restriction simply turned XHTML 1.1 into as much a
mythological creature as Nessie. Almost no one ever used it.

In 2009, the W3C allowed again the use of `text/html` with XHTML 1.1
but, again, it was too late.

Towards HTML5: A divorce story
------------------------------

At some point (specifically, 2004), some browser makers realised that
the existing XHTML specifications were evolving too slowly to cope with
the increasing demands of the web (video, audio, richer application
interfaces...), and that the W3C was increasingly pushing them towards
creating stricter interpretations of documents that could end up
rendering huge amounts of (ill-formed) existing code useless.

They wanted to enhance web applications with capabilities like video,
audio, local storage, or advanced form processing, and in fact they
could do it by just adding those features in a browser-specific way, but
they didn't want to go the non-interoperable way again. They needed the
standards to evolve and include these new features.

Nevertheless, there was a problem with evolving the existing standards
of the time (namely XHTML): there were still lots and lots of web sites
and applications still relying on legacy HTML out there, and if those
cool new features were standardized by going the XHTML ultra-strict way,
all those applications would never be able to use the new features
unless they were completely rewritten. And everybody wanted a more
interoperable and standard web, but not at the cost of throwing away
many years of work done by millions of web authors.

So these makers (along with other individuals) presented the W3C with
the idea of evolving HTML in a way that made all (or most) existing HTML
and XHTML code still valid as *new HTML* while providing powerful new
features for web applications and — importantly — clearly defining the
way in which error handling should be done.

This latter point meant that instead of failing on the first error,
browsers would know *by specification* how to perform the automagical
correction of errors created by web authors and therefore would react to
them in exactly the same way, effectively turning HTML code (be it
XML-formed or not) fully cross-browser. You would still be recommended
to create XML-formed code for new sites, but if you didn't fancy or you
still had some tons of old legacy HTML (and most certainly you had), you
would still be invited to join the party. See that old HTML site there?
Let's add some video to it! It all sounded quite sensible.

But the fact is, all of this didn't sound quite as well to W3C back in
2004, and they rejected the proposal and decided to go strictly the
XHTML way. HTML was dead for them, there was no reason to resurrect it,
and `XHTML 2.0` was the future.

This led to divorce. The proponents of this new concept for HTML, a
group that included individuals from Opera Software, the Mozilla
Foundation and Apple, left the W3C and founded the *Web Hypertext
Application Technology Working Group (WHATWG)* with the aim of defining
what we today know as HTML5.

Finally, in 2007, the W3C created a working group for *next-generation
HTML*, which later accepted to join efforts with WHATWG, effectively
adopting HTML5 as their working specification and future deliverable.
W3C and WHATWG were now united for creating HTML5, and in 2009 the W3C
just let XHTML 2.0 die by closing the group working on its
specification.

HTML5 was now the *only* future of web standards.

So what is HTML5?
-----------------

HTML5 is a set of standards — still under development as of 2011 —
evolving from current HTML 4 and XHTML specifications and aimed at:

-   Adding advanced new capabilities to HTML that effectively move web
    development slightly away from the document-oriented philosophy and
    towards a more application-oriented one. Such capabilities are
    called *HTML5 features* and are in some cases defined by standards
    on their own, apart from the HTML5 core one. HTML5 features include,
    among others: video, audio, drawing canvas, geolocation, local
    storage, offline support and advanced form-related capabilities.
-   Providing a pain-free path for migration from HTML and XHTML, which
    enables the adoption of HTML5 with little or no rewriting of code at
    all.
-   Providing a standard way of handling code errors, so that ill-formed
    HTML5 code will perform in the same predictable way in all browsers.

From a practical point of view, this means that (probably all of) your
current HTML and XHTML code will be considered valid HTML5 just by
changing your `DOCTYPE` to the HTML5 one:

```html
<!DOCTYPE html>
```

And by serving your content with content type `text/html`:

    Content-Type: text/html

And here you might be thinking: why does that `DOCTYPE` specify no DTD
at all? Because there isn't one. HTML5 has no DTD because the rules that
define whether a document is valid HTML5 or not are defined as
human-readable text in the specification itself, but cannot be expressed
in the DTD language.

But this does not mean that an HTML5 parser and/or engine cannot
validate. It can. It simply has to be a piece of software especially
devoted to HTML5 parsing including specific code programmed for
executing the rules that are involved in validating HTML5 (as opposed to
reading those rules from a DTD file). Even if the specification is now
quite flexible, it still *is* a specification, and you have to conform
to it.

But if there is no DTD, then why have a DOCTYPE clause at all? Because a
DOCTYPE clause is needed in order to make browsers display documents in
*Standards Mode* (as opposed to *Quirks Mode*). The clause
`<!DOCTYPE html>` is the minimum valid DOCTYPE declaration possible, and
that is exactly all we need. It just acts as a switch.

Can I use HTML5 already?
------------------------

Yes and no. You can use some of the HTML5 features that have already
been implemented into some browsers, but (as of 2011) there still is no
browser that fully implements all of the HTML5 features. And even if
there was, that could change because the specification itself is still
work in progress.

Using HTML5 in full will in fact take some time, to be honest. Think
that not only you will have to wait for some browser to implement all of
HTML5, but that in fact you will have to wait for *most* browsers to do
it, and then wait for your potential users to upgrade their browsers to
these versions. Now think that a noticeable percent of big companies
still use Internet Explorer 6 (published in 2001) as their standard
browser and... well... cry.

But anyway, one thing is for sure: you can switch your DOCTYPE to
HTML5's and you will be doing HTML5. And that is something you can do
today if you feel the need to.

And what about XHTML5? Does that exist?
---------------------------------------

In theory, yes. XHTML5 is just HTML5 served with:

    Content-Type: application/xhtml+xml

But again, this content type is not currently supported by IE. So in
practice, no, it doesn't exist.

Be careful though: the difference between HTML5 and XHTML5 is the
content type and *only* the content type, because an XML-formed HTML5
document is in fact a perfectly valid HTML5 document. This is quite
different to the relation between HTML4 and XHTML 1.0/1.1, which were
incompatible languages.

OK. The history lesson was great. Now, how does this relate to Thymeleaf?
-------------------------------------------------------------------------

Out-of-the-box (it is extensible), Thymeleaf allows you to create web
templates according to three specifications:

-   XHTML 1.0 (Strict, Transitional and Frameset)
-   XHTML 1.1
-   HTML5

Support for HTML5 has a tricky part, though: Thymeleaf will make you
decide whether your HTML5 templates are XML-formed code or not, and
strongly suggest you that they are.

The main reason for this is that at the heart of the default
configuration of Thymeleaf lie an XML parser and a DOM processor, and so
Thymeleaf will always need XML input. If your HTML5 templates are
well-formed XML they will be parsed just as fine as any other XHTML
template; but if they aren't, Thymeleaf will need to execute a previous
conversion (basically a tag balancing operation) to convert your HTML
into XML before parsing. Obviously, this will not be the end of the
world, but in some high-load scenarios it could affect template
processing performance.

Anyway, truth be told, that should not happen very often. The main
reason HTML5 allows non-XML syntax is legacy integration, and there is
no good reason why you should not be closing your tags and escaping your
attributes in new applications being developed these days, voluntarily
making them difficult to parse and work with (unless you are Google and
transferring the extra bytes in attribute values over the net would
*really* make a difference to you). Remember that *with power comes
responsibility*. You do not want to voluntarily go back to the olden
days of tag soup by relying on how well browsers implement standardized
error handling, do you?
