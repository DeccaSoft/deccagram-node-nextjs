import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import mongoose from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) => 
    async (req: NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {

    //Verificar se o Banco está conectado, se sim, seguir para o endpoint ou próximo meedleware
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }
    //senao, obter a variável de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env;
    //Se a env estiver vazia aborta o uso do sistema e avisa o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({erro : 'ENV de Configuração do Banco não Informada!'});
    }
    mongoose.connection.on('connected', () => console.log('Conectado ao Banco de Dados...'));
    mongoose.connection.on('error', error => console.log(`Ocorreu um Erro ao se Tentar Conectar com o Banco e Dados: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);
    //Se tudo OK(Banco Conectado)... Segue-se para o endpoint
    return handler(req, res);
};