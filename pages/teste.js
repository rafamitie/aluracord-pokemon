import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ButtonSendSticker} from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5MjgyNSwiZXhwIjoxOTU4OTY4ODI1fQ.LZy2nVUKZY0E4OP0-ECotNJ8keBcx-Pgmv1_aHCeHSY';
const SUPABASE_URL = 'https://pcvbolyjltuplngrdzas.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

supabaseClient
    .from('mensagens')
    .select('*')
    .then((dados) => {
        console.log('Dados da consulta:', dados)
    });

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);


    React.useEffect(() => {
        supabaseClient
          .from('mensagens')
          .select('*')
          .order('id', { ascending: false })
          .then(({ data }) => {
            console.log('Dados da consulta:', data);
            setListaDeMensagens(data);
          });
      }, []);
    
      function handleNovaMensagem(novaMensagem) {
        const mensagem = {
          // id: listaDeMensagens.length + 1,
          de: usuarioLogado,
          texto: novaMensagem,
        };
    
        supabaseClient
          .from('mensagens')
          .insert([
            // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
            mensagem
          ])
          .then(({ data }) => {
            console.log('Criando mensagem: ', data);
            setListaDeMensagens([
              data[0],
              ...listaDeMensagens,
            ]);
          });
        setMensagem('');
      }
    
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
                    <MessageList mensagens={listaDeMensagens} />
              
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
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
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
                        <Button  
                            label='Enviar'
                            onClick={()=>{
                                handleNovaMensagem(mensagem);
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals[11],
                                mainColor: appConfig.theme.colors.neutrals[10],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
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

function MessageList(props) {
    console.log(props);
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
                        {mensagem.texto}
                        
                        {/*<Button  
                            label='x'
                            onClick={()=>{
                                console.log(mensagem.id);
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals[10],
                                mainColor: appConfig.theme.colors.neutrals[11],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                //width: '25%',
                                border: '0',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                marginRight: '0',
                                marginLeft:'auto'
                            }}
                        />*/}
                    </Text>
                );
            })}
        </Box>
    )
}