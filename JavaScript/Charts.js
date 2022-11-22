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
            borderColor: [
                /*'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',*/
                "#FFF",
                "#FFF",
                "#FFF",
                "#FFF"
                
            ],
            color: [
                "#181818"
            ],
            borderWidth: 0
        }]
    },
    options: {
        
        scales: {
            
           /* yAxes: {
                ticks: {
                    color: "white",
                    family: "'Roboto', sans-serif"
                }
            },
            xAxis: {
                ticks: {
                    color: "white",
                    family: "'Roboto', sans-serif"

                }
            }*/
        },
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
            
        }
    }
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
    }
});

    setInterval(UpdateData, 60000)
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
                console.log(Data["Green"]);

                myChart1.data.datasets[0].data = [parseFloat(Data["Blue"]), parseFloat(Data["Green"]), parseFloat(Data["Red"]), parseFloat(Data["Yellow"]), parseFloat(Data["Orange"])];
                //console.log(myChart1.data.datasets[0].data);
                myChart1.update();
                O_BlueMass.textContent = Data["Blue"];
                O_GreenMass.textContent = Data["Green"];
                O_RedMass.textContent = Data["Red"];
                O_YellowMass.textContent = Data["Yellow"];
                O_OtherMass.textContent = Data["Orange"];

                TotalNotRedMass = Data["Blue"] + Data["Green"] + Data["Yellow"];
                console.log(typeof(Data["Red"]));
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
                console.log(MassTotal.toFixed(2));
                O_Stat2Data.textContent = MassTotal.toFixed(2); //.toFixed(2);
                O_Stat3Data.textContent = Data["Red"];
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
            console.log(this.responseText);
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
            console.log(Data);
            myChart2.data.datasets[0].data = [parseInt(Data["con"]), parseInt(Data["not"])];
            myChart2.update();
            if(Data["con"]  == undefined) {
                O_Stat1Data.textContent = "0";
            }
            else {
                console.log(MassTotal);
                WasteRatio = parseInt(Data["con"])/(parseInt(Data["con"])+ parseInt(Data["not"]));
                O_Stat1Data.textContent = (MassTotal*WasteRatio).toFixed(2);
            }
     


        }

        xhttp2.send();

    }






//end code
}