import { Suspense } from "react";
import Login from "../../src/views/Login";

export default function Page() {
  // Login reads ?callbackUrl via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
