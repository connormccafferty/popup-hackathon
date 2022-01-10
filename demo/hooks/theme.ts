import { useEffect } from 'react';
import createPersistedState from 'use-persisted-state';
const LIGHT_THEME = 'light-theme';
const DARK_THEME = 'dark';
const useThemeState = createPersistedState('theme');
import { fin } from 'openfin-adapter/src/mock';

const setRealTheme = async (theme) => {
    const root = document.documentElement;

    if (theme === LIGHT_THEME) {
        root.classList.add(LIGHT_THEME);

    } else {
        root.classList.remove(LIGHT_THEME);
    }

    const context = await fin.Platform.getCurrentSync().getWindowContext() || {};
    if (context.theme !== theme) {
        fin.Platform.getCurrentSync().setWindowContext({ theme });
    }
};


export default function useTheme() {
    const [theme, setTheme] = useThemeState(DARK_THEME);
    useEffect(() => {
        setRealTheme(theme);
    });
    return { theme, toggleTheme: () => theme === DARK_THEME ? setTheme(LIGHT_THEME) : setTheme(DARK_THEME) };
};