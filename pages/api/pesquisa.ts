import { UsuarioModel } from './../../models/UsuarioModel';
import { validarTokenJwt } from './../../middlewares/validarTokenJwt';
import { conectarMongoDB } from './../../middlewares/conectarMongoDB';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const pesquisaEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
        if(req.method === 'GET'){
            const{filtro} = req.query;    //Body só se usa no Post e no Put
            if(!filtro || filtro.length < 2){
                return res.status(400).json({erro : 'Filtro para Busca Inválido! A Busca Deve ter pelo menos 2 Caracteres.'});
            }

            const usuariosEncontrados = await UsuarioModel.find({
                //Pesquisa por nome ou E-mail
                $or: [{nome : {$regex : filtro, $options: 'i'}},   //regex = .contains e optios:i = Ignore Case
                    {email : {$regex : filtro, $options : 'i'}}]
            });
            return res.status(200).json(usuariosEncontrados);
        }
        return res.status(405).json({erro : 'Método informado NÃO Inválido'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({erro : 'NÃO foi possível Buscar Usuários! Erro: ' + e});
    }
}

export default validarTokenJwt(conectarMongoDB(pesquisaEndpoint));