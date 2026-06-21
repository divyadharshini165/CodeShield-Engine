/**
 * Daily coding streak utilities.
 *
 * The streak is tracked using a simple UTC "YYYY-MM-DD" date string rather
 * than raw Date math, which sidesteps timezone/DST edge cases when
 * comparing "is this the same day?" / "is this the very next day?".
 */

/**
 * Returns the current UTC date as a YYYY-MM-DD string.
 * @param {Date} [date] - defaults to now
 */
function toDateString(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

/**
 * Returns the number of whole days between two YYYY-MM-DD date strings
 * (b - a), using UTC midnight for both so DST never skews the diff.
 */
function dayDiff(aDateString, bDateString) {
    const a = new Date(`${aDateString}T00:00:00.000Z`);
    const b = new Date(`${bDateString}T00:00:00.000Z`);
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/**
 * Computes the next { currentStreak, longestStreak, lastSolvedDate } given
 * a user's existing streak state and the date of a new Accepted submission.
 *
 * Rules:
 *  - First-ever solve: streak starts at 1.
 *  - Same calendar day as the last solve: streak is unchanged (don't
 *    double-count multiple accepted submissions in one day).
 *  - Exactly one day after the last solve: streak increments by 1.
 *  - More than one day after the last solve (a missed day): streak resets to 1.
 *  - A solve dated *before* lastSolvedDate (clock skew/backfill) is treated
 *    as a no-op on the streak to avoid corrupting it.
 *
 * @param {{ currentStreak: number, longestStreak: number, lastSolvedDate: string|null }} user
 * @param {Date} [solvedAt] - defaults to now
 */
function computeStreakUpdate(user, solvedAt = new Date()) {
    const today = toDateString(solvedAt);
    const prevStreak = user.currentStreak || 0;
    const prevLongest = user.longestStreak || 0;
    const lastDate = user.lastSolvedDate || null;

    let nextStreak;

    if (!lastDate) {
        nextStreak = 1;
    } else {
        const diff = dayDiff(lastDate, today);
        if (diff === 0) {
            nextStreak = prevStreak || 1; // same day, unchanged (guard against 0 from legacy data)
        } else if (diff === 1) {
            nextStreak = prevStreak + 1; // consecutive day
        } else if (diff > 1) {
            nextStreak = 1; // missed at least one day -- reset
        } else {
            // diff < 0: solvedAt is earlier than the recorded last solve date
            // (e.g. backfilled or out-of-order data) -- don't mutate the streak.
            return { currentStreak: prevStreak, longestStreak: prevLongest, lastSolvedDate: lastDate };
        }
    }

    return {
        currentStreak: nextStreak,
        longestStreak: Math.max(prevLongest, nextStreak),
        lastSolvedDate: today
    };
}

module.exports = { computeStreakUpdate, toDateString, dayDiff };
