import { useUtils } from '../_shared/hooks/useUtils';
import { BasePickerProps } from '../typings/BasePicker';
import { pick12hOr24hFormat } from '../_helpers/text-field-helper';
import { WrappedPurePickerProps, makePurePicker } from '../Picker/WrappedPurePicker';
import { makeKeyboardPicker, WrappedKeyboardPickerProps } from '../Picker/WrappedKeyboardPicker';

type TimePickerView = 'hours' | 'minutes' | 'seconds';

export interface BaseTimePickerProps {
  /**
   * 12h/24h view for hour selection clock
   * @default true
   */
  ampm?: boolean;
  /**
   * Step over minutes
   * @default 1
   */
  minutesStep?: number;
  /** Show the seconds view */
  seconds?: boolean;
}

export interface TimePickerViewsProps extends BasePickerProps, BaseTimePickerProps {
  /** Array of views to show */
  views?: TimePickerView[];
  /** Open to timepicker */
  openTo?: TimePickerView;
}

export type TimePickerProps = WrappedPurePickerProps & TimePickerViewsProps;

export type KeyboardTimePickerProps = WrappedKeyboardPickerProps & TimePickerViewsProps;

const defaultProps = {
  openTo: 'hours' as TimePickerView,
  views: ['hours', 'minutes'] as TimePickerView[],
};

function useOptions(props: TimePickerViewsProps) {
  const utils = useUtils();

  return {
    getDefaultFormat: () =>
      pick12hOr24hFormat(props.format, props.ampm, {
        '12h': utils.time12hFormat,
        '24h': utils.time24hFormat,
      }),
  };
}

export const TimePicker = makePurePicker<TimePickerViewsProps>({ useOptions });

export const KeyboardTimePicker = makeKeyboardPicker<TimePickerViewsProps>({ useOptions });

TimePicker.defaultProps = defaultProps;

KeyboardTimePicker.defaultProps = defaultProps;
