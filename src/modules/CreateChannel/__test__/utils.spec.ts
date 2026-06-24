import { isBroadcastChannelEnabled, isSuperGroupChannelEnabled } from '../utils';
import type { SdkStore } from '../../../lib/Sendbird/types';

type Sdk = SdkStore['sdk'];

interface MockAppInfo {
  applicationAttributes?: string[];
  premiumFeatureList?: string[];
}

const mockSdk = (appInfo: MockAppInfo | null): Sdk => ({ appInfo } as unknown as Sdk);
const noSdk = undefined as unknown as Sdk;

describe('CreateChannel/utils: isSuperGroupChannelEnabled reads premiumFeatureList', () => {
  it('returns true when premiumFeatureList includes super_group_channel', () => {
    expect(isSuperGroupChannelEnabled(mockSdk({ premiumFeatureList: ['delivery_receipt', 'super_group_channel'] }))).toBe(true);
  });

  it('returns false when premiumFeatureList does not include super_group_channel', () => {
    expect(isSuperGroupChannelEnabled(mockSdk({ premiumFeatureList: ['delivery_receipt'] }))).toBe(false);
  });

  it('returns false for an empty premiumFeatureList', () => {
    expect(isSuperGroupChannelEnabled(mockSdk({ premiumFeatureList: [] }))).toBe(false);
  });

  it('returns false when premiumFeatureList is missing', () => {
    expect(isSuperGroupChannelEnabled(mockSdk({}))).toBe(false);
  });

  it('returns false when appInfo is null', () => {
    expect(isSuperGroupChannelEnabled(mockSdk(null))).toBe(false);
  });

  it('returns false when sdk is undefined', () => {
    expect(isSuperGroupChannelEnabled(noSdk)).toBe(false);
  });

  it('no longer reads the deprecated allow_super_group_channel applicationAttributes flag', () => {
    expect(isSuperGroupChannelEnabled(mockSdk({ applicationAttributes: ['allow_super_group_channel'], premiumFeatureList: [] }))).toBe(false);
  });
});

describe('CreateChannel/utils: isBroadcastChannelEnabled still reads applicationAttributes', () => {
  it('returns true when applicationAttributes includes allow_broadcast_channel', () => {
    expect(isBroadcastChannelEnabled(mockSdk({ applicationAttributes: ['allow_broadcast_channel'] }))).toBe(true);
  });

  it('returns false when applicationAttributes does not include allow_broadcast_channel', () => {
    expect(isBroadcastChannelEnabled(mockSdk({ applicationAttributes: ['allow_super_group_channel'] }))).toBe(false);
  });

  it('returns false for an empty applicationAttributes', () => {
    expect(isBroadcastChannelEnabled(mockSdk({ applicationAttributes: [] }))).toBe(false);
  });

  it('returns false when applicationAttributes is missing', () => {
    expect(isBroadcastChannelEnabled(mockSdk({}))).toBe(false);
  });

  it('returns false when appInfo is null', () => {
    expect(isBroadcastChannelEnabled(mockSdk(null))).toBe(false);
  });

  it('returns false when sdk is undefined', () => {
    expect(isBroadcastChannelEnabled(noSdk)).toBe(false);
  });

  it('does not read broadcast_channel from premiumFeatureList', () => {
    expect(isBroadcastChannelEnabled(mockSdk({ premiumFeatureList: ['broadcast_channel'], applicationAttributes: [] }))).toBe(false);
  });
});
