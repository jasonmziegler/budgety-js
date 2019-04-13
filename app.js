
//A closure is a function having access to the parent scope, even after the parent function has closed.

// BUDGET CONTROLLER
var budgetController = (function() {

    // some code

})();


// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescrption: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn"
    };
    // some code
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescrption).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    var DOM = UIController.getDOMstrings();
    var ctrlAddItem = function() {
        
        // 1. Get Field input data
        var input = UICtrl.getInput();
        // 2. Add the item to the budget controller

        // 3. add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

        console.log(input);
    }
    document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
    
})(budgetController, UIController);