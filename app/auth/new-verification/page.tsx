import NewVerificationForm from "@/app/components/auth/new-verification-form";

export default function Page() {
  //   const [error, setError] = useState("");
  //   const [success, setSuccess] = useState("");

  //   const onSubmit = useCallback(() => {
  //     if (error || success) {
  //       return;
  //     }

  //     if (!token) {
  //       setError("Missing token.");
  //       return;
  //     }

  //     newVerification(token)
  //       .then((data) => {
  //         setError(data.error || "");
  //         setSuccess(data.success || "");
  //       })
  //       .catch((error) => {
  //         setError("Something went wrong.");
  //       });
  //   }, [token, error, success]);

  return (
    <div>
      <NewVerificationForm />
    </div>
  );
}
