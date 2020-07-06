import * as React from 'react';
import Year from './Year';
import { MaterialUiPickersDate } from '../../typings/date';
import { useUtils, useNow } from '../../_shared/hooks/useUtils';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { findClosestEnabledDate } from '../../_helpers/date-utils';
import { WrapperVariantContext } from '../../wrappers/WrapperVariantContext';
import { useGlobalKeyDown, keycode as keys } from '../../_shared/hooks/useKeyDown';

export interface ExportedYearSelectionProps {
  /**
   * Callback firing on year change @DateIOType.
   */
  onYearChange?: (date: MaterialUiPickersDate) => void;
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view. @DateIOType.
   */
  shouldDisableYear?: (day: MaterialUiPickersDate) => boolean;
}

export interface YearSelectionProps extends ExportedYearSelectionProps {
  allowKeyboardControl?: boolean;
  changeFocusedDay: (day: MaterialUiPickersDate) => void;
  date: MaterialUiPickersDate;
  disableFuture?: boolean | null | undefined;
  disablePast?: boolean | null | undefined;
  isDateDisabled: (day: MaterialUiPickersDate) => boolean;
  maxDate: MaterialUiPickersDate;
  minDate: MaterialUiPickersDate;
  onChange: (date: MaterialUiPickersDate, isFinish: boolean) => void;
}

export const useStyles = makeStyles(
  {
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflowY: 'auto',
      height: '100%',
    },
  },
  { name: 'MuiPickersYearSelection' }
);

export const YearSelection: React.FC<YearSelectionProps> = ({
  allowKeyboardControl,
  changeFocusedDay,
  date: __dateOrNull,
  isDateDisabled,
  maxDate,
  minDate,
  disableFuture,
  disablePast,
  onChange,
  onYearChange,
  shouldDisableYear,
}) => {
  const now = useNow();
  const theme = useTheme();
  const utils = useUtils();
  const classes = useStyles();
  const rootRef = React.useRef(null);

  const selectedDate = __dateOrNull || now;
  const currentYear = utils.getYear(selectedDate);
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const selectedYearRef = React.useRef<HTMLButtonElement>(null);
  const [focusedYear, setFocusedYear] = React.useState<number | null>(currentYear);

  const handleYearSelection = React.useCallback(
    (year: number, isFinish = true) => {
      const submitDate = (newDate: MaterialUiPickersDate) => {
        onChange(newDate, isFinish);
        changeFocusedDay(newDate);

        if (onYearChange) {
          onYearChange(newDate);
        }
      };

      const newDate = utils.setYear(selectedDate, year);
      if (isDateDisabled(newDate)) {
        const closestEnabledDate = findClosestEnabledDate({
          utils,
          date: newDate,
          minDate,
          maxDate,
          disablePast: Boolean(disablePast),
          disableFuture: Boolean(disableFuture),
          shouldDisableDate: isDateDisabled,
        });

        submitDate(closestEnabledDate);
      } else {
        submitDate(newDate);
      }
    },
    [
      utils,
      selectedDate,
      isDateDisabled,
      onChange,
      changeFocusedDay,
      onYearChange,
      minDate,
      maxDate,
      disablePast,
      disableFuture,
    ]
  );

  const focusYear = React.useCallback(
    (year: number) => {
      if (!isDateDisabled(utils.setYear(selectedDate, year))) {
        setFocusedYear(year);
      }
    },
    [selectedDate, isDateDisabled, utils]
  );

  const yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;
  const nowFocusedYear = focusedYear || currentYear;
  useGlobalKeyDown(Boolean(allowKeyboardControl), {
    [keys.ArrowUp]: () => focusYear(nowFocusedYear - yearsInRow),
    [keys.ArrowDown]: () => focusYear(nowFocusedYear + yearsInRow),
    [keys.ArrowLeft]: () => focusYear(nowFocusedYear + (theme.direction === 'ltr' ? -1 : 1)),
    [keys.ArrowRight]: () => focusYear(nowFocusedYear + (theme.direction === 'ltr' ? 1 : -1)),
  });

  return (
    <div ref={rootRef} className={classes.container}>
      {utils.getYearRange(minDate, maxDate).map(year => {
        const yearNumber = utils.getYear(year);
        const selected = yearNumber === currentYear;

        return (
          <Year
            key={utils.format(year, 'year')}
            selected={selected}
            value={yearNumber}
            onSelect={handleYearSelection}
            allowKeyboardControl={allowKeyboardControl}
            focused={yearNumber === focusedYear}
            ref={selected ? selectedYearRef : undefined}
            disabled={
              (disablePast && utils.isBeforeYear(year, now)) ||
              (disableFuture && utils.isAfterYear(year, now)) ||
              (shouldDisableYear && shouldDisableYear(year))
            }
          >
            {utils.format(year, 'year')}
          </Year>
        );
      })}
    </div>
  );
};
