import { EmployerDashboardClient } from "../../components/EmployerDashboardClient";

export const metadata = {
  title: "Employer Dashboard | KaamConnect",
};

export default function EmployerDashboardPage() {
  return <EmployerDashboardClient initialActivePage="Dashboard" />;
}
