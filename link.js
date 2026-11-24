const viewer = document.getElementById("viewer")
const image = viewer.querySelector("img")

function overlay(data) {
	const NS = "http://www.w3.org/2000/svg"
	const svg = document.createElementNS(NS, "svg")
	svg.setAttribute("viewBox", `0 0 ${data.width} ${data.height}`)
	svg.setAttribute("preserveAspectRatio", "none")
	svg.setAttribute("aria-label", "page links")

	// A wrapped link becomes several rects under one anchor, so it is still
	// one tab stop.
	const groups = []
	for (const link of data.links) {
		const last = groups.at(-1)
		if (last && last.href === link.href && last.label === link.label) {
			last.rects.push(link)
		} else {
			groups.push({ href: link.href, label: link.label, rects: [link] })
		}
	}

	// Document order: the last link drawn is painted on top and wins overlaps.
	for (const group of groups) {
		const a = document.createElementNS(NS, "a")
		a.setAttribute("href", group.href)

		const title = document.createElementNS(NS, "title")
		title.textContent = group.label || group.href
		a.append(title)

		for (const link of group.rects) {
			const rect = document.createElementNS(NS, "rect")
			rect.setAttribute("x", link.left)
			rect.setAttribute("y", link.top)
			rect.setAttribute("width", link.right - link.left)
			rect.setAttribute("height", link.bottom - link.top)
			a.append(rect)
		}

		svg.append(a)
	}

	viewer.append(svg)
}

try {
	const data = await (await fetch("links.json")).json()
	document.title = data.title || document.title
	image.alt = data.title || image.alt

	const match = location.search.match(/^\?(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
	let hit
	if (match) {
		const x = Number(match[1])
		const y = Number(match[2])
		// Later rectangles win, so scan the document-order list backwards.
		hit = [...data.links]
			.reverse()
			.find(
				(link) =>
					link.left <= x &&
					x <= link.right &&
					link.top <= y &&
					y <= link.bottom,
			)
	}

	if (hit) {
		location.replace(hit.href)
	} else {
		overlay(data)
	}
} catch (error) {
	console.error("image-site:", error)
}
