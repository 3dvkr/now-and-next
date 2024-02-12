export const dropzones = document.querySelectorAll('.dropzone')
// drag and drop event handlers
export function dropzoneHandler(zoneId) {
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
export function dragoverHandler(zoneId) {
	return function (ev) {
		ev.preventDefault()
		document.getElementById(zoneId).classList.add('bg-active-dropzone')
		ev.dataTransfer.dropEffect = 'move'
	}
}
export function dragleaveHandler(zoneId) {
	return function (ev) {
		document.getElementById(zoneId).classList.remove('bg-active-dropzone')
		ev.dataTransfer.dropEffect = 'move'
	}
}
export function dragstartHandler(ev) {
	// Add the target element's id to the data transfer object
	ev.dataTransfer.setData('application/my-app', ev.target.id)
	ev.dataTransfer.effectAllowed = 'move'
}