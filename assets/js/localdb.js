createdb = () => {
    const lib = new localStorageDB("covid19", localStorage);

    if (lib.isNew()) {
        lib.createTable("countries", ["country", "countrycode", "slug", "newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered", "date"]);
        lib.createTable("globalstat", ["newconfirmed", "totalconfirmed", "newdeaths", "totaldeaths", "newrecovered", "totalrecovered"]);
        lib.createTable("todate", ["date"]);
        // lib.dropTable("countries");
        lib.createTable("type", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
        lib.createTable("selectcountry", ["country", "confirmed", "deaths", "recovered", "date"]);
        lib.commit();
    }
}

selectsummary = () => {
    const lib = new localStorageDB("covid19", localStorage);
    let bool = true;
    let typedata = '';
    let dayresQuery = '';
    let getDaysNow = '';
    let testhours = '';
    let testday = '';
    let resQuery = lib.queryAll('todate');
    if (resQuery[0] !== undefined) {
        let datesnow = new Date(resQuery[0].date);
        // console.log("datesnow", datesnow);
        let dateresQuery = datesnow.getHours();
        dayresQuery = datesnow.getDay();
        // console.log("dayresQuery", dayresQuery);
        // console.log("dateresQuery", dateresQuery);

        let date = new Date;
        let getHoursNow = date.getHours();
        let getDaysNow = date.getDay();
        let testday = getDaysNow - dayresQuery;
        // console.log("getHoursNow", getHoursNow);
        // console.log("getDaysNow", getDaysNow);
        testhours = getHoursNow - dateresQuery;
        // console.log("testhours",testhours);
        // console.log("testdayyyyy",testday);

    if (testday !== 0) {
        // console.log("differnce jour", testday);
        bool = false;
    } else if (testhours > 6) {
        // console.log("differnce heure",bool);
        bool = false;
    }
}
    if (lib.rowCount("countries") === 0 || bool === false) {  
        // console.log("falssssse", lib.rowCount("countries") === 0);
        // console.log("cete merde", bool);
        var settings = {
            async: false,
            "url": "https://api.covid19api.com/summary",
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            let data = response;
            lib.deleteRows("countries");
            data.Countries.forEach(element => {
                lib.insert("countries", {
                    country: element.Country,
                    countrycode: element.CountryCode,
                    slug: element.Slug,
                    newconfirmed: element.NewConfirmed,
                    totalconfirmed: element.TotalConfirmed,
                    newdeaths: element.NewDeaths,
                    totaldeaths: element.TotalDeaths,
                    newrecovered: element.NewRecovered,
                    totalrecovered: element.TotalRecovered,
                    date: element.Date
                });
                lib.commit();
            });

            lib.deleteRows("globalstat");
            lib.deleteRows("todate");
            lib.deleteRows("type");
            lib.insert("globalstat", {
                newconfirmed: data.Global.NewConfirmed,
                totalconfirmed: data.Global.TotalConfirmed,
                newdeaths: data.Global.NewDeaths,
                totaldeaths: data.Global.TotalDeaths,
                newrecovered: data.Global.NewRecovered,
                totalrecovered: data.Global.TotalRecovered
            });
            lib.insert("todate", {
                date: data.Date
            })
            lib.insert("type", {
                "0": "string",
                "1": "string",
                "2": "string",
                "3": "number",
                "4": "number",
                "5": "number",
                "6": "number",
                "7": "number",
                "8": "number",
                "9": "string"
            });
        })
        bool = true;
    }
    if (bool === true) {
        // console.log("trueeeee");
        jsoncountries = lib.queryAll('countries');
        typedata = lib.queryAll("type");
        // console.log("countries",jsoncountries);
        lib.commit();
        typedata = lib.queryAll('type');
        // console.log("typedata", typedata);
        jsoncountries = lib.queryAll('countries');
        // console.log("jsoncountries", jsoncountries);
        jsonglobalstat = lib.queryAll('globalstat');
        // console.log("jsonglobalstat", jsonglobalstat);

        resQuery = lib.queryAll('todate');
        datesnow = new Date(resQuery[0].date);
        dateresQuery = datesnow.getHours();
        // console.log("dateresQuery", dateresQuery);
    }

    let retour = {
        "countries": jsoncountries,
        "type": typedata,
        "globalstat": jsonglobalstat
    };
    return retour;
}

getInfoCountries = (namecountry) => {
    const lib = new localStorageDB("covid19", localStorage);
    let datacountry = {}
    var settings = {
        "url": "https://api.covid19api.com/total/country/" + namecountry,
        "method": "GET",
        "timeout": 0,
        "async": false
    };
    $.ajax(settings).done(function (response) {
        let data = response;
        lib.deleteRows("selectcountry");
        data.forEach(element => {
            lib.insert("selectcountry", {
                country: element.Country,
                confirmed: element.Confirmed,
                deaths: element.Deaths,
                recovered: element.Recovered,
                date: element.Date
            });
            lib.commit();
        })
        datacountry = lib.queryAll('selectcountry');
    })
    return datacountry
}

getCountryNameFromCountryCode = (code) => {
    const lib = new localStorageDB("covid19", localStorage);
    let countryName = '';
    let countries = lib.queryAll("countries");
    // console.log("countries countryCode", countries)

    for (let i = 0 ; i < countries.length ; i++){
        country = countries[i];
        if(country.countrycode == code){
            countryName = country.country;
            break;
        }
    }
    return countryName;
}

selectcountries = (namecountry) => {
    const lib = new localStorageDB("covid19", localStorage);
    let datacountry = {};
    let infocountry = {}
    var settings = {
        "url": "https://api.covid19api.com/total/country/" + namecountry,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
        let data = response;
        lib.deleteRows("selectcountry");
        data.forEach(element => {
            lib.insert("selectcountry", {
                country: element.Country,
                confirmed: element.Confirmed,
                deaths: element.Deaths,
                recovered: element.Recovered,
                date: element.Date
            });
            lib.commit();
        })
        datacountry = lib.queryAll('selectcountry');
        dadalen = datacountry.length
        let confirmtoday, confirmedyest, deathtoday, deathyest, recoveredtoday, recoveredyest;

        confirmedyest = datacountry[dadalen - 2].confirmed
        confirmtoday = datacountry[dadalen - 1].confirmed
        deathyest = datacountry[dadalen - 2].deaths
        deathtoday = datacountry[dadalen - 1].deaths
        recoveredyest = datacountry[dadalen - 2].recovered
        recoveredtoday = datacountry[dadalen - 1].recovered

        infocountry.confirmedyest = confirmedyest
        infocountry.confirmtoday = confirmtoday
        infocountry.deathyest = deathyest
        infocountry.deathtoday = deathtoday
        infocountry.recoveredyest = recoveredyest
        infocountry.recoveredtoday = recoveredtoday


        infocountry.suppconfirmed = confirmtoday - confirmedyest;
        infocountry.suppdeath = deathtoday - deathyest;
        infocountry.supprecovered = recoveredtoday - recoveredyest;
    })
    return infocountry
}

selectTypes = () => {
    const lib = new localStorageDB("covid19", localStorage);
    let types = lib.queryAll("type");
    return types;
}