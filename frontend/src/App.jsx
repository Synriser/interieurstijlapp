import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import StylesPage from './pages/StylesPage';
import EditorPage from './pages/EditorPage';
import VisualisatiePage from './pages/VisualisatiePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StylesPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="visualisatie" element={<VisualisatiePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
