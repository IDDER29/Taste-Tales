import ViewArticle from "../../../src/views/ViewArticle";

export default function Page({ params }: { params: { id: string } }) {
  return <ViewArticle id={params.id} />;
}
