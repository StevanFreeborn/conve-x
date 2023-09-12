export default function PostPage({ params }: { params: { id: string } }) {
  return <h1>{params.id}</h1>;
}
