import { politicaCORS } from './../../middlewares/politicaCORS';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJwt} from '../../middlewares/validarTokenJwt';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from './../../models/UsuarioModel';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic'; //Importando o upload do moolter e do cosmic

const handler = nc()    //instancia o next-connect
.use(upload.single('file')) //usa o midleware upload do moolter para enviar um arquivo único e salva na propriedade 'file' no multpartformdata (endpoint).
.put(async(req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        const {userId} = req?.query; //Pega o usuário autenticado que está salvo no midleware de validação do token em req?.query
        const usuario = await UsuarioModel.findById(userId);
        
        if(!usuario){
            return res.status(400).json({erro : "Usuário NÃO Encontrado!"});
        }

        //Pega o nome e valida
        const {nome} = req?.body;
        if(nome && nome.length > 2){
            usuario.nome = nome;
        }

        //Pega a imagem (url do objeto no cosmic) e valida
        const {file} = req;
        if(file && file.originalname){
            const image = await uploadImagemCosmic(req);
            if(image && image.media && image.media.url){
                usuario.avatar = image.media.url;
            }
        }

        //Altera os Dados o BD
        await UsuarioModel
            .findByIdAndUpdate({_id : usuario._id}, usuario);

        return res.status(200).json({msg : "Usuário Alterado com Sucesso!"});
    } catch (e) {
        console.log(e);
        return res.status(400).json({erro : 'NÃO foi possível Atualizar o Usuário!' + e});
    }
})
.get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg> | any) => {
    try {
        //Recuperando o Id do Usuário
        const {userId} = req?.query;
        //Buscando Dados do Usuário
        const usuario = await UsuarioModel.findById(userId);
        //console.log('usuario', usuario);
        usuario.senha = null;
        return res.status(200).json(usuario);
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({erro : 'Não foi possível obter Dados do Usuário!'});
});

export const config = {
    api: {
        bodyParser : false
    }
}

export default politicaCORS(validarTokenJwt(conectarMongoDB(handler)));