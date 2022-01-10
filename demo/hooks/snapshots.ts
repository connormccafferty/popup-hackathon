import createPersistedState from 'use-persisted-state';

const useSnapshotState = createPersistedState('snapshots');

export default function useSnapshots() {
    const [snapshots, updateSnapshots] = useSnapshotState([]);
    return { snapshots, add: (snapshot) => updateSnapshots([...snapshots, snapshot]), remove: (snapshot) => updateSnapshots(snapshots.filter(x => x !== snapshot))};
}