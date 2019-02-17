$(function () {

    //STAŁE
    const booksContainer = $(".books ul");
    const form = $("#book-form");
    const API_URL = "http://localhost:8282/books/";
    const getBooks = $("#getBooks").data();


    //pobranie daty
    function getCurrentDate() {
        const currentDate = $(".current-date")
        $.ajax({
            url: "http://date.jsontest.com"
        }).done(function (resp) {
            currentDate.text(resp.date);
        }).fail(function (error) {
            console.log(error)
        })
    }
    getCurrentDate();

    //pobieranie książek
    function masterAjax(dataset, run , data) {
        $.ajax({
            url: API_URL+dataset.urlapi
            ,
            data: data
            ,
            type: dataset.type
            ,
            contentType: dataset.contenttype
        }).done(function (responce) {
            if (run===0){
                responce.forEach(insertBookToHtml);//tu pobieram
            }
        }).fail(function (error) {
            console.log(error)
        })
    }
    masterAjax(getBooks,0);

    //tworzenie listy na stronie
    function insertBookToHtml(book) { //tu jest przekazanie
        const li = $("<li>").attr("data-id", book.id);
        const h3 = $("<h3>").text(book.title);
        const delButon = $("<button>")
            .text("Usuń książkę").data("urlapi",book.id)
            .data("type", "DELETE");
        const div = $("<div>").text(Object.values(book)).hide();

        li.append(h3, div, delButon);
        booksContainer.append(li);
    }

    //nasłuchiwacz do rozwijania opisów
    booksContainer.on("click", "h3", function () {
        let self = $(this);
        self.next().slideToggle("fast");
    });

    //przycisk do usuwanie książek
    booksContainer.on("click", "button", function () {
        console.log("jestem");
        let self = $(this);
        let dataSet = self.data();
        masterAjax(dataSet, 1);
        location.reload();
    });

    //obłsuga formularza do dodawania książek
    form.submit(function (event) {
        let data = formToObject(form);
        let dataSet = form.data();
        event.preventDefault();
        masterAjax(dataSet, 1 , data);
        location.reload();
    });

    //metoda do zamiany danych z formularza na obiekt json
    function formToObject(someHtmlForm){
        let outTable = [];
        let inputTable = someHtmlForm.serializeArray();
        inputTable.forEach(function (el) {
            let name = el.name;
            let value = el.value;
            let frags = '"'+name+'"'+":"+'"'+value+'"';
            outTable.push(frags)
        });
        let readyStrig = '{'+outTable.join(", ")+'}';
        return readyStrig;
       }
});

