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

document.querySelectorAll(`.auto-analytics-form`).forEach((n) =>
  n.addEventListener(`submit`, (e) => {
    e.preventDefault()
  })
)

// eslint-disable-next-line prettier/prettier
;(() => {
  const el = document.querySelector(`.auto-analytics-dynamic`)
  el.innerHTML = el.querySelector(`template`).innerHTML
})()
