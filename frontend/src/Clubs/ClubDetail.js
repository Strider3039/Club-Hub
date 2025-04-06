import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authAxios from "../utils/authAxios";
import NavBar from "../NavBar/NavBar";

function ClubDetail() {
  const { id } = useParams(); // read clubId from URL
  const [club, setClub] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        // We assume your backend has an endpoint like /clubs/:id
        // or you can adapt as needed
        const response = await authAxios.get(`/clubs/${id}/detail/`);
        setClub(response.data);
      } catch (error) {
        console.error("Error fetching club details:", error);
      }
    };
    fetchClub();
  }, [id]);

  if (!club) {
    return <div>Loading club info...</div>;
  }

  return (
    <div>
      <NavBar page={club.name} />
      <div style={{ margin: "20px" }}>
        <h2>{club.name}</h2>
        <p>{club.description}</p>
        {/*
          Add more club data or event calendar here
          e.g. <ClubCalendar clubId={id} />
        */}
      </div>
    </div>
  );
}

export default ClubDetail;
