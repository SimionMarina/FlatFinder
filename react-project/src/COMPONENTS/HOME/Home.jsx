import { useState, useEffect } from "react";
import NewFlat from "./NewFlat";
import Header from "../HEADER/Header";
import FlatsTable from "./FlatsTable";
import { Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/authContext";

function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [refetchFlag, setRefetchFlag] = useState(false);
  const [tableType, setTableType] = useState("all");

  const handleTableTypeChange = (type) => {
    setTableType(type);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="background__container">
      <div className="background__image"></div>
      <div className="background__overlay"></div>
      <Header />
      <div className="hero__section__home">
        <Container sx={{ display: "flex", gap: "5px", padding: "20px 0", marginLeft: "8.5%" }}>
          <Button
            className="table__buttons"
            variant="contained"
            onClick={() => handleTableTypeChange("all")}
            sx={{
              backgroundColor: tableType === "all" ? "#8a2be2" : "rgb(220,222,224,255)",
              border: "1px solid black", color:"black", fontFamily:"inherit", fontSize:"16px",
              "&:hover": { backgroundColor: "rgb(109, 98, 129)",color:"wheat" },
            }}
          >
            All flats
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTableTypeChange("myFlats")}
            sx={{
              backgroundColor: tableType === "myFlats" ? "#8a2be2" : "rgb(220,222,224,255)",
              border: "1px solid black", color:"black", fontFamily:"inherit", fontSize:"16px",
              "&:hover": { backgroundColor: "rgb(109, 98, 129)" , color:"wheat"},
            }}
          >
            My flats
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTableTypeChange("favorites")}
            sx={{
              backgroundColor: tableType === "favorites" ? "#8a2be2" : "rgb(220,222,224,255)",
              border: "1px solid black", color:"black", fontFamily:"inherit", fontSize:"16px",
              "&:hover": { backgroundColor: "rgb(109, 98, 129)",color:"wheat" },
            }}
          >
            Favorite flats
          </Button>
        </Container>
        <FlatsTable tableType={tableType} refetchFlag={refetchFlag}/>
        <NewFlat setRefetchFlag={setRefetchFlag}/>
      </div>
    </div>
  );
}

export default Home;
