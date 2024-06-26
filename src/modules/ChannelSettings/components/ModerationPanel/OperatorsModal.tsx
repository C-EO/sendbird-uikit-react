import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { OperatorListQuery, User } from '@sendbird/chat';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';

interface Props { onCancel?(): void }

export default function OperatorsModal({ onCancel }: Props): ReactElement {
  const [operators, setOperators] = useState<User[]>([]);
  const [operatorQuery, setOperatorQuery] = useState<OperatorListQuery | null>(null);

  const { channel } = useChannelSettingsContext();
  const state = useSendbirdStateContext();
  const currentUserId = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const operatorListQuery = channel?.createOperatorListQuery({
      limit: 20,
    });
    operatorListQuery?.next().then((operators) => {
      setOperators(operators);
    });
    setOperatorQuery(operatorListQuery ?? null);
  }, []);
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
        titleText={stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL}
        onCancel={onCancel}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={useOnScrollPositionChangeDetector({
            onReachedBottom: async () => {
              if (operatorQuery && operatorQuery.hasNext) {
                operatorQuery.next().then((o) => {
                  setOperators([
                    ...operators,
                    ...o,
                  ]);
                });
              }
            },
          })}
        >
          {operators.map((member) => (
            <UserListItem
              currentUser={currentUserId}
              user={member}
              key={member.userId}
              action={({ parentRef, actionRef }) => (
                member?.userId !== currentUserId && (
                  <ContextMenu
                    menuTrigger={(toggleDropdown) => (
                      <IconButton
                        className="sendbird-user-message__more__menu"
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
                        parentContainRef={parentRef}
                        parentRef={actionRef} // for catching location(x, y) of MenuItems
                        closeDropdown={closeDropdown}
                        openLeft
                      >
                        <MenuItem
                          onClick={() => {
                            channel?.removeOperators([member.userId]).then(() => {
                              setOperators(operators.filter(({ userId }) => {
                                return userId !== member.userId;
                              }));
                            });
                            closeDropdown();
                          }}
                          testID="channel_setting_operator_context_menu_unregister_unregister_operator"
                        >
                          {stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR}
                        </MenuItem>
                      </MenuItems>
                    )}
                  />
                )
              )}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
