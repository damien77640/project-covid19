let jsoncountries = {};
let typedata = {};
let jsonglobalstat = {};
let testhours = 0;
let datesnow = new Date;

createdb = () => {
    const lib = new localStorageDB("covid19", localStorage);

    if (lib.isNew()) {
        lib.createTable("countries", ["country", "countrycode", "slug", "newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered", "date"]);
        lib.createTable("globalstat", ["newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered"]);
        lib.createTable("todate", ["date"]);
        // lib.dropTable("countries");
        lib.createTable("type", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        // lib.dropTable("countries");   
        lib.createTable("selectcountry", ["country", "confirmed", "deaths", "recovered", "date"]);
        lib.commit();
    }
        // lib.dropTable("type");

}

selectsummary = () => {
    const lib = new localStorageDB("covid19", localStorage);
    let bool = false;
    let resQuery = lib.queryAll('todate');
    let datesnow = new Date(resQuery[0].date);
    // console.log("datesnow", datesnow);
    let dateresQuery = datesnow.getHours();
    let dayresQuery = datesnow.getDay();
    console.log("dayresQuery", dayresQuery);
    console.log("dateresQuery", dateresQuery);

    let date = new Date;
    let getHoursNow = date.getHours();
    let getDaysNow = date.getDay();
    console.log("getHoursNow", getHoursNow);
    console.log("getDaysNow", getDaysNow);
    let testhours = getHoursNow - dateresQuery;
    // console.log("il y a nb heures d'écoulés : ", testhours);

    if (dayresQuery !== getDaysNow) {
        bool = true;
    }
    if (testhours > 6) {
        bool = true;
    }
    if (bool === true) {
        ajaxGet("https://api.covid19api.com/summary", function (reponse) {
            let data = JSON.parse(reponse);
            // console.log("data",data);
            data.Countries.forEach(element => {
                lib.deleteRows("countries");  // a changer avec un insertorupdate et voila
                lib.insert("countries", { country: element.Country, countrycode: element.CountryCode, slug: element.Slug, newconfirmed: element.NewConfirmed, totalconfirmed: element.TotalConfirmed, newdeaths: element.NewDeaths, totaldeaths: element.TotalDeaths, newrecovered: element.NewRecovered, totalrecovered: element.TotalRecovered, date: element.Date });
                lib.commit();
            });

            lib.deleteRows("globalstat");
            lib.deleteRows("todate");
            lib.deleteRows("type");
            lib.insert("globalstat", { newconfirmed: data.Global.NewConfirmed, totalconfirmed: data.Global.TotalConfirmed, newdeaths: data.Global.NewDeaths, totaldeaths: data.Global.TotalDeaths, newrecovered: data.Global.NewRecovered, totalrecovered: data.Global.TotalRecovered });
            lib.insert("todate", { date: data.Date })
            lib.insert("type", { "0": "string", "1": "string", "2": "string", "3": "number", "4": "number", "5": "number", "6": "number", "7": "number", "8": "number", "9": "string" });
            jsoncountries = lib.queryAll('countries');
            // console.log("countries",jsoncountries);
            lib.commit();

        });
    } else {

        typedata = lib.queryAll('type');
        // console.log("typedata", typedata);
        jsoncountries = lib.queryAll('countries');
        // console.log("jsoncountries", jsoncountries);
        jsonglobalstat = lib.queryAll('globalstat');
        // console.log("jsonglobalstat", jsonglobalstat);

        let resQuery = lib.queryAll('todate');
        datesnow = new Date(resQuery[0].date);
        // console.log("datesnow", datesnow);
        let dateresQuery = datesnow.getHours();
        console.log("dateresQuery", dateresQuery);
    }

    let retour = {
        "countries": jsoncountries,
        "type": typedata
    };
    return retour;
}

selectcountries = (namecountry) => {
    const lib = new localStorageDB("covid19", localStorage);
    ajaxGet("https://api.covid19api.com/total/country/" + namecountry, function (reponse) {
        let data = JSON.parse(reponse);
        lib.deleteRows("selectcountry");
        data.forEach(element => {
            lib.insert("selectcountry", { country: element.Country, confirmed: element.Confirmed, deaths: element.Deaths, recovered: element.Recovered, date: element.Date });
            lib.commit();
        })
        let datacountry = lib.queryAll('selectcountry');
        console.log("datacountry",datacountry);

        let confirmedyest = datacountry[0].confirmed;
        let confirmtoday = datacountry[1].confirmed;
        let deathyest = datacountry[0].deaths;
        let deathtoday = datacountry[1].deaths;
        let recoveredyest = datacountry[0].recovered;
        let recoveredtoday = datacountry[1].recovered;

        let totalconfirmed = confirmtoday - confirmedyest;
        let totaldeath = deathtoday - deathyest;
        let totalrecovered = recoveredtoday - recoveredyest;
        console.log("totalconfirmed",totalconfirmed);
        console.log("totaldeath",totaldeath);
        console.log("totalrecovered",totalrecovered);
    })
}