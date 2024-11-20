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
    console.log('As de Hearts :', questions.Hearts.As);

    // Exemple d'interaction dynamique
    const questionContainer = document.getElementById('question');
    const drawCardButton = document.getElementById('drawCard');

    drawCardButton.addEventListener('click', () => {
        const randomSuit = getRandomKey(questions); // Couleur aléatoire
        const randomCard = getRandomKey(questions[randomSuit]); // Carte aléatoire

        // Affiche la question correspondante
        questionContainer.textContent = `Question (${randomSuit} ${randomCard}): ${questions[randomSuit][randomCard]}`;

        document.getElementById("card-output").innerHTML = `
        <h3>${randomSuit}${randomCard}</h3>
        <p>${questions[randomSuit][randomCard]}</p>
      `;
    });
}

// Obtenir une clé aléatoire d'un objet
function getRandomKey(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
}
