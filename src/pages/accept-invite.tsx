import { useRouter } from 'next/router';
import React, { type FC, useEffect } from 'react';
import { trpc } from '../utils/trpc';

type AcceptInviteProps = Record<string, never>;

const AcceptInvite: FC < AcceptInviteProps > = () => {
	const { token } = useRouter().query;
	const { data } = trpc.tournament.validateInviteToken.useQuery({token: token?.toString() ?? ""});
	const { mutateAsync: acceptInvite } = trpc.tournament.joinTournament.useMutation();
	const navigate = useRouter()

	useEffect(() => {
		if (data) {
			acceptInvite({tournamentId: data.tournamentId})
				.then(() => navigate.replace("/tournament/" + data.tournamentId))
		}
	}, [data, acceptInvite])

	return <div>
		token: { token }
	</div>;
};

export default AcceptInvite;
