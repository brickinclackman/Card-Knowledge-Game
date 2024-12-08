let cards = []; // Variable globale pour stocker les cartes

// Charger le fichier JSON contenant les cartes
fetch("cards.json")
    .then(response => response.json())
    .then(data => {
        cards = data.cards; // Stocker toutes les cartes
        console.log("Cartes chargées !");
    })
    .catch(error => console.error("Erreur lors du chargement des cartes :", error));

// Charger le JSON en fonction du choix de l'utilisateur
function loadQuestions(theme) {
    return fetch(`${theme}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de chargement : ${response.status}`);
            }
            return response.json();
        })
        .catch(error => console.error('Erreur lors du chargement des données JSON :', error));
}

// Fonction pour demander l'âge avec SweetAlert2
function askAge() {
    return Swal.fire({
        title: 'Quel est ton âge ?',
        input: 'number', // Spécifie que l'input doit être un nombre
        inputAttributes: {
            min: 0,
            max: 120,
            step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Annuler',
        inputValidator: (value) => {
            if (!value) {
                return 'Tu dois entrer un âge!';
            }
            return null;
        }
    }).then(result => {
        if (result.isConfirmed) {
            return parseInt(result.value, 10); // Convertir en entier
        } else {
            return null; // Si l'utilisateur annule
        }
    });
}

// Fonction pour poser l'énigme avec SweetAlert2
function askRiddle() {
    return Swal.fire({
        title: 'Résous l\'énigme : Quel est le nombre qui est toujours une bonne réponse ?',
        input: 'text', // Spécifie que l'input est un texte
        showCancelButton: true,
        confirmButtonText: 'Vérifier',
        cancelButtonText: 'Annuler',
        inputValidator: (value) => {
            if (!value) {
                return 'Tu dois entrer une réponse!';
            }
            return null;
        }
    }).then(result => {
        if (result.isConfirmed) {
            return result.value.trim() === '42'; // Vérifier la réponse
        } else {
            return false; // Si l'utilisateur annule
        }
    });
}

// Fonction pour choisir les types de questions avec SweetAlert2
function chooseQuestionsBasedOnAgeAndRiddle(age, riddleSolved) {
    // Si l'utilisateur est majeur et a résolu l'énigme
    if (age >= 18 && riddleSolved) {
        return Swal.fire({
            title: 'Choisissez un type de questions',
            input: 'select',
            inputOptions: {
                'hot': 'Questions Chaudasses',
                'funny': 'Questions Ilarantes',
                'lambda': 'Questions Lambda'
            },
            inputPlaceholder: 'Choisissez une option...',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Annuler'
        }).then(result => {
            if (result.isConfirmed) {
                const choice = result.value;
                return loadQuestions(`questions_game_${choice}`);
            }
        });
    } 
    // Si l'utilisateur est majeur mais n'a pas résolu l'énigme
    else if (age >= 18 && !riddleSolved) {
        return Swal.fire('L\'énigme n\'a pas été résolue', 'Vous recevrez des questions lambda.', 'info')
            .then(() => loadQuestions('questions_game'));
    } 
    // Si l'utilisateur est mineur
    else {
        return Swal.fire('Vous êtes mineur', 'Vous recevrez des questions enfantines.', 'info')
            .then(() => loadQuestions('questions_game_kids'));
    }
}

// Fonction principale pour démarrer le jeu
async function startGame() {
    const age = await askAge(); // Demander l'âge
    if (age === null) return; // Si l'utilisateur annule, arrêter l'exécution

    const riddleSolved = await askRiddle(); // Demander l'énigme
    const questions = await chooseQuestionsBasedOnAgeAndRiddle(age, riddleSolved); // Charger les questions en fonction de l'âge et de la résolution de l'énigme
    
    // Initialiser le jeu avec les questions
    initializeGame(questions);
}

// Fonction pour initialiser le jeu avec les questions chargées
function initializeGame(questions) {
    if (questions) {
        // Code pour démarrer le jeu avec les questions
        console.log("Questions chargées", questions);
        
        // Cibler le bouton et le conteneur
        const drawCardButton = document.getElementById("drawCard");
        const cardContainer = document.getElementById("random-card");

        // Tu peux afficher les questions ou démarrer le jeu ici.

        const questionContainer = document.getElementById('question');

        // Aucun limite pour la page "play"
        drawCardButton.addEventListener('click', () => {
            if(Array.isArray(cards) && cards.length > 0){
                const randomSuit = getRandomKey(questions); // Couleur aléatoire
                const randomCard = getRandomKey(questions[randomSuit]); // Carte aléatoire

                console.log(randomSuit,randomCard);

                // Afficher la carte
                cardContainer.innerHTML = `
                    <img src="${randomCard.image}" alt="${randomCard.name}">
                `;
                // Affiche la question correspondante
                questionContainer.textContent = `Question (${randomCard} de ${randomSuit}): ${questions[randomSuit][randomCard]}`;
            } else {
                cardContainer.innerHTML = "<p>Les cartes ne sont pas encore chargées.</p>";
            }
            

            
        });
    }
}

// Obtenir une clé aléatoire d'un objet
function getRandomKey(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
}

// Appel de la fonction startGame pour démarrer le jeu
startGame();
