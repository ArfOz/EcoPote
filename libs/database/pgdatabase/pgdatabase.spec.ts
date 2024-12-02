import { pgdatabase } from './lib/pgdatabase';

describe('pgdatabase', () => {
  it('should work', () => {
    expect(pgdatabase()).toEqual('pgdatabase');
  });
});
