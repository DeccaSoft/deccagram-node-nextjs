import mongoose, {Schema} from 'mongoose';

const SeguidorSchema = new Schema({
    usuarioId : {type : String, required : true},           //Quem Segue
    usuarioSeguidoId : {type : String, required : true},    //Quem está sendo seguido

});

//Ou acessa a tabela se já existir ou cria a tabela de acordo com o schema
export const SeguidorModel = (mongoose.models.seguidores || mongoose.model('seguidores', SeguidorSchema));
