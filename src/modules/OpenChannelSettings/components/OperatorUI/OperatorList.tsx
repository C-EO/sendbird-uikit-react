import React, { ReactElement, useContext, useState } from 'react';

import { UserListItem } from '../ParticipantUI/ParticipantItem';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import ContextMenu, { MenuItem, MenuItems, MuteMenuItem } from '../../../../ui/ContextMenu';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import IconButton from '../../../../ui/IconButton';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import OperatorListModal from './OperatorsModal';
import AddOperatorsModal from './AddOperatorsModal';
import { Participant } from '@sendbird/chat';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

const OperatorList = (): ReactElement => {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const { state } = useSendbird();
  const currentUserId = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useOpenChannelSettingsContext();

  return (
    <div>
      {
        channel?.operators?.slice(0, 10).map((operator: Participant) => (
          <UserListItem
            key={operator.userId}
            user={operator}
            currentUser={currentUserId}
            action={({ actionRef }) => (
              currentUserId !== operator?.userId
                ? (
                  <ContextMenu
                    menuTrigger={(toggleDropdown) => (
                      <IconButton
                        className="sendbird-openchannel-operator-list__menu"
                        width="32px"
                        height="32px"
                        onClick={toggleDropdown}
                      >
                        <Icon
                          width="24px"
                          height="24px"
                          type={IconTypes.MORE}
                          fillColor={IconColors.CONTENT_INVERSE}
                        />
                      </IconButton>
                    )}
                    menuItems={(closeDropdown) => (
                      <MenuItems
                        parentRef={actionRef}
                        closeDropdown={closeDropdown}
                        openLeft
                      >
                        <MenuItem
                          onClick={() => {
                            channel?.removeOperators([operator.userId]).then(() => {
                              closeDropdown();
                            });
                          }}
                          testID="open_channel_setting_operator_context_menu_unregister_operator"
                        >
                          {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR}
                        </MenuItem>
                        <MuteMenuItem
                          channel={channel}
                          user={operator}
                          onChange={() => closeDropdown()}
                          onError={() => {
                            // FIXME: handle error later
                            closeDropdown();
                          }}
                          testID={`open_channel_setting_operator_context_menu_${operator.isMuted ? 'unmute' : 'mute'}`}
                        >
                          {
                            operator.isMuted
                              ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE
                              : stringSet.OPEN_CHANNEL_SETTING__MODERATION__MUTE
                          }
                        </MuteMenuItem>
                        <MenuItem
                          onClick={() => {
                            channel?.banUser(operator).then(() => {
                              closeDropdown();
                            });
                          }}
                          testID="open_channel_setting_operator_context_menu_ban"
                        >
                          {stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN}
                        </MenuItem>
                      </MenuItems>
                    )}
                  />
                ) : <></>
            )}
          />
        ))
      }
      <div className="sendbird-openchannel-operator-list__footer">
        <Button
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          onClick={() => {
            setShowAdd(true);
          }}
        >
          {stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ADD}
        </Button>
        {
          channel?.operators && channel.operators.length > 10 && (
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowMore(true);
              }}
            >
              {stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ALL}
            </Button>
          )
        }
      </div>
      {
        showMore && (
          <>
            <OperatorListModal
              onCancel={() => {
                setShowMore(false);
              }}
            />
          </>
        )
      }
      {
        showAdd && (
          <>
            <AddOperatorsModal
              onCancel={() => setShowAdd(false)}
              onSubmit={() => {
                setShowAdd(false);
              }}
            />
          </>
        )
      }
    </div>
  );
};

export default OperatorList;
