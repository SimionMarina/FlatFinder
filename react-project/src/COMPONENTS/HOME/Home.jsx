import { useState, useEffect } from "react";
import NewFlat from "./NewFlat";
import Header from "./Header";
import FlatsTable from "./FlatsTable";
import { Container,Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/authContext";

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
  const {currentUser} = useAuth();
  const navigate = useNavigate();
  const [tableType, setTableType] = useState("all");
  const handleTableTypeChange = (type) => {
    setTableType(type);
  };

  useEffect(()=> {
    if(!currentUser) {
      navigate("/login")
    }
  },[])
  return (
    <ThemeProvider theme={theme}>
    <div>
      <Header />
      <Container sx={{display: "flex", gap: "5px",padding: "20px"}}>
        <Button variant="contained" onClick={() => handleTableTypeChange("all")}>All flats</Button>
        <Button variant="contained" onClick={() => handleTableTypeChange("myFlats")} color="secondary">My flats</Button>
        <Button variant="contained" onClick={() => handleTableTypeChange("favorites")}>Favorite flats</Button>
      </Container>
      <FlatsTable tableType={tableType} />
      <NewFlat />
    </div>
    </ThemeProvider>
  );
}

export default Home;
