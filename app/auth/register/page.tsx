import RegisterForm from "@/app/components/register-form";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between p-10">
      <div className="flex flex-col justify-center content-center max-w-[500px]">
        <RegisterForm />
      </div>
    </main>
  );
}
