import { AuthTabs } from "../../components/AuthTabs";

export const metadata = {
  title: "Create Account | KaamConnect",
};

export default function RegisterPage() {
  return (
    <div className="bg-[#F7FAFF] min-h-[calc(100vh-80px)]">
      <AuthTabs defaultTab="signup" />
    </div>
  );
}
