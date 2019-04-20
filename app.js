
//A closure is a function having access to the parent scope, even after the parent function has closed.

// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome)  * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        }, 

        deleteItem: function(type, id) {
            var ids, index;
            // id = 3
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            
            // calculate sum of all income
            // calculate expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate expense percentage
            // expense 100 and income 200, spent 50% 
            if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages:function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });

            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function() {
            console.log(data);
        }
    }

})();


// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescrption: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage"

    };

    var formatNumber = function(num, type) {
        /*
             + or i before inc or exp
             2 decimal places
             comm seperating the thousands

        */
       var numSplit;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, 3) // input 2310, output 2,310
        }

        return (type === 'exp' ? '-': '+') + ' ' + int + '.' + dec;
        
        
        
    };
    // some code
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescrption).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHTML, element;
            // create HTML string with placeholder text
            if (type === "inc") {
               //income
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            
            } else if (type === "exp") {
            //expense
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));
            
            // insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend",newHTML);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescrption + ', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            // code here
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            console.log(fields);
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0 ) {
                    current.textContent = percentages[index] + '%'; 
                } else {
                    current.textContent = '---'; 
                }
            });

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        }); 

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        var budget;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        budget = budgetCtrl.getBudget();
        // 5. Display the budget on the UI
        console.log(budget);
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem;      
        // 1. Get Field input data
        input = UICtrl.getInput();
        // console.log(input);
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //console.log("Input Type", input.type);
            // 3. add the item to the UI
            
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // inc-0
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete Item from the data Structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete Item from User interface
            UICtrl.deleteListItem(itemID);
            // 3. Update Budget
            updateBudget();

            // 4. Update Percentages
            updatePercentages();

        }
    };

    return {
        init: function() {
            setupEventListeners();
            updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            //console.log("Application has started.");
        }
    }
    
})(budgetController, UIController);

controller.init();