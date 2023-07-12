
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "utils/axios";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import "./Mobile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormContainer = styled("div")(({ theme }) => ({}));

const Form = styled("form")(({ theme }) => ({}));

const SubmitButton = styled(Button)(({ theme }) => ({}));

function Mobile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(59);
  const [isNumberSubmitted, setIsNumberSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`users/mobile`, { number }).then((res) => {
      if (res.data) {
        toast.success("Your OTP has been sent.");
        console.log(res.data.to);
        setIsNumberSubmitted(true);
        setCounter(59);
      }
    });
  };
  const handleOtpSubmit = (event) => {
    try {
      event.preventDefault();
      axios.post(`users/otp`, { otp, number }).then((res) => {
        dispatch(
          setLogin({
            user: res.data.user,
            token: res.data.token,
          })
        );
        if (res.status < 205) navigate("/");
      });
    } catch (error) {}
  };

  const handleChange = (event) => {
    setNumber(event.target.value);
  };
  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  
  const handleResendClick = () => {
   
    setCounter(59); 
  };
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [isNumberSubmitted,counter]);

  return (
    <>  <ToastContainer autoClose={1300} /> 
      <FormContainer className="form-control shadow-lg">
        <Form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="number"
            label="Contact Number"
            autoComplete="contactnumber"
            autoFocus
            className="text-light"
            value={number}
            onChange={handleChange}
          />
         

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="py-2"
          >
            Submit Number
          </SubmitButton>
        </Form>


        <Form noValidate onSubmit={handleOtpSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="number"
            label="OTP"
            autoComplete="otp"
            autoFocus
            value={otp}
            onChange={handleOtpChange}
          />
            {isNumberSubmitted ? (
            counter > 0 ? (
              <p>Resend OTP in {counter} seconds</p>
            ) : (
              <button onClick={handleResendClick}>Resend OTP</button>
            )
          ) : null}

          <SubmitButton
            type="submit"
            className="py-2"
            fullWidth
            variant="contained"
            color="primary"
          >
            Submit OTP.
          </SubmitButton>
        </Form>
      </FormContainer>
    </>
  );
}

export default Mobile;