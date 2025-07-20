import './App.css';
import CategoriesPage from "./pages/categories";
import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import NoMatch from "./pages/NoMatch";
import HomePage from "./pages/Home";
import CategoriesCreatePage from "./pages/categories/Create";
import CategoriesUpdateForm from "./pages/categories/Update";
import LoginPage from "./pages/account/Login";
import {useAuthStore} from "./store/authStore";
import {jwtDecode} from "jwt-decode";
import {useEffect} from "react";
import ProductsPage from "./pages/products";
import ProductPage from "./pages/products/product";
import CreateProductPage from "./pages/products/Create";
import EditProductPage from "./pages/products/Edit";
import {useCartStore} from "./store/cartStore";

const App = () => {

    const { setUser } = useAuthStore((state) => state);
    const loadCart = useCartStore((state) => state.loadCart);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (token) {
                const decoded = jwtDecode(token);
                await setUser(decoded);
            }
            await loadCart();
            console.log("View load data");

        } catch (error) {
            console.error("Error checking authentication:", error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>

                    <Route path={"categories"}>
                        <Route index element={<CategoriesPage/>}/>
                        <Route path={"create"} element={<CategoriesCreatePage/>}/>
                        <Route path="update/:slug" element={<CategoriesUpdateForm/>}/>
                    </Route>

                    <Route path={"products"}>
                        <Route index element={<ProductsPage/>} />
                        <Route path={"product/:id"} element={<ProductPage/>} />
                        <Route path={"create"} element={<CreateProductPage/>} />
                        <Route path={"edit/:id"} element={<EditProductPage/>} />
                    </Route>

                    <Route path={"login"} element={<LoginPage/>}/>

                    {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
                    <Route path="*" element={<NoMatch/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
