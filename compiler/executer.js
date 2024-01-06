import { spawn } from 'child_process';
import fs from 'fs/promises';

async function writeCodeToFile(code, filePath) {
    await fs.writeFile(filePath, code);
}
async function compileCode(compileCommand, timeout = 1000) {
    const compileProcess = spawn(compileCommand[0], compileCommand.slice(1), { shell: true });
    const compilePromise = new Promise((resolve, reject) => {
        compileProcess.on('exit', (code) => {
            if (code === 0) {
                resolve('Compilation successFull');
            } else {
                reject('Compilation failed');
            }
        });
    });
    try {
        const compiledStatus = await Promise.race([
            compilePromise,
            new Promise((_, reject) => {
                const timerId = setTimeout(() => {
                    compileProcess.kill();// Forcefully terminate the compile process on timeout
                    reject('Compilation timeout')
                }, timeout)
                compileProcess.on('close', () => {
                    clearTimeout(timerId);
                });
            })
        ]);
        return compiledStatus;
    } catch (error) {
        throw error;
    }
}

async function executeCode(runCommand, input, timeout = 1000) {
    const runProcess = spawn(runCommand[0], runCommand.slice(1), { shell: true });
    const runPromise = new Promise((resolve, reject) => {
        runProcess.stdin.write(input);
        runProcess.stdin.end();
        let output = '';
        runProcess.stdout.on('data', (data) => {
            if (output.length < 1000000000000)
                output += data.toString();
        });
        runProcess.stderr.on('data', (error) => {
            reject(error.toString());
        });
        runProcess.on('close', () => {
            resolve(output);
        });
    });
    try {
        const result = await Promise.race([
            runPromise,
            new Promise((_, reject) => {
                const timerId = setTimeout(() => {
                    runProcess.kill();
                    reject('Execution timeout');
                }, timeout);
                // Clear timeout if if your code executed in given time 
                runProcess.on('close', () => {
                    clearTimeout(timerId);
                });
            })
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}


async function CPP_Compiler(Code, input) {
    const sourceFilePath = 'temp_cpp.cpp';
    const timeout = 2000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const compileCommand = ['g++', sourceFilePath];
        const isCompiled = await compileCode(compileCommand, timeout);
        console.log(isCompiled)
        const runCommand = ['a.exe']
        const result = await executeCode(runCommand, input, timeout);
        await fs.unlink(sourceFilePath)
        await fs.unlink('./a.exe')
        return result;
    } catch (error) {
        return error;
    }
}
async function java_Compiler(Code, input) {
    const sourceFilePath = 'Temp.java';
    const timeout = 2000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const compileCommand = ['javac', sourceFilePath];
        const isCompiled = await compileCode(compileCommand, timeout);
        console.log(isCompiled);
        const runCommand = ['java', 'Temp']
        const result = await executeCode(runCommand, input, timeout);
        await fs.unlink(sourceFilePath);//code for deleting sourceFile
        await fs.unlink('Temp.class');
        return result;
    } catch (error) {
        return error;
    }
}

async function JS_Compiler(Code, input) {
    const sourceFilePath = 'temp_js.js';
    const timeout = 2000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const runCommand = ['node', 'temp_js.js']
        const result = await executeCode(runCommand, input, timeout);
        await fs.unlink(sourceFilePath)
        return result;
    } catch (error) {
        return error;
    }
}

async function Python_Compiler(Code, input) {
    const sourceFilePath = 'temp_python.py';
    const timeout = 2000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const runCommand = ['python', 'temp_python.py'];
        const result = await executeCode(runCommand, input, timeout);
        await fs.unlink(sourceFilePath);
        return result;
    } catch (error) {
        return error;
    }
}
async function shell(script, input) {
    const runCommand = script.replace(/\s+/g, ',').split(',');
    const timeout = 2000;
    try {
        const result = await executeCode(runCommand, input, timeout);
        return result;
    } catch (error) {
        return error;
    }
}

export { CPP_Compiler, JS_Compiler, Python_Compiler, java_Compiler, shell }