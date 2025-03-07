import './index.scss';

import React, { useState } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import GroupChannelListHeader from '../GroupChannelListHeader';

import EditUserProfile from '../../../EditUserProfile';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { User } from '@sendbird/chat';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface Props {
  renderHeader?: (props: void) => React.ReactElement;
  renderPlaceHolderError?: (props: void) => React.ReactElement;
  renderPlaceHolderLoading?: (props: void) => React.ReactElement;
  renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;

  onChangeTheme: (theme: string) => void;
  onUserProfileUpdated: (user: User) => void;
  allowProfileEdit: boolean;

  channels: GroupChannel[];
  onLoadMore: () => void;
  initialized: boolean;
  renderChannel: (props: { item: GroupChannel; index: number }) => React.ReactElement;

  renderAddChannel(): React.ReactElement;

  // NOTE: scrollRef is used only for external access (export) and not for internal logic.
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export const GroupChannelListUIView = ({
  renderHeader,
  renderPlaceHolderError,
  renderPlaceHolderLoading,
  renderPlaceHolderEmptyList,

  onChangeTheme,
  onUserProfileUpdated,
  allowProfileEdit,

  channels,
  onLoadMore,
  initialized,
  renderChannel,

  renderAddChannel,

  scrollRef,
}: Props) => {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const { state: { stores } } = useSendbird();

  const renderer = {
    addChannel: renderAddChannel,
    channel: renderChannel,
    placeholder: {
      loading() {
        if (initialized) return null;

        if (renderPlaceHolderLoading) return renderPlaceHolderLoading();
        return <PlaceHolder type={PlaceHolderTypes.LOADING} />;
      },
      empty() {
        if (!initialized) return null;

        if (renderPlaceHolderEmptyList) return renderPlaceHolderEmptyList();
        return <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />;
      },
      error() {
        if (!initialized || !stores.sdkStore.error) return null;

        if (renderPlaceHolderError) return renderPlaceHolderError();
        return <PlaceHolder type={PlaceHolderTypes.WRONG} />;
      },
    },
  };

  return (
    <React.Fragment>
      <div className="sendbird-channel-list__header">
        {renderHeader?.() || (
          <GroupChannelListHeader
            onEdit={() => allowProfileEdit && setShowProfileEdit(true)}
            allowProfileEdit={allowProfileEdit}
            renderIconButton={() => renderer.addChannel()}
          />
        )}
      </div>
      {showProfileEdit && (
        <EditUserProfile
          onThemeChange={onChangeTheme}
          onCancel={() => setShowProfileEdit(false)}
          onEditProfile={(user) => {
            setShowProfileEdit(false);
            onUserProfileUpdated(user);
          }}
        />
      )}
      <ChannelListComponent
        data={channels}
        renderItem={renderer.channel}
        onLoadMore={onLoadMore}
        placeholderLoading={renderer.placeholder.loading()}
        placeholderEmpty={renderer.placeholder.empty()}
        placeholderError={renderer.placeholder.error()}
        scrollRef={scrollRef}
      />
    </React.Fragment>
  );
};

/**
 * To do: Implement windowing
 * Implement windowing if you are dealing with large number of messages/channels
 * https://github.com/bvaughn/react-window -> recommendation
 * We hesitate to bring one more dependency to our library,
 * we are planning to implement it inside the library
 * */
const ChannelListComponent = <T, >(props: {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactNode;
  onLoadMore?: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;

  placeholderLoading?: React.ReactNode;
  placeholderEmpty?: React.ReactNode;
  placeholderError?: React.ReactNode;
}) => {
  const { data, renderItem, onLoadMore, placeholderLoading, placeholderError, placeholderEmpty, scrollRef } = props;

  const onScroll = useOnScrollPositionChangeDetector({
    onReachedBottom: () => onLoadMore?.(),
  });

  return (
    <div className='sendbird-channel-list__body' onScroll={onScroll} ref={scrollRef}>
      {placeholderError}
      <div>{data.map((item, index) => renderItem({ item, index }))}</div>
      {placeholderLoading}
      {data.length === 0 && placeholderEmpty}
    </div>
  );
};
