// Charger le JSON et l'utiliser
fetch('questions_game.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur de chargement : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Appelle une fonction pour gérer les questions
        initializeGame(data);
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données JSON :', error);
    });

// Initialiser le jeu avec les données JSON
function initializeGame(questions) {
    console.log('Données JSON :', questions);

    const questionContainer = document.getElementById('question');
    const drawCardButton = document.getElementById('drawCard');
    const resetButton = document.getElementById('resetButton'); // Bouton de réinitialisation

    const isHomePage = window.location.pathname.includes('index');
    const isPlayPage = window.location.pathname.includes('play');

    if (isHomePage) {
        const maxClicks = 5; // Limiter à 5 clics
        const customMessageBox = document.getElementById('customMessageBox');
        const closeMessageBox = document.getElementById('closeMessageBox');
        const messageText = document.getElementById('messageText');

        let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;

        // Fonction pour normaliser les caractères (enlever les accents)
        function normalizeString(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        // Créer une liste des 5 cartes à tirer dans le mode démo
        const demoCards = [
            { suit: 'Coeurs', card: 'As' },
            { suit: 'Coeurs', card: 'Roi' },
            { suit: 'Carreaux', card: 'Dame' },
            { suit: 'Trefles', card: 'Valet' },
            { suit: 'Piques', card: '10' }
        ];

        // Créer un tableau pour stocker les cartes déjà tirées
        let chosenCards = [];

        drawCardButton.addEventListener('click', () => {
            if (clickCount >= maxClicks) {
                // Afficher la boîte de message personnalisée
                customMessageBox.style.display = 'block';
                messageText.textContent = 'Vous avez atteint la limite de clics pour cette page.';
                return;
            }

            // Créer une variable pour indiquer si une carte valide a été tirée
            let validCardFound = false;
            let randomCard = null;
            let attempts = 0;  // Compteur pour limiter le nombre de tentatives

            // Essayer de tirer une carte valide
            while (!validCardFound && attempts < 10) {  // Limiter à 10 tentatives
                const randomCardIndex = Math.floor(Math.random() * demoCards.length);
                randomCard = demoCards[randomCardIndex];

                // Normaliser les noms des cartes pour éviter les problèmes d'accent
                const normalizedSuit = normalizeString(randomCard.suit);
                const normalizedCard = normalizeString(randomCard.card);

                // Vérifier si la carte a déjà été tirée
                const cardIdentifier = `${normalizedCard} de ${normalizedSuit}`;
                console.log(cardIdentifier);
                if (!chosenCards.includes(cardIdentifier)) {
                    // Vérifier si la carte existe dans questions
                    if (questions[randomCard.suit] && questions[normalizedSuit][normalizedCard]) {
                        validCardFound = true; // La carte est valide
                        // Ajouter la carte à la liste des cartes déjà tirées
                        chosenCards.push(cardIdentifier);
                        // Afficher la carte tirée dans la console
                        console.log('Carte tirée:', randomCard);
                    } else {
                        // Si la carte ou la suit n'existe pas, retirer la carte de la liste et essayer une autre carte
                        demoCards.splice(randomCardIndex, 1);
                        if (demoCards.length === 0) {
                            // Désactiver le bouton et afficher un message si toutes les cartes ont été retirées
                            drawCardButton.disabled = true;
                            questionContainer.textContent = 'Toutes les cartes ont été tirées !';
                            break;
                        }
                    }
                } else {
                    // Si la carte a déjà été tirée, essayer de tirer une autre carte
                    attempts++; // Incrémenter le compteur d'essais
                    continue;
                }
            }

            // Vérifier si on a trouvé une carte valide après 10 tentatives
            if (validCardFound) {
                questionContainer.textContent = `Question (${randomCard.card} de ${randomCard.suit}): ${questions[randomCard.suit][randomCard.card]}`;
                clickCount++;

                // Sauvegarder le nouveau nombre de clics dans localStorage
                localStorage.setItem('clickCount', clickCount);
            } else {
                // Si après 10 tentatives on n'a pas trouvé de carte valide
                questionContainer.textContent = 'Impossible de tirer une carte valide. Réessayez plus tard.';
            }
        });

        // Fermer la boîte de message
        closeMessageBox.addEventListener('click', () => {
            customMessageBox.style.display = 'none';
        });

        // Réinitialiser le compteur de clics
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('clickCount');
            clickCount = 0;
            customMessageBox.style.display = 'block';
            messageText.textContent = 'Le compteur de clics a été réinitialisé.';
            drawCardButton.disabled = false;
        });
    } else if (isPlayPage) {
        // Aucun limite pour la page "play"
        drawCardButton.addEventListener('click', () => {
            const randomSuit = getRandomKey(questions); // Couleur aléatoire
            const randomCard = getRandomKey(questions[randomSuit]); // Carte aléatoire

            // Affiche la question correspondante
            questionContainer.textContent = `Question (${randomCard} de ${randomSuit}): ${questions[randomSuit][randomCard]}`;
        });
    }
}

// Obtenir une clé aléatoire d'un objet
function getRandomKey(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
}

