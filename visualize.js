    function update(data){
        var barWidth = width / data.length;

        var group = chart.selectAll('g') // select group
        .data(data)

        function addRect(group){

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
        group.select('rect')
            .attr('y', function(d){return y(d.value)})
            .attr('height', function(d){ return height - y(d.value);})
        group.select('text')
            .attr('x', barWidth / 2 + 10)
            .attr('y', function(d){return y(d.value) - 10;}) // anonymous works on each value
            .attr('dy', '.75em')
            .text(function(d){return d.value;});

        group.exit().remove();
    }
