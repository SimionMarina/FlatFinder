import NewFlat from "./NewFlat";
import Header from "./Header";
import { Container,Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#47008F',
    },
  },
});
function Home() {
  return (
    <ThemeProvider theme={theme}>
    <div>
      <Header />
      <Container sx={{display: "flex", gap: "5px",padding: "20px"}}>
        <Button variant="contained">All flats</Button>
        <Button variant="contained" color="secondary">My flats</Button>
        <Button variant="contained">Favorite flats</Button>
      </Container>
      <NewFlat />
    </div>
    </ThemeProvider>
  );
}

export default Home;
