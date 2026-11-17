import styled from '@emotion/styled';
import { useTranslations } from '@suprsend/react-core';
import { IArchiveAllConfirmTheme } from '../interface';
import { CText, lightColors, lightStatusColors } from '../utils/styles';
import ArchiveIcon from '../NotificationCard/Icons/ArchiveIcon';

export type ArchiveAllConfirmState = 'confirming' | 'started';

interface ArchiveAllConfirmProps {
  state: ArchiveAllConfirmState;
  onCancel: () => void;
  onConfirm: () => void;
  style?: IArchiveAllConfirmTheme;
}

export default function ArchiveAllConfirm({
  state,
  onCancel,
  onConfirm,
  style,
}: ArchiveAllConfirmProps) {
  const { t } = useTranslations();
  const confirming = state === 'confirming';
  const textColor = style?.text?.color || lightStatusColors.neutralText;
  const iconStyle = {
    color: lightStatusColors.neutralText,
    height: 16,
    width: 16,
    ...style?.icon,
  };

  return (
    <Container
      className="ss-feed-archive-all-confirm"
      role="status"
      style={{
        backgroundColor: lightStatusColors.neutralBackground,
        ...style?.container,
      }}
    >
      {confirming && (
        <IconContainer>
          <ArchiveIcon style={iconStyle} />
        </IconContainer>
      )}
      <Text
        className="ss-feed-archive-all-confirm-text"
        style={{ color: lightStatusColors.neutralText, ...style?.text }}
      >
        {t(confirming ? 'archiveAllConfirm' : 'archiveAllStarted')}
        {confirming && (
          <Actions className="ss-feed-archive-all-confirm-actions">
            <Action
              className="ss-feed-archive-all-confirm-cancel"
              style={{ color: textColor, ...style?.cancelText }}
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              {t('cancel')}
            </Action>
            <Separator aria-hidden="true">•</Separator>
            <Action
              className="ss-feed-archive-all-confirm-action"
              style={{ color: lightColors.primary, ...style?.confirmText }}
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
            >
              {t('archiveAll')}
            </Action>
          </Actions>
        )}
      </Text>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 16px;
`;

const IconContainer = styled.span`
  display: flex;
  flex-shrink: 0;
  margin-top: 1px;
`;

const Text = styled(CText)`
  font-size: 13px;
  line-height: 1.45;
`;

const Actions = styled.span`
  margin-left: 8px;
  white-space: nowrap;
`;

const Action = styled.span`
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

const Separator = styled.span`
  margin: 0px 6px;
`;
