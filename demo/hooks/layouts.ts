import createPersistedState from 'use-persisted-state';

const useLayoutState = createPersistedState('layouts');

export default function useLayouts() {
    const [layouts, updateLayouts] = useLayoutState([]);
    return { layouts, add: (snapshot) => updateLayouts([...layouts, snapshot]), remove: (snapshot) => updateLayouts(layouts.filter(x => x !== snapshot))};
}