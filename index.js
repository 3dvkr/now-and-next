// dropzone behavior
const sourceZone = document.getElementById('source')
const dropzones = document.querySelectorAll('div')
dropzones.forEach((zone) => {
	zone.addEventListener('drop', dropzoneHandler(zone.id))
	zone.addEventListener('dragleave', dragleaveHandler(zone.id))
	zone.addEventListener('dragover', dragoverHandler(zone.id))
})

// adding tasks functionality
const form = document.querySelector('form')
const addItemBtn = document.getElementById('add-item-btn')

const addItem = (e) => {
	e.preventDefault()
	inputSubmitReset()
	saveItems()
}
form.addEventListener('submit', addItem)

// helpers
const createItem = itemHandler()
// populate on page load
dropzones.forEach((zone) => {
	const content = getItems(zone.id)
	if (typeof content === 'string') {
		content !== 'null' && createItem(zone.id)(content)
	} else if (content) {
		content.forEach((str) => createItem(zone.id)(str))
	}
})

function itemHandler() {
	let count = -1
	return function (zoneId) {
		return function (str) {
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
				e.preventDefault()
				e.stopPropagation()
				e.dataTransfer.dropEffect = 'move'
			})
			newItem.addEventListener('dragleave', (e) => {
				e.preventDefault()
				e.stopPropagation()
				e.dataTransfer.dropEffect = 'move'
			})
			newItem.addEventListener('drop', (e) => {
				e.preventDefault()
				e.stopPropagation()
				if (zoneHasSpace(zoneId)) {
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
}

// drag and drop event handlers
function dropzoneHandler(zoneId) {
	return function (ev) {
		document.getElementById(zoneId).classList.remove('bg-active-dropzone')
		const data = ev.dataTransfer.getData('application/my-app')
		document.getElementById(data).style.opacity = 1
		if (zoneHasSpace(zoneId)) {
			ev.currentTarget.appendChild(document.getElementById(data))
		}
		saveItems()
	}
}
function dragoverHandler(zoneId) {
	return function (ev) {
		ev.preventDefault()
		document.getElementById(zoneId).classList.add('bg-active-dropzone')
		ev.dataTransfer.dropEffect = 'move'
	}
}
function dragleaveHandler(zoneId) {
	return function (ev) {
		document.getElementById(zoneId).classList.remove('bg-active-dropzone')
		ev.dataTransfer.dropEffect = 'move'
	}
}
function dragstartHandler(ev) {
	// Add the target element's id to the data transfer object
	ev.dataTransfer.setData('application/my-app', ev.target.id)
	ev.dataTransfer.effectAllowed = 'move'
}

// keyboard access
function keyBindingToggle(element, isFocused = true) {
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

// utils
function zoneHasSpace(zoneId) {
	const zone = document.getElementById(zoneId)
	return (zoneId !== 'now' && zoneId !== 'next') || zone.childElementCount === 1
}
function inputSubmitReset() {
	const str = document.querySelector('input').value
	document.querySelector('input').focus()
	if (str && str !== '') createItem('source')(str)
	document.querySelector('input').value = ''
}

// state
function saveItems() {
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
function getItems(selection) {
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
