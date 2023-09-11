export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Profile page. Display profile and user's post
  return <h1>{params.id}</h1>;
}
