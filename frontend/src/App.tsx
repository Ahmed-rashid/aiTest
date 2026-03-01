import { Sidebar } from "./layout/Sidebar";
import { TopBar } from "./layout/TopBar";
import { OverviewPage } from "./pages/OverviewPage";

export function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <TopBar />
        <OverviewPage />
      </div>
    </div>
  );
}
