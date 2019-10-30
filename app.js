// BUDGET CONTROLLER
var budgetController = 
(function () {

    //some code

})();

// UI CONTROLLER
var UIController = ( 
    function () {
        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn'
        };
        
        return {
            getInput: function () {
                return {
                    type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: document.querySelector(DOMstrings.inputValue).value
                }
            },

            getDOMstrings: function () {
                return DOMstrings;
            }
        };
    }
)();


// GLOBAL APP CONTROLLER
var controller = (
    function (budgetCtrl, UICtrl) {

        var setupEventListeners = function () {

            var DOM = UICtrl.getDOMstrings();

            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

            // handles event for return key being pressed.
            document.addEventListener('keypress', function (event) {
                // the event can be named anything, this basically returned a lot of properties with data related to the keypress.
                // this is what we will use to know which key was pressed, so we can listen for the enter/return key being pressed.
                // keycode property is what defines which key was pressed
                // check jonas reference page, it has all the keycodes.
    
                if (event.keyCode === 13 || event.which === 13) {
                    //add ctrlAddItem  here
                    ctrlAddItem();
                }
    
            });
    
        };

        var ctrlAddItem = function () {
            // old browsers use .which to tell us what key was pressed.
            // to do list
            // 1. get input data from field.
            var input = UIController.getInput();
            // 2. add item to budget controller.
            // 3. add the new item to user interface.
            // 4. calculate the buddget.
            // 5. display the budget.

        }

        return {
            init: function() {
                setupEventListeners();
            }
        }
    }

    // adding init function to do the work at the start of our application


    //pass the budgetController, UI controller into the IIFE.
)(budgetController, UIController);

// w/o this line of code, nothing will ever happen. need eventListeners.
controller.init();