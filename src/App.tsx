import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ensureSeeded } from './lib/seed';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { LessonDetailPage } from './pages/LessonDetailPage';
import { LessonEditorPage } from './pages/LessonEditorPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { PacingListPage } from './pages/PacingListPage';
import { PacingGuidePage } from './pages/PacingGuidePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeeded().then(() => setReady(true));
  }, []);

  if (!ready) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading PE Planner…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="library/new" element={<LessonEditorPage />} />
          <Route path="library/:id" element={<LessonDetailPage />} />
          <Route path="library/:id/edit" element={<LessonEditorPage />} />
          <Route path="generator" element={<GeneratorPage />} />
          <Route path="pacing" element={<PacingListPage />} />
          <Route path="pacing/:id" element={<PacingGuidePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
