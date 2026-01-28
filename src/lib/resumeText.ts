export function generateTextResumeTitle(content: string): string {
	const lines = content.split(/\r?\n/).map((l) => l.trim());
	const firstNonEmptyLine = lines.find(Boolean) ?? '';

	const fallback = content.replace(/\s+/g, ' ').trim();
	let base = firstNonEmptyLine || fallback || 'Text Resume';

	// Keep it short and readable
	const MAX = 40;
	if (base.length > MAX) {
		base = base.slice(0, MAX).trimEnd();
	}

	// Match backend example style when possible
	if (/resume/i.test(base)) return `${base} (Text)`;
	return `${base} - Resume (Text)`;
}
