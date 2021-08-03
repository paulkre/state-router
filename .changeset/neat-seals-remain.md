---
"@paulkre/state-router": major
---

The way of determining the routes was simplified. The route used to be derrived with a collection of regular expressions applied to a web page's path. Now, it is simply specified via a prop which acts a route ID in form of a `string` (or `null`). This changes improves flexibility when using this module with other frameworks like Gatsby.
