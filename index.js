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

const listarMetas = async () => {
    const selecionadas = await checkbox({
        message: 'Use as setas para mudar a meta selecionada, o espaço para marcar/desmarcar e o enter para finalizar',
        choices: [...todasMetas],
        instructions: false
    })

    if(selecionadas.length == 0) {
        return
    }

    todasMetas.forEach((m) => {
        m.checked = false
    })

    //forEach = para cada item dentro de selecionadas
    //find irá procurar uma meta, dentro do array, que seja igual a meta selecionada pelo user
    //quando encontrar, retornará true e a meta será atribuida a variável
    
    selecionadas.forEach((selecionada) => {
        const meta = todasMetas.find((m) => {
            return m.value == selecionada
        })
        meta.checked = true
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
                break
            case 'listar':
                await listarMetas()
                break
            case 'sair':
                console.log('ate mais')
                return
        }
    }
}

start()