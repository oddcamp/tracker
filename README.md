# Odd Camp analytics helpers library

A collection of analytics helper functions.

## Supported analytics services

- Plausible

## Usage

1. Install

```js
$ yarn add @oddcamp/analytics
```

2. Enjoy

```js
import { enableAutoEventAnalytics } from "@oddcamp/analytics"

enableAutoEventAnalytics()
```

HTML

```html
  <a href="/" data-event-analytics='{"name": "Click", "props": {"trigger": "anchor"}}'>
    Link
  </a>
```

ERB

```erb
  <%= link_to 'Link', root_path, data: {event_analytics: {name: 'Click', props: {trigger: 'anchor'}}} %>
```

JSX

```jsx
  <a href="/" data-event-analytics={JSON.stringify({name: 'Click', props: {trigger: 'anchor'}})}>
    Link
  </a>
```

## Development

1. Create `.env` and set variables of analytics services you prefer to test:
    - `PLAUSIBLE_DOMAIN`
2. `$ yarn install`
3. `$ yarn dev`
3. [localhost:1234](http://localhost:1234)

## API

### `enableAutoEventAnalytics`

Enabled automatic event analytics.

_Defaults:_

```js
enableAutoEventAnalytics({
  attributeName = `event-analytics`,
  sourceNode = document,
  targets = [`a`, `button`],
  services = [`plausible`],
  debug = false,
})
```

_Returns:_ function which disables automatic event analytics if executed, e.g.:

```js
const disableAutoEventAnalytics = enableAutoEventAnalytics()
// ...
disableAutoEventAnalytics()
```

### `analyticizeEvent`

Analyticizes an event.

_Defaults:_

```js
analyticizeEvent({ 
  data, 
  services = [`plausible`],
  debug = false 
})
```

_Example:_

```js
analyticizeEvent({
  data: {
    name: `Event name`,
    props: { name: `value` },
  },
})
```
