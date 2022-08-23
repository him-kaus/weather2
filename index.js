const http = require('http')
const fs = require('fs')
const requests = require('requests')
const port = process.env.PORT || 8000

let homeFile = fs.readFileSync('index1.html', 'utf-8')

const replaceVal = (tempVal2,orgVal) => {
    let temprature = tempVal2.replace("{%tempVal%}",orgVal.main.temp)
    temprature = temprature.replace("{%tempMin%}",orgVal.main.temp_min)
    temprature = temprature.replace("{%tempMax%}",orgVal.main.temp_max)
    temprature = temprature.replace("{%location%}",orgVal.name)
    temprature = temprature.replace("{%country%}",orgVal.sys.country)
    // console.log(temprature)
    return temprature;
}

const server = http.createServer((req, res) => {
        if(req.url==='/'){
            requests('https://api.openweathermap.org/data/2.5/weather?q=Rajasthan&appid=5898105070c0b2fb14490eb02d34ae49')
            .on('data',(chunk) => {
                const objData = JSON.parse(chunk)
                const arrObj=  [objData]
                // console.log(arrObj[0].main.temp)
                const realTimeData = arrObj.map(val =>replaceVal(homeFile,val)
                ).join("");
                
                res.write(realTimeData) 
                // res.end()

            })
            .on('end',(err) =>  {
                if (err) return console.log('connection closed due to errors', err);

                console.log('end');
                res.end()
            });
        }else{
            res.write("Hello World")
            res.end()
        }
    }
)

server.listen(port,'127.0.0.1', () => {
    console.log('listen')
})