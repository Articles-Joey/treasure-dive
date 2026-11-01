// Socket JSON creates fresh objects even for unchanged data. Preserve those
// branches so Zustand subscribers only render when their selected data changes.
export default function shareSnapshot(previous, next) {
    if (Object.is(previous, next)) return previous;
    if (
        !previous ||
        !next ||
        typeof previous !== "object" ||
        typeof next !== "object" ||
        Array.isArray(previous) !== Array.isArray(next)
    )
        return next;
    const keys = Object.keys(next);
    let unchanged = Object.keys(previous).length === keys.length;
    const shared = Array.isArray(next) ? [] : {};
    for (const key of keys) {
        shared[key] = shareSnapshot(previous[key], next[key]);
        if (!Object.hasOwn(previous, key) || shared[key] !== previous[key])
            unchanged = false;
    }
    return unchanged ? previous : shared;
}
