import { saveItems, getItems } from './state.js'
import { inputSubmitReset } from './tasks.js'
import {
	dropzones,
	dragleaveHandler,
	dragoverHandler,
	dropzoneHandler,
} from './dropzone.js'
import { createItem } from './tasks.js'

function clearItems(zoneId = 'all') {
	if (zoneId === 'all') {
		dropzones.forEach((zone) => {
			while (zone.children.length !== 1) {
				zone.lastChild.remove()
			}
			localStorage.setItem('now-and-next-' + zone.id, null)
		})
	} else {
		let keyPrefix = 'now-and-next-'
		localStorage.setItem(keyPrefix + zoneId, null)

		const zone = document.getElementById(zoneId)
		while (zone.children.length !== 1) {
			zone.lastChild.remove()
		}
	}
}


dropzones.forEach((zone) => {
	// make active drop zones
	zone.addEventListener('drop', dropzoneHandler(zone.id))
	zone.addEventListener('dragleave', dragleaveHandler(zone.id))
	zone.addEventListener('dragover', dragoverHandler(zone.id))
	// populate on page load
	const content = getItems(zone.id)
	if (typeof content === 'string') {
		content !== 'null' && createItem(zone.id)(content)
	} else if (content) {
		content.forEach((str) => createItem(zone.id)(str))
	}
})

// adding tasks functionality
const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	inputSubmitReset()
	saveItems()
})
