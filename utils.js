// utils
export function zoneHasSpace(zoneId) {
	const zone = document.getElementById(zoneId)
	return (zoneId !== 'now' && zoneId !== 'next') || zone.childElementCount === 1
}
export function inputSubmitReset() {
	const str = document.querySelector('input').value
	document.querySelector('input').focus()
	if (str && str !== '') createItem('source')(str)
	document.querySelector('input').value = ''
}

