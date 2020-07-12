/**
 * TicketService object.
 * handles business logic relating to TicketModel
 */
import { TicketModel } from "../models/ticket";
import { ITicket } from "../utils/types/custom";
import moment from "moment";

const TicketService = {
	async createTicket(data: ITicket) {
		try {
			const ticket = new TicketModel(data);
			await ticket.save();

			return ticket;
		} catch (error) {
			throw error;
		}
	},

	async findTicket(userId: any, ticketId: string) {
		try {
			const ticket = await TicketModel.findOne({
				userId,
				ticketId,
			}).
				populate({ path: 'userId', select: 'name email' }).
				populate({ path: 'treatedById', select: 'name email' }).
				populate({ path: 'meta.comments.commenter', select: 'name email' });
		
			return ticket;
		} catch (error) {
			throw error;
		}
	},

	async getUserTickets(userId: any, query: any) {
		try {
			const tickets = await TicketModel.find({
				userId,
				status: {
					$in: query.status,
				},
				createdAt: {
					$gte: new Date(query.startDate),
					$lt: new Date(query.endDate),
				},
			}).
				sort({ "createdAt": -1 });

			return tickets;
		} catch (error) {
			throw error;
		}
	},

	async getAllTickets(query: any) {
		try {
			const tickets = await TicketModel.find({
				status: {
					$in: query.status,
				},
				createdAt: {
					$gte: new Date(query.startDate),
					$lt: new Date(query.endDate),
				},
			}).
				populate({ path: 'userId', select: 'name email' }).
				sort({ "createdAt": -1 });

			return tickets;
		} catch (error) {
			throw error;
		}
	},

	async getClosedTickets() {
		try {
			const startDate: any = moment().subtract(1, "month");
			const endDate = new Date().toISOString();
			const tickets = await TicketModel.find({
				status: "closed",
				treatedDate: {
					$gte: new Date(startDate),
					$lt: new Date(endDate),
				},
			})
				.populate({ path: "userId", select: "name email" })
				.populate({ path: "treatedById", select: "name email" })
				.populate({
					path: "meta.comments.commenter",
					select: "name email",
				})
				.sort({ createdAt: -1 });
			
			return tickets;
		} catch (error) {
			throw error;
		}
	},

	async findTicketById(ticketId: string) {
		try {
			const ticket = await TicketModel.findOne({
				ticketId,
			});
			
			return ticket;
		} catch (error) {
			throw error;
		}
	},

	async updateTicket(ticketId: string, updateObject: any = {}) {
		try {
			const ticketUpdate = await TicketModel.findByIdAndUpdate(
				ticketId,
				updateObject,
				{ new: true }).
				populate({ path: 'userId', select: 'name email' }).
				populate({ path: 'meta.comments.commenter', select: 'name email' })
			return ticketUpdate;
		} catch (error) {
			throw error;
		}
	},
};

export default TicketService;
