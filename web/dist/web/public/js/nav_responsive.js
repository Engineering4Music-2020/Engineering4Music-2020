function toggleNavbar() {
	var x = document.getElementById("myTopnav");
	if (x.className === "nav-responsive") {
		x.className += " responsive";
	} else {
		x.className = "nav-responsive";
	}
}
