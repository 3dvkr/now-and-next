import { saveItems } from './state.js'
import { zoneHasSpace } from './dropzone.js'
import { inputSubmitReset } from './tasks.js'
// keyboard access
export function keyBindingToggle(element, isFocused = true) {
	if (isFocused) {
		element.addEventListener('keydown', keyBindings)
	} else {
		element.removeEventListener('keydown', keyBindings)
	}
}
function keyBindings(keyEvent) {
	const { key, target } = keyEvent
	if (key === 'Tab') {
		keyBindingToggle(target, false)
	} else if (key === 'Escape') {
		inputSubmitReset()
	} else {
		keyEvent.preventDefault()
		if (key === 'ArrowUp' || key === 'k') {
			const { previousElementSibling: prev } = this.parentElement
			if (prev.tagName === 'DIV') {
				if (zoneHasSpace(prev.id)) prev.appendChild(this)
				this.focus()
			} else {
				document.getElementById('done').appendChild(this)
				this.style.opacity = 1
				inputSubmitReset()
			}
		} else if (key === 'ArrowDown' || key === 'j') {
			const { nextElementSibling: next } = this.parentElement
			if (next && next.tagName === 'DIV') {
				if (zoneHasSpace(next.id)) next.appendChild(this)
				if (next.id === 'done') {
					this.style.opacity = 1
					inputSubmitReset()
				} else {
					this.focus()
				}
			}
		}
	}
	saveItems()
}
