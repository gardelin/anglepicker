/**
 * Create DOM object from string
 *
 * @param {Object} string
 * @return {Object}
 */
export function htmlStringToDom(string) {
   return new DOMParser().parseFromString(string, 'text/html').body.childNodes;
}

/**
 * Mimic jquery insertAfter
 *
 * @param {Object} newNode
 * @param {Object} referenceNode
 * @return {Void}
 */
export function insertAfter (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Trigger event on element
 *
 * @param {Object} element
 * @param {String} name
 * @param {Object} details
 * @return {Void}
 */
export function triggerEvent(element = document, name = '', details = {} ) {
    element.dispatchEvent(new CustomEvent(name, { detail: details }))
}