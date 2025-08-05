Sorteador de Rifas da Igreja

Bem-vindo ao Sorteador de Rifas da Igreja! Esta é uma aplicação web simples e fácil de usar, projetada para tornar o sorteio de rifas da comunidade mais justo, transparente e emocionante.

Com esta ferramenta, você pode apresentar o prêmio da rodada e, em seguida, sortear um ganhador de forma aleatória, com um breve momento de suspense que aumenta a expectativa de todos.

Funcionalidades

    Apresentação do Prêmio: Inicia cada sorteio revelando qual prêmio está em jogo na rodada atual.

    Gestão de Múltiplos Prêmios: Gerencia uma lista de prêmios para que você possa sortear um de cada vez, sem repetições.

    Suspense no Sorteio: Um suspense de 3 segundos com animação e som antes da revelação do ganhador.

    Interface Simples: Uma interface limpa e intuitiva, fácil para qualquer pessoa usar.

    Transparência: O sorteio é visível e aleatório, garantindo a confiança de todos os participantes.

Como Usar

Para usar o sorteador, siga os passos abaixo:

    Abra o arquivo index.html no seu navegador de internet (clique duas vezes no arquivo ou arraste-o para o navegador).

    Iniciar Sorteio: Clique no botão "Iniciar Sorteio". O sistema irá selecionar aleatoriamente um dos prêmios disponíveis da sua lista e mostrá-lo na tela.

    Descobrir o Ganhador: Clique em "Descobrir o Ganhador". A tela de sorteio será carregada, pronta para a lista de participantes.

    Inserir Participantes: No campo de texto, cole ou digite a lista de nomes ou números dos participantes da rifa. Certifique-se de que cada nome ou número esteja em uma nova linha.

    Sortear o Vencedor: Clique no botão "Sortear Ganhador". O sorteio começará com um suspense de 3 segundos antes de revelar o grande vencedor!

    Novo Sorteio: Após a celebração, clique em "Sortear Próximo Prêmio" para iniciar uma nova rodada com os prêmios restantes.

Personalização

Você pode facilmente personalizar a aplicação para atender às suas necessidades. Todas as personalizações são feitas nos arquivos do projeto.

1. Personalizar a Lista de Prêmios

Abra o arquivo script.js e encontre a variável availablePrizes. Você pode adicionar, remover ou alterar os prêmios nesta lista:
JavaScript

let availablePrizes = [
    "Um Vale-Presentes de R$ 500 na Loja X!",
    "Uma Smart TV 32 Polegadas!",
    "Uma Cesta Especial de Produtos da Comunidade!",
    "Um Fim de Semana em Pousada da Região!"
    // Adicione ou remova prêmios aqui conforme necessário
];

2. Mudar a Aparência (Cores e Fontes)

Abra o arquivo style.css. Você pode modificar as cores, fontes e tamanhos de texto para combinar com a identidade visual da sua igreja ou evento.

Alguns elementos importantes para personalizar:

    body: Cor de fundo geral da página (background-color).

    h1, h2: Cores dos títulos (color).

    button: Cor dos botões (background-color).

    #currentPrizeText: Cor do nome do prêmio (color).

    #winnerName: Cor e estilo do nome do ganhador (color, font-size).

3. Alterar os Efeitos Sonoros

Para mudar os sons de suspense e celebração, substitua os arquivos de áudio existentes.

    Substitua o arquivo suspense.mp3 pelo seu próprio arquivo de som de suspense.

    Substitua o arquivo celebration.mp3 pelo seu próprio arquivo de som de celebração.

Importante: Os novos arquivos de áudio devem estar na mesma pasta dos arquivos do projeto e ter o mesmo nome (suspense.mp3 e celebration.mp3). Se você quiser usar outros nomes, lembre-se de atualizar as referências no arquivo index.html.

Estrutura do Projeto

O projeto é composto por três arquivos principais:

    index.html: A estrutura da página web.

    style.css: O estilo e a aparência visual da aplicação.

    script.js: A lógica de funcionamento, incluindo a gestão de prêmios, o sorteio aleatório e as interações com os botões.

Sinta-se à vontade para explorar e personalizar o projeto! Se tiver dúvidas, verifique os comentários no código para entender melhor cada seção.
