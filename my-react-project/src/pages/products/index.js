import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {BASE_URL} from "../../api/apiConfig";
import {Card,Button,Col,Row,Spinner,Container} from "react-bootstrap";
import {Modal} from "antd";


const ProductsPage = () => {
    // const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupedProducts, setGroupedProducts] = useState([]);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [id, setDeleteId] = useState(null);

    useEffect(() => {
        axiosInstance.get("/api/Products")
            .then(res => {
                const { data } = res;
                console.log('Get list of products', data);
                // setList(data);
                groupBySlug(data);
            })
            .catch(err => console.error('Error loading products', err))
            .finally(() => setLoading(false));
    }, []);

    const groupBySlug = (items) => {
        const grouped = Object.values(items.reduce((acc, item) => {
            if (!acc[item.slug]) {
                acc[item.slug] = {
                    ...item,
                    sizes: [],
                };
            }
            acc[item.slug].sizes.push({
                sizeName: item.productSize?.name,
                price: item.price,
                id: item.id
            });
            console.log("acc",acc);
            return acc;

        }, {}));

        setGroupedProducts(grouped);
    };

    const showDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteModalOk = async () => {
        try {
            if (!id) return;

            await axiosInstance.delete(`/api/Products/${id}`);

            setGroupedProducts(prev =>
                prev.filter(product => product.id !== id)
            );

            handleDeleteModalCancel();
            setDeleteId(null);
        } catch (error) {
            console.log("Помилка при видаленні продукту", error);
        }
    };

    const handleDeleteModalCancel = () => {
        setIsDeleteModalVisible(false);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4">Продукти</h2>

            <div className="d-flex justify-content-end mb-4">
                <Link to="create" className="btn btn-success fs-5">
                    Додати продукт
                </Link>
            </div>

            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {groupedProducts.map(product => (
                    <Col key={product.slug}>
                        <Card className="h-100 shadow-lg border-0 rounded-3">
                            <Card.Img
                                variant="top"
                                src={`${BASE_URL}/images/800_${product.productImages?.[0]?.name}`}
                                alt={product.name}
                                style={{ objectFit: 'cover', height: '200px', borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fw-semibold text-center mb-3">{product.name}</Card.Title>

                                {product.sizes?.map((size, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-1">
                                        <span>{size.sizeName}</span>
                                        <strong>{size.price} грн</strong>
                                    </div>
                                ))}

                                <div className="mt-auto d-grid gap-2">
                                    <Link to={`product/${product.id}`} className="btn btn-success btn-sm">
                                        Переглянути
                                    </Link>

                                    <Link to={`edit/${product.id}`} className="btn btn-outline-warning btn-sm">
                                        Редагувати
                                    </Link>

                                    <button
                                        onClick={() => showDeleteModal(product.id)}
                                        className="btn btn-outline-danger btn-sm text-dark"
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title="Ви впевнені, що хочете видалити цей продукт?"
                open={isDeleteModalVisible}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
                okText="Видалити"
                cancelText="Скасувати"
            />
        </Container>
    );
};

export default ProductsPage;