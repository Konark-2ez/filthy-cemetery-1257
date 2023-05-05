let selectedCrypto = document.getElementById("select")
//For webSocket of crypto
var btc = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
var price = 0;
var oldPrice = 0;
var ctx = document.getElementById('myChart').getContext('2d');
var borderColor = "rgba(255, 99, 132, 1)"
var chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['time','price'],
    datasets: [{
      label: 'Bitcoin',
      data: [],
      backgroundColor: 'rgba(255, 99, 132, 1)',
      borderColor: borderColor,
      borderWidth: 1
    }]
  
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'series',
        ticks: {
          source: 'data',
          autoSkip: true
        }
        
      }],
      yAxes: [{
        type:'price',
        ticks: {
        source:'data',
          
          stepSize:100.5050
        }
        
      }]
    }
  }

});

 setInterval(() => {
  btc.onmessage = function(event) {
    console.log(event.data)
    var data = JSON.parse(event.data);
    price = parseFloat(data.p).toFixed(6);
    if (price > oldPrice) {
        borderColor = 'green'; // set color to green if rising
        document.getElementById("trend").style.color = "green"
      } else if (price < oldPrice) {
        borderColor = 'red'; // set color to red if falling
        document.getElementById("trend").style.color = "red"
      }
      
      chart.data.datasets[0].borderColor = borderColor;
      oldPrice = price;
      document.getElementById("trend").innerText = price
    }
 }, 500);

      
        setInterval(() => {
          var time = new Date();
          var Price = (price / 70).toFixed(5);
          chart.data.labels.push(time.toLocaleTimeString());
          chart.data.datasets[0].data.push(Price);
          chart.update();
          //
          if (time.getMinutes() % 30 == 0 && time.getSeconds() == 0) {
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
            chart.update();
          }
        }, 1000);
// for socket .io
const socket = io("http://localhost:8000/", { transports: ["websocket"] });
     document.querySelector("#form").addEventListener("submit",(e)=>{
        e.preventDefault();
        let name=localStorage.getItem("user");
        let msg = document.querySelector("#message").value;
        sent_msg(name,msg)
        document.querySelector("#message").value = '';
     })

     function sent_msg(name,msg){
        socket.emit("chat",name,msg)
     }
     
     
     socket.on("recived_msg",(name,msg)=>{
      let div = document.querySelector(".message-box");
      let p = document.createElement("p");
      let nameSpan = document.createElement("span");
      let msgSpan = document.createElement("span");
      
      nameSpan.textContent = `${name}: `;
      nameSpan.className = "name";
      
      msgSpan.textContent = msg;
      msgSpan.className = "msg";
      
      p.appendChild(nameSpan);
      p.appendChild(msgSpan);
      
      div.appendChild(p);
    })

      
      
    
    
  
