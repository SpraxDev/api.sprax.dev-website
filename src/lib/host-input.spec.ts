import { describe, expect, it } from 'vitest';
import { parseHostInput } from './host-input';

describe('parseHostInput', () => {
  it('parses a plain hostname without port', () => {
    expect(parseHostInput('mc-auth.com')).toEqual({ host: 'mc-auth.com' });
  });

  it('extracts an explicit port — including the default 25565', () => {
    expect(parseHostInput('mc-auth.com:25565')).toEqual({ host: 'mc-auth.com', port: 25565 });
    expect(parseHostInput('mc.example.org:1337')).toEqual({ host: 'mc.example.org', port: 1337 });
  });

  it('never treats a bare IPv6 address as host:port', () => {
    expect(parseHostInput('2001:db8::1')).toEqual({ host: '2001:db8::1' });
    expect(parseHostInput('::1')).toEqual({ host: '::1' });
  });

  it('parses bracketed IPv6 with and without port', () => {
    expect(parseHostInput('[2001:db8::1]:25565')).toEqual({ host: '2001:db8::1', port: 25565 });
    expect(parseHostInput('[2001:db8::1]')).toEqual({ host: '2001:db8::1' });
  });

  it('parses IPv4 with port', () => {
    expect(parseHostInput('127.0.0.1:25565')).toEqual({ host: '127.0.0.1', port: 25565 });
  });

  it('ignores out-of-range or non-numeric ports', () => {
    expect(parseHostInput('mc.example.org:0')).toEqual({ host: 'mc.example.org' });
    expect(parseHostInput('mc.example.org:99999')).toEqual({ host: 'mc.example.org' });
    expect(parseHostInput('mc.example.org:abc')).toEqual({ host: 'mc.example.org:abc' });
  });

  it('trims surrounding whitespace', () => {
    expect(parseHostInput('  mc-auth.com:25565  ')).toEqual({ host: 'mc-auth.com', port: 25565 });
  });
});
