# Odd Camp analytics helpers library

A collection of analytics helper functions.

## Supported analytics services

- Plausible
- Ahoy

### Plausible

Make sure the API object is available at `window.plausible`. It usually is if the snippet was inserted via `<script>`.

### Plausible

Make sure the API object is available at `window.ahoy`. If you use it as NPM module you can expose the object like this:

```js
import ahoy from "ahoy.js"

window.ahoy = ahoy
```
  

###

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
    - `PLAUSIBLE_DOMAIN=something.site`
    - `AHOY_SCRIPT_URL=https://unpkg.com/ahoy.js@0.4.0/dist/ahoy.js`
2. `$ yarn install`
3. `$ yarn dev`
3. [localhost:1234](http://localhost:1234)

## API

### `enableAutoEventAnalytics`

Enable automatic event analytics for element clicks and form submissions.

_Defaults:_

```js
enableAutoEventAnalytics({
  attributeName = `event-analytics`,
  sourceNode = document,
  services = [`plausible`, `ahoy`],
  debug = false,
})
```

_Returns:_ function which disables automatic event analytics if executed, e.g.:

```js
const disableAutoEventAnalytics = enableAutoEventAnalytics()
// ...
disableAutoEventAnalytics()
```

The value of `attributeName` attribute must be a JSON, e.g.:

```js
{
  "name": "", // name; mandatory
  "props": {}, // custom properties
  "options": {
    "allFieldsAsProps": false, // sets all form fields as props on form submissions
  }
}
```

Get all form field name and value pairs as props using boolean `allFieldsAsProps`
option or specify field(s) manually by setting `data-event-analytics-field`
attribute, e.g.

```html
  <form data-event-analytics="{...}">
    <input type="search" name="query" data-event-analytics-field>
  </form>
```

Note: the attribute name may differ if you did set a custom value for
`attributeName` parameter (`${attributeName}-field`).

### `analyticizeEvent`

Analyticizes an event.

_Defaults:_

```js
analyticizeEvent({ 
  data, 
  services = [`plausible`, `ahoy`],
  debug = false 
})
```

_Example:_

```js
analyticizeEvent({
  data: {
    name: `Event name`,
    props: {
      key: `value`,
    },
  },
})
```
