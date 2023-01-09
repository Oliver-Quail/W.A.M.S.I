window.onload = function() {
    var MassTotal = 0.00;
    UpdateData();
    //Masses output
    var O_BlueMass = document.getElementById("O_BlueMass");
    var O_GreenMass = document.getElementById("O_GreenMass");
    var O_RedMass = document.getElementById("O_RedMass");
    var O_YellowMass = document.getElementById("O_YellowMass");
    var O_OtherMass = document.getElementById("O_OtherMass");

    //Other stats
    var O_Stat2Data = document.getElementById("Stat2Data");
    var O_Stat3Data = document.getElementById("Stat3Data");
    var O_Stat1Data = document.getElementById("Stat1Data");

    var AmountOfContaminatedMass = 0;
    var TotalRedMass = 0;

    //global graph settings
    Chart.defaults.font.size = 16;
    Chart.defaults.font.family = "'Roboto', sans-serif";
    Chart.defaults.font.weight = "bold";


    //spectific default settings
    Chart.defaults.plugins.legend.labels.color = "#181818";
    Chart.defaults.plugins.title.font.size = 24;

    //calc for estimated waste
    var TotalNotRedMass = 0;
    var WasteRatio = 0;

    //Graph 1

    var Chart1 = document.getElementById("Chart1");
    Chart1.width = 0;


    var ObjectHolder = {};
    //Chart.defaults.global.legend.display = false;
    //Chart.defaults.global.plugins.color = "white";


    var ctx = document.getElementById('Chart1').getContext('2d');
    var myChart1 = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Blue', 'Green', 'Red', 'Yellow', "Electronic"],
        datasets: [{
            data: [12, 19, 3, 5],
            backgroundColor: [
                '#abd4c8',
                '#adc965',
                '#e46144',
                '#f2bd6e',
                "#ebc29f",  
            ],
            color: [
                "#181818"
            ],
            
        }],
    },
    options: {
        plugins : {
            title: {
                display: true,
                align: "center",
                color: "181818",
                text: "Break down of waste by mass",
                font : {
                    size: 20
                }
              
            },
            legend: {
                display: true,
                position: "bottom",

                labels: {
                    //family: "'Roboto', sans-serif",
                    font: {
                        size: "16"
                    },
                    boxWidth: 20
                }
            },
            datalabels: {
                anchor: "end",
                display: "auto"
            },
            
        }
    },
    plugins: [ChartDataLabels],

});
    //graph 2
    var Chart2 = document.getElementById("Chart2");
    Chart1.width = 0;
    //Chart.defaults.global.legend.display = false;
    //Chart.defaults.global.plugins.color = "white";

    var ctx = document.getElementById('Chart2').getContext('2d');
    var myChart2 = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Contaminated', 'Non-contaminated'],
        datasets: [{
            data: [12, 19],
            backgroundColor: [
                '#e46144',
                '#adc965',
                
            ],
            borderColor: [
                /*'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',*/
                "#FFF",
                "#FFF",
              
                
            ],
            color: [
                "#FFF"
            ],
            borderWidth: 0
        }]
    },
    options: {
        
        scales: {
        
            
        },
        plugins : {
            title: {
                display: true,
                align: "center",
                color: "#181818",
                text: "Contaminated vs non-contaminated",
                font : {
                    size: 18
                }
              
            },
            legend: {
                display: true,
                position: "bottom",

                labels: {
                }
            },
        }
    },
    plugins: [ChartDataLabels],
});

    setInterval(UpdateData, 10000)
    //Timer function 
    function UpdateData() {
        var xhttp =  new XMLHttpRequest();
        //! update
        xhttp.open("POST", "P_API.php?Mode=GetMassData");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onload = function() {
            switch(this.responseText) {
                case "-1":
                    alert("You don't have approriate access to this page");
                    return true;
                break;
        
                case "-8":
                    alert("Invalid data submitted");
                break;
        
                case "-7":
                    alert("No jobs avaliable at this time");
                    return true;
                break;
                case "0":
                    //! check
                    alert("non ady");
                break;
                case "-28":
                    alert("Invalid data");
                break;
                case "":
                    //alert("no jobs avaliable");
                    return true;
                break;
            }
                var Data = JSON.parse(this.responseText);

                myChart1.data.datasets[0].data = [parseFloat(Data["Blue"]), parseFloat(Data["Green"]), parseFloat(Data["Red"]), parseFloat(Data["Yellow"]), parseFloat(Data["Orange"])];
                myChart1.update();
                O_BlueMass.textContent = Data["Blue"];
                O_GreenMass.textContent = Data["Green"];
                O_RedMass.textContent = Data["Red"];
                O_YellowMass.textContent = Data["Yellow"];
                O_OtherMass.textContent = Data["Orange"];

                TotalNotRedMass = Data["Blue"] + Data["Green"] + Data["Yellow"];
                MassTotal = 0.00;

                if(Data["Blue"] != undefined) {
                    MassTotal += parseFloat(Data["Blue"]);
                }
                if(Data["Green"] != undefined) {
                    MassTotal += parseFloat(Data["Green"]);
                }
                if(Data["Red"] != undefined) {
                    MassTotal += parseFloat(Data["Red"]);
                }
                if(Data["Yellow"] != undefined) {
                    MassTotal += parseFloat(Data["Yellow"]);
                }
                if(Data["Orange"] != undefined) {
                    MassTotal += parseFloat(Data["Orange"]);
                }
                O_Stat2Data.textContent = MassTotal.toFixed(2); //.toFixed(2);
                //O_Stat3Data.textContent = Data["Red"];
                if(Data["Red"] != undefined) {
                    MassTotal -= parseFloat(Data["Red"]);
                }
                

            
        }
        xhttp.send();
        //myChart2.datasets[0].data = [];
        //myChart3.datasets[0].data = [];
        var xhttp2 = new XMLHttpRequest();
        xhttp2.open("POST", "P_API.php?Mode=GetContaminationData", true);
        xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp2.onload = function() {
            switch(this.responseText) {
                case "-1":
                    alert("You don't have approriate access to this page");
                    return true;
                break;
        
                case "-8":
                    alert("Invalid data submitted");
                break;
        
                case "-7":
                    alert("No jobs avaliable at this time");
                    return true;
                break;
                case "-28":
                    alert("Invalid data");
                break;
                case "":
                    //alert("no jobs avaliable");
                    return true;
                break;
            }
            var Data = JSON.parse(this.responseText);
            myChart2.data.datasets[0].data = [parseInt(Data["con"]), parseInt(Data["not"])];
            myChart2.update();
            if(Data["con"]  == undefined) {
                //O_Stat1Data.textContent = "0";
            }
            else {
                WasteRatio = parseInt(Data["con"])/(parseInt(Data["con"])+ parseInt(Data["not"]));
                //O_Stat1Data.textContent = (MassTotal*WasteRatio).toFixed(2);
            }
        }

        xhttp2.send();

        //var ObjectHolder = ObjectArray;
        var GetRawData = new XMLHttpRequest();
        GetRawData.open("POST", "P_API.php?Mode=GetDataRaw", true);
        GetRawData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        GetRawData.onload = function() {
            switch(this.responseText) {
                case "-1":
                    alert("You don't have approriate access to this page");
                    return true;
                break;

                case "-8":
                    alert("Invalid data submitted");
                break;

                case "-7":
                    alert("No jobs avaliable at this time");
                    return true;
                break;
                case "-28":
                    alert("Invalid data");
                break;
                case "":
                    //alert("no jobs avaliable");
                    return true;
                break;
            }
            var Data = JSON.parse(this.responseText);
            var BinColours =[];

            for(var element in Data) {
                BinColours.push(element);    
            }
            var Counter = 0;
            while(Counter < BinColours.length) {
                var ColoursArray = {"Blue": "#abd4c8", "Green": "#adc965", "Red": "#e46144", "Yellow": "#f2bd6e", "Orange": "#ebc29f", "Waste Due To Contamination": "#95270f", "Contaminated": "#e46144", "Not Contaminated": "#adc965", "Electronic": "#ebc29f"};
                var CorrectMassKey = "Non Contaminated "+ BinColours[Counter] + " Mass";
                ColoursArray[CorrectMassKey] = ColoursArray[BinColours[Counter]];
                
                var ContaminationData = GetContaminationData(Data[BinColours[Counter]]);
                var BinWasteData = GetBinMassData(Data[BinColours[Counter]]);
                var ContaminationArray = GetTotalMassNotInBin(Data);
                var TotalContaminationMass = GetTotalContaminatedMass(Data);
                var TotalRedMass = GetTotalRedMass(Data);
                var MassOfColourNotInBin = GetContaminatingMassInBin(Data, BinColours[Counter]);

                var DataDivide3 = GenerateSimpleElement("section", "DataDivide3");
                var DataColum = document.createElement("section");
                var SubTitles = ["Break Down of Waste From " + BinColours[Counter] + " Bin", "Number of Contaminated vs Non Contaminated in " + BinColours[Counter] + " Bins (kg)", "Amount of " + BinColours[Counter] + " Waste in Other Colour bins", "Sources of " + BinColours[Counter] + " Waste Going To Landfill"];
                var TitlesCounter = 0;
                while(TitlesCounter < SubTitles.length) {
                    var LocalTitle = document.createElement("h1");
                    LocalTitle.textContent = SubTitles[TitlesCounter];
                    LocalTitle.classList.add(BinColours[Counter]+"BorderTop");
                    DataColum.appendChild(LocalTitle);
                    switch(TitlesCounter) {
                        case 0:
                            var TempArray = {};
                            var MassKeys = Object.keys(Data[BinColours[Counter]]);
                            MassKeys.forEach(element => {
                                if(element != "Con" && element != "Not") {
                                    TempArray[element] = Data[BinColours[Counter]][element];
                                }
                            });
                            DataColum.appendChild(GenerateRow(TempArray));
                        break;
                        case 1:
                            DataColum.appendChild(GenerateRow(ContaminationData, ""));
                        break;
                        case 2:
                            DataColum.appendChild(GenerateRow(ContaminationArray[BinColours[Counter]], ""));
                        break;
                        case 3:
                            var TempArray = {};
                            var ContaminatedMass = BinWasteData[BinColours[Counter]] *(ContaminationData["Not Contaminated"]/(ContaminationData["Not Contaminated"] + ContaminationData["Contaminated"]));
                            
                            if(BinColours[Counter] != "Red") {
                                BinWasteData["Waste Due To Contamination"] = Math.round(ContaminatedMass * 100)/100;
                            }
                            else {
                                BinWasteData["Waste Due To Contamination"] = 0;
                            }
                            TempArray["Amount Going to landfill due to being put in wrong bin"] = Math.round(MassOfColourNotInBin*100)/100;
                            TempArray["Due to contamination"] = BinWasteData["Waste Due To Contamination"];
                            TempArray["Total"] = TempArray["Due to contamination"] + TempArray["Amount Going to landfill due to being put in wrong bin"];
                            DataColum.appendChild(GenerateRow(TempArray));
                            break;
                    }
                    TitlesCounter++;
                }
            
                BinWasteData[CorrectMassKey] = Math.round((Data[BinColours[Counter]][BinColours[Counter]] - BinWasteData["Waste Due To Contamination"])*100)/100;

                if(ObjectHolder[BinColours[Counter]] === undefined){
                    var StatFocus = document.createElement("article");
                    var Title = document.createElement("h1");
                    var ContaminationGraphHolder = document.createElement("section");
                    var WasteGraphHolder = document.createElement("section");
                    var ContaminationGraph = document.createElement("canvas");
                    var WasteGraph = document.createElement("canvas");
                    
                    ObjectHolder[BinColours[Counter]] = {};
                    ObjectHolder[BinColours[Counter]][0] = StatFocus;
                    ObjectHolder[BinColours[Counter]][1] = "";
                    ObjectHolder[BinColours[Counter]][2] = "";
                    ObjectHolder[BinColours[Counter]][3] = DataColum;
                    StatFocus.classList.add("StatFocus");
                    Title.classList.add("Title");
                    WasteGraph.id = "Chart" + BinColours[Counter] + "Mass";
                    WasteGraphHolder.appendChild(WasteGraph);
                    ContaminationGraph.id = "Chart" + BinColours[Counter] + "Con";
                    ContaminationGraphHolder.appendChild(ContaminationGraph);
                    Title.textContent = "Break down of Waste From " + BinColours[Counter] + " Bin";
                    Title.classList.add(BinColours[Counter]+"Background");
        
                    StatFocus.appendChild(Title);
                    DataDivide3.appendChild(DataColum);
                    DataDivide3.appendChild(ContaminationGraphHolder);
                    DataDivide3.appendChild(WasteGraphHolder);
                    StatFocus.appendChild(DataDivide3);
                    document.getElementsByTagName("body")[0].appendChild(StatFocus);
                    delete BinWasteData[BinColours[Counter]];
                    ObjectHolder[BinColours[Counter]][1] = GenerateChart(WasteGraph, BinWasteData, ColoursArray, "Breakdown of Which Bin " + BinColours[Counter] + " Waste is in (kg)");
                    ObjectHolder[BinColours[Counter]][2] = GenerateChart(ContaminationGraph, ContaminationData, {"Contaminated": ColoursArray["Contaminated"], "Not Contaminated":ColoursArray["Not Contaminated"]}, "Number of Contaminated vs Non-Contaminated "+ BinColours[Counter] +" Bins");    
                
                }
                else {
                    delete BinWasteData[BinColours[Counter]];
                    console.table(BinWasteData);
                    ObjectHolder[BinColours[Counter]][1].data.datasets[0].data = ConvertToArray(BinWasteData);
                    ObjectHolder[BinColours[Counter]][1].update();
                    ObjectHolder[BinColours[Counter]][2].data.datasets[0].data = ConvertToArray(ContaminationData);
                    ObjectHolder[BinColours[Counter]][2].update();
                    //ObjectHolder[BinColours[Counter]][0].prepend(DataColum);
                }
                Counter++;
            }

            O_Stat1Data.textContent = Math.round(TotalContaminationMass*100)/100;
            O_Stat3Data.textContent = (TotalRedMass + TotalContaminationMass).toFixed(2);
            return ObjectHolder;
            
        }
        GetRawData.send();

    }
  
    function GenerateChart(ChartId, Data, Colours, Title) {

        var Keys = Object.keys(Data);
        var DataArray = [];
        var ColoursArray = [];
        Keys.forEach(element => {
            DataArray.push(Data[element]);
            ColoursArray.push(Colours[element]);
        });
        var ctx = ChartId;
        var NewChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Keys,
            datasets: [{
                data: DataArray,
                backgroundColor: ColoursArray,
                borderColor: [
                    "#FFF",
                    "#FFF",
                  
                    
                ],
                color: [
                    "#FFF"
                ],
                borderWidth: 0
            }]
        },
        options: {
            
            scales: {
            
                
            },
            plugins : {
                title: {
                    display: true,
                    align: "center",
                    color: "#181818",
                    text: Title,
                    font : {
                        size: 18
                    }
                  
                },
                legend: {
                    display: true,
                    position: "bottom",
    
                    labels: {
    
                        
                        
    
                    }
                },
                datalabels: {
                    anchor: "end",
                    align: "right",
                    display: "auto",
                    backgroundColor: "#f7f7f74d",
                    borderRadius: "5",
                    color: "#000000",
                    
                },
            }
        },
        plugins: [ChartDataLabels],
    });

    return NewChart;

}


function GenerateSimpleElement(ElementType, Data, Mode = "Class") {
    var Element = document.createElement(ElementType);
    if(Mode == "Text") {
        Element.textContent = Data;
    }
    else {
        Element.classList.add(Data);
    }
    return Element;
}

function GenerateRow(Data, Type="kg") {
        var Row = GenerateSimpleElement("div", "Row");
        var Titles = Object.keys(Data);
        Titles.forEach(element => {
            var MassOfColour = Math.round(Data[element] *100)/100;
            var RowData = GenerateSimpleElement("section", "RowData");
            var MassTitle = document.createElement("h3");
            MassTitle.textContent = element;
            var TitleName = element;
            MassTitle.classList.add(TitleName.replace(/\s/g, ''));
            RowData.appendChild(MassTitle);
            RowData.appendChild(GenerateSimpleElement("span", MassOfColour + Type, "Text"));
            Row.appendChild(RowData);
        });
        //Row.appendChild(RowData);
        return Row;
}

    function GetBinMassData(Array) {
        var MassArray = {};
        Object.keys(Array).forEach(Colour => {
            if(Colour == "Orange") {
                MassArray["Electronic"] = Array[Colour];
            }
            else if(Colour != "Not" && Colour != "Con") {
                MassArray[Colour] = Array[Colour];
            }
        });
        return MassArray;
    }

    function GetContaminationData(Array) {
        var ContaminationArray = {"Contaminated":0, "Not Contaminated":0};
        var MassKeys = Object.keys(Array);
        MassKeys.forEach(element => {
            if(element == "Con"){
                ContaminationArray["Contaminated"] = Array["Con"];
            }
            else if (element == "Not"){            
                ContaminationArray["Not Contaminated"] = Array["Not"];
            }
        });
        return ContaminationArray;
    }

    function GetTotalMassNotInBin(Array) {
        var MassNotInBin = {};
        Object.keys(Array).forEach(ColourOverall => {
            Object.keys(Array[ColourOverall]).forEach(Colour => {
                if(Array[ColourOverall][Colour] != "Con" && Array[ColourOverall][Colour] != "Not" && ColourOverall != Colour) {
                    if(!MassNotInBin.hasOwnProperty(Colour)) {
                        MassNotInBin[Colour] = {};
                    }
                    MassNotInBin[Colour][ColourOverall] = Array[ColourOverall][Colour]; 
                    // if(ColourOverall != Colour) {
                    //     TotalContaminatingMass += Array[ColourOverall][Colour];
                    // }
                }
            });
        });
        //MassNotInBin["Total Non Red Contaminants"] = TotalContaminatingMass;
        return MassNotInBin;
    }

    function GetTotalContaminatedMass(Array) {
        var TotalContaminationMass = 0;
        Object.keys(Array).forEach(OverallColour => {
            Object.keys(Array[OverallColour]).forEach(Colour => {
                if(Colour != "Red" && Colour != OverallColour) {
                    TotalContaminationMass += Array[OverallColour][Colour];
                }
            });
        });
        return  (TotalContaminationMass *100).toFixed(2)/100;
    }

    function GetContaminatingMassInBin(Array, Colour) {
        var MassTotal = 0;
        Object.keys(Array[Colour]).forEach(Mass => {
            if(Mass != Colour) {
                MassTotal += Array[Colour][Mass];
            }
        });
        return MassTotal;
    }

    function GetTotalRedMass(Array) {
        var TotalRedMass = 0;
        Object.keys(Array).forEach(OverallColour => {
            if(Array[OverallColour]["Red"] !== undefined) {
                TotalRedMass += Array[OverallColour]["Red"];
            }
        });

        return TotalRedMass;
    }


}

function ConvertToArray(Array) {
    var NewArray = [];
    Object.keys(Array).forEach(Colour => {
        NewArray.push(Array[Colour]);
    });
    return NewArray;
}
    


//end code
