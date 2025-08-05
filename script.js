document.addEventListener('DOMContentLoaded', () => {
    // === Elementos da Interface ===
    const UI = {
        screens: {
            welcome: document.getElementById('welcomeScreen'),
            setup: document.getElementById('setupScreen'),
            raffle: document.getElementById('raffleScreen'),
            final: document.getElementById('finalScreen')
        },
        buttons: {
            startSetup: document.getElementById('startSetupButton'),
            confirmSetup: document.getElementById('confirmSetupButton'),
            draw: document.getElementById('drawWinnerButton'),
            newRaffle: document.getElementById('newRaffleButton'),
            finish: document.getElementById('finishRaffleButton'),
            restart: document.getElementById('restartRaffleButton'),
            export: document.getElementById('exportResultsButton')
        },
        inputs: {
            importPrizes: document.getElementById('importPrizes'),
            manualPrizes: document.getElementById('manualPrizes'),
            importParticipants: document.getElementById('importParticipants'),
            manualParticipants: document.getElementById('manualParticipants')
        },
        displays: {
            currentPrize: document.getElementById('currentPrizeText'),
            remainingPrizes: document.getElementById('remainingPrizesCount'),
            participantsCount: document.getElementById('participantsCount'),
            winnerName: document.getElementById('winnerName'),
            winnerPrize: document.getElementById('winnerPrize'),
            suspenseMessage: document.getElementById('suspenseMessage'),
            previousWinners: document.getElementById('previousWinners'),
            totalPrizes: document.getElementById('totalPrizesAwarded'),
            totalParticipants: document.getElementById('totalParticipants'),
            completeWinners: document.getElementById('completeWinnersList'),
            prizesPreview: document.getElementById('prizesPreview'),
            participantsPreview: document.getElementById('participantsPreview')
        },
        areas: {
            suspense: document.getElementById('suspenseArea'),
            winner: document.getElementById('winnerArea'),
            progress: document.querySelector('.progress')
        },
        audio: {
            suspense: document.getElementById('suspenseSound'),
            celebration: document.getElementById('celebrationSound')
        },
        elements: {
            spinner: document.getElementById('spinner')
        }
    };

    // === Estado da Aplicação ===
    const state = {
        prizes: [],
        originalPrizes: [],
        participants: [],
        winners: [],
        currentPrize: null,
        currentWinner: null,
        isDrawing: false,
        settings: {
            suspenseDuration: 3000,
            maxParticipants: 5000,
            maxPrizes: 100
        }
    };

    // === Funções Utilitárias ===
    const utils = {
        // Mostra/oculta telas
        showScreen: (screen) => {
            Object.values(UI.screens).forEach(s => {
                s.classList.toggle('active', s === screen);
                s.hidden = s !== screen;
            });
        },
        
        // Gera número aleatório
        getRandomIndex: (array) => Math.floor(Math.random() * array.length),
        
        // Controla áudio
        playAudio: (audioElement) => {
            try {
                audioElement.currentTime = 0;
                audioElement.play().catch(e => {
                    console.warn("Autoplay bloqueado:", e);
                    // Mostra botão para ativar áudio
                    const playButton = document.createElement('button');
                    playButton.textContent = 'Ativar Sons';
                    playButton.className = 'btn-secondary';
                    playButton.style.marginTop = '10px';
                    playButton.onclick = () => {
                        audioElement.play();
                        playButton.remove();
                    };
                    document.querySelector('.container').appendChild(playButton);
                });
            } catch (e) {
                console.error("Erro no áudio:", e);
            }
        },
        
        // Processa arquivo de texto
        processTextFile: (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    const content = event.target.result;
                    const lines = content.split('\n')
                        .map(line => line.trim())
                        .filter(line => line !== '');
                    resolve(lines);
                };
                
                reader.onerror = () => {
                    reject(new Error("Erro ao ler o arquivo."));
                };
                
                reader.readAsText(file);
            });
        },
        
        // Valida lista
        validateList: (list, type) => {
            if (list.length === 0) {
                throw new Error(`Por favor, forneça uma lista de ${type}.`);
            }
            
            if (type === 'participantes' && list.length < 2) {
                throw new Error("São necessários pelo menos 2 participantes para o sorteio.");
            }
            
            const max = type === 'participantes' ? state.settings.maxParticipants : state.settings.maxPrizes;
            if (list.length > max) {
                throw new Error(`Número máximo de ${type} excedido (${max}).`);
            }
            
            return list;
        },
        
        // Atualiza pré-visualização
        updatePreview: (element, items) => {
            element.innerHTML = '';
            
            if (items.length === 0) {
                element.innerHTML = '<p class="empty-message">Nenhum item carregado</p>';
                return;
            }
            
            const fragment = document.createDocumentFragment();
            items.slice(0, 10).forEach(item => {
                const div = document.createElement('div');
                div.className = 'list-preview-item';
                div.textContent = item;
                fragment.appendChild(div);
            });
            
            if (items.length > 10) {
                const more = document.createElement('div');
                more.className = 'list-preview-item';
                more.textContent = `... e mais ${items.length - 10} itens`;
                fragment.appendChild(more);
            }
            
            element.appendChild(fragment);
        },
        
        // Cria efeito de confete
        createConfetti: () => {
            const confettiContainer = document.querySelector('.confetti');
            confettiContainer.innerHTML = '';
            
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.animationDelay = `${Math.random() * 3}s`;
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                confettiContainer.appendChild(confetti);
            }
        },
        
        // Formata data
        formatDate: (date) => {
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        },
        
        // Exporta resultados
        exportResults: () => {
            if (state.winners.length === 0) {
                alert("Nenhum resultado para exportar.");
                return;
            }
            
            let csvContent = "Nome do Ganhador,Prêmio,Data/Hora\n";
            state.winners.forEach(winner => {
                csvContent += `"${winner.name}","${winner.prize}","${utils.formatDate(winner.date)}"\n`;
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resultados-sorteio-${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // === Lógica Principal ===
    
    // Configuração Inicial
    const setupRaffle = async () => {
        // Verifica se já temos listas carregadas
        if (state.originalPrizes.length > 0 || state.participants.length > 0) {
            if (confirm("Já existem listas carregadas. Deseja redefinir e carregar novas listas?")) {
                resetState();
            } else {
                startRaffles();
                return;
            }
        }
        
        utils.showScreen(UI.screens.setup);
    };
    
    // Carrega prêmios do arquivo
    UI.inputs.importPrizes.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const prizes = await utils.processTextFile(file);
            state.originalPrizes = [...prizes];
            state.prizes = [...prizes];
            utils.updatePreview(UI.displays.prizesPreview, prizes);
            UI.inputs.manualPrizes.value = prizes.join('\n');
            checkSetupComplete();
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    });
    
    // Carrega prêmios manuais
    UI.inputs.manualPrizes.addEventListener('input', () => {
        const prizes = UI.inputs.manualPrizes.value.split('\n')
            .map(p => p.trim())
            .filter(p => p !== '');
        
        state.originalPrizes = [...prizes];
        state.prizes = [...prizes];
        utils.updatePreview(UI.displays.prizesPreview, prizes);
        checkSetupComplete();
    });
    
    // Carrega participantes do arquivo
    UI.inputs.importParticipants.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const participants = await utils.processTextFile(file);
            state.participants = participants;
            utils.updatePreview(UI.displays.participantsPreview, participants);
            UI.inputs.manualParticipants.value = participants.join('\n');
            checkSetupComplete();
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    });
    
    // Carrega participantes manuais
    UI.inputs.manualParticipants.addEventListener('input', () => {
        const participants = UI.inputs.manualParticipants.value.split('\n')
            .map(p => p.trim())
            .filter(p => p !== '');
        
        state.participants = participants;
        utils.updatePreview(UI.displays.participantsPreview, participants);
        checkSetupComplete();
    });
    
    // Verifica se a configuração está completa
    const checkSetupComplete = () => {
        const hasPrizes = state.originalPrizes.length > 0;
        const hasParticipants = state.participants.length > 1;
        
        UI.buttons.confirmSetup.disabled = !(hasPrizes && hasParticipants);
    };
    
    // Inicia os sorteios
    const startRaffles = () => {
        if (state.originalPrizes.length === 0 || state.participants.length < 2) {
            alert("Por favor, carregue as listas de prêmios e participantes primeiro.");
            return;
        }
        
        // Reinicia os prêmios disponíveis
        state.prizes = [...state.originalPrizes];
        state.winners = [];
        
        // Atualiza a UI
        UI.displays.participantsCount.textContent = state.participants.length;
        UI.displays.remainingPrizes.textContent = state.prizes.length;
        
        // Seleciona o primeiro prêmio
        selectNextPrize();
        
        utils.showScreen(UI.screens.raffle);
    };
    
    // Seleciona o próximo prêmio
    const selectNextPrize = () => {
        if (state.prizes.length === 0) {
            finishRaffles();
            return;
        }
        
        const prizeIndex = utils.getRandomIndex(state.prizes);
        state.currentPrize = state.prizes[prizeIndex];
        state.prizes.splice(prizeIndex, 1);
        
        // Atualiza a UI
        UI.displays.currentPrize.textContent = state.currentPrize;
        UI.displays.remainingPrizes.textContent = state.prizes.length;
        UI.areas.winner.hidden = true;
        UI.buttons.draw.hidden = false;
    };
    
    // Realiza o sorteio
    const drawWinner = async () => {
        if (state.isDrawing) return;
        state.isDrawing = true;
        
        try {
            // Valida se ainda há participantes
            if (state.participants.length === 0) {
                throw new Error("Todos os participantes já foram sorteados.");
            }
            
            // Configura UI para o sorteio
            UI.buttons.draw.hidden = true;
            UI.areas.suspense.hidden = false;
            UI.elements.spinner.hidden = false;
            UI.displays.suspenseMessage.textContent = "Sorteando o ganhador...";
            UI.areas.progress.style.width = '0';
            
            // Efeitos de áudio e visual
            utils.playAudio(UI.audio.suspense);
            
            // Animação de suspense
            await new Promise(resolve => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / state.settings.suspenseDuration, 1);
                    UI.areas.progress.style.width = `${progress * 100}%`;
                    
                    if (progress >= 1) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 16); // ~60fps
            });
            
            // Seleciona o vencedor
            const winnerIndex = utils.getRandomIndex(state.participants);
            state.currentWinner = state.participants[winnerIndex];
            
            // Registra o vencedor
            state.winners.push({
                name: state.currentWinner,
                prize: state.currentPrize,
                date: new Date()
            });
            
            // Remove o participante sorteado (opcional - comente para permitir múltiplos prêmios)
            // state.participants.splice(winnerIndex, 1);
            
            // Atualiza UI com o resultado
            showWinner();
            
        } catch (error) {
            alert(error.message);
            UI.buttons.draw.hidden = false;
        } finally {
            state.isDrawing = false;
        }
    };
    
    // Mostra o vencedor
    const showWinner = () => {
        UI.areas.suspense.hidden = true;
        UI.areas.winner.hidden = false;
        UI.displays.winnerName.textContent = state.currentWinner;
        UI.displays.winnerPrize.textContent = state.currentPrize;
        UI.displays.winnerName.setAttribute('aria-live', 'assertive');
        
        // Atualiza lista de ganhadores anteriores
        updateWinnersList();
        
        // Efeitos de celebração
        utils.createConfetti();
        UI.audio.suspense.pause();
        utils.playAudio(UI.audio.celebration);
    };
    
    // Atualiza a lista de ganhadores
    const updateWinnersList = () => {
        UI.displays.previousWinners.innerHTML = '';
        UI.displays.completeWinners.innerHTML = '';
        
        const fragmentPrev = document.createDocumentFragment();
        const fragmentComplete = document.createDocumentFragment();
        
        // Mostra os últimos 5 ganhadores na tela de sorteio
        const lastWinners = state.winners.slice(-5).reverse();
        lastWinners.forEach(winner => {
            const div = document.createElement('div');
            div.className = 'winner-entry';
            div.innerHTML = `
                <span class="winner-name-small">${winner.name}</span>
                <span class="winner-prize-small">${utils.formatDate(winner.date)}</span>
            `;
            fragmentPrev.appendChild(div);
        });
        
        // Mostra todos os ganhadores na tela final
        state.winners.slice().reverse().forEach(winner => {
            const div = document.createElement('div');
            div.className = 'winner-entry';
            div.innerHTML = `
                <span class="winner-name-small">${winner.name}</span>
                <span class="winner-prize-small">${winner.prize} - ${utils.formatDate(winner.date)}</span>
            `;
            fragmentComplete.appendChild(div);
        });
        
        UI.displays.previousWinners.appendChild(fragmentPrev);
        UI.displays.completeWinners.appendChild(fragmentComplete);
    };
    
    // Próximo sorteio
    const nextRaffle = () => {
        if (state.prizes.length === 0) {
            finishRaffles();
            return;
        }
        
        selectNextPrize();
    };
    
    // Finaliza todos os sorteios
    const finishRaffles = () => {
        // Atualiza a tela final
        UI.displays.totalPrizes.textContent = state.winners.length;
        UI.displays.totalParticipants.textContent = state.participants.length;
        updateWinnersList();
        
        utils.showScreen(UI.screens.final);
    };
    
    // Reinicia o sistema
    const restartRaffles = () => {
        resetState();
        utils.showScreen(UI.screens.welcome);
    };
    
    // Reseta o estado
    const resetState = () => {
        state.prizes = [];
        state.originalPrizes = [];
        state.participants = [];
        state.winners = [];
        state.currentPrize = null;
        state.currentWinner = null;
        state.isDrawing = false;
        
        // Limpa inputs
        UI.inputs.importPrizes.value = '';
        UI.inputs.manualPrizes.value = '';
        UI.inputs.importParticipants.value = '';
        UI.inputs.manualParticipants.value = '';
        
        // Limpa pré-visualizações
        UI.displays.prizesPreview.innerHTML = '';
        UI.displays.participantsPreview.innerHTML = '';
        
        // Desabilita botão de confirmação
        UI.buttons.confirmSetup.disabled = true;
    };
    
    // === Event Listeners ===
    UI.buttons.startSetup.addEventListener('click', setupRaffle);
    UI.buttons.confirmSetup.addEventListener('click', startRaffles);
    UI.buttons.draw.addEventListener('click', drawWinner);
    UI.buttons.newRaffle.addEventListener('click', nextRaffle);
    UI.buttons.finish.addEventListener('click', finishRaffles);
    UI.buttons.restart.addEventListener('click', restartRaffles);
    UI.buttons.export.addEventListener('click', utils.exportResults);
    
    // Inicialização
    resetState();
    utils.showScreen(UI.screens.welcome);
});