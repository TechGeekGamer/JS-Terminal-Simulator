const fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface({input: process.stdin,output: process.stdout});
fetch = require('node-fetch');
const connect = async (url) => {
    try{
console.log(`Connecting to "${url}"...`)
  const response = await fetch(url)
  return true
}catch(err){
    console.log(err)
    return null
}
}
const fatalError = function(){
    console.log("A fatal error has occurred! The program could not auto-recover.")
}
    function commandLineMode(returned = false){
        try{

            if(returned == false){
                console.log('\nTerminal Simulator VERSION 2. To see available commands, type "help".')
            }
            rl.question('> ', ans => {
                //JSON check
                try{
                    JSON.parse(fs.readFileSync('./resources/commands.json'))
                }catch{
                    return fatalError()
                }

                if(require.cache[require.resolve('./resources/commands.json')]){
                    delete require.cache[require.resolve('./resources/commands.json')]
                }
                var availableCommands = require('./resources/commands.json')
                let args = ans.split(/ +/);
                if(availableCommands[args[0]]){
                    if(ans.toLowerCase().startsWith("help")){
                        let helpMenu = []
                        helpMenu.push('==========================================')
                        helpMenu.push('AVAILABLE COMMANDS\n')
                        for (let index = 0; index < Object.keys(availableCommands).length; index++) {
                            const element = Object.keys(availableCommands)[index];
                            helpMenu.push(element +'    '+availableCommands[Object.keys(availableCommands)[index]].about)
                        }
                        helpMenu.push('==========================================')
                        helpMenu.forEach(element => {
                            console.log(element)
                        });
                    }else
                    if(ans.toLowerCase().startsWith("exit")){
                        console.log("Exiting...\n")
                        return process.exit()
                    }else{
                        eval(availableCommands[args[0]].code)
                    }
                    return commandLineMode(true)
                }else{
                    if(args[0] !=''){
                        console.log(`"${args[0]}" is not a valid command.`)
                    }
                    return commandLineMode(true)
                }
            })
        }catch{
            return fatalError()
        }
    }
    commandLineMode()