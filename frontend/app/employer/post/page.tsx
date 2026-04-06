import { EmployerDashboardClient } from "../../components/EmployerDashboardClient";

export const metadata = {
  title: "Post Job | KaamConnect Employer",
};

export default function EmployerPostJobPage() {
  return <EmployerDashboardClient initialActivePage="Post Job" />;
}
