// [10:59:00 AM] khongthanhhoa: vix
// [10:59:02 AM] khongthanhhoa: pet
// [10:59:03 AM] khongthanhhoa: gtn
// [10:59:04 AM] khongthanhhoa: ssi
// [10:59:05 AM] khongthanhhoa: kbc
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
    return {
        'time': stock.time,
        'stock':[
            {'price': stock.bidPrice01, 'quantity': stock.bidQtty01, 'class': 'buy'},
            {'price': stock.bidPrice02, 'quantity': stock.bidQtty02, 'class': 'buy'},
            {'price': stock.bidPrice03, 'quantity': stock.bidQtty03, 'class': 'buy'},
            {'price': stock.offerPrice01, 'quantity': stock.offerQtty01, 'class': 'sell'},
            {'price': stock.offerPrice02, 'quantity': stock.offerQtty02, 'class': 'sell'},
            {'price': stock.offerPrice03, 'quantity': stock.offerQtty03, 'class': 'sell'}
        ]
    };
}