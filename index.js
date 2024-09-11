const { select, input, checkbox } = require('@inquirer/prompts')

let todasMetas = [
    {
        value: 'Estudar programação todos os dias',
        checked: false
    }
]

const cadastrarMeta = async () => {
    const meta = await input({message: 'Digite uma meta:'})

    if(meta.length == 0) {
        console.log('Nenhuma meta foi cadastrada!')
        return
    }

    todasMetas.push({
        value: meta,
        checked: false
    })
}

const start = async () => {

    while(true) {

        const opcao = await select({
            message: 'Menu >',
            choices: [
                {
                    name: 'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    name: 'Listar metas',
                    value: 'listar'
                },
                {
                    name: 'Sair',
                    value: 'sair'
                }
            ]
        })

        switch(opcao) {
            case 'cadastrar':
                await cadastrarMeta()
                console.log(todasMetas)
                break
            case 'listar':
                console.log('vamos listas')
                break
            case 'sair':
                console.log('ate mais')
                return
        }
    }
}

start()