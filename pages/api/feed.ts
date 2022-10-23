import { PublicacaoModel } from './../../models/PublicacaoModel';
import { UsuarioModel } from './../../models/UsuarioModel';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJwt} from '../../middlewares/validarTokenJwt';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg> | any) => {
    try {
        if(req.method === 'GET'){
            //Recebendo o Id do Usuário do Feed
            if(req?.query?.id){    //Consulta = query  e Envio de Informação = body
                //Buscando Usuário no Banco
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({erro : 'Usuário NÃO Encontrado!'});
                }
                //Buscando Publicações deste Usuário
                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id})    //.find retorna uma Lista
                    .sort({data : -1});
                
                return res.status(200).json(publicacoes);
            }
        }
        return res.status(405).json({erro: 'O Método Informado é Inválido!'});
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro : 'Não foi possível obter o Feed!'});
}

export default validarTokenJwt(conectarMongoDB(feedEndpoint));