(function () {
    window.addEventListener("DOMContentLoaded", function () {
        //iniciar el juego
        const startButton = document.getElementById("startButton");
        const instructionsModal = document.getElementById("instructionsModal");

        startButton.addEventListener("click", () => {
            instructionsModal.style.display = "none";
        });

        //Aumentar el contador de regalos colocados
        window.incrementarRegalosColocados = function() {
            if (typeof window.regalosColocados === 'undefined') {
                window.regalosColocados = 0;
            }
            window.regalosColocados++;
            const hudCounter = document.getElementById("hudCounter");
            hudCounter.textContent = `${window.regalosColocados} / 5`;
            //notificación de juego terminado
            if (window.regalosColocados >= 5) {
                alert("¡Has colocado todos los regalos! Juego terminado.");
                //reiniciar el juego
                window.location.reload();
            }
        };


    });
})();