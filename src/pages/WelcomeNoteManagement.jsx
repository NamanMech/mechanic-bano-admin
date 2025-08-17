import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

export default function WelcomeNoteManagement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNote = async () => {
    try {
      const response = await axios.get(`${API_URL}welcome`);
      if (response.data?.title && response.data?.message) {
        setTitle(response.data.title);
        setMessage(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching welcome note");
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}welcome`, {
        title: title.trim(),
        message: message.trim(),
      });
      toast.success("Welcome note updated successfully");
    } catch (error) {
      toast.error("Error saving welcome note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#333" }}>
            Welcome Note Management
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
            <TextField
              id="welcome-title"
              label="Welcome Note Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              fullWidth
            />
            <TextField
              id="welcome-message"
              label="Welcome Note Message"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              required
              multiline
              rows={6}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update Welcome Note"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
