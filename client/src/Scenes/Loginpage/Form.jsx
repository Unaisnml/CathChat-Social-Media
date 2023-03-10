import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Input,
  Alert,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../State/state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
// import toast from "react-toast";

import OtpForm from "./OtpForm";
import { sendOtp, userLogin } from "../../Api/AuthRequest";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [pageType, setPageType] = useState("login");
  const [otpField, setOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState();
  const [regButton, setRegButton] = useState(true);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);
    setUserDetails(formData);

    const response = await sendOtp(values.email);
    console.log(response, "this is otp response");

    if (response) {
      console.log(response, "otp......");
      setRegButton(false);
      if (response.data.message === "OTP sent") {
        setOtpField(true);
        setOtp(response.data.response.otp);
      } else {
        console.log("error");
      }
    }
    // console.log("submit");
    // const savedUserResponse = await fetch(
    //   "http://localhost:3001/auth/register",
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );
    // // console.log(savedUserResponse, "hiii");
    // const savedUser = await savedUserResponse().json();
    // onSubmitProps.resetForm();
    // // console.log(savedUser, "saved");
    // if (savedUser) {
    //   console.log("aaaa");
    //   setPageType("login");
    // }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const response = await userLogin(values, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response, "responselogin");

      if (response.status === 400) {
        console.log("errorrrr");
      }

      if (response.data.success) {
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate("/home");
      } else {
        console.log("password error");
        setPasswordLoader(true);
      }
    } catch (error) {
      setPasswordLoader(true);
      console.log(error.data);
    }
    // const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(values),
    // });
    // const loggedIn = await loggedInResponse.json();
    // onSubmitProps.resetForm();
    // if (loggedIn) {
    //   dispatch(
    //     setLogin({
    //       user: loggedIn.user,
    //       token: loggedIn.token,
    //     })
    //   );
    //   navigate("/home");
    // }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <div>
      {!otpField ? (
        <div>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  {isRegister && (
                    <>
                      <TextField
                        label="First Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                        name="firstName"
                        error={
                          Boolean(touched.firstName) &&
                          Boolean(errors.firstName)
                        }
                        helperText={touched.firstName && errors.firstName}
                        sx={{ gridColumn: "span 2" }}
                      />

                      <TextField
                        label="Last Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                        name="lastName"
                        error={
                          Boolean(touched.lastName) && Boolean(errors.lastName)
                        }
                        helperText={touched.lastName && errors.lastName}
                        sx={{ gridColumn: "span 2" }}
                      />

                      <TextField
                        label="Location"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.location}
                        name="location"
                        error={
                          Boolean(touched.location) && Boolean(errors.location)
                        }
                        helperText={touched.location && errors.location}
                        sx={{ gridColumn: "span 4" }}
                      />

                      <TextField
                        label="Occupation"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.occupation}
                        name="occupation"
                        error={
                          Boolean(touched.occupation) &&
                          Boolean(errors.occupation)
                        }
                        helperText={touched.occupation && errors.occupation}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <Box
                        gridColumn="span 4"
                        border={`1px solid ${palette.neutral.medium}`}
                        borderRadius="5px"
                        p="1rem"
                      >
                        <Dropzone
                          acceptedFiles=".jpg,.jpeg,.png"
                          multiple={false}
                          onDrop={(acceptedFiles) =>
                            setFieldValue("picture", acceptedFiles[0])
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box
                              {...getRootProps()}
                              border={`2px dashed ${palette.primary.main}`}
                              p="1rem"
                              sx={{ "&:hover": { cursor: "pointer" } }}
                            >
                              <input {...getInputProps()} />
                              {!values.picture ? (
                                <p>Add Picture Here</p>
                              ) : (
                                <FlexBetween>
                                  <Typography>{values.picture.name}</Typography>
                                  <EditOutlinedIcon />
                                </FlexBetween>
                              )}
                            </Box>
                          )}
                        </Dropzone>
                      </Box>
                    </>
                  )}

                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>
                {/* BUTTON   */}

                <Box>
                  {regButton ? (
                    <Button
                      fullWidth
                      type="submit"
                      sx={{
                        m: "2rem 0",
                        p: "1rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      {isLogin ? "LOGIN" : "REGISTER"}
                    </Button>
                  ) : null}
                  <Typography
                    onClick={() => {
                      setPageType(isLogin ? "register" : "login");
                      resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.light,
                      },
                    }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign Up here."
                      : "Already have an account? Login here."}
                  </Typography>
                  {/* <Typography onclick={()=>{}}>
                    {isLogin?"Forgot your password":""}
                  </Typography> */}
                </Box>
              </form>
            )}
          </Formik>
        </div>
      ) : (
        <OtpForm
          userDetails={userDetails}
          otp={otp}
          setPageType={setPageType}
          setOtpField={setOtpField}
          setRegButton={setRegButton}
        />
      )}
    </div>
  );
};

export default Form;
