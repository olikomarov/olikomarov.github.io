var quotes = [];
var quote_added = [];
var authors = [];
var author_array = {};

function parse() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json", false);
    xmlhttp.send();

    quotes = JSON.parse(xmlhttp.responseText);
    for (i = 0; i < quotes.length; i++) {
        if (authors.includes(quotes[i].quoteAuthor) == false) {
            authors.push(quotes[i].quoteAuthor);
        }
    }
}

function cr_author_array() {

    for (x = 0; x < quotes.length; x++) {
        if (author_array[quotes[x].quoteAuthor] != undefined) {
            if (author_array[quotes[x].quoteAuthor].includes(quotes[x].quoteText) == false) {
                author_array[quotes[x].quoteAuthor].push(quotes[x].quoteText);
            }
        }
        else {
            author_array[quotes[x].quoteAuthor] = [];
            author_array[quotes[x].quoteAuthor].push(quotes[x].quoteText);
        }
    }
    return author_array;
}

function random_quote() {
    random = quotes[Math.floor(Math.random() * quotes.length)];
    return '"' + random.quoteText + '"' + ' - ' + random.quoteAuthor;

}

function add_quote() {

    var main = document.getElementById("main");
    var sub_div = document.createElement("div");
    sub_div.classList.add('quote');

    while (true) {
        rq = random_quote();
        sub_div.innerHTML = rq;
        if (quote_added.includes(rq) == false) {
            break;
        }
    }
    main.appendChild(sub_div);
    quote_added.push(rq);
}


function clear() {
    if (quote_added.length <= 1) {
        add_quote();
    }
    var main = document.getElementById("main");

    while (main.lastChild.className == "quote") {
        next = main.children[1];
        main.removeChild(next);
    }
    quote_added = [];
}

function quote_button() {
    clear();
    add_quote();
}

function sorting() {
    if (quote_added.length < 1) {
        return;
    }


    quote_added.sort(function (a, b) {
        return a.localeCompare(b);
    });


    var main = document.getElementById("main");

    while (main.lastChild.className == "quote") {
        main.removeChild( main.lastChild);
    }
    
    quote_added.forEach(function(quote){
        var sub_div = document.createElement("div");
        
        sub_div.classList.add('quote');
        sub_div.innerHTML = quote;

        main.appendChild(sub_div);
    
    });
}


window.onload = function () {
    parse();
    cr_author_array();
}

