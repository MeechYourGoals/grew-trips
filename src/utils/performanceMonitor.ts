class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  measure(label: string, fn: () => void) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
  }

  async measureAsync(label: string, fn: () => Promise<void>) {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
  }

  getMetrics(label: string) {
    const measurements = this.metrics.get(label) || [];
    if (measurements.length === 0) return null;

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return { avg, min, max, count: measurements.length };
  }

  logMetrics() {
    console.group('Performance Metrics');
    this.metrics.forEach((_, label) => {
      const metrics = this.getMetrics(label);
      if (metrics) {
        console.log(`${label}:`, {
          avg: `${metrics.avg.toFixed(2)}ms`,
          min: `${metrics.min.toFixed(2)}ms`,
          max: `${metrics.max.toFixed(2)}ms`,
          count: metrics.count,
        });
      }
    });
    console.groupEnd();
  }

  clear() {
    this.metrics.clear();
  }

  // Monitor FPS
  monitorFPS(callback: (fps: number) => void) {
    let lastTime = performance.now();
    let frames = 0;

    const tick = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        callback(fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}

export const performanceMonitor = new PerformanceMonitor();
