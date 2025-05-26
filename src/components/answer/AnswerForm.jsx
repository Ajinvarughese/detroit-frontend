import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  LinearProgress,
  Paper,
} from '@mui/material';

import { useParams } from 'react-router';

const AnswerForm = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const response = await axios.get(`http://localhost:8080/api/questionnaire/u/form/${id}`);
        const fetchedQuestions = response.data.questions.map((q) => ({
          id: q.id,
          text: q.questionText,
          type: q.questionType,
          options: q.choices.map((choice) => ({
            id: choice.id,
            text: choice.choiceText,
          })),
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (qid, value) => {
    setResponses((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const submission = Object.entries(responses).map(([questionId, response]) => ({
      questionId,
      response,
    }));
    console.log(submission);
    try {
      const response = await axios.post("http://localhost:8080/api/questionnaire/submit", submission, {
        'Content-type': 'application/json'
      });
      setSubmitted(true);
      console.log(response.data); 
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  if (submitted) {
    return (
      <div className="questionnaire-wrapper">
        <div className="questionnaire-box">✅ Thank you for submitting!</div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="questionnaire-wrapper">
        <div className="questionnaire-box">Loading...</div>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://img.freepik.com/free-vector/subtle-rombus-white-gray-pattern-background_1017-25098.jpg)',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: 500, p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Button onClick={handlePrev} disabled={currentIndex === 0}>
            ← Back
          </Button>
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <LinearProgress
              variant="determinate"
              value={((currentIndex + 1) / questions.length) * 100}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {question.text}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {question.type === 'TEXT'
            ? 'Please enter your answer here.'
            : question.type === 'RADIO'
            ? 'Please select an option.'
            : question.type === 'FILE'
            ? 'Please upload your file here.'
            : 'Please select all that apply.'}
        </Typography>

        {question.type === 'TEXT' && (
          <TextField
            fullWidth
            variant="outlined"
            value={responses[question.id]?.value || ''}
            onChange={(e) =>
              handleChange(question.id, { value: e.target.value })
            }
          />
        )}

        {question.type === 'RADIO' && (
          <FormControl component="fieldset">
            <RadioGroup
              value={responses[question.id]?.choiceId || ''}
              onChange={(e) =>
                handleChange(question.id, {
                  choiceId: parseInt(e.target.value),
                  value: question.options.find((o) => o.id === parseInt(e.target.value)).text,
                })
              }
            >
              {question.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  value={opt.id}
                  control={<Radio />}
                  label={opt.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}

        {question.type === 'CHECKBOX' && (
          <FormControl component="fieldset">
            {question.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                control={
                  <Checkbox
                    checked={
                      responses[question.id]?.some((res) => res.choiceId === opt.id) || false
                    }
                    onChange={(e) => {
                      const prevChoices = responses[question.id] || [];
                      const updatedChoices = e.target.checked
                        ? [...prevChoices, { choiceId: opt.id, value: opt.text }]
                        : prevChoices.filter((res) => res.choiceId !== opt.id);
                      handleChange(question.id, updatedChoices);
                    }}
                  />
                }
                label={opt.text}
              />
            ))}
          </FormControl>
        )}

        {question.type === 'FILE' && (
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) =>
                handleChange(question.id, { file: e.target.files[0] })
              }
            />
          </Button>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleNext}
          disabled={
            !responses[question.id] ||
            (question.type === 'CHECKBOX' && responses[question.id].length === 0)
          }
        >
          {currentIndex === questions.length - 1 ? 'Submit' : 'Continue'}
        </Button>
      </Paper>
    </Box>
  );
};

export default AnswerForm;
