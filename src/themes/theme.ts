import { green, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material';

export const maineColorOverwrite = '#000';

export const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: maineColorOverwrite
    },
  },
});