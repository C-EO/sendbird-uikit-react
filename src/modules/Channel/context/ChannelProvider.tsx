import React, {
  useEffect,
  useState,
  useReducer,
  useRef,
  useMemo,
} from 'react';
import { UIKitConfigProvider, useUIKitConfig } from '@sendbird/uikit-tools';

import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import type {
  BaseMessage, FileMessage,
  FileMessageCreateParams,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
  MessageListParams as SDKMessageListParams,
} from '@sendbird/chat/message';
import type { EmojiContainer, SendbirdError, User } from '@sendbird/chat';

import { ReplyType, Nullable } from '../../../types';
import { UserProfileProvider, UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { ThreadReplySelectType } from './const';

import * as utils from './utils';
import { getIsReactionEnabled } from '../../../utils/getIsReactionEnabled';

import messagesInitialState from './dux/initialState';
import messagesReducer from './dux/reducers';
import * as channelActions from './dux/actionTypes';

import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useGetChannel from './hooks/useGetChannel';
import useInitialMessagesFetch from './hooks/useInitialMessagesFetch';
import useHandleReconnect from './hooks/useHandleReconnect';
import useScrollCallback from './hooks/useScrollCallback';
import useScrollDownCallback from './hooks/useScrollDownCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useSendMessageCallback from './hooks/useSendMessageCallback';
import useSendFileMessageCallback from './hooks/useSendFileMessageCallback';
import useToggleReactionCallback from './hooks/useToggleReactionCallback';
import useScrollToMessage from './hooks/useScrollToMessage';
import useSendVoiceMessageCallback from './hooks/useSendVoiceMessageCallback';
import { getCaseResolvedReplyType, getCaseResolvedThreadReplySelectType } from '../../../lib/utils/resolvedReplyType';
import { useSendMultipleFilesMessage } from './hooks/useSendMultipleFilesMessage';
import { useHandleChannelPubsubEvents } from './hooks/useHandleChannelPubsubEvents';
import { PublishingModuleType } from '../../internalInterfaces';
import { ChannelActionTypes } from './dux/actionTypes';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../lib/LocalizationContext';
import { uikitConfigStorage } from '../../../lib/utils/uikitConfigStorage';

export { ThreadReplySelectType } from './const'; // export for external usage

export interface MessageListParams extends Partial<SDKMessageListParams> { // make `prevResultSize` and `nextResultSize` to optional
  /** @deprecated It won't work even if you activate this props */
  reverse?: boolean;
}
export type ChannelQueries = {
  messageListParams?: MessageListParams;
};

export interface ChannelContextProps extends
  Pick<UserProfileProviderProps, 'disableUserProfile' | 'renderUserProfile'> {
  children?: React.ReactElement;
  channelUrl: string;
  isReactionEnabled?: boolean;
  isMessageGroupingEnabled?: boolean;
  isMultipleFilesMessageEnabled?: boolean;
  showSearchIcon?: boolean;
  animatedMessage?: number | null;
  highlightedMessage?: number | null;
  startingPoint?: number | null;
  onBeforeSendUserMessage?(text: string, quotedMessage?: SendableMessageType): UserMessageCreateParams;
  onBeforeSendFileMessage?(file: File, quotedMessage?: SendableMessageType): FileMessageCreateParams;
  onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams;
  onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
  onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
  onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
  onSearchClick?(): void;
  onBackClick?(): void;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  queries?: ChannelQueries;
  filterMessageList?(messages: BaseMessage): boolean;
  disableMarkAsRead?: boolean;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onMessageAnimated?: () => void;
  onMessageHighlighted?: () => void;
  scrollBehavior?: 'smooth' | 'auto';
  reconnectOnIdle?: boolean;
}

interface MessageStoreInterface {
  allMessages: CoreMessageType[];
  localMessages: CoreMessageType[];
  loading: boolean;
  initialized: boolean;
  /** @deprecated Please use `unreadSinceDate` instead * */
  unreadSince: string;
  unreadSinceDate: Date | null;
  isInvalid: boolean;
  currentGroupChannel: Nullable<GroupChannel>;
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: EmojiContainer;
  readStatus: any;
  typingMembers: Member[];
}

interface SendMessageParams {
  message: string;
  quoteMessage?: SendableMessageType;
  // mentionedUserIds?: string;
  mentionedUsers?: User[];
  mentionTemplate?: string;
}
interface UpdateMessageParams {
  messageId: number;
  message: string;
  mentionedUsers?: User[];
  mentionTemplate?: string;
}
export type SendMessageType = (params: SendMessageParams) => void;
export type UpdateMessageType = (props: UpdateMessageParams, callback?: (err: SendbirdError, message: UserMessage) => void) => void;

export interface ChannelProviderInterface extends ChannelContextProps, MessageStoreInterface {
  scrollToMessage(createdAt: number, messageId: number): void;
  isScrolled?: boolean;
  setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
  messageActionTypes: typeof channelActions;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  quoteMessage: SendableMessageType | null;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  initialTimeStamp: number | null | undefined;
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  animatedMessageId: number | null;
  highLightedMessageId: number | null | undefined;
  nicknamesMap: Map<string, string>;
  emojiAllMap: any;
  onScrollCallback: (callback: () => void) => void;
  onScrollDownCallback: (callback: (param: [BaseMessage[], null] | [null, unknown]) => void) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number | null>>;
  setHighLightedMessageId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  messageInputRef: React.RefObject<HTMLInputElement>,
  deleteMessage(message: CoreMessageType): Promise<void>,
  updateMessage: UpdateMessageType,
  resendMessage(failedMessage: SendableMessageType): void,
  // TODO: Good to change interface to using params / This part need refactoring
  sendMessage: SendMessageType,
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>,
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => Promise<FileMessage>,
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>,
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void,
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
}

const ChannelContext = React.createContext<ChannelProviderInterface | null>(null);

/**
 * @deprecated This provider is deprecated and will be removed in the next major update.
 * Please use the `GroupChannelProvider` from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
const ChannelProvider = (props: ChannelContextProps) => {
  const {
    channelUrl,
    children,
    isReactionEnabled,
    isMessageGroupingEnabled = true,
    isMultipleFilesMessageEnabled,
    showSearchIcon,
    animatedMessage,
    highlightedMessage,
    startingPoint,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeUpdateUserMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    onChatHeaderActionClick,
    onSearchClick,
    onBackClick,
    threadReplySelectType,
    queries,
    filterMessageList,
    disableMarkAsRead = false,
    onReplyInThread,
    onQuoteMessageClick,
    onMessageAnimated,
    onMessageHighlighted,
    scrollBehavior = 'auto',
    reconnectOnIdle = true,
  } = props;
  const { state: globalStore } = useSendbird();
  const { config } = globalStore;
  const replyType = props.replyType ?? getCaseResolvedReplyType(config.groupChannel.replyType).upperCase;
  const {
    pubSub,
    logger,
    userId,
    isOnline,
    imageCompression,
    markAsReadScheduler,
    groupChannel,
  } = config;
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const sdkInit = globalStore?.stores?.sdkStore?.initialized;
  const globalConfigs = globalStore?.config;
  const { configs: uikitConfig } = useUIKitConfig();

  const [initialTimeStamp, setInitialTimeStamp] = useState(startingPoint);
  useEffect(() => {
    setInitialTimeStamp(startingPoint);
  }, [startingPoint, channelUrl]);
  const [animatedMessageId, setAnimatedMessageId] = useState<number | null>(null);
  const [highLightedMessageId, setHighLightedMessageId] = useState(highlightedMessage);
  useEffect(() => {
    setHighLightedMessageId(highlightedMessage);
  }, [highlightedMessage]);
  const userFilledMessageListQuery = queries?.messageListParams;
  const [quoteMessage, setQuoteMessage] = useState<SendableMessageType | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const { stringSet } = useLocalization();
  const [messagesStore, messagesDispatcher] = useReducer(messagesReducer, { ...messagesInitialState, stringSet });
  const scrollRef = useRef<HTMLDivElement>(null);

  const isMentionEnabled = groupChannel.enableMention;

  const {
    allMessages,
    localMessages,
    loading,
    initialized,
    unreadSince,
    unreadSinceDate,
    isInvalid,
    currentGroupChannel,
    hasMorePrev,
    oldestMessageTimeStamp,
    hasMoreNext,
    latestMessageTimeStamp,
    emojiContainer,
    readStatus,
    typingMembers,
  } = messagesStore;

  const usingReaction = getIsReactionEnabled({
    channel: currentGroupChannel,
    config,
    moduleLevel: isReactionEnabled,
  });

  const emojiAllMap = useMemo(() => (
    usingReaction
      ? utils.getAllEmojisMapFromEmojiContainer(emojiContainer)
      : new Map()
  ), [emojiContainer]);
  const nicknamesMap: Map<string, string> = useMemo(() => (
    (usingReaction && currentGroupChannel)
      ? utils.getNicknamesMapFromMembers(currentGroupChannel?.members)
      : new Map()
  ), [currentGroupChannel?.members]);

  // Animate message
  useEffect(() => {
    if (animatedMessage) {
      setAnimatedMessageId(animatedMessage);
    }
  }, [animatedMessage]);

  // Scrollup is default scroll for channel
  const onScrollCallback = useScrollCallback({
    currentGroupChannel,
    oldestMessageTimeStamp,
    userFilledMessageListQuery,
    replyType,
  }, {
    hasMorePrev,
    logger,
    messagesDispatcher,
    sdk,
  });

  const scrollToMessage = useScrollToMessage({
    setInitialTimeStamp,
    setAnimatedMessageId,
    allMessages,
    scrollRef,
  }, { logger });

  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMorePrev, onScrollCallback -> scroll up(default behavior)
  // hasMoreNext, onScrollDownCallback -> scroll down
  const onScrollDownCallback = useScrollDownCallback({
    currentGroupChannel,
    latestMessageTimeStamp,
    userFilledMessageListQuery,
    hasMoreNext,
    replyType,
  }, {
    logger,
    messagesDispatcher,
    sdk,
  });

  const toggleReaction = useToggleReactionCallback(currentGroupChannel, logger);

  // to create message-datasource
  // this hook sets currentGroupChannel asynchronously
  useGetChannel(
    { channelUrl, sdkInit, disableMarkAsRead },
    { messagesDispatcher, sdk, logger, markAsReadScheduler },
  );

  // to set quote message as null
  useEffect(() => {
    setQuoteMessage(null);
  }, [channelUrl]);

  // Hook to handle ChannelEvents and send values to useReducer using messagesDispatcher
  useHandleChannelEvents(
    {
      currentGroupChannel,
      sdkInit,
      currentUserId: userId,
      disableMarkAsRead,
    },
    {
      messagesDispatcher,
      sdk,
      logger,
      scrollRef,
      setQuoteMessage,
    },
  );

  // hook that fetches messages when channel changes
  // to be clear here useGetChannel sets currentGroupChannel
  // and useInitialMessagesFetch executes when currentGroupChannel changes
  // p.s This one executes on initialTimeStamp change too
  useInitialMessagesFetch({
    currentGroupChannel,
    userFilledMessageListQuery,
    initialTimeStamp,
    replyType,
    setIsScrolled,
  }, {
    logger,
    scrollRef,
    messagesDispatcher,
  });

  // handles API calls from withSendbird
  useHandleChannelPubsubEvents({
    channelUrl,
    sdkInit,
    pubSub,
    dispatcher: messagesDispatcher,
    scrollRef,
  });

  // handling connection breaks
  useHandleReconnect({ isOnline, replyType, disableMarkAsRead, reconnectOnIdle }, {
    logger,
    sdk,
    scrollRef,
    currentGroupChannel,
    messagesDispatcher,
    userFilledMessageListQuery,
    markAsReadScheduler,
  });

  // callbacks for Message CURD actions
  const deleteMessage = useDeleteMessageCallback(
    { currentGroupChannel, messagesDispatcher },
    { logger },
  );
  const updateMessage = useUpdateMessageCallback(
    { currentGroupChannel, messagesDispatcher, onBeforeUpdateUserMessage, isMentionEnabled },
    { logger, pubSub },
  );
  const resendMessage = useResendMessageCallback(
    { currentGroupChannel, messagesDispatcher },
    { logger, pubSub },
  );
  const [messageInputRef, sendMessage] = useSendMessageCallback(
    {
      currentGroupChannel,
      isMentionEnabled,
      onBeforeSendUserMessage,
    },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );
  const [sendFileMessage] = useSendFileMessageCallback(
    {
      currentGroupChannel,
      imageCompression,
      onBeforeSendFileMessage,
    },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );
  const [sendVoiceMessage] = useSendVoiceMessageCallback(
    {
      currentGroupChannel,
      onBeforeSendVoiceMessage,
    },
    {
      logger,
      pubSub,
      scrollRef,
      messagesDispatcher,
    },
  );
  const [sendMultipleFilesMessage] = useSendMultipleFilesMessage({
    currentChannel: currentGroupChannel,
    onBeforeSendMultipleFilesMessage,
    publishingModules: [PublishingModuleType.CHANNEL],
  }, {
    logger,
    pubSub,
    scrollRef,
  });

  return (
    <UIKitConfigProvider
      storage={uikitConfigStorage}
      localConfigs={{
        ...uikitConfig,
        groupChannel: {
          ...uikitConfig.groupChannel,
          channel: {
            ...uikitConfig.groupChannel.channel,
            enableMarkAsUnread: false,
          },
        },
      }
    }>
    <ChannelContext.Provider value={{
      // props
      channelUrl,
      isReactionEnabled: usingReaction,
      isMessageGroupingEnabled,
      isMultipleFilesMessageEnabled,
      showSearchIcon: showSearchIcon ?? globalConfigs.groupChannelSettings.enableMessageSearch,
      highlightedMessage,
      startingPoint,
      onBeforeSendUserMessage,
      onBeforeSendFileMessage,
      onBeforeUpdateUserMessage,
      onChatHeaderActionClick,
      onSearchClick,
      onBackClick,
      replyType,
      threadReplySelectType: threadReplySelectType
        ?? getCaseResolvedThreadReplySelectType(groupChannel.threadReplySelectType).upperCase
        ?? ThreadReplySelectType.THREAD,
      queries,
      filterMessageList,
      disableMarkAsRead,
      onReplyInThread,
      onQuoteMessageClick,
      onMessageAnimated,
      onMessageHighlighted,

      // messagesStore
      allMessages,
      localMessages,
      loading,
      initialized,
      unreadSince,
      unreadSinceDate,
      isInvalid,
      currentGroupChannel,
      hasMorePrev,
      hasMoreNext,
      oldestMessageTimeStamp,
      latestMessageTimeStamp,
      emojiContainer,
      readStatus,
      typingMembers,

      // utils
      scrollToMessage,
      quoteMessage,
      setQuoteMessage,
      deleteMessage,
      updateMessage,
      resendMessage,
      messageInputRef,
      sendMessage,
      sendFileMessage,
      sendVoiceMessage,
      sendMultipleFilesMessage,
      initialTimeStamp,
      messageActionTypes: channelActions,
      messagesDispatcher,
      setInitialTimeStamp,
      setAnimatedMessageId,
      setHighLightedMessageId,
      animatedMessageId,
      highLightedMessageId,
      nicknamesMap,
      emojiAllMap,
      onScrollCallback,
      onScrollDownCallback,
      scrollRef,
      scrollBehavior,
      toggleReaction,
      isScrolled,
      setIsScrolled,
    }}>
      <UserProfileProvider {...props}>
        {children}
      </UserProfileProvider>
    </ChannelContext.Provider>
    </UIKitConfigProvider>
  );
};

const useChannelContext = () => {
  const context = React.useContext(ChannelContext);
  if (!context) throw new Error('ChannelContext not found. Use within the Channel module.');
  return context;
};

export {
  ChannelProvider,
  useChannelContext,
};
