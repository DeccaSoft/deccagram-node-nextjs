import { UsuarioModel } from './../../models/UsuarioModel';
import { PublicacaoModel } from './../../models/PublicacaoModel';
import { conectarMongoDB } from './../../middlewares/conectarMongoDB';
import { validarTokenJwt } from './../../middlewares/validarTokenJwt';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const likeEndpoint = async (req:NextApiRequest, res:NextApiResponse<RespostaPadraoMsg>) => {
    try {
        //Id da Publicação
        if(req.method === 'PUT'){
            const {id} = req?.query;
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                res.status(400).json({erro : 'Publicação NÃO Encontrada!'});
            }

            //Id do Usuário que está Curtindo a Publicação
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuário NÃO Encontrado!'});
            }

            //Index = -1 => Ele NÃO Curte a Foto, Index > -1 => Ele Já Curte a Foto
            const IndexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
            if(IndexDoUsuarioNoLike != -1){
                publicacao.likes.splice(IndexDoUsuarioNoLike, 1) // .splice() remove 1 index da lista
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicacao Descurtida com Sucesso!'});
            }else{
                publicacao.likes.push(usuario._id) // .push() coloca no final da lista
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicacao Curtida com Sucesso!'});
            }
        }
        return res.status(405).json({erro : 'Método Informado NÃO é Válido!'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro : 'Ocorreu um Erro ao Curtir/Descurtir a Publicação!'});      
    }
}

export default validarTokenJwt(conectarMongoDB(likeEndpoint));