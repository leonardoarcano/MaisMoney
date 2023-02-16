/* INÍCIO - FUNCIONALIDADES DA GUIA DE GASTOS */

class Despesa{ //criação de uma classe padrão de despesas
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo    
        this. descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == null || this[i] == '' || this[i] == undefined){
                return false
            }
        }
        return true
    }
}

class BancoDados{
    constructor(){
        let id = localStorage.getItem('id') //verificar se existe uma id presente no armazenamento local
        if(id === null){ // se id for inexistente (null) o 'setItem' irá criar esse item com o valor ZERO
            localStorage.setItem('id', 0) 
        }
    }  
    
    
getProximoId(){ //método para puxar o próximo id
    let proximoId = localStorage.getItem('id') // cria a variavel e coloca nela o valor de 'id', criado anteriormente dentro do BD
    return parseInt(proximoId) + 1 //retorna o valor encontrado com a adição de 1
}

gravar(d){ //método para gravar os dados no armazenamento local. Ele vai receber como critério a despesa criada
    let id = this.getProximoId() //o id vai receber o valor retornado do método 'getProximoId'
    localStorage.setItem(id, JSON.stringify(d)) //seta os dados no armazenamento local (transformando antes o objeto 'despesa' em um JSON)
    localStorage.setItem('id', id) // define o valor de ir sendo o valor retornado no proximoID.
}

//Recuperar registros
recuperarTodosRegistros(){
    let despesas = Array() //variável despesas será um array de objetos

    let id = localStorage.getItem('id') // instancia o id do Armazenamento local na var 'id'

    for (let i = 1; i <= id ; i++){ //laço de repetição forLet que  vai checar se o indice(i) e menor ou igual ao id
        let despesa = JSON.parse(localStorage.getItem(i))//recupera o indice presente no índice atual e guarda em despesa

        if ( despesa === null){//caso não exista uma despesa a aplicação continua
            continue
        }

        despesa.id = i

        despesas.push(despesa)//adiciona a despesa no ARRAY de despesas 
    }

    return despesas //retorna o array completa com os objetos
}
    remover(id){
        localStorage.removeItem(id)
    }
}
 let bd = new BancoDados()

 function popUpFechar(){
    let popUp = document.getElementById('pop-up-status')
    popUp.style.display = 'none'
 }

 function popUpFecharSucesso(){
    let popUp = document.getElementById('pop-up-sucesso')
    popUp.style.display = 'none'
    window.location.reload()
 }

function popUpStatus(){
    document.getElementById('pop-up-status').style.display = 'block'
}

function popUpSucesso(){
    document.getElementById('pop-up-sucesso').style.display = 'block'
}

function adicionarDespesa(){ //evento disparado ao clicar em "Adicionar Gasto"
    //primeiro a aplicação irá instanciar os elementos recuperados à variáveis
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    //e então irá usar a classe "Despesa" para criar um novo objeto, recuperando os valores instanciados.
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()){

        //gravar dados no Banco de Dados
        bd.gravar(despesa)
        //resetar valores
        ano.value = ''
        mes.value = '' 
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

        popUpSucesso()
    } else {
        popUpStatus()
    }

    console.log(despesa)
}

function carregarListaDespesas(despesas = Array(), filtro = false){ // declara que as despesas serão, por padrão, um array

    if(despesas.length == 0){
        despesas =  bd.recuperarTodosRegistros() //se a quantidade de itens for ZERO ele irá executar o método de recuperação do banco de dados
    } 

    let listaDespesas = document.getElementById('listaDespesas') //instanciando o elemento HTML responsável pelo TBODY
    listaDespesas.innerHTML = '' // limpa o conteúdo
    
    despesas.forEach(function(d){ //para cada despesa
        let linha = listaDespesas.insertRow() //a variável linha irá inserir uma fileira na tabela 
        let valor = parseFloat(d.valor)
        let valorReal = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` //os elementos do array vão ser adicionados em suas respectivas células

        switch(d.tipo){ //switch para transformar o valor numérico do "tipo" em um equivalente em String. 
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Transporte'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Educação'
                break
            case '5': d.tipo = 'Saúde'
                break
            case '6': d.tipo = 'Investimento'
                break
            case '7': d.tipo = 'Outros'
                break
        }
        linha.insertCell(1).innerHTML = `${d.tipo} - ${d.descricao}`
        linha.insertCell(2).innerHTML = valorReal

        let btn = document.createElement('button')
        btn.className = 'btn btn-custom'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.style.fontSize = '10px'
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(3).append(btn)
    })
}

/* FINAL - FUNCIONALIDADES DA GUIA DE GASTOS */

/* INÍCIO - GUIA ORÇAMENTO*/
class Orcamento{
    constructor (data,valor){
        this.data = data
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == null || this[i] == '' || this[i] == undefined){
                return false
            }
        }
        return true
    }
    
}
function definirOrcamento(){//funcao que irá recuperar os dados e criar um novo objeto (orcamento)

    let ano = document.getElementById('anoOrcamento')
    let mes = document.getElementById('mesOrcamento')
    let valor = document.getElementById('valorOrcamento')
    
    var orcamento = new Orcamento() // criando o objeto

    orcamento.data = `${mes.value}/${ano.value}`//definindo seus valores
    orcamento.valor = valor.value

    if(orcamento.validarDados()){
    localStorage.setItem('orcamento', JSON.stringify(orcamento))//armazenando o objeto no armazenamento local com a key 'orcamento'
    //limpando dados preenchidos após salvá-los
    document.getElementById('anoOrcamento').innerHTML = '' 
    document.getElementById('mesOrcamento').innerHTML = ''
    document.getElementById('valorOrcamento').value = ''
    window.location.reload() 
    } else {
        popUpStatus()
    }

}

const orcamentoAtual = JSON.parse(localStorage.getItem('orcamento'))
const valorOrcamento = parseFloat(orcamentoAtual.valor)
const valorReal = valorOrcamento.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

function buscaOrcamento(){ //funcao que vai buscar o orçamento já salvo e mostrar na tela
    document.getElementById('dataReferencia').innerHTML = 'Data referência: ' + orcamentoAtual.data
    document.getElementById('valorReferencia').innerHTML = 'Orçamento: ' + valorReal
}

/* FINAL - GUIA ORÇAMENTO*/

/* INÍCIO - HOME PAGE*/
function buscaGastosMes(){
    
    let gastoMes = 0 //o gasto do mês se inicia zerado
    let dataAtual = orcamentoAtual.data //instanciando a data do orçamento atual
    let valorMaximo = parseFloat(orcamentoAtual.valor) //instanciando e passando o valor do orçamento para número

    for(let i = 0 ; i <= localStorage.length + 1; i++){ //um laço for para percorrer elementos do localStorage

        const id = localStorage.key(i) //criando a variável id que vai receber o número do índice

        if (id != 'orcamento' && id != 'id'){ //se a id NAO for orçamento ou ID faça:

            const gasto = JSON.parse(localStorage.getItem(id)) //cria o objeto gasto
            let dataGasto = `${gasto.mes}/${gasto.ano}` //define a data do gasto

            console.log(`GASTO ${id}: ${dataGasto}`)

            if(dataGasto == dataAtual){ //se a data do gasto for igual à data atual, faça:

                let gastoValor = gasto.valor //instanciar o valor na variável
                let gastoValorAtualizado = gastoValor.replace("," , ".") //criei essa variável para pegar o valor sem a "vírgula", para que a aplicação entenda os decimais
                gastoMes = gastoMes + parseFloat(gastoValorAtualizado) //o gasto do mês é ele mesmo somado ao valor numérico das despesas do mês
            }

        }

        let valorMaximoReal = valorMaximo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        let gastoMesReal = gastoMes.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

        document.getElementById('barra').innerHTML = `${gastoMesReal} de ${valorMaximoReal}` //exibe os valores na tela, limitando para somente duas casas após a vírgula
    }

}
/* FINAL - HOME PAGE*/

/* INÍCIO - GUIA METAS*/

class Meta{
    constructor(titulo, tipo, valor,guardado){
        this.titulo = titulo
        this.tipo = tipo
        this.valor = valor
        this.guardado = guardado
    }

    validarDadosMeta(){
        for(let i in this){
            if(this[i] == null || this[i] == '' || this[i] == undefined){
                return false
            }
        }
        return true
    }
}

class MetaBD{ //banco de dados para as Metas
    constructor(){
        let MetaId = localStorage.getItem('MetaId') //verificar se existe uma id presente no armazenamento local
        if(MetaId === null){
            localStorage.setItem('MetaId', 0) 
        }
    }  
    
    
getProximaMeta(){ //método para puxar o próximo id
    let proximaMeta = localStorage.getItem('MetaId') 
    return parseInt(proximaMeta) + 1 //retorna o valor encontrado com a adição de 1
}

gravarMeta(m){ //método para gravar os dados no armazenamento local.
    let MetaId = this.getProximaMeta() //o id vai receber o valor retornado do método 'getProximoId'
    localStorage.setItem('meta' + MetaId, JSON.stringify(m)) //seta os dados no armazenamento local (transformando antes o objeto 'despesa' em um JSON)
    localStorage.setItem('MetaId', MetaId) // define o valor de ir sendo o valor retornado no proximoID.
}

recuperarMetas(){
    let metas = Array() //variável metas será um array de objetos

    let metaId = localStorage.getItem('MetaId') // instancia o id do Armazenamento local na var 'MetaId'

    for (let i = 1; i <= metaId ; i++){ //laço de repetição forLet que  vai checar se o indice(i) e menor ou igual ao id
        let meta = JSON.parse(localStorage.getItem('meta' + i))

        if ( meta === null){//caso não exista uma meta a aplicação continua
            continue
        }

        meta.metaId = i

        metas.push(meta)
    }

    return metas //retorna o array completa com os objetos
}
    remover(id){
        localStorage.removeItem('meta'+ id)
    }
}

let bancoMetas = new MetaBD()

function popUpMeta(){
    document.getElementById('wrapper').style.display = 'block' //popUp com o formulário de criação de metas
}

function popUpMetaFechar(){
    document.getElementById('wrapper').style.display = 'none'
}

function salvarMeta(){
    let tituloMeta = document.getElementById('tituloMeta')
    let categoriaMeta = document.getElementById('categoriaMeta')
    let valorMeta = document.getElementById('valorMeta')
    let valorGuardado = document.getElementById('valorGuardado')

let meta = new Meta()

meta.titulo = tituloMeta.value
meta.tipo = categoriaMeta.value
meta.valor = valorMeta.value
meta.guardado = valorGuardado.value

if(meta.validarDadosMeta()){ //se a validação for "true"
    bancoMetas.gravarMeta(meta)//grava a meta e atualiza a página
    //limpa os imputs
    tituloMeta.value = ''
    categoriaMeta.value = ''
    valorMeta.value = ''
    valorGuardado.value = ''

    popUpSucesso()// recarrega a aplicação

} else (
    popUpStatus()
)

}

function carregaMetas(metas = Array()){ //função para carregar todas as metas e exibi-las na página
    metas = bancoMetas.recuperarMetas()
    let i = 1

    metas.forEach(function(m){

        switch(m.tipo){ //switch para transformar o valor numérico do "tipo" em um equivalente em String. 
            case '1': m.tipo = '<i class="align-self-center fa-sharp fa-solid fa-plane fa-4x"></i>'
                break
            case '2': m.tipo = '<i class="align-self-center fa-solid fa-coins fa-4x"></i>'
                break
            case '3': m.tipo = '<i class="align-self-center fa-solid fa-car fa-4x"></i>'
                break
            case '4': m.tipo = '<i class="align-self-center fa-solid fa-house fa-4x"></i>'
                break
            case '5': m.tipo = '<i class="align-self-center fa-solid fa-cart-plus fa-4x"></i>'
                break
            case '6': m.tipo = '<i class="align-self-center fa-solid fa-boxes-packing fa-4x"></i>'
                break

        }

        let guardado = parseFloat(m.guardado) //instanciar os valores em forma numérica para que eu consiga usar o toFixed depois
        let valor = parseFloat(m.valor)

        let guardadoReal = guardado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        let valorReal = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

        let porcentagem = (guardado / valor)*100
        let keyMeta = m.metaId

        let novaDiv = document.createElement("div") //toda as divs que vão hospedar os dados das metas serão criadas de forma programática, para que não tenha limite de quantidade.
        novaDiv.className = 'd-flex metaItem mb-2'
        novaDiv.id = 'novaDiv' + i
        novaDiv.innerHTML = `
        <div id="icone" class="icone_${keyMeta} col-4">
            <div class="d-flex"><button class="btn btn-sm rounded-0 align-self-center" id="excluir_${keyMeta}"><i class="fa-solid fa-trash fa-xl"></i></button></div>
            <div class="align-self-center text-center">${m.tipo}</div>
        </div>
        <div class="col-8 container justify-content-center">
            <h3 class="d-flex titulo-meta" id="titulo_${i}">${m.titulo}</h3>
            <span class="mb-2" style=" font-size: 16px; font-weight:700">${valorReal}</span><br>
            <div id="" class="input-group mb-1">
                <input id="guardarValor_${keyMeta}" type="number" class="input-sm input-number form-control" placeholder="Guardar" aria-describedby="add-valor">
                <button class="btn btn-add-valor" type="button" id="add_valor_${keyMeta}"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div class="barra col-12 mb-1">
                <div class="porcentagem d-flex" style="width: ${porcentagem}%; font-size: 16px; font-weight: 700">
                    <span id="">&nbsp${guardadoReal}</span>
                </div>
            </div>
            
        </div>
        ` // usei o template Strings para criar as divs com seus respectivos valores.

        document.querySelector('#metas').appendChild(novaDiv) // append toda a nova div criada no elemento "metas"
        
       i++ //i é encrementado para a próxima execução
        
    })

}



function atribuirOnClick(metas = Array()){ //essa função é responsável pela programação dos botões que adicionam ao valor guardado 
    metas = bancoMetas.recuperarMetas() //primeiro recupero o array de metas do local storage

    
    
    metas.forEach(function(m){
        let keyMeta = m.metaId
        let botao = document.getElementById('add_valor_' + keyMeta)
        let excluir = document.getElementById('excluir_' + keyMeta)

        botao.onclick = function(){  //setar onClick dos botões de adicionar dinheiro à meta
            let metaAtualizada = JSON.parse(localStorage.getItem('meta'+ keyMeta )) //recupera a meta
            let metaGuardado = metaAtualizada.guardado //recupera o valor guardado na meta em questão
            let guardarValor = document.getElementById('guardarValor_' + keyMeta).value //recupera o valor presente no input 
                if((guardarValor != null && guardarValor != undefined && guardarValor != '')){ //uma pequena verificação
                    let totalGuardado = parseFloat(metaGuardado) + parseFloat(guardarValor) //faz a soma do valor guardado com o valor à ser adicionado
                    metaAtualizada.guardado = totalGuardado
                    localStorage.setItem('meta' + keyMeta, JSON.stringify(metaAtualizada)) //setItem do valor atualizado, que irá substituir o presente no localStorage
                    
                    window.location.reload()
                }     
        }
        
        excluir.onclick = function(){ //setar onClick dos botãoes de excluir uma meta existente
            let id = this.id.replace('excluir_', '')
            bancoMetas.remover(id)
            
            window.location.reload()
        }

        function metasConcluidas(){
        let metaAtualizada = JSON.parse(localStorage.getItem('meta'+ keyMeta)) 
        let valorMeta = parseFloat(metaAtualizada.valor)
        let metaGuardado = parseFloat(metaAtualizada.guardado)
        let inputValor = document.getElementById('guardarValor_' + keyMeta)
        let icone = document.querySelector('.icone_' + keyMeta)
        if (metaGuardado >= valorMeta){
            inputValor.setAttribute("disabled", "disabled")
            inputValor.setAttribute("placeholder", "CONCLUÍDA")

            icone.className = `icone_${keyMeta} col-4 icone-bg`
        }
        console.log(valorMeta)
        console.log(inputValor)
        }

        metasConcluidas()
    })

}
setTimeout(atribuirOnClick, 1000) //aguardar um segundo para que a função "recuperarDados" possa ser executada totalmente antes de executar a "atribuirOnClick"

/* FINAL - GUIA METAS*/

/* INÍCIO - GUIA GRÁFICOS*/ 

function graficoMensal(){
    const ctx1 = document.getElementById('grafico_1') //pegando o contexto

    let dados = [0,0,0,0,0,0]
    let backgroundColor = ['', '','','','','']
    let labels = ['','','','','','']
    let despesas = bd.recuperarTodosRegistros()

    let valor1 = 0
    let valor2 = 0
    let valor3 = 0
    let valor4 = 0
    let valor5 = 0
    let valor6 = 0

    let dataAtual = orcamentoAtual.data
    
    despesas.forEach(function(d){

    dataDespesa = d.mes + '/' + d.ano
    console.log(dataDespesa, dataAtual,d)

    if(dataDespesa == dataAtual){

        valorDespesa = parseFloat(d.valor)
    switch(d.tipo){
        case '1': valor1 = valor1 + valorDespesa
        let valor1Real = valor1.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        dados.splice(0,1,valor1)
        backgroundColor.splice(0,1,'#46FF00')
        labels.splice(0,1,'Alimentação: ' + valor1Real)
            break
        case '2': valor2 = valor2 + valorDespesa
        let valor2Real = valor2.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        dados.splice(1,1,valor2)
        backgroundColor.splice(1,1,'#3900FF')
        labels.splice(1,1,'Transporte: ' + valor2Real)
            break
        case '3': valor3 = valor3 + valorDespesa
        let valor3Real = valor3.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        dados.splice(2,1,valor3)
        backgroundColor.splice(2,1,'#FFB900')
        labels.splice(2,1,'Lazer: ' + valor3Real)
            break
        case '4': valor4 = valor4 + valorDespesa
        let valor4Real = valor4.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        dados.splice(3,1,valor4)
        backgroundColor.splice(3,1,'#C6FF00')
        labels.splice(3,1,'Educação: ' + valor4Real)
            break
        case '5': valor5 = valor5 + valorDespesa
        let valor5Real = valor5.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        dados.splice(4,1,valor5)
        backgroundColor.splice(4,1,'#FF0046')
        labels.splice(4,1,'Saúde: ' + valor5Real)
            break
        case '6': valor6 = valor6 + valorDespesa
        let valor6Real = valor6.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        dados.splice(5,1,valor6)
        backgroundColor.splice(5,1,'#00FFB9')
        labels.splice(5,1,'Investimentos: ' + valor6Real)
            break
    }
    }
})
    
const data = {
    datasets: [{
        data:dados,
        backgroundColor,
        borderColor: 'whitesmoke', 
        parsing: false, 
    },
    ],
    labels,
}

const config = {
    type: 'doughnut',
    data: data,
    options: {
        plugins: {
            legend:{
                display: true,
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 16,
                    boxHeight: 16,
                    font:{
                        size: 14,
                        weight: 700,
                    }
                    
                }
            }
        }
    }
}

const myChart = new Chart(ctx1, config)
}
   





function graficoAnual(){
    const ctx2 = document.getElementById('grafico_2')
    
    let despesas = bd.recuperarTodosRegistros()

    let valor1 = 0
    let valor2 = 0
    let valor3 = 0
    let valor4 = 0
    let valor5 = 0
    let valor6 = 0
    let valor7 = 0
    let valor8 = 0
    let valor9 = 0
    let valor10 = 0
    let valor11 = 0
    let valor12 = 0

    let dados = [0,0,0,0,0,0,0,0,0,0,0,0]

    despesas.forEach(function(d){

        valorDespesa = parseFloat(d.valor)
        switch (d.mes) {
            case '1':
                valor1 = valor1 + valorDespesa
                dados.splice(0,1,valor1)
                break;
            case '2':
                valor2 = valor2 + valorDespesa
                dados.splice(1,1,valor2)
                break;
            case '3':
                valor3 = valor3 + valorDespesa
                dados.splice(2,1,valor3)
                break;
            case '4':
                valor4 = valor4 + valorDespesa
                dados.splice(3,1,valor4)
                break;
            case '5':
                valor5 = valor5 + valorDespesa
                dados.splice(4,1,valor5)
                break;
            case '6':
                valor6 = valor6 + valorDespesa
                dados.splice(5,1,valor6)
                break;
            case '7':
                valor7 = valor7 + valorDespesa
                dados.splice(6,1,valor7)
                break;
            case '8':
                valor8 = valor8 + valorDespesa
                dados.splice(7,1,valor8)
                break;
            case '9':
                valor9 = valor9 + valorDespesa
                dados.splice(8,1,valor9)
                break;
            case '10':
                valor10 = valor10 + valorDespesa
                dados.splice(9,1,valor10)
                break;
            case '11':
                valor11 = valor11 + valorDespesa
                dados.splice(10,1,valor11)
            case '12':
                valor12 = valor12 + valorDespesa
                dados.splice(11,1,valor12)
                break;   
            default:
                break;
        }

    })

    const labels = [
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez',
    ]
    
    const data = {
        labels,
        datasets: [
            {
            data:dados,
            label: "Gasto Anual",
            fill: false,
            borderWidht: '4px',
            borderColor: '#00FFB9',
            backgroundColor: 'whitesmoke'
        },
            
        ]
    }
    
    const config = {
        type: "line",
        data,
        options: {
            responsive: true,
            
            scales:{
                y:{
                    ticks:{
                        callback: function(value){
                            let finalValue = value.toFixed(2)
                            return 'R$' + finalValue.replace('.',',')
                        }
    
                    }
                }
    
            },
        }
    }
    const myChart2 = new Chart(ctx2, config)
}

/* FIM - GUIA GRÁFICOS*/ 