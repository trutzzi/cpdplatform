import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: 'black'
    },
  },
});