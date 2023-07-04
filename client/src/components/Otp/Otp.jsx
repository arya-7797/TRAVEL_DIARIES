import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from 'utils/axios';
//import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";

const FormContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));
const Form = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(22),
  width: 300,
  marginLeft: "40%",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));
 

function Otp({ userNumber }) {
  //const classes = useStyles();
  const [otp, setOtp] = useState("");
  const history = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`users/otp`, { otp, userNumber }).then((res) => {
      if (res.data.resp.valid) {
        history.push("/");
      } else {
        alert("Expired otp");
      }
    });
  };

  const handleChange = (event) => {
    setOtp(event.target.value);
  };

  return (
    <>
      <FormContainer>
        <Form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="number"
            label="Otp"
            autoComplete="Otp"
            autoFocus
            value={otp}
            onChange={handleChange}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Submit Otppp
          </SubmitButton>
        </Form>
      </FormContainer>
    </>
  );
}
export default Otp;


