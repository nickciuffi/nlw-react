import { createRoot } from 'react-dom/client';
import App from './App';

import './services/firebase';

import './styles/global.scss'

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(<App />);

