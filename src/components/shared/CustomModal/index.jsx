// Library imports
import Modal from '@mui/material/Modal';

// Icons Import
import CloseIcon from '@mui/icons-material/Close';

// Local Imports
import { CustomButton } from '../CustomButton';
import { Line } from '../Line';

export const CustomModal = ({
  children,
  open,
  close,
  title,
  isDelete,
  primaryButton,
  primaryButtonText,
  handleSave,
  disableSave,
  loading,
  saveButtonSx,
  saveButton,
  noFooter,
  mainBoxClassName,
  headerBoxClassName,
  childClassName,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonProps,
  secondaryButtonProps,
  hideCloseIcon = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
}) => {
  const resolvedSecondaryText =
    secondaryButtonText !== undefined ? secondaryButtonText : 'Cancel';

  const {
    className: primaryButtonClassName,
    onClick: primaryButtonOnClick,
    loading: primaryButtonLoadingProp,
    disabled: primaryButtonDisabledProp,
    sx: primaryButtonSx,
    ...restPrimaryButtonProps
  } = primaryButtonProps || {};

  const {
    className: secondaryButtonClassName,
    onClick: secondaryButtonOnClick,
    sx: secondaryButtonSx,
    ...restSecondaryButtonProps
  } = secondaryButtonProps || {};

  const combinedPrimaryLoading =
    primaryButtonLoadingProp !== undefined ? primaryButtonLoadingProp : loading;
  const combinedPrimaryDisabled =
    primaryButtonDisabledProp !== undefined
      ? primaryButtonDisabledProp
      : disableSave;

  const handlePrimaryAction = () => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick();
      return;
    }

    if (primaryButtonOnClick) {
      primaryButtonOnClick();
      return;
    }

    handleSave?.();
  };

  const handleSecondaryAction = () => {
    if (onSecondaryButtonClick) {
      onSecondaryButtonClick();
      return;
    }

    if (secondaryButtonOnClick) {
      secondaryButtonOnClick();
      return;
    }

    close?.();
  };

  const handleModalClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return;
    close?.(event, reason);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleModalClose}
        disableEscapeKeyDown={disableEscapeKeyDown}
      >
        {/* Main container — capped height + scrollable body so tall forms never clip off-screen */}
        <div
          className={`absolute top-1/2 left-1/2 flex max-h-[90vh] w-[min(42rem,calc(100vw-1.5rem))] max-w-[min(42rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-white shadow-2xl rounded-lg pt-2.5 px-5 pb-2.5 ${mainBoxClassName}`}
        >
          {/* Modal Header */}
          <div
            className={`flex shrink-0 justify-between items-center gap-3 ${headerBoxClassName}`}
          >
            <p className='min-w-0 flex-1 text-[18px] text-gray-600'>{title}</p>
            {!hideCloseIcon && (
              <div className='shrink-0 cursor-pointer' onClick={() => close?.()}>
                <CloseIcon />
              </div>
            )}
          </div>
          <Line className={'mt-2.5 shrink-0'} />
          {/* Modal Children — max height leaves room for header, rule, footer; no flex-1 so short modals stay compact */}
          <div
            className={`max-h-[calc(90vh-12rem)] w-full shrink overflow-y-auto overflow-x-hidden ${childClassName}`}
          >
            {children}
          </div>

          {/* Modal Footer */}
          {!noFooter && (
            <div className='mt-3 flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 pt-3 xs:flex-row xs:justify-end xs:items-center'>
              <CustomButton
                onClick={handleSecondaryAction}
                variant={'outlined'}
                className={`!w-full xs:!w-fit ${
                  secondaryButtonClassName || ''
                }`.trim()}
                sx={{
                  width: { xxs: '100%', xs: 'fit-content' },
                  ...secondaryButtonSx,
                }}
                {...restSecondaryButtonProps}
              >
                <p fontSize={'14px'}>{resolvedSecondaryText}</p>
              </CustomButton>

              {saveButton === null ? (
                ''
              ) : (
                <CustomButton
                  type='button'
                  isDelete={isDelete}
                  onClick={handlePrimaryAction}
                  disabled={combinedPrimaryDisabled}
                  loading={combinedPrimaryLoading}
                  sx={{
                    width: { xxs: '100%', xs: 'fit-content' },
                    ...saveButtonSx,
                    ...primaryButtonSx,
                  }}
                  className={`!w-full xs:!w-fit ${
                    primaryButtonClassName || ''
                  }`.trim()}
                  {...restPrimaryButtonProps}
                >
                  <p className='leading-[16px] text-[14px]'>
                    {isDelete
                      ? primaryButtonText
                        ? primaryButtonText
                        : 'Delete'
                      : primaryButtonText
                      ? primaryButtonText
                      : 'Save'}
                  </p>
                </CustomButton>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
