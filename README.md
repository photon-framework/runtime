# γ Photon Runtime

Use modernized retro tech at the speed of light towards the future.

[![NPM version](https://img.shields.io/npm/v/photon-re.svg)](https://npmjs.org/package/photon-re "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/photon-re.svg)](https://npmjs.org/package/photon-re "View this project on NPM")
![Types included](https://badgen.net/npm/types/tslib)

Photon is a web development platform that takes simplicity over complexity. Great for beginners and experts.

This framework is not meant to be used for complex web applications, only for simple pages. The purpose is to improve the general performance and simplify the deployment.

## Use Cases

- Blogs
- Portfolios
- Info pages
- Online documentations
- ...

## Keep it simple

You don't need JavaScript to get Photon working.

## Speed and performance

Most frameworks add too much overhead to simple websites.
Photon does the opposite, it is designed for simple websites.

## It stays in the Browser

The complete code is executed client-side in the browser.

## Quick Start

### Use npm or yarn to import the library.

```bash
yarn add photon-re
yarn add -D photon-cli
```

### Create your index.html boilerplate (nothing special here)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Photon</title>
  </head>
  <body></body>
</html>
```

### Add a router to the body

```html
<photon:router
  id="root"
  data-content="/content"
  data-default-site="home"
  data-fallback="404"
></photon:router>
```

- `data-content` is the location of the subpages that should get injected into the router.
- `data-default-site` is loaded if no path (for a subpage) is given in the url.
- `data-fallback` is loaded if the the subpage specified by the url was not found. Server Setup is needed.

### Add anchors for navigation to the body

```html
<nav>
  <a data-target="#root" data-route="info">Info</a>
  <a data-target="#root" data-route="portfolio">Portfolio</a>
  <a data-target="#root" data-route="links">Links</a>
</nav>
```

- `data-route` specifies the name of the subpage that should be loaded on click.
- `data-target` _(optional)_ takes a selector (like `#root`) for a target router. If this attribute is not given, the router that is found first is used.

### For special functionalities read the documentation

[Documentation](https://github.com/photon-framework/runtime/wiki)
