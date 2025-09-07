import TopNav from "@/components/ui/TopNav";
import BottomTabs from "@/components/ui/BottomTabs";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Settings() {
  return (
    <>
      <TopNav />
      <main className="container-narrow section">
        {/* ... */}
        <div className="card frost round-2xl mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">Тема</div>
              <div className="small text-muted">Светлая/тёмная</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        {/* ... */}
      </main>
      <BottomTabs />
    </>
  );
}
