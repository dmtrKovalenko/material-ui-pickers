import * as React from 'react';
import Picker from '../Picker/Picker';
import { ReactWrapper } from 'enzyme';
import { TextField } from '@material-ui/core';
import { MaterialUiPickersDate } from '../typings/date';
import { mount, utilsToUse, mountPickerWithState } from './test-utils';
import {
  DatePicker,
  MobileDatePicker,
  DesktopDatePicker,
  DatePickerProps,
  StaticDatePicker,
} from '../DatePicker/DatePicker';

describe('e2e - DatePicker default year format', () => {
  let component: ReactWrapper<DatePickerProps>;
  const onChangeMock = jest.fn();
  const date = utilsToUse.date('2018-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    component = mount(
      <DatePicker
        renderInput={props => <TextField {...props} />}
        DialogProps={{}}
        PopoverProps={{}}
        desktopModeMediaQuery="(min-width:720px)"
        value={utilsToUse.date('2018-01-01T00:00:00.000')}
        onChange={onChangeMock}
        views={['year']}
      />
    );
  });

  it('Should use year format by default for year only view', () => {
    expect(component.find('input').props().value).toBe(utilsToUse.format(date, 'year'));
  });
});

describe('e2e - DatePicker default year month format', () => {
  let component: ReactWrapper<DatePickerProps>;
  const onChangeMock = jest.fn();
  const date = utilsToUse.date('2018-01-01T00:00:00.000Z');

  beforeEach(() => {
    component = mount(
      <MobileDatePicker
        renderInput={props => <TextField {...props} />}
        onChange={onChangeMock}
        value={date}
        views={['year', 'month']}
      />
    );
  });

  it('Should use year month format by default for year & month views', () => {
    expect(component.find('input').props().value).toBe(utilsToUse.format(date, 'monthAndYear'));
  });
});

describe('e2e - DatePicker default year month day format', () => {
  let component: ReactWrapper<DatePickerProps>;
  const onChangeMock = jest.fn();
  const date = utilsToUse.date('2018-01-01T00:00:00.000Z');

  beforeEach(() => {
    component = mount(
      <MobileDatePicker
        renderInput={props => <TextField {...props} />}
        onChange={onChangeMock}
        value={date}
        views={['year', 'month', 'date']}
      />
    );
  });

  it('Should use default for year & month & day views', () => {
    expect(component.find('input').props().value).toBe(utilsToUse.format(date, 'keyboardDate'));
  });
});

describe('e2e - DatePicker inline variant', () => {
  let component: ReactWrapper<DatePickerProps>;
  const onChangeMock = jest.fn();
  const onCloseMock = jest.fn();
  const onOpenMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    component = mount(
      <DesktopDatePicker
        renderInput={props => <TextField {...props} />}
        autoOk
        onChange={onChangeMock}
        onClose={onCloseMock}
        onOpen={onOpenMock}
        value={utilsToUse.date('2018-01-01T00:00:00.000Z')}
      />
    );
  });

  it('Should open modal with picker on click', () => {
    component.find('button[data-mui-test="open-picker-from-keyboard"]').simulate('click');

    expect(component.find(Picker)).toHaveLength(1);
    expect(onOpenMock).toHaveBeenCalled();
  });

  it.skip('Should close on popover close request', () => {
    component.find('button[data-mui-test="open-picker-from-keyboard"]').simulate('click');
    const popoverOnClose = component
      .find('WithStyles(ForwardRef(Popover))')
      .prop('onClose') as () => void;

    popoverOnClose();

    expect(component.find(Picker)).toHaveLength(0);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('Should dispatch onChange and close on day select', () => {
    component.find('button[data-mui-test="open-picker-from-keyboard"]').simulate('click');
    component
      .find('Day button')
      .at(10)
      .simulate('click');

    expect(onChangeMock).toHaveBeenCalled();
    expect(component.find('WithStyles(ForwardRef(Popover))').props().open).toBeFalsy();
  });
});

describe('e2e - DatePicker onMonthChange', () => {
  let component: ReactWrapper<DatePickerProps>;
  const onChangeMock = jest.fn();
  const onMonthChangeMock = jest.fn();

  const date = utilsToUse.date('2018-01-01T00:00:00.000Z');
  beforeEach(() => {
    component = mount(
      <MobileDatePicker
        renderInput={props => <TextField {...props} />}
        open
        onChange={onChangeMock}
        onMonthChange={onMonthChangeMock}
        value={date}
      />
    );
  });

  it('Should dispatch onMonthChange on month switches', () => {
    component
      .find('button[data-mui-test="previous-arrow-button"]')
      .first()
      .simulate('click');

    expect(onMonthChangeMock).toBeCalled();
  });
});

describe('e2e - DatePicker loading prop', () => {
  it('Should display loading indicator instead of calendar when `loading` passed', () => {
    const component = mount(
      <MobileDatePicker
        open
        loading
        renderInput={props => <TextField {...props} />}
        onChange={jest.fn()}
        value={utilsToUse.date('2018-01-01T00:00:00.000Z')}
      />
    );

    expect(component.find('[data-mui-test="day"]').length).toBe(0);
    expect(component.find('[data-mui-test="loading-progress"]').length).toBe(1);
  });

  it('Should display custom LoadingComponent when `loading` passed', () => {
    const component = mount(
      <MobileDatePicker
        open
        loading
        renderInput={props => <TextField {...props} />}
        onChange={jest.fn()}
        renderLoading={() => <div data-mui-test="custom-loading" />}
        value={utilsToUse.date('2018-01-01T00:00:00.000Z')}
      />
    );

    expect(component.find('[data-mui-test="loading-progress"]').length).toBe(0);
    expect(component.find('[data-mui-test="custom-loading"]').length).toBe(1);
  });
});

it('Custom toolbar component', () => {
  const component = mount(
    <MobileDatePicker
      renderInput={props => <TextField {...props} />}
      open
      disableHighlightToday
      value={new Date()}
      onChange={jest.fn()}
      ToolbarComponent={() => <div id="custom-toolbar" />}
    />
  );

  expect(component.find('#custom-toolbar').length).toBe(1);
});

it('Selected date is disabled', () => {
  const component = mount(
    <MobileDatePicker
      renderInput={props => <TextField {...props} />}
      open
      value={utilsToUse.date('01-01-2019')}
      maxDate={utilsToUse.date('01-01-2018')}
      onChange={jest.fn()}
    />
  );

  expect(
    component
      .find('[data-mui-test="calendar-year-text"]')
      .first()
      .text()
  ).toBe('2018');
  expect(
    component
      .find('[data-mui-test="calendar-month-text"]')
      .first()
      .text()
  ).toBe('January');
});

it('Should not add to loading queue when synchronous', () => {
  const component = mountPickerWithState(null as MaterialUiPickersDate, props => (
    <StaticDatePicker toolbarPlaceholder="Enter Date" {...props} />
  ));

  expect(component.find('h4[data-mui-test="datepicker-toolbar-date"]').text()).toBe('Enter Date');

  component
    .find('button[data-mui-test="day"]')
    .at(0)
    .simulate('click');

  expect(component.find('h4[data-mui-test="datepicker-toolbar-date"]').text()).not.toBe(
    'Enter Date'
  );
});
