import {
  classNamesFunction,
  initializeIcons,
  Link,
  PrimaryButton
} from "@fluentui/react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Box, createTheme, IconButton, InputAdornment, TextField, ThemeProvider } from "@mui/material";
import { createApiEndpoint, Endpoints } from "../api/UserApi";
import { LoginCredentialsDTO } from "../models/LoginCredentialsDTO";
import redirects from "../resources/redirects.json";
import settings from "../resources/settings.json";
import { checkEmailFormat, setCookie } from "../resources/Utilities";
import classes from "../styles/SignUpPage.module.css";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal";
import constants from "../resources/constants.json";

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);



  const userLogIn = async () => {
    let user: LoginCredentialsDTO = {
      Email: email !== undefined ? email : "",
      Password: password !== undefined ? password : "",
    };

    //   let response = createApiEndpoint(Endpoints.login).put(user);
    let response = await (
      await (createApiEndpoint(Endpoints.login)).put(user)
    ).json();
    if (response.success === true) {
      setCookie(settings.token, response.accessToken);
      navigate(redirects.MainPage);
    } else {
      setErrors([constants.InvalidCredentialsLogin]);
    }
  };


  const handleNotify = () => {
    if (checkEmailFormat(email)) {
      setErrors([]);
      userLogIn();
    } else {
      setErrors([constants.InvalidEmailFormatLogin]);
    }
  };

  const theme = createTheme({ palette: { error: { main: '#000000' } } });
  initializeIcons();

  return (
    <div className={classes.signUp}>
      <h1 className={classes.formTitle}>{constants.Login}</h1>
      <div className={classes.textFields}>
        <Box display="flex" justifyContent="space-between" flexDirection="column">
          <ThemeProvider theme={theme}>
            <TextField
              sx={{ input: { color: 'white' } }}
              error={!checkEmailFormat(email) || !email?.trim()}
              label={constants.Email}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
            <br />

            <TextField
              sx={{ input: { color: 'white' } }}
              label={constants.Password}
              error={!password?.trim()}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              required
            />
            <a
              className={classes.forgotPass}
              onClick={() => setModalVisible(true)}
            >
              {constants.ForgotPassword}
            </a>
          </ThemeProvider>
        </Box>
        <div className={classes.actions}>
          <PrimaryButton
            className={classes.backButton}
            onClick={() => navigate(redirects.LandingPage)}
            text={constants.Back}
          />
          <PrimaryButton
            className={classes.finalizeActionButton}
            text={constants.Login}
            onClick={() => handleNotify()}
            disabled={!email?.trim() || !password?.trim()}
          />
        </div>
      </div>
      <br />
      <div className={classes.loginErrors}>{errors}</div>
      <div className={classes.redirectToRegisterOrLogin}>
        <p>
          {constants.NoAccount}&nbsp;
          <Link className={classes.redirectLink} onClick={() => {
            navigate(redirects.Signup)
          }}>{constants.Signup}</Link>
        </p>
      </div>
      {modalVisible && (
        <ForgotPasswordModal
          setModalOpen={setModalVisible}
        />
      )}
    </div>
  );
};
