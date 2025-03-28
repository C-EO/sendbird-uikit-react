import React, { useState, useRef, useContext } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import useChannelSettings from '../../context/useChannelSettings';

import Modal from '../../../../ui/Modal';
import Input, { InputLabel } from '../../../../ui/Input';
import Avatar from '../../../../ui/Avatar/index';
import { ButtonTypes } from '../../../../ui/Button';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import TextButton from '../../../../ui/TextButton';
import ChannelAvatar from '../../../../ui/ChannelAvatar/index';
import uuidv4 from '../../../../utils/uuid';
import { FileCompat } from '@sendbird/chat';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

export type EditDetailsProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

const EditDetails: React.FC<EditDetailsProps> = (props: EditDetailsProps) => {
  const {
    onSubmit,
    onCancel,
  } = props;

  const {
    state: {
      channel,
      onChannelModified,
      onBeforeUpdateChannel,
      setChannelUpdateId,
    },
  } = useChannelSettings();
  const title = channel?.name;

  const { state } = useSendbird();
  const userId = state?.config?.userId;
  const theme = state?.config?.theme;
  const logger = state?.config?.logger;

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const { stringSet } = useContext(LocalizationContext);

  return (
    <Modal
      isFullScreenOnMobile
      titleText={stringSet.MODAL__CHANNEL_INFORMATION__TITLE}
      submitText={stringSet.BUTTON__SAVE}
      onCancel={onCancel}
      onSubmit={() => {
        if (title !== '' && !inputRef.current?.value) {
          if (formRef.current?.reportValidity) { // might not work in explorer
            formRef.current.reportValidity();
          }
          return;
        }

        const currentTitle = inputRef.current?.value;
        const currentImg = newFile;
        logger.info('ChannelSettings: Channel information being updated', {
          currentTitle,
          currentImg,
        });
        if (onBeforeUpdateChannel) {
          logger.info('ChannelSettings: onBeforeUpdateChannel');
          const params = onBeforeUpdateChannel(currentTitle ?? '', currentImg, channel?.data);
          channel?.updateChannel(params).then((groupChannel) => {
            onChannelModified?.(groupChannel);
            setChannelUpdateId(uuidv4());
            onSubmit();
          });
        } else {
          logger.info('ChannelSettings: normal');
          channel?.updateChannel({
            coverImage: currentImg as FileCompat,
            name: currentTitle,
            data: channel?.data || '',
          }).then((groupChannel) => {
            logger.info('ChannelSettings: Channel information updated', groupChannel);
            onChannelModified?.(groupChannel);
            setChannelUpdateId?.(uuidv4());
            onSubmit();
          });
        }
      }}
      type={ButtonTypes.PRIMARY}
    >
      <form
        className="channel-profile-form"
        ref={formRef}
        onSubmit={(e) => { e.preventDefault(); }}
      >
        <div className="channel-profile-form__img-section">
          <InputLabel>
            {stringSet.MODAL__CHANNEL_INFORMATION__CHANNEL_IMAGE}
          </InputLabel>
          <div className="channel-profile-form__avatar">
            {
              currentImg
                ? (
                  <Avatar
                    height="80px"
                    width="80px"
                    src={currentImg}
                  />
                ) : (
                  <ChannelAvatar
                    height={80}
                    width={80}
                    channel={channel}
                    userId={userId}
                    theme={theme}
                  />
                )
              }
          </div>
          <input
            ref={hiddenInputRef}
            type="file"
            accept="image/gif, image/jpeg, image/png"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files) {
                setCurrentImg(URL.createObjectURL(e.target.files[0]));
                setNewFile(e.target.files[0]);
              }
              if (hiddenInputRef.current) {
                hiddenInputRef.current.value = '';
              }
            }}
          />
          <TextButton
            className="channel-profile-form__avatar-button"
            onClick={() => hiddenInputRef.current?.click()}
            disableUnderline
          >
            <Label type={LabelTypography.BUTTON_1} color={LabelColors.PRIMARY}>
              {stringSet.MODAL__CHANNEL_INFORMATION__UPLOAD}
            </Label>
          </TextButton>
        </div>
        <div className="channel-profile-form__name-section">
          <InputLabel>
            {stringSet.MODAL__CHANNEL_INFORMATION__CHANNEL_NAME}
          </InputLabel>
          <Input
            required={title !== ''}
            name="channel-profile-form__name"
            ref={inputRef}
            value={title}
            placeHolder={stringSet.MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditDetails;
