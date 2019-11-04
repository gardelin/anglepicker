import sdom from 'sdom-js'
import { htmlStringToDom, insertAfter, triggerEvent } from './helper.js'

export default class Anglepicker {
    constructor(element, options = {}) {
        this.defaults = {
            parent: null,
            step: 45,
            startOffset: 0,
            widget: '' +
                '<div class="anglepicker-widget">' +
                    '<div class="anglepicker-dragarea">' +
                        '<span class="anglepicker-handle"></span>' +
                    '</div>' +
                '</div>'
        }

        this.element = element
        this.options = {
            ...this.defaults,
            ...options
        }

        this.init()
    }

    /**
     * Initialize anglepicker widget
     *
     * @return {Void}
     */
    init() {
        this.element.setAttribute('data-anglepicker-init', 'true')
        // this.element.style.display = 'none'

        // User interface
        this.ui = {}
        this.ui.widget = htmlStringToDom(this.options.widget).item(0)
        this.ui.preview = sdom('.anglepicker-preview', this.ui.widget)
        this.ui.dragarea = sdom('.anglepicker-dragarea', this.ui.widget)
        this.ui.handle = sdom('.anglepicker-handle', this.ui.dragarea)

        // Prepare bind functions
        this.handleElementChange = this.handleElementChange.bind(this)
        this.handleAnglepickerMousemove = this.handleAnglepickerMousemove.bind(this)
        this.handleAnglepickerMouseup = this.handleAnglepickerMouseup.bind(this)
        this.handleAnglepickerMouseleave = this.handleAnglepickerMouseleave.bind(this)
        this.handleAnglepickerMousedown = this.handleAnglepickerMousedown.bind(this)

        // Bind events
        this.element.addEventListener("change", this.handleElementChange)
        this.ui.dragarea.addEventListener("mousedown", this.handleAnglepickerMousedown)
        // this.ui.preview.addEventListener("change", this.handlePreviewChange.bind(this))

        // Add widget to DOM
        if (this.options.parent) {
            insertAfter(this.ui.widget, this.options.parent)
        } else {
            insertAfter(this.ui.widget, this.element)
        }

        // Set init value
        triggerEvent(this.element, 'change')
        triggerEvent(this.element, 'anglepickerinit', { value: this.element.value })
    }

    /**
     * Element change event handler
     *
     * @param {Event} e
     * @return {Void}
     */
    handleElementChange(e) {
        let value = e.target.value || "0"
        triggerEvent(this.element, 'anglepickerchange', { value: value })
        this.ui.handle.setAttribute('data-value', value)
        this.ui.handle.style.transform = "rotate(" + (parseInt(value) + (this.options.startOffset || 0)) + "deg)"

        if (this.element.nodeName.toLowerCase() !== "input")
            this.element.style.transform = "rotate(" + (parseInt(value) + (this.options.startOffset || 0)) + "deg)"
    }

    /**
     * Cancel drag event.
     *
     * @param  {Event} e
     * @return {Void}
     */
    dragCancel(e) {
        let doc = this.ui.widget.ownerDocument
        doc.documentElement.classList.remove("anglepicker-dragarea-dragging")

        doc.removeEventListener("mousemove", this.handleAnglepickerMousemove)
        doc.removeEventListener("mouseup", this.handleAnglepickerMousemove)
        doc.removeEventListener("mouseleave", this.handleAnglepickerMousemove)

        delete this.drag
    }

    /**
     * Draggable anglepicker mousedown event handler.
     * User clicked on anglepicker to rotate anglepicker.
     *
     * @param {Event} e
     * @return {Void}
     */
    handleAnglepickerMousedown(e) {
        this.drag = {
            target: e.currentTarget,
            rect: e.currentTarget.getBoundingClientRect(),
            get x() {
                return Math.round(this.rect.left + (this.rect.width / 2))
            },
            get y() {
                return Math.round(this.rect.top + (this.rect.height / 2))
            }
        }

        let doc = this.ui.widget.ownerDocument
        doc.addEventListener("mousemove", this.handleAnglepickerMousemove)
        doc.addEventListener("mouseup", this.handleAnglepickerMouseup)
        doc.addEventListener("mouseleave", this.handleAnglepickerMouseleave)
        doc.documentElement.classList.add('anglepicker-dragarea-dragging')

        this.calculateAngle(e)

        triggerEvent(this.element, 'anglepickerdragstart')

        e.preventDefault()
    }

    /**
     * Draggable anglepicker mousemove event handler.
     * User is rotating anglepicker while cursor
     * is inside widget.
     *
     * @param {Event} e
     * @return {Void}
     */
    handleAnglepickerMousemove(e) {
        this.calculateAngle(e)

        triggerEvent(this.element, 'anglepickerdragmove')
    }

    /**
     * Draggable anglepicker mouseup event handler.
     * User stopped rotating anglecpicker while
     * cursor is inside widget.
     *
     * @param {Event} e
     * @return {Void}
     */
    handleAnglepickerMouseup(e) {
        this.calculateAngle(e)
        this.dragCancel(e)

        triggerEvent(this.element, 'anglepickerdragend')
    }

    /**
     * Draggable anglepicker mouseleave event handler.
     * User is rotating anglepicker while cursor
     * is outside widget.
     *
     * @param {Event} e
     * @return {Void}
     */
    handleAnglepickerMouseleave(e) {
        this.handleAnglepickerMouseup(e)
    }

    /**
     * Calculate angle
     *
     * @param {Event} e
     * @return {Void}
     */
    calculateAngle(e) {
        if (!this.drag)
            return

        // calculate angle
        let data = {
            x: e.clientX - this.drag.x,
            y: e.clientY - this.drag.y,
        }
        data.angle = (Math.round(Math.atan2(data.y, data.x) * 180 / Math.PI) - (this.options.startOffset || 0)) % 360

        // zero is at 3o'clock, make it at 12
        data.angle += 90

        // normalize
        data.angle = this.degrees(data.angle, e.shiftKey ? this.options.step : false)

        // render change
        if (this.element.value !== data.angle) {
            this.element.value = data.angle
            triggerEvent(this.element, 'change')
        }
    }

    /**
     * Make sure that angle number
     * is display correctly.
     *
     * @param {Mixed} angle
     * @param {Number} step
     * @return {Number}
     */
    degrees(angle = 0, step = false) {
        if (step && step * 1 > 1)
            angle = step * Math.ceil(angle / step);

        angle = angle % 360;
        if (angle < 0)
            angle += 360;

        return angle;
    }

    /**
     * Destroy anglepicker
     *
     * @return {Void}
     */
    destroy() {
        // Remove event
        this.element.removeEventListener("change", this.handleElementChange)
        this.ui.dragarea.removeEventListener("mousedown", this.handleAnglepickerMousedown)

        // Remove widget and attrs from DOM
        this.ui.widget.parentNode.removeChild(this.ui.widget)
        this.element.removeAttribute('data-anglepicker-init')

        this.ui = null
        this.options = null
        triggerEvent(this.element, 'anglepickerdestroy')
        this.element = null
    }

}