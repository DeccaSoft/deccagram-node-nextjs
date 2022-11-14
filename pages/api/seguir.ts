import { SeguidorModel } from './../../models/SeguidorModel';
import { conectarMongoDB } from './../../middlewares/conectarMongoDB';
import { validarTokenJwt } from './../../middlewares/validarTokenJwt';
import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../models/UsuarioModel';
import { politicaCORS } from '../../middlewares/politicaCORS';

const endpointSeguir = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if(req.method === 'PUT'){
            //Destructor
            const {userId, id} = req?.query;    //Usuário Logado/Autenticado(userId) e Usuário a ser Seguido(id)

            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : 'Usuário Logado NÃO Encontrado!'});
            }
 
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({erro : 'Usuário Seguido NÃO Encontrado!'});
            }

            const euJaSigoEsseUsuario = await SeguidorModel.find({usuarioId: usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id}); //Retorna uma Lista
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                euJaSigoEsseUsuario.forEach(async(e : any) => await  SeguidorModel.findByIdAndDelete({_id : e._id}));

                //Remove um "Seguindo" do Usuário Logado
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                
                //Remove um "Seguidor" do Usuário que está sendo Seguido pelo Usuário Logado
                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Usuário sendo Desseguido com Sucesso!'});
            }else{
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);
                //Adiciona um "Seguindo" ao Usuário Logado
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                
                //Adiciona um "Seguidor" ao Usuário que está sendo Seguido pelo Usuário Logado
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Usuário sendo Seguido com Sucesso!'});
            }
        }
        return res.status(405).json({erro : 'O Método Informado NÃO é Vávido!'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Não foi possível Seguir/Deseguir o Usuário Informado!'});
    }
}

export default politicaCORS(validarTokenJwt(conectarMongoDB(endpointSeguir)));