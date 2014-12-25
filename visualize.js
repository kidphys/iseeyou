    function update(chart, data){
        var barWidth = width / data.length;

        var group = chart.selectAll('g') // select group
        .data(data)

        function addRect(group){
            bar.attr('class', function(d){return d.class;});
            bar.append('rect')
            .attr('y', function(d){return y(d.value)})
            .attr('height', function(d){ return height - y(d.value);})
            .attr('width', barWidth - 1);

            bar.append('text')
            .attr('x', barWidth / 2 + 10)
            .attr('y', function(d){return y(d.value) - 10;}) // scale value to auto-fit
            .attr('dy', '.75em')
            .text(function(d){return d.value;});
        }

        var bar = group.enter()
            .append('g')
            .attr('transform', function(d, i){
        return "translate(" + i * barWidth + ",0)"; // this is the property that translates the bar
        });

        addRect(bar);

        group.attr('class', function(d){return d.class;});
        group.select('rect').transition()
            .attr('y', function(d){return y(d.value)})
            .attr('height', function(d){ return height - y(d.value);})
        group.select('text').transition()
            .attr('x', barWidth / 2 + 10)
            .attr('y', function(d){return y(d.value) - 10;}) // anonymous works on each value
            .attr('dy', '.75em')
            .text(function(d){return d.value;});

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
     * @return {[type]}          [description]
     */
    function virtual_play(data, settings){
        var process = function(d){return d;}
        if (settings.process != null){
            process = settings.process;
        }

        var timeStep = settings.timeStep;
        var stock = process(data[0]);
        var now = moment(settings.start_time, settings.time_format);
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
                    now.add(timeStep, 'seconds');
                    return {
                        stock: null,
                        time: moment(now)
                    };
                }
            },
        };
        return iter;
    }