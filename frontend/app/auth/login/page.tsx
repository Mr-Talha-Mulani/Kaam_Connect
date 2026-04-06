import { AuthTabs } from "../../components/AuthTabs";

export const metadata = {
  title: "Login | KaamConnect",
};

export default function LoginPage() {
  return (
    <div className="bg-[#F7FAFF] min-h-[calc(100vh-80px)]">
      <AuthTabs defaultTab="login" />
    </div>
  );
}
