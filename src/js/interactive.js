/**
 * Composants Interactifs Globaux (Quiz & Copie)
 */
// 10. Fonctions interactives globales (Quizz & Copie)
    function revealQuiz(qNum, selectedOpt, isCorrect) {
      const explain = document.getElementById(`quizExplain${qNum}`);
      if (explain) explain.classList.add('visible');

      const slide = document.querySelector(`.slide[data-slide="5"]`);
      if (slide) {
        slide.querySelectorAll('.quiz-opt-btn').forEach(btn => {
          const badge = btn.querySelector('.opt-badge')?.textContent.trim();
          if (badge === selectedOpt) {
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
          }
        });
      }
    }

    function copyCommand(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Commande copiée dans le presse-papiers : ' + text);
      });
    }

window.revealQuiz = revealQuiz;
window.copyCommand = copyCommand;
