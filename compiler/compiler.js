import { CPP_Compiler, JS_Compiler, Python_Compiler, java_Compiler, shell } from './executer.js';

const compile = async (req, res) => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', async () => {
        let success = true; // Flag to track success or failure
        let result = 'Compiler not available';
        try {
            const { code, language, input } = JSON.parse(data);
            if (language === 'cpp' || language === 'c')
                result = await CPP_Compiler(code, input);
            else if (language === 'javascript')
                result = await JS_Compiler(code, input);
            else if (language === 'python')
                result = await Python_Compiler(code, input);
            else if (language === 'java')
                result = await java_Compiler(code, input);
            else if (language === 'powershell')
                result = await shell(code, input);
        } catch (error) {
            console.error('Error parsing JSON or executing code:', error);
            success = false;
        }

        // Send response based on success flag
        if (success) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: result }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error in parsing JSON or executing code' }));
        }
    });
}

export default compile
