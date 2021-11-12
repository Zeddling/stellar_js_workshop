$(document).ready(() => {
    var server = new StellarSdk.Server("https://horizon.stellar.org");

    //  Get table's tbody
    var tbody = document.getElementById("transactions");
    
    //  Array to store the transactions
    var data_array = [];

    $("#fetchButton").on("click", () => {
        console.log("Fetching....");
        data_array = [];
        server.transactions()
            .call()
            .then(function (page) {
                $("#transactions").empty();
                console.log('Fetch complete!');
                console.log('Page 1: ');
                console.log(page.records);

                //  Store the records in the array
                data_array = page.records;

                var i = 1;  //  rows iterator
                var j = 0;  //  array iterator

                /** 
                 * Iterate over each record
                 * Only shows row number, transaction memo, fee charged and created at keys.
                 * Steps:
                 *      1. Create table row tag <tr></tr>
                 *      2. Create table data tag <td></td>
                 *      3. Add appropriate data to td
                 *      4. Add button with id set to row number to row
                 *      5. Append button to extra a td
                 *      6. Append all children (td) to tr
                 *      7. Append tr to tbody as a child node
                 */
            
                page.records.forEach(record => {
                    var row = document.createElement("tr");

                    //  Create id td and set inner html to current row number
                    var id = document.createElement("td");
                    id.innerHTML = i;
                    row.appendChild(id);
                    data_array.push(record);

                    var memo = document.createElement("td");
                    memo.innerHTML = record["memo"];
                    row.appendChild(memo);

                    var fee_charged = document.createElement("td");
                    fee_charged.innerHTML = record["fee_charged"];
                    row.appendChild(fee_charged);

                    var created_at = document.createElement("td");
                    created_at.innerHTML = record["created_at"];
                    row.appendChild(created_at);

                    var buttonTD = document.createElement("td");
                    var button = document.createElement("button");

                    button.innerText = "Read";
                    button.classList.add("btn", "btn-success");

                    button.id = j;
                    //  Sets showInfo click listener and set's the button
                    //  as the function parameter
                    button.addEventListener("click", showInfo, false);
                    buttonTD.appendChild(button);
                    row.appendChild(buttonTD)

                    tbody.appendChild(row);

                    //  Increment counters
                    i++;
                    j++;
                });
                return page.next();
            })
            .then(function (page) {
                console.log('Page 2: ');
                console.log(page.records);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    //  Created list elements from json object
    //  and appends it in the ul tag
    //  @param the clicked button
    function showInfo(btn) {
        //  Get transaction data in relation to the clicked button's id
        var data = data_array[btn.target.id];

        //  Get transaction info card's list
        var ul = document.getElementById("transaction-info");
        $("ul").empty();
        
        //  TODO:   Most of these keys are data types I'm not familiar with
        //          If you know them you can probably give more light to them
        var not_needed = [
            "self", "account", "operations", "effects", 
            "precedes", "succeeds", "transaction", "ledger",
            "memo", "memo_bytes", "memo_type"
        ];

        //  discard all keys that we have no use for at the moment
        not_needed.forEach(key => {
            delete data[key];
        });

        /**
         * Iterate over all keys in the data object.
         * If data[key] > 70 or data[key] is not of type string we 
         * add the text-overflow(style.css: line 69 lol) class to enable scrolling.
         * 
         * The tags are designed in the structure of the list-group class defined
         * in bootstrap framework.
         * 
         *  <ol class="list-group list-group-numbered">
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">Subheading</div>
                        Content for list item
                    </div>
                    <span class="badge bg-primary rounded-pill">14</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">Subheading</div>
                        Content for list item
                    </div>
                    <span class="badge bg-primary rounded-pill">14</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">Subheading</div>
                        Content for list item
                    </div>
                    <span class="badge bg-primary rounded-pill">14</span>
                </li>
            </ol>
         *
         */
        for (key in data) {
            if (data[key].length <= 88) {
                var li = document.createElement("li");
                li.classList.add(
                    "list-group-item", "d-flex", 
                    "justify-content-between", "align-items-start",
                );

                if (typeof data[key] != "string" || data[key].length > 70) {
                    li.classList.add("text-overflow")
                }
                
                var divParent = document.createElement("div");
                divParent.classList.add("ms-2", "me-auto");
                
                var p = document.createElement("p");
                p.innerText = data[key];

                var divBold = document.createElement("div");
                divBold.classList.add("fw-bold");
                divBold.innerHTML = key;

                divParent.appendChild(divBold);
                divParent.appendChild(p);
                li.appendChild(divParent);
                ul.appendChild(li);   
            }
        }
    }

});
