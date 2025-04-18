import React, { useContext } from 'react';

import { Emoji } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Reaction, UserMessage } from '@sendbird/chat/message';

import Tooltip from '../Tooltip';
import TooltipWrapper from '../TooltipWrapper';
import ReactionBadge from '../ReactionBadge';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes } from '../Icon';

import { Nullable } from '../../types';
import { getEmojiTooltipString, isReactedBy, SendableMessageType } from '../../utils';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import useLongPress from '../../hooks/useLongPress';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { useMessageContext } from '../../modules/Message/context/MessageProvider';
import { ModalFooter } from '../Modal';
import { ButtonTypes } from '../Button';
import { useGlobalModalContext } from '../../hooks/useModal';
import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

type Props = {
  reaction: Reaction;
  memberNicknamesMap: Map<string, string>;
  setEmojiKey: React.Dispatch<React.SetStateAction<string>>;
  toggleReaction?: (message: SendableMessageType, key: string, byMe: boolean) => void;
  emojisMap: Map<string, Emoji>;
  channel: Nullable<GroupChannel | OpenChannel>;
  message?: SendableMessageType;
  isFiltered?: boolean;
};

export default function ReactionItem({
  reaction,
  memberNicknamesMap,
  setEmojiKey,
  toggleReaction,
  emojisMap,
  channel,
  message,
  isFiltered,
}: Props) {
  const { openModal } = useGlobalModalContext();
  const { state: { config: { userId } } } = useSendbird();
  const { isMobile } = useMediaQueryContext();
  const messageStore = useMessageContext();
  const { stringSet } = useContext(LocalizationContext);

  const reactedByMe = isReactedBy(userId, reaction);
  const showHoverTooltip = (reaction.userIds.length > 0)
    && (channel?.isGroupChannel() && !channel.isSuper);

  const handleOnClick = () => {
    if (isFiltered && !reactedByMe) {
      openModal({
        modalProps: {
          titleText: 'Add reaction failed',
          hideFooter: true,
          isCloseOnClickOutside: true,
        },
        childElement: ({ closeModal }) => (
          <ModalFooter
            type={ButtonTypes.PRIMARY}
            submitText={stringSet.BUTTON__OK}
            hideCancelButton
            onCancel={closeModal}
            onSubmit={closeModal}
          />
        ),
      });

      return;
    }

    setEmojiKey('');
    toggleReaction?.((message ?? messageStore?.message as UserMessage), reaction.key, reactedByMe);
  };
  const longPress = useLongPress({
    onLongPress: () => {
      setEmojiKey(reaction.key);
    },
    onClick: handleOnClick,
  }, {
    shouldPreventDefault: true,
    shouldStopPropagation: true,
  });

  return (
    <TooltipWrapper
      className="sendbird-emoji-reactions__reaction-badge"
      hoverTooltip={showHoverTooltip ? (
        <Tooltip>
          {getEmojiTooltipString(reaction, userId, memberNicknamesMap, stringSet)}
        </Tooltip>
      ) : <></>}
    >
      <div
        {...(
          isMobile
            ? longPress
            : { onClick: handleOnClick }
        )}
      >
        <ReactionBadge
          count={reaction.userIds.length}
          selected={reactedByMe}
        >
          <ImageRenderer
            circle
            url={emojisMap.get(reaction?.key)?.url || ''}
            width="20px"
            height="20px"
            defaultComponent={(
              <Icon width="20px" height="20px" type={IconTypes.QUESTION} />
            )}
          />
        </ReactionBadge>
      </div>
    </TooltipWrapper>
  );
}
