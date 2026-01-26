import { ConfigService } from '@nestjs/config';
import { Resource } from '@opentelemetry/resources';
import OpenTelemetry from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  BasicTracerProvider,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

const configService: ConfigService = new ConfigService<
  Record<string, unknown>,
  false
>();

// Configure the OTLP Trace Exporter (for Tempo via Collector)
// Tempo typically accepts OTLP over gRPC.
const traceExporter: OpenTelemetry.node.SpanExporter = new OTLPTraceExporter({
  url:
    configService.get<string>('opentelemtry.trace.http') ||
    'http://otel-collector:4318/v1/traces',
});

export const spanProcessors = [
  // BatchSpanProcessor is recommended for production as it batches spans before sending.
  new BatchSpanProcessor(traceExporter),

  // For debugging, you can add a ConsoleSpanExporter to see spans in your app's console
  // new SimpleSpanProcessor(new ConsoleSpanExporter()),
];

export function createTraceProvider(
  resource: Resource,
  exporter: OpenTelemetry.node.SpanExporter = traceExporter,
): BasicTracerProvider | NodeTracerProvider {
  const traceProvider: BasicTracerProvider = new BasicTracerProvider({
    resource: resource,
    spanProcessors: [
      // BatchSpanProcessor is recommended for production as it batches spans before sending.
      new BatchSpanProcessor(exporter),

      // For debugging, you can add a ConsoleSpanExporter to see spans in your app's console
      // new SimpleSpanProcessor(new ConsoleSpanExporter()),
    ],
  });

  // const traceProvider: NodeTracerProvider = new NodeTracerProvider({
  //   resource: resource,
  //   spanProcessors: [
  //     new SimpleSpanProcessor(exporter),
  //     new SimpleSpanProcessor(new ConsoleSpanExporter()),
  //   ],
  // });

  return traceProvider;
}
