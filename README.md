# ng-appshell

[Demo](http://github.rommelsantor.com/ng-appshell/demo)

Methodology:

1. use minimal HTML in the initial page content so that it can be fetched quickly
1. encapsulate the "shell" in a self-contained template file that can be independently cached
1. render the shell immediately from local storage and pre-cache any images in the shell
1. load the business content in to fill in the meat of the shell's skeleton

---

## Install / Usage

Load `ng-appshell.js` and add the `ngAppShell` module as a dependency of your app.

*Dependency:* [ngStorage](https://github.com/gsklee/ngStorage)

## Structure

* Two data types can be cached:
  * shell body - the markup defining the shell's DOM
  * shell images - either <img> tags or elements with background-image to be precached for the shell

### Attributes

* `appshell-group` Multiple shells are supported. Required on all components of a given shell and all must share the same unique group name.
  * example: `appshell-group="main"`
* `appshell-lifetime` Lifetime in seconds that the shell can stay cached. Optional. Only applies to a shell-loader element. (default: 3600)
  * example: `appshell-lifetime="86400"`
* `appshell-include` URL to the shell template. Required on the shell-loader element (otherwise there's nothing to cache).
  * example: `appshell-include="/tpl/main.html"`
* `appshell-image` Add to any element in the shell whos image should attempt to be precached; it may be an <img> or an element with a background-image.
  * example: `<img src="somefile.jpg" appshell-image appshell-group="main"/>`
  * example: `<div appshell-image appshell-group="main" style="background:url('someotherfile.jpg')">fubar</div>`

### Illustration

This is how the demo is structured:

index.html
```html
<div appshell-group="main" appshell-lifetime="30" appshell-include="tpl/main.html"></div>
```

tpl/main.html
```html
<header>
  <img src="media/logo.png" appshell-image appshell-group="main"/>
</header>
...
<div ng-controller="IndexController" appshell-image appshell-group="main"></div>
```

---

## Casual Reading

There are a few variations around (such as using a Service Worker), but this implementation of an application shell, or App Shell, is intended to allow you to use AngularJS to make your Web application and especially your _mobile_ web app render meaningful, interactive content as instantaneously as possible regardless of any delays in the loading or processing of the bulk of the page content.

The "shell" is effectively a skeleton that includes common page elements, such as header, navigation, and footer, among other things. Subordinate to this shell is th
e actual meat of the requested page, the real business content that the user is after. For a latent server or heavy page content, it can sometimes take long (meaning a couple of seconds) before the browser can render meaningful content that the user can cleanly start interact with.

If you're wondering, the genesis for me was with a client who uses lengthy, media-heavy pages and wanted especially in mobile for the site to 1) appear loaded above the fold as immediately as possible so it gives the feel similar to a native app and 2) limit as much as possible the blank blink between page reloads.

I think it's a decent start, but there's definitely room for improvement.
