# Odd Camp tracking helpers library

A collection for tracking helper functions for snappier analytics.

## Supported tracker services

- Plausible

## Usage

1. Install

```js
$ yarn add @oddcamp/tracker
```

2. Enjoy

```js
import { enableAutoEventTracking } from "../src/index.js"

enableAutoEventTracking()
```

HTML

```html
  <a href="/" data-track-event='{"name": "Click", "props": {"trigger": "anchor"}}'>
    Link
  </a>
```

ERB

```erb
  <%= link_to 'Link', root_path, data: {track_event: {name: 'Click', props: {trigger: 'anchor'}}} %>
```

JSX

```jsx
  <a href="/" data-track-event={JSON.stringify({name: 'Click', props: {trigger: 'anchor'}})}>
    Link
  </a>
```

## Development

1. Create `.env` and add tracker variables you prefer to test:
    - `PLAUSIBLE_DOMAIN`
2. `$ yarn install`
3. `$ yarn dev`
3. [localhost:1234](http://localhost:1234)

## API

### `enableAutoEventTracking`

Enabled automatic event tracking.

_Defaults:_

```js
enableAutoEventTracking({
  attributeName = `track-event`,
  sourceNode = document,
  targets = [`a`, `button`],
  trackers = [`plausible`],
  debug = false,
})
```

_Returns:_ function which disables automatic event tracking if executed, e.g.:

```js
const disableAutoEventTracking = enableAutoEventTracking()
// ...
disableAutoEventTracking()
```

### `trackEvent`

Tracks an event.

_Defaults:_

```js
trackEvent({ 
  data, 
  trackers = [`plausible`],
  debug = false 
})
```

_Example:_

```js
trackEvent({
  data: {
    name: `Event name`,
    props: { name: `value` },
  },
})
```
