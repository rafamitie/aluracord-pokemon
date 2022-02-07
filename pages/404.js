import { Box, Button, Text, TextField, Image } from '@skynexui/components';

export default function Custom404() {  
    return(
        //<h1>404 - Page Not Found</h1>;
        <Box        
          styleSheet={{
            
            backgroundImage: 'url(images/404.jpg)',
            backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundBlendMode: 'multiply',
          }}
      ></Box>
   
    )
  }