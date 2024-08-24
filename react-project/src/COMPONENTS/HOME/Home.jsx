import { useState, useEffect } from "react";
import NewFlat from "./NewFlat";
import Header from "./Header";
import FlatsTable from "./FlatsTable";
import { Container,Button } from "@mui/material";
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/authContext";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#303a43',
//       // light: will be calculated from palette.primary.main,
//       // dark: will be calculated from palette.primary.main,
//       // contrastText: will be calculated to contrast with palette.primary.main
//     },
//     secondary: {
//       main: '#E0C2FF',
//       light: '#F5EBFF',
//       // dark: will be calculated from palette.secondary.main,
//       contrastText: '#47008F',
//     },
//   },
// });
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
    // <ThemeProvider theme={theme}>
    <div className="background__container">
    <div className="background__image"></div>
    <div className="background__overlay"></div>
    <Header />
    <div className="hero__section__home">
      <Container sx={{ display: "flex", gap: "5px", padding: "20px" }}>
        <Button className="table__buttons" variant="contained" onClick={() => handleTableTypeChange("all")}
              sx={{ backgroundColor: "gray",border:"none", '&:hover': { backgroundColor: "brown" } }}

          >
          All flats
        </Button>
        <Button
          variant="contained"
          onClick={() => handleTableTypeChange("myFlats")}
          sx={{ backgroundColor: "red",border:"none", '&:hover': { backgroundColor: "brown" } }}        >
          My flats
        </Button>
        <Button variant="contained" onClick={() => handleTableTypeChange("favorites")}
                        sx={{ backgroundColor: "gray",border:"none", '&:hover': { backgroundColor: "brown" } }}
>
          Favorite flats
        </Button>
      </Container>
      <FlatsTable tableType={tableType} />
      <NewFlat />
    </div>
  </div>
  
    // </ThemeProvider>
  );
}

export default Home;
