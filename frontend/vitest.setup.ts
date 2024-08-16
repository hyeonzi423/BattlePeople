// vitest-setup.ts
import * as matchers from '@testing-library/jest-dom/matchers';

import { beforeAll, afterEach, afterAll, expect } from 'vitest';
import { server } from './src/mocks/server';

expect.extend(matchers);

if (process.env.NODE_ENV === 'test') {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}