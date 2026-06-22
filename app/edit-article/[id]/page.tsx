import EditArticle from "../../../src/views/EditArticle";

export default function Page({ params }: { params: { id: string } }) {
  return <EditArticle id={params.id} />;
}
