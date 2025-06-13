import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const steps = ["Account Information", "Personal Details"];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: "auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
  },
}));

const RoleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.grey[300]}`,
  backgroundColor: selected ? theme.palette.primary.light : "transparent",
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.grey[100],
  },
}));

export default function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    number: "",
    firstname: "",
    secondname: "",
    type: "",
    service: "",
    experience: "",
    companyname: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        email: form.email,
        password: form.password,
        role: role,
        number: form.number ? parseInt(form.number) : undefined,
        firstname: form.firstname || undefined,
        secondname: form.secondname || undefined,
        type: form.type || undefined,
        service: form.service || undefined,
        experience: form.experience || undefined,
        companyname: form.companyname || undefined,
      };

      console.log('Sending signup request:', userData);
      const res = await axios.post("http://localhost:3001/signup", userData);
      
      if (res.status === 201) {
        console.log('Signup successful:', res.data);
        navigate("/signin");
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Create an Account
        </Typography>

        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <>
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </>
          )}

          {step === 1 && (
            <>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">I want to</FormLabel>
                <RadioGroup
                  row
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ gap: 2, mt: 1 }}
                >
                  <RoleButton
                    variant="outlined"
                    selected={role === "provider"}
                    onClick={() => setRole("provider")}
                    fullWidth
                  >
                    Provide Services
                  </RoleButton>
                  <RoleButton
                    variant="outlined"
                    selected={role === "buyer"}
                    onClick={() => setRole("buyer")}
                    fullWidth
                  >
                    Buy Services
                  </RoleButton>
                </RadioGroup>
              </FormControl>

              {role === "provider" && (
                <>
                  <StyledTextField
                    fullWidth
                    label="Company Name"
                    name="companyname"
                    value={form.companyname}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    fullWidth
                    label="Business Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    fullWidth
                    label="Services Offered"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    fullWidth
                    label="Years of Experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {role === "buyer" && (
                <>
                  <StyledTextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    fullWidth
                    label="Last Name"
                    name="secondname"
                    value={form.secondname}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    fullWidth
                    label="Company Name (Optional)"
                    name="companyname"
                    value={form.companyname}
                    onChange={handleChange}
                  />
                </>
              )}

              <StyledTextField
                fullWidth
                label="Phone Number"
                name="number"
                type="number"
                value={form.number}
                onChange={handleChange}
                required
              />
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={step === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
            {step === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !role}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : "S'inscrire"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!form.email || !form.password || !form.confirmPassword}
              >
                Suivant
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Vous avez déjà un compte ?{" "}
              <Button 
                component="a" 
                href="/signin" 
                color="primary"
                sx={{ textTransform: 'none', p: 0 }}
              >
                Connectez-vous
              </Button>
            </Typography>
          </Box>
        </form>
      </StyledPaper>
    </Box>
  );
}
