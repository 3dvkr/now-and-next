import { dragstartHandler } from './dropzone.js'
import { keyBindingToggle } from './keyboard.js'

export const createItem = itemHandler()

function itemHandler() {
	let count = -1
	return (zoneId) => (str) => {
		const newItem = document.createElement('p')
		const newItemText = document.createTextNode(str)
		newItem.appendChild(newItemText)

		Object.assign(newItem, {
			draggable: true,
			tabIndex: 0,
			id: 'p' + ++count,
		})
		newItem.addEventListener('dragstart', dragstartHandler)
		newItem.addEventListener('dragover', (e) => {
			// TODO: add background change css class
			e.preventDefault()
			e.stopPropagation()
			e.dataTransfer.dropEffect = 'move'
		})
		newItem.addEventListener('dragleave', (e) => {
			// TODO: remove background change css class
			e.preventDefault()
			e.stopPropagation()
			e.dataTransfer.dropEffect = 'move'
		})
		newItem.addEventListener('drop', (e) => {
			e.preventDefault()
			e.stopPropagation()
			if (zoneHasSpace(e.target.parentElement.id)) {
				const data = e.dataTransfer.getData('application/my-app')
				e.currentTarget.insertAdjacentElement(
					'afterend',
					document.getElementById(data)
				)
				document.getElementById(data).style.opacity = 1
			}
		})

		newItem.addEventListener('focus', ({ target }) =>
			keyBindingToggle(target, true)
		)
		newItem.addEventListener('blur', ({ target }) =>
			keyBindingToggle(target, false)
		)
		document.getElementById(zoneId).appendChild(newItem)
	}
}
