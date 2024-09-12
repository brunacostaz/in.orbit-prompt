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

    todasMetas.forEach((m) => {
        m.checked = false
    })

    if(selecionadas.length == 0) {
        return
    }


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

const metasRealizadas = async () => {
    const realizadas = todasMetas.filter((meta) => {
        return meta.checked
    })
    
    if(realizadas.length == 0) {
        console.log('No momento, não há metas realizadas :(')
        return
    }

    await select({
        message: 'Metas realizadas',
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = todasMetas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0) {
        if(todasMetas == 0) {
            console.log('Você ainda não cadastrou suas metas. Não perca tempo, vamos evoluir cada vez mais!')
        } else {
            console.log('Parabéns!! Você concluiu todas as suas metas :)')
            console.log('Aproveite para organizar as próximas, vamos evoluir cada vez mais')
        }
        return
    }

    await select({
        message: 'Metas abertas',
        choices: [...abertas]
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
                    name: 'Metas realizadas',
                    value: 'realizadas'
                },
                {
                    name: 'Metas abertas',
                    value: 'abertas'
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
            case 'realizadas':
                await metasRealizadas()
                break
            case 'abertas':
                await metasAbertas()
                break
            case 'sair':
                console.log('Até a próxima!')
                return
        }
    }
}

start()