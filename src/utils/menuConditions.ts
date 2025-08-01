import { Role } from '@sendbird/chat';
import type { UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType, isFailedMessage, isPendingMessage, isSentMessage, isUserMessage } from '.';

export const isReplyTypeMessageEnabled = ({ channel, message }) => {
  if (isFailedMessage(message) || isPendingMessage(message)) {
    return false;
  }
  if (!channel?.isGroupChannel?.() || channel?.isEphemeral) {
    return false;
  }
  const isBroadcast = (channel as GroupChannel)?.isBroadcast;
  const isOperator = channel?.myRole === Role.OPERATOR;
  if (isBroadcast) return isOperator;
  return true;
};

export interface MenuConditionsParams {
  message: SendableMessageType;
  channel: GroupChannel | OpenChannel;
  isByMe: boolean;
  replyType: string;
  onMoveToParentMessage?: (() => void) | null;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
}

export const showMenuItemCopy = ({ message }: MenuConditionsParams) => {
  return isUserMessage(message as UserMessage);
};

export const showMenuItemEdit = ({ message, channel, isByMe }: MenuConditionsParams) => {
  return (!channel?.isEphemeral && isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
};

export const showMenuItemResend = ({ message, isByMe }: MenuConditionsParams) => {
  return (isFailedMessage(message) && message?.isResendable && isByMe);
};

export const showMenuItemDelete = ({ message, channel, isByMe }: MenuConditionsParams) => {
  return !channel?.isEphemeral && !isPendingMessage(message) && isByMe;
};

export const showMenuItemOpenInChannel = ({ onMoveToParentMessage = undefined }: MenuConditionsParams) => {
  return !!onMoveToParentMessage;
};

export const showMenuItemReply = ({ channel, message, replyType }: MenuConditionsParams) => {
  return isReplyTypeMessageEnabled({ channel, message }) && replyType === 'QUOTE_REPLY';
};

export const showMenuItemThread = ({ channel, message, replyType, onReplyInThread }: MenuConditionsParams) => {
  return isReplyTypeMessageEnabled({ channel, message }) && replyType === 'THREAD' && !message?.parentMessageId && typeof onReplyInThread === 'function';
};

export const showMenuItemMarkAsUnread = ({ message, channel, replyType }: MenuConditionsParams) => {
  return !isFailedMessage(message) && !isPendingMessage(message) && channel?.isGroupChannel?.() && replyType !== 'THREAD';
};
