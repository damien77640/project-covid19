
createdb = () => {
    const lib = new localStorageDB("covid19", localStorage);

    if (lib.isNew()) {
        lib.createTable("countries", ["country", "countrycode", "slug", "newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered", "date"]);
        lib.createTable("globalstat", ["newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered"]);
        lib.createTable("todate", ["date"]);
        // lib.dropTable("countries");   
        lib.createTable("type", ["country", "countrycode", "slug", "newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered", "date"]);
        lib.commit();
    }
}

selectcountries = () => {
    const lib = new localStorageDB("covid19", localStorage);
    let bool = false;
    let resQuery = lib.queryAll('todate');
    console.log(resQuery);
    let datesnow = new Date(resQuery[0].date);
    console.log("datesnow", datesnow);
    let dateresQuery = datesnow.getHours();
    console.log("dateresQuery", dateresQuery);

    let date = new Date;
    let getHoursNow = date.getHours();    //comparés par rapport au jour aussi
    console.log("getHoursNow", getHoursNow);
    let testhours = getHoursNow - dateresQuery;
    console.log("il y a nb heures d'écoulés : ", testhours);

    if (testhours >= 6 ) {
        bool = true;
    }
    if (bool === true) {
        ajaxGet("https://api.covid19api.com/summary", function (reponse) {
            let data = JSON.parse(reponse);
            console.log("data",data);
            data.Countries.forEach(element => {
               // lib.deleteRows("countries");  // a changer avec un insertorupdate et voila
                lib.insert("countries", { country: element.Country, countrycode: element.CountryCode, slug: element.Slug, newconfirmed: element.NewConfirmed, totalconfirmed: element.TotalConfirmed, newdeaths: element.NewDeaths, totaldeaths: element.TotalDeaths, newrecovered: element.NewRecovered, totalrecovered: element.TotalRecovered, date: element.Date });
                lib.commit();
            });

            lib.deleteRows("globalstat");
            lib.deleteRows("todate");
            lib.deleteRows("type");
            lib.insert("globalstat", { newconfirmed: data.Global.NewConfirmed, totalconfirmed: data.Global.TotalConfirmed, newdeaths: data.Global.NewDeaths, totaldeaths: data.Global.TotalDeaths, newrecovered: data.Global.NewRecovered, totalrecovered: data.Global.TotalRecovered });
            lib.insert("todate", { date: data.Date })
            lib.insert("type", { country: "string", countrycode: "string", slug: "string", newconfirmed: "number", totalconfirmed: "number", newdeaths: "number", totalconfirmed: "number", newdeaths: "number", totaldeaths: "number", newrecovered: "number", totalrecovered: "number", date: "string" });
            let jsoncountries = lib.queryAll('countries');
            console.log("countries",jsoncountries);
            lib.commit();

        });
    } else {

        let typedata = lib.queryAll('type');
        console.log("typedata", typedata);
        let jsoncountries = lib.queryAll('countries');
        console.log("jsoncountries", jsoncountries);
        let jsonglobalstat = lib.queryAll('globalstat');
        console.log("jsonglobalstat", jsonglobalstat);

        let resQuery = lib.queryAll('todate');
        let datesnow = new Date(resQuery[0].date);
        console.log("datesnow", datesnow);
        let dateresQuery = datesnow.getHours();
        console.log("dateresQuery", dateresQuery);
        let date = new Date;
        let getHoursNow = date.getHours();
        console.log("getHoursNow", getHoursNow);
        let testhours = getHoursNow - dateresQuery;
        console.log("il y a nb heures d'écoulés : ", testhours);
    }
}
