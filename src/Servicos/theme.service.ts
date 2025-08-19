import { Injectable } from '@angular/core';

type PrimeTheme = 'lara-light-blue' | 'lara-dark-blue';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private linkId = 'primeng-theme';
	private storageKey = 'primeng_theme';

	init(): void {
		const saved = (typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null) as PrimeTheme | null;
		if (saved) {
			this.setTheme(saved);
		}
	}

	setTheme(theme: PrimeTheme): void {
		const link = document.getElementById(this.linkId) as HTMLLinkElement | null;
		if (!link) return;
		link.href = `/assets/primeng-themes/${theme}/theme.css`;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(this.storageKey, theme);
		}
	}

	toggle(): void {
		const current = (typeof localStorage !== 'undefined' ? (localStorage.getItem(this.storageKey) as PrimeTheme) : null) || 'lara-light-blue';
		const next: PrimeTheme = current === 'lara-light-blue' ? 'lara-dark-blue' : 'lara-light-blue';
		this.setTheme(next);
	}

	isDark(): boolean {
		return (typeof localStorage !== 'undefined' ? (localStorage.getItem(this.storageKey) as PrimeTheme) : null) === 'lara-dark-blue';
	}
}
