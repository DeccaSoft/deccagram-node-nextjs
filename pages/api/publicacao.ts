import type {NextApiResponse} from 'next';
import type{RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import {validarTokenJwt} from '../../middlewares/validarTokenJwt';
import {PublicacaoModel} from '../../models/PublicacaoModel';
import {UsuarioModel} from '../../models/UsuarioModel';
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const {userId} = req.query; //Pegou lá do validarTokenJWT
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro: 'Usuário não Encontrado!'});
            }
            if(!req || !req.body){
                return res.status(400).json({erro: 'Parâmetros de Entrada não Informados!'});
            }
            const {descricao} = req?.body;
            if(!descricao || descricao.length < 1){
                return res.status(400).json({erro: 'Descrição Inexistente!'});
            }
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro: 'Imagem Inexistente!'});
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data : new Date()
            }

            usuario.publicacoes++;
            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);

            await PublicacaoModel.create(publicacao);
            return res.status(200).json({msg: 'Publicação Criada com Sucesso!'});
        } catch (e) {
            console.log(e);            
            return res.status(400).json({erro: 'Erro ao Criar Publicação!'});
        }        
});

export const config = {
    api: {
        bodyParser : false
    }
}

//Atenção na cadeia: ValidaToken->ConectaBanco e só depois entra na api
export default politicaCORS(validarTokenJwt(conectarMongoDB(handler)));