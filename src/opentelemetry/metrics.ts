import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';

// Expose metrics directly to Prometheus Backend
const metricExporter = new PrometheusExporter();

export const meterProvider = new MeterProvider({ readers: [metricExporter] });
