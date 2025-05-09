import React, { useCallback } from 'react';
import { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { SdkStore, Logger } from '../../../lib/Sendbird/types';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

export interface CreateNewOpenChannelCallbackProps {
  name: string;
  coverUrlOrImage?: string;
}
export interface CreateOpenChannelContextInterface extends CreateOpenChannelProviderProps {
  sdk: SdkStore['sdk'];
  sdkInitialized: boolean;
  logger: Logger;
  createNewOpenChannel: (props: CreateNewOpenChannelCallbackProps) => void;
}

const CreateOpenChannelContext = React.createContext<CreateOpenChannelContextInterface | null>(null);

export interface CreateOpenChannelProviderProps {
  className?: string;
  children?: React.ReactElement;
  onCreateChannel?: (channel: OpenChannel) => void;
  onBeforeCreateChannel?: (params: OpenChannelCreateParams) => OpenChannelCreateParams;
}

export const CreateOpenChannelProvider: React.FC<CreateOpenChannelProviderProps> = ({
  className,
  children,
  onCreateChannel,
  onBeforeCreateChannel,
}: CreateOpenChannelProviderProps): React.ReactElement => {
  const { state } = useSendbird();
  const { stores, config } = state;
  const { logger } = config;
  const sdk = stores?.sdkStore?.sdk || null;
  const sdkInitialized = stores?.sdkStore?.initialized || false;

  const createNewOpenChannel = useCallback((params: CreateNewOpenChannelCallbackProps): void => {
    const { name, coverUrlOrImage } = params;
    if (sdkInitialized) {
      const params = {} as OpenChannelCreateParams;
      params.operatorUserIds = sdk?.currentUser?.userId ? [sdk.currentUser.userId] : [];
      params.name = name;
      params.coverUrlOrImage = coverUrlOrImage;
      sdk.openChannel.createChannel(onBeforeCreateChannel?.(params) || params)
        .then((openChannel) => {
          logger.info('CreateOpenChannel: Succeeded creating openChannel', openChannel);
          onCreateChannel?.(openChannel);
        })
        .catch((err) => {
          logger.warning('CreateOpenChannel: Failed creating openChannel', err);
        });
    }
  }, [sdkInitialized, onBeforeCreateChannel, onCreateChannel]);

  return (
    <CreateOpenChannelContext.Provider
      value={{
        // interface
        sdk: sdk,
        sdkInitialized: sdkInitialized,
        logger: logger,
        createNewOpenChannel: createNewOpenChannel,
      }}
    >
      <div className={`sendbird-create-open-channel ${className}`} style={{ height: 0 }}>
        {children}
      </div>
    </CreateOpenChannelContext.Provider>
  );
};

export const useCreateOpenChannelContext = () => {
  const context = React.useContext(CreateOpenChannelContext);
  if (!context) throw new Error('CreateOpenChannelContext not found. Use within the CreateOpenChannel module.');
  return context;
};
