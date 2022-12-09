
import dynamic from 'next/dynamic';
import useUser from '../../hooks/useUser';
const CreateTournamentForm = dynamic(() => import('../../components/CreateTournamentForm'));
export default function CreateTournamentPage() {
  const user = useUser();

if (user === undefined) return null;

 return <CreateTournamentForm user={user}/>
}
