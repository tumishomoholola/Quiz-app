document.addEventListener("DOMContentLoaded", function(){

    // --- SETUP ---
    let games = ["quiz","rps","coin","number","memory"];
    let gameScores = {quiz:0,rps:0,coin:0,number:0,memory:0};
    let currentGameIndex = 0;

    // Shuffle games randomly
    games = games.sort(()=>Math.random()-0.5);

    // Quiz Questions
    let quizQuestions = [
        {question:"Which language is used for styling web pages?", options:["HTML","CSS","JS","Python"], answer:"CSS"},
        {question:"What does JS stand for?", options:["JavaScript","JavaSuper","JSON","JustScript"], answer:"JavaScript"},
        {question:"Which database is relational?", options:["MongoDB","MySQL","Firebase","Redis"], answer:"MySQL"},
        {question:"Which tag defines a paragraph?", options:["<p>","<div>","<span>","<section>"], answer:"<p>"},
        {question:"Which company developed Java?", options:["Sun Microsystems","Apple","Microsoft","Google"], answer:"Sun Microsystems"},
        {question:"What is the symbol for ID selector in CSS?", options:["#","." ,"$","@"], answer:"#"},
        {question:"Which is NOT a JavaScript framework?", options:["React","Vue","Python","Angular"], answer:"Python"},
        {question:"HTML stands for?", options:["Hyper Text Markup Language","High Text Markup Language","Hyperlinks Text Mark Language","Hyper Tool Multi Language"], answer:"Hyper Text Markup Language"},
        {question:"Which operator is for equality in JS?", options:["==","=","===","!"], answer:"==="},
        {question:"JS is a ___ language?", options:["Server-side","Client-side","Both","None"], answer:"Both"}
    ];

    // --- HELPER FUNCTIONS ---
    function showScreen(id){
        document.querySelectorAll(".screen").forEach(s=>s.classList.remove("show"));
        document.getElementById(id).classList.add("show");
    }

    function nextGame(){
        currentGameIndex++;
        if(currentGameIndex < games.length) loadGame(games[currentGameIndex]);
        else showWinner();
    }

    function loadGame(game){
        switch(game){
            case "quiz": startQuiz(); break;
            case "rps": startRPS(); break;
            case "coin": startCoin(); break;
            case "number": startNumberGuess(); break;
            case "memory": startMemory(); break;
        }
    }

    // --- START GAME ---
    document.getElementById("startBtn").addEventListener("click", function(){
        currentGameIndex = 0;
        gameScores = {quiz:0,rps:0,coin:0,number:0,memory:0};
        showScreen("quiz-screen");
        loadGame(games[currentGameIndex]);
    });

    // ---------------- QUIZ ----------------
    let quizCurrent = 0, quizScore=0;
    function startQuiz(){
        showScreen("quiz-screen");
        quizCurrent=0; quizScore=0;
        loadQuizQuestion();
    }

    function loadQuizQuestion(){
        const q = quizQuestions[Math.floor(Math.random()*quizQuestions.length)];
        document.getElementById("quiz-question").innerText = q.question;
        const optionsEl = document.getElementById("quiz-options");
        optionsEl.innerHTML = "";
        q.options.forEach(opt=>{
            let btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.innerText = opt;
            btn.onclick = ()=>{
                if(opt===q.answer) quizScore++;
                quizCurrent++;
                if(quizCurrent<5) loadQuizQuestion();
                else { gameScores.quiz=quizScore; nextGame(); }
            }
            optionsEl.appendChild(btn);
        });
        document.getElementById("quiz-progress-inner").style.width = `${(quizCurrent/5)*100}%`;
    }

    // ---------------- ROCK PAPER SCISSORS ----------------
    function startRPS(){
        showScreen("rps-screen");
        document.getElementById("rps-result").innerText="";
        document.querySelectorAll(".rps-btn").forEach(btn=>{
            btn.onclick = ()=>{
                const player = btn.dataset.choice;
                const comp = ["Rock","Paper","Scissors"][Math.floor(Math.random()*3)];
                let result="";
                if(player===comp) result="Draw!";
                else if((player==="Rock" && comp==="Scissors")||(player==="Paper" && comp==="Rock")||(player==="Scissors" && comp==="Paper")) result="You Win!";
                else result="You Lose!";
                if(result==="You Win!") gameScores.rps++;
                document.getElementById("rps-result").innerText=`You chose ${player}, Computer chose ${comp}. ${result}`;
            }
        });
        document.getElementById("rps-next").onclick = ()=>nextGame();
    }

    // ---------------- COIN TOSS ----------------
    function startCoin(){
        showScreen("coin-screen");
        document.getElementById("coin-result").innerText="";
        document.querySelectorAll(".coin-btn").forEach(btn=>{
            btn.onclick = ()=>{
                const player = btn.dataset.choice;
                const coin = Math.random()<0.5?"Heads":"Tails";
                const result = player===coin?"You Win!":"You Lose!";
                if(result==="You Win!") gameScores.coin++;
                document.getElementById("coin-result").innerText=`You picked ${player}, coin shows ${coin}. ${result}`;
            }
        });
        document.getElementById("coin-next").onclick = ()=>nextGame();
    }

    // ---------------- NUMBER GUESS ----------------
    function startNumberGuess(){
        showScreen("number-screen");
        document.getElementById("guess-result").innerText="";
        const input = document.getElementById("guess-input");
        input.value="";
        document.getElementById("guess-btn").onclick = ()=>{
            const guess = Number(input.value);
            const number = Math.floor(Math.random()*10)+1;
            if(guess===number){ gameScores.number++; document.getElementById("guess-result").innerText=`Correct! The number was ${number}. You win!`; }
            else document.getElementById("guess-result").innerText=`Wrong! The number was ${number}.`;
        }
        document.getElementById("guess-next").onclick = ()=>nextGame();
    }

    // ---------------- MEMORY GAME ----------------
    function startMemory(){
        showScreen("memory-screen");
        const grid = document.getElementById("memory-grid");
        const resultEl = document.getElementById("memory-result");
        grid.innerHTML="";
        resultEl.innerText="";
        const numbers = [1,2,3,4,5,6];
        const shuffled = numbers.sort(()=>Math.random()-0.5);
        shuffled.forEach(n=>{
            let btn = document.createElement("button");
            btn.classList.add("custom-btn");
            btn.innerText=n;
            btn.onclick = ()=>{ 
                if(n===Math.min(...shuffled)) { gameScores.memory++; resultEl.innerText="Good Job!"; } 
                else { resultEl.innerText="Try Again!"; } 
            };
            grid.appendChild(btn);
        });
        document.getElementById("memory-next").onclick = ()=>nextGame();
    }

    // ---------------- WINNER SCREEN ----------------
    function showWinner(){
        showScreen("winner-screen");
        const total = Object.values(gameScores).reduce((a,b)=>a+b,0);
        document.getElementById("final-score").innerText=`Your Total Score: ${total} 🎉`;
    }

    // ---------------- WINNER BUTTONS ----------------
    document.getElementById("play-again").onclick = ()=>{
        currentGameIndex=0; gameScores={quiz:0,rps:0,coin:0,number:0,memory:0};
        showScreen("landing-screen");
    };
    document.getElementById("back-portfolio").onclick = ()=>{
        window.location.href="../index.html"; // Adjust path to your portfolio
    };
});
