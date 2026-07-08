import ChefProfile from "../../../src/views/ChefProfile";

export default function Page({ params }: { params: { id: string } }) {
  return <ChefProfile id={params.id} />;
}
