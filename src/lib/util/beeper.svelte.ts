import { browser } from "$app/environment";

let muted = $state(!browser);

if (browser) {
    muted = (localStorage.getItem("titans:emom:sound")) === "true";
}

async function loadSound() {
    const res = await fetch("/timer_beep.mp3");
    return await res.arrayBuffer();
}

type Player = {
    ctx: AudioContext;
    buf: AudioBuffer;
}

let player: Player | null = null;

export async function initAudioContext() {
    if (player) {
        return;
    }
    try {
        const ctx = new AudioContext();
        const buf = await new Promise<AudioBuffer>(async resolve => {
            ctx.decodeAudioData(await loadSound(), b => resolve(b));
        });
        player = { ctx, buf };
    } catch (e) {
        console.error("AudioContext not supported");
    }
}


export function toggleMute() {
    if (!browser) {
        muted = true;
        return;
    }
    muted = !muted;
    if (muted) {
        localStorage.setItem("titans:emom:sound", "true");
    } else {
        localStorage.removeItem("titans:emom:sound");
    }
}

export function beep() {
    if (muted || !player) {
        return;
    }
    const source = player.ctx.createBufferSource();
    source.buffer = player.buf;
    source.connect(player.ctx.destination);
    source.start();
}

export function isMuted() {
    return muted;
}