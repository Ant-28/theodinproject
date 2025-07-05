var items = ["rock", "paper", "scissors"];
let playcount = 0;
let humanScore = 0;
let computerScore = 0;
let drawScore = 0;
function getComputerChoice(){
    
    return items[Math.floor(Math.random()*3.0)]
}

function getHumanChoice(){
    let res = prompt("Choose rock, paper, or scissors").toLowerCase();
 
    while (!items.includes(res)){
        res = prompt("Incorrect answer. Choose rock, paper, or scissors").toLowerCase();
    }

    return res;
}
function playRound(humanChoice, computerChoice) {
    if( (humanChoice == 'rock' && computerChoice == 'scissors') || (humanChoice == 'scissors' && computerChoice == 'paper') || (humanChoice == 'paper' && computerChoice == 'rock') ){
        console.log("You Win!");
        humanScore++;
    }
    else 
    {
        if(humanChoice == computerChoice){
            console.log("draw");
            drawScore++;

    }
    else{
        console.log(`You lose, ${computerChoice} beats ${humanChoice}`)
        computerScore++;
    }
    playcount++;
    changeScore();
    if(playcount >= 5){
        resetGame(); // reset game and send message
    }

}
}
function changeScore(){
    const container = document.querySelector('div');
    container.textContent = `Win: ${humanScore}/${playcount}, Lost: ${computerScore}/${playcount}, Draw: ${drawScore}/${playcount}`;
    
}

function playGame(){
    for(i = 0; i < 5; i++){
        const humanChoice = getHumanChoice();
        const computerChoice = getComputerChoice();
        playRound(humanChoice, computerChoice); 
    }

    if(humanScore > computerScore){
        console.log("You win the game!");
    }
    else{
        console.log("You lost!");
    }
   
}


const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        playRound(button.id, getComputerChoice());
    })
})

function resetGame(){
    if(humanScore > computerScore){
        alert(`You Win!`);
    }
    else if(computerScore < humanScore){
        alert(`You Lose! You: ${humanScore}, Computer: ${computerScore}`);
    }
    else{
        alert(`How did you get a draw?`);
    }
    humanScore = 0;
    computerScore = 0;
    drawScore = 0;
    playcount = 0;
    changeScore();
}

