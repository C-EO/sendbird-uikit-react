import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { LabelStringSet } from '../../../../ui/Label';
import { isDefaultChannelName } from '../../../../utils';

export const getChannelTitle = (
  channel: GroupChannel,
  currentUserId: string,
  stringSet: { [label: string]: string },
): string => {
  const LABEL_STRING_SET: { [label: string]: string } = stringSet || LabelStringSet;
  if (!channel?.name && !channel?.members) {
    return LABEL_STRING_SET.NO_TITLE;
  }
  if (!isDefaultChannelName(channel)) {
    return channel.name;
  }

  if (channel?.members?.length === 1) {
    return LABEL_STRING_SET.NO_MEMBERS;
  }

  return channel?.members
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => (nickname || LABEL_STRING_SET.NO_NAME))
    .join(', ');
};
