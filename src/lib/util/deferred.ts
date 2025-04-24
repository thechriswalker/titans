export type Deferral<T> = {
    readonly promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error?: any) => void;
}


export function deferred<T>(): Deferral<T> {
    let resolve: (value: T) => void;
    let reject: (error?: any) => void;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return { promise, resolve: resolve!, reject: reject! };
}


export function pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}