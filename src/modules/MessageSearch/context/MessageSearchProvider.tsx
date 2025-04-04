import React, { createContext, useRef, useCallback, useEffect, useMemo } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '../../../types';
import { SendbirdError } from '@sendbird/chat';
import type { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';

import useSetChannel from './hooks/useSetChannel';
import useGetSearchMessages from './hooks/useGetSearchedMessages';
import useScrollCallback from './hooks/useScrollCallback';
import useSearchStringEffect from './hooks/useSearchStringEffect';
import { CoreMessageType } from '../../../utils';
import { createStore } from '../../../utils/storeManager';
import { useStore } from '../../../hooks/useStore';
import useMessageSearch from './hooks/useMessageSearch';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { deleteNullish } from '../../../utils/utils';

export interface MessageSearchProviderProps {
  channelUrl: string;
  children?: React.ReactElement;
  searchString?: string;
  messageSearchQuery?: MessageSearchQueryParams;
  onResultLoaded?(messages?: Array<CoreMessageType> | null, error?: SendbirdError | null): void;
  onResultClick?(message: ClientSentMessages): void;
}

export interface MessageSearchState extends MessageSearchProviderProps {
  channelUrl: string;
  allMessages: ClientSentMessages[];
  loading: boolean;
  isInvalid: boolean;
  initialized: boolean;
  currentChannel: GroupChannel | null;
  currentMessageSearchQuery: MessageSearchQuery | null;
  hasMoreResult: boolean;
  retryCount: number;
  selectedMessageId: number | null;
  requestString: string;
  onScroll?: ReturnType<typeof useScrollCallback>;
  handleOnScroll?: (e: React.BaseSyntheticEvent) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const initialState: MessageSearchState = {
  channelUrl: '',
  allMessages: [],
  loading: false,
  isInvalid: false,
  initialized: false,
  currentChannel: null,
  currentMessageSearchQuery: null,
  messageSearchQuery: null,
  hasMoreResult: false,
  retryCount: 0,
  selectedMessageId: null,
  searchString: '',
  requestString: '',
  /**
   * messageSearchDispatcher is no longer used.
   * Please use useMessageSearch() to get the store and update the state.
   */
  // messageSearchDispatcher: null,
};

export const MessageSearchContext = createContext<ReturnType<typeof createStore<MessageSearchState>> | null>(null);

const MessageSearchManager: React.FC<MessageSearchProviderProps> = ({
  channelUrl,
  searchString,
  messageSearchQuery,
  onResultLoaded,
  onResultClick,
}) => {
  const { state, updateState } = useMessageSearchStore();
  const { state: { config, stores } } = useSendbird();
  const sdk = stores?.sdkStore?.sdk;
  const sdkInit = stores?.sdkStore?.initialized;
  const { logger } = config;
  const scrollRef = useRef<HTMLDivElement>(null);

  useSetChannel(
    { channelUrl, sdkInit },
    { sdk, logger },
  );

  const _searchString = useMemo(() => {
    return searchString ?? messageSearchQuery?.keyword ?? '';
  }, [searchString, messageSearchQuery?.keyword]);
  const requestString = useSearchStringEffect({ searchString: _searchString });

  useGetSearchMessages(
    {
      currentChannel: state.currentChannel,
      channelUrl,
      requestString,
      messageSearchQuery,
      onResultLoaded,
    },
    { sdk, logger },
  );

  const onScroll = useScrollCallback(
    { onResultLoaded },
    { logger },
  );

  const handleOnScroll = useCallback((e: React.BaseSyntheticEvent) => {
    const scrollElement = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;

    if (!state.hasMoreResult) {
      return;
    }
    if (scrollTop + clientHeight >= scrollHeight) {
      onScroll(() => {
        // after load more searched messages
      });
    }
  }, [state.hasMoreResult, onScroll]);

  useEffect(() => {
    updateState({
      channelUrl,
      searchString: _searchString,
      messageSearchQuery,
      onResultClick,
      onScroll,
      handleOnScroll,
      scrollRef,
      requestString,
    });
  }, [channelUrl, searchString, messageSearchQuery, onResultClick, updateState, requestString]);

  return null;
};

const createMessageSearchStore = (props?: Partial<MessageSearchState>) => createStore({
  ...initialState,
  ...props,
});

const InternalMessageSearchProvider: React.FC<React.PropsWithChildren<unknown>> = (props: MessageSearchProviderProps) => {
  const { children } = props;

  const defaultProps: Partial<MessageSearchState> = deleteNullish({
    channelUrl: props?.channelUrl,
    messageSearchQuery: props?.messageSearchQuery,
    searchString: props?.searchString,
    onResultLoaded: props?.onResultLoaded,
    onResultClick: props?.onResultClick,
  });

  const storeRef = useRef(createMessageSearchStore(defaultProps));

  return (
    <MessageSearchContext.Provider value={storeRef.current}>
      {children}
    </MessageSearchContext.Provider>
  );
};

const MessageSearchProvider: React.FC<MessageSearchProviderProps> = (props: MessageSearchProviderProps) => {
  const {
    children,
    channelUrl,
    searchString,
    messageSearchQuery,
    onResultLoaded,
    onResultClick,
  } = props;

  return (
    <InternalMessageSearchProvider {...props}>
      <MessageSearchManager
        channelUrl={channelUrl}
        searchString={searchString}
        messageSearchQuery={messageSearchQuery}
        onResultLoaded={onResultLoaded}
        onResultClick={onResultClick}
      />
      {children}
    </InternalMessageSearchProvider>
  );
};

// Keep this function for backward compatibility.
const useMessageSearchContext = () => {
  const { state, actions } = useMessageSearch();
  return { ...state, ...actions };
};

export {
  MessageSearchProvider,
  useMessageSearchContext,
  MessageSearchManager,
};

/**
 * A specialized hook for MessageSearch state management
 * @returns {ReturnType<typeof createStore<MessageSearchState>>}
 */
const useMessageSearchStore = () => {
  return useStore(MessageSearchContext, state => state, initialState);
};
