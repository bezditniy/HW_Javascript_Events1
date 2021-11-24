    
    // Класс, объекты которого описывают параметры гамбургера. 
    function Parameter (type, name, cost, calories) {
        this.getType = type;
        this.getName = name;
        this.getCost = cost;
        this.getCalories = calories;
    }

    // Клас, обьекты которого принимает выбранные параметры(размер и начинка)
    function Hamburger(size, stuffing) { 
        
        try {

            if (!size || !stuffing) {
                throw new HamburgerException("MissingError", "Invalid parameters entered");
            } else if (size.getType != "size" || stuffing.getType != "stuffing") {
                throw new HamburgerException("SyntaxError", "Invalid size or stuffing");
            }

            this.size = size;
            this.stuffing = stuffing;

        } catch(err) {
            alert(err.exceptName + ": " + err.exceptMessage);
        }        

    } 

    // Размеры, виды начинок и добавок
    Hamburger.SIZE_SMALL = new Parameter("size", "small", 50, 20);
    Hamburger.SIZE_LARGE = new Parameter("size", "large", 100, 40);
    Hamburger.STUFFING_CHEESE = new Parameter("stuffing", "cheese", 10, 20);
    Hamburger.STUFFING_SALAD = new Parameter("stuffing", "salad", 20, 5);
    Hamburger.STUFFING_POTATO = new Parameter("stuffing", "potato", 15, 10);
    Hamburger.TOPPING_MAYO = new Parameter("topping", "Mayo", 20, 5);
    Hamburger.TOPPING_SPICE = new Parameter("topping", "Spice", 15, 0);

    // Добавить добавку к гамбургеру. Можно добавить несколько добавок, при условии, что они разные.
    Hamburger.prototype.addTopping = function (topping) {
        
        try {

            if (!topping) {
                throw new HamburgerException("MissingError", "Invalid parameters entered");
            } else if (topping.added === true) {
                throw new HamburgerException("SyntaxError", `This value has already been entered, ${topping.getname}`);
            } else if (topping.getType != "topping"){
                throw new HamburgerException("ValueError", "Invalid value");
            }

            if (topping.getName == "Spice") {
                this.addSpice = topping;
                topping.added = true;
            } else if (topping.getName == "Mayo") {
                this.addMayo = topping;
                topping.added = true;
            }

            

        } catch(err) {
            alert(err.exceptName + ": " + err.exceptMessage)
        }

    }

    // Убрать добавку, при условии, что она ранее была добавлена.
    Hamburger.prototype.removeTopping = function (topping) {
        
        try {
            if (topping.added !== true) {
                throw new HamburgerException ("MissingError", "Invalid operation")
            }

            if(topping.getName == "Spice") {
                delete this.addSpice;
            } else if (topping.getName == "Mayo") {
                delete this.addSpice;
                }
            

        } catch(err) {   
            alert(err.exceptName + ": " + err.exceptMessage)
        }

    }


    // Получить список добавок.
    Hamburger.prototype.getToppings = function () {

            var toppingArr = [], i = 0;

            for(let item in this) {
                if (this[item].added === true) {
                   toppingArr[i] = this[item].getName;
                i++; 
                }
            }
                return toppingArr;

    }

    // Узнать размер гамбургера
    Hamburger.prototype.getSize = function () { return this.size }

    // Узнать начинку гамбургера
    Hamburger.prototype.getStuffing = function () { return this.stuffing.getName }

    // Узнать цену гамбургера
    Hamburger.prototype.calculatePrice = function () {

        let price = 0;
        let converter = "108₮"; // конвертирование в тугрики
        for(let item in this) {
            if (this[item].getCost) {
                price = this[item].getCost + price;
            }
        }
            return (price * converter.slice(0, 3));

    }

    // Узнать калорийность
    Hamburger.prototype.calculateCalories = function () {

        let calories = 0
        for(let item in this) {
            if (this[item].getCalories) {
                calories = this[item].getCalories + calories;
            }
        }
            return calories;

    }


    // Представляет информацию об ошибке в ходе работы с гамбургером. 
    // Подробности хранятся в свойстве message.
    function HamburgerException (name, message) { 
        
        this.exceptName = name;
        this.exceptMessage = message;

    }

    // маленький гамбургер с начинкой из сыра
    var hamburger = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
    // добавка из майонеза
    hamburger.addTopping(Hamburger.TOPPING_MAYO);
    // спросим сколько там калорий
    console.log("Calories: %f", hamburger.calculateCalories());
    // сколько стоит
    console.log("Price: %f₮", hamburger.calculatePrice());
    // я тут передумал и решил добавить еще приправу
    hamburger.addTopping(Hamburger.TOPPING_SPICE);
    // А сколько теперь стоит? 
    console.log("Price with sauce: %f₮", hamburger.calculatePrice());
    // Проверить, большой ли гамбургер? 
    console.log("Is hamburger large: %s", hamburger.getSize() === Hamburger.SIZE_SMALL); // -> false
    // Узнать, какая сейчас начинка?
    console.log("Stuffing is: %s", hamburger.getStuffing());
    // Убрать добавку
    hamburger.removeTopping(Hamburger.TOPPING_SPICE);
    console.log("Have %d toppings", hamburger.getToppings().length); // 1

    // не передали обязательные параметры
    //var h2 = new Hamburger(); // => HamburgerException: no size given
            
    // передаем некорректные значения, добавку вместо размера
    //var h3 = new Hamburger(Hamburger.TOPPING_SPICE, Hamburger.TOPPING_SPICE); 
    // => HamburgerException: invalid size 'TOPPING_SAUCE'
    
    // добавляем много добавок
    //var h4 = new Hamburger(Hamburger.SIZE_SMALL, Hamburger.STUFFING_CHEESE);
    //hamburger.addTopping(Hamburger.TOPPING_MAYO);
    //hamburger.addTopping(Hamburger.TOPPING_MAYO);
    // HamburgerException: duplicate topping 'TOPPING_MAYO'