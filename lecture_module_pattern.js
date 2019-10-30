var budgetController = 
//IIFE
(function () {
    var x = 23;
    var add = function(a) {
        return x + a;
    };

    //returning object that has all the functions we want the public to be able to access.
    return {
        publicTest: function(b) {
            //this passes the value passed into publicTest into the add function, which has access to x
            //because the inner function always has access to the outer functions variables/scope. (closures).

            return add(b);
        }
    }
})();

var UIController = (
    function () {
        
        //some code

    }
)();

var controller = (
    function (budgetCtrl, UICtrl) {
        //even though we could access each controller due to the global scope, we don't want that because if we changed the name,
        //we would have to do that for every line of code within this function, which would make it less independent.
        var z = budgetCtrl.publicTest(5);

        return {
            anotherPublic: function () {
                console.log(z);
            }
        }
    }
    //pass the budgetController, UI controller into the IIFE.
)(budgetController, UIController);

