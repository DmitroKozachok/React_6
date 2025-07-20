import axiosInstance from "../../../api/axiosInstance";
import BaseTextInput from "../../../components/common/BaseTextInput";
import BaseFileInput from "../../../components/common/BaseFileInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import {mapServerErrorsToFormik} from "../../../helpers/formikErrorHelper";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Назва не може бути порожньою"),
    slug: Yup.string().required("Slug не може бути порожнім"),
    imageFile: Yup.mixed().nullable(),
});

const CategoriesUpdateForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            slug: "",
            imageFile: null,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            const data = new FormData();
            data.append("id", values.id);
            data.append("name", values.name);
            data.append("slug", values.slug);
            if (values.imageFile) {
                data.append("imageFile", values.imageFile);
            }

            try {
                await axiosInstance.put("/api/Categories/update", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                navigate("..");
            } catch (err) {
                console.error("Send request error", err);

                mapServerErrorsToFormik(err, setErrors);

                setIsLoading(false);
            }
        },
    });

    const { values, handleSubmit, errors, touched, handleChange, setFieldValue, setValues, setErrors } = formik;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axiosInstance.get(`/api/Categories/${slug}`);
                setValues({
                    id: res.data.id,
                    name: res.data.name,
                    slug: res.data.slug,
                    imageFile: null,
                });
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [slug]);

    const onHandleFileChange = (e) => {
        const files = e.target.files;
        setFieldValue("imageFile", files.length > 0 ? files[0] : null);
    };

    const onCancel = () => {
        navigate("/categories");
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <div className="d-flex justify-content-center align-items-center my-5">
                <div className="col-md-8 col-lg-6">
                    <div className="p-4 p-md-5 border rounded-3 bg-body-tertiary shadow">

                        <h2 className="text-center mb-4">Редагувати категорію</h2>

                        {errors.general && (
                            <div className="alert alert-danger" role="alert">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-3">
                                <BaseTextInput
                                    label="Назва"
                                    field="name"
                                    error={errors.name}
                                    touched={touched.name}
                                    value={values.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <BaseTextInput
                                    label="Slug"
                                    field="slug"
                                    error={errors.slug}
                                    touched={touched.slug}
                                    value={values.slug}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <BaseFileInput
                                    label="Оберіть зображення"
                                    field="imageFile"
                                    error={errors.imageFile}
                                    touched={touched.imageFile}
                                    onChange={onHandleFileChange}
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success fs-5"
                                    disabled={isLoading}>
                                    Змінити
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger fs-5"
                                    onClick={onCancel}>
                                    Скасувати
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoriesUpdateForm;
