    function addAxis(chart, width, height, prices){
        var barWidth = width / prices.length;
        var x = d3.scale.ordinal()
                .domain(prices)
                .rangeRoundBands([0 - barWidth/2, width - barWidth/2]);
                // .rangeBands([0 + barWidth/2, width+ barWidth/2]);
        var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
        chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height  + ')')
            .call(xAxis);
    }

    function update(chart, data){
        var barWidth = width / data.length;

        var group = chart.selectAll('.bar') // select group
        .data(data)

        var bar = group.enter()
            .append('g')
            .attr('transform', function(d, i){
                return "translate(" + i * barWidth + ",0)"; // this is the property that translates the bar
        });

        function addRect(group){
            group.attr('class', function(d){return 'bar ' + d.class;});
            group.append('rect')
            .attr('y', function(d){return y(d.value)})
            .attr('height', function(d){ return height - y(d.value);})
            .attr('width', barWidth - 1);

            group.append('text')
            .attr('x', barWidth / 2 + 10)
            .attr('y', function(d){return y(d.value) - 10;}) // scale value to auto-fit
            .attr('dy', '.75em')
            .text(function(d){if(d.value > 0) {return d.value;} else return '';});
        }


        addRect(bar);

        group.attr('class', function(d){return 'bar ' + d.class;});
        group.select('rect').transition().duration(300)
            .attr('y', function(d){return y(d.value)})
            .attr('height', function(d){ return height - y(d.value);})
        group.select('text').transition().duration(300)
            .attr('x', barWidth / 2 + 10)
            .attr('y', function(d){return y(d.value) - 10;}) // anonymous works on each value
            .attr('dy', '.75em')
            .text(function(d){if(d.value > 0) {return d.value;} else return '';});

        group.exit().remove();
    }


    /**
     * [virtual_play description]
     * @param  {[type]} data     [description]
     * @param  {[type]} settings
     *          .startTime: str time
                .timeFormat: used to parse start_time & data[i].time
                .timeStep: how much to move forward in seconds
                .process: optional function to process data before yield
                .breakTime: {start: '11:30', 90 } // minutes
     * @return {[type]}          [description]
     */
    function virtual_play(data, settings){
        var process = function(d){return d;}
        if (settings.process != null){
            process = settings.process;
        }

        var breakTime = settings.breakTime;

        var timeStep = settings.timeStep;
        var stock = process(data[0]);
        var now = moment(settings.startTime, settings.timeFormat);
        var i = 0;
        var iter = {
            next: function(){
                if (i >= data.length){
                    return {
                        stock: null,
                        time: moment(now)
                    };
                }

                chart.select('.time').text(now.format('hh:mm'));
                var ans = process(data[i]);
                if (moment(ans.time, 'hh:mm:ss') < now){
                    i++;
                    return {
                        stock: ans,
                        time: moment(now)
                    };
                }
                else{
                    // hack for passing noon time
                    if(now.format(breakTime.format) == breakTime.start){
                        now.add(breakTime.duration, 'minutes');
                    }
                    else{
                        now.add(timeStep, 'seconds');
                    }
                    return {
                        stock: null,
                        time: moment(now)
                    };
                }
            },
        };
        return iter;
    }