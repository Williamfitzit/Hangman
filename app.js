window.onload = function () {

    // Array of alphabet letters
    var alphabetLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i',
          'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
          'z', 'x', 'c', 'v', 'b', 'n', 'm'];

    // GLOBAL VARIABLES

    var selectedCategory;     // Category from API
    var selectedWord ;        // Word from API
    var userGuess ;           // Guess input by user
    var guessedLetters = [ ]; // All user guesses
    var remainingLives ;      // Number of attempts left
    var correctGuessCount ;   // Count of correct guesses
    var spaceCount;           // Number of spaces in word '-'
    var numSyllables;
    var correctList;
    var alphabetList;
  
    // Get elements from the HTML
    var livesDisplay = document.getElementById("remainingLives");
    var clueDisplay = document.getElementById("clueDisplay");
  
    // Create alphabet ul with buttons
    var generateAlphabetButtons = function () {
      var buttonsContainer = document.getElementById('buttonsContainer');
      alphabetList = document.createElement('ul');
  
      for (var i = 0; i < alphabetLetters.length; i++) {
        alphabetList.id = 'alphabet';
        var listItem = document.createElement('li');
        listItem.id = 'letter';
        listItem.innerHTML = alphabetLetters[i];
        setupLetterClickHandler(listItem);
        buttonsContainer.appendChild(alphabetList);
        alphabetList.appendChild(listItem);
      }
    }
      
    // Display selected category
    var showSelectedCategory = function (category) {
        catagoryName.innerHTML = `The Chosen Category Is ${category}`;
    }
  
    // Create the placeholders for the word's letters
    var displayWordPlaceholders = function (word) {
      var wordHolder = document.getElementById('wordDisplay');
      correctList = document.createElement('ul');
  
      for (var i = 0; i < word.length; i++) {
        correctList.setAttribute('id', 'my-word');
        var guessListItem = document.createElement('li');
        guessListItem.setAttribute('class', 'guess');
        if (word[i] === "-") {
          guessListItem.innerHTML = "-";
          spaceCount = 1;
        } else {
          guessListItem.innerHTML = "_";
        }
  
        guessedLetters.push(guessListItem);
        wordHolder.appendChild(correctList);
        correctList.appendChild(guessListItem);
      }
    }
    
    // Show remaining lives and game status
    var displayGameStatus = function () {
      livesDisplay.innerHTML = "You have " + remainingLives + " lives";
      if (remainingLives < 1) {
        livesDisplay.innerHTML = "Game Over";
      }
      for (var i = 0; i < guessedLetters.length; i++) {
        if (correctGuessCount + spaceCount === guessedLetters.length) {
          livesDisplay.innerHTML = "You Win!";
        }
      }
    }
  
    // Animate the hangman figure
    var animateHangman = function () {
      var drawMe = remainingLives ;
      drawArray[drawMe]();
    }
  
    // Set up the canvas for the hangman figure
    var setupHangmanCanvas =  function(){
      myStickman = document.getElementById("stickman");
      context = myStickman.getContext('2d');
      context.beginPath();
      context.strokeStyle = "#fff";
      context.lineWidth = 2;
    };
    
    // Draw the hangman's head
    var drawHead = function(){
        myStickman = document.getElementById("stickman");
        context = myStickman.getContext('2d');
        context.beginPath();
        context.arc(60, 25, 10, 0, Math.PI*2, true);
        context.stroke();
    }
      
    // Draw lines between two points
    var drawLine = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
      context.moveTo($pathFromx, $pathFromy);
      context.lineTo($pathTox, $pathToy);
      context.stroke(); 
    }
  
    // Individual frames of the hangman figure
    var drawFrame1 = function() {
      drawLine(0, 150, 150, 150);
    };
     
    var drawFrame2 = function() {
      drawLine(10, 0, 10, 600);
    };
    
    var drawFrame3 = function() {
      drawLine(0, 5, 70, 5);
    };
    
    var drawFrame4 = function() {
      drawLine(60, 5, 60, 15);
    };
    
    var drawTorso = function() {
      drawLine(60, 36, 60, 70);
    };
    
    var drawRightArm = function() {
      drawLine(60, 46, 100, 50);
    };
    
    var drawLeftArm = function() {
      drawLine(60, 46, 20, 50);
    };
    
    var drawRightLeg = function() {
      drawLine(60, 70, 100, 100);
    };
    
    var drawLeftLeg = function() {
      drawLine(60, 70, 20, 100);
    };
    
    // Array of functions for hangman animation
    var drawArray = [drawRightLeg, drawLeftLeg, drawRightArm, drawLeftArm,  drawTorso, drawHead, drawFrame4, drawFrame3, drawFrame2, drawFrame1]; 
  
    // OnClick Function for guessing letters
     var setupLetterClickHandler = function (listItem) {
      listItem.onclick = function () {
        var guessedLetter = (this.innerHTML);
        this.setAttribute("class", "active");
        this.onclick = null;
        for (var i = 0; i < selectedWord.length; i++) {
          if (selectedWord[i] === guessedLetter) {
            guessedLetters[i].innerHTML = guessedLetter;
            correctGuessCount += 1;
          } 
        }
        var j = (selectedWord.indexOf(guessedLetter));
        if (j === -1) {
          remainingLives -= 1;
          displayGameStatus();
          animateHangman();
        } else {
          displayGameStatus();
        }
      }
    }
    
    // Play the game
    async function fetchRandomWord(){
        const response = await fetch("https://www.wordgamedb.com/api/v1/words/random");
        const wordObj = await response.json();
        return wordObj;
    }

    var playGame = async function () {
      
      selectedWord = await fetchRandomWord();
      numSyllables = selectedWord.numSyllables;
      selectedCategory = selectedWord.category;
      selectedWord = selectedWord.word;
      selectedWord = selectedWord.replace(/\s/g, "-");
      
      console.log(selectedWord);
      generateAlphabetButtons();
  
      guessedLetters = [ ];
      remainingLives = 10;
      correctGuessCount = 0;
      spaceCount = 0;
      displayWordPlaceholders(selectedWord);
      displayGameStatus();
      showSelectedCategory(selectedCategory);
      setupHangmanCanvas();
    }
  
    playGame();
    
    // Hint Button
    hintButton.onclick = function() {
      clueDisplay.innerHTML = `Clue: - Number of Syllables - ${numSyllables}`;
    };
  
    // Reset Button
    resetButton.onclick = function() {
    correctList.parentNode.removeChild(correctList);
      alphabetList.parentNode.removeChild(alphabetList);
      clueDisplay.innerHTML = "";
      context.clearRect(0, 0, 400, 400);
      playGame();
    }
}

