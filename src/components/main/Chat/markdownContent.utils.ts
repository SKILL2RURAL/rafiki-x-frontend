export function enhanceMarkdownContainer(container: HTMLElement | null) {
	if (!container) return;

	// Find all tables that are not already wrapped
	const tables = container.querySelectorAll('table:not(.table-wrapped)');
	tables.forEach((table) => {
		// Check if table is already wrapped
		if (table.parentElement?.classList.contains('table-wrapper')) {
			table.classList.add('table-wrapped');
			return;
		}

		const wrapper = document.createElement('div');
		wrapper.className = 'table-wrapper overflow-x-auto w-full';
		table.parentNode?.insertBefore(wrapper, table);
		wrapper.appendChild(table);
		table.classList.add('table-wrapped');
	});

	// Add smooth scrolling for anchor links (only add listener if not already added)
	container.querySelectorAll('a[href^="#"]:not([data-smooth-scroll])').forEach((anchor) => {
		anchor.setAttribute('data-smooth-scroll', 'true');
		anchor.addEventListener('click', (e) => {
			e.preventDefault();
			const target = document.querySelector(anchor.getAttribute('href')!);
			target?.scrollIntoView({ behavior: 'smooth' });
		});
	});
}
