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
        <Container sx={{ display: "flex", gap: "5px", padding: "20px" }}>
          <Button
            className="table__buttons"
            variant="contained"
            onClick={() => handleTableTypeChange("all")}
            sx={{
              backgroundColor: tableType === "all" ? "red" : "gray",
              border: "none",
              "&:hover": { backgroundColor: "brown" },
            }}
          >
            All flats
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTableTypeChange("myFlats")}
            sx={{
              backgroundColor: tableType === "myFlats" ? "red" : "gray",
              border: "none",
              "&:hover": { backgroundColor: "brown" },
            }}
          >
            My flats
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTableTypeChange("favorites")}
            sx={{
              backgroundColor: tableType === "favorites" ? "red" : "gray",
              border: "none",
              "&:hover": { backgroundColor: "brown" },
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
