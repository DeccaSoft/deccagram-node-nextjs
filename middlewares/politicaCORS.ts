import type { RespostaPadraoMsg } from './../types/RespostaPadraoMsg';
import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) =>
        {
            try {
                await NextCors(req, res, {
                    origin : '*',
                    methods : ['GET', 'POST', 'PUT'],
                    //header : [Não Pecisa],
                    optionsSuccessStatus : 200, //Pois navegadores antigos dão problema quando se retorna 204
                });
                return handler(req, res);
            } catch (e) {
                console.log('Erro ao Tratar a Política de CORS: ', e);
                res.status(500).json({erro : 'Ocorreu um Erro ao Tratar a Política de CORS'})   ;             
            }
        }