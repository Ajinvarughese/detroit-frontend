import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Select, MenuItem, Button,
  InputLabel, FormControl, Input, Grid, InputAdornment, styled
} from '@mui/material';
import { User, CalendarDays, Percent, CloudUploadIcon } from 'lucide-react';
import { convertToString } from '../../hooks/EnumToString';
import { PictureAsPdf } from '@mui/icons-material';

const loanCategory = [
  "POLLUTION_PREVENTION",
  "CLIMATE_ADAPTATION",
  "CLIMATE_MITIGATION",
  "CIRCULAR_ECONOMY"
];

const VisuallyHiddenInput = (props) => (
  <input
    type="file"
    style={{
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    }}
    {...props}
  />
);


const styles = {
  input: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '& input[type=number]': {
      MozAppearance: 'textfield',
    }
  }
};

const LoanApplicationForm = () => {

  const [form, setForm] = useState({
    userId: '',
    loanCategory: '',
    amount: '',
    durationMonths: '',
    interestRate: '',
    projectReport: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadedFiles(file ? [file] : []);
    // Optional: Also update form.projectReport if you want to keep it synced
    setForm(prev => ({ ...prev, projectReport: file || null }));
  };



  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'amount') {
      // Remove non-digit characters
      const rawValue = value.replace(/\D/g, '');
      // Format only if there's a valid number
      const formattedValue = rawValue ? new Intl.NumberFormat('en-IN').format(rawValue) : '';
      setForm((prev) => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Loan Registration Submitted:', form);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 4,
        boxShadow: 4
      }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Loan Application
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" mb={4}>
          Complete the fields below to apply for the loan
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3} direction="column">
            {/* User ID */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User ID"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8 }} />
                }}
              />
            </Grid>

            {/* Loan Category */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Loan Category</InputLabel>
                <Select
                  label="Loan Category"
                  displayEmpty
                  name="loanCategory"
                  value={form.loanCategory}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select Loan Category</em>
                  </MenuItem>
                  {
                    loanCategory.map((category) => (
                      <MenuItem key={category} value={category}>
                        {convertToString(category)}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>

            {/* Amount */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"  // Use text type for formatted input
                label="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                sx={styles.input}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  inputProps: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                }}
              />
            </Grid>

            {/* Duration (Months) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Duration (Months)"
                name="durationMonths"
                value={form.durationMonths}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <CalendarDays size={20} style={{ marginRight: 8 }} />
                }}
              />
            </Grid>
            

            {/* Interest Rate */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Interest Rate (%)"
                name="interestRate"
                value={form.interestRate}
                onChange={handleChange}
                required
                sx={styles.input}
                InputProps={{
                  startAdornment: <Percent size={20} style={{ marginRight: 8 }} />
                }}
              />
            </Grid>

            {/* Project Report*/}
            <Grid item xs={12}>
              <InputLabel shrink>Project Report as PDF *</InputLabel>

              {/* Display Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {uploadedFiles.map((file, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PictureAsPdf color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2">{file.name}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Upload Button */}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 'bold'
                }}
              >
                Submit Application
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoanApplicationForm;
