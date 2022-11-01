import { isPlainObject } from "lodash"

const SERVICES = [`plausible`]

function enableAutoEventAnalytics({
  attributeName = `event-analytics`,
  sourceNode = document,
  targets = [`a`, `button`],
  services = SERVICES,
  debug = false,
} = {}) {
  if (!window || !document) {
    debugLog(
      debug,
      `Auto event analytics could not be enabled due to absence of DOM`
    )
    return false
  }

  if (
    !attributeName ||
    !(sourceNode === document || sourceNode instanceof Element) ||
    !targets ||
    !targets.length ||
    !services ||
    !services.length
  ) {
    debugLog(
      debug,
      `Auto event analytics could not be enabled due to faulty parameters provided`
    )
    return false
  }

  debugLog(debug, `Auto event analytics enabled`)

  const targetsSelector = targets
    .map((t) => `${t}[data-${attributeName}]`)
    .join(`,`)

  const docClick = (e) => {
    const targetNode = e.target.closest(targetsSelector)
    if (!targetNode) return

    if (!anyServicesAvailable(services)) {
      debugLog(
        debug,
        `Auto event analytics requested, but no services available`
      )
      return
    }

    let data = null
    try {
      data = JSON.parse(targetNode.getAttribute(`data-${attributeName}`))
    } catch (e) {
      //
    }

    analyticizeEvent({ data, services, debug })
  }

  sourceNode.addEventListener(`click`, docClick)

  return () => {
    sourceNode.removeEventListener(`click`, docClick)

    debugLog(debug, `Auto event analytics disabled`)
  }
}

function analyticizeEvent({ data, services = SERVICES, debug = false } = {}) {
  if (!anyServicesAvailable(services)) {
    debugLog(debug, `Auto event analytics requested, but no services available`)
    return
  }

  if (!data || !data.name || !(data.props && isPlainObject(data.props))) {
    debugLog(
      debug,
      `Auto event analytics requested, but not accomplished due to faulty data attribute value provided`
    )
    return
  }

  services.forEach((service) => {
    switch (service) {
      case `plausible`: {
        if (window && window.plausible) {
          debugLog(
            debug,
            `Plausible event analytics request has been fulfilled`,
            data
          )

          window.plausible(data.name, {
            props: data.props,
            callback: () => {
              debugLog(debug, `Plausible event has been analyzed`, data)
            },
          })
        } else {
          debugLog(
            debug,
            `Plausible event analysation requested, but service is not available`
          )
        }
        break
      }
    }
  })
}

function anyServicesAvailable(services) {
  return !!services.find((service) => {
    switch (service) {
      case `plausible`: {
        return !!window.plausible
      }
    }

    return false
  })
}

function debugLog(debug, ...props) {
  if (!debug) return
  console.log(`[oddcamp/analytics]`, ...props) // eslint-disable-line no-console
}

export { enableAutoEventAnalytics, analyticizeEvent }
