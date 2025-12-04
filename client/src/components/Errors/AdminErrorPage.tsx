// src/components/Errors/AdminErrorPage.tsx
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { useAuth } from "../Shared/AuthContext";

export default function AdminErrorPage() {
  const error = useRouteError();
  const { setAuth } = useAuth();

  if (isRouteErrorResponse(error)) {
    if(error.status == 401){
      setAuth(false);
    }
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-bold">Request failed</h1>
        <p className="mt-2">
          <strong>{error.status}</strong> {error.statusText}
        </p>
        {error.data?.message && (
          <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-100 p-4">
            {error.data.message}
          </pre>
        )}
        {/* Optionally show validation details from the server */}
        {error.data?.errors && (
          <div className="mt-4">
            <h2 className="font-semibold">Details</h2>
            <ul className="list-disc pl-6">
              {Object.entries(error.data.errors).map(([field, msg]) => (
                <li key={field}>
                  <strong>{field}:</strong> {String(msg)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link to={"/admin"} className="mt-6 inline-block underline">Return to Admin Home</Link>
      </main>
    );
  }

  // Non-Response errors
  console.error(error);
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Unexpected error</h1>
      <p className="mt-2">Check the console for details.</p>
      <Link to={"/admin" } className="mt-6 inline-block underline">Return to Admin Home</Link>
    </main>
  );
}
