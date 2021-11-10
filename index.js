var server = new StellarSdk.Server("https://horizon.stellar.org");

var ul = document.getElementById("transactions");

var handleFetchTransactions = () => {
    server.transactions()
    .call()
    .then(function (page) {
        console.log('Page 1: ');
        console.log(page.records);
        page.records.forEach(record => {
            var div = document.createElement("div");
            div.classList.add("col-sm-2");

            var li = document.createElement("li");
            li.appendChild(createCard(record["id"]));

            div.appendChild(li);
            ul.appendChild(div);
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
}

function createCard(id) {
    //  Style card
    var card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";

    //  Card body
    var body = document.createElement("div");
    body.classList.add("card-body");

    //  Append card info
    var title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerText = id;

    body.appendChild(title);
    card.appendChild(body);
    return card;
}
