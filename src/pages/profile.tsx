import { type NextPage } from 'next';
import { Avatar } from '@mantine/core';
import {useSession} from "next-auth/react";
import TournamentCard from "../components/TournamentCard";

const testTournament = {
    name: 'Test Tournament',
    region: 'NA',
    minPlayers: 4,
    maxPlayers: 8,
    game: 2,
    owner: {
        name: 'Robin',
        nickname: 'RoTour',
        region: 'NA',
        stats: undefined,
    },
    whiteList: undefined,
    bracket: undefined,
};



const Profile: NextPage = () => {

    const { data: session } = useSession();

    return (
        <div className="m-10 ">
            <h1>Profile</h1>
            <Avatar size="xl" color="blue" src={session.user?.image} />
            <h3>Pseudo : {session?.user?.name}</h3>
            <h3>Email : {session?.user?.email}</h3>
            <h3>Roles : {session?.user?.role}</h3>
            <div className="mt-32">
                <h3>Mes tournois :</h3>
                <div className="grid grid-cols-6 gap-4 overflow-x-auto">
                    <TournamentCard tournament={testTournament} />
                    <TournamentCard tournament={testTournament} />
                    <TournamentCard tournament={testTournament} />
                    <TournamentCard tournament={testTournament} />
                </div>
            </div>
            <div className="mt-16">
                <h3>Mes Participations :</h3>
                <div className="grid grid-cols-6 gap-4 overflow-x-auto">
                    <TournamentCard tournament={testTournament} />
                    <TournamentCard tournament={testTournament} />
                    <TournamentCard tournament={testTournament} />
                    <TournamentCard tournament={testTournament} />
                </div>
            </div>
        </div>
    );
}
export default Profile;