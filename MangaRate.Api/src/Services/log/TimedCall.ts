export class TimedCall {
    private begin: [number, number];
    private last_time: [number, number];
    
    constructor() {
        this.begin = process.hrtime();
        this.last_time = process.hrtime();
    }

    /**
     * Return time in seconds since last call as a string with 3 digits precision
     */
    public getTimeSinceLastCall(): string {
        const stop_time = process.hrtime(this.last_time);
        this.last_time = process.hrtime();
        return ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
    }

    /**
     * Return time in seconds since object creation as a string with 3 digits precision.
     * Does not count for Last Call.
     */
    public getTimeSinceStart(): string {
        const stop_time = process.hrtime(this.begin);
        return ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
    }

    /**
     * Reset beginning time (and last time called).
     */
    public resetStartTime(): void {
        this.begin = process.hrtime();
        this.last_time = process.hrtime();
    }
}