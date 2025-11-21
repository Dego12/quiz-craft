import { FC, useEffect, useRef, useState } from "react";
import { Box, createTheme, IconButton, InputAdornment, ThemeProvider } from "@mui/material";
import classes from "../styles/SignUpPage.module.css";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import TextField from "@mui/material/TextField";
import { initializeIcons, PrimaryButton } from "@fluentui/react";
import { useNavigate, useParams } from "react-router-dom";
import redirects from "../resources/redirects.json";
import settings from "../resources/settings.json";
import { toast } from "react-toastify";
import constants from "../resources/constants.json";

export const ResetPasswordPage: FC = () => {

    const resetPasswordToken = useParams()[redirects.ResetPasswordTokenParam];

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const PasswordErrorBulletPoints = useRef<any>({});
    const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const [errors, setErrors] = useState<string>();

    const navigate = useNavigate();

    enum PasswordBulletPoints {
        PasswordCapitalLetter,
        PasswordNumberOfCharacters,
        PasswordSpecialCharacter,
        PasswordMatchWithRepeatPassword,
    }

    useEffect(() => {
        if (!resetPasswordToken) {
            navigate(redirects.Login);
            return;
        }

        fetch(settings.BaseUrl + settings.User + settings.ResetPasswordValidation, {
            method: "GET",
            mode: "cors",
            headers: {
                resetPasswordToken: resetPasswordToken
            }
        }).then(async (response) => {
            if (response.status >= 400) {
                navigate(redirects.Login);
                return;
            }
        }) 

    }, []);

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        if (id === "password") {
            setPassword(value);
        }
        if (id === "confirmPassword") {
            setConfirmPassword(value);
        }
    };

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

    function handleSubmit() {
        fetch(settings.BaseUrl + settings.User + settings.ChangePassword, {
            method: "PUT",
            mode: "cors",
            headers: {
                Accept: "application/json",
                newPassword: password,
                token: `${resetPasswordToken}`
            }
        }).then(
            async (response) => {
                if (response.status == 200) {
                    navigate(redirects.Login);
                    toast.success(constants.ToastPasswordChanged,
                    {
                        position: "top-right",
                        autoClose: 3000,
                    })
                }
                else{
                    setErrors(constants.PasswordPreviouslyUsed)
                }
            }
        )}

    const theme = createTheme({ palette: { error: { main: '#000000' } } });
    initializeIcons();
    return (
        <div className={classes.signUp}>
            <h1>{constants.ResetPassword}</h1>
            <div className={classes.textFields}>
                <Box
                    component="form"
                    display="flex"
                    justifyContent="space-between"
                    flexDirection="column"
                >
                    <ThemeProvider theme={theme}>
                        <TextField
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

                        <br />

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
                    <div className={classes.passwordError}>{errors}</div>
                    <div className={classes.actions}>
                        <PrimaryButton
                            className={classes.finalizeActionButton}
                            text={constants.SavePassword}
                            onClick={handleSubmit}
                            disabled={
                                !password?.trim() ||
                                !confirmPassword?.trim() ||
                                !isPasswordCorrect
                            }
                        />
                    </div>
                </Box>
            </div>
        </div>
    );

}
