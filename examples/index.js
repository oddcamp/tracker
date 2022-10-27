import { enableAutoEventTracking, trackEvent } from "../src/index.js"

const disableAutoEventTracking = enableAutoEventTracking({ debug: true })

document
  .querySelector(`.disable-auto-tracking-button`)
  .addEventListener(
    `click`,
    () => disableAutoEventTracking && disableAutoEventTracking()
  )

document
  .querySelector(`.manual-tracking-input`)
  .addEventListener(`keyup`, (e) => {
    trackEvent({
      debug: true,
      data: {
        name: `Input value change of a manual event tracking`,
        props: { value: e.target.value },
      },
    })
  })
