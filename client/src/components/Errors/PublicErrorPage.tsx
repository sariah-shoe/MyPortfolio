// src/components/Errors/PublicErrorPage.tsx
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function PublicErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <main className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2 text-lg">We couldn’t find that page.</p>
          <a className="mt-6 inline-block underline" href="/">Back home</a>
        </main>
      );
    }
    // Any other known HTTP response from a loader/action
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2">{error.data?.message ?? error.statusText}</p>
        <a className="mt-6 inline-block underline" href="/">Back home</a>
      </main>
    );
  }

  // Unknown/unexpected error (network crash, thrown Error, etc.)
  console.error(error);
  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Oops!</h1>
      <p className="mt-2">We hit a snag. Please try again in a moment.</p>
      <a className="mt-6 inline-block underline" href="/">Back home</a>
    </main>
  );
}
