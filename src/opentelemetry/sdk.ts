import { ConfigService } from '@nestjs/config';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { createTraceProvider, spanProcessors } from './tracing';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Logger } from '@nestjs/common';
import { metrics, trace } from '@opentelemetry/api';
import { meterProvider } from './metrics';

const logger: Logger = new Logger();

const configService: ConfigService = new ConfigService<
  Record<string, unknown>,
  false
>();

const OTEL_SERVICE_RESOURCE = resourceFromAttributes({
  [ATTR_SERVICE_NAME]:
    configService.get<string>('app.name') || 'RentRedi_Backend',
});

const traceProvider = createTraceProvider(OTEL_SERVICE_RESOURCE);

trace.setGlobalTracerProvider(traceProvider);
metrics.setGlobalMeterProvider(meterProvider);

const otelSDK = new NodeSDK({
  resource: OTEL_SERVICE_RESOURCE,
  spanProcessors: spanProcessors,
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-amqplib': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-fs': { enabled: true },
      '@opentelemetry/instrumentation-nestjs-core': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
    }),
  ],
});

export default otelSDK;

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => logger.log('SDK shut down successfully'),
      (err) => logger.error('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
