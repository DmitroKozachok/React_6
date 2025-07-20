import axiosInstance from "../../../api/axiosInstance";
import { useFormik } from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../../../api/apiConfig";
import {useState} from "react";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import {mapServerErrorsToFormik} from "../../../helpers/formikErrorHelper";
import {EmailInput} from "../../../components/common/EmailInput";
import {PasswordInput} from "../../../components/common/PasswordInput";
import {jwtDecode} from "jwt-decode";
import {useAuthStore} from "../../../store/authStore";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Введіть правильний формат, наприклад ex@gmail.com").required("Пошта не може бути порожньою"),
    password: Yup.string().required("Пароль не може бути порожнім")
});

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { setUser, user } = useAuthStore((state) => state);
    // console.log("User authenticated", user);

    const initValues = {
        email: "",
        password: ""
    };

    const handleFormikSubmit = async (values) => {
        setIsLoading(true);
        console.log("Submit formik", values);
        try {
            var result = await axiosInstance.post(`${BASE_URL}/api/Account/login`, values);
            console.log("Server result", result);

            const token = result.data.token;

            localStorage.setItem("jwt", token);

            // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const decoded = jwtDecode(token);
            setUser(decoded);
            //
            // console.log("Decoded", decoded);
            //
            navigate("/");

            setIsLoading(false);

        } catch(err) {
            console.error("Send request error", err);

            mapServerErrorsToFormik(err, setErrors);

            setIsLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: initValues,
        onSubmit: handleFormikSubmit,
        validationSchema: validationSchema,
    });

    const {values, handleSubmit, errors, touched, setErrors, handleChange, setFieldValue} = formik;

    const navigate = useNavigate();

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <div className="d-flex justify-content-center align-items-center my-5">
                <div className="col-md-8 col-lg-6">
                    <div className="p-4 p-md-5 border rounded-3 bg-body-tertiary shadow">

                        <h2 className="text-center mb-4">Вхід</h2>

                        {errors.general && (
                            <div className="alert alert-danger" role="alert">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <EmailInput
                                    label="Email"
                                    field="email"
                                    error={errors.email}
                                    touched={touched.email}
                                    value={values.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <PasswordInput
                                    label="Пароль"
                                    field="password"
                                    error={errors.password}
                                    touched={touched.password}
                                    value={values.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-success fs-5" disabled={isLoading}>
                                    Увійти
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

};

export default LoginPage;