import { Suspense } from "react";
import VerifyEmail from "../../src/views/VerifyEmail";

export default function Page() {
  // VerifyEmail reads ?token via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
