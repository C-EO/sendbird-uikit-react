import React, { ReactElement, MouseEvent, useState, ReactNode } from 'react';
import './index.scss';

import _MenuItems from './MenuItems';
import { MuteMenuItem } from './items/MuteMenuItem';
import { OperatorMenuItem } from './items/OperatorMenuItem';
import _EmojiListItems from './EmojiListItems';

import { getClassName } from '../../utils';
import Label, { LabelTypography, LabelColors } from '../Label';

const ENTER_KEY = 13;

// # useElementObserve
export const MENU_OBSERVING_CLASS_NAME = 'sendbird-observing-message-menu';
export const getObservingId = (txt: string | number) => `m_${txt}`;

export const MenuItems = _MenuItems;
export const EmojiListItems = _EmojiListItems;

export interface MenuItemProps {
  className?: string | Array<string>;
  children: ReactElement | ReactElement[] | ReactNode;
  onClick?: (e: MouseEvent<HTMLLIElement>) => void;
  disable?: boolean;
  /**
   * @deprecated Please use the testID instead
   */
  dataSbId?: string;
  testID?: string;
}
export const MenuItem = ({
  className = '',
  children,
  onClick,
  disable = false,
  dataSbId = '',
  testID,
}: MenuItemProps): ReactElement => {
  const handleClickEvent = (e) => {
    if (!disable && onClick) {
      onClick?.(e);
    }
  };
  return (
    <li
      className={getClassName([className, 'sendbird-dropdown__menu-item', disable ? 'disable' : ''])}
      role="menuitem"
      aria-disabled={disable ? true : false}
      onClick={handleClickEvent}
      onKeyPress={(e) => { if (e.keyCode === ENTER_KEY) handleClickEvent(e); }}
      tabIndex={0}
      data-sb-id={testID ?? dataSbId}
      data-testid={testID ?? dataSbId}
    >
      <Label
        className="sendbird-dropdown__menu-item__text"
        type={LabelTypography.SUBTITLE_2}
        color={disable ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
      >
        {children}
      </Label>
    </li>
  );
};

export const MENU_ROOT_ID = 'sendbird-dropdown-portal';
export const MenuRoot = (): ReactElement => (
  <div id={MENU_ROOT_ID} className={MENU_ROOT_ID} />
);

export const EMOJI_MENU_ROOT_ID = 'sendbird-emoji-list-portal';
export const EmojiReactionListRoot = (): ReactElement => <div id={EMOJI_MENU_ROOT_ID} />;

type MenuDisplayingFunc = () => void;
export interface ContextMenuProps {
  menuTrigger?: (func: MenuDisplayingFunc) => ReactElement;
  menuItems: (func: MenuDisplayingFunc) => ReactElement;
  isOpen?: boolean;
  onClick?: (...args: any[]) => void;
}
export default function ContextMenu({
  menuTrigger,
  menuItems,
  isOpen,
  onClick,
}: ContextMenuProps): ReactElement {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="sendbird-context-menu"
      style={{ display: 'inline' }}
      onClick={onClick}
    >
      {menuTrigger?.(() => setShowMenu(!showMenu))}
      {(showMenu || isOpen) && menuItems(() => setShowMenu(false))}
    </div>
  );
}
export {
  MuteMenuItem,
  OperatorMenuItem,
};
