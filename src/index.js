import { isPlainObject } from "lodash"

const TRACKERS = [`plausible`]

function enableAutoEventTracking({
  attributeName = `track-event`,
  sourceNode = document,
  targets = [`a`, `button`],
  trackers = TRACKERS,
  debug = false,
}) {
  if (!window || !document) {
    debugLog(
      debug,
      `Auto event tracking could not be enabled due to absence of DOM`
    )
    return false
  }

  if (
    !attributeName ||
    !(sourceNode === document || sourceNode instanceof Element) ||
    !targets ||
    !targets.length ||
    !trackers ||
    !trackers.length
  ) {
    debugLog(
      debug,
      `Auto event tracking could not be enabled due to faulty parameters provided`
    )
    return false
  }

  const targetsSelector = targets
    .map((t) => `${t}[data-${attributeName}]`)
    .join(`,`)

  const docClick = (e) => {
    const targetNode = e.target.closest(targetsSelector)
    if (!targetNode) return

    if (!anyTrackersAvailable(trackers)) {
      debugLog(
        debug,
        `Auto event tracking requested, but no trackers available`
      )
      return
    }

    let data = null
    try {
      data = JSON.parse(targetNode.getAttribute(`data-${attributeName}`))
    } catch (e) {
      //
    }

    trackEvent({ data, trackers, debug })
  }

  sourceNode.addEventListener(`click`, docClick)

  return () => {
    sourceNode.removeEventListener(`click`, docClick)
  }
}

function trackEvent({ data, trackers = TRACKERS, debug = false }) {
  if (!anyTrackersAvailable(trackers)) {
    debugLog(debug, `Auto event tracking requested, but no trackers available`)
    return
  }

  if (!data || !data.name || !(data.props && isPlainObject(data.props))) {
    debugLog(
      debug,
      `Auto event tracking requested, but not accomplished due to faulty data attribute value provided`
    )
    return
  }

  switch (trackers) {
    case `plausible`: {
      if (window && window.plausible) {
        debugLog(
          debug,
          `Plausible event tracking request has been successfully fulfilled`,
          data
        )

        window.plausible(data.name, {
          props: data.props,
          callback: () => {
            debugLog(
              debug,
              `Plausible event has been successfully tracked`,
              data
            )
          },
        })
      } else {
        debugLog(
          debug,
          `Plausible event tracking requested, but tracker is not available`
        )
      }
      break
    }
  }
}

function anyTrackersAvailable(trackers) {
  return !!trackers.find((tracker) => {
    switch (tracker) {
      case `plausible`: {
        return !!window.plausible
      }
    }

    return false
  })
}

function debugLog(debug, ...props) {
  if (!debug) return
  console.log(`[oddcamp/tracker]`, ...props) // eslint-disable-line no-console
}

export { enableAutoEventTracking, trackEvent }
