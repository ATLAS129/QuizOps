import { useParams } from "react-router";
import { useCurrentUser } from "../hooks/useAuth";
import { useGetAllMyDecks } from "../hooks/useDecks";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfilePageComponent from "../components/ProfilePageComponent";

const ProfilePage = () => {
  const { userId } = useParams();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: decks, isLoading: isDecksLoading } = useGetAllMyDecks();

  const recentDecks = Array.isArray(decks) ? decks.slice(0, 3) : [];

  if (isUserLoading || isDecksLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ProfilePageComponent
      userId={userId as string}
      user={user}
      recentDecks={recentDecks}
    />
  );
};

export default ProfilePage;
