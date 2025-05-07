import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Home, Add, ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence and motion
import Form from "./form/Form";

const QuestionnaireMaker = () => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [questions, setQuestions] = useState([{ id: uuidv4() }]);
  const [showTemplates, setShowTemplates] = useState(false);

  const addNewQuestion = () => {
    setQuestions([...questions, { id: uuidv4() }]);
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleTemplates = () => {
    setShowTemplates(!showTemplates);
  };

  return (
    <Box
      sx={{
        background: "#f0ebf8",
        color: "#2d2d2d",
        minHeight: "100vh",
        padding: "7rem 5%",
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          width: "95%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          zIndex: 100,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          p: "0.6rem 2%",
          display: "flex",
          borderRadius: 2,
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => window.location.href = "/"} sx={{ color: "#2D2D2D" }}>
          <Home fontSize="large" />
        </IconButton>
        <Typography variant="inherit" sx={{ ml: 2 }}>
          Questionnaire Form
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained">Publish</Button>
      </Box>

      {/* Templates Dropdown */}
      <Box
        sx={{
          background: "#fff",
          maxWidth: "800px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          width: "100%",
          mx: "auto",
          transition: "0.3s ease",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            Survey Templates
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleTemplates}>
            {showTemplates ? <ArrowDropUp /> : <ArrowDropDown />}
          </IconButton>
        </Box>
        {showTemplates && (
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                m: 3,
                opacity: 0.6,
                textAlign: "center",
                width: "100%",
              }}
            >
              No templates available
            </Typography>
          </Box>
        )}
      </Box>

      {/* Title and Description */}
      <Box
        sx={{
          background: "#fff",
          maxWidth: "800px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          width: "100%",
          mx: "auto",
          transition: "0.3s ease",
          p: 3,
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Questionnaire title"
          inputProps={{
            style: { fontSize: "1.5rem", fontWeight: "bold", padding: '15px 2px 4px 2px' },
          }}
        />
        <TextField
          fullWidth
          variant="standard"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
          inputProps={{
            style: { padding: '15px 2px 4px 2px' },
          }}
        />
      </Box>

      {/* Render Forms with animation */}
      <AnimatePresence>
        {questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, scale: 0.95 }}   // Initial state (fading in, slightly smaller)
            animate={{ opacity: 1, scale: 1 }}       // Final state (fully visible, normal size)
            exit={{ opacity: 0, scale: 0.95 }}       // On exit (fading out, shrinking)
            transition={{ duration: 0.3 }}            // Duration of the animation
          >
            <Form
              questionCount={index + 1}
              questionData={q}
              onDelete={() => removeQuestion(q.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Question Button */}
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Button variant="contained" onClick={addNewQuestion} endIcon={<Add />}>
          Add Question
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionnaireMaker;
