const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("gameMode");

let board = ["","","","","","","","",""];
let currentPlayer="X";
let gameActive=true;
let gameMode="pvp";

modeSelect.addEventListener("change",()=>{
    gameMode=modeSelect.value;
    resetGame();
});

const winningCombinations=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell=>{
    cell.addEventListener("click",handleClick);
});

function handleClick(){

    const index=this.dataset.index;

    if(board[index]!="" || !gameActive)
        return;

    makeMove(index,currentPlayer);

    if(checkWinner())
        return;

    if(gameMode==="ai" && currentPlayer==="O"){
        setTimeout(computerMove,500);
    }
}

function makeMove(index,player){

    board[index]=player;

    cells[index].textContent=player;

    currentPlayer=player==="X"?"O":"X";

    statusText.textContent=`Player ${currentPlayer}'s Turn`;
}

function computerMove(){

    if(!gameActive)
        return;

    let move=findBestMove();

    makeMove(move,"O");

    checkWinner();
}

function findBestMove(){

    // Win
    for(let combo of winningCombinations){

        let [a,b,c]=combo;

        let line=[board[a],board[b],board[c]];

        if(line.filter(x=>x==="O").length===2 &&
           line.includes("")){
            return combo[line.indexOf("")];
        }
    }

    // Block
    for(let combo of winningCombinations){

        let [a,b,c]=combo;

        let line=[board[a],board[b],board[c]];

        if(line.filter(x=>x==="X").length===2 &&
           line.includes("")){
            return combo[line.indexOf("")];
        }
    }

    // Center
    if(board[4]=="")
        return 4;

    // Corners
    const corners=[0,2,6,8].filter(i=>board[i]=="");
    if(corners.length)
        return corners[Math.floor(Math.random()*corners.length)];

    // Remaining
    const remaining=[];

    board.forEach((v,i)=>{
        if(v=="")
            remaining.push(i);
    });

    return remaining[Math.floor(Math.random()*remaining.length)];
}

function checkWinner(){

    for(let combo of winningCombinations){

        let[a,b,c]=combo;

        if(board[a] &&
           board[a]==board[b] &&
           board[a]==board[c]){

            statusText.textContent=`🎉 Player ${board[a]} Wins!`;

            gameActive=false;

            return true;
        }
    }

    if(!board.includes("")){

        statusText.textContent="🤝 It's a Draw!";

        gameActive=false;

        return true;
    }

    return false;
}

function resetGame(){

    board=["","","","","","","","",""];

    currentPlayer="X";

    gameActive=true;

    statusText.textContent="Player X's Turn";

    cells.forEach(cell=>cell.textContent="");
}

resetBtn.addEventListener("click",resetGame);