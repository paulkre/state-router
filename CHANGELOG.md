# @paulkre/state-router

## 4.0.1

### Patch Changes

- 5d5c2ae: Typescript build target changed to `ES2019` to support Node v12.

## 4.0.0

### Major Changes

- ef465e0: It is now possible to stack routes into each other. Their states will be merged with a logical `OR`.

### Patch Changes

- 429ac73: Pre runs when switching a route on / off are now handled by the `RouteSwitch` component instead of being done in `Route`.
- 6f2b4a6: `RouterContextProvider` is now exposed in module exports.

## 3.0.0

### Major Changes

- 387a099: Prop names and state attributes have been renamed.

### Minor Changes

- faa815e: The current route's data is now included by the router context (`currentData`).

## 2.0.1

### Patch Changes

- 3c751e7: Prop names have changed.

## 2.0.0

### Major Changes

- f9e4961: The way of determining the routes was simplified. The route used to be derrived with a collection of regular expressions applied to a web page's path. Now, it is simply specified via a prop which acts a route ID in form of a `string` (or `null`). This changes improves flexibility when using this module with other frameworks like Gatsby.

## 1.0.0

### Major Changes

- a37ecc4: Initial files have been copied from the repository of another project.
