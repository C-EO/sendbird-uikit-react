import React, {
  useRef,
  useEffect,
  useReducer,
  useMemo,
} from 'react';
import type { FileMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';

import * as utils from './utils';
import { UserProfileProvider } from '../../../lib/UserProfileContext';
import { RenderUserProfileProps } from '../../../types';
import messagesReducer from './dux/reducers';
import messagesInitialState, {
  State as MessageStoreState,
} from './dux/initialState';
import * as messageActionTypes from './dux/actionTypes';
import { scrollIntoLast } from './utils';
import topics from '../../../lib/pubSub/topics';

// hooks
import useSetChannel from './hooks/useSetChannel';
import useHandleChannelEvents from './hooks/useHandleChannelEvents';
import useInitialMessagesFetch from './hooks/useInitialMessagesFetch';
import useScrollCallback from './hooks/useScrollCallback';
import useCheckScrollBottom from './hooks/useCheckScrollBottom';
import useSendMessageCallback from './hooks/useSendMessageCallback';
import useFileUploadCallback from './hooks/useFileUploadCallback';
import useUpdateMessageCallback from './hooks/useUpdateMessageCallback';
import useDeleteMessageCallback from './hooks/useDeleteMessageCallback';
import useResendMessageCallback from './hooks/useResendMessageCallback';
import useTrimMessageList from './hooks/useTrimMessageList';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

type OpenChannelQueries = {
  // https://sendbird.github.io/core-sdk-javascript/module-model_params_messageListParams-MessageListParams.html
  messageListParams?: {
    replyType?: string,
    messageType?: string,
    prevResultSize?: number,
    nextResultSize?: number,
    reverse?: boolean,
    isInclusive?: boolean,
    includeMetaArray?: boolean,
    // UIKit doesn't support emoji reaction in OpenChannel
    // includeReactions?: boolean,
    // UIKit doesn't support message threading in OpenChannel
    // includeThreadInfo?: boolean,
    includeParentMessageInfo?: boolean,
    showSubchannelMessagesOnly?: boolean,
    customTypes?: Array<string>,
    senderUserIds?: Array<string>,
  },
};

export interface OpenChannelProviderProps {
  channelUrl: string;
  children?: React.ReactElement;
  isMessageGroupingEnabled?: boolean;
  queries?: OpenChannelQueries;
  messageLimit?: number;
  onBeforeSendUserMessage?(text: string): UserMessageCreateParams;
  onBeforeSendFileMessage?(file_: File): FileMessageCreateParams;
  onChatHeaderActionClick?(): void;
  onBackClick?(): void;
  disableUserProfile?: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}

interface OpenChannelInterface extends OpenChannelProviderProps, MessageStoreState {
  // derived/utils
  messageInputRef: React.RefObject<HTMLInputElement>;
  conversationScrollRef: React.RefObject<HTMLDivElement>;
  disabled: boolean;
  amIBanned: boolean;
  amIMuted: boolean;
  amIOperator: boolean;
  fetchMore: boolean;
  checkScrollBottom: () => boolean;
  onScroll: (callback: () => void) => void;
  handleSendMessage: any;
  handleFileUpload: any;
  updateMessage: any;
  deleteMessage: any;
  resendMessage: any;
}

const OpenChannelContext = React.createContext<OpenChannelInterface | null>(null);

const OpenChannelProvider: React.FC<OpenChannelProviderProps> = (props: OpenChannelProviderProps) => {
  const {
    channelUrl,
    children,
    isMessageGroupingEnabled = true,
    queries,
    onBeforeSendUserMessage,
    messageLimit,
    onBeforeSendFileMessage,
    onChatHeaderActionClick,
    onBackClick, disableUserProfile, renderUserProfile,
  } = props;

  // We didn't decide to support fetching participant list
  const fetchingParticipants = false;
  const { state } = useSendbird();

  const sdk = state.stores.sdkStore.sdk;
  const sdkInit = state.stores.sdkStore.initialized;
  const user = state.stores.userStore.user;
  const config = state.config;

  const {
    userId,
    isOnline,
    logger,
    pubSub,
    imageCompression,
  } = config;

  // hook variables
  const [messagesStore, messagesDispatcher] = useReducer(messagesReducer, messagesInitialState);
  const {
    allMessages,
    loading,
    initialized,
    currentOpenChannel,
    isInvalid,
    hasMore,
    lastMessageTimestamp,
    operators,
    bannedParticipantIds,
    mutedParticipantIds,
  } = messagesStore;
  // ref
  const messageInputRef = useRef(null); // useSendMessageCallback
  const conversationScrollRef = useRef<HTMLDivElement>(null); // useScrollAfterSendMessageCallback

  // const
  const userFilledMessageListParams = queries?.messageListParams;
  const disabled = !initialized
    || !isOnline
    || utils.isDisabledBecauseFrozen(currentOpenChannel, userId)
    || utils.isDisabledBecauseMuted(mutedParticipantIds, userId);

  // useMemo
  const amIBanned = useMemo(() => {
    return bannedParticipantIds.indexOf(user.userId) >= 0;
  }, [channelUrl, bannedParticipantIds, user]);
  const amIMuted = useMemo(() => {
    return mutedParticipantIds.indexOf(user.userId) >= 0;
  }, [channelUrl, mutedParticipantIds, user]);
  const amIOperator = useMemo(() => {
    return operators.map(operator => operator.userId).indexOf(user.userId) >= 0;
  }, [channelUrl, operators, user]);

  // use hooks
  useSetChannel(
    { channelUrl, sdkInit, fetchingParticipants, userId, currentOpenChannel },
    { sdk, logger, messagesDispatcher },
  );

  const checkScrollBottom = useCheckScrollBottom(
    { conversationScrollRef },
    { logger },
  );
  useHandleChannelEvents(
    { currentOpenChannel, checkScrollBottom },
    { sdk, logger, messagesDispatcher, scrollRef: conversationScrollRef },
  );
  useInitialMessagesFetch(
    { currentOpenChannel, userFilledMessageListParams },
    { logger, messagesDispatcher, scrollRef: conversationScrollRef },
  );

  const fetchMore: boolean = utils.shouldFetchMore(allMessages?.length, messageLimit);
  // do not fetch more for streaming
  const onScroll = useScrollCallback(
    { currentOpenChannel, lastMessageTimestamp, fetchMore },
    { sdk, logger, messagesDispatcher, hasMore, userFilledMessageListParams },
  );
  const handleSendMessage = useSendMessageCallback(
    { currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom, messageInputRef },
    { sdk, logger, messagesDispatcher, scrollRef: conversationScrollRef },
  );
  const handleFileUpload = useFileUploadCallback(
    { currentOpenChannel, onBeforeSendFileMessage, checkScrollBottom, imageCompression },
    { sdk, logger, messagesDispatcher, scrollRef: conversationScrollRef },
  );
  const updateMessage = useUpdateMessageCallback(
    { currentOpenChannel, onBeforeSendUserMessage },
    { logger, messagesDispatcher },
  );
  const deleteMessage = useDeleteMessageCallback(
    { currentOpenChannel },
    { logger, messagesDispatcher },
  );
  const resendMessage = useResendMessageCallback(
    { currentOpenChannel },
    { logger, messagesDispatcher },
  );

  useTrimMessageList(
    { messagesLength: allMessages?.length, messageLimit },
    { messagesDispatcher, logger },
  );

  // handle API calls from withSendbird
  useEffect(() => {
    const subscriber = new Map();
    if (!pubSub || !pubSub.subscribe) {
      return;
    }
    subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (msg) => {
      const { channel, message } = msg;
      scrollIntoLast(0, conversationScrollRef);
      if (channel && (channelUrl === channel?.url)) {
        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
          payload: message,
        });
      }
    }));
    subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
      const { channel, message } = msg;
      if (channel && (channelUrl === channel?.url)) {
        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_START,
          payload: { message, channel },
        });
      }
    }));
    subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (msg) => {
      const { channel, message } = msg;
      scrollIntoLast(0, conversationScrollRef);
      if (channel && (channelUrl === channel?.url)) {
        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
          payload: { message, channel },
        });
      }
    }));
    subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
      const { channel, message, fromSelector } = msg;
      if (fromSelector && channel && (channelUrl === channel?.url)) {
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_UPDATED,
          payload: { channel, message },
        });
      }
    }));
    subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (msg) => {
      const { channel, messageId } = msg;
      if (channel && (channelUrl === channel?.url)) {
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED,
          payload: messageId,
        });
      }
    }));

    return () => {
      if (subscriber) {
        subscriber.forEach((s) => {
          try {
            s.remove();
          } catch {
            //
          }
        });
      }
    };
  }, [channelUrl, sdkInit]);

  return (
    <OpenChannelContext.Provider value={{
      // props
      channelUrl,
      children,
      isMessageGroupingEnabled,
      queries,
      onBeforeSendUserMessage,
      messageLimit,
      onBeforeSendFileMessage,
      onChatHeaderActionClick,
      onBackClick,
      // store
      allMessages,
      loading,
      initialized,
      currentOpenChannel,
      isInvalid,
      hasMore,
      lastMessageTimestamp,
      operators,
      bannedParticipantIds,
      mutedParticipantIds,
      // derived/utils
      messageInputRef,
      conversationScrollRef,
      disabled,
      amIBanned,
      amIMuted,
      amIOperator,
      checkScrollBottom,
      fetchMore,
      onScroll,
      handleSendMessage,
      handleFileUpload,
      updateMessage,
      deleteMessage,
      resendMessage,
      frozen: messagesStore.frozen,
      disableUserProfile,
      renderUserProfile,
      participants: messagesStore.participants,
    }}>
      <UserProfileProvider
        isOpenChannel
        renderUserProfile={props?.renderUserProfile}
        disableUserProfile={props?.disableUserProfile ?? config?.disableUserProfile}
      >
        {children}
      </UserProfileProvider>
    </OpenChannelContext.Provider>
  );
};

const useOpenChannelContext = () => {
  const context = React.useContext(OpenChannelContext);
  if (!context) throw new Error('OpenChannelContext not found. Use within the OpenChannel module');
  return context;
};

export {
  OpenChannelProvider,
  useOpenChannelContext,
};
