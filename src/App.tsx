import { useState } from 'react';
import { StoreProvider } from './store';
import { Header, Sidebar, MobileDrawer, MobileBottomNav, type PageKey } from './components/Layout';
import { cn } from './utils';
import Dashboard from './pages/Dashboard';
import SubjectHub from './pages/SubjectHub';
import OrgChart from './pages/OrgChart';
import Dskp from './pages/Dskp';
import RphPage from './pages/Rph';
import Headcount from './pages/Headcount';
import NotaPage from './pages/Nota';
import LatihanPage from './pages/Latihan';
import ProgramPage from './pages/Program';

type View = { type: 'page'; page: PageKey } | { type: 'subject'; subject: 'Fizik' | 'Matematik' };

function Shell() {
  const [view, setView] = useState<View>({ type: 'page', page: 'home' });
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const page: PageKey = view.type === 'page' ? view.page : 'home';
  const navigate = (p: PageKey) => setView({ type: 'page', page: p });

  return (
    <div className="min-h-screen">
      <Header page={page} onHome={() => setView({ type: 'page', page: 'home' })} onMenu={() => setDrawerOpen(true)} />
      <Sidebar page={page} onNavigate={navigate} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <MobileDrawer open={drawerOpen} page={page} onNavigate={navigate} onClose={() => setDrawerOpen(false)} />

      <main className={cn('pt-16 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 transition-all duration-300', collapsed ? 'lg:pl-[92px]' : 'lg:pl-[272px]')}>
        <div className="max-w-7xl mx-auto">
          {view.type === 'subject' ? (
            <SubjectHub subject={view.subject} onBack={() => setView({ type: 'page', page: 'home' })} onNavigate={navigate} />
          ) : (
            <>
              {page === 'home' && <Dashboard onNavigate={navigate} onEnterSubject={(s) => setView({ type: 'subject', subject: s })} />}
              {page === 'org' && <OrgChart />}
              {page === 'dskp' && <Dskp />}
              {page === 'rph' && <RphPage />}
              {page === 'headcount' && <Headcount />}
              {page === 'nota' && <NotaPage />}
              {page === 'latihan' && <LatihanPage />}
              {page === 'program' && <ProgramPage />}
            </>
          )}
        </div>
      </main>

      <MobileBottomNav page={page} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
