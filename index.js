const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = 'Bem-vindo ao in.orbit, seu app de Metas!'

let todasMetas 

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile('metas.json', 'utf-8')
        //parse() converte os dados do JSON para um array (é um array pois criei dessa forma)
        todasMetas = JSON.parse(dados)
    }
    catch(erro) {
        todasMetas = []
    }
}

const salvarMetas = async () => {
    //stringify irá tranformar o array em um formato JSON
    await fs.writeFile('metas.json', JSON.stringify(todasMetas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({message: 'Digite uma meta:'})

    if(meta.length == 0) {
        mensagem = 'Nenhuma meta foi cadastrada!'
        return
    }

    todasMetas.push({
        value: meta,
        checked: false
    })

    mensagem = 'Meta cadastrada com sucesso!'
    return
}

const listarMetas = async () => {
    
    const selecionadas = await checkbox({
        
        message: 'Minhas Metas - (Use as setas para mudar a meta selecionada, o espaço para marcar/desmarcar e o enter para finalizar)',
        choices: [...todasMetas],
        instructions: false
    })

    todasMetas.forEach((m) => {
        m.checked = false
    })

    if(selecionadas.length == 0) {
        mensagem = 'Nenhuma meta foi selecionada.'
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

    mensagem = selecionadas.length > 1 ? 'Metas concluídas com sucesso! Parabéns!' : 'Meta concluída com sucesso! Parabéns!'
    return
}

const metasRealizadas = async () => {

    const realizadas = todasMetas.filter((meta) => {
        return meta.checked
    })
    
    if(realizadas.length == 0) {
        mensagem = 'No momento, não há metas realizadas :('
        return
    }

    await select({
        message: 'Metas realizadas',
        choices: [...realizadas]
    })

    mensagem = `${realizadas.length} `
    mensagem += realizadas.length > 1 ? `metas realizadas no total.` : `meta realizada no total.`
    return
}

const metasAbertas = async () => {

    const abertas = todasMetas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0) {
        if(todasMetas == 0) {
            mensagem = 'Você ainda não cadastrou suas metas. Não perca tempo, vamos evoluir cada vez mais!'
        } else {
            mensagem = 'Parabéns!! Você concluiu todas as suas metas :)'
            mensagem += ' Aproveite para organizar as próximas, vamos evoluir cada vez mais.'
        }
        return
    }

    await select({
        message: 'Metas abertas',
        choices: [...abertas]
    })

    mensagem = `${abertas.length} `
    mensagem += abertas.length > 1 ? `metas abertas no total.` : `meta aberta no total.`
    return
}

const removerMetas = async () => {

    //map() percorre cada elemento do array e aplica uma função de tranformação para cada um deles
    // com isso, ela retorna um novo array (feito em cima do antigo)
    const desmarcar = todasMetas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const metasParaDeletar = await checkbox({
        message: 'Selecione a(s) meta(s) que deseja remover:',
        choices: [...desmarcar],
        instructions: false
    })

    if(metasParaDeletar.length == 0) {
        mensagem = 'Nenhuma meta foi removida.'
        return
    }

    metasParaDeletar.forEach((item) => {
        //filter() retornar um novo array com os filtros estabelecidos 
        todasMetas = todasMetas.filter((meta) => {
            //se for diferente do item selecionado para deletar, a resposta é true - dessa forma, filter irá colocar a meta no novo array
            //se for igual ao item que deve deletar, a resposta é false - nesse caso, filter não irá colocar a meta no novo array
            //como está sendo substituido no próprio array de todasMetas, todo item que o filter não adicionar ao novo array não existirá mais, ou seja, será removido
            return meta.value != item
        })
    })

    mensagem = metasParaDeletar.length > 1 ? 'Metas removidas com sucesso!' : 'Meta removida com sucesso!'
    return
}

const limparExibir = () => {
    console.clear()

    if(mensagem != '') {
        console.log(mensagem)
        console.log('')
        mensagem = ''
    }
}

const start = async () => {
    await carregarMetas()

    while(true) {
        limparExibir()
        await salvarMetas()

        const opcao = await select({
            message: 'Menu >',
            choices: [
                {
                    name: 'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    name: 'Minhas metas',
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
                    name: 'Remover metas',
                    value: 'remover'
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
            case 'remover':
                await removerMetas()
                break
            case 'sair':
                console.log('Até a próxima!')
                return
        }
    }
}

start()
