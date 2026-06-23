import { Suspense } from "react";
import ResetPassword from "../../src/views/ResetPassword";

export default function Page() {
  // ResetPassword reads ?token via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
