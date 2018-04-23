$(() => {

const animate = (el, i, fwd) => {
	const opts = {
		"font-size":fwd ? "1.2em" : "1em",
		duration: "fast",
	}

 	el.animate(opts, ()=>{
 		setTimeout(
 			()=> animate(el, i, !fwd),
 			0,
 			)

 			
	})
}

$("svg text").each((i, el) => {
	el = $(el);

	setTimeout(
		()=> animate(el, i, true),
	+el.attr("x")
		// (i%20)*100,
		)
})

})