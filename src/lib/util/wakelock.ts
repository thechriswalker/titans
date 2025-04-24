let wakeLock: Promise<WakeLockSentinel | null> | null = null;

export async function acquireWakeLock() {
    if (!wakeLock) {
        wakeLock = acquire();
    }
    await wakeLock;
}

export async function releaseWakeLock() {
    try {
        (await wakeLock)?.release();
    } catch (e) {
        console.error('Failed to release wake lock', e);
    }
    wakeLock = null;
}

async function acquire() {
    if ('wakeLock' in navigator) {
        try {
            const lock = await navigator.wakeLock.request('screen');
            return lock;
        } catch (e) {
            // don't fail though...
            console.error('Failed to acquire wake lock', e);
        }
    }
    return null;
}
