function toggleListDropdown(button) {
	const menu = button.nextElementSibling;

	if (menu && menu.classList.contains("dropdownDotsHorizontal")) {
		menu.classList.toggle("hidden");

		document.addEventListener("click", function handleClickOutside(event) {
			if (!menu.contains(event.target) && !button.contains(event.target)) {
				menu.classList.add("hidden");
				document.removeEventListener("click", handleClickOutside);
			}
		});
	}
}
