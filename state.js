import { dropzones } from './dropzone.js'
// state
export function saveItems() {
	const items = [],
		done = []
	document
		.getElementById('source')
		.childNodes.forEach(
			(el) => el.tagName === 'P' && items.push(el.textContent)
		)
	document
		.getElementById('done')
		.childNodes.forEach((el) => el.tagName === 'P' && done.push(el.textContent))
	const now = document.getElementById('now').lastChild
	const next = document.getElementById('next').lastChild
	localStorage.setItem(
		'now-and-next-now',
		now.tagName === 'P' ? now.textContent : null
	)
	localStorage.setItem(
		'now-and-next-next',
		next.tagName === 'P' ? next.textContent : null
	)
	localStorage.setItem('now-and-next-source', JSON.stringify(items))
	localStorage.setItem('now-and-next-done', JSON.stringify(done))
}
export function getItems(selection) {
	let keyPrefix = 'now-and-next-'
	switch (selection) {
		case 'now':
		case 'next':
			return localStorage.getItem(keyPrefix + selection)
		case 'source':
		case 'done':
			return JSON.parse(localStorage.getItem(keyPrefix + selection))
		default:
			return null
	}
}
export function clearItems(zoneId = 'all') {
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
