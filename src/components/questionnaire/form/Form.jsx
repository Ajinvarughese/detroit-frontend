import { Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  Radio,
  Switch,
  Button,
  FormControl,
  Select,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion"; // Import motion

const QUESTION_TYPES = ["Text", "Multiple choice", "Checkboxes", "Dropdown"];

const Form = ({ questionData, questionCount, onDelete }) => {
  const [question, setQuestion] = useState("Untitled Question");
  const [questionType, setQuestionType] = useState("Multiple choice");
  const [options, setOptions] = useState(["Option 1"]);
  const [required, setRequired] = useState(false);

  console.log(questionData);
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const renderOptionInput = (option, index) => {
    const InputControl =
      questionType === "Checkboxes"
        ? Checkbox
        : questionType === "Multiple choice"
        ? Radio
        : null;

    return (
      <Box key={index} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        {InputControl && <InputControl disabled />}
        <TextField
          variant="outlined"
          placeholder="Enter option"
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          sx={{ flex: 1, mr: 1 }}
        />
        <IconButton onClick={() => removeOption(index)}>
          <Delete />
        </IconButton>
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // Initial state (invisible, slightly smaller)
      animate={{ opacity: 1, scale: 1 }}   // Final state (visible, normal size)
      exit={{ opacity: 0, scale: 0.9 }}    // On exit (fade out, shrink)
      transition={{ duration: 0.3 }}       // Animation duration
    >
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
          mb: 2,
        }}
      >
        <FormControl sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="overline" sx={{ opacity: 0.5 }}>
              Question {questionCount}
            </Typography>
            <IconButton onClick={onDelete}>
              <Delete />
            </IconButton>
          </Box>
          <Box sx={{ border: "1px solid #ccc", borderRadius: 2, mt: 1, p: 2 }}>
            <TextField
              fullWidth
              placeholder="Enter question"
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              variant="outlined"
              sx={{ mt: 1, width: "100%" }}
            >
              {QUESTION_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ mt: 2 }}>
              {options.map((option, index) => renderOptionInput(option, index))}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#1a73e8",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
                onClick={addOption}
              >
                + Add option
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Required</Typography>
                <Switch
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                />
              </Box>
            </Box>
          </Box>
        </FormControl>
      </Box>
    </motion.div>
  );
};

export default Form;
