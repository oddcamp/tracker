import { isPlainObject, get } from "lodash"

const SERVICES = [`plausible`, `ahoy`]

function enableAutoEventAnalytics({
  attributeName = `event-analytics`,
  sourceNode = document,
  services = SERVICES,
  debug = false,
} = {}) {
  if (!window || !document) {
    debugLog(
      debug,
      `Auto event analytics could not be enabled due to the absence of DOM`
    )
    return false
  }

  if (!window.MutationObserver) {
    debugLog(
      debug,
      `Auto event analytics could not be enabled due to the lack of support of MutationObserver`
    )
    return false
  }

  if (
    !attributeName ||
    !(sourceNode === document || sourceNode instanceof Element) ||
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

  const nodeAttribute = `data-${attributeName}`
  const nodeSelector = `[${nodeAttribute}]`
  const nodes = new Set()

  const addNode = (node) => {
    nodes.add(node)

    if (node instanceof HTMLFormElement) {
      node.addEventListener(`submit`, handleFormSubmit)
    } else {
      node.addEventListener(`click`, handleClick)
    }
  }

  const deleteNode = (node) => {
    nodes.delete(node)

    if (node instanceof HTMLFormElement) {
      node.removeEventListener(`submit`, handleFormSubmit)
    } else {
      node.removeEventListener(`click`, handleClick)
    }
  }

  const getNodeData = (node) => {
    let data = null

    try {
      data = JSON.parse(node.getAttribute(nodeAttribute))
    } catch (e) {
      //
    }

    return data
  }

  const handleFormSubmit = (e) => {
    const data = getNodeData(e.currentTarget)
    let fields = {}

    new FormData(e.currentTarget).forEach((v, k) => (fields[k] = v))

    if (!get(data, `options.allFieldsAsProps`)) {
      const selectedFields = []

      e.currentTarget
        .querySelectorAll(`[${nodeAttribute}-field]`)
        .forEach((n) => selectedFields.push(n.name))

      if (selectedFields.length)
        Object.keys(fields).forEach(
          (f) => !selectedFields.includes(f) && delete fields[f]
        )
      else fields = {}
    }

    analyticizeEvent({
      data: {
        name: get(data, `name`),
        props: {
          ...get(data, `props`, {}),
          ...fields,
        },
      },
      services,
      debug,
    })
  }

  const handleClick = (e) => {
    const data = getNodeData(e.currentTarget)
    analyticizeEvent({ data, services, debug })
  }

  sourceNode.querySelectorAll(nodeSelector).forEach(addNode)

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === `attributes`) {
        if (mutation.target instanceof Element) {
          if (nodes.has(mutation.target)) deleteNode(mutation.target)
          if (mutation.target.getAttribute(nodeAttribute))
            addNode(mutation.target)
        }
      } else if (mutation.type === `childList`) {
        mutation.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.getAttribute(nodeAttribute)) addNode(n)
            n.querySelectorAll(nodeSelector).forEach((nn) => addNode(nn))
          }
        })

        mutation.removedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (nodes.has(n)) deleteNode(n)
            n.querySelectorAll(nodeSelector).forEach(
              (nn) => nodes.has(nn) && deleteNode(nn)
            )
          }
        })
      }
    })
  })

  observer.observe(sourceNode, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [nodeAttribute],
  })

  return () => {
    nodes.forEach(deleteNode)
    observer.disconnect()

    debugLog(debug, `Auto event analytics disabled`)
  }
}

function analyticizeEvent({ data, services = SERVICES, debug = false } = {}) {
  if (!anyServicesAvailable(services)) {
    debugLog(debug, `Auto event analytics requested, but no services available`)
    return
  }

  if (!data || !data.name || (data.props && !isPlainObject(data.props))) {
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
            `Plausible event analyzation has been requested`,
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

      case `ahoy`: {
        if (window && window.ahoy) {
          debugLog(debug, `Ahoy event analyzation has been requested`, data)

          window.ahoy.track(data.name, { ...(data.props || {}) })

          debugLog(debug, `Ahoy event has been analyzed`, data)
        } else {
          debugLog(
            debug,
            `Ahoy event analysation requested, but service is not available`
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

      case `ahoy`: {
        return !!window.ahoy
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
