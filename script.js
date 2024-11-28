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

    // Exemple : afficher une question pour l'As de Hearts dans la console
    console.log('As de Hearts :', questions.Coeurs.As);

    // Exemple d'interaction dynamique
    const questionContainer = document.getElementById('question');
    const drawCardButton = document.getElementById('drawCard');
    const resetButton = document.getElementById('resetButton'); // Bouton de réinitialisation

    // Vérifier l'URL de la page
    const isHomePage = window.location.pathname.includes('index');
    const isPlayPage = window.location.pathname.includes('play');

    if (isHomePage) {
        const maxClicks = 5; // Limiter à 3 clics
        const customMessageBox = document.getElementById('customMessageBox');
        const closeMessageBox = document.getElementById('closeMessageBox');
        const messageText = document.getElementById('messageText');

        // Récupérer le nombre de clics précédents depuis localStorage
        let clickCount = parseInt(localStorage.getItem('clickCount')) || 0; 

        // Créer une liste des 5 cartes à tirer dans le mode démo
        const demoCards = [
            { suit: 'Coeurs', card: 'As' },
            { suit: 'Coeurs', card: 'Roi' },
            { suit: 'Carreaux', card: 'Dame' },
            { suit: 'Trèfle', card: 'Valet' },
            { suit: 'Piques', card: '10' }
        ];

        drawCardButton.addEventListener('click', () => {

            if (clickCount >= maxClicks) {
                // Afficher la boîte de message personnalisée
                customMessageBox.style.display = 'block';
                messageText.textContent = 'Vous avez atteint la limite de clics pour cette page.';
                drawCardButton.disabled = true; // Désactive le bouton après 5 clics
                return;
            }

            // Tirer une carte aléatoire parmi celles de la liste "demoCards"
            const randomCardIndex = Math.floor(Math.random() * demoCards.length);
            const randomCard = demoCards[randomCardIndex];

            // Affiche la question correspondante
            questionContainer.textContent = `Question (${randomCard.card} de ${randomCard.suit}): ${questions[randomCard.suit][randomCard.card]}`;
            clickCount++;

            // Sauvegarder le nouveau nombre de clics dans localStorage
            localStorage.setItem('clickCount', clickCount);

            // Optionnel : Retirer la carte de la liste après l'avoir utilisée pour ne pas la tirer à nouveau
            demoCards.splice(randomCardIndex, 1);
            if (demoCards.length === 0) {
                // Si toutes les cartes ont été tirées, vous pouvez désactiver le bouton ou afficher un message
                drawCardButton.disabled = true;
                questionContainer.textContent = 'Toutes les cartes ont été tirées !';
            }
        });

        // Fermer la boîte de message
        closeMessageBox.addEventListener('click', () => {
            customMessageBox.style.display = 'none';
        });

        // Réinitialiser le compteur de clics
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('clickCount'); // Réinitialise le compteur
            clickCount = 0; // Remettre le compteur à zéro
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

//L'utilisateur a changé de page par maladresse ?
// Réinitialiser le compteur de clics
//localStorage.removeItem('clickCount');