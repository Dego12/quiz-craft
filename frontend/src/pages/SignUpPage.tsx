import { DefaultButton, initializeIcons, Link, PrimaryButton } from "@fluentui/react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Box, createTheme, IconButton, InputAdornment, ThemeProvider } from "@mui/material";
import TextField from "@mui/material/TextField";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { injectStyle } from "react-toastify/dist/inject-style";
import redirects from "../resources/redirects.json";
import settings from "../resources/settings.json";
import { checkEmailFormat, setCookie } from "../resources/Utilities";
import classes from "../styles/SignUpPage.module.css";
import constants from "../resources/constants.json";
injectStyle();

export const SignUpPage: FC = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState<string[]>([]);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const PasswordErrorBulletPoints = useRef<any>({});
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  enum PasswordBulletPoints {
    PasswordCapitalLetter,
    PasswordNumberOfCharacters,
    PasswordSpecialCharacter,
    PasswordMatchWithRepeatPassword,
  }

  const handleNotify = () => {
    if (isValid() === true) {
      handleSubmit();
    }
  };

  function isValid(): boolean {
    if (!checkEmailFormat(email)) {
      return false;
    } else {
      return true;
    }
  }

  const MarkBulletPointCorrectiness = (
    BulletPointElement: PasswordBulletPoints,
    isCorrect: boolean
  ) => {
    if (isCorrect === true) {
      PasswordErrorBulletPoints.current[BulletPointElement].className = classes.CheckedPasswordBullet;
    } else {
      PasswordErrorBulletPoints.current[BulletPointElement].className = classes.listElement;
    }
    return isCorrect;
  };

  useEffect(() => {
    function checkPassword(): void {
      let isPasswordCorrect: boolean = true;
      const startsWithUppercase: boolean = !!password?.match(/^[A-Z].*/);
      const hasSpecialCharacter: boolean = !!password?.match(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/
      );

      var isPasswordLongEnough = MarkBulletPointCorrectiness(PasswordBulletPoints.PasswordNumberOfCharacters, password!.length >= 5)
      var isFirstLetterCapital = MarkBulletPointCorrectiness(PasswordBulletPoints.PasswordCapitalLetter, startsWithUppercase)
      var containsSpecialCharacter = MarkBulletPointCorrectiness(PasswordBulletPoints.PasswordSpecialCharacter, hasSpecialCharacter)
      var doPasswordsMatch = MarkBulletPointCorrectiness(PasswordBulletPoints.PasswordMatchWithRepeatPassword, password === confirmPassword && password !== "")

      isPasswordCorrect =
        isPasswordLongEnough &&
        isFirstLetterCapital &&
        containsSpecialCharacter &&
        doPasswordsMatch &&
        password !== "" &&
        confirmPassword !== "";

      setIsPasswordCorrect(isPasswordCorrect);
    }

    checkPassword();
  }, [password, confirmPassword]);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    if (id === "username") {
      setName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = () => {
    if (password === confirmPassword) {
      let user = {
        name: name,
        email: email,
        password: password,
      };

      fetch(settings.BaseUrl + settings.User + settings.Post, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(user),
      })
        .then(async (r) => {
          if (r.status === 400) setErrors([constants.EmailExists]);
          else return await r.json();
        })
        .then((data) => {
          setCookie(settings.token, data.accessToken);
          navigate(redirects.MainPage);
        });
    }
  };

  const theme = createTheme({ palette: { error: { main: '#000000' } } });
  initializeIcons();
  return (
    <div className={classes.signUp}>
      <h1 className={classes.formTitle}>{constants.Signup}</h1>
      <div className={classes.textFields}>
        <Box
          component="form"
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
        >
          <ThemeProvider theme={theme}>
            <TextField
              sx={{ input: { color: 'white' } }}
              id="username"
              name={Date.now().toString()}
              label={constants.Username}
              onChange={(e) => handleInputChange(e)}
              value={name}
              error={!name?.trim()}
              required

            />
            <br />
            <TextField
              sx={{ input: { color: 'white' } }}
              id="email"
              name={Date.now().toString()}
              label={constants.Email}
              onChange={(e) => handleInputChange(e)}
              value={email}
              error={!checkEmailFormat(email) || !email?.trim()}
              required

            />
            <br />
            <TextField
              sx={{ input: { color: 'white' } }}
              id="password"
              label={constants.Password}
              onChange={(e) => handleInputChange(e)}
              value={password}
              error={!isPasswordCorrect}
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
                ),
              }}
              autoComplete="new-password"
              required
            />
            <div className={classes.SignUpPasswordBullets}>
              <li
                className={classes.listElement}
                ref={(element) =>
                (PasswordErrorBulletPoints.current[
                  PasswordBulletPoints.PasswordCapitalLetter
                ] = element)
                }
              >
                <span>
                  {constants.PasswordCapitalLetter}
                </span>
              </li>
              <li
                className={classes.listElement}
                ref={(element) =>
                (PasswordErrorBulletPoints.current[
                  PasswordBulletPoints.PasswordNumberOfCharacters
                ] = element)
                }
              >
                <span>
                  {constants.PasswordNumberOfCharacters}
                </span>
              </li>
              <li
                className={classes.listElement}

                ref={(element) =>
                (PasswordErrorBulletPoints.current[
                  PasswordBulletPoints.PasswordSpecialCharacter
                ] = element)
                }
              >
                <span>
                  {constants.PasswordSpecialCharacter}
                </span>
              </li>
              <li
                className={classes.listElement}
                ref={(element) =>
                (PasswordErrorBulletPoints.current[
                  PasswordBulletPoints.PasswordMatchWithRepeatPassword
                ] = element)
                }
              >
                <span>
                  {constants.PasswordMatchWithRepeatPassword}
                </span>
              </li>
            </div>
            <br />
            <TextField
              sx={{ input: { color: 'white' } }}
              id="confirmPassword"
              label={constants.ConfirmPassword}
              onChange={(e) => handleInputChange(e)}
              value={confirmPassword}
              className={classes.textFieldSignUp}
              error={!isPasswordCorrect}
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
          </ThemeProvider>
          <div className={classes.actions}>
            <PrimaryButton
              className={classes.backButton}
              text={constants.Back}
              onClick={() => {
                navigate(redirects.LandingPage);
              }}
            />
            <PrimaryButton
              className={classes.finalizeActionButton}
              text={constants.CreateAccount}
              onClick={handleNotify}
              disabled={
                !name?.trim() ||
                !email?.trim() ||
                !password?.trim() ||
                !confirmPassword?.trim() ||
                !isPasswordCorrect ||
                !isValid()
              }
            />

          </div>
        </Box>
      </div>

      <br />
      <div className={classes.signUpErrors}>{errors}</div>
      <div className={classes.redirectToRegisterOrLogin}>
        <p>
          {constants.HaveAccount}&nbsp;
          <Link className={classes.redirectLink} onClick={() => {
            navigate(redirects.Login)
          }}>{constants.Login}</Link>
        </p>
      </div>
    </div>
  );
};