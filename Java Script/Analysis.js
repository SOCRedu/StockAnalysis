$(document).ready(function() {
	$("#submitStock").click(function(event) {
		event.preventDefault();
		clickSubmit();
	});
});

function clickSubmit() {
	stock = $("#stockSymbol").val();
	date_start = $("#date_start").val();
	date_end = $("#date_end").val();
	var stockArray = new Array();
	var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol ="'+stock+'" and startDate="'+date_start+'" and endDate="'+date_end+'"&format=json&env=store://datatables.org/alltableswithkeys';
	console.log(url);
	$.ajax({
    	url: url,
    	dataType: 'json',
    	// cache: false,
    	success: function(data) {
    		var quotes = data.query.results.quote;
            var dates = quotes.map(function (quote) {
                return quote.Date;
            });

            var opens = quotes.map(function (quote) {
                return quote.Open;
            });
            var highs = quotes.map(function (quote) {
                return quote.High;
            });
            var lows = quotes.map(function (quote) {
                return quote.Low;
            });
            var close = quotes.map(function (quote) {
                return quote.Close;
            });
            var volume = quotes.map(function (quote) {
                return quote.Volume;
            });
            var adj_close = quotes.map(function (quote) {
                return quote.Adj_Close;
            });
        // ============= data frequency ===============
    	if (data_freq === 'w') {
                // weekly data
                var days = [];
                for (i = 0; i < dates.length; i++) {
                    var date_temp = dates[i].split('-');
                    days.push(new Date(date_temp[0], Number(date_temp[1]) - 1, date_temp[2]).getDay());
                }

                var weekly_date = new Array;
                var weekly_open = new Array;
                var weekly_highs = new Array;
                var weekly_lows = new Array;
                var weekly_close = new Array;
                var weekly_volume = new Array;
                var weekly_adj_close = new Array;

                var temp_vol = new Array;
                var last = 0;

                for (i = 0; i < days.length; i++) {
                    temp_vol.push(volume[i]);
                    if (days.length == i + 1 || days[i + 1] > days[i]) {
                        weekly_date.push(dates[last]);
                        weekly_open.push(opens[last]);
                        weekly_highs.push(Math.max.apply(null, highs.slice(last, i + 1)));
                        weekly_lows.push(Math.min.apply(null, lows.slice(last, i + 1)));
                        weekly_close.push(close[i]);
                        weekly_adj_close.push(adj_close[i]);

                        var vol = 0;
                        for (var j = 0; j < temp_vol.length; j++) {
                            vol += parseFloat(temp_vol[j]);
                        }
                        weekly_volume.push(vol);
                        temp_vol = [];
                        last = i + 1;
                    }
                }
                /*
                console.log(weekly_date);
                console.log(weekly_open);
                console.log(weekly_highs);
                console.log(weekly_lows);
                console.log(weekly_close);
                console.log(weekly_volume);
                console.log(weekly_adj_close);
                */
                dates = weekly_date;
                opens = weekly_open;
                close = weekly_close;
                highs = weekly_highs;
                lows = weekly_lows;
                volume = weekly_volume;
                adj_close = weekly_adj_close;
            } else if(data_freq === 'm') {
                // Monthly Data
                var months = [];
                for(i = 0; i<dates.length;i++){
                    var date_temp = dates[i].split('-');
                    months.push(new Date(date_temp[0], Number(date_temp[1]) - 1, date_temp[2]).getMonth());
                }
                var monthly_date = new Array;
                var monthly_open = new Array;
                var monthly_highs = new Array;
                var monthly_lows = new Array;
                var monthly_close = new Array;
                var monthly_volume = new Array;
                var monthly_adj_close = new Array;

                var temp_vol = new Array;
                var last = 0;
                for (i = 0; i < months.length; i++) {
                    temp_vol.push(volume[i]);
                    if (months.length == i + 1 || months[i+1] < months[i]) {
                        monthly_date.push(dates[last]);
                        monthly_open.push(opens[last]);
                        monthly_highs.push(Math.max.apply(null, highs.slice(last, i+1)));
                        monthly_lows.push(Math.min.apply(null, lows.slice(last, i+1)));
                        monthly_close.push(close[i]);
                        monthly_adj_close.push(adj_close[i]);
                        var vol = 0;
                        for(var j = 0; j < temp_vol.length; j++) {
                            vol += parseFloat(temp_vol[j]);
                        }
                        monthly_volume.push(vol);
                        temp_vol = [];
                        last = i + 1;
                    }
                }
                /*
                console.log(monthly_date);
                console.log(monthly_open);
                console.log(monthly_highs);
                console.log(monthly_lows);
                console.log(monthly_close);
                console.log(monthly_volume);
                console.log(monthly_adj_close);
                */
                dates = monthly_date;
                opens = monthly_open;
                close = monthly_close;
                highs = monthly_highs;
                lows = monthly_lows;
                volume = monthly_volume;
                adj_close = monthly_adj_close;
            }

            console.log(JSON.stringify(dates, null, "\t"));
            console.log(JSON.stringify(opens, null, "\t"));
            console.log(JSON.stringify(highs, null, "\t"));
            console.log(JSON.stringify(lows, null, "\t"));
            console.log(JSON.stringify(close, null, "\t"));
            console.log(JSON.stringify(volume, null, "\t"));
            console.log(JSON.stringify(adj_close, null, "\t"));
    		
    	// Mean of Opens
            var opensTotal = 0;
    		for (var i = 0; i < opens.length; i++) {
    			opensTotal += opens[i] - 0;
    		}
    		var opensMean = opensTotal/opens.length;
    		document.getElementById("opensMean").innerHTML = "Opens Mean = " + opensMean.toFixed(2);
            // Mean of Highs
            var highsTotal = 0;
            for (var i = 0; i < highs.length; i++) {
                highsTotal += highs[i] - 0;
            }
            var highsMean = highsTotal/highs.length;
            document.getElementById("highsMean").innerHTML = "Highs Mean = " + highsMean.toFixed(2);
            // Mean of Lows
            var lowsTotal = 0;
            for (var i = 0; i < lows.length; i++) {
                lowsTotal += lows[i] - 0;
            }
            var lowsMean = lowsTotal/lows.length;
            document.getElementById("lowsMean").innerHTML = "Lows Mean = " + lowsMean.toFixed(2);
            // Mean of Volume
            var volumeTotal = 0;
            for (var i = 0; i < volume.length; i++) {
                volumeTotal += volume[i] - 0;
            }
            var volumeMean = volumeTotal/volume.length;
            document.getElementById("volumeMean").innerHTML = "Volume Mean = " + volumeMean.toFixed(0);
            // Mean of Adjusted Closes
            var adj_closeTotal = 0;
            var stockReturn = new Array();
            for (var i = 0; i < adj_close.length; i++) {
                adj_closeTotal += adj_close[i] - 0;
                if (i < (adj_close.length - 1)) {
                    stockReturn[i] = ((adj_close[i+1] - 0) - (adj_close[i] - 0))/(adj_close[i] - 0);
                }
            }
            var adj_closeMean = adj_closeTotal/adj_close.length;
            var sumReturn = 0;
            for (var i = 0; i < stockReturn.length; i++) {
                sumReturn += stockReturn[i] - 0;
            }
            var meanReturn = sumReturn/stockReturn.length;
            document.getElementById("adj_closeMean").innerHTML = "Adjusted Close Mean = " + adj_closeMean.toFixed(2);
            document.getElementById("meanReturn").innerHTML = "Mean Return = " + meanReturn;
    		// this.setState({data: data});
    	},
    	error: function(xhr, status, err) {
    		console.error(url, status, err.toString());
    	}

    });
}
