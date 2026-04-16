import { useEffect, useRef } from 'preact/hooks'

/**
 * Dismiss handler for floating UI: closes on outside mousedown or Escape key.
 * Pass all refs that should be considered "inside" (e.g. panel + trigger).
 *
 * Uses composedPath() so it works correctly inside Shadow DOM, and registers
 * in the capture phase so stopPropagation() in bubble-phase handlers
 * (e.g. modal overlays) doesn't block detection.
 */
export function useClickOutsideEscape(
	refs: ReadonlyArray<{ readonly current: HTMLElement | null }>,
	isOpen: boolean,
	onClose: () => void,
): void {
	// Store refs and onClose in a ref so the effect never needs to re-register
	// when the caller creates a new array (e.g. from spreading exemptRefs).
	// The actual .current values of each ref are read at event time, not capture time.
	const stableRefs = useRef(refs)
	stableRefs.current = refs
	const stableOnClose = useRef(onClose)
	stableOnClose.current = onClose

	useEffect(() => {
		if (!isOpen) return
		const onMouseDown = (e: MouseEvent) => {
			const path = e.composedPath()
			for (const ref of stableRefs.current) {
				if (ref.current && path.includes(ref.current)) return
			}
			stableOnClose.current()
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') stableOnClose.current()
		}
		document.addEventListener('mousedown', onMouseDown, true)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onMouseDown, true)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [isOpen])
}
