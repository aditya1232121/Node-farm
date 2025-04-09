module.exports =  (temp, product) => { // temp --> string or file, product --> object
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // replace all occurrences globally

    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    // Ensure that the word "Organic" only appears for organic products
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, ''); // Remove the class and text for non-organic products
    } else {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'card__detail--organic'); // Add the class for organic products
    }
 Console.log("Added elements")
    return output;  
    
};

// this function does not have any name 
console.log('This is a test message'); // this is a test message