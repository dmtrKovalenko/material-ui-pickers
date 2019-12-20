import React, { useState } from 'react';
import { DateTimePicker } from '@material-ui/pickers';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const muiTheme = createMuiTheme({
  spacing: 2,
});

function CssThemeExample() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <ThemeProvider theme={muiTheme}>
      <DateTimePicker label="2px spacing" value={selectedDate} onChange={handleDateChange} />
    </ThemeProvider>
  );
}

export default CssThemeExample;
