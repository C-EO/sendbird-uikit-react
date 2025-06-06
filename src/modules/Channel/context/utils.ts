import React from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import format from 'date-fns/format';

import { CoreMessageType, SendableMessageType } from '../../../utils';
import { BaseMessage, SendingStatus } from '@sendbird/chat/message';
import { useLocalization } from '../../../lib/LocalizationContext';

export const scrollToRenderedMessage = (
  scrollRef: React.RefObject<HTMLElement>,
  initialTimeStamp: number,
  setIsScrolled?: (val: boolean) => void,
) => {
  try {
    const container = scrollRef.current;
    // scroll into the message with initialTimeStamp
    const element = container?.querySelectorAll(`[data-sb-created-at="${initialTimeStamp}"]`)?.[0];
    if (container && element instanceof HTMLElement) {
      // Set the scroll position of the container to bring the element to the top
      container.scrollTop = element.offsetTop;
    }
  } catch {
    // do nothing
  } finally {
    setIsScrolled?.(true);
  }
};

/* eslint-disable default-param-last */
export const scrollIntoLast = (
  initialTry = 0,
  scrollRef: React.RefObject<HTMLElement>,
  setIsScrolled?: (val: boolean) => void,
) => {
  const MAX_TRIES = 10;
  const currentTry = initialTry;
  if (currentTry > MAX_TRIES) {
    setIsScrolled?.(true);
    return;
  }
  try {
    const scrollDOM = scrollRef?.current || document.querySelector('.sendbird-conversation__messages-padding');
    if (scrollDOM) scrollDOM.scrollTop = scrollDOM.scrollHeight;
    setIsScrolled?.(true);
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1, scrollRef, setIsScrolled);
    }, 500 * currentTry);
  }
};

export const isOperator = (groupChannel?: GroupChannel) => {
  const myRole = groupChannel?.myRole;
  return myRole === 'operator';
};

export const isDisabledBecauseFrozen = (groupChannel?: GroupChannel | null) => {
  const isFrozen = groupChannel?.isFrozen;
  return isFrozen && !isOperator(groupChannel);
};

export const isDisabledBecauseMuted = (groupChannel?: GroupChannel | null) => {
  const myMutedState = groupChannel?.myMutedState;
  return myMutedState === 'muted';
};

export const getAllEmojisMapFromEmojiContainer = (emojiContainer: EmojiContainer) => {
  const { emojiCategories = [] } = emojiContainer;
  const allEmojisMap = new Map();

  for (let categoryIndex = 0; categoryIndex < emojiCategories.length; categoryIndex += 1) {
    const { emojis } = emojiCategories[categoryIndex];
    for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex += 1) {
      const { key, url } = emojis[emojiIndex];
      allEmojisMap.set(key, url);
    }
  }
  return allEmojisMap;
};

export const getNicknamesMapFromMembers = (members: Member[] = []) => {
  const nicknamesMap = new Map<string, string>();
  for (let memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
    const { userId, nickname } = members[memberIndex];
    nicknamesMap.set(userId, nickname);
  }
  return nicknamesMap;
};

const getUniqueListBy = <T>(arr: T[], key: keyof T): T[] => {
  const entries = arr.map((item) => [item[key], item] as [T[keyof T], T]);
  return Array.from(new Map(entries).values());
};
const getUniqueListByMessageId = (arr: BaseMessage[]) => {
  return getUniqueListBy(arr, 'messageId');
};
const sortByCreatedAt = (messages: BaseMessage[]) => {
  return messages.sort((a, b) => a.createdAt - b.createdAt);
};

export const mergeAndSortMessages = (oldMessages: BaseMessage[], newMessages: BaseMessage[]) => {
  const lastOldMessage = oldMessages[oldMessages.length - 1];
  const firstNewMessage = newMessages[0];
  // If the last message of oldMessages is older than the first message of newMessages,
  // then we can safely append newMessages to oldMessages.
  if (lastOldMessage?.createdAt < firstNewMessage?.createdAt) {
    return [...oldMessages, ...newMessages];
  }

  // todo: optimize this
  // If the last message of oldMessages is newer than the first message of newMessages,
  // then we need to merge the two arrays and sort them by createdAt.
  const mergedMessages = [...oldMessages, ...newMessages];
  const unique = getUniqueListByMessageId(mergedMessages);
  return sortByCreatedAt(unique);
};

/**
 * @deprecated This function is deprecated and will be removed in the next major update.
 * Using this function may cause the violation of the rules of hooks.
 * Please use the `getMessageCreatedAt` function from the `@sendbird/uikit-react/utils` module instead.
 */
export const getMessageCreatedAt = (message: BaseMessage) => {
  const { stringSet } = useLocalization();
  return format(message.createdAt, stringSet.DATE_FORMAT__MESSAGE_CREATED_AT);
};

export const passUnsuccessfullMessages = (
  allMessages: (CoreMessageType | SendableMessageType)[],
  newMessage: CoreMessageType | SendableMessageType,
) => {
  if (
    'sendingStatus' in newMessage
    && (newMessage.sendingStatus === SendingStatus.SUCCEEDED || newMessage.sendingStatus === SendingStatus.PENDING)
  ) {
    const lastIndexOfSucceededMessage = allMessages
      .map((message) => {
        if ('sendingStatus' in message && message.sendingStatus) return message.sendingStatus;
        return message.isAdminMessage() ? SendingStatus.SUCCEEDED : null;
      })
      .lastIndexOf(SendingStatus.SUCCEEDED);

    if (lastIndexOfSucceededMessage + 1 < allMessages.length) {
      const messages = [...allMessages];
      messages.splice(lastIndexOfSucceededMessage + 1, 0, newMessage);
      return messages;
    }
  }
  return [...allMessages, newMessage];
};

export const pxToNumber = (px: string | number) => {
  if (typeof px === 'number') {
    return px;
  }
  if (typeof px === 'string') {
    const parsed = Number.parseFloat(px);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};

export const isAboutSame = (a: number, b: number, px: number) => {
  return Math.abs(a - b) <= px;
};
