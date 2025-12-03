import { ThemeProvider } from '../context/ThemeContext'; // Import the provider
import 'antd/dist/reset.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;