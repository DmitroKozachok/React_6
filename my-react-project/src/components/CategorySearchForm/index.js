import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseTextInput from "../../components/common/BaseTextInput";
import { useSearchParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
    id: Yup.number()
        .nullable()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .positive("ID має бути більше 0"),
    name: Yup.string().nullable(),
    slug: Yup.string().nullable(),
    itemsPerPage: Yup.number()
        .required("Кількість елементів обов'язкова")
        .positive("Повинна бути більше 0")
        .max(50),
    pageNumber: Yup.number()
        .required("Номер сторінки обов'язковий")
        .positive("Повинен бути більше 0")
});

const CategorySearchForm = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            slug: "",
            itemsPerPage: 10,
            pageNumber: 1,
        },
        validationSchema,
        onSubmit: (values) => {
            const query = new URLSearchParams();

            Object.entries(values).forEach(([key, val]) => {
                if (val !== null && val !== "") {
                    query.append(key, val);
                }
            });

            setSearchParams(query);
            onSearch(values);
        },
    });

    const { values, handleChange, handleSubmit, errors, touched } = formik;

    // Ініціалізуємо значення з URL при першому рендері
    useEffect(() => {
        const id = searchParams.get("id") || "";
        const name = searchParams.get("name") || "";
        const slug = searchParams.get("slug") || "";
        const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10");
        const pageNumber = parseInt(searchParams.get("pageNumber") || "1");

        formik.setValues({ id, name, slug, itemsPerPage, pageNumber });

        if (onSearch) {
            onSearch({ id, name, slug, itemsPerPage, pageNumber });
        }
    }, []);

    const handleReset = () => {
        const defaultValues = {
            id: "",
            name: "",
            slug: "",
            itemsPerPage: 10,
            pageNumber: 1,
        };

        formik.resetForm({ values: defaultValues });
        setSearchParams({});

        if (onSearch) {
            onSearch(defaultValues);
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="shadow rounded bg-light border mb-4 p-3"
            method="get"
        >
            <div className="row g-3">
                <div className="col-md-3">
                    <BaseTextInput
                        label="ID"
                        field="id"
                        value={values.id}
                        onChange={handleChange}
                        error={errors.id}
                        touched={touched.id}
                        placeholder="ID"
                        id="id"
                    />
                </div>

                <div className="col-md-3">
                    <BaseTextInput
                        label="Назва"
                        field="name"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        touched={touched.name}
                        placeholder="Введіть назву"
                        id="name"
                    />
                </div>

                <div className="col-md-3">
                    <BaseTextInput
                        label="Slug"
                        field="slug"
                        value={values.slug}
                        onChange={handleChange}
                        error={errors.slug}
                        touched={touched.slug}
                        placeholder="Slug"
                        id="slug"
                    />
                </div>

                <div className="col-md-3">
                    <BaseTextInput
                        label="Елементів на сторінці"
                        field="itemsPerPage"
                        type="number"
                        value={values.itemsPerPage}
                        onChange={handleChange}
                        error={errors.itemsPerPage}
                        touched={touched.itemsPerPage}
                    />
                </div>

            </div>

            <div className="row mt-3">
                <div className="col-12 d-flex justify-content-end">
                    <button type="submit" className="btn btn-success me-2">
                        Пошук
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleReset}
                    >
                        Очистити
                    </button>
                </div>
            </div>

            <input
                type="hidden"
                name="Pagination.CurrentPage"
                value={values.currentPage || 1}
            />
        </form>
    );
};

export default CategorySearchForm;
