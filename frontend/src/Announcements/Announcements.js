import React, { useEffect, useState } from "react";
import { fetchAnnouncements } from "../utils/authAxios";
import { Card, Button, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

function Announcements() {
  const { clubId } = useParams(); // expects the route to include :clubId
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        const res = await fetchAnnouncements(clubId);
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    getAnnouncements();
  }, [clubId]);

  if (loading) return <Spinner animation="border" variant="danger" className="m-3" />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Announcements</h2>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <Card key={a.id} className="mb-3">
            <Card.Body>
              <Card.Title>{a.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Posted by {a.author.username} on {new Date(a.created_at).toLocaleString()}
              </Card.Subtitle>
              <Card.Text>{a.content}</Card.Text>
              <div className="d-flex gap-3">
                <span>❤️ {a.likes.length} Likes</span>
                <span>💬 {a.comments.length} Comments</span>
                <Button variant="outline-primary" size="sm" href={`/announcements/${a.id}`}>View</Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default Announcements;
