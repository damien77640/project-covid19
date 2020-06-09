let data;
ajaxGet("https://api.covid19api.com/summary", function (reponse) {
    data = JSON.parse(reponse);
    document.getElementById("date").innerHTML = Date();
    // Récupération des données choisis
    var newConfirmed = data.Global.NewConfirmed;
    var totalConfirmed = data.Global.TotalConfirmed;
    // Affichage des résultats
    var element = document.createElement("div");
    element.textContent = "Il y a eu nb mort au total : " + newConfirmed +
        " et le nb de cas confirmé est de " + totalConfirmed;
    var dataElement = document.getElementById("stylé");
    dataElement.appendChild(element);

    let table = document.getElementById("tablocovid");
    let tr = document.createElement('tr');
    tr.setAttribute('class', 'table-row');
    let text = "";
    let i = 0;
    Object.entries(data.Countries[0]).forEach(([key, value]) => {
        text += "<th onclick=\"sortTable('"+i+"')\">"+key+"</th>";
        i++;
        // let th = document.createElement('th');
        // th.onclick = sortTable(key);

        // let button = document.createElement('button');
        // button.innerText = `${key}`;
        // button.onclick = sortation(`${key}`);
        // th.innerText = `${key}`;
        // tr.appendChild(th);
    });
    tr.innerHTML = text;
    table.appendChild(tr);

    data.Countries.forEach(obj => {
        tr = document.createElement('tr');
        tr.setAttribute('class','table-row');
        Object.entries(obj).forEach(([key, value]) => {
            console.log(value);
            let td = document.createElement('td');
            td.innerText = `${value}`;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });



});


function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tablocovid");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}



// function sortation(key) {
//     const ordered = {};
//     Object.keys(data.Countries).sort().forEach(function (key) {
//         ordered[key] = data.Countries[key];
//     });
//     console.log(ordered);

//     return ordered;
// }
