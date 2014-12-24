function load(filename, callback){
    d3.json(filename, function(err, json){
        if (err) return console.error('Data cant be loaded');

        sinfo = json.hits.hits;
        callback(sinfo.map(function(s){return s._source;}));
    });
}

function index(price, floor){
    return Math.round((price - floor) / 0.1);
}

function price_step_count(stock){
    return index(stock.ceilingPrice, stock.floorPrice) + 1;
}

function reduce_obj(stock){
    return [
        {'price': stock.bidPrice01, 'quantity': stock.bidQtty01},
        {'price': stock.bidPrice02, 'quantity': stock.bidQtty02},
        {'price': stock.bidPrice03, 'quantity': stock.bidQtty03},
        {'price': stock.offerPrice01, 'quantity': stock.offerQtty01},
        {'price': stock.offerPrice02, 'quantity': stock.offerQtty02},
        {'price': stock.offerPrice03, 'quantity': stock.offerQtty03}
    ];
}