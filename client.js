ajaxGet("https://api.covid19api.com/summary", function (reponse) {
    var data = JSON.parse(reponse);
    // Récupération des données choisis
    var data1 = data.Global.NewConfirmed;
    var data2 = data.Global.TotalConfirmed;
    // Affichage des résultats
    var element = document.createElement("div");
    element.textContent = "Il y a eu nb mort au total : " + data1 +
        " et le nb de cas confirmé est de " + data2;
    var dataElement = document.getElementById("stylé");
    dataElement.appendChild(element);
});