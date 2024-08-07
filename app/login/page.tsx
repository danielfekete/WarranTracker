import LoginForm from "../components/login-form";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between p-10">
      <div className="flex flex-col justify-center content-center max-w-[500px]">
        <LoginForm />
      </div>
    </main>
  );
}
