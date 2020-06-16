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
        
        let dateresQuery = datesnow.getHours();
        dayresQuery = datesnow.getDay();

        let date = new Date;
        let getHoursNow = date.getHours();
        let getDaysNow = date.getDay();
        let testday = getDaysNow - dayresQuery;
        testhours = getHoursNow - dateresQuery;

    if (testday !== 0) {
        bool = false;
    } else if (testhours > 6) {
        bool = false;
    }
}
    if (lib.rowCount("countries") === 0 || bool === false) {  
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
        jsoncountries = lib.queryAll('countries');
        typedata = lib.queryAll("type");
        lib.commit();
        typedata = lib.queryAll('type');
        jsoncountries = lib.queryAll('countries');
        jsonglobalstat = lib.queryAll('globalstat');

        resQuery = lib.queryAll('todate');
        datesnow = new Date(resQuery[0].date);
        dateresQuery = datesnow.getHours();
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
    if(namecountry === ""){
        namecountry = "france"
    }
    const settings = { 
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
    if(namecountry === ""){ 
        namecountry = "france"
    }
    const settings = {
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