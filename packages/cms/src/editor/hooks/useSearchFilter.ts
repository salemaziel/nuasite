import { useMemo, useRef } from 'preact/hooks'

/**
 * Filter a list of items by a search query.
 * The `getSearchableText` callback returns the text to match against (e.g. `o => \`${o.label} ${o.value}\``).
 * Uses a ref internally so callers don't need to memoize the callback.
 */
export function useSearchFilter<T>(
	items: T[],
	query: string,
	getSearchableText: (item: T) => string,
): T[] {
	const fnRef = useRef(getSearchableText)
	fnRef.current = getSearchableText

	return useMemo(() => {
		if (!query) return items
		const q = query.toLowerCase()
		return items.filter(item => fnRef.current(item).toLowerCase().includes(q))
	}, [items, query])
}
