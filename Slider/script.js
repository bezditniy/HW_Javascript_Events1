window.onload = () => {

    let index = 1;    

    class Slider {
        constructor() {
            this.box = document.querySelector(".sliderBox");
            this.sliderBox = document.querySelector(".slider");
            this.slides = document.querySelectorAll(".slide");
            this.btns = document.querySelectorAll(".btn");
            this.size = this.box.clientWidth;
        
            this.position();
            this.carousel();
            this.jump();
        }
    }
    
    Slider.prototype.position = function() {

        this.sliderBox.style.transform = "translateX(" + (-index * this.size) + "px)";
    }

    Slider.prototype.carousel = function() {

        let max = this.btns.length;

        for (let i = 0; i < max; i++) {
            this.btns[i].addEventListener("click", Slider[this.btns[i].id].bind(null, this));
        }
    }

    Slider.btnNext = function(box) {
        box.sliderBox.style.transition = "transform .3s ease-in-out";
        let max = box.slides.length;
        let size = box.size;
        index >= max - 1 ? false : index++;
        box.sliderBox.style.transform = "translateX(" + (-index * size) + "px)";
    }

    Slider.btnPrev = function(box) {
        box.sliderBox.style.transition = "transform .3s ease-in-out";
        let size = box.size;
        index <= 0 ? false : index--;
        box.sliderBox.style.transform = "translateX(" + (-index * size) + "px)";
    }

    Slider.prototype.jump = function () {
        let that = this;
            that.sliderBox.addEventListener("transitionend", function() {
                that.slides[index].id == "firstClone" ? index = 1 : index;
                that.slides[index].id == "lastClone" ? index = that.slides.length - 2 : index;
                that.sliderBox.style.transition = "none";
                that.sliderBox.style.transform = "translateX(" + (-index * that.size) + "px)";
                });
    }

    new Slider;
}