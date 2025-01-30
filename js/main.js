$( document ).ready(function() {
    $("#get-stream").on("click", getStream);
    //barplot_new();
});

function getStream() {
    $("#output").empty()
    $("#output").append($("<div>", {"class": "start-char"}).text(">"));
    var query = $("#chat-input textarea").val();
    let current_chunk_idx = 0;
    //var obj = JSON.parse('{"texts": [" language", " computer", " large", " machine", " artificial", " convers", " neutral", " Language", " virtual", " model", " AI", " text", " general", " few", " chat", " digital", " tool", " simulator", " knowledge", " simulation", " random", " small", "Language", " cloud", " Computer", " vocabulary", " regular", " new", " software", " high"], "token_ids": [4221, 6500, 3544, 5780, 21075, 7669, 21277, 11688, 4200, 1646, 15592, 1495, 4689, 2478, 6369, 7528, 5507, 42991, 6677, 19576, 4288, 2678, 14126, 9624, 17863, 36018, 5912, 502, 3241, 1579], "probs": [0.7770468592643738, 0.21096745133399963, 0.008808881975710392, 0.0011465136194601655, 0.0002181360760005191, 0.00020011013839393854, 0.00016280323325190693, 0.00014177054981701076, 0.0001345007767667994, 0.000130185711896047, 0.00012971069372724742, 0.00010374825797043741, 8.20313289295882e-05, 7.384506898233667e-05, 6.564196519320831e-05, 6.458257121266797e-05, 5.7273053243989125e-05, 4.999424345442094e-05, 4.7059573262231424e-05, 4.5079923438606784e-05, 4.303768218960613e-05, 4.110042209504172e-05, 3.8817244785605e-05, 3.6033306969329715e-05, 3.040168303414248e-05, 2.7615524231805466e-05, 2.736878377618268e-05, 2.733159089984838e-05, 2.678219971130602e-05, 2.5384848413523287e-05], "selected_idx": 0, "selected_text": " language"}')
    //console.log(obj)
    $.ajax({
        method: "POST",
        dataType: 'text',
        url: "https://llm-viz.users.hsrn.nyu.edu/generate?init_prompt="+query+"&k=30&T=2.0&max_new_tokens=100&verbose=false",
        crossDomain: true,
        xhrFields: {
            onprogress: function (event) {
                let chunk = event.currentTarget.responseText; //.responseText;
                let chunks = chunk.split("}\n");
                //console.log(chunks.length);
                //console.log(chunks);
                for (let i = current_chunk_idx; i < chunks.length; i++) {
                    //console.log("--START--")
                    
                    let current_chunk = chunks[i];

                    if (current_chunk.slice(0,1) != "{") {
                        current_chunk = "{" + current_chunk;
                    }
                    if (current_chunk.slice(-1) != "}") {
                        current_chunk = current_chunk + "}";
                    }

                    var obj = JSON.parse(current_chunk);
                    console.log(obj)
                    build(obj)
                    
                    //console.log("--END--")
                }
                current_chunk_idx = chunks.length-1;
                //console.log(myArray)
                //let current_chunk = chunk.slice(current_chunk_idx);
                //console.log(current_chunk);
                //var obj = JSON.parse(current_chunk);
                //console.log(obj);
                //current_chunk_idx = current_chunk_idx + current_chunk.length;
                //console.log(event.currentTarget)
                
                //console.log("Received chunk:", chunk);
            }
        }
    })
}

async function build(obj) {
    texts = obj['texts'];
    probs = obj['probs'];
    uncertainty = (1 - obj['probs'][obj['selected_idx']].toFixed(2));
    const data = texts.map((value, index) => ({ text: value, prob: probs[index].toFixed(2) }));
    $("#output").append($("<div>", {"class": "text", "data-obj": JSON.stringify(data)})
                .on("click", function() {
                    $(".selected").removeClass("selected")
                    $(this).addClass("selected")
                    d = JSON.parse($(this).attr('data-obj'));
                    barplot_new(d)
                })
                .text(obj['selected_text'])
                .css("background-color", "rgba(231, 76, 60," + uncertainty + ")")
    );
}

function isObject(obj)
{
    return obj !== undefined && obj !== null && obj.constructor == Object;
}

function handleData(data) {
    console.log("here3")
    console.log(data);
    //do some stuff
}

function barplot_new(data) {
    $('#barplot').empty()
    // Data for the chart
    
    /*
    const texts = [
        "<|eot_id|>",
        " Is",
        " Would",
        " \n\n",
        "<|start_header_id|>",
        "<|eom_id|>",
        " Are",
        " Want",
        "<|end_header_id|>",
        " Do",
        " Anything",
        " I",
        " Have",
        " is",
        "Would",
        " Any",
        "�",
        " would",
        " \n \n",
        " \r\n\r\n",
        "Is",
        "Want",
        "<|python_tag|>",
        " �",
        " Feel",
        " What",
        "\r\n\r\n",
        "-is",
        " Got",
        " muốn"
    ];

    const probs = [
        0.9999943971633911,
        0.000003644056278062635,
        7.903012146925903e-7,
        6.352962031996867e-7,
        1.7905959737163357e-7,
        8.772327220185616e-8,
        6.836848598368306e-8,
        4.5886864086241985e-8,
        3.4439658236351534e-8,
        3.4121494962846555e-8,
        1.6603120656100145e-8,
        1.1393356480482453e-8,
        9.595376049276183e-9,
        9.006047463344657e-9,
        5.610079067963625e-9,
        5.243231182561203e-9,
        5.231882482803485e-9,
        5.163941274588524e-9,
        4.31047242344107e-9,
        3.691086769563867e-9,
        3.0099120973403615e-9,
        2.3229536072477686e-9,
        1.8521474354216139e-9,
        1.8294732395673918e-9,
        1.654216874591441e-9,
        1.4416781102255527e-9,
        1.3751920713289678e-9,
        1.1097607277577026e-9,
        1.0690127671963978e-9,
        1.0616165724286475e-9
    ];
    */

    //const data = texts.map((value, index) => ({ text: value, prob: probs[index].toFixed(2) }));
    //console.log(data)
    /*
    const data = [
        { name: 'Category A', value: 0.99 },
        { name: 'Category B', value: 0 },
        { name: 'Category C', value: 0 },
        { name: 'Category D', value: 0 },
        { name: 'Category E', value: 0 },
        { name: 'Category F', value: 0 },
        { name: 'Category G', value: 0 },
        { name: 'Category H', value: 1.0616165724286475e-9 }
    ];
    */
    //console.log(data2)
    //const format = x.tickFormat(20, "%");
    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 260 - margin.left - margin.right;
    const height = 580 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('#barplot')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr("fill", "white");

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.prob)])
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.text))
        .range([0, height])
        .padding(0.1);
        
    // Add X-axis
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .selectAll('text')
        .attr("fill", "none");
        
    // Add Y-axis
    svg.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .attr("fill", "#f5f6fa");
        
    // Draw bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.text))
        .attr('x', 0)
        .attr('height', yScale.bandwidth())
        .attr('width', d => xScale(d.prob))
        .attr("fill", "white");

    // Add labels inside the bars
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.prob) - 5)
        .attr('y', d => yScale(d.text) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('dx', '8px')
        .text(d => d.prob)
        .attr("fill", "white");
}

// https://d3-graph-gallery.com/graph/barplot_horizontal.html
function barplot(data) {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 280 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barplot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data) {
        
        console.log(data)
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 13000])
            .range([ 0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(data.map(function(d) { return d.Country; }))
            .padding(.1);

        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("class", "y-axis")

        //Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0) )
            .attr("y", function(d) { return y(d.Country); })
            .attr("width", function(d) { return x(d.Value); })
            .attr("height", y.bandwidth() )
            .attr("fill", "#69b3a2")


            // .attr("x", function(d) { return x(d.Country); })
            // .attr("y", function(d) { return y(d.Value); })
            // .attr("width", x.bandwidth())
            // .attr("height", function(d) { return height - y(d.Value); })
            // .attr("fill", "#69b3a2")

        $(".y-axis .tick").on( "click", function() {
            var text = $(this).text()
            console.log(isNumber(text))
            alert( text );
        });

    })

}

function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function clickMe(){alert("I've been clicked!")}
