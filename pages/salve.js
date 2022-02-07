import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ButtonSendSticker} from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5MjgyNSwiZXhwIjoxOTU4OTY4ODI1fQ.LZy2nVUKZY0E4OP0-ECotNJ8keBcx-Pgmv1_aHCeHSY';
const SUPABASE_URL = 'https://pcvbolyjltuplngrdzas.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function  escutaMensagensEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT', ( respostaLive )=> {
            //console.log(respostaLive)
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
    }

export default function ChatPage() {
    //const roteamento = useRouter();
    //const usuarioLogado = roteamento.query.username;  essas 2 linhas fazem o msms q a linha de baixo
    const usuarioLogado = useRouter().query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
          .from('mensagens')
          .select('*')
          .order('id', { ascending: false })
          .then(({ data }) => {                        //repare q esse data esta entre chaves{} entao quer dizer q é como se fosse um objeto de retorno e estou pegando o .data dele
            setListaDeMensagens(data);                 // abaixo esta comentado mais o menos  como seria esse trecho sem a chaves ali dentro
            /*
            .then((response) =>{
                 setListaDeMensagens(response.data);
            });
            */
          });
           escutaMensagensEmTempoReal((novaMensagem) => {
                setListaDeMensagens((valorAtualDaLista) => {
                //console.log('valorAtualDaLista:', valorAtualDaLista);
                    return [
                        novaMensagem,
                        ...valorAtualDaLista,
                    ]
                });
          });
        }, []);
          
    // inserindo msg ##########################################################################################################################################
      function handleNovaMensagem(novaMensagem) {
        const mensagem = {
          // id: listaDeMensagens.length + 1,
          de: usuarioLogado,
          texto: novaMensagem,
          visivel: true,
        };
    
        supabaseClient
          .from('mensagens')
          .insert([
            // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
            mensagem
          ])
          .then();
        setMensagem('');    //resetando o campo de msg
      }
    // fim insercao nova msg ##########################################################################################################################################
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.neutrals[10],
                backgroundImage: `url(images/Pika_correndo.gif)`,
                //backgroundRepeat: 'no-repeat', 
                //backgroundSize: 'cover', 
                backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '50%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} /> {/*chamando a  funçao que renderiza o chat antigo*/}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {    
                                    event.preventDefault(); // impedindo o Enter de fazer sua funçao natural de quebra de linha e tornando-o o comando de enviar msg
                                    handleNovaMensagem(mensagem);   // chamando funcao que salva nova msg
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                         <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                //console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                                handleNovaMensagem(':sticker: ' + sticker); //chamando funçao de salva nova msg sendo esta sticker
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {   //funçao que renderiza o chat 'antigo'
    //console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>  
                        {/* [Declarativo] */}
                            {/*if ternario para ver se a msg começa com stiker, se sim faz a tratativa para mostrar como imagem se n imprime o texto q vem la do banco msm */}
                            {mensagem.texto.startsWith(':sticker:') ? (<Image src={mensagem.texto.replace(':sticker:', '')} />): (mensagem.texto)}
                    </Text>
                );
            })}
        </Box>
    )
}