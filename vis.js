import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
    import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

    const tooltip = document.getElementById('tooltip');

    (async function () {
      const width = 960, height = 600;
      const svg = d3
        .select("#mapContainer")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      // Load world map
      const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
      const countries = feature(world, world.objects.countries).features;

      // Load CSV file
      const wideData = await d3.csv("total_number_of_dollar_billionaires.csv", d3.autoType);

      // Country name mapping
      const nameMap = {
        'USA': 'United States of America',
        'UK': 'United Kingdom',
        'South Korea': 'South Korea',
        'UAE': 'United Arab Emirates',
        'Hong Kong, China': 'China',
        'Taiwan': 'Taiwan',
        'Czech Republic': 'Czechia',
        'North Macedonia': 'North Macedonia',
        'Eswatini': 'eSwatini',
        'Congo, Dem. Rep.': 'Dem. Rep. Congo',
        'Congo, Rep.': 'Congo',
        'Cote d\'Ivoire': 'Côte d\'Ivoire',
        'Bosnia and Herzegovina': 'Bosnia and Herz.',
        'Central African Republic': 'Central African Rep.',
        'Dominican Republic': 'Dominican Rep.',
        'Equatorial Guinea': 'Eq. Guinea',
        'Solomon Islands': 'Solomon Is.',
        'South Sudan': 'S. Sudan',
        'Serbia excluding Kosovo': 'Serbia',
        'Netherlands Antilles': 'Netherlands'
      };

      // Reshape to long format
      const yearColumns = Object.keys(wideData[0]).filter(key => key !== 'country');
      const data = [];
      
      wideData.forEach(row => {
        const csvCountry = row.country;
        const mappedCountry = nameMap[csvCountry] || csvCountry;
        
        yearColumns.forEach(yearKey => {
          const value = row[yearKey] || 0;
          if (value > 0) {
            data.push({
              country: mappedCountry,
              year: +yearKey,
              billionaires: value
            });
          }
        });
      });

      const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

      // Create nested data structure
      const yearData = new Map();
      years.forEach(year => {
        const yearMap = new Map();
        data.filter(d => d.year === year).forEach(d => {
          yearMap.set(d.country, d.billionaires);
        });
        yearData.set(year, yearMap);
      });

      // Projection & path
      const projection = d3.geoNaturalEarth1()
        .scale(160)
        .translate([width / 2, height / 2]);
      const path = d3.geoPath(projection);

      // Color scale
      const maxVal = d3.max(data, d => d.billionaires);
      const color = d3.scaleSequential(d3.interpolateReds)
        .domain([0, maxVal]);

      // countries
      const countryPaths = svg.selectAll("path")
        .data(countries)
        .join("path")
        .attr("d", path)
        .attr("fill", "#eee")
        .attr("stroke", "#999")
        .attr("stroke-width", 0.5);

      // label
      const yearLabel = svg.append("text")
        .attr("x", width - 30)
        .attr("y", height - 40)
        .attr("text-anchor", "end")
        .attr("font-size", "64px")
        .attr("font-weight", "bold")
        .attr("fill", "#ddd")
        .attr("opacity", 0.3);

      // Update map function
      function updateMap(year) {
        const currentData = yearData.get(year);

        // Update colors
        countryPaths
          .transition()
          .duration(600)
          .attr("fill", d => {
            const name = d.properties.name;
            const value = currentData.get(name);
            return value ? color(value) : "#eee";
          });

        // Update year 
        yearLabel.text(year);

        // Update button states
        document.querySelectorAll(".year-btn").forEach(btn => {
          btn.classList.toggle("active", +btn.dataset.year === year);
        });

        // Setup hover events
        countryPaths
          .on("mouseenter", function(event, d) {
            const name = d.properties.name;
            const value = currentData.get(name) || 0;
            
            // Highlight 
            d3.select(this)
              .attr("stroke", "#000")
              .attr("stroke-width", 2)
              .raise();

            // tooltip
            tooltip.innerHTML = `
              <div class="country-name">${name}</div>
              <div>Billionaires: <span class="billionaire-count">${value}</span></div>
            `;
            tooltip.classList.add('visible');
          })
          .on("mousemove", function(event) {
            tooltip.style.left = (event.clientX + 15) + 'px';
            tooltip.style.top = (event.clientY + 15) + 'px';
          })
          .on("mouseleave", function() {
            // Reset country style
            d3.select(this)
              .attr("stroke", "#999")
              .attr("stroke-width", 0.5);

            // Hide tooltip
            tooltip.classList.remove('visible');
          });
      }

      // Button event listeners
      document.querySelectorAll(".year-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const year = +btn.dataset.year;
          updateMap(year);
        });
      });

      // Initial render
      updateMap(years[0]);

    })();


     function createSpiralArt() {
            const svg = d3.select("#spiralArt");
            const width = 300, height = 300;
            const centerX = width / 2, centerY = height / 2;

            // double spiral
            for (let spiral = 0; spiral < 2; spiral++) {
                const points = [];
                for (let i = 0; i < 300; i++) {
                    const angle = i * 0.15 + spiral * Math.PI;
                    const radius = i * 0.35;
                    points.push([
                        centerX + Math.cos(angle) * radius,
                        centerY + Math.sin(angle) * radius
                    ]);
                }

                const line = d3.line().curve(d3.curveBasis);
                
                const path = svg.append("path")
                    .datum(points)
                    .attr("d", line)
                    .attr("fill", "none")
                    .attr("stroke", spiral === 0 ? "#667eea" : "#764ba2")
                    .attr("stroke-width", 3)
                    .attr("stroke-dasharray", function() {
                        return this.getTotalLength();
                    })
                    .attr("stroke-dashoffset", function() {
                        return this.getTotalLength();
                    });

                path.transition()
                    .duration(3000)
                    .delay(spiral * 500)
                    .attr("stroke-dashoffset", 0);

                // animated circles along spiral
                for (let i = 0; i < points.length; i += 30) {
                    svg.append("circle")
                        .attr("cx", points[i][0])
                        .attr("cy", points[i][1])
                        .attr("r", 0)
                        .attr("fill", d3.interpolateSpectral(i / points.length))
                        .attr("opacity", 0.8)
                        .transition()
                        .duration(1000)
                        .delay(spiral * 500 + i * 10)
                        .attr("r", 4);
                }
            }
        }

         setTimeout(() => {
            createSpiralArt();
            
        }, 100);