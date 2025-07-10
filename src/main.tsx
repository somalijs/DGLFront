import { createRoot } from 'react-dom/client';
import './index.css';
import './application.css';
import 'swiper/swiper-bundle.css';
import 'simplebar-react/dist/simplebar.min.css';
import App from './App.tsx';
import { AppWrapper } from './components/common/PageMeta.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import '@ant-design/v5-patch-for-react-19';
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider>
    <AppWrapper>
      <App />
    </AppWrapper>
  </ThemeProvider>
  // </StrictMode>
);
