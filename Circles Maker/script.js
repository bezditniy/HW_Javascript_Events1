window.onload = () => {

    class DrawCircles {
        constructor() {
            this.container = document.querySelector(".container");
            this.btn = document.querySelector(".btn");

            let that = this;
            this.manageButtons = function(btnAction, btnInput) {
                that.btn.addEventListener("click", function() {
                    that.btn.remove();

                    that.container.append(btnAction);
                    that.container.append(btnInput);
                });
            }

            this.makeCircles = function(btnAction, btnInput) {

                btnAction.addEventListener("click", function() {
                    let sizeCircles = btnInput.value + "px";

                    btnAction.remove();
                    btnInput.remove();

                    var i = 100;
                    while(i != 0){
                        let setCircle = document.createElement("div");
                        setCircle.setAttribute("class", "circle");
                        setCircle.style = "background-color: " + '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase()
                        setCircle.style.width = sizeCircles;
                        setCircle.style.height = sizeCircles;
                        that.container.append(setCircle);
                        i--;
                    }

                    that.container.addEventListener("click", function(event) {
                        if(event.target.classList.contains("circle")) {
                            event.target.remove();
                        } 
                    });
                }); 
            }                
        }
    }

    let btnAction = document.createElement("input");
        btnAction.setAttribute("type", "button");
        btnAction.setAttribute("id", "btnAction");
        btnAction.setAttribute("value", "Draw");


    let btnInput = document.createElement("input");
        btnInput.setAttribute("type", "input");
        btnInput.setAttribute("id", "btnInput");
        btnInput.setAttribute("value", "");
        btnInput.setAttribute("placeholder", "Enter any number");

    let show = new DrawCircles;
    show.manageButtons(btnAction, btnInput);
    show.makeCircles(btnAction, btnInput);

}