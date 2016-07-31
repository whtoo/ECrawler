var Horseman = require('node-horseman');
var proxylist = [["58.222.254.11","3128"],["61.185.219.126","3128"],["218.247.161.37","80"],["61.172.249.96","80"],["211.155.234.99","80"],["218.75.100.114","8080"],["211.167.248.228","8080"],["60.12.227.208","80"],["221.8.9.6","80"],["218.26.219.186","8080"],["222.68.207.11","80"],["61.53.137.50","8080"],["218.75.75.133","8080"],["221.204.246.116","3128"],["125.39.129.67","80"],["220.194.55.244","3128"],["125.70.229.30","8080"],["220.194.55.160","3128"],["202.98.11.101","8080"],["59.76.81.3","8080"],["121.11.87.171","80"],["121.9.221.188","80"],["221.195.40.145","80"],["219.132.142.10","8080"],["61.178.63.197","3128"],["221.130.202.206","80"],["203.171.230.230","80"],["221.226.3.141","3128"],["210.74.130.34","8080"],["60.28.196.27","80"]];
var uas = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  'Mozilla/5.0 (Linux; Android 5.0; SM-N9100 Build/LRX21V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36 MicroMessenger/6.0.2.56_r958800.520 NetType/WIFI',
  'Mozilla/5.0 (Linux; Android 5.0; SM-N9100 Build/LRX21V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36 V1_AND_SQ_5.3.1_196_YYB_D QQ/5.3.1.2335 NetType/WIFI',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D257 QQ/5.2.1.302 NetType/WIFI Mem/28',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D257 MicroMessenger/6.0.1 NetType/WIFI'
];
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var url = 'https://starstyle.cifmedia.com/xdt/public/game/CandyCrushLite/index.html';

function runGame(){
  var horseman = new Horseman();
  var px = this.process;
  var rnd = Math.ceil(Math.random() * 100);
  var ua =  uas[(rnd % uas.length)];
  var proxy = proxylist[(rnd % proxylist.length)];
  var pt = this.process;
  var times = 4000;
  horseman
    .userAgent(ua)
    .open(url)
    .reload()
    .wait(times)
    .cookies()
    .then(
  	   function(cookies){
         horseman.close().then(function(){
           pt.exit();
         });
       }
    );

}

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork();
  });
  cluster.on('listening', function(worker, address) {
    console.log("A worker with #"+worker.id+" is now connected to " +
     address.address +
    ":" + address.port);
  });
} else {
  runGame();
}
