// dropzone behavior
const sourceZone = document.getElementById("source")
const dropzones = document.querySelectorAll("div")
dropzones.forEach((zone) => {
  zone.addEventListener("drop", dropzoneHandler(zone.id))
  zone.addEventListener("dragleave", dragleaveHandler(zone.id))
  zone.addEventListener("dragover", dragoverHandler(zone.id))
})

// adding tasks functionality
const form = document.querySelector("form")
const addItemBtn = document.getElementById("add-item-btn")

const addItem = (e) => {
  e.preventDefault()
  inputSubmitReset()
  saveItems()
}
addItemBtn.addEventListener("click", addItem)
form.addEventListener("submit", addItem)

// helpers
const createItem = itemHandler()
// populate on page load
dropzones.forEach((zone) => {
  const content = getItems(zone.id)
  if(typeof content === "string") {
    content !== 'null' && createItem(zone.id)(content)
  } else if(content) {
    content.forEach(str => createItem(zone.id)(str))
  }
})
function itemHandler() {
  let count = -1
  return function (zoneId) {
    return function (str) {
      const newItem = document.createElement("p")
      const newItemText = document.createTextNode(str)
      newItem.appendChild(newItemText)
      newItem.addEventListener("dragstart", dragstartHandler)
      newItem.addEventListener("focus", focusMove)
      Object.assign(newItem, {
        draggable: true,
        tabIndex: 0,
        id: "p" + ++count
      })
      document.getElementById(zoneId).appendChild(newItem)
    }
  }
}

function inputSubmitReset() {
  const str = document.querySelector("input").value
  document.querySelector("input").focus()
  if(str && str !== '') createItem("source")(str)
  document.querySelector("input").value = ""
}

function dropzoneHandler(zoneId) {
  return function (ev) {
    document.getElementById(zoneId).classList.remove("bg-active-dropzone")
    const data = ev.dataTransfer.getData("application/my-app");
    document.getElementById(data).style.opacity = 1
    if(zoneId !== "now"
      && zoneId !== "next"
      || ev.target.textContent.replace(/\s/g, "").length <= zoneId.length
    ) {
      ev.currentTarget.appendChild(document.getElementById(data));
    }
    saveItems()
  }
}
function dragoverHandler(zoneId) {
  return function (ev) {
    ev.preventDefault()
    document.getElementById(zoneId).classList.add("bg-active-dropzone")
    ev.dataTransfer.dropEffect = "move";
  }
}
function dragleaveHandler(zoneId) {
  return function (ev) {
    document.getElementById(zoneId).classList.remove("bg-active-dropzone")
    ev.dataTransfer.dropEffect = "move"
  }
}
function dragstartHandler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("application/my-app", ev.target.id)
  ev.dataTransfer.effectAllowed = "move"
}
function focusMove(focusEvent) {
  focusEvent.target.style.opacity = 0.5
  const keydownHandler = (keyEvent) => {
    if(keyEvent.key === "Enter" || keyEvent.key === "Escape") {
      focusEvent.target.style.opacity = 1
      document.removeEventListener("keydown", keydownHandler)
      inputSubmitReset()
      saveItems()
    } else if(keyEvent.key === "ArrowDown" || keyEvent.key === "j") {
      const currentNode = focusEvent.target
      const parent = currentNode.parentElement
      if(parent.nextElementSibling && parent.nextElementSibling.tagName === "DIV") {
        parent.nextElementSibling.appendChild(currentNode)
      }
    } else if(keyEvent.key === "ArrowUp" || keyEvent.key === "k") {
      const currentNode = focusEvent.target
      const parent = currentNode.parentElement
      console.log({ parent, currentNode })
      if(parent.previousElementSibling.tagName === "DIV") {
        parent.previousElementSibling.appendChild(currentNode)
      } else {
        document.getElementById("done").appendChild(currentNode)
        focusEvent.target.style.opacity = 1
        document.removeEventListener("keydown", keydownHandler)
        inputSubmitReset()
      }
    }
  }
  console.log('keydown')
  document.addEventListener("keydown", keydownHandler)
}
function saveItems() {
  const items = [], done = []
  document
    .getElementById("source")
    .childNodes.forEach(el => el.tagName === "P" && items.push(el.textContent))
  document
    .getElementById("done")
    .childNodes.forEach(el => el.tagName === "P" && done.push(el.textContent))
  const now = document.getElementById("now").lastChild
  const next = document.getElementById("next").lastChild
  localStorage.setItem("now-and-next-now", now.tagName === "P" ? now.textContent : null)
  localStorage.setItem("now-and-next-next", next.tagName === "P" ? next.textContent : null)
  localStorage.setItem("now-and-next-source", JSON.stringify(items))
  localStorage.setItem("now-and-next-done", JSON.stringify(done))
}
function getItems(selection) {
  let keyPrefix = "now-and-next-"
  switch(selection) {
    case "now":
    case "next":
      return localStorage.getItem(keyPrefix + selection)
    case "source":
    case "done":
      return JSON.parse(localStorage.getItem(keyPrefix + selection))
    default:
      return null
  }
}