import type { CommonUIKitConfigProps, UIKitOptions } from '../../Sendbird/types';
import { getCaseResolvedReplyType } from '../resolvedReplyType';
import { uikitConfigMapper } from '../uikitConfigMapper';

const mockLegacyConfig = {
  // common related
  disableUserProfile: false,
  // group channel related
  isMentionEnabled: true,
  replyType: 'THREAD',
  isReactionEnabled: true,
  isVoiceMessageEnabled: true,
  // group channel list related
  isTypingIndicatorEnabledOnChannelList: true,
  isMessageReceiptStatusEnabledOnChannelList: true,
  // group channel setting related
  showSearchIcon: true,
} as CommonUIKitConfigProps;

describe('uikitConfigMapper', () => {
  it('should correctly map legacy configs to each corresponding uikitOptions', () => {
    const result = uikitConfigMapper({ legacyConfig: mockLegacyConfig });

    expect(result.common?.enableUsingDefaultUserProfile).toBe(true);
    expect(result.groupChannel?.enableMention).toBe(true);
    expect(result.groupChannel?.enableReactions).toBe(true);
    expect(result.groupChannel?.replyType).toBe(getCaseResolvedReplyType('THREAD').lowerCase);
    expect(result.groupChannel?.enableVoiceMessage).toBe(true);
    expect(result.groupChannelList?.enableMessageReceiptStatus).toBe(true);
    expect(result.groupChannelList?.enableTypingIndicator).toBe(true);
    expect(result.groupChannelSettings?.enableMessageSearch).toBe(true);
  });

  it('should return new uikitOptions too whichs are not existing in legacy configs', () => {
    const result = uikitConfigMapper({ legacyConfig: mockLegacyConfig });

    expect(result).toHaveProperty('groupChannel.enableOgtag');
    expect(result).toHaveProperty('groupChannel.enableTypingIndicator');
    expect(result).toHaveProperty('groupChannel.threadReplySelectType');
    expect(result).toHaveProperty('groupChannel.input.enableDocument');
    expect(result).toHaveProperty('groupChannel.enableMarkAsUnread');

    expect(result).toHaveProperty('openChannel.enableOgtag');
    expect(result).toHaveProperty('openChannel.input.enableDocument');
  });
  it('should return the correct result; uikitOptions takes predecence over legacy configs', () => {
    const legacyConfig = {
      isMentionEnabled: true,
      showSearchIcon: true,
    };
    const uikitOptions = {
      groupChannel: {
        enableMention: false,
        enableMarkAsUnread: true,
      },
      groupChannelSettings: {
        enableMessageSearch: false,
      },
    } as UIKitOptions;
    const result = uikitConfigMapper({ legacyConfig, uikitOptions });

    expect(result.groupChannel?.enableMention).toBe(false);
    expect(result.groupChannel?.enableMarkAsUnread).toBe(true);
    expect(result.groupChannelSettings?.enableMessageSearch).toBe(false);
  });
  it('should return true <-> false flipped result for disableUserProfile when its converted into enableUsingDefaultUserProfile', () => {
    expect(
      uikitConfigMapper({ legacyConfig: { disableUserProfile: false } })
        .common?.enableUsingDefaultUserProfile,
    ).toBe(true);
    expect(
      uikitConfigMapper({ legacyConfig: { disableUserProfile: undefined } })
        .common?.enableUsingDefaultUserProfile,
    ).toBe(undefined);
    expect(
      uikitConfigMapper({ legacyConfig: { disableUserProfile: true } })
        .common?.enableUsingDefaultUserProfile,
    ).toBe(false);
  });
  it('should correctly handle enableMarkAsUnread from uikitOptions', () => {
    const uikitOptions = {
      groupChannel: {
        enableMarkAsUnread: true,
      },
    } as UIKitOptions;
    const result = uikitConfigMapper({ legacyConfig: mockLegacyConfig, uikitOptions });

    expect(result.groupChannel?.enableMarkAsUnread).toBe(true);
  });
});
