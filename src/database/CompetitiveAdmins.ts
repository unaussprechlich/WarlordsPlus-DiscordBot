import * as mongoose from "mongoose";

export const CompetitiveAdminSchema = new mongoose.Schema({
    client_id : {
        type : String,
        unique : true
    },
})

export const CompetitiveAdminModel = mongoose.model<ICompetitiveAdmin>('CompetitiveAdmin', CompetitiveAdminSchema);

export interface ICompetitiveAdmin extends mongoose.Document{
    client_id : String
}
