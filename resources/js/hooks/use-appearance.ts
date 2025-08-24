import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

function getSystemAppearance() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getAppliedAppearance(appearance: Appearance): 'light' | 'dark' {
    return appearance === 'system' ? getSystemAppearance() : appearance;
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const update = useCallback((newAppearance: Appearance) => {
        const appliedAppearance = getAppliedAppearance(newAppearance);

        // Update the HTML class
        if (appliedAppearance === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Store the preference
        localStorage.setItem('appearance', newAppearance);
        setAppearance(newAppearance);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem('appearance') as Appearance | null;
        update(stored || 'system');

        if ((stored || 'system') === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handle = () => update('system');
            mediaQuery.addEventListener('change', handle);
            return () => mediaQuery.removeEventListener('change', handle);
        }
    }, [update]);

    return [appearance, update] as const;
}

export function initializeTheme() {
    try {
        const stored = localStorage.getItem('appearance') as Appearance | null;
        const appearance = stored || 'system';
        const appliedAppearance = getAppliedAppearance(appearance);

        if (appliedAppearance === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Set a default cookie if none exists
        if (!document.cookie.includes('appearance')) {
            document.cookie = `appearance=${appearance};path=/;max-age=31536000`;
        }
    } catch (error) {
        console.error('Error initializing theme:', error);
    }
}
