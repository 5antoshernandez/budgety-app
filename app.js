// BUDGET CONTROLLER
var budgetController = 
(function () {
    //keeps track of all the budget
    //expenses & income
    //will add percentages down the line too.

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //handy little data structure to manage our data. love objects!
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
    };

    var calculateTotal = function(type) {
        var sum;
        sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, desc, val) {
            var newItem, ID, arrLen;

            // Create new ID.
            if (data.allItems[type].length > 0) {
                arrLen = data.allItems[type].length - 1;
                ID = data.allItems[type][arrLen].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type.
            if (type === "exp") {
                newItem = new Expense(ID, desc, val);
            } else if (type === "inc") {
                newItem = new Income(ID, desc, val);
            } 
            
            // push to data structure
            //this demonstrates the flexibility of having god like naming conventions.
            data.allItems[type].push(newItem)

            // return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            // looping over an object and returning the information we need, the ids.
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            // getting the index of the element we want to remove.
            index = ids.indexOf(id);

            // if the index exists, delete it.
            if (index != -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percent of income that we spent
            if (data.totals.inc > 0 ) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        getPercentages: function() {
            var allPercentages;
            allPercentages = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPercentages;
        }
    };


})();

// UI CONTROLLER
var UIController = ( 
    function () {
        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            incomeLabel: '.budget__income--value',
            expenseLabel:'.budget__expenses--value',
            budgetLabel: '.budget__value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
            expensesPercentageLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
        };


    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
        */
        // convert to absolute value.
        num = Math.abs(num);
        // add or round to 2 decimal places.
        // returns a string
        num = num.toFixed(2);
        // need to add , if in thousands, can do this by splitting the string and using a len property
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            //substring allows us return part of a string
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }     

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i<list.length; i++) {
            // this calls the callback function, which is what is needed  in order to use the 
            // nodeforeach function as these are the parameters.
            callback(list[i], i);
        }
    };
        
        return {
            getInput: function () {
                return {
                    type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                }
            },

            addListItem: function(obj, type) {
                var html, newHtml, element;
                // create HTML string with placeholder text
                if (type === 'inc') {
                    element = DOMstrings.incomeContainer;
                    html = `
                    <div class="item clearfix" id="inc-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">+ ${formatNumber(obj.value, type)}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                } else {
                    element = DOMstrings.expensesContainer;
                    html = `
                    <div class="item clearfix" id="exp-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">- ${formatNumber(obj.value, type)}</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                }

                // replace placeholder text w/ actual data.
                //// we used the direct sub, so we don't have to do this but good to know:
                /*
                    newHtml = html.replace("%id%", obj.id);
                    newHtml = newHtml.replace("%description%", obj.description);
                    newHtml = newHtml.replace("%value", obj.value);
                */

                // insert the html into the DOM.
                document.querySelector(element).insertAdjacentHTML('beforeend', html);
            },
            
            deleteListItem: function(selectorId) {
                var el = document.getElementById(selectorId);
                el.parentNode.removeChild(el);
            }, 

            getDOMstrings: function () {
                return DOMstrings;
            },

            clearFields: function() {
                var fields, fieldsArray;
                fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
                // this returns a list, not an array. they're similar, however, list don't contain all the useful methods that arrays do
                // nice trick to fix that up:
                // can use slice, which returns a copy of an array
                fieldsArray = Array.prototype.slice.call(fields);

                // ForEach method to loop over all the items in the array.
                // Can have access to 3 things into the function
                // currentValue of item being processed, index number, the entire array.
                fieldsArray.forEach(function(cur, i, array) {
                    cur.value = "";
                });
                
                //set focus on first element of the array.
                fieldsArray[0].focus();
            },

            displayBudget: function(obj) {
                var type;
                obj.budget > 0 ? type = 'inc' : type = 'exp';
                document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
                if (obj.percentage > 0) {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }
            },

            displayPercentages: function(percentages) {

                var fields, nodeListForEach;
                // this is a nodeList
                // dom tree each element is referred to as a node.
                // this is why moving up the DOM is called parentNode
                fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

                nodeListForEach(fields, function(current, index) {
                    if (percentages[index] > 0) {
                        current.textContent = percentages[index] + "%";
                    } else {
                        current.textContent = "---";
                    }
                });

            },

            displayMonth: function() {
                var now, year, month, months;
                now = new Date();
                months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                month = now.getMonth();
                year = now.getFullYear();
                document.querySelector(DOMstrings.dateLabel).textContent = months[month]  + ' ' + year; 
            },

            changeType: function(type) {
                var fields;

                fields = document.querySelectorAll(
                    DOMStrings.inputType, + ',' + 
                    DOMstrings.inputDescription + ', ' + 
                    DOMStrings.inputValue
                );

                nodeListForEach(fields, function(cur) {
                    cur.classList.toggle('red-focus');
                });

                document.querySelectorAll(DOMstrings.inputBtn).classList.toggle('red');
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
            
            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
            document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        };

        var updateBudget = function() {
            var budget;
            // 1. calculate the buddget.
            budgetCtrl.calculateBudget();
            // 2. return budget
            budget = budgetCtrl.getBudget();
            // 3. display the budget.
            UICtrl.displayBudget(budget);
        };

        var updatePercentages = function() {
            var percentages;

            // 1. Calculate percentages
            budgetCtrl.calculatePercentages();

            // 2. Read percentages from the budget controller
            percentages = budgetCtrl.getPercentages();

            // 3. Update UI w/ new percentages
            UICtrl.displayPercentages(percentages);


        };

        var ctrlAddItem = function () {

            //this is like the control/command center that makes use of all the modules/controllers.
            var input, newItem;
            // old browsers use .which to tell us what key was pressed.
            // to do list
            // 1. get input data from field.
            input = UIController.getInput();

            // 2. perform data validation
            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
                // 3. add item to budget controller.
                newItem = budgetController.addItem(input.type, input.description, input.value);
                // 4. add the new item to user interface.
                UIController.addListItem(newItem, input.type);
                // 5. clear the fields.
                UIController.clearFields();
                // 6. calc & update budget.
                updateBudget();
                // 7. calc & update percentages.
                updatePercentages();
            }

        };

        var ctrlDeleteItem = function(event) {
            var itemID, splitID, type, id;
            // can know where the event came from by looking at the target property of the event obj.
            // parentNode moves up 1 time, therefore we can use as many times as we need to reach the desired
            // element. the id then gives us the item we need to delete
            // HTML traversing
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (itemID) {
                splitID = itemID.split('-');
                type = splitID[0];
                id = parseInt(splitID[1]);

                //1. delete the item from data struct
                budgetCtrl.deleteItem(type, id);
                //2. delete the item from the UI
                UIController.deleteListItem(itemID);
                //3. update and show new budget
                updateBudget();
                //4. calc & update percentages
                updatePercentages();
            }
        };

        // adding init function to do the work at the start of our application
        return {
            init: function() {
                setupEventListeners();
                UICtrl.displayBudget({
                    budget: 0,
                    percentage: 0,
                    totalInc: 0,
                    totalExp: -1
                });
                UICtrl.displayMonth();
            }
        }
    }

    //pass the budgetController, UI controller into the IIFE.
)(budgetController, UIController);

// w/o this line of code, nothing will ever happen. need eventListeners.
controller.init();