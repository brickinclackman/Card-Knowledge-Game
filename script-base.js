const questions = {
    "Hearts": ["Quel est ton meilleur souvenir d'enfance ?", "Quelle est ta plus grande peur ?", "..."],
    "Diamonds": ["Si tu pouvais apprendre une nouvelle compétence, laquelle ?", "..."],
    "Clubs": ["Où te vois-tu dans 5 ans ?", "..."],
    "Spades": ["Quel est le plus grand défi que tu as surmonté ?", "..."]
  };
  
  function drawCard() {
    const suits = Object.keys(questions);
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomQuestion = questions[randomSuit][Math.floor(Math.random() * questions[randomSuit].length)];
    document.getElementById("card-output").innerHTML = `
      <h3>${randomSuit}</h3>
      <p>${randomQuestion}</p>
    `;
  }
  