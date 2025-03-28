const totalBudget = 1080.0;
const categories = [
    { name: "Health", allocation: 190.1 },
    { name: "Education", allocation: 88.8 },
    { name: "Defence", allocation: 37.5 },
    { name: "Welfare", allocation: 251.0 },
    { name: "Public Order", allocation: 39.0 },
    { name: "Transport", allocation: 45.0 },
    { name: "Housing/Environment", allocation: 30.0 },
    { name: "Debt Interest", allocation: 83.0 },
    { name: "Other", allocation: 215.6 }
];

function render() {
    const sliderContainer = d3.select("#sliders");
    sliderContainer.html(""); // Clear any existing content

    categories.forEach((cat, index) => {
        const container = sliderContainer.append("div").attr("class", "slider-container");
        container.append("span").attr("class", "category-label").text(cat.name);
        container.append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", totalBudget)
            .attr("value", cat.allocation)
            .on("input", function () {
                updateAllocation(index, +this.value);
            });
        container.append("span")
            .attr("class", "budget-value")
            .attr("id", `value-${index}`)
            .text(`£${cat.allocation.toFixed(1)}`);
    });

    updateTotal();
}

function updateAllocation(changedIndex, newValue) {
    const oldValue = categories[changedIndex].allocation;
    const diff = newValue - oldValue;
    const others = categories.filter((_, i) => i !== changedIndex);
    const totalOther = others.reduce((sum, cat) => sum + cat.allocation, 0);

    // Scale down other allocations
    if (diff > 0 && totalOther > 0) {
        const scale = (totalOther - diff) / totalOther;
        others.forEach(cat => {
            cat.allocation *= scale;
        });
    }

    categories[changedIndex].allocation = newValue;
    normalize();
    render();
}

function normalize() {
    const sum = categories.reduce((acc, c) => acc + c.allocation, 0);
    const factor = totalBudget / sum;
    categories.forEach(cat => {
        cat.allocation *= factor;
    });
}

function updateTotal() {
    const total = categories.reduce((acc, cat) => acc + cat.allocation, 0);
    document.getElementById("total-allocated").innerText = total.toFixed(1);
    categories.forEach((cat, i) => {
        document.getElementById(`value-${i}`).innerText = `£${cat.allocation.toFixed(1)}`;
    });
}

render();