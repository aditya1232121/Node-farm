const fs = require('fs'); // fs --> File system module
const http = require('http'); // build an HTTP server
const { parse } = require('path');
const url = require('url'); // used for routing
const replaceTemplate = require('./modules/replacetemplate')
const slugify =  require('slugify') // last part of the url that contains unique string
// // Synchronous file read

// const textin = fs.readFileSync('./txt/input.txt', 'utf-8'); // Read input.txt
// console.log(textin);

// const textout = `This is what we know about the avocado: ${textin}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textout); // Write to output.txt

// Asynchronous file read
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) {
//         console.error("Error reading start.txt:", err);
//         return;
//     }

//     const fileName = data1.trim(); // Remove any extra spaces or newlines

//     fs.readFile(`./txt/${fileName}.txt`, 'utf-8', (err, data2) => {
//         if (err) {
//             console.error(`Error reading ${fileName}.txt:`, err);
//             return;
//         }
//         console.log(data2); // Log the content of the second file

//         // Read append.txt after reading the second file
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             if (err) {
//                 console.error("Error reading append.txt:", err);
//                 return;
//             }

//             console.log(data3); // Log the content of append.txt

//     fs.writeFile('./txt/final.txt' ,`${data2}\n${data3}` , 'utf-8' , err =>
//     {
//         console.log("your file has been written")
//     }
//     )
//         });
//     });
// });

// console.log("It's working before");

// Function to replace template placeholders with actual product data

// Reading the file at the start only 
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/templatecard.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataobj = JSON.parse(data); // Convert JSON string to object

const slugs = dataobj.map(el => slugify(el.productName , {
    lower : true 
})); // looping in the file taking element and using el to store or take elent then use slugify

// console.log(slugify('Fresh Avocados' , {
//     lower : true 
// })) // its how slugify is used
const server = http.createServer((req, res) => {
    console.log(req.url);
    const { pathname, query } = url.parse(req.url, true); // Properly parse query parameters

    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const cardhtml = dataobj.map(el => replaceTemplate(tempCard, el)).join(''); // join elements
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardhtml);
        res.end(output);
    } 
    else if (pathname === '/product') {
        const productId = query.id; // Extract product ID from query string

        if (productId && dataobj[productId]) {
            const output = replaceTemplate(tempProduct, dataobj[productId]);
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end(output);
        } else {
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end('<h1>Product not found!</h1>');
        }
    } 
    else if (pathname === "/api") {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-type': 'application/json' });
                return res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
            res.writeHead(200, { 'Content-type': 'application/json' }); // for JSON it is application/json
            res.end(data);
        });
    } 
    else {
        res.writeHead(404, { // status code
            'Content-type': 'text/html'
        }); // for html it is text/html
        res.end('<h1> Page not found ! </h1>');
    }
}); // call function where argument pass and is executed later after a certain operation

server.listen(8000, '127.0.0.1', () => { // 8000 -->> port no // local host
    console.log('Listening on port 8000');
});
