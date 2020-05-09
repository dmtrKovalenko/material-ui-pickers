import * as PropTypes from 'prop-types';
import { MaterialUiPickersDate } from '../typings/date';

export const date = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.string,
  PropTypes.number,
  PropTypes.instanceOf(Date),
]);

const datePickerView = PropTypes.oneOf(['year', 'month', 'day']);

export type ParsableDate = string | number | Date | null | undefined | MaterialUiPickersDate;

export const DomainPropTypes = { date, datePickerView };

export const defaultMinDate = new Date('1900-01-01');

export const defaultMaxDate = new Date('2100-01-01');

export const inputPropTypes = {
  renderInput: PropTypes.func.isRequired,
  mask: PropTypes.string,
  rifmFormatter: PropTypes.func,
  openPickerIcon: PropTypes.node,
  OpenPickerButtonProps: PropTypes.object,
  acceptRegex: PropTypes.instanceOf(RegExp),
  getOpenDialogAriaText: PropTypes.func,
};
