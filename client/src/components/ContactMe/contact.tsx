import { Form, useNavigation, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";

type ActionResult = {
  success: boolean;
};

export default function Contact() {
  const navigation = useNavigation();
  const actionData = useActionData() as ActionResult | undefined;

  const isSubmitting = navigation.state === "submitting";

  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  // Show toast when action resolves
  useEffect(() => {
    if (actionData?.success !== undefined) {
      setSuccess(actionData.success);
      setShowToast(true);

      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mt-4">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Contact Me
        </h2>
      </div>

      {/* Toast */}
      {showToast && success !== null && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`size-6 ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  success
                    ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              />
            </svg>

            <div className="flex-1">
              <strong className="font-medium text-gray-900">
                {success
                  ? "Your email has been sent."
                  : "Something went wrong. Please try again."}
              </strong>
            </div>

            <button
              type="button"
              aria-label="Dismiss alert"
              onClick={() => setShowToast(false)}
              className="-m-3 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
            >
              <span className="sr-only">Dismiss</span>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Form
          method="post"
          action="/contact"
          className="space-y-6 max-w-xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              First Name
              <input
                type="text"
                name="firstName"
                className="p-2 text-sm border rounded-md bg-gray-100"
              />
            </label>

            <label className="flex flex-col">
              Last Name
              <input
                type="text"
                name="lastName"
                className="p-2 text-sm border rounded-md bg-gray-100"
              />
            </label>
          </div>

          <label className="flex flex-col">
            Email Address
            <input
              type="email"
              name="email"
              required
              className="p-2 text-sm border rounded-md bg-gray-100"
            />
          </label>

          {/* Honeypot */}
          <div aria-hidden="true" className="absolute left-[-10000px]">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <label className="flex flex-col">
            Message
            <textarea
              name="message"
              rows={4}
              required
              className="p-2 text-sm border rounded-md bg-gray-100"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md border px-4 py-2 text-sm font-medium transition
              ${
                isSubmitting
                  ? "bg-indigo-300 border-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 border-indigo-600 text-white hover:bg-transparent hover:text-indigo-600"
              }`}
          >
            {isSubmitting ? "Sending…" : "Submit"}
          </button>
        </Form>
      </div>
    </div>
  );
}
