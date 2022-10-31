import { enableAutoEventAnalytics, analyticizeEvent } from "../src/index.js"

const disableAutoEventAnalytics = enableAutoEventAnalytics({ debug: true })

document
  .querySelector(`.disable-auto-analytics-button`)
  .addEventListener(
    `click`,
    () => disableAutoEventAnalytics && disableAutoEventAnalytics()
  )

document
  .querySelector(`.manual-analytics-input`)
  .addEventListener(`keyup`, (e) => {
    analyticizeEvent({
      debug: true,
      data: {
        name: `Input value change of a manual event analytics`,
        props: { value: e.target.value },
      },
    })
  })
