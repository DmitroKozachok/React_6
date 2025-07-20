import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AppWrapper} from "./components/common/PageMeta.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <>
        <ThemeProvider>
            <AppWrapper>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId="814650397402-v0ph7i5b9phe92f5kq4rar13m0f0vuav.apps.googleusercontent.com">
                        <App/>
                    </GoogleOAuthProvider>
                </Provider>
            </AppWrapper>
        </ThemeProvider>
    </>,
)
