document.addEventListener('DOMContentLoaded', () => {
    // --- Elements from HTML ---
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const sendButton = document.getElementById('send-button');
    const quickActionButtons = document.querySelectorAll('.quick-action-button');

    // --- Function to Add Messages to Chat Window ---
    function addMessage(text, sender, id = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        const senderClass = sender === 'user' ? 'user-message' : 'bot-message';
        messageDiv.classList.add(senderClass);

        if (id) {
            messageDiv.id = id;
            if (id === 'typing-indicator') {
                messageDiv.classList.add('typing-indicator');
            }
        }

        const messageParagraph = document.createElement('p');
        const icon = sender === 'user' ? '👤' : '🤖';
        messageParagraph.innerHTML = `${icon} ${text.replace(/\n/g, '<br>')}`;
        messageDiv.appendChild(messageParagraph);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
    }

    // --- Process User Input and Generate Bot Response ---
    function processUserMessage(messageText) {
        if (!messageText || messageText.trim() === '') return;

        // Add user's message to chat window
        addMessage(messageText, 'user');

        // Clear input field
        userInput.value = '';
        sendButton.disabled = true;

        // Remove any existing typing indicator
        document.getElementById('typing-indicator')?.remove();

        // Show "thinking" message
        addMessage("UrBuddy está a pensar...", 'bot', 'typing-indicator');

        // Simulate bot response after a delay
        setTimeout(() => {
            document.getElementById('typing-indicator')?.remove();
            const intent = getIntent(messageText); // Identify intent
            const botReply = generateResponse(intent, messageText); // Generate response
            addMessage(botReply, 'bot'); // Add bot's reply to chat window
        }, 1000 + Math.random() * 800); // Random delay for realism
    }

    // --- Intent Detection Logic ---
    function getIntent(message) {
        const lowerMsg = message.toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Match intents based on keywords
        if (/\b(cantinas?|comer|refei(cao|coes))\b/i.test(lowerMsg)) return 'INFO_CANTEEN';
        if (/\b(alojamento|residencia|morada)\b/i.test(lowerMsg)) return 'INFO_HOUSING';
        if (/\b(wi-fi|wifi|internet|eduroam)\b/i.test(lowerMsg)) return 'INFO_WIFI';
        if (/\b(transportes?|autocarros?|fcup|ir|metro)\b/i.test(lowerMsg)) return 'INFO_TRANSPORT';
        if (/\b(estudar|bibliotecas?|salas? de estudo)\b/i.test(lowerMsg)) return 'INFO_STUDY_SPOT';
        if (/\b(lavandarias?|lavar roupa|maquina de lavar)\b/i.test(lowerMsg)) return 'FIND_LAUNDRY';
        if (/\b(supermercados?|mercado|compras|mercearia|comida para casa)\b/i.test(lowerMsg)) return 'FIND_SUPERMARKET';
        if (/\b(restaurantes?|comer fora|cafes?|tascas?|onde almocar|onde jantar|snack|bar)\b/i.test(lowerMsg)) return 'FIND_RESTAURANT';
        if (/\b(farmacias?|remedios?|medicamentos?|dor de cabeca)\b/i.test(lowerMsg)) return 'FIND_PHARMACY';
        if (/\b(imprimir|impress(ao|oes)|fotocopias?|reprografia|copias|scan|digitalizar)\b/i.test(lowerMsg)) return 'FIND_PRINTING';

        if (/\b(ola|oi|hey|bom dia|boa tarde)\b/i.test(lowerMsg)) return 'GREETING';
        if (/\b(obrigad[oa]|ok|certo)\b/i.test(lowerMsg)) return 'ACKNOWLEDGEMENT';
        if (/\b(adeus|xau|ate logo)\b/i.test(lowerMsg)) return 'FAREWELL';

        return 'UNKNOWN'; // Default fallback
    }

    // --- Helper Functions for Links and Maps ---
    const locationAnchor = "FCUP Porto";

    function createMapsSearchUrl(query, location) {
        return `https://www.google.com/maps/search/${encodeURIComponent(query)}+near+${encodeURIComponent(location)}`;
    }

    function createLink(url, text) {
        if (url && url.startsWith('http')) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        return text;
    }

    // --- Response Generation Logic ---
    function generateResponse(intent, userMessage) {
        switch (intent) {
            case 'INFO_CANTEEN': {
                const mapsUrlCanteen = createMapsSearchUrl("Cantina FCUP", locationAnchor);
                return `As cantinas da Universidade do Porto estão localizadas nos campos principais. 
                        Na FCUP é em frente ao FC2. ${createLink(mapsUrlCanteen, 'Ver no mapa')}. 
                        Consulte o horário e ementa no site oficial do SASUP.`;
            }

            case 'INFO_HOUSING': {
                const mapsUrlHousing = createMapsSearchUrl("Residência Alberto Amaral", locationAnchor);
                return `O alojamento estudantil é gerido pelo SASUP. Verifique as opções disponíveis no site:
                        <a href="https://sasup.up.pt/portal/pt/sasup/alojamento" target="_blank">SASUP Alojamento</a>. 
                        A Residência Alberto Amaral fica próxima: ${createLink(mapsUrlHousing, 'Ver no mapa')}.`;
            }

            case 'INFO_WIFI':
                return `A rede Wi-Fi Eduroam está disponível em todos os campos universitários. Utilize suas credenciais institucionais para acesso.`;

            case 'INFO_TRANSPORT': {
                const mapsUrlTransport = createMapsSearchUrl("Paragens,transportes", locationAnchor);
                return `Os transportes públicos, como metro e autocarros STCP, servem bem a zona da universidade. As paragens de autocarro mais proximas são Planetário ou Faculdade de ciências"
                        Planeie sua rota no ${createLink(mapsUrlTransport, 'Google Maps')}.`;
            }

            case 'INFO_STUDY_SPOT': {
                const mapsUrlStudy = createMapsSearchUrl("biblioteca ou café tranquilo", locationAnchor);
                return `As bibliotecas da FCUP são ótimas para estudar. A Biblioteca da FCUP (FC1) é uma excelente opção. 
                        Também há salas de estudo disponíveis no campus. ${createLink(mapsUrlStudy, 'Explorar no mapa')}.`;
            }

            case 'FIND_LAUNDRY': {
                const mapsUrlLaundry = createMapsSearchUrl("lavandaria self-service", locationAnchor);
                return `Lavandarias perto da FCUP: 🧺
                        Há opções na zona do Campo Alegre. ${createLink(mapsUrlLaundry, 'Vê no Google Maps')}.`;
            }

            case 'FIND_SUPERMARKET': {
                const mapsUrlSupermarket = createMapsSearchUrl("supermercado", locationAnchor);
                return `Supermercados perto da FCUP: 🛒
                        Existem várias opções nas redondezas. ${createLink(mapsUrlSupermarket, 'Vê no Google Maps')}.`;
            }

            case 'FIND_RESTAURANT': {
                const mapsUrlRestaurant = createMapsSearchUrl("restaurante ou café", locationAnchor);
                return `Comer fora perto da FCUP: 🍽️☕
                        A zona tem muitas opções! ${createLink(mapsUrlRestaurant, 'Explora no Google Maps')}.`;
            }

            case 'FIND_PHARMACY': {
                const mapsUrlPharmacy = createMapsSearchUrl("farmácia", locationAnchor);
                return `Farmácias perto da FCUP: ➕
                        Existem algumas na zona. ${createLink(mapsUrlPharmacy, 'Encontra a mais próxima no Google Maps')}.`;
            }

            case 'FIND_PRINTING': {
                const mapsUrlPrinting = createMapsSearchUrl("reprografia ou centro de cópias", locationAnchor);
                return `Impressões/Cópias (FCUP): 📄
                        Verifica a AEFCUP ou centros na zona. ${createLink(mapsUrlPrinting, 'Vê opções de reprografias no Google Maps')}.`;
            }

            case 'GREETING':
                return 'Olá! 👋 Como posso ajudar você hoje?';

            case 'ACKNOWLEDGEMENT':
                return 'Entendido! 😊 Precisa de mais alguma coisa?';

            case 'FAREWELL':
                return 'Até breve! 🌟 Se precisar, estou aqui.';

            case 'UNKNOWN':
                return `Desculpe, não entendi muito bem "${userMessage}". Tente perguntar algo como: 
                        "Onde ficam as cantinas?" ou "Como aceder ao Wi-Fi?".`;
        }
    }

    // --- Event Listeners ---
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userText = userInput.value.trim();
        processUserMessage(userText);
    });

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && userInput.value.trim() !== '') {
            event.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    quickActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const query = button.dataset.query;
            if (query) {
                processUserMessage(query);
            }
        });
    });

    userInput.addEventListener('input', () => {
        sendButton.disabled = userInput.value.trim() === '';
    });

    sendButton.disabled = userInput.value.trim() === '';
});