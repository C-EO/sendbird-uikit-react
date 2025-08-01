# Changelog - v3

## [v3.17.0] (July 31 2025)
### Features
- Added `mark as unread` functionality for messages in Group Channel
  - Added `enableMarkAsUnread` global option
    - How to use?
    ```tsx
    <App
      appId={appId}
      userId={userId}
      uikitOptions={{
        groupChannel: {
          // Below turns on the mark as unread feature. Default value is false.
          enableMarkAsUnread: true,
        }
      }}
    />
    ```

### Fixes
- Fixed a bug Where Multiple Chat Windows cause unexpected behavior

### Chore
- Updated `@sendbird/chat` version to `^4.18.0`
- Updated `@sendbird/uikit-tools` dependency version to `^0.0.10`
- Updated `@sendbird/react-uikit-message-template-view` dependency version to `^0.0.10`

## [v3.16.12] (July 22 2025)
### Fixes:
- Fixed a bug that caused a runtime exception when leaving or deleting a channel

## [v3.16.11] (July 10 2025)
### Fixes:
- Fixed an issue where the layout would break when selecting a member from the invite list
- Fixed a bug where `0` was displayed when a reply was added and then deleted

## [v3.16.10] (Jun 12 2025)
### Chore
- Fixed `localCacheEnabled` option applied

## [v3.16.9] (Jun 10 2025)
### Chore
- Updated `@sendbird/chat` dependency version to `^4.19.1`
- Updated `@sendbird/uikit-tools` dependency version to `^0.0.8`
- Updated `@sendbird/react-uikit-message-template-view` dependency version to `^0.0.8`

## [v3.16.8] (Jun 9 2025)
### Fixes:
- Fixed a bug that `disableMarkAsDelivered` not working properly in `GroupChannel` component
- Improved internal state management for stabilization

## [v3.16.7] (May 27 2025)
### Fixes:
- Fixed a minor message style

## [v3.16.6] (May 13 2025)
### Fixes:
- Fixed a bug that the scroll does not remain bottom when quoted message renders

## [v3.16.5] (Apr 30 2025)
### Fixes:
- Fixed a bug that `GroupChannelProvider` with `startingPoint` throws an error
- Improved custom hook actions through memoization

## [v3.16.4] (Apr 15 2025)
### Features:
- Added support for multi-line ellipsis in quoted messages
### Fixes:
- Fixed an issue where the previous thread message wouldn't load when scrolling to the top
- Fixed an issue where `scrollToBottom()` did not work when sending a message on mobile

## [v3.16.3] (Apr 3 2025)
### Fixes:
- Fixed an issue where the connection is still alive after `SendbirdProvider` have been unmounted
- Fixed an undefined error of `emojiCategory`

## [v3.16.2] (Mar 28 2025)
### Features:
- Added `tel` and `mailto` protocol support for the markup link

## [v3.16.1] (Mar 5 2025)
### Fixes:
- Fixed an unexpected error in `MessageList`

## [v3.16.0] (Feb 28 2025)
### Fixes:
- Added the missing import paths for the following interfaces
  - `GroupChannelState`
  - `GroupChannelProviderProps`
  - `ChannelSettingsState`
  - `ChannelSettingsContextProps`
- Fixed an issue where some of the context properties are not defined in a certain case 

### Chore
- Updated `dompurify` dependency version to `v3.2.4`

## [v3.15.15] (Feb 14 2025)
### Fixes:
- Added the missing import paths for the following deprecated interfaces
  - `useSendbirdStateContext`
  - `withSendbird`
- Fixed an issue where `VoiceMessageInput` failed to record the audio at first

### Chore
- Updated `@sendbird/chat` version to `v4.16.4`

## [v3.15.14] (Feb 7 2025)

### Features:
- Added custom hooks for each module replacing the previous context hook. The custom hook allows access to the provider's data, which are divided into `state` and `actions` properties.
  * Added `useGroupChannelList`, replacing `useGroupChannelListContext`
  * Added `useCreateChannel`, replacing `useCreateChannelContext`
  * Added `useChannelSettings`, replacing `useChannelSettingsContext`
  * Added `useGroupChannel`, replacing `useGroupChannelContext`
  * Added `useMessageSearch`, replacing `useMessageSearchContext`
  * Added `useThread`, replacing `useThreadContext`
    - How to Use?
    ```tsx
    import { useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';

    // Implement your code inside the react function component.
    const Component = () => {
    // const { currentChannel, scrollToBottom } = useGroupChannelContext();
    const {
      state : {
        currentChannel,
      },
      actions : {
        scrollToBottom
      },
    } = useGroupChannel();

    const onScrollDownButtonClick = () => {
      scrollToBottom();
    };

    // ...
    }
    ```
    
### Fixes:
- Fixed an issue where the pasting the formatted text to `MessageInput` did not shows properly. 
- Fixed a bug with forwardRef Rules of Hooks violation.

## [v3.15.13] (Jan 31 2025)

### Features:
- Added React 19 compatibility
- Added `messageSearchQuery.keyword` when searching in MessageSearch module
  - `searchString` now takes higher priority, while `messageSearchQuery.keyword` is assigned secondary priority.

### Fixes:
- Fixed the width of the messages in open channel


## [v3.15.12] (Jan 9 2025)

### Features:
- Provided `useConnectionState` that you can get the connection state of SDK.

### Fixes:
- Improved the stability with the latest Chat SDK version.

## [v3.15.11] (Dec 19 2024)

### Fixes:
- Fixed an issue where the bubble type typing indicator appeared but was not visible because the scroll did not move to the bottom.

## [v3.15.10] (Dec 12 2024)

### Features:
- Added `scrollRef` in GroupChannelList context

### Fixes:
- Fixed broken UI
  * MessageInput height becomes short when it's disabled.
  * Empty UserListItem menu appears on the ChannelSettings member list of normal channel member who is not an operator of the channel.
- Displayed members' name instead of default AI chatbot channel name, like the `Group Channel` does.
- Fixed an issue where editing a text parent message in a channel did not update the corresponding parent message in the Thread area in real-time.
- Fixed a GroupChannel UI error when the `Open in Channel` action is triggered in a different channel.
  * The `Open in Channel` implementation invokes both `setCurrentChannel` and `setStartingPoint`.
    The `setCurrentChannel` function triggers asynchronous side effects that update `channel`, `messagesDataSource`, and `startingPoint`.
    If `setStartingPoint` is invoked before these updates are completed, it can result in the channel not being updated correctly or the starting point being improperly set.

## [v3.15.9] (Nov 21 2024)

### Fixes:
* Fixed error handling in message handlers:
  * Allow void return type in `onBefore-` handlers
  * Add proper error handling via `eventHandlers.message` for:
    * onSendMessageFailed
    * onUpdateMessageFailed
    * onFileUploadFailed
  * Users no longer need to return an empty object from `onBefore-` due to type constraints
* Fixed a bug where profile bottom position was not updating correctly for messages with feedback and replies:
  * Profile bottom position now updates properly when messages contain feedback and reply components
  * Ensures consistent profile positioning across all message types and states

## [v3.15.8] (Nov 7th, 2024)

### Fixes:
- Fixed an issue where the `dir` attribute was not being properly applied to message containers:
  * Removed `useMessageLayoutDirection` hook in favor of a more React-friendly solution
  * Updated `MessageList` component to directly handle text direction through the `dir` attribute
- Fixed an issue in TypingIndicatorBubble component where null was returned before hook execution
- Fixed SDK initialization parameter override issue:
  * Modified Object.assign order to allow proper parameter override
  * Added test case to verify `localCacheEnabled` override functionality
  * Ensures `sdkInitParams.localCacheEnabled` properly overrides default settings; `localCacheEnabled: true`

## [v3.15.7] (Oct 24th, 2024)

### Features:
- **Added support for new file types and extensions.**
  - **Added mime types:** `'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip', 'application/x-bzip', 'application/x-bzip2', 'application/x-xz', 'application/x-iso9660-image'`
  - **Added extensions:**
    - **Image:** `'.apng', '.avif', '.gif', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.webp', '.bmp', '.ico', '.cur', '.tif', '.tiff'`
    - **Video:** `'.mp4', '.webm', '.ogv', '.3gp', '.3g2', '.avi', '.mov', '.wmv', '.mpg', '.mpeg', '.m4v', '.mkv'`
    - **Audio:** `'.aac', '.midi', '.mp3', '.oga', '.opus', '.wav', '.weba', '.3gp', '.3g2'`
    - **Document:** `'.txt', '.log', '.csv', '.rtf', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'`
    - **Archive:** `'.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso'`
- **Enhanced MessageBody rendering support:**
  - Added support for `.bmp` files as `ThumbnailMessage`
  - Added support for `.heic` files as `FileMessage` for cross-browser consistency

### Fixes:
- Fixed an issue where the `OpenChannel` message list scroll would not move upon initialization **on mobile browsers**.
- Fixed an issue where the `MessageInput` failed to auto-scroll when pasting text.
- Fixed an issue where ASCII characters appeared in the `MessageInput` when pasting non-English text.

## [v3.15.6] (Oct 11th, 2024)

### Features:
- Exported `useLocalization` Hook:
  - Provided access to stringSet and dateLocale.
  - Note: Required SendbirdProvider to wrap your component for proper usage.
  - Import Path: `"@sendbird/uikit-react/hooks/useLocalization"`
- Exported `ThreadReplySelectType`:
  - Import Paths:
    - `"@sendbird/uikit-react/Channel/context"`
    - `"@sendbird/uikit-react/GroupChannel/context"`

### Fixes
- Modified the `MessageInput` to scroll to the caret position when pasting text.
- The maximum height of the `MessageInput` has been extended to `'92px'`
- Fixed an `error message` on `MenuItemAction` when the children prop is `undefined`

## [v3.15.5] (Oct 4th, 2024)

### Updates
- Usage of template message feature:
  1. Template data in message
    - removed: A message with valid `extendedMessagePayload.template` value will be displayed with `TemplateMessageItemBody`.
    - added: A message with valid `extendedMessagePayload.message_template` value will be displayed with `TemplateMessageItemBody`.
  2. Container type data in message
    - removed: Added 'wide' width support for `MessageContent` when value exists in `message.extendedMessagePayload['ui']['container_type']`
    - added: Added support for template message rendering options (boolean type): `profile`, `time`, and `nickname` in `extendedMessagePayload['message_template']['container_options']`

## [v3.15.4] (Sep 26th, 2024)

### Features
- Added stringSet for date format and applied them
  | Key | Value |
  | --- | ----- |
  | DATE_FORMAT__MESSAGE_CREATED_AT | `'p'` |
  | DATE_FORMAT__UNREAD_SINCE | `'p MMM dd'` |
  | DATE_FORMAT__LAST_MESSAGE_CREATED_AT__TODAY | `'p'` |
  | DATE_FORMAT__LAST_MESSAGE_CREATED_AT__THIS_YEAR | `'MMM d'` |
  | DATE_FORMAT__LAST_MESSAGE_CREATED_AT__PREVIOUS_YEAR | `'yyyy/M/d'` |

## [v3.15.3] (Sep 12th, 2024)

### Fixes
- Fixed incorrect styling for `Checkbox`.
- Fixed the issue where the channel list appears empty when the UIKit is rendered for the first time.

## [v3.15.2] (Sep 6th, 2024)

### Features
- Introduced new `message` event handlers for `onSendMessageFailed`, `onUpdateMessageFailed`, and `onFileUploadFailed` in the `eventHandlers` prop of the message input component. These handlers allow developers to respond to message send, update, and file upload failures.
  * How to use?
  ```tsx
  <Sendbird
    eventHandlers={{
      message: {
        onSendMessageFailed: (message, error) => {
          // You can use the message parameter to create specific conditions
          if (message.isUserMessage()) {
            alert(`Message failed to send: ${error?.message}`);
          }
        },
        onUpdateMessageFailed: (message, error) => {
          console.log(`Failed to update message: ${message.messageId}, Error: ${error}`);
        },
        onFileUploadFailed: (error) => {
          console.error('File upload failed', error);
        },
      },
    }}
  ```

### Fixes
- Fixed an issue where the channel UI's scroll did not work after sending a new message. This issue was specific to the NextJS environment.


## [v3.15.1] (Aug 29, 2024)

### Fixes
- Fixed unread count badge position on the ChannelPreview item component.

## [v3.15.0] (Aug 29, 2024)

### Features
- UIKit now supports form messages! Messages with `messageForm` will be displayed as form messages.
  - Added `enableFormTypeMessage` global option
    - How to use?
    ```tsx
    <App
      appId={appId}
      userId={userId}
      uikitOptions={{
        groupChannel: {
          // Below turns on the form message feature. Default value is false.
          enableFormTypeMessage: true,
        }
      }}
    />
    ```
  - `MessageInput` is now being disabled if a channel has a form message that is not submitted and its `extendedMessagePayload['disable_chat_input']` value is true
  - Added `FormMessageItemBody`, and `FormInput`
- Added support for EmojiCategory. You can now filter emojis for different messages when adding Reactions to a message.
- Added `filterEmojiCategoryIds` to `GroupChannelProvider` and `ThreadProvider`.
  - How to Use
  ```tsx
  const filterEmojiCategoryIds = (message: SendableMessage) => {
      if (message.customType === 'emoji_category_2') return [2];

      return [1];
  }

  <GroupChannel 
    filterEmojiCategoryIds={filterEmojiCategoryIds}
  />
  ```
  - Note: You need to set your custom EmojiCategory using [Sendbird Platform API](https://sendbird.com/docs/chat/platform-api/v3/message/reactions-and-emojis/reactions-and-emojis-overview) in advance. 
- Added sub-rendering props to the `ThreadListItem` and `ThreadListItemContent` components.
  - Added props list: `renderSenderProfile`, `renderMessageBody`, `renderMessageHeader`, `renderEmojiReactions`, and `renderMobileMenuOnLongPress`.
  - How to use:
  ```tsx
  const CustomThread = () => (
    <ThreadProvider>
      <ThreadUI
        renderMessage={(props) => (
          <ThreadListItem
            {...props}
            renderSenderProfile={() => <></>}
          />
        )}
      />
    </ThreadProvider>
  );
  ```

- Exported subcomponents of `MessageContent`:
  ```tsx
  import { MessageBody, MessageHeader, MessageProfile } from '@sendbird/uikit-react/ui/MessageContent';
  ```

### Fixes
- Fixed broken CSS in Thread:
  - Style was not applied to `ParentMessageInfo` until the first message was received on the thread list.
  - Scroll functionality was not working on the thread list.
- Fixed an issue where HTML entities like `&sect` or `&lt` were automatically converted to symbols when pasted into a contentEditable element, ensuring they are now preserved as plain text.
- Fixed an issue where the style was breaking in messages due to emoji reactions.
- Fixed a bug where y-scroll was not working in `EditUserProfileUIView` when the app was displayed in horizontal view on mobile devices.
- Fixed a bug where an offline banned user was not leaving the channel upon reconnecting in mobile view.
- Fixed thumbnail image overflow in OG messages in open channels.
- Fixed broken file viewer title in mobile view.
- Fixed a bug where markdown messages were incorrectly displayed in channel previews.
- Renamed the prop `onUserProfileMessage` to `onStartDirectMessage`.
  - Deprecated the `onUserProfileMessage` prop in `SendbirdProvider` and `UserProfileProvider`.
  - Deprecated the `onUserProfileMessage` interface in `SendbirdStateContext` and `UserProfileContext`.
  - Use `onStartDirectMessage` instead.

## [v3.14.14] (Aug 1, 2024)

### Features
- Added `forceLeftToRightMessageLayout` to enable LTR message layout display in RTL mode. This helps users who set `htmlTextDirection='rtl'` to keep the message layout in LTR format (outgoing messages on the right, incoming messages on the left).
  ```tsx
  import SendbirdProvider from ‘@sendbird/uikit-react/SendbirdProvider’;
  import ar from 'date-fns/locale/ar';

  const YourComponent() => {
    return (
      <SendbirdProvider
        htmlTextDirection="rtl" // for RTL display
        forceLeftToRightMessageLayout={true} // to enforce the message layout to Left-to-Right direction even though htmlTextDirection is set to ‘rtl’
        dateLocale={ar} // locale setting would be necessary too
        {…other props}
      >
        {...other components}
      </SendbirdProvider>
    )
  }
  ```
- Banned members no longer affect the ChannelSettings/Profile.

### Fixes
- Fixed an issue where the `GroupChannelCollection` was not recreated when `channelListQueryParams` changed. The channel list now refreshes when the values of `channelListQueryParams` are updated.
- Fixed a bug where replied child message width did not fit the content.
- Corrected the direction of some icons in RTL mode. Specifically, the leave channel icon and the broadcast channel icon.
- Fixed an issue where the feedback modal was not displayed on feedback button click in mobile view. No change in desktop view behavior.
- Fixed an issue where banned members affected the ChannelSettings/Profile. Banned members now do not affect these settings.

### Chores
- Omitted `renderUserListItem` of `ChannelSettingsUIProps` from the `ChannelSettingsProps`.

## [v3.14.13] (July 18, 2024)

### Features
- **Address RTL UI Feedback**
  - Fixed an issue where the `htmlTextDirection` prop didn't work when using `SendbirdProvider`, but only worked in the App module.
  - Updated the paper plane icon to point left instead of right in RTL mode.

- **Message Menu Customization in Threads**
  - Added `renderMessageMenu` and `renderEmojiMenu` props to the `<ParentMessageInfo />`, `<ThreadListItem />`, and `<ThreadListItemContent />` components.
  - **Example usage:**
    ```tsx
    <Thread
      renderMessage={(props) => (
        <ThreadListItem {...props} renderMessageMenu={(props) => (
          <MessageMenu {...props} renderMenuItems={({ items }) => (
            <>
              <items.CopyMenuItem />
              <items.DeleteMenuItem />
            </>
          )} />
        )} />
      )}
    />
    ```

### Fixes
- **Deprecation Marks on Channel & ChannelList Modules**
  - Marked `Channel`, `ChannelProvider`, `ChannelList`, and `ChannelListProvider` as deprecated.
  - For migration guidance, please refer to the [Group Channel Migration Guide](https://sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide#1-group-channel-migration-guide).

### Chore
- **Improve Stability of `useMenuItems`**
  - Improved the stability of the `useMenuItems` hook.
  - Exported `ChannelListQueryParamsType`.
  - Moved the `renderUserListItem` prop to the Provider from the UI component.
  - Exported the `ChannelSettingsMenuItem` component.
- Added `interop: "compat"` setting for the CommonJS output in Rollup Config to enhance the compatibility between ESM and CJS.


## [v3.14.12] (July 3, 2024)

### Features
- **RTL Support**
  - Added `htmlTextDirection` prop to `SendbirdProvider` to support Right-To-Left (RTL) text direction for Middle East customers. [Read more](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dir).
  ```tsx
  import ar from 'date-fns/locale/ar';
  <SendbirdProvider
    ...
    htmlTextDirection={'rtl' | 'ltr'}
    // Setting a proper value to dateLocale would be necessary
    dateLocale={ar}
  >
  </SendbirdProvider>
  ```

- **DX Improvements: ChannelSetting SettingMenu**
  - Added new components and hooks to make the menu items in the `ChannelSettingsUI` more modular and customizable.
  - New Files:
    - `useMenuItems.tsx`: Custom hook for menu items based on user roles.
    - `MenuItem.tsx`: Reusable and customizable menu item component.
    - `MenuListByRole.tsx`: Renders a list of menu items based on user roles.
  - **Example usage:**
    To customize the moderation panel with selected menu items:
    ```tsx
    import React from 'react';
    import ChannelSettingsUI from '@sendbird-uikit/ChannelSettings/components/ChannelSettingsUI';
    import useMenuItems from '@sendbird-uikit/ChannelSettings/hooks/useMenuList';

    const CustomChannelSettings = () => {
      const menuItems = useMenuItems();

      const renderCustomModerationPanel = () => {
        // Create a new object by selecting only the desired menu items.
        const customMenuItems = {
          operator: {
            operators: menuItems.operator.operators, // Keep the operators menu
            allUsers: menuItems.operator.allUsers, // Keep the all users menu
            // Add or remove other menu items as needed.
          },
          nonOperator: {
            allUsers: menuItems.nonOperator.allUsers, // Keep the all users menu
            // Add or remove other menu items as needed.
          },
        };

        return <MenuListByRole menuItems={customMenuItems} />;
      };

      return (
        <ChannelSettingsUI renderModerationPanel={renderCustomModerationPanel} />
      );
    };

    export default CustomChannelSettings;
    ```

- DX Improvements: ChannelSetting UserListItem
  - `UserListItemMenu` has been newly created
  - Provided it as a module which also contains `UserListItemMenuProvider` and `useUserListItemMenuContext`
    ```tsx
    import { UserListItemMenu, UserListItemMenuProvider, useUserListItemMenuContext } from '@sendbird/uikit-react/ui/UserListItemMenu';
    ```
  - Added new `renderUserListItem` props to the list components of `ChannelSettings`:
    * `OperatorList`, `MemberList`, `MutedMemberList`, `BannedUserList`
  - Exported the following modules:
    * `OperatorList`, `MemberList`, `MutedMemberList`, `BannedUserList`
    ```tsx
    import { OperatorList, MemberList, MutedMemberList, BannedUserList } from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';
    ```
  - Merged `ui/UserListItem` and `ChannelSettings/components/UserListItem`:
    * Use `ui/UserListItem` from now on
    * Added `size` prop to `UserListItem`, which now accepts two values: 'normal' and 'small' ('small' replaces the previous `ChannelSettings/components/UserListItem`)
      * `normal`: Used primarily in Modals
      * `small`: Used primarily in Lists
  - **Example usage:**
    ```tsx
    <ChannelSettings
      renderUserListItem={(props) => (
        <UserListItem {...props}
          renderListItemMenu={(props) => (
            <UserListItemMenu
              {...props}
              onToggleOperatorState={({ user, newState, error }) => {/** Handle operator state change */}}
              onToggleMuteState={({ user, newState, error }) => {/** Handle mute state change */}}
              onToggleBanState={({ user, newState, error }) => {/** Handle ban state change */}}
              renderTrigger={({ ref }) => (<div ref={ref}>{/** Render your custom trigger icon here */}</div>)}
              renderMenuItems={({ items }) => (
                <>
                  <items.OperatorToggleMenuItem />
                  <items.MuteToggleMenuItem />
                  <items.BanToggleMenuItem />
                </>
              )}
            />
          )}
        />
      )}
    />
    ```

### Fixes
- Fixed image file viewer header style 
- Disabled `isSuperGroupReactionsEnabled` setter
- Use `APP_LAYOUT_ROOT` to get the area info of the UIKit
  ```tsx
  export const APP_LAYOUT_ROOT = 'sendbird-app__layout';
  ```
  * To ensure the menu positions are calculated correctly, wrap the entire area using `SendbirdProvider` with a tag that has the specified ID.

### Chore
- Updated `@sendbird/chat` version to 4.13.0
  - Improved channel/message refreshing performance utilizing LocalCaching.


## [v3.14.11] (June 20, 2024)
### Features
- Markdown Support for Text Messages
  - Added `enableMarkdownForUserMessage` to `UIKitOptions`. When enabled, markdown syntaxes for bold and link are now applied to user messages.

- Descriptive Color Names Support
  - Users can now customize the color set using more descriptive color names instead of numerical codes.
  - Added a color map parsing utility function, `mapColorKeys`, to support both new and existing color names.
  - Detailed color name mappings:
     1. Primary, Secondary, Error, information
    ```
    Primary-500 -> Primary-extra dark
    Primary-400 -> Primary-dark
    Primary-300 -> Primary-main
    Primary-200 -> Primary-light
    Primary-100 -> Primary-extra light

    Secondary-500 -> Secondary-extra dark
    Secondary-400 -> Secondary-dark
    Secondary-300 -> Secondary-main
    Secondary-200 -> Secondary-light
    Secondary-100 -> Secondary-extra light
    ```
    2. Background 100~700: No changes
    3. Overlay
    ```
    Overlay-01 -> Overlay-dark
    Overlay-02 -> Overlay-light
    ```
    4. OnLight & OnDark
    ```
    // On Light
    On Light-01 -> Onlight-text-high-emphasis
    On Light-02 -> Onlight-text-mid-emphasis
    On Light-03 -> Onlight-text-low-emphasis
    On Light-04 -> Onlight-text-disabled
    // On Dark
    On Dark -01 -> Ondark-text-high-emphasis
    On Dark -02 -> Ondark-text-mid-emphasis
    On Dark -03 -> Ondark-text-low-emphasis
    On Dark -04 -> Ondark-text-disabled
    ```

- Message Menu Component Refactor
  - Created `MessageMenuProvider`, `useMessageMenuContext`, and `MessageMenu` component.
  - Replaced `MessageItemMenu` with `MessageMenu` in **GroupChannel**. Future PR will apply it to Thread.
  - Migrated `MobileContextMenu` and `MobileBottomSheet` using `MessageMenuProvider`.
  - Exported the `MobileMenu`
    ```tsx
    import { MobileMenu, MobileContextMenu, MobileBottomSheet } from '@sendbird/uikit-react/ui/MobileMenu';
    ```
  - How to use?

    Desktop menu
    ```tsx
    import GroupChannel from '@sendbird/uikit-react/GroupChannel';
    import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
    import { MessageMenu } from '@sendbird/uikit-react/ui/MessageMenu';

    const GroupChannelPage = () => (
      <GroupChannel
        renderMessageContent={(props) => (
          <MessageContent
            {...props}
            renderMessageMenu={(props) => (
              <MessageMenu
                {...props}
                renderMenuItems={(props) => {
                  const {
                    CopyMenuItem,
                    ReplyMenuItem,
                    // ...
                    DeleteMenuItem,
                  } = props.items;
                  // organize the menu items using the items
                  return (
                    <>
                      <CopyMenuItem />
                      <DeleteMenuItem />
                    </>
                  );
                }}
              />
            )}
          />
        )}
      />
    );
    ```
    Mobile menu
    ```tsx
    import GroupChannel from '@sendbird/uikit-react/GroupChannel';
    import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
    import { MobileMenu } from '@sendbird/uikit-react/ui/MessageMenu';

    const GroupChannelPage = () => (
      <GroupChannel
        renderMessageContent={(props) => (
          <MessageContent
            {...props}
            renderMobileMenuOnLongPress={(props) => (
              <MobileMenu
                {...props}
                renderMenuItems={(props) => {
                  const {
                    CopyMenuItem,
                    ReplyMenuItem,
                    // ...
                    DeleteMenuItem,
                  } = props.items;
                  // organize the menu items using the items
                  return (
                    <>
                      <CopyMenuItem />
                      <DeleteMenuItem />
                    </>
                  );
                }}
              />
            )}
          />
        )}
      />
    );
    ```

### Fixes
- Fixed an issue where the `newMessages` array was not being reset even after the message list scroll reached the bottom, causing the message notification bar to not disappear properly. Manually called `resetNewMessages()` under certain conditions.
- Updated the logic to align with other platforms for consistency. Relocated the logic to the same section where other `disabled` conditions are checked.

## [v3.14.10] (June 13, 2024)
### Fixes
- Replaced onlight-05 with onlight-03 since onlight-05 doesn't exist in the product design guide.
- Added the `onClose` event to the modals inside of the `FileViewer` components.

## [v3.14.9] (June 7, 2024)
### Fixes
- Resolved an issue where M4A format audio files were not playing in Safari. M4A files are now parsed as `audio/x-m4a` to ensure proper playback.
- Prevented the newly created channels from being filtered out from the ChannelList.

### Features
- Added a modal to the `FileViewer` components for utilizing the `onMounted` event handler.


## [v3.14.8] (May 30, 2024)
### Fixes
- Resolved the issue of storybook user leaving the channel
- Added a workaround to reset IME in mobile webkit for better input handling
  - This fix involves creating a ghost input to manage focus transitions, preventing the virtual keyboard from closing and ensuring the proper composition of characters like Hangul
  - The ghost input is used to reset the IME context, and focus is moved back to the original input using `requestAnimationFrame` to avoid delays
- Retry connection when failed with a token expired error
- Ensure scroll to the bottom of the list when mounted before painting
- Minor bug fixes and adjustments for `SuggestedReplyItem` component:
  - Fixed a bug where horizontal suggested reply items contents are not wrapping to multiple lines
  - Adjusted bubble size
  - Added missing margin

### Features
- Added support for rendering `.mov` file type only in Safari browser


## [v3.14.7] (May 23, 2024)
### Fixes
* Fixed issue where files that failed to compress were not being sent
* Cleaned up the props of the `ChannelSettings` component to ensure all missed props are applied
* Exported the `ChannelSettingsHeader` component as default
  ```
  import ChannelSettingsHeader from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsHeader'
  ```
* Fixed the issue where the mention feature did not work properly in the input component
* Fixed the issue where unnecessary spaces were added between mention texts when editing an already mentioned message
* Improved the scroll position flickering issue when loading previous messages
* Implemented an attempt to load based on screen size threshold
* Added `data-testid` to the UI components for making it easily to select them in the QE test

### Features
* Added `MESSAGE_INPUT__PLACE_HOLDER__FROZEN` to StringSet: `'Chat is unavailable in this channel'`

## [v3.14.6] (May 10, 2024)
### Fixes
* Fixed a bug where import statements are not located at the top of the extracted index.css file

## [v3.14.5] (May 04, 2024)
### Fixes
* Fixed a bug where channel scroll to bottom is not called internally when last message is updated with suggested replies

## [v3.14.4] (May 02, 2024)
### Features
* Added `suggestedRepliesDirection` global option which serves as vertical/horizontal scroll option for `SuggestedReplies`
  * How to use?
  ```tsx
  <App
    appId={appId}
    userId={userId}
    uikitOptions={{
      groupChannel: {
        // Below turns on the `SuggestedReplies` feature (see v3.8.0 release changelog). Default value is false.
        enableSuggestedReplies: true,
        // Below changes scroll direction from horizontal to vertical.
        suggestedRepliesDirection: 'vertical'
      }
    }}
  />
  ```
* Added a new ui component `Header` (`import Header from '@sendbird/uikit-react/ui/Header'`) which replaced all existing header components
### Fixes
* Fixed a bug where suggested replies are incorrectly displayed when `showSuggestedRepliesFor` is set to 'last_message_only'


## [v3.14.3] (Apr 19, 2024)
### Features
* Add outputFormat to the image compression options
  ```tsx
  <SendbirdProvider
    ...
    imageCompression={{
      outputFormat: 'preserve' | 'png' | 'jpeg',
    }}
  >
  </SendbirdProvider>
  ```
### Fixes
* Set the message list padding with `12px` in the mobile mode

## [v3.14.2] (Apr 18, 2024)
### Fixes
* Fixed a bug where right padding is added to messages sent by me in mobile devices
* Removed image section in the OGMessageItemBody if there is no og image
* Fixed that safely opens URL to prevent XSS
* Fixed that copying URI-list issue in the iOS device/Safari
* Fixed that channel badge count is not updated on iOS Webview

## [v3.14.1] (Apr 12, 2024)
### Fixes
* Fixed a bug where injecting an optional property with null value not rendering the expected default component
* Updated the type of `renderMessage` in the `OpenChannel` module
* Deprecated the renderInput prop and add a new `renderMessageInput` prop

## [v3.14.0] (Apr 5, 2024)
### Feature
- `TemplateMessageItemBody` now supports `CarouselView` type template
- Added 'wide' width support for `MessageContent` when value exists in `message.extendedMessagePayload['ui']['container_type']`
- Added template version validation for `TemplateMessageItemBody`

### Message template fixes/updates
- Fixed a bug where argb color values are not converted to rgba
- Fixed a bug where style properties expecting numeric values are set with string values
- Removed default values of `borderRadius`, `backgroundColor`, and `color` for message template items

### Other fixes
- Fixed a bug where scroll bar is displayed in message sender name container

## [v3.13.5] (Apr 5, 2024)

### Fixes
* Add a logger to the GroupChannelProvider for failing get channel
* Reduce the OGTag height in the mobile layout
* Prevent force refreshing of the ChannelSettings
* Keep context menu when failing the member operations (register/unregister operator, mute/unmute)
* Keep profile image during member operations on the MembersModal

## [v3.13.4] (Mar 27, 2024)

### Feature
* Support the `Emoji Reactions` feature in the super group channel
  * However, the `Tooltip` displaying who reacted will only appear in the normal group channel, not in the super group channel.
* Export the `MessageFeedbackFailedModal` component for consistency with other message feedback-related components.

## [v3.13.3] (Mar 22, 2024)

### Features
* Added a `renderMenuItem` to the `MessageMenu` component
  * How to use?
  ```tsx
  <GroupChannel
    renderMessageContent={(props) => (
      <MessageContent
        {...props}
        renderMessageMenu={(props) => (
          <MessageMenu
            {...props}
            renderMenuItem={(props) => {
              const {
                className,
                onClick,
                dataSbId,
                disable,
                text,
              } = props;
              return <MenuItem /> // Render Custom Menu Item
            }}
          />
        )}
      />
    )}
  />
  ```
* Added `onBeforeDownloadFileMessage` to the `<GroupChannel />` and `<Thread />` modules
  * How to use?
  ```tsx
  const ONE_MB = 1024 * 1024;
  /**
    * Use this list to check if it's displayed as a ThumbnailMessage.
    * (https://github.com/sendbird/sendbird-uikit-react/blob/main/src/utils/index.ts)
  */
  const ThumbnailMessageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp', // not supported in IE
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/mp4',
  ];

  <GroupChannel // or Thread
    onBeforeDownloadFileMessage={async ({ message, index = null }) => {
      if (message.isFileMessage()) {
        const confirmed = window.confirm(`The file size is ${(message.size / ONE_MB).toFixed(2)}MB. Would you like to continue downloading?`);
        return confirmed;
      }
      if (message.isMultipleFilesMessage()) {
        const confirmed = window.confirm(`The file size is ${(message.fileInfoList[index].fileSize / ONE_MB).toFixed(2)}MB. Would you like to continue downloading?`);
        return confirmed;
      }
      return true;
    }}
  />
  ```
* Added `onDownloadClick` to the `FileViewer`, `FileViewerView`, `MobileBottomSheet`, `MobileContextMenu`, and `MobileMenu`

### Fixes
* Improved the stability of the ChannelSettings Modals
  * Support menu on the `MembersModal`, `MutedMembersModal`, and `OperatorsModal`
  * Display `Operator` description on the `MembersModal`
* Fixed the `width` size of the `OGMessageItemBody` component
* Added fallback logic on template rendering error
* Replaced the hardcoded text ` (You)` with the StringSet `CHANNEL_SETTING__MEMBERS__YOU` in the `UserListItem`

## [v3.13.2] (Mar 14, 2024)

### Features
* Added a `renderHeader` props to the ChannelSettingsUIProps
  ```
  <ChannelSettingsUI
    renderHeader={() => ...}
  />
  ```

### Fixes
* Deprecated the `onClick` prop in `UserListItem` and added `onUserAvatarClick`. The deprecated prop will be removed in the next major version
* Added throttling in `mute/unmute` operation
* Added throttling in `add/remove` operator operation
* Fixed that the Chat SDK is not initialized more than once
* Display the normal `FileMessage` for the `.mov` video
* Show `X` button on the ModalHeader of mobile mode
* Modify the incorrect stringSet on the BannedUsersModal
  * `CHANNEL_SETTING__MUTED_MEMBERS__TITLE` to `CHANNEL_SETTING__BANNED_MEMBERS__TITLE`
  * `CHANNEL_SETTING__MODERATION__BAN` to `CHANNEL_SETTING__MODERATION__UNBAN`
  * also modified the dataSbId, `channel_setting_banned_user_context_menu_ban` to `channel_setting_banned_user_context_menu_unban`
* Fixed a specific environment issue (Android emulator) - Resolved an issue in modals used in ChannelSettings such as MembersModal, MutedMembersModal, AddOperatorsModal, OperatorsModal, BannedUsersModal, where even when scrolling to the end, additional members were not fetched
* Fixed a specific environment issue (Safari) - Similarly addressed an issue within lists inside modals, where overflow occurred instead of scrolling

## [v3.13.1] (Mar 08, 2024)

### Fixes
- Fixed a GroupChannel scroll issue on Safari when scrollBehavior is set to smooth
- Fixed the case where the calculation of the input height in the chat window was not functioning properly

## [v3.13.0] (Feb 29, 2024)
#### Template message feature
Now we are supporting template message feature!

A message with valid `extendedMessagePayload.template` value will be displayed with `TemplateMessageItemBody`.

* Added new ui components:
  * `MessageTemplate`
  * `TemplateMessageItemBody`
  * `FallbackTemplateMessageItemBody`
  * `LoadingTemplateMessageItemBody`

#### Others
* Added `showSuggestedRepliesFor` global option
  * How to use?
  ```tsx
  <App
    appId={appId}
    userId={userId}
    uikitOptions={{
      groupChannel: {
        // Below setting always shows `SuggestedReplies` component of a message. Default value is 'last_message_only'.
        showSuggestedRepliesFor: 'always',
      }
    }}
  />
  ```
* Added `renderSuggestedReplies` in `Message` module
  * How to use?
  ```tsx
  <Channel
    renderSuggestedReplies={(suggestedRepliesProps) => {
      const { replyOptions, onSendMessage, message } = suggestedRepliesProps;
      return <CustomSuggestedReplies options={replyOptions} />;
    }}
  />
  ```
* Added `renderMobileMenuOnLongPress` in `MessageContentProps`
  * How to use?
  ```tsx
  <Channel
    renderMessageContent={(props) => (
      <MessageContent
        {...props}
        renderMobileMenuOnLongPress={(mobileMenuProps: MobileBottomSheetProps) => (
          <CustomMobileMenu {...mobileMenuProps} />
        )}
      />
    )}
  />
  ```

### Fixes
- Fixed a bug where bouncing animation is applied to pending message
- Fixed a bug `useChannelSettingsContext` not returning channel on initial mount due to channel requests being made before the SDK connection success

## [v3.12.1] (Feb 26, 2024)

### Fixes:
- Added loading status to the `ChannelSettings` module and addressed some layout issues
- Added support for multiple lines in the `MessageInput` on mobile devices
- Fixed hard-coded text to localization text for uploading file size and count limits
- Fixed the `MessageListParams` type in the `ChannelProvider`
- Fixed requests for empty image paths during the image optimization process
- Fixed an infinite loop issue occurring when using the `GroupChannel/components/Message` and `Channel/components/Message` components in the `renderMessage` method of the `GroupChannel` and `Channel` modules
- The `renderMessage` method of the `GroupChannel` module no longer nests messages under the `Message` component. If a container element for the `Message` component is needed, use it as follows:
  ```tsx
  import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
  import { Message } from '@sendbird/uikit-react/GroupChannel/components/Message';
  
  const GroupChannelPage = () => {
    return (
      <GroupChannel
        renderMessage={(props) => {
          return (
            <Message message={props.message}>
              <div>{props.message.messageId}</div>
            </Message>
          )
        }}
      />
    )
  }
  ```

- The `renderMessage` prop of the `Channel/components/Message` and `GroupChannel/components/Message` components has been deprecated. Instead, use the `children` prop to customize message sub-elements
  ```tsx
  <Message message={props.message}>
    <div>{props.message.messageId}</div>
  </Message>
  ```

- Added detailed comments for customizing-related props in the `GroupChannel` module


## [v3.12.0] (Feb 16, 2024)

### Features:
* Local cache is enabled by default
  * If desired, it can be disabled using sdkInitParams
  ```tsx
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
  
  const App = () => (
    <SendbirdProvider
      // ...
      sdkInitParams={{ localCacheEnabled: false }}
    />
  )
  ```
* Added `GroupChannel` and `GroupChannelList` modules.
  * With the introduction of `GroupChannel` and `GroupChannelList`, a new local caching feature has been added, allowing you to experience a more efficient chat environment.
    We provide a massive component called `App` that combines all the features. From now on, this component will use `GroupChannel` and `GroupChannelList` instead of `Channel` and `ChannelList`.
    If you wish to continue using `Channel` and `ChannelList`, you can use `enableLegacyChannelModules` to ensure the previous components are still available for use.
    ```tsx
    import SendbirdApp from '@sendbird/uikit-react/App';
      
    const App = () => (
      <SendbirdApp
        // ...
        enableLegacyChannelModules
      />
    );
    ```
  * You can find detailed changes, usage instructions, and migration methods in the document here: [Migration Guide](https://github.com/sendbird/sendbird-uikit-react/blob/main/MIGRATION_COLLECTION.md)

### Fixes:

* Fixed a bug where the session refresh failed when the `accessToken` was changed [#969](https://github.com/sendbird/sendbird-uikit-react/pull/969)
* Fixed a bug causing infinite loading when the channel is not selected in the Channel module [#970](https://github.com/sendbird/sendbird-uikit-react/pull/970)
* Fixed a bug where the mention feature was not functioning properly [#971](https://github.com/sendbird/sendbird-uikit-react/pull/971)
* Fixed a bug where URLs with numbered top-level domains were treated as links [#972](https://github.com/sendbird/sendbird-uikit-react/pull/972)
* Fixed a bug where message scroll delays were inconsistently applied [#975](https://github.com/sendbird/sendbird-uikit-react/pull/975)
* Fixed a bug where `isUserIdUsedForNickname` was not functioning properly [#976](https://github.com/sendbird/sendbird-uikit-react/pull/976)
* Optimized the rendering of `SendbirdProvider`
* Optimized the SDK initialization logic for StrictMode

## [v3.11.1] (Feb 08, 2024)

### Fixes:

* Fixed `acceptableMimeTypes` to support web standard format
* Fixed a bug where `renderChannelHeader` is not passed properly

## [v3.11.0] (Feb 07, 2024)

### Features:
* Added `enableSuggestedReplies` global option
  * How to use?
  ```tsx
  <App
    appId={appId}
    userId={userId}
    uikitOptions={{
      groupChannel: {
        // Below turns on the `SuggestedReplies` feature (see v3.8.0 release changelog). Default value is false.
        enableSuggestedReplies: true,
      }
    }}
  />
  ```
* `MessageInput` is now being disabled if `channel.lastMessage.extendedMessagePayload['disable_chat_input']` is true

### Fixes:

* Fixed a bug where channel is being removed from my channel list when other member leaves the channel
* Fixed a bug where channel avatar image is not updated when a member leaves, or joins, or `profileUrl` changes
* Fixed a bug where `ChannelListUI` is not updated when network is reconnected
* Fixed a bug in `ChannelList` where `activeChannelUrl` is set but `onChannelSelect` fires with null after loading `ChannelList`
* Fixed a bug where url text wrapped around special characters not parsed as link
* Fixed a bug where space character before url text is removed in sent message
* Fixed a runtime error occurring when using `renderMessage` of `Channel` module

## [v3.10.1] (Jan 26, 2024)

### Fixes:

* Fixed a bug where `MessageList` is not scrolled to bottom upon entering a channel
* Changed behaviour of the feedback process:
  * old: On feedback icon button click -> open feedback form/menu
  * new: On feedback icon button click -> submit feedback -> open feedback form/menu
* Supported accepting `mimeTypes` to the `MessageInput`
* Applied the `channelListQuery.order` to the `ChannelList`
* Fixed a bug where muted member list is not being updated after a member had been unmuted
* Fixed a bug where operator list is not being updated after an operator had been removed
* Fixed a bug where a link subdomain has a hyphen or long top-level domain is not recognized as link text

## [v3.10.0] (Jan 19, 2024)

### Features:
#### Feedback message feature
Now we are supporting Feedback Message feature!
Feedback message feature can be turned on through `enableFeedback` option. When turned on, feedback feature is applied to messages with non default `myFeedbackStatus` values.

* Added `enableFeedback` global option
  * How to use?
  ```tsx
  <App
    appId={appId}
    userId={userId}
    uikitOptions={{
      groupChannel: {
        // Below turns on the feedback message feature. Default value is false.
        enableFeedback: true,
      }
    }}
  />
  ```

#### Others

* Added `labelType`, and `labelColor` props to `ButtonProps`
* Added `renderMessageContent` in `ChannelUIProps`
  * Now you can customize `MessageContent` through `Channel` in two ways:
    1. Customize with `renderMessage`
      ```tsx
      <Channel
        renderMessage={(props) => (
          <Message
            {...props}
            renderMessageContent={(props) => (
              <MessageContent {...props} />
            )}
          />
        )}
      />
      ```
    2. **[Simpler]** Customize with `renderMessageContent`
      ```tsx
      <Channel
        renderMessageContent={(props) => (
          <MessageContent {...props} />
        )}
      />
      ```
  
### Fixes:

* Fixed a bug in mobile view where channel view is displaying a default channel when there is no channel in channel list
* Added missing props renderMessageContent in Channel
* Fixed a bug where center alignment of `Badge` and `Button` components breaking in FireFox browser
* Fixed a bug where messages sent by bot member in group channel are not triggering the expected hooks (Original Author: [ishubham21](https://github.com/ishubham21))

## [v3.9.3] (Jan 5, 2024)

### Fixes:
* **Refactor `--sendbird-vh` CSS Variable Logic in InviteUsers Component**
  - Improved code readability by moving logic to the `InviteUsers` component.
  - [GitHub PR #899](https://github.com/sendbird/sendbird-uikit-react/pull/899) (CLNP-1806)
* **Prevent Access to `window` in SSR Environments**
  - Fixed server-side rendering issues in NextJS by preventing access to the `window` object. (Original Author: [Aaron James King](https://github.com/AaronJamesKing))
  - [GitHub PR #900](https://github.com/sendbird/sendbird-uikit-react/pull/900) (SBISSUE-14287)
* **Update Channel View to Show `NO_CHANNEL` Placeholder**
  - Channel view now displays `NO_CHANNEL` placeholder after leaving all channels. (Original Author: [Alden Quimby](https://github.com/aldenquimby))
  - [GitHub PR #901](https://github.com/sendbird/sendbird-uikit-react/pull/901)
* **Fix Replay of Voice Memos**
  - Resolved the issue preventing the replay of voice memos. (Original Author: [Alden Quimby](https://github.com/aldenquimby))
  - [GitHub PR #902](https://github.com/sendbird/sendbird-uikit-react/pull/902)
* **Resolve Image Upsizing Issue in ImageCompression**
  - Fixed the issue with image upsizing in ImageCompression. (Original Author: [GitHub User](https://github.com/GitHubUser)) (CLNP-1832)
  - [GitHub PR #903](https://github.com/sendbird/sendbird-uikit-react/pull/903)
* **Update Peer Dependencies for npm Install**
  - Addressed peer dependencies issues in npm install. (Original Author: [GitHub User](https://github.com/GitHubUser))
  - [GitHub PR #905](https://github.com/sendbird/sendbird-uikit-react/pull/905)
* **Fix Scroll Behavior in Open Channel**
  - Fixed scroll behavior when sending a message in an open channel. (Original Author: [GitHub User](https://github.com/GitHubUser))
  - [GitHub PR #906](https://github.com/sendbird/sendbird-uikit-react/pull/906)
* **Fix Cross-Site Scripting Vulnerability in OGTag**
  - Fixed cross-site scripting vulnerability in OGTag. (Original Author: [GitHub User](https://github.com/GitHubUser))
  - [GitHub PR #907](https://github.com/sendbird/sendbird-uikit-react/pull/907)

## [v3.9.2] (Dec 15 2023)

### Fixes:
  * Fixed scroll issues
    * Maintain scroll position when loading previous messages.
    * Maintain scroll position when loading next messages.
    * Move the logic that delays rendering mmf to the correct location.
    * Resolve an issue where scroll position wasn't adjusting correctly when the message content size was updated (caused by debouncing scroll events).
    * Use message animation instead of highlighting when moving to a message with message search
  * Reset text display issue
    * Fix the appearance of incomplete text compositions from the previous input in the next input.
  * Fixed type errors
    * Resolve the type error related to `PropsWithChildren`.
    * Address the issue of not being assignable to type error, where the property 'children' doesn't exist on type `PropsWithChildren`.
    * Use `PropsWithChildren<unknown> `instead of `PropsWithChildren`.
  * Fixed a voice message length parsing issue
    * Include metaArray to the message list when fetching messages again by connecting

## [v3.9.1] (Dec 8 2023)

### Features:
  * Improved image loading speed by implementing lazy load with `IntersectionObserver`
  * Replaced lamejs binary
  * Applied the `uikitUploadSizeLimit` to the Open Channel Message Input
    * Check the file size limit when sending file messages from Open Channel
    * Display the modal alert when the file size over the limit
### Fixes:
  * Fixed a bug where the admin message disappears when sending a message
  * Recognized the hash property in the URL
  * Fixed a bug where resending MFM fails in the thread
  * Group channel user left or banned event should not be ignored
  * Removed left 0px from `<Avatar />` component to fix ruined align
  * Applied StringSet for the file upload limit notification
  * Updated currentUserId properly in the channel list initialize step.
    * Fixed group channel doesn't move to the top in a channel list even though `latest_last_message` is the default order.

### Improvements:
  * Divided `<EditUserProfileUI />` into Modal and View parts
  * Added a message prop to `<ReactionItem />` component
  * Improved the storybook of `<EmojiReactions />`

## [v3.9.0] (Nov 24 2023)

### Features:
#### Typing indicator bubble feature

`TypingIndicatorBubble` is a new typing indicator UI that can be turned on through `typingIndicatorTypes` option. When turned on, it will be displayed in `MessageList` upon receiving typing event in real time.

* Added `typingIndicatorTypes` global option
* Added `TypingIndicatorType` enum
  * How to use?
  ```tsx
  <App
    appId={appId}
    userId={userId}
    uikitOptions={{
      groupChannel: {
        // Below turns on both bubble and text typing indicators. Default is Text only.
        typingIndicatorTypes: new Set([TypingIndicatorType.Bubble, TypingIndicatorType.Text]),
      }
    }}
  />
  ```
* Added `TypingIndicatorBubble`
  * How to use?
  ```tsx
  const moveScroll = (): void => {
    const current = scrollRef?.current;
    if (current) {
      const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
      if (scrollBottom < bottom && scrollBottom < SCROLL_BUFFER) {
        // Move the scroll as much as the height of the message has changed
        current.scrollTop += bottom - scrollBottom;
      }
    }
  };
  
  return (
    <TypingIndicatorBubble
      typingMembers={typingMembers}
      handleScroll={moveScroll} // Scroll to the rendered typing indicator message IFF current scroll is bottom.
    />
  );
  ```

#### Others
* Added support for `eventHandlers.connection.onFailed` callback in `setupConnection`. This callback will be called on connection failure
  * How to use?
  ```tsx
    <Sendbird
      appId={appId}
      userId={undefined} // this will cause an error 
      eventHandlers={{
        connection: {
          onFailed: (error) => {
            alert(error?.message); // display a browser alert and print the error message inside
          }
        }
      }}
    >
  ```
* Added new props to the `MessageContent` component: `renderMessageMenu`, `renderEmojiMenu`, and `renderEmojiReactions`
  * How to use?
  ```tsx
  <Channel
  renderMessageContent={(props) => {
    return <MessageContent
      {...props}
      renderMessageMenu={(props) => {
        return <MessageMenu {...props} />
      }}
      renderEmojiMenu={(props) => {
        return <MessageEmojiMenu {...props} />
      }}
      renderEmojiReactions={(props) => {
        return <EmojiReactions {...props} />
      }}
    />
  }}
  />
  ```
* Added `onProfileEditSuccess` prop to `App` and `ChannelList` components
* Added `renderFrozenNotification` in `ChannelUIProps`
  * How to use?
  ```tsx
    <Channel
      channelUrl={channelUrl}
      renderFrozenNotification={() => {
        return (
          <div
            className="sendbird-notification sendbird-notification--frozen sendbird-conversation__messages__notification"
          >My custom Frozen Notification</div>
        );
      }}
    />
  ```
* Exported `VoiceMessageInputWrapper` and `useHandleUploadFiles`
  * How to use?
  ```tsx
  import { useHandleUploadFiles } from '@sendbird/uikit-react/Channel/hooks/useHandleUploadFiles'
  import { VoiceMessageInputWrapper, VoiceMessageInputWrapperProps } from '@sendbird/uikit-react/Channel/components/MessageInput'
  ```

### Fixes:
* Fixed a bug where setting `startingPoint` scrolls to the middle of the target message when it should be at the top of the message
* Applied dark theme to the slide left icon
* Fixed a bug where changing current channel not clearing pending and failed messages from the previous channel
* Fixed a bug where the thumbnail image of `OGMessage` being displayed as not fitting the container
* Fixed a bug where resending a failed message in `Thread` results in displaying resulting message in `Channel`
* Fixed a bug where unread message notification not being removed when scroll reaches bottom

### Improvement:
* Channels list no longer displays unread message count badge for focused channel


## [v3.8.2] (Nov 10 2023)

### Features:
* `MessageContent` is not customizable with three new optional properties:
  * `renderSenderProfile`, `renderMessageBody`, and `renderMessageHeader`
  * How to use?
    ```tsx
    import Channel from '@sendbird/uikit-react/Channel'
    import { useSendbirdStateContext } from '@sendbird/uikit-react/useSendbirdStateContext'
    import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
    import MessageContent from '@sendbird/uikit-react/ui/MessageContent'

    const CustomChannel = () => {
      const { config } = useSendbirdStateContext();
      const { userId } = config;
      const { currentGroupChannel } = useChannelContext();
      return (
        <Channel
          ...
          renderMessage={({ message }) => {
            return (
              <MessageContent
                userId={userId}
                channel={currentGroupChannel}
                message={message}
                ...
                renderSenderProfile={(props: MessageProfileProps) => (
                  <MessageProfile {...props}/>
                )}
                renderMessageBody={(props: MessageBodyProps) => (
                  <MessageBody {...props}/>
                )}
                renderMessageHeader={(props: MessageHeaderProps) => (
                  <MessageHeader {...props}/>
                )}
              />
            )
          }}
        />
      )
    }
    ```

### Fixes:
* Fix runtime error due to publishing modules
* Add missing date locale to the `UnreadCount` banner since string
* Use the more impactful value between the `resizingWidth` and `resizingHeight`
  * So, the original images' ratio won't be broken
* Apply the `ImageCompression` to the `Thread` module
* Apply the `ImageCompression` for sending file message and multiple files message

### Improvements:
* Use `channel.members` instead of fetching for non-super group channels in the `SuggestedMentionList`

## [v3.8.1] (Nov 10 2023) - DEPRECATED

## [v3.8.0] (Nov 3 2023)

### Feat:
* Added a feature to support predefined suggested reply options for AI chatbot trigger messages.
* Introduced custom date format string sets, allowing users to customize the date format for `DateSeparators` and `UnreadCount`.
* Exported the `initialMessagesFetch` callback from the hook to provide more flexibility in UIKit customization.

### Fixes:
* Removed duplicate `UserProfileProvider` in `OpenChannelSettings``.
* Removed the logic blocking the addition of empty channels to the ChannelList.
* Fixed a runtime error in empty channels.
* Added precise object dependencies in effect hooks to prevent unnecessary re-renders in the Channel module.
* Used channel members instead of fetch when searched.

### Chores:
* Migrated the rest of modules & UI components to TypeScript from Javascript.
* Introduced new build settings:
  * Changes have been made to export modules using the [sub-path exports](https://nodejs.org/api/packages.html#subpath-exports) in the `package.json`. If you were using the package in a Native CJS environment, this might have an impact.
  In that case, you can migrate the path as follows:
    ```diff
    - const ChannelList = require('@sendbird/uikit-react/cjs/ChannelList');
    + const ChannelList = require('@sendbird/uikit-react/ChannelList');
    ```
  * TypeScript support also has been improved. Now, precise types based on the source code are used.

## [v3.7.0] (Oct 23 2023)

### Multiple Files Message
Now we are supporting Multiple Files Message feature!<br/>
You can select some **multiple files** in the message inputs, and send **multiple images** in one message.<br/>
If you select several types of files, only images will be combined in the message and the other files will be sent separately.
Also we have resolved many issues found during QA.

#### How to enable this feature?
You can turn it on in four places.

1. App Component
```tsx
import App from '@sendbird/uikit-react/App'

<App
  ...
  isMultipleFilesMessageEnabled
/>
```
2. SendbirdProvider
```tsx
import { SendbirdProvider } from '@sendbird/uikit-react/SendbirdProvider'

<SendbirdProvider
  ...
  isMultipleFilesMessageEnabled
>
  {...}
</SendbirdProvider>
```
3. Channel
```tsx
import Channel from '@sendbird/uikit-react/Channel';
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context';

<Channel
  ...
  isMultipleFilesMessageEnabled
/>
<ChannelProvider
  ...
  isMultipleFilesMessageEnabled
>
  {...}
</ChannelProvider>
```
3. Thread
```tsx
import Thread from '@sendbird/uikit-react/Thread';
import { ThreadProvider } from '@sendbird/uikit-react/Thread/context';

<Thread
  ...
  isMultipleFilesMessageEnabled
/>
<ThreadProvider
  ...
  isMultipleFilesMessageEnabled
>
  {...}
</ThreadProvider>
```

### Interface change/publish
* The properties of the `ChannelContext` and `ThreadContext` has been changed little bit.
  * `allMessages` of the ChannelContext has been divided into `allMessages` and `localMessages`
  * `allThreadMessages` of the ThreadContext has been divided into `allThreadMessages` and `localThreadMessages`
  * Each local messages includes `pending` and `failed` messages, and the all messages will contain only `succeeded` messages
  * **Please keep in mind, you have to migrate to using the local messages, IF you have used the `local messages` to draw your custom message components.**
* pubSub has been published
  * `publishingModules` has been added to the payload of pubSub.publish
    You can specify the particular modules that you propose for event publishing
  ```tsx
  import { useCallback } from 'react'
  import { SendbirdProvider, useSendbirdStateContext } from '@sendbird/uikit-react/SendbirdProvider'
  import { PUBSUB_TOPICS as topics, PublishingModuleTypes } from '@sendbird/uikit-react/pubSub/topics'

  const CustomApp = () => {
    const globalState = useSendbirdStateContext();
    const { stores, config } = globalState;
    const { sdk, initialized } = stores.sdkStore;
    const { pubSub } = config;

    const onSendFileMessageOnlyInChannel = useCallback((channel, params) => {
      channel.sendFileMessage(params)
        .onPending((pendingMessage) => {
          pubSub.publish(topics.SEND_MESSAGE_START, {
            channel,
            message: pendingMessage,
            publishingModules: [PublishingModuleTypes.CHANNEL],
          });
        })
        .onFailed((failedMessage) => {
          pubSub.publish(topics.SEND_MESSAGE_FAILED, {
            channel,
            message: failedMessage,
            publishingModules: [PublishingModuleTypes.CHANNEL],
          });
        })
        .onSucceeded((succeededMessage) => {
          pubSub.publish(topics.SEND_FILE_MESSAGE, {
            channel,
            message: succeededMessage,
            publishingModules: [PublishingModuleTypes.CHANNEL],
          });
        })
    }, []);

    return (<>...</>)
  };

  const App = () => (
    <SendbirdProvider>
      <CustomApp />
    </SendbirdProvider>
  );
  ```

### Fixes:
* Improve the pubSub&dispatch logics
* Allow deleting failed messages
* Check applicationUserListQuery.isLoading before fetching user list
  * Fix the error message: "Query in progress."
* Fix missed or wrong type definitions
  * `quoteMessage` of ChannelProviderInterface
  * `useEditUserProfileProviderContext` has been renamed to `useEditUserProfileContext`
    ```tsx
    import { useEditUserProfileProviderContext } from '@sendbird/uikit-react/EditUserProfile/context'
    // to
    import { useEditUserProfileContext } from '@sendbird/uikit-react/EditUserProfile/context'
    ```

## [v3.6.10] (Oct 11 2023)
### Fixes:
* (in Safari) Display the placeholder of the MessageInput when the input text is cleared
* Remove duplicated CSS line
* (in iOS) fix focusing on the chat screen starts from the top in Mobile device
* Move to the top in the ChannelList when the current user but a different peer sends a message
  
## [v3.6.9] (Oct 6 2023)
### Fixes:
* Able to see the quoted messages regardless of the ReplyType
* Improve the types of the function props of `ui/MessageInput` component
  ```ts
  interface MessageInputProps {
    ...
    onFileUpload?: (fileList: FileList) => void;
    onSendMessage?: (props: { message: string, mentionTemplate: string }) => void;
    onUpdateMessage?: (props: { messageId: string, message: string, mentionTemplate: string }) => void;
  }
  ```
* Move to the channel list when current user is banned or the channel is deleted in MobileLayout
* Add new iconColor: THUMBNAIL_ICON which doesn't change by theme
* Add some props types that we have missed in the public interface
  * ChannelProvider
    * Add
      ```ts
      interface ChannelContextProps {
        onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
      }
      ```
    * Usage
      ```tsx
      import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'

      <ChannelProvider
        onBeforeSendVoiceMessage={() => {}}
      />
      ```
  * ThreadProvider
    * Add
      ```ts
      interface ThreadProviderProps {
        onBeforeSendUserMessage?: (message: string, quotedMessage?: SendableMessageType) => UserMessageCreateParams;
        onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
        onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
      }
      ```
    * Usage
      ```tsx
      import { ThreadProvider } from '@sendbird/uikit-react/Thread/context'

      <ThreadProvider
        onBeforeSendUserMessage={() => {}}
        onBeforeSendFileMessage={() => {}}
        onBeforeSendVoiceMessage={() => {}}
      />
      ```
  * ui/Button
    * Add
      ```ts
      enum ButtonTypes {
        PRIMARY = 'PRIMARY',
        SECONDARY = 'SECONDARY',
        DANGER = 'DANGER',
        DISABLED = 'DISABLED',
      }
      enum ButtonSizes {
        BIG = 'BIG',
        SMALL = 'SMALL',
      }
      ```
    * Usage
      ```ts
      import Button, { ButtonTypes, ButtonSizes } from '@sendbird/uikit-react/ui/Button'

      <Button
        type={ButtonTypes.PRIMARY}
        size={ButtonSizes.BIG}
      />
      ```
  * ui/Icon
    * Add
      ```ts
      export enum IconTypes {
        ADD = 'ADD',
        ARROW_LEFT = 'ARROW_LEFT',
        ATTACH = 'ATTACH',
        AUDIO_ON_LINED = 'AUDIO_ON_LINED',
        BAN = 'BAN',
        BROADCAST = 'BROADCAST',
        CAMERA = 'CAMERA',
        CHANNELS = 'CHANNELS',
        CHAT = 'CHAT',
        CHAT_FILLED = 'CHAT_FILLED',
        CHEVRON_DOWN = 'CHEVRON_DOWN',
        CHEVRON_RIGHT = 'CHEVRON_RIGHT',
        CLOSE = 'CLOSE',
        COLLAPSE = 'COLLAPSE',
        COPY = 'COPY',
        CREATE = 'CREATE',
        DELETE = 'DELETE',
        DISCONNECTED = 'DISCONNECTED',
        DOCUMENT = 'DOCUMENT',
        DONE = 'DONE',
        DONE_ALL = 'DONE_ALL',
        DOWNLOAD = 'DOWNLOAD',
        EDIT = 'EDIT',
        EMOJI_MORE = 'EMOJI_MORE',
        ERROR = 'ERROR',
        EXPAND = 'EXPAND',
        FILE_AUDIO = 'FILE_AUDIO',
        FILE_DOCUMENT = 'FILE_DOCUMENT',
        FREEZE = 'FREEZE',
        GIF = 'GIF',
        INFO = 'INFO',
        LEAVE = 'LEAVE',
        MEMBERS = 'MEMBERS',
        MESSAGE = 'MESSAGE',
        MODERATIONS = 'MODERATIONS',
        MORE = 'MORE',
        MUTE = 'MUTE',
        NOTIFICATIONS = 'NOTIFICATIONS',
        NOTIFICATIONS_OFF_FILLED = 'NOTIFICATIONS_OFF_FILLED',
        OPERATOR = 'OPERATOR',
        PHOTO = 'PHOTO',
        PLAY = 'PLAY',
        PLUS = 'PLUS',
        QUESTION = 'QUESTION',
        REFRESH = 'REFRESH',
        REPLY = 'REPLY',
        REMOVE = 'REMOVE',
        SEARCH = 'SEARCH',
        SEND = 'SEND',
        SETTINGS_FILLED = 'SETTINGS_FILLED',
        SLIDE_LEFT = 'SLIDE_LEFT',
        SPINNER = 'SPINNER',
        SUPERGROUP = 'SUPERGROUP',
        THREAD = 'THREAD',
        THUMBNAIL_NONE = 'THUMBNAIL_NONE',
        TOGGLE_OFF = 'TOGGLE_OFF',
        TOGGLE_ON = 'TOGGLE_ON',
        USER = 'USER',
      }
      export enum IconColors {
        DEFAULT = 'DEFAULT',
        PRIMARY = 'PRIMARY',
        PRIMARY_2 = 'PRIMARY_2',
        SECONDARY = 'SECONDARY',
        CONTENT = 'CONTENT',
        CONTENT_INVERSE = 'CONTENT_INVERSE',
        WHITE = 'WHITE',
        GRAY = 'GRAY',
        THUMBNAIL_ICON = 'THUMBNAIL_ICON',
        SENT = 'SENT',
        READ = 'READ',
        ON_BACKGROUND_1 = 'ON_BACKGROUND_1',
        ON_BACKGROUND_2 = 'ON_BACKGROUND_2',
        ON_BACKGROUND_3 = 'ON_BACKGROUND_3',
        ON_BACKGROUND_4 = 'ON_BACKGROUND_4',
        BACKGROUND_3 = 'BACKGROUND_3',
        ERROR = 'ERROR',
      }
      ```
    * Usage
      ```ts
      import Icon, { IconTypes, IconColors } from '@sendbird/uikit-react/ui/Icon'

      <Icon
        type={IconTypes.INFO}
        fillColor={IconColors.PRIMARY}
      />
      ```

## [v3.6.8] (Sep 1 2023)
### Feats:
* Update `ui/FileViewer` to support multiple images
  * Modify the props structure
    ```typescript
    export enum ViewerTypes {
      SINGLE = 'SINGLE',
      MULTI = 'MULTI',
    }
    interface SenderInfo {
      profileUrl: string;
      nickname: string;
    }
    interface FileInfo {
      name: string;
      type: string;
      url: string;
    }
    interface BaseViewer {
      onClose: (e: React.MouseEvent) => void;
    }
    interface SingleFileViewer extends SenderInfo, FileInfo, BaseViewer {
      viewerType?: typeof ViewerTypes.SINGLE;
      isByMe?: boolean;
      disableDelete?: boolean;
      onDelete: (e: React.MouseEvent) => void;
    }
    interface MultiFilesViewer extends SenderInfo, BaseViewer {
      viewerType: typeof ViewerTypes.MULTI;
      fileInfoList: FileInfo[];
      currentIndex: number;
      onClickLeft: () => void;
      onClickRight: () => void;
    }
    export type FileViewerComponentProps = SingleFileViewer | MultiFilesViewer;
    ```
* Export misc. utils
  * `Channel/utils/getMessagePartsInfo`
  * `Channel/utils/compareMessagesForGrouping`
  * `Message/hooks/useDirtyGetMentions`
  * `ui/MessageInput/hooks/usePaste`

### Fixes:
* Apply some props which are related to the `metadata` to the ChannelListQuery
  * Add metadataKey, metadataValues, and metadataStartsWith to the Channel.queries.channelListQuery
  * How to use
    ```javascript
    <Channel or ChannelProvider
      queries={{
        channelListQuery: {
          metadataKey: 'isMatching',
          metadataValues: ['true'],
        }
      }}
    />
    ```
* Improve types of `ui/FileViewer` and `Channel/component/FileViewer`
  * Add some props that have been missed
* Fix `<ImageRenderer />` not converting number to pixel string
* Modify the types on useChannelContext & useThreadContext
  * `useChannelContext.setQuoteMessage` should accept `UserMessage | FileMessage`
  * `useThreadContext.sendMessage` should be `string`

## [v3.6.7] (Aug 11 2023)
### Feats:
* Added a new ImageGrid UI component (for internal use only) (#703)
* Introduced `fetchChannelList` to the `ChannelListContext`.
  * Implemented a custom hook function `useFetchChannelList`.
  * Utilized this function to fetch the channel list within the `ChannelListUI` component.
  * Added relevant tests for this function.
  * Provided the method through the `ChannelListContext`: `fetchChannelList`.
  Example Usage:
    ```jsx
    import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
    import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
    import { ChannelListProvider, useChannelListContext } from '@sendbird/uikit-react/ChannelList/context'

    const isAboutSame = (a, b, px) => (Math.abs(a - b) <= px);

    const CustomChannelList = () => {
      const {
        allChannels,
        fetchChannelList,
      } = useChannelListContext();

      return (
        <div
          className="custom-channel-list"
          onScroll={(e) => {
            const target = e.target;
            if (isAboutSame(target.clientHeight + target.scrollTop, target.scrollHeight, 10)) {
              fetchChannelList();
            }
          }}
        >
          {allChannels.map((channel) => {
            return // custom channel list item
          })}
        </div>
      );
    };

    const CustomApp = () => {
      return (
        <div className="custom-app">
          <SendbirdProvider ... >
            <ChannelListProvider ... >
              <CustomChannelList />
            </ChannelListProvider>
          </SendbirdProvider>
        </div>
      );
    };
    ```
### Fixes:
* Removed duplicated getEmoji API call from the `useGetChannel` hook (#705).
* Fixed missing `SEND_MESSAGE_FAILED` event publishing (#704):
  * Addressed the failure state in `sendbirdSelectors.getSendUserMessage` and published the `SEND_MESSAGE_FAILED` event.
  * Corrected typo `SEND_MESSAGEGE_FAILURE`.

### Chores:
* Added a troubleshooting guide to the README. (#702)
* Made minor improvements to the onboarding process. (#701)

## [v3.6.6] (Aug 3 2023)
### Feat:
* Add `customExtensionParams` for `sdk.addSendbirdExtensions` (#698)
  The 3rd parameter customData to the `sdk.addSendbirdExtension` function, allowing it to be delivered from outside of UIKit React.
  e.g.
  ```
  // its recommended to memoize customExtensionParams
  const memoizedCustomExtensionParams = useRef({
    // the key-value sets will be passed when sdk.addSendbirdExtensions is called
    ...
  })
  <SendbirdProvider
    customExtensionParams={memoizedCustomExtensionParams.current}
  />
  ```
* Call `sdk.addSendbirdExtensions` during the connection process (#682)

### Fixes:
* Change the MessageInput cursor style from disabled to not-allowed; Thanks @roderickhsiao (#697)
* PendingMsg is missing isUserMessage method (#695)
  This resolves the issue where spreading the message object in the reducer loses some methods like `isUserMessage` and `isFileMessage`
* fix util functions logic of verifying message type. We updated logic in util functions to verify the message type. (#700)


### Chore:
* Update Trunk-Based Development to Scaled Trunk-Based Development (#696)
  It describes the flow with short-lived feature branches, code review, and build automation before integrating into main.

## [v3.6.5] (July 21 2023)
### Feat:
* Add a new prop `sdkInitParams` that allows passing custom parameters when `sdk.init(params)` is called from outside of UIKit.

e.g.
```
// its recommended to memoize sdkInitParams
const memoizedSdkInitParams = useRef({
  appStateToggleEnabled: false,
  debugMode: true,
  // more options can be found here https://sendbird.com/docs/chat/v4/javascript/ref/interfaces/_sendbird_chat.SendbirdChatParams.html
})
<SendbirdProvider
  sdkInitParams={memoizedSdkInitParams.current}
/>
```

## [v3.6.4] (July 20 2023)
### Feat:
* Create a separate package.json for CommonJS (cjs) module during build time. This package.json is located under dist/cjs directory. (#687)
* Add a new prop `isUserIdUsedForNickname` to the public interface. This prop allows using the userId as the nickname. (#683)
* Add an option to the ChannelProvider: `reconnectOnIdle`(default: true), which prevents data refresh in the background. (#690)

### Fixes:
* Fix an issue where the server returns 32 messages even when requesting 31 messages in the Channel. Now, hasMorePrev will not be set to false when the result size is larger than the query. (#688)
* Verify the fetched message list size with the requested size of the MessageListParams. Added a test case for verifying the fetched message list size. (#686)
* Address the incorrect cjs path in package.json. The common js module path in the pacakge.json has been fixed. (#685)


## [v3.6.3] (July 6 2023)
### Feat:
* Add new scrollBehavior prop to Channel (#676)
  The default option is set to "auto," preserving the existing scroll behavior.
  Possible to set smooth for smooth scroll effect.

### Fixes:
* Move message list scroll when the last message is edited (#674)
  Added optional parameters to moveScroll to scroll only when the last message reaches the bottom.
  Scroll is now moved only when the updatedAt property of the last message is changed.
* Add missing `UIKitConfig` to type definition (#677)
  Reported by [GitHub PR #650](https://github.com/sendbird/sendbird-uikit-react/pull/650#issuecomment-1622331367).

## [v3.6.2] (June 30 2023)

### Fixes:
* UIKit@3.6.0 build error on CRA (#668)
  UIKit@3.6.0 wouldnt work by default on CRA
  because of module resolution error on uikit-tools
  This is fixed in uikit-tools, and released in 40.alpha
  see: https://github.com/sendbird/sendbird-uikit-core-ts/pull/55
* Improve invitation modal submit btn disable condition
  Modify the invitation modal disable condition to not include the
  logged-in user for the user counting logic

## [v3.6.1] (June 30 2023)

### Feat:
* Enable channel creation when no user present to select
  If there are no users in the channel creation menu,
  User still get to create an empty channel with themselves
* Mobile: Keep keyboard open after sending the message

### Fixes:
* Update @sendbird/uikit-tools to 0.0.1-alpha.39
    alpha.39 has CJS support, otherwise, UIKit wont work
    on next-js page router

### Chore:
* Update all examples to V4 + StackBlitz
  * Update all sample code to V4
  * Convert CodeSandbox to StackBlitz
  * Render all examples with Vite
  * Thanks @tylerhammer

## [v3.6.0] (June 28 2023)

### Feat:
* Official support for Feature Configuration
  - You can now configure the features of UIKit through the `uikitOptions` prop of `<SendbirdProvider />` or `<App />` component. You can also find the detailed sample usage from [SAMPLE.md#UIKit-Configuration-Samples](./SAMPLES.md#UIKit-Configuration-Samples)
  - The minimum `@sendbird/chat` version has been increased to 4.9.2.
```jsx
  <SendbirdProvider
    uikitOptions={{
      common: {
        enableUsingDefaultUserProfile: true,
      },
      groupChannel: {
        enableMention: false,
        enableOgtag: true,
        enableReaction: true,
        enableTypingIndicator: true,
        input: {
          camera: {
            enablePhoto: true,
            enableVideo: true,
          },
          gallery: {
            enablePhoto: true,
            enableVideo: true,
          },
          enableDocument: true,
        },
      },
      groupChannelList: {
        enableTypingIndicator: true,
        enableMessageReceiptStatus: true,
      },
      groupChannelSettings: {
        enableMessageSearch: true,
      },
      openChannel: {
        enableOgtag: true,
        input: {
          camera: {
            enablePhoto: true,
            enableVideo: true,
          },
          gallery: {
            enablePhoto: true,
            enableVideo: true,
          },
          enableDocument: true,
        },
      },
    }}
  />
```

## [v3.5.2] (June 23 2023)

Fixes:
* Allow to reduce the mobile app height
  It was not able to reduce the height of the mobile app with some wrapper components
* Do not display the UnreadCount(new message notification) comp when unreadSince is null
* Improve sampling and bitrate of Voice Recording
  * sampling rate: 11025
  * bit rate: 12000
* Move scroll every time when message height changes
  It moved scroll only when the last message height changes

## [v3.5.1] (June 15 2023)

Fixes:
* Set fallback values \w global configs in App comp
* Use global config's replyType if channel one is undefined
* Use global disableUserProfile if each context's one is defined
* Clear `scrollBottom` on channel state loading
* Fixes a runtime error
  caused by clicking "Reply in thread" menu from a parent message
* Check if the `message.type` property is empty
  and return false when it is empty in the isVoiceMessage function

## [v3.5.0] (June 14 2023)

### Feat:
* Mobile Browser UX Revamp
  We have revamped the UX to support mobile devices -
  * Revamped Modals
  * Revamped Context Menu -> Long press to open context menu
  * Revamped Message Input

  This feature is disabled by default. To enable this feature, add the following prop to `SendBirdProvider` & `App` component.
  ```javascript
  breakpoint?: string | boolean
  ```

  Example:
  ```javascript
  <SendBirdProvider breakpoint="768px">
  ```
  ```javascript
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return (
    <SendbirdProvider breakpoint={isMobile} />
      {
        isMobile
          ? <MobileChatLayout />
          : <DesktopChatLayout />
      }
    </SendbirdProvider>
  )
  ```

  Other props:
  * SendbirdProvider?.onUserProfileMessage?: (channel: GroupChannel) => void
  Callback for handling when user sends a user profile message.
  * Channel?.onBackClick?: () => void
  Callback for handling when user clicks on back button in channel.
  This is only applicable for mobile devices.

* Configure UIKit through Dashboard(not released yet)
  We are doing groundwork to support configuring  UIKit through
  the dashboard. This will allow you to configure UIKit without
  having to add props to each component. This feature *will not* be a
  breaking change and will be backwards compatible.

### Chore:
* TSC error in typescript sample
* Samples -> Upgrade vite to 4.3.9

### Fixes:
* Connection
  * Disconnect SDK on Sendbird provider component unmount
* Message
  * Desktop - allow text select on Labels
  * Remove loading placeholder on ThumbnailMessage
  * OGMessage width overflow while adding reaction
  * Center align & remove ellipsis from admin message
* Voice Message
  * Hide download option for voice message
  * Show warning when there is no voice recording permission
  * Race condition in playing audio files simultaneously
  * Stop voice player when recorder exits
  * Pause voice when component is removed from layout
* Replies
  * Quoted text alignment for reply messages
  * MessageList: Triggering of random clicks while scroll to parent
* Thread
  * Improve parent message detection
  * Emoji reactions overflow in message
* Settings
  * <AllMemebers />: Show context menu on click
* Open Channel
  * OpenChannel Context menu click leak
  * Vertical scroll on labels in open channel list

## [v3.4.9] (June 02 2023)

Fixes:
* ChannelList
  * Display a channel on channel list only when there's a message
  * Remove edited message from ChannelPreview

* MarkAsRead & MarkAsDelivered
  * Batch markAsRead & markAsDelivered requests

* Scrolling
  * Various scroll issues in Channel component
  * Shaky scroll on messages when fetching messages
  * Scroll into view when starting point is set
  * Scroll into message on clicking quote reply
  * Inconsistent rendering on scrollToBottom button

* Mention
  * Improve max mention count logic in Messages
  * Improve mention detection when there are curly braces in user's name Mentions
  were not working when user nickname had curly braces

* Special channels
  * Disable mention in the broadcast channel
  * Change OpenChannelInput muted state notice text in broadcast channel

* Reply
  * Apply ellipsis to a sender of quote and admin message

* Thread
  * Add border bottom to the ParentMessageInfo component
  * Modify string set for thread menu "Reply to Thread" -> "Reply in Thread"
    Do not display "Reply in Thread" to the reply messages
  * Prevent hover style of ParentMessageInfo component

* OpenChannel
  * Apply theme to the OpenChannelList header

Chores:
* Add a sample with router
* Add dataId to the every menu items

## [v3.4.8] (May 19 2023)

Fixes:
* Prevent white space only text sending
* Mentioned user Regex parsing
  Mention will now work even if userId has `.*+?^${}()|[\]\\` characters.
* ChannelList blink when when message is send
  Happened when there were two channelLists in the same page with
  different query params.
* ChannelSetting `renderUserProfile` prop
  We were applying `renderChannelProfile` in place of `renderUserProfile`.
* MessageBody: Words break mid word
  Words were breaking midword because all white spaces
  were converted into nbsps. CSS couldnt distinguish nbsps
  as whitespaces, so wrapping didnt work well.

Chores:
* Setup CircleCI
  * We are moving from Github Actions to CircleCI
* Setup Husky
  * Setup lint on post push
  * Auto run yarn install on post pull
* Update EsLint
  * Update version to 8.40.x
  * Apply more strict rules

## [v3.4.7] (May 4 2023)

Important Notes:
* @sendbird/chat@4.8.0 has an issue with `abortcontroller-polyfill` plugin. Please use version 4.7.2 or install it separately.

Features:
* Set Chat SDK v4.3.0 as the minimum required version.
* Add a new UI component, Toggle:
  * `ToggleContainer`: A context provider component that manages only the toggle status.
  * `ToggleUI`: A UI component that does not include the status managing logic.
  * `Toggle`: A combination of ToggleContainer and ToggleUI components.
  * `useToggleContext`: A custom useContext hook that provides context from ToggleContainer.
  ```javascript
  import { Toggle, ToggleContainer, ToggleUI,  useToggleContext } from '@sendbird/ui/Toggle';
  ```
  
Fixes:
* Apply `isMuted` to the participant list. Operators can now unmute the muted participants from the participant list.
* Update the max mention count notice message.
* Modify the URL Regex to filter various types of formats.
* Give a left margin to the link text inside the message.
* Move the message list scroll after the OG image is loaded.
* Specify that getSdk returns SendbirdGroupChannel or SendbirdOpenChannel.
* Fix the issue where the current channel flickers on the ChannelList while creating a new group channel.

Chores: 
* Rewrite the connection logic in sdk/thunks to hooks/useConnect
  ```
  const reconnect = useConnect({
    appId,
    userId,
    accessToken,
  }, {
    logger,
    nickname,
    profileUrl,
    configureSession,
    customApiHost,
    customWebSocketHost,
    sdk: sdkStore?.sdk,
    sdkDispatcher,
    userDispatcher,
  });
  ```
* Rename `smart-components/` to `modules/`.
* Modify Logger method:
  * The first parameter (log message) of the method is now required.
  * Any other values can be passed to the second parameter of the method in a key-value format.

## [v3.4.6] (Apr 21 2023)

Fixes:
* Use markAsReadScheduler in MessageList:
  * `markAsReadScheduler` method throttles `markAsRead` calls.
  * Reduces cmd no ack error.
* Apply common scroll hook to GroupChannel MessageList:
  * Prevent whole page from scrolling when <GroupChannel /> scrolls. This issue occurs when customer implements an <GroupChannel /> in a web page with scroll.
  * This is a same fix that we fixed OpenChannel in `v3.4.4`.
* To unify message sending policies with ios & android:
  * Do not show send button when there is only new line or empty space in the input.
  * Do not trim leading white spaces in message text.
* Optimize lamjs import:
  * Lazy load the audio converting processor(lamejs) only when `isVoiceMessageEnabled` is true.
  * This saves 106KB Gzipped(85KB Brotli) if you are not using the VoiceMessage feature.

## [v3.4.5] (Apr 7 2023)

Features:

* Add a message list filter of UI level in the `Channel` module
  * Add `Channel.filterMessageList?: (messages: BaseMessage): boolean;`, a UI level filter prop
    to Channel. This function will be used to filter messages in `<MessageList />`

    example:
    ```javascript
    // set your channel URL
    const channel = "";
    export const ChannelWithFilter = () => {
      const channelFilter = useCallback((message) => {
        const now = Date.now();
        const twoWeeksAgo = now - 1000 * 60 * 60 * 24 * 14;
        return message.createdAt > twoWeeksAgo;
      }, []);
      return (
        <Channel
              channelUrl={channel}
              filterMessageList={channelFilter}
            />
      );
    };
    ```

* Improve structure of message UI for copying
    Before:
    * The words inside messages were kept in separate spans
    * This would lead to unfavourable formatting when pasted in other applications

    After:
    * Remove span for wrapping simple strings in message body
    * Urls and Mentions will still be wrapped in spans(for formatting)
    * Apply new logic & components(TextFragment) to tokenize strings
    * Improve keys used in rendering inside message,
      * UUIDs are not the optimal way to improve rendering
      * Create a composite key with message.updatedAt
    * Refactor usePaste hook to make mentions work ~
    * Fix overflow of long strings
    * Deprecate `Word` and `convertWordToStringObj`

* Export MessageProvider, a simple provider to avoid prop drilling into Messages
    Note - this is still in works, but these props will remain
    * In the future, we will add methods - to this module - to:
      * Edit & delete callbacks
      * Menu render options(ACLs)
      * Reaction configs
      * This will improve the customizability and remove a lot of prop drilling in Messages

    ```
    export type MessageProviderProps = {
      children: React.ReactNode;
      message: BaseMessage;
      isByMe?: boolean;
    }

    import { MessageProvider, useMessageContext } from '@sendbird/uikit-react/Message/context'
    ```
    Incase if you were using MessageComponents and see error message
    `useMessageContext must be used within a MessageProvider `
    use: `<MessageProvider message={message}><CustomMessage /></MessageProvider>`

* Add a scheduler for calling markAsRead intervally
  * The `markAsRead` is called on individual channels is un-optimal(causes command ack. error)
because we have a list of channels that do this
ideally this should be fixed in server/SDK
this is a work around for the meantime to un-throttle the customer

Fixes:
* Set current channel on `ChannelList` when opening channel from the parent message of `Thread`
  * Issue: The ChannelPreview item is not selected when opening the channel from
  the ParentMessage of the Thread
  * Fix: Set activeChannelUrl of ChannelList
* Detect new lines in safari on the `MessageInput` component
  * Safari puts `<div>text</div>` for new lines inside content editable div(input)
  * Other browsers put newline or `br`

## [v3.4.4] (Mar 31 2023)

Features:
* Increase default maximum recording time of Voice Message to 10 minutes
* Add logger to VoicePlayer, VoiceRecorder, and useSendVoiceMessage hook

Fixes:
* Prevent whole page from scrolling when OpenChannel scrolls
  This issue occurs when customer implements an OpenChannel in a web page with scroll
* Fix edgecase in which voice messages were sent twice
* Clean up Thread interface
  If message.parentMessage doesnt exist, treat message as parentMessage
  `<Thread message={message} />`

## [v3.4.3] (Mar 24 2023)

Features:
* Add rollup-plugin-size-snapshot for bundle-size
  Run rollup-plugin-size-snapshot on build,
  we will check bundle size before every release
* Move old samples to use vite
  React team these days are using vite for their samples,
  CRA is discourged
* Run code coverage on commenting `./coverage`
  Check code coverage on PR comment
* Add prop to disable Channel & Thread inputs
  Add prop: `disabled?: false` for Channel & Thread MessageInputWrapper
* Replace renderToString(react-dom) with custom fn
  Replace renderToString from react-dom/server with custom function
  This function was creating issue in customers with cra@4 & react@17

Fixes:
* Replace outdated CSS rules
  `justify-content: start;` and  `height: fill-available;`
* Menu position in tight screens
  * Condition where some menus get clipped in left side:
    * Usually user profile in channel moderation
  * Context menu of last item in channel gets clipped in the bottom


## [v3.4.2] (Mar 17 2023)

Features:
* Mentions should be preserved when copy pasted from sendbird-messages and message input
  * Make sure you are posting mentions of users from same channel
  * We dont support pasting of rich text from other applications
  * For copying simple text, we recommend using paste option in message context-menu

  * Conditions tested:
    1. paste simple text
    2. paste text with mention
    3. paste text with mention and text
    4. paste text with mention and text and paste again before and after
    5. copy message with mention(only one mention, no other text) and paste
    6. copy message with mention from input and paste(before and after)

Chores:
* Arrange the order of the string set table
Some string-set were missing on the current string set table, so our customers werent able to use the latest state of the string set feature

Library added:
* [dompurify@3.0.1](https://www.npmjs.com/package/dompurify): +8Kb Gzipped

## [v3.4.1] (Mar 10 2023)

Fixes:
* Keep scroll if context menu is opened when receiving messages
* Handle Ephemeral channel
  * Group channel list
    * Remove the message receipt status (channel preview)
    * Remove the unread message count (channel preview)
  * Group channel
    * Remove the message edit
    * Remove the message delete
    * Remove the message reactions
    * Remove the message receipt status (message)
    * Remove the message reply (quote_reply, thread)
  * Group channel settings
    * Remove the search in channel
  * Open channel
    * Remove the message edit
    * Remove the message delete
* Clear timeout in useLayoutEffect of Message
  * This removes memory leak warnings

## [v3.4.0] (Mar 6 2023)

### Voice Message
Voice message is a new type of message and feature that you can use in group channel. You can record your voice on the message input and send it to the channel. Also the messages will be displayed as a new design of the voice message. You are able to use this feature from this version.

#### How to turn on/off
* You can turn this feature on/off using the props `isVoiceMessageEnabled` on the <App /> and <SendbirdProvider /> components. Here is an example.
```javascript
import App from '@sendbird/uikit-react/App'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { useEffect } from 'react'

const QuickStart = () => (<App isVoiceMessageEnabled />)
const CustomApp = () => {
  const [useVoiceMessage, setUseVoiceMessage] = useEffect(true)
  return (
    <SendbirdProvider
      isVoiceMessageEnabled={useVoiceMessage}
    >
      {/* Implement your custom app here */}
    </SendbirdProvider>
  )
}
```

#### How to customize the voice message in Channel and Thread?
You can identify the voice message to check if `message.type` includes `sbu_type=voice`. But you can use `isVoiceMessage` util function to do that.
```javascript
import Channel from '@sendbird/uikit-react/Channel'
import isVoiceMessage from '@sendbird/uikit-react/utils/message/isVoiceMessage'

const CustomChannel = () => {
  return (
    <Channel
      renderMessage={({ message }) => {
        if (isVoiceMessage(message)) {
          // Return your custom voice message item component
        }
        return null
      }}
    />
  )
}
```

#### Limitation & Next step
* For now, it's not able to customize the inner components of VoiceMessageInput. We are going to provide an interface to customize it in the future. Until that time, you can replace the VoiceMessageInput component using the `renderVoiceMessageIcon` props of MessageInput component.

#### What has been changed?
* Add props `isVoiceMessageEnabled` and `voiceRecord` props to the App, `SendbirdProvider`, and `MessageInput` components, to turn on/off the voice message recording feature
  ```javascript
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
  const CustomApp = () => {
    return (
      <SendbirdProvider
        isVoiceMessageEnabled
        voiceRecord={{
          maxRecordingTime: 60000,
          minRecordingTime: 1000,
        }}
      >
        {/* implement custom application */}
      </SendbirdProvider>
    )
  }
  ```
* Add props `onVoiceMessageIconClick` to the `MessageInput` component
* Add props `onBeforeSendVoiceMessage` to the `Channel` component
* Fetch message list including `MetaArray` in the `Channel` and `Thread` modules
* Provide new IconType `AudioOnLined` & new IconColor `Primary2` and `OnBackground4`
* Provide new string sets
  ```javascript
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
  const CustomApp = () => {
    return (
      <SendbirdProvider
        stringSet={{
          BUTTON__OK: 'OK',
          VOICE_MESSAGE: 'Voice Message',
          MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED: 'You\'re muted by the operator.',
          MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN: 'Channel is frozen.',
        }}
      >
        {/* implement custom application */}
      </SendbirdProvider>
    )
  }
  ```
  * `BUTTON__OK`: 'OK' → Used on the submit button of pop up modal
  * `MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED`: 'You\'re muted by the operator.' → Used in an alert pop-up modal
  * `MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN`: 'Channel is frozen.' → Used in an alert pop-up modal
  * `VOICE_MESSAGE`: 'Voice Message' → Used in ChannelPreviewItem, QuoteMessage, and MessageSearch to appear that the message type is the voice## External Contributions

#### What has been added?
* Install `lamejs` to convert the audio file to mp3 (iOS support)
* UI components
  ```javascript
  import PlaybackTime from "@sendbird/uikit-react/ui/PlaybackTime"
  import ProgressBar from "@sendbird/uikit-react/ui/ProgressBar"
  import VoiceMessageInput from "@sendbird/uikit-react/ui/VoiceMessageInput"
  import VoiceMessageItemBody from "@sendbird/uikit-react/ui/VoiceMessageItemBody"
  ```
  * PlaybackTime: Display the current time in 00:00 format with the received millisecond value
  * ProgressBar: Display the current progress status with the received maxSize and currentSize of millisecond unit value
  * VoiceMessageInput: UI component for recording and playing a voice message
  * VoiceMessageItemBody: UI component for rendering a voice message also able to play voice message
* VoiceRecorder
  ```javascript
  import { VoiceRecorderProvider, useVoiceRecorderContext } from '@sendbird/uikit-react/VoiceRecorder/context'
  import useVoiceRecorder from '@sendbird/uikit-react/VoiceRecorder/useVoiceRecorder'
  ```
  * VoiceRecorderProvider: A react context provider component providing `start`, and `stop` functions
  * useVoiceRecorderContext: A react useContext hook of VoiceRecorderProvider
  * useVoiceRecorder: A react hook that provides advanced context, `recordingLimit`, `recordingTime`, `recordingFile`, and `recordingStatus`. Recommend using this hook in the customized components.
* VoicePlayer
  ```javascript
  import { VoicePlayerProvider, useVoicePlayerContext } from '@sendbird/uikit-react/VoicePlayer/context'
  import useVoicePlayer from '@sendbird/uikit-react/VoicePlayer/useVoicePlayer'
  ```
  * VoicePlayerProvider: A react context provider component providing `play`, and `pause` functions
  * useVoicePlayerContext: A react useContext hook of VoicePlayerProvider
  * useVoicePlayer: A react hook that provides advanced context, `playbackTime`, `duration`, and `playingStatus`. Recommend using this hook in the customized components.
* utils/isVoiceMessage: A function that you can check if the given message is a voice message
  ```javascript
  import isVoiceMessage from '@sendbird/uikit-react/utils/message/isVoiceMessage'
  const isVoiceMsg: boolean = isVoiceMessage(message);
  ```

Features:
* Add props `renderFileUploadIcon`, `renderVoiceMessageIcon`, and `renderSendMessageIcon` into the `Channel`, `ChannelUI`, and `MessageInput` component
  ```javascript
  interface MessageInputProps {
    renderFileUploadIcon?: () =>  React.ReactElement;
    renderVoiceMessageIcon?: () =>  React.ReactElement;
    renderSendMessageIcon?: () =>  React.ReactElement;
  }
  ```

Fixes:
* Use ApplicationUserListQuery on ChannelSettings component
* Fix some visual issues on the normal User Panel of ChannelSettings
* Indentify faulty images in OG message
* Add classname: sendbird-og-message-item-body__og-thumbnail__empty to identify faulty images in OG message
  Clients can use CSS to target this class~
  ```css
  .sendbird-og-message-item-body__og-thumbnail__empty {
    display: none;
  }
  ```

## [v3.3.7] (Feb 24 2023)

Features:
* Add props `activeChannelUrl` to ChannelList to give an option to pragmatically set a channel from a parent component router
  ```javascript
  const MyChannelList = () => {
    const [myActiveChannel] = useState()
    return (<ChannelList activeChannelUrl={myActiveChannel.url} />)
  }
  ```

Fixes:
* Fix not showing newly recived messages in channel which has less messages
* Use a real `channel.invitedAt` value when trying to fetch MessageSearchQuery
* Disable the checkbox of the joined users on the InviteUsersModal
* Set the default value of CheckBox component: `@sendbird/uikit-react/ui/CheckBox` as false

## [v3.3.6] (Feb 13 2023)

Fixes:
* pubsub should be initialized with useState
* update onBeforeCreateChannel example to use chat V4

## [v3.5.0-beta.0] (Feb 6 2023)

### Notification Channel

A notification channel is a new group channel dedicated to receiving one way marketing and transactional messages. To allow users to view messages sent through Sendbird Message Builder with the correct rendering, you need to implement the notification channel view using <NotificationChannel>

Overview:
* Provide new module `NotificationChannel`
  * NotificationChannel
    `import NotificationChannel from '@sendbird/uikit-react/NotificationChannel'`
  props:
    * channelUrl: string;
    * children?: React.ReactElement;
    // To customize Query
    * messageListParams?: MessageListParams;
    // Sets last seen externally
    * lastSeen?: number;
    // handles Actions sepcified in Message Templates
    * handleWebAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage): null;
    * handleCustomAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage): null;
    * handlePredefinedAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage): null;
    // UI overrides
    * isLoading?: boolean;
    * renderPlaceholderLoader?: () => React.ReactElement;
    * renderPlaceholderInvalid?: () => React.ReactElement;
    * renderPlaceholderEmpty?: () => React.ReactElement;
    * renderHeader?: () => React.ReactElement;
    * renderMessageHeader?: ({ message }) => React.ReactElement;
    * renderMessage?: ({ message }) => React.ReactElement;

```
example:
export const NotificationChannelComponenet = () => (
  <Sendbird
    appId={appId}
    userId={userId}
    accessToken={accessToken}
  >
    <div style={{ height: '960px', width: '360px' }}>
      <NotificationChannel
        channelUrl={`SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION_${userId}`}
        renderPlaceholderLoader={() => <MyBrandLogo />};
        handleCustomAction={(event, action, message) => {
          ... implement custom action
        }}
      />
    </div>
  </Sendbird>
);
```
* Submodules:
  * Context
    `import { NotficationChannelProvider useNotficationChannelContext } from '@sendbird/uikit-react/NotificationChannel/context'`
    Handles business logic of Notification Channel
  * NotificationChannelUI
    `import NotificationChannelUI from '@sendbird/uikit-react/NotificationChannel/components/NotificationChannelUI'`
    UI wrapper of Notification Channel
  * NotificationMessageWrap
    `import NotificationMessageWrap from '@sendbird/uikit-react/NotificationChannel/components/NotificationMessageWrap'`
  * NotificationList
    `import NotificationList from '@sendbird/uikit-react/NotificationChannel/components/NotificationList'`
* External modules:
  Unlike some of our other releases we decide to release some components into seperate packages to enahnce reusability with other platforms/projects
  * MessageTemplateParser('@sendbird/react-message-template')
    * MessageTemplate
      `import { createMessageTemplate } from '@sendbird/react-message-template'`
    * Parser
      `import { createParser } from '@sendbird/react-message-template'`
    * Renderer
      `import { createRenderer } from '@sendbird/react-message-template'`
  * MessageTemplateParser('@sendbird/react-message-template')
    * Context
      `import { MessageProvider, useMessageContext } from '@sendbird/react-uikit-message-template-view';`
    * MessageTemplateView
      `import { MessageTemplateView } from '@sendbird/react-uikit-message-template-view';`

## [v3.3.5] (Feb 3 2023)
Features:
* Voice Recorder&Player logic(not public yet)
  * Add a voice record logic: VoiceRecorderProvider, useVoiceRecorderContext, useVoiceRecorder
  * Add an audio play logic: VoicePlayerProvider, useVoicePlayerContext, useVoicePlayer
* Create an integrated sample for the group channel

Fix:
* Migrate the outdated ChannelListQuery interface
  * Issue: A customer said the `userIdsFilter` of ChannelListQuery doesn't work when receiving messages
    There's been an internal channel filtering logic with custom channelListQuery, but it's broken because we've used the outdated interface of Chat SDK.
  * Fix: We migrated the outdated interface `_searchFilter` and `_userIdsFilter` to new things `searchFilter` and `userIdsFilter
* Use the same word-splitting logic on the TextMessage and OGMessage
  * TextMessage will also allow opening the URL links
  * Use the same word wrapping style on the TextMessage and OGMessage
* Apply string set into the moderation section
  * Add string set
    * CHANNEL_SETTING__OPERATORS__ADD_BUTTON: 'Add'
    * CHANNEL_SETTING__MODERATION__EMPTY_BAN: 'No banned members yet'
    * CHANNEL_SETTING__MODERATION__ALL_BAN: 'All banned members'
* Edit should not be allowed when input is empty
* New channel interrupts the current conversation
  * Do not set the current channel when getting an invitation
  * Add test for USER_INVITED in the reducer of ChannelList

## [v3.3.4] (Jan 6 2023)
Fix:
* Add the time stamp rendering case for before this year on the ChannelList
* Improve the message input security
  * Possibility of XSS has been discovered
  * Recommend to do a version up, if you are using UIKit version 3.0.0 or higher

## [v3.3.3] (Dec 22 2022)
Fix:
* Change default value of the image compression rate to 70%(0.7)

## [v3.3.2] (Dec 8 2022)
Features:
* Add props `renderTitle` to the <ChannelListHeader /> component
  * `renderHeader` of <ChannelListHeader /> will be deprecated
* Add interface overrideInviteUser

  Add overrideInviteUser to ChannelList, CreateChannel and ChannelSettings

  This interface overrides InviteMember functionality. Customer has to create the channel
  and close the popup manually

  ```javascript
  export type OverrideInviteUserType = {
      users: Array<string>;
      onClose: () => void;
      channelType: 'group' | 'supergroup' | 'broadcast';
  };
  export interface ChannelListProps {
    overrideInviteUser?(params: OverrideInviteUserType): void;
  }
  export interface CreateChannelProps {
    overrideInviteUser?(params: OverrideInviteUserType): void;
  }
  export type OverrideInviteMemberType = {
      users: Array<string>;
      onClose: () => void;
      channel: GroupChannel;
  };
  ChannelSettings.overrideInviteUser?(params: OverrideInviteMemberType): void;
  ```

  example:
  ```javascript
  <ChannelList
    overrideInviteUser={({users, onClose, channelType}) => {
      createMyChannel(users, channelType).then(() => {
        onClose();
      })
    }}
  />
  ```

Fixes:
* Allow to override entire message search query.
  Now message search query supports searching messages in multiple channels.
* Modify type definitions for props `ThreadUIProps.renderMessage`.
* Remove duplication of create channel button when using `renderHeader` of <ChannelList />.
* The online status should work even configureSession is provided.
  This was disabled because of a bug in sessionHandler in SDK now, we can re-enable this.
* Create channel sometimes had empty operatorID.
  Use sendbird state to access currentUserID and use it incase prop value is empty.
  Also, remove legacy HOC pattern.
* Add the props type `isMentionEnabled` of <App />.
* Change the props type `messageSearchQuery` of <MessageSearch /> to **MessageSearchQueryParams**.

## [v3.3.1] (Nov 23 2022)
Fixes:
* Rename properties of `useThreadContext`
  * `channelStatus` to `channelState`
  * `parentMessageInfoStatus` to `parentMessageState`
  * `threadListStatus` to `threadListState`
* Change the state types to enum
  ```typescript
  enum ChannelStateTypes {
    NIL = 'NIL',
    LOADING = 'LOADING',
    INVALID = 'INVALID',
    INITIALIZED = 'INITIALIZED',
  }
  enum ParentMessageStateTypes {
    NIL = 'NIL',
    LOADING = 'LOADING',
    INVALID = 'INVALID',
    INITIALIZED = 'INITIALIZED',
  }
  enum ThreadListStateTypes {
    NIL = 'NIL',
    LOADING = 'LOADING',
    INVALID = 'INVALID',
    INITIALIZED = 'INITIALIZED',
  }
  ```

## [v3.3.0] (Nov 23 2022)
Features:
* Provide new module `Thread`. See the specific informations of this module on the [Docs page](https://sendbird.com/docs/uikit)
  * You can use a combined component `Thread`. Import it with
    ```typescript
    import Thread from "@sendbird/uikit-react/Thread"
    ```
  * Also you can use `ThreadProvider` and `useThreadContext` for customization. Import it with
    ```typescript
    import { ThreadProvider, useThreadContext } from "@sendbird/uikit-react/Thread/context"
    ```
  * And the other UI components are provided under the Thread. `ThreadUI`, `ThreadHeader`, `ParentMessageInfo`, `ParentMessageInfoItem`, `ThreadList`, `ThreadListItem`, and `ThreadMessageInput` are it
* Add channel props
  * `threadReplySelectType`: Type of the value should be
    ```typescript
    enum ThreadReplySelectType { PARENT, THREAD }
    ```
    You can see how to use it below
    ```typescript
    import { ThreadReplySelectType } from "@sendbird/uikit-react/Channel/context";

    <Channel
      ...
      threadReplySelectType={ThreadReplySelectType.PARENT}
    />
    ```
  * `animatedMessage`: Type of the value should be number(messageId)
  * `onReplyInThread`: This function is called when user click the button "Reply in thread" on the message context menu
    ```typescript
    type onReplyInThread = ({ message: UserMessage | FileMessage }) => void
    ```
  * `onQuoteMessageClick`: This function is called when user click the quote message on the message of Channel
    ```typescript
    type onQuoteMessageClick = ({ message: UserMessage | FileMessage }) => {}
    ```
  * `onMessageAnimated`: This function is called after that message item is animated
    ```typescript
    type onMessageAnimated = () => void
    ```
  * `onMessageHighlighted`: This function is called after that message item is highlighted
    ```typescript
    type onMessageHighlighted = () => void
    ```
* Add `ui/ThreadReplies` component
  ```typescript
  interface ThreadRepliesProps {
    className?: string;
    threadInfo: ThreadInfo;
    onClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
  }
  ```

Fixes:
* Do not allow operator to unregister itself on the OperatorList of GroupChannel
* Create new group channel when user open 1:1 channel on the UserProfile
* Register the channel creator as an operator in 1:1 channel

## [v3.2.6] (Nov 14 2022)
Fix:
* Use ref instead of querySelector for DOM manipulation
 Fixes the issue where input is not cleared when multiple channels are open at the same time
* Apply pre-line into the OpenChannelUserMessage
 Fixes the issue where OpenChannel UserMessage doesnt have new line

## [v3.2.5] (Nov 7 2022)
Fix:
* Modify the type of parameters in the sendbirdSelectors
  There has been unsyncronous between reality and types
  This fix only affects to TypeScript
  * getLeaveGroupChannel: `channel` to `channelUrl`
  * getEnterOpenChannel: `channel` to `channelUrl`
  * getExitOpenChannel: `channel` to `channelUrl`

## [v3.2.4] (Nov 1 2022)
Features:
* For Channel component, added separate prop isLoading?.boolean
  Usage: `<Channel channelUrl {currentChannelUrl} isLoading={!currentChannelUrl} />`
* For flicker in ChannelList, no extra props

Fixes:
* React UIKit placeholder rendering issue
* Fix scroll issue in ChannelList where user cannot load more channels
* Modify TS interface getLeaveChannel to getLeaveGroupChannel in selectors

## [v3.2.3] (Oct 14 2022)
Feature:
* Add a prop `disableMarkAsRead` into the <Channel />
  This prop disables calling markAsRead in the Channel component

## [v3.2.2] (Oct 13 2022)

Feature:
* Export a type `OutgoingMessageStates`
  * Type: `enum OutgoingMessageStates { NONE, PENDING, SENT, FAILED, DELIVERED, READ }`
* Export a util function `getOutgoingMessageState`
  * Importing path: "@sendbird/uikit-react/utils/message/getOutgoingMessageState"
  * Interface: `function getOutgoingMessageState(channel, message): OutgoingMessageStates`
* Add a prop `disableMarkAsDelivered` into the <App /> and <SendbirdProvider />
  Some of our customers do not use the markAsDelivery feature,
  but we always have called the markAsDelivered on the ChannelList with every channel
  It caused a rate-limit issue, so we add a new prop to disable the markAdDelivered call for that case

## [v3.2.1] (Oct 02 2022)

Fixes:
* Do not bundle chat SDK with uikit compiled code

Compiled UIKit code that is distributed through npm shouldn't
have Chat SDK minified code included in it
Chat SDK should be a dependency of UIKit
Advantages:
  * Chat SDK bug fixes will be added for free
  * Eliminate the need for handlers
What caused the issue:
If you are using rollup for bundling
in config.external you have to be specific
ie>
This works:
```
external: [
  '@sendbird/chat',
  '@sendbird/chat/groupChannel',
  '@sendbird/chat/openChannel',
  '@sendbird/chat/message',
]
```
This doesn't:
```
external: [ '@sendbird/chat', ]
```

* Only react and react-dom should be peerDependencies

For npm >= v7, npm autoinstall peerDependency packages
According to `https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies`
You want to express the compatibility of your package with a host tool
or library while not necessarily doing a require of this host Even though react is required,
its better to show that react is the host tool

## [v3.2.0] (Sep 27 2022)

Features:
* OpenChannelList component
  * Create new smart components (modules)
    * CreateOpenChannel
    * OpenChannelList
  * Add a renderHeader props into the ui/Modal component
  * Add stringSet for OpenChannelLisit and CreateOpenChannel components
    * OPEN_CHANNEL_LIST__TITLE: 'Channels',
    * CREATE_OPEN_CHANNEL_LIST__TITLE: 'New channel profile',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION: 'Channel image',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD: 'Upload',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION: 'Channel name',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER: 'Enter channel name',
    * CREATE_OPEN_CHANNEL_LIST__SUBMIT: 'Create',
* Add prop?.value to MessageWrappers
  * @sendbird/uikit-react/Channel/components/MessageInput
  * @sendbird/uikit-react/OpenChannel/components/OpenChannelInput
  * @sendbird/uikit-react/ui/MessageInput
  * Value is reset when channelURL changes

Fixes:
* Fix issue where ConnectionHandler overwrite SessionHandler
* Use queries from @sendbird/chat
  * Use imported versions of GroupChannelListQueryParams and ApplicationUserListQueryParams
* Fix `o`penChannel casing in type defn
* Add some missing localization variables
* Deprecate ChatHeader and ChannelPreview in @sendbird/uikit-react/ui
* Replace the ButtonTypes and ButtonSizes into the Button/index
* Apply scroll to input and dark theme color to UserProfile
* Disable the create channel button when no user invite
* Use ref from MessageInputWrapper props if present
* Some CSS level polishing fixes~

Dev. Env:
* Remove `enzyme` and `react-test-renderer`
* Upgrade the `react` version to **v18**
* Upgrade the `storybook` version to **v6.5.10**
* Upgrade the `jest` and `babel-jest` to **v29**
* Upgrade the `jsdom` to **v20**
* Install `jest-environment-jsdom`
* Install `global-jsdom`
* Install `testing-library` (`@testing-library/react` and `@testing-library/jest-dom`)
* Migrate every tests with `testing-library` instead of the `enzyme` and `react-test-renderer
* Replace node-sass with sass(Dart Sass)
* Reduce bundle size by treating react-dom/server as external

## [v3.1.3] (Sep 19 2022)

Features:
* Export SessionHandler through `@sendbird/uikit-react/handlers/SessionHandler`
  * This is a workaround to fix an issue where inhertiance chains break custom handler implementation
  * `import SessionHandler from '@sendbird/uikit-react/handlers/SessionHandler'`
* Rem units can be used for typography
  * Pass prop `config.isREMUnitEnabled` -> true on SendbirdProvider
    to use "rem" units
  * We are adding rem as unit for typography/font size

Fixes:
* Fix the position of ContextMenu
* Do not exit the current open channel when the channel state is changed
* Display menu only for operators on the member list
* Hide muted icon when pop-up component is appeared
* Set message context's border roundly by the state using the reaction feature
  * Add props `isReactionEnabled` to the <TextMessageItemBody />
  * Add props `isReactionEnabled` to the <OGMessageItemBody />
  * Add props `isReactionEnabled` to the <FileMessageItemBody />
  * Add props `isReactionEnabled` to the <ThumbnailMessageItemBody />
  * Add props `isReactionEnabled` to the <UnknownMessageItemBody />
* Add the message as a parameter of renderCustomSeparator
  * before: renderCustomSeparator={() => ReactElement}
  * after: renderCustomSeparator={(props: { message }) => ReactElement}
* Fix typo on the type
  * renderCustomSep'e'rator to renderCustomSep'a'rator

## [v3.1.2] (Aug 31 2022)

* Migrate UI components into TypeScript
  This doesnt affect anyone, it a step in task to migrate the project source code into TS

Fixes:
* Type defn: Change type of react elements to `React.ReactElement`
  * Change every `React.ReactNode` and `React.Component` to `React.ReactElement`
  * Use the type of SendbirdError
  * Use the type MessageSearchQueryParams
  * Use enum MessageSearchOrder.TIMESTAMP in the message search query params instead of `'ts' as const`

  **ReactNode** could be `string | number | null | undefined | ReactElement | portal` and this(expecting string or number) causes **warning** when we use it like `<CustomComp />`
  ```typescript
  // in the component
  { renderMessage } = props
  const CustomMessage = useMemo(() => {
    return renderMessage({ ... });
  }, []);
  return (
    <div>
      <CustomMessage />
    </div>
  );
  ```
  so expecting **ReactElement** is better for our case
* Fix message grouping:
  Set isMessageGroupingEnabed to true(was set to false during v2 migration)

## [v3.1.1] (Aug 17 2022)

Features:
* Add channel handlers to the open channel settings
  * Add an open channel handler into the OpenChannelSettings component
  * Use operators property to render operator list on the OpenChannelSetting
  instead of fetching operators
* Export handlers through `@sendbird/uikit-react/handlers`, this is a workaround
  to fix an issue where inhertiance chains break custom handler implementation
  * ConnectionHandler -> `@sendbird/uikit-react/handlers/ConnectionHandler`
  * GroupChannelHandler -> `@sendbird/uikit-react/handlers/GroupChannelHandler`
  * OpenChannelHandler -> `@sendbird/uikit-react/handlers/OpenChannelHandler`
  * UserEventHandler -> `@sendbird/uikit-react/handlers/UserEventHandler`
  * Example: https://codesandbox.io/s/test-3-1-1-rc-5-f94w7i

Fixes:
* Update SendableMessage to UserMessage and FileMessage
* Change the type of MessageHandler.onFailed to FailedMessageHandler
* Add missing type defns into scripts/index_d_ts
* Typo in creating channelHandlerId on the ChannelList

## [v3.1.0] (Aug 03 2022)
Features:
* Support moderation in OpenChannel
  * Provide moderations: mute, unmute, ban, and unban on the <OpenChannelSettings />
  * Provide moderations: register and unregister operator on the <OpenChannelSettings />
  * Add MutedParticipantList and MutedParticipantsModal into the <OpenChannelSettings />
  * Add BannedUserList and BannedUsersModal into the <OpenChannelSettings />
  * Add OperatorList and OperatorsModal into the <OpenChannelSettings />
  * Add AddOperatorsModal into the <OpenChannelSettings />

## [v3.0.2] (Aug 03 2022)
Fixes:
* Explicitly export library as esm-module
  ESM library should have "type": "module" (package.json file that is going to /dist)
  This fixes Cannot use import outside module issue in next.js
* Add optional chaining for createApplicationUserList
* Fix QueryInProgress warning:
  React 18 strict mode glitch that causes useEffect to run twice
* Cannot connect sometimes when customApiHost is empty
  Connection couldnt be established with no error message when customApiHost and customWebSocketHost
  were passed as empty string
* Handle all chances of command not received error
  Handle chances of command not recieved error in markAsRead
  Experimental markasread handling -> longer times, no more call after unmount
* Move typing handler in channellist into local variable

## [v3.0.1] (July 28 2022)

Features:
* Accept customApiHost & customWebSocketHost as props to SendbirdProvider
* Add basic TS project sample

Fixes:
* Improve URL detection in OG message
* Add onCloseClick to MessageSearchProps
* Safe call removeGroupChannelHandler in TypingIndicator
* Apply userListQuery
* Type definition for channellist and setting

## [v3.0.0] (July 12 2022)

Features:
* Support `modules` and `components` in the UIKit
* Upgraded to `@sendbird/chat@4`
* Support react 18
* See the Migration Guide for Converting V2 to V3. [[details](./MIGRATION_v2-to-v3.md)]
* See more details and breaking changes. [[details](./CHANGELOG.md)]

## [3.0.0-beta.6] (June 03 2022)

Feature:
* Show profile on clicking a mention
* Visual highlight when user is mention
* Add session handler interface
```
  // its recommended to memoize configureSession function
  const memoizedConfigureSession = (sb) => {
    const sessionHandler = new sb.SessionHandler();
    sessionHandler.onSessionTokenRequired = (onSuccess, onError) => {
    };
    return sessionHandler;
  };

  // see: https://sendbird.com/docs/chat/v3/javascript/guides/authentication
  <SendbirdProvider
    configureSession={memoizedConfigureSession}
  />
```

Fix:
* Change the front-weight of Subtitle2 from 600 to 500
* Modify mention badge position on the ChannelListItem component
* Change Info Icon size to 20px on the SuggestedMentionListItem component
* Differentiate the message status 'read' and 'delivered' with message grouping
* Modify KeyDown event handler on the message input for sending Korean text edge case
Fix: Mention related stuff
* Modify the onMouseOver event on the SuggestedMentionList component
* Filter 'html' text when pasting text to the MessageInput component
* Hide and apply ellipsis for overflowing text on the SuggestedMentionListItem component
* Deactivate the MessageInput component when the current user is muted or the current channel is frozen
* Reset the mention states of the current channel when changing channel and closing the edit MessageInput component

## [3.0.0-beta.5] (May 24 2022)
Fixes:
* Export useChannelList
* Active disableAutoSelect props
* Remove empty CSS file to fix source map warning

DOC:
* Add info about webpack 5 breaking changes

## [3.0.0-beta.4] (May 24 2022) -> unpublished
## [3.0.0-beta.3] (May 19 2022)
Fixes:
* Rate limit markAsDelivered call
* Do not render date separator when renderCustomSeparator is null
Misc:
* Update Chat SDK minimum version to `3.1.13`

## [3.0.0-beta.2] (April 29 2022)

Feature:
* Mention
  * Add isMentionEnabled props to the <App /> and <SendbirdProvider />
  * Add userMention into the config props of the <App /> andd <SendbirdProvider />
    * <SendbirdProvider config={{ userMention: { maxMentionCount: 10, maxSuggestionCount: 15 } }} />
    * maxMentionCount: A maximum count that you can mention in the message input
    * maxSuggestionCount: A maximum user count that the SuggestedMentionList suggests for user mention
  * Create SuggestedMentionList component under the Channel smart component
    * Create SuggestedUserMentionItem component
  * Create MentionUserLabel ui component
  * Add string set
    * MENTION_NAME__NO_NAME: '(No name)'
    * MENTION_COUNT__OVER_LIMIT: 'You can mention up to %d times per message.'
Fix:
* Type definition file fix for TS project
For typescript projects, add `node_modules/@sendbird/uikit-react/index.d.ts`
to your `include` section in tsconfig file to get type definitions

* Move font import to top of CSS file
Some bundlers such as parcel throw error:
`@import rules must precede all rules aside from @charset and @layer statements`
Resolve this issue by moving the line to the top

## [3.0.0-beta] (Apr 12 2022)

This is the official beta for Sendbird UIKit for React version 3!

TLDR -> We split the old `smart-components` into modules which contian context and UI. Context contain logic and UI Components handle UI

**[Check out the v2 to v3 migration guide for details](MIGRATION_v2-to-v3.md)**

Changelog:
* Package should be installed using `@sendbird/uikit-react`
* Restructure smart-components into modules that contain a context and related UI components
* Export these context and UI components to allow fine-grain customization
* Recommend to use these context elements `useXXXXX()` and react function components to make custom components
* All generic UI components are available as exports
* Restrcuture export paths to allow better tree-shaking
* Example:
```
import { useChannel } from '@sendbird/uikit-react/Channel/context';
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI';
```
* We keep older export patterns to make migration easier
* Retained modules - ChannelList, Channel, ChannelSettings, OpenChannel, OpenChannelSettings, MessageSearch
* New modules(not including context and ui of above) - CreateChannel, EditUserProfile, ui
