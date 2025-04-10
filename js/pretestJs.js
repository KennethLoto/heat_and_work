document.getElementById("submitQuiz").addEventListener("click", function () {
  // Reset all validation messages
  document.querySelectorAll(".validation-message").forEach((el) => {
    el.style.display = "none";
  });
  document.getElementById("globalError").style.display = "none";

  let firstUnanswered = null;
  let allValid = true;

  // Check if all questions are answered
  for (let i = 1; i <= 15; i++) {
    const questionName = "q" + i;
    const selectedOption = document.querySelector(
      `input[name="${questionName}"]:checked`
    );
    const validationMsg = document
      .querySelector(`input[name="${questionName}"]`)
      .closest(".quiz-content")
      .querySelector(".validation-message");

    if (!selectedOption) {
      validationMsg.style.display = "block";
      validationMsg.textContent = "Please select an answer";
      allValid = false;

      if (!firstUnanswered) {
        firstUnanswered = validationMsg;
      }
    }
  }

  if (!allValid) {
    document.getElementById("globalError").style.display = "block";

    if (firstUnanswered) {
      firstUnanswered.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    return; // Stop here if form is invalid
  }

  // Only proceed to check answers if all questions are answered
  checkAnswers();
});

function checkAnswers() {
  // Correct answers
  const correctAnswers = {
    q1: "c",
    q2: "c",
    q3: "a",
    q4: "b",
    q5: "d",
    q6: "c",
    q7: "c",
    q8: "c",
    q9: "b",
    q10: "b",
    q11: "a",
    q12: "d",
    q13: "b",
    q14: "a",
    q15: "a",
  };

  let score = 0;

  // Process each question
  for (let i = 1; i <= 15; i++) {
    const questionName = "q" + i;
    const selectedOption = document.querySelector(
      `input[name="${questionName}"]:checked`
    );
    const correctOptionValue = correctAnswers[questionName];

    // Check if answer is correct
    if (selectedOption && selectedOption.value === correctOptionValue) {
      score++;
    }

    // Highlight all options for this question
    const allOptions = document.querySelectorAll(
      `input[name="${questionName}"]`
    );
    allOptions.forEach((option) => {
      const label = option.parentElement;

      // Reset previous highlighting
      label.classList.remove("correct-answer", "incorrect-answer");

      // If this is the correct answer, highlight it in green
      if (option.value === correctOptionValue) {
        label.classList.add("correct-answer");
      }

      // If this was selected but is wrong, highlight it in red
      if (
        selectedOption &&
        option.value === selectedOption.value &&
        option.value !== correctOptionValue
      ) {
        label.classList.add("incorrect-answer");
      }
    });
  }

  // Get modal elements
  const modal = document.getElementById("scoreModal");
  const modalScore = document.getElementById("modalScore");
  const modalPercent = document.getElementById("modalPercent");
  const scoreMessage = document.getElementById("scoreMessage");

  // Set score values
  modalScore.textContent = score;
  const percentage = Math.round((score / 15) * 100);
  modalPercent.textContent = percentage;

  // Set custom message based on score
  if (score === 15) {
    scoreMessage.textContent = "Perfect! You're a quiz master! 🎉";
    scoreMessage.style.color = "#27ae60";
    scoreMessage.style.backgroundColor = "#e8f5e9";
  } else if (score >= 10) {
    scoreMessage.textContent = "Great job! You know your stuff! 👍";
    scoreMessage.style.color = "#f39c12";
    scoreMessage.style.backgroundColor = "#fff8e1";
  } else {
    scoreMessage.textContent = "Keep practicing! You'll get better! 💪";
    scoreMessage.style.color = "#e74c3c";
    scoreMessage.style.backgroundColor = "#ffebee";
  }

  // Show modal
  modal.style.display = "block";

  // Close modal when clicking X
  document.querySelector(".close").onclick = function () {
    modal.style.display = "none";
  };

  // Close modal when clicking outside
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Clear validation when an option is selected
document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const validationMsg = this.closest(".quiz-content").querySelector(
      ".validation-message"
    );
    validationMsg.style.display = "none";
    document.getElementById("globalError").style.display = "none";
  });
});
