import { UsuarioModel } from './../../models/UsuarioModel';
import { conectarMongoDB } from './../../middlewares/conectarMongoDB';
import { validarTokenJwt } from './../../middlewares/validarTokenJwt';
import type { RespostaPadraoMsg } from './../../types/RespostaPadraoMsg';
import type {NextApiRequest, NextApiResponse} from 'next';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { politicaCORS } from '../../middlewares/politicaCORS';

const comentarioEndpoint = async (req:NextApiRequest, res:NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if(req.method === 'PUT'){
            //Usuário e Publicação vem do Query
            const {userId, id} = req.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuário NÃO Encontrado!'});
            }

            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro: 'Publicação NÃO Encontrada!'});
            }

            //Comentário vem do Body
            if(!req.body || !req.body.comentario){
                return res.status(400).json({erro: 'Comentário Inválido!'});
            }
            const comentario = {
                usuarioId : usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            }
            publicacao.comentarios.push(comentario);
            await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
            return res.status(200).json({msg: 'Comentário Adicionado com Sucesso!'});
        }
        return res.status(405).json({erro: 'O Método Informado NÃO é Válido!'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro: 'Ocorreu um Erro ao Adicionar o Camentário!'});
        
    }
}

export default politicaCORS(validarTokenJwt(conectarMongoDB(comentarioEndpoint)));