$(document).ready(() => {
    console.log('ready')
    var server = new StellarSdk.Server("https://horizon.stellar.org");
    var tbody = document.getElementById("transactions");
    var data_array = [];

    $("#fetchButton").on("click", () => {
        console.log("clicked");
        data_array = [];
        server.transactions()
            .call()
            .then(function (page) {
                $("#transactions").empty()
                console.log('Page 1: ');
                console.log(page.records);
                data_array = page.records;

                var i = 1;  //  rows iterator
                var j = 0;  //  array iterator
                page.records.forEach(record => {
                    var row = document.createElement("tr");

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

                    var hidden = document.createElement("input");
                    hidden.setAttribute("type", "hidden");
                    hidden.setAttribute("value", j);
                    button.appendChild(hidden);

                    button.innerText = "Read";
                    button.classList.add("btn", "btn-success");

                    button.id = j;
                    button.addEventListener("click", showInfo, false);
                    buttonTD.appendChild(button);
                    row.appendChild(buttonTD)

                    tbody.appendChild(row);
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

    function showInfo(btn) {
        var data = data_array[btn.target.id];
        var ul = document.getElementById("transaction-info");
        $("ul").empty();
        var not_needed = [
            "self", "account", "operations", "effects", 
            "precedes", "succeeds", "transaction", "ledger",
            "memo", "memo_bytes", "memo_type"
        ];

        not_needed.forEach(key => {
            delete data[key];
        });

        for (key in data) {
            if (data[key].length <= 88) {
                var li = document.createElement("li");
                li.classList.add(
                    "list-group-item", "d-flex", 
                    "justify-content-between", "align-items-start",
                );

                if (typeof data[key] != "string" || data[key].length > 70) {
                    li.classList.add("overflow-scroll")
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
