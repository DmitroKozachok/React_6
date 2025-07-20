import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import CategorySearchForm from "../../components/CategorySearchForm";
import PaginationBar from "../../components/common/PaginationBar";

const CategoriesPage = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [isAuthDialog, setIsAuthDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const fetchCategories = async (params = {}) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/api/Categories/search?${query}`);
            setItems(res.data.items);
            setTotalPages(res.data.totalPge);
            setCurrentPage(res.data.currentPge);
        } catch (err) {
            console.error("Помилка при завантаженні категорій", err);
        }
    };

    useEffect(() => {
        fetchCategories(searchParams);
    }, []);

    const handleSearch = (params) => {
        const query = new URLSearchParams(params);
        setSearchParams(query);
        fetchCategories(params);
    };

    const handlePageChange = (page) => {
        const params = Object.fromEntries(searchParams.entries());
        const newParams = { ...params, pageNumber: page };
        setSearchParams(newParams);
        fetchCategories(newParams);
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setConfirmVisible(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`/api/Categories/delete`, {
                data: { id: selectedId }
            });
            setItems((prev) => prev.filter((item) => item.id !== selectedId));
        } catch (err) {
            console.error("Помилка при видаленні", err);
            if (err.response?.status === 401) {
                setIsAuthDialog(true);
            }
        } finally {
            setIsDeleting(false);
            setConfirmVisible(false);
            setSelectedId(null);
        }
    };

    return (
        <>
            {isDeleting && <LoadingOverlay/>}
            {confirmVisible && (
                <ConfirmDialog
                    message="Ви впевнені, що хочете видалити цю категорію?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmVisible(false)}
                />
            )}

            <div className="container mt-5">
                <h2 className="text-center fw-bold mb-3">Категорії</h2>
                <CategorySearchForm onSearch={handleSearch} />
                <div className="text-center mb-4">
                    <Link to="create" className="btn btn-success">Додати</Link>
                </div>
                {items.length === 0 ? (
                    <div className="alert alert-warning text-center">
                        Список категорій порожній
                    </div>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <table className="table table-hover table-bordered m-0">
                                <thead className="table-light">
                                <tr className="text-center align-middle">
                                    <th style={{width: "10%"}}>#</th>
                                    <th style={{width: "40%"}}>Назва</th>
                                    <th style={{width: "40%"}}>Зображення</th>
                                    <th style={{width: "10%"}}>Дії</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="align-middle text-center">
                                        <td>{item.id}</td>
                                        <td className="text-start ps-3">{item.name}</td>
                                        <td>
                                            <img
                                                src={`${BASE_URL}/images/200_${item.image}`}
                                                alt={item.name}
                                                style={{width: "75px", height: "75px", objectFit: "cover"}}
                                            />
                                        </td>
                                        <td>
                                            <Link
                                                className="btn btn-sm btn-outline-warning"
                                                to={`update/${item.slug}`}>Редагувати
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger mt-2"
                                                onClick={() => handleDeleteClick(item.id)}>Видалити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <div className="container mt-3">
                <PaginationBar
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default CategoriesPage;
