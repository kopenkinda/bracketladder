import sgMail from '@sendgrid/mail';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { procedureIsTournamentOwner } from '../procedure/tournament';
import { router } from '../trpc';
import jwt from 'jsonwebtoken';

type InviteMailData = {
	ConfirmationLink: string;
}

export type InviteTokenData = {
	tournamentId: string;
	email: string;
}
export const mailRouter = router({
	sendInvite: procedureIsTournamentOwner
		.input(z.object({ tournamentId: z.string(), email: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const tournament = await ctx.prisma.tournament.findUnique({
				where: { id: input.tournamentId },
			});
			if (!tournament) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Tournament not found' });
			}
			const inviteTemplateId = process.env.SENDGRID_TEMPLATE_INVITE ?? '';
			const acceptInviteURL = process.env.ACCEPT_INVITE_URL ?? '';
			const secret = process.env.JWT_SECRET ?? '';
			if (!inviteTemplateId || !acceptInviteURL || !secret) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Missing env for sending invite' });
			}
			const validationToken = jwt.sign(
				{ tournamentId: input.tournamentId, email: input.email },
				secret,
				{ expiresIn: '7d' }
			);
			const data: InviteMailData = {
				ConfirmationLink: `${acceptInviteURL}?token=${validationToken}`,
			}
			return await sendMail(input.email, inviteTemplateId, data);
		}),
});

const sendMail = async <T extends {[key: string]: unknown}>(email: string, templateId: string, data: T) => {
	const apiKey = process.env.SENDGRID_API_KEY;
	const sender = process.env.SENDGRID_FROM_ADDRESS;
	if (!apiKey || !sender) {
		throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Sendgrid API env not found' });
	}
	sgMail.setApiKey(apiKey);
	const msg: sgMail.MailDataRequired = {
		to: email,
		from: sender,
		templateId,
		dynamicTemplateData: data,
	};
	return sgMail.send(msg).catch((error) => console.log(error.response.body));
}
