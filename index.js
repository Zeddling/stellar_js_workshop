$(document).ready(() => {
    console.log('ready')
    var server = new StellarSdk.Server("https://horizon.stellar.org");
    var data_array = [];
    var tbody = document.getElementById("transactions");

    $("#fetchButton").on("click", () => {
        console.log("clicked");
        data_array = []; // clear array
        server.transactions()
            .call()
            .then(function (page) {
                $("#transactions").empty()
                console.log('Page 1: ');
                console.log(page.records);

                var i = 1;  //  rows iterator
                var j = 0;  //  array iterator
                page.records.forEach(record => {
                    var row = document.createElement("tr");

                    var id = document.createElement("td");
                    id.innerHTML = i;
                    row.appendChild(id);
                    data_array[j] = record["id"];

                    var memo = document.createElement("td");
                    memo.innerHTML = record["memo"];
                    row.appendChild(memo);

                    var fee_charged = document.createElement("td");
                    fee_charged.innerHTML = record["fee_charged"];
                    row.appendChild(fee_charged);

                    var created_at = document.createElement("td");
                    created_at.innerHTML = record["created_at"];
                    row.appendChild(created_at);

                    tbody.appendChild(row);
                    i++;
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

});