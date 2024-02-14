// import { zoneHasSpace } from "./dropzone.js"
import { saveItems } from "./state.js"
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

		console.log(`🎈 `, ev.target.id, ev.target.parentElement.id)
		if ([ev.target.id, ev.target.parentElement.id].includes('done')) {
			console.log('DONE YAY')
			for (let i = 0; i < 15; i++) {
				const tada = document.createElement('span')
				const tadaContent = document.createTextNode('🥳')
				tada.appendChild(tadaContent)
				tada.classList.add('tada')
				tada.style.left = `${i * 30}px`
				tada.style.fontSize = `${Math.max(Math.random() * 6, 1)}em`
				document.querySelector('main').appendChild(tada)
				setTimeout(() => tada.classList.add('rain'), Math.random() * 1000)
				// let printer
				// if (i == 0) {
				// 	printer = setInterval(() => {
				// 		console.log("where: ", tada.style)
				// 	}, 250)
				// }
				// tada.addEventListener("animationend", () => {
				// 	clearInterval(printer) 
				// })
			}
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

export function zoneHasSpace(zoneId) {
	const zone = document.getElementById(zoneId)
	return (zoneId !== 'now' && zoneId !== 'next') || zone.childElementCount === 1
}
